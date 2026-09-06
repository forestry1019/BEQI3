/* Cloud Function: computeBeqi
 * -----------------------------------------------------------------------
 * รับรูปหลายเหลี่ยม (พิกัดที่ผู้ใช้วาดบนแผนที่ในหน้า explore.html) แล้วคำนวณตัวชี้วัด BEQI ทั้ง 4 สด
 * จากภาพดาวเทียมผ่าน Google Earth Engine — รันภายใต้ "service account" ของ Cloud Function เอง
 * (Application Default Credentials) ผู้ใช้ปลายทางจึงไม่ต้องล็อกอิน Google Earth Engine เองเลย
 *
 * ก่อน deploy ต้อง:
 *   1) เปิดใช้ Earth Engine API บนโปรเจกต์ Cloud นี้ (เช่น beqi-488814)
 *   2) ให้ service account ที่ฟังก์ชันนี้รันอยู่ (ปกติคือ
 *      PROJECT_NUMBER-compute@developer.gserviceaccount.com สำหรับ default compute SA
 *      หรือ service account ที่ระบุด้วย --service-account ตอน deploy)
 *      ได้สิทธิ์ Earth Engine โดยลงทะเบียนที่ https://code.earthengine.google.com/register
 *      เลือก "Service account" แล้วกรอกอีเมลของ service account นั้น
 *      และให้ IAM role "Earth Engine Resource Viewer" (roles/earthengine.viewer) บนโปรเจกต์ด้วย
 *   3) ตั้งค่า environment variable BEQI_API_SECRET เป็นรหัสลับที่จะแจกให้ผู้ใช้กลุ่มเล็ก
 *      (ดู README ในโฟลเดอร์นี้สำหรับคำสั่ง deploy แบบเต็ม)
 *
 * หมายเหตุด้านความปลอดภัย: BEQI_API_SECRET เป็นเพียงตัวกันการเรียกใช้พร่ำเพรื่อโดยคนทั่วไป
 * ไม่ใช่กลไกความปลอดภัยที่แท้จริง เพราะค่าที่ฝั่ง frontend ส่งมาจะมองเห็นได้เสมอผ่าน view-source/network tab
 * เหมาะสำหรับ "แจกรหัสให้ผู้ใช้กลุ่มเล็กที่รู้จักกัน" เท่านั้น ไม่ใช่การป้องกันผู้ประสงค์ร้ายจริงจัง
 */
const functions = require('@google-cloud/functions-framework');
const {GoogleAuth} = require('google-auth-library');
const ee = require('@google/earthengine');
const {Firestore} = require('@google-cloud/firestore');
const {Storage} = require('@google-cloud/storage');
const crypto = require('crypto');
const PARAMS = require('./params.json');

const EE_CLOUD_PROJECT = process.env.GEE_CLOUD_PROJECT || 'beqi-488814';
const API_SECRET = process.env.BEQI_API_SECRET || '';
const EVALUATOR_ACCESS_CODE = process.env.EVALUATOR_ACCESS_CODE || '';
const SUBMISSIONS_BUCKET = process.env.SUBMISSIONS_BUCKET || 'beqi-488814-submissions';
// จำกัดขนาดกรอบพื้นที่ที่ยอมรับ (องศา) กันการวาดพื้นที่ใหญ่เกินสมควร (~0.3° ราว ๆ 30 กม.) — ปรับได้ตามความเหมาะสม
const MAX_BBOX_DEG = 0.3;
const ALLOWED_ORIGIN = process.env.BEQI_ALLOWED_ORIGIN || '*';
const VERTEX_PROJECT = process.env.VERTEX_PROJECT || EE_CLOUD_PROJECT;
const VERTEX_LOCATION = process.env.VERTEX_LOCATION || 'us-central1';
const VERTEX_MODEL = process.env.VERTEX_MODEL || 'gemini-2.5-flash';

const firestore = new Firestore();
const storage = new Storage();
const SUBMISSIONS_COL = 'submissions';

const auth = new GoogleAuth({scopes: ['https://www.googleapis.com/auth/earthengine']});
let eeInitPromise = null;
let eeTokenExpiry = 0;

const vertexAuth = new GoogleAuth({scopes: ['https://www.googleapis.com/auth/cloud-platform']});

function initEE(){
  const now = Date.now();
  if(eeInitPromise && now < eeTokenExpiry) return eeInitPromise;
  eeInitPromise = (async () => {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    eeTokenExpiry = now + 50 * 60 * 1000; // รีเฟรชทุก ~50 นาที (token จริงอายุ ~60 นาที)
    await new Promise((resolve, reject) => {
      ee.data.setAuthToken('', 'Bearer', tokenResponse.token, 3600, [], () => {
        ee.initialize(null, null, resolve, reject, null, EE_CLOUD_PROJECT);
      }, false);
    });
  })();
  return eeInitPromise;
}

function safeGet(dict, key){
  return ee.Algorithms.If(dict.contains(key), dict.get(key), 0);
}

function isValidPolygon(polygon){
  if(!Array.isArray(polygon) || polygon.length < 3 || polygon.length > 500) return false;
  let minLng=Infinity, maxLng=-Infinity, minLat=Infinity, maxLat=-Infinity;
  for(const pt of polygon){
    if(!Array.isArray(pt) || pt.length !== 2) return false;
    const [lng, lat] = pt;
    if(typeof lng !== 'number' || typeof lat !== 'number' || !isFinite(lng) || !isFinite(lat)) return false;
    if(lng < -180 || lng > 180 || lat < -90 || lat > 90) return false;
    minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
  }
  if((maxLng - minLng) > MAX_BBOX_DEG || (maxLat - minLat) > MAX_BBOX_DEG) return false;
  return true;
}

function computeIndicators(polygon){
  const ring = polygon.map(([lng, lat]) => [lng, lat]);
  ring.push(ring[0]);
  const poly = ee.Geometry.Polygon([ring]);

  const s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate(PARAMS.date_from, PARAMS.date_to).filterBounds(poly)
    .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', PARAMS.cloud_filter_pct)).median();
  const ndvi = s2.normalizedDifference(['B8', 'B4']).rename('ndvi');
  const wc = ee.ImageCollection('ESA/WorldCover/v200').first().select('Map');
  const land = wc.neq(80).rename('land');
  const water = wc.eq(80).rename('water');
  const greenLand = ndvi.gte(PARAMS.ndvi_threshold).and(land).rename('green');

  const ind1 = greenLand.updateMask(land).reduceRegion(
    {reducer: ee.Reducer.mean(), geometry: poly, scale: PARAMS.scale_m, maxPixels: 1e9, bestEffort: true});

  const patch = greenLand.selfMask().connectedPixelCount({maxSize: 256, eightConnected: true});
  const ind2 = patch.reduceRegion(
    {reducer: ee.Reducer.mean(), geometry: poly, scale: PARAMS.scale_m, maxPixels: 1e9, bestEffort: true});

  const dist = water.fastDistanceTransform(256).sqrt().multiply(PARAMS.scale_m);
  const within = dist.lte(800).rename('w800');
  const ind3 = within.updateMask(land).reduceRegion(
    {reducer: ee.Reducer.mean(), geometry: poly, scale: PARAMS.scale_m, maxPixels: 1e9, bestEffort: true});

  const ind4sd = ndvi.updateMask(land).reduceRegion(
    {reducer: ee.Reducer.stdDev(), geometry: poly, scale: PARAMS.scale_m, maxPixels: 1e9, bestEffort: true});

  const combined = ee.Dictionary({
    g: safeGet(ind1, 'green'), p: safeGet(ind2, 'green'), w: safeGet(ind3, 'w800'),
    sd: safeGet(ind4sd, 'ndvi'), area: poly.area(1)
  });

  return new Promise((resolve, reject) => {
    combined.evaluate((r, err) => err ? reject(err) : resolve(r));
  });
}

function setCors(res, methods){
  res.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.set('Access-Control-Allow-Methods', methods || 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, X-Evaluator-Code');
}

functions.http('computeBeqi', async (req, res) => {
  setCors(res);
  if(req.method === 'OPTIONS'){ res.status(204).send(''); return; }
  if(req.method !== 'POST'){ res.status(405).json({error: 'Method not allowed'}); return; }

  const {polygon, secret} = req.body || {};
  if(!API_SECRET || secret !== API_SECRET){
    res.status(401).json({error: 'Invalid or missing access code'});
    return;
  }
  if(!isValidPolygon(polygon)){
    res.status(400).json({error: 'Invalid polygon — expected an array of at least 3 [lng, lat] points within a reasonable bounding box'});
    return;
  }

  try{
    await initEE();
    const result = await computeIndicators(polygon);
    res.status(200).json(result);
  }catch(err){
    console.error('computeBeqi error:', err);
    res.status(500).json({error: 'Earth Engine computation failed', detail: String(err && err.message ? err.message : err)});
  }
});

/* -----------------------------------------------------------------------
 * submitApplication / checkStatus / listSubmissions / updateSubmission
 * -----------------------------------------------------------------------
 * เก็บใบสมัครขอรับรองของผู้ประกอบการไว้ใน Firestore แทน localStorage ของเบราว์เซอร์
 * (ต้นแบบเดิมใช้ localStorage ทำให้ผู้ประกอบการกับผู้ประเมินที่อยู่คนละเครื่อง/เบราว์เซอร์กัน
 * ไม่เห็นข้อมูลเดียวกัน) รูปถ่ายหลักฐานถูกอัปโหลดขึ้น Cloud Storage bucket แยกต่างหาก
 * (เก็บเฉพาะ URL ไว้ใน Firestore เพื่อไม่ให้เอกสารใหญ่เกินขีดจำกัด 1MiB ของ Firestore)
 *
 * ผู้ประกอบการจะได้รับเลขที่ใบสมัคร (id) + PIN 6 หลักกลับไปตอนส่งสำเร็จ ใช้ทั้งคู่ตรวจสอบผลได้เอง
 * ภายหลังโดยไม่ต้องล็อกอิน (checkStatus) — ฝั่งผู้ประเมินต้องส่ง header X-Evaluator-Code ที่ตรงกับ
 * EVALUATOR_ACCESS_CODE จึงจะเรียก listSubmissions/updateSubmission ได้ (ตัวกันการเรียกพร่ำเพรื่อ
 * เท่านั้น ไม่ใช่กลไกความปลอดภัยจริงจัง เช่นเดียวกับ BEQI_API_SECRET ด้านบน) */

const ID_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ตัดตัวที่สับสนกันง่าย (0/O, 1/I) ออก
function genId(){
  let s = '';
  for(let i = 0; i < 6; i++) s += ID_ALPHABET[crypto.randomInt(ID_ALPHABET.length)];
  return 'BQ-' + s;
}
function genPin(){
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

function isFiniteNum(v){ return typeof v === 'number' && isFinite(v); }

// Firestore ไม่รองรับ array ซ้อน array — เก็บรูปหลายเหลี่ยมเป็น array ของ {lng,lat} แทน [lng,lat]
// แล้วแปลงกลับเป็น [lng,lat] ตอนส่งคืนให้ frontend (รูปแบบเดิมที่ picker.js/evaluator-dashboard.js ใช้)
function ringToFirestore(ring){ return ring.map(([lng, lat]) => ({lng, lat})); }
function ringFromFirestore(ring){ return (ring || []).map(p => [p.lng, p.lat]); }

function validateSubmissionPayload(b){
  if(!b || typeof b !== 'object') return 'Missing body';
  if(!b.businessName || !b.repName || !b.contactPerson || !b.email || !b.taxId || !b.phone || !b.zoneId) return 'Missing required applicant fields';
  if(!isValidPolygon(b.polygon)) return 'Invalid polygon';
  if(!Array.isArray(b.norm) || b.norm.length !== 4 || !b.norm.every(v => isFiniteNum(v) && v >= 0 && v <= 1)) return 'Invalid norm array';
  if(!isFiniteNum(b.overall) || b.overall < 0 || b.overall > 100) return 'Invalid overall score';
  if(!isFiniteNum(b.ind4Raw) || b.ind4Raw < 0 || b.ind4Raw > 28) return 'Invalid ind4Raw';
  if(!Array.isArray(b.patternScores) || b.patternScores.length !== 14) return 'Invalid patternScores';
  if(!Array.isArray(b.photos) || b.photos.length < 1 || b.photos.length > 6) return 'Attach between 1 and 6 photos';
  for(const p of b.photos){ if(typeof p !== 'string' || !/^data:image\/(jpeg|jpg|png|webp);base64,/.test(p)) return 'Invalid photo data URL'; }
  return null;
}

async function uploadPhotos(id, photos){
  const bucket = storage.bucket(SUBMISSIONS_BUCKET);
  const urls = [];
  for(let i = 0; i < photos.length; i++){
    const match = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/.exec(photos[i]);
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buf = Buffer.from(match[2], 'base64');
    if(buf.length > 8 * 1024 * 1024) throw new Error('Photo ' + (i + 1) + ' exceeds 8MB');
    const objectPath = 'submissions/' + id + '/' + (i + 1) + '-' + Date.now() + '.' + ext;
    const file = bucket.file(objectPath);
    await file.save(buf, {contentType: 'image/' + (ext === 'jpg' ? 'jpeg' : ext), resumable: false});
    urls.push('https://storage.googleapis.com/' + SUBMISSIONS_BUCKET + '/' + objectPath);
  }
  return urls;
}

functions.http('submitApplication', async (req, res) => {
  setCors(res);
  if(req.method === 'OPTIONS'){ res.status(204).send(''); return; }
  if(req.method !== 'POST'){ res.status(405).json({error: 'Method not allowed'}); return; }

  const body = req.body || {};
  if(!API_SECRET || body.secret !== API_SECRET){
    res.status(401).json({error: 'Invalid or missing access code'});
    return;
  }
  const err = validateSubmissionPayload(body);
  if(err){ res.status(400).json({error: err}); return; }

  try{
    const id = genId();
    const pin = genPin();
    const photoUrls = await uploadPhotos(id, body.photos);
    const doc = {
      id, pin,
      businessName: body.businessName, repName: body.repName, contactPerson: body.contactPerson, email: body.email,
      taxId: body.taxId, phone: body.phone, zoneId: body.zoneId,
      polygon: ringToFirestore(body.polygon), overall: body.overall, norm: body.norm,
      ind4Source: 'assessed', ind4Raw: body.ind4Raw, ind4AssessedPatterns: 14,
      patternScores: body.patternScores, photos: photoUrls,
      status: 'pending', certLevel: null,
      createdAt: new Date().toISOString()
    };
    await firestore.collection(SUBMISSIONS_COL).doc(id).set(doc);
    res.status(200).json({id, pin});
  }catch(e){
    console.error('submitApplication error:', e);
    res.status(500).json({error: 'Failed to save submission', detail: String(e && e.message ? e.message : e)});
  }
});

functions.http('checkStatus', async (req, res) => {
  setCors(res, 'GET, OPTIONS');
  if(req.method === 'OPTIONS'){ res.status(204).send(''); return; }
  if(req.method !== 'GET'){ res.status(405).json({error: 'Method not allowed'}); return; }

  const id = String(req.query.id || '').trim().toUpperCase();
  const pin = String(req.query.pin || '').trim();
  if(!id || !pin){ res.status(400).json({error: 'Missing id or pin'}); return; }

  try{
    const snap = await firestore.collection(SUBMISSIONS_COL).doc(id).get();
    if(!snap.exists || snap.data().pin !== pin){
      res.status(404).json({error: 'No submission found for that ID and PIN'});
      return;
    }
    const {pin: _pin, ...sub} = snap.data();
    sub.polygon = ringFromFirestore(sub.polygon);
    res.status(200).json(sub);
  }catch(e){
    console.error('checkStatus error:', e);
    res.status(500).json({error: 'Failed to look up submission'});
  }
});

function checkEvaluatorAuth(req, res){
  const code = req.get('X-Evaluator-Code') || '';
  if(!EVALUATOR_ACCESS_CODE || code !== EVALUATOR_ACCESS_CODE){
    res.status(401).json({error: 'Invalid or missing evaluator access code'});
    return false;
  }
  return true;
}

functions.http('listSubmissions', async (req, res) => {
  setCors(res, 'GET, OPTIONS');
  if(req.method === 'OPTIONS'){ res.status(204).send(''); return; }
  if(req.method !== 'GET'){ res.status(405).json({error: 'Method not allowed'}); return; }
  if(!checkEvaluatorAuth(req, res)) return;

  try{
    const snap = await firestore.collection(SUBMISSIONS_COL).orderBy('createdAt', 'desc').get();
    const subs = snap.docs.map(d => { const {pin, ...rest} = d.data(); rest.polygon = ringFromFirestore(rest.polygon); return rest; });
    res.status(200).json(subs);
  }catch(e){
    console.error('listSubmissions error:', e);
    res.status(500).json({error: 'Failed to list submissions'});
  }
});

/* -----------------------------------------------------------------------
 * aiDraftPatterns — ตัวช่วยร่างคำตอบตัวชี้วัดที่ 4 (14 Patterns of Biophilic Design) จากรูปถ่าย
 * -----------------------------------------------------------------------
 * หลักการออกแบบ (ต้องอ่านคู่กับบทระเบียบวิธีของดุษฎีนิพนธ์):
 *
 *  1) AI ให้คำตอบได้เฉพาะรูปแบบที่ "onsite:false" เท่านั้น (10 จาก 14 ข้อ) — 4 ข้อที่เหลือ
 *     (Non-Visual Connection, Connection to Natural Systems, Mystery, Risk/Peril) ต้องใช้ประสาทสัมผัส
 *     หลายทางหรือประสบการณ์เชิงพื้นที่ที่ภาพนิ่งบอกไม่ได้ AI จะไม่ถูกขอให้ประเมิน 4 ข้อนี้เด็ดขาด
 *     (ดูตาราง AI_PATTERNS ด้านล่าง — คัด n ออกจาก [2,7,13,14] โดยตั้งใจ)
 *  2) คำตอบจาก AI เป็น "ร่าง" (draft) เท่านั้น ไม่ใช่คะแนนที่ยืนยันแล้ว — ฝั่ง frontend บังคับให้
 *     ผู้ขอรับรองต้องตรวจทาน/แก้ไขเองก่อนส่ง (self-report ยังเป็นเจ้าของคำตอบสุดท้ายเสมอ)
 *     และผู้ประเมินยังคงตรวจรูป+อนุมัติแยกต่างหากตามระบบเดิม — AI จึงเป็นแค่ชั้นช่วยร่างก่อนชั้น
 *     ตรวจสอบของมนุษย์ 2 ชั้น (self-report → expert audit) ไม่ใช่การตัดสินแทน
 *  3) เกณฑ์ที่ป้อนให้ AI เป็นข้อความเดียวกันตัวต่อตัวกับที่แสดงให้ผู้ขอรับรองและผู้ประเมินเห็น
 *     (ตารางที่ 4/5 ของดุษฎีนิพนธ์ อ้างอิง Browning et al., 2014; Kellert & Calabrese, 2015)
 *     ไม่ได้แต่งเกณฑ์ใหม่ให้ AI คนละชุดกับที่มนุษย์ใช้ — ทำให้เทียบคะแนน AI กับคะแนนสุดท้ายที่ยืนยันแล้ว
 *     ในภายหลังได้อย่างสมเหตุสมผล (inter-rater agreement ระหว่าง AI กับมนุษย์)
 *  4) temperature=0 และ responseSchema (structured output) — ลด run-to-run variance และบังคับรูปแบบ
 *     คำตอบให้ตรวจสอบ/แปลงกลับเป็นข้อมูลได้เสมอ (ไม่ใช่ free-text ที่ parse ไม่ได้)
 *  5) โมเดลถูกกำชับให้ให้คะแนนต่ำไว้ก่อนเมื่อหลักฐานไม่ชัดเจน (conservative scoring) และให้ระบุ
 *     confidence ต่อข้อ — ข้อที่ AI ตอบ confidence "low" ควรถูกเน้นให้ผู้ขอรับรอง/ผู้ประเมินตรวจซ้ำ
 *
 * ก่อน deploy ต้องเพิ่มเติมจากขั้นตอนของ computeBeqi (ดู server/README.md หัวข้อ 6):
 *   1) เปิดใช้ Vertex AI API บนโปรเจกต์นี้: gcloud services enable aiplatform.googleapis.com
 *   2) ให้ IAM role "roles/aiplatform.user" กับ service account เดียวกับที่ใช้รัน Cloud Function
 *   3) หมายเหตุต้นทุน: ต่างจาก Earth Engine (ฟรีสำหรับงานไม่แสวงกำไร) — การเรียก Gemini ผ่าน Vertex AI
 *      "มีค่าใช้จ่ายต่อ request จริง" ตามราคาปัจจุบันของ Google Cloud ควรตั้ง --max-instances ต่ำไว้
 */

// 10 รูปแบบที่ประเมินจากภาพถ่ายได้ (ตัด onsite:true คือ n=2,7,13,14 ออกโดยตั้งใจ — ดูหมายเหตุข้อ 1 ด้านบน)
const AI_PATTERNS = [
  {n: 1, en: 'Visual Connection with Nature', c: [
    'No vegetation or water body visible in the frame',
    'Vegetation as a decorative border, covering less than 1/4 of the frame',
    'Vegetation or water covers more than half the frame, visible from the main use area']},
  {n: 3, en: 'Non-Rhythmic Sensory Stimuli', c: [
    'No naturally moving elements found',
    'Leaf shadows or plant movement visible in frame',
    'Natural moving element at a position where users linger']},
  {n: 4, en: 'Thermal & Airflow Variability', c: [
    'Enclosed building, no openings',
    'Openings or louvers allowing airflow',
    'Deliberate shade/airflow design creating perceptible temperature contrast']},
  {n: 5, en: 'Presence of Water', c: [
    'No water body found',
    'Small or temporary water feature',
    'Permanent water body continuously visible from the main use area']},
  {n: 6, en: 'Dynamic & Diffuse Light', c: [
    'Uniform artificial lighting throughout',
    'Natural light filtering in some areas',
    'Light filtered through canopy or louvers in the main use area']},
  {n: 8, en: 'Biomorphic Forms & Patterns', c: [
    'All straight lines and right angles',
    'Curves in secondary elements, e.g. a pavilion or walkway',
    'Curves or spiral (Fibonacci) proportions in the main building structure']},
  {n: 9, en: 'Material Connection with Nature', c: [
    'Main structure entirely synthetic materials',
    'Local materials used as surface decoration',
    'Minimally-processed local materials in the main structure, e.g. logs, natural stone, thatch roof']},
  {n: 10, en: 'Complexity & Order', c: [
    'Smooth surface, no pattern',
    'Repeating pattern in a single plane',
    'Fractal-like geometric pattern with hierarchy across two or more planes']},
  {n: 11, en: 'Prospect', c: [
    'Visibility blocked in all directions',
    'Visibility open up to 6 metres',
    'Elevated deck/terrace opening visibility beyond 6 metres']},
  {n: 12, en: 'Refuge', c: [
    'No area protected from above and behind',
    'Roofed but open on all sides',
    'Pavilion/alcove protected above and behind, with seating']}
];

function buildAiPrompt(){
  const rubricText = AI_PATTERNS.map(p =>
    p.n + '. ' + p.en + '\n   0 = ' + p.c[0] + '\n   1 = ' + p.c[1] + '\n   2 = ' + p.c[2]
  ).join('\n\n');
  return 'You are assisting a trained evaluator in scoring a tourism property against the "14 Patterns of ' +
    'Biophilic Design" instrument (Browning et al., 2014; Kellert & Calabrese, 2015), as adapted in this ' +
    'research\'s indicator 4 (biophilic composition) rubric. You are given photographs submitted by the ' +
    'property owner. For EACH of the following patterns, choose the score (0, 1, or 2) whose description ' +
    'best matches ONLY what is physically visible in the photographs — never assume, infer, or guess ' +
    'anything not directly observable. If the evidence is ambiguous or insufficient to distinguish between ' +
    'two scores, choose the LOWER of the two and set confidence to "low". Write "evidence" as one short ' +
    'factual sentence citing the specific visual detail you based the score on (or stating what is missing ' +
    'if you scored 0). Do not evaluate any pattern not listed below.\n\n' + rubricText;
}

const AI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    drafts: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          n: {type: 'INTEGER'},
          score: {type: 'INTEGER'},
          evidence: {type: 'STRING'},
          confidence: {type: 'STRING', enum: ['low', 'medium', 'high']}
        },
        required: ['n', 'score', 'evidence', 'confidence']
      }
    }
  },
  required: ['drafts']
};

async function callVertexGemini(photoDataUrls){
  const client = await vertexAuth.getClient();
  const tokenResponse = await client.getAccessToken();
  const url = 'https://' + VERTEX_LOCATION + '-aiplatform.googleapis.com/v1/projects/' + VERTEX_PROJECT +
    '/locations/' + VERTEX_LOCATION + '/publishers/google/models/' + VERTEX_MODEL + ':generateContent';

  const imageParts = photoDataUrls.map(dataUrl => {
    const match = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/.exec(dataUrl);
    if(!match) throw new Error('Invalid photo data URL');
    const mime = match[1] === 'jpeg' || match[1] === 'jpg' ? 'image/jpeg' : 'image/' + match[1];
    return {inlineData: {mimeType: mime, data: match[2]}};
  });

  const body = {
    contents: [{role: 'user', parts: [{text: buildAiPrompt()}, ...imageParts]}],
    generationConfig: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseSchema: AI_RESPONSE_SCHEMA
    }
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + tokenResponse.token},
    body: JSON.stringify(body)
  });
  if(!resp.ok){
    const text = await resp.text();
    throw new Error('Vertex AI request failed (' + resp.status + '): ' + text.slice(0, 500));
  }
  const json = await resp.json();
  const textOut = json.candidates && json.candidates[0] && json.candidates[0].content &&
    json.candidates[0].content.parts && json.candidates[0].content.parts[0] &&
    json.candidates[0].content.parts[0].text;
  if(!textOut) throw new Error('Vertex AI returned no content');
  return JSON.parse(textOut);
}

functions.http('aiDraftPatterns', async (req, res) => {
  setCors(res);
  if(req.method === 'OPTIONS'){ res.status(204).send(''); return; }
  if(req.method !== 'POST'){ res.status(405).json({error: 'Method not allowed'}); return; }

  const body = req.body || {};
  if(!API_SECRET || body.secret !== API_SECRET){
    res.status(401).json({error: 'Invalid or missing access code'});
    return;
  }
  const photos = body.photos;
  if(!Array.isArray(photos) || photos.length < 1 || photos.length > 6){
    res.status(400).json({error: 'Attach between 1 and 6 photos'});
    return;
  }
  for(const p of photos){ if(typeof p !== 'string' || !/^data:image\/(jpeg|jpg|png|webp);base64,/.test(p)){ res.status(400).json({error: 'Invalid photo data URL'}); return; } }

  try{
    const parsed = await callVertexGemini(photos);
    const drafts = (parsed.drafts || [])
      .filter(d => AI_PATTERNS.some(p => p.n === d.n))
      .map(d => ({n: d.n, score: Math.max(0, Math.min(2, Math.round(d.score))), evidence: String(d.evidence || '').slice(0, 300), confidence: ['low','medium','high'].includes(d.confidence) ? d.confidence : 'low'}));
    res.status(200).json({drafts, model: VERTEX_MODEL, generatedAt: new Date().toISOString()});
  }catch(e){
    console.error('aiDraftPatterns error:', e);
    res.status(500).json({error: 'AI draft failed', detail: String(e && e.message ? e.message : e)});
  }
});

functions.http('updateSubmission', async (req, res) => {
  setCors(res);
  if(req.method === 'OPTIONS'){ res.status(204).send(''); return; }
  if(req.method !== 'POST'){ res.status(405).json({error: 'Method not allowed'}); return; }
  if(!checkEvaluatorAuth(req, res)) return;

  const {id, status, certLevel} = req.body || {};
  if(!id || !['approved', 'revision'].includes(status)){
    res.status(400).json({error: 'Invalid id or status'});
    return;
  }
  if(status === 'approved' && !certLevel){
    res.status(400).json({error: 'certLevel is required when approving'});
    return;
  }
  try{
    const ref = firestore.collection(SUBMISSIONS_COL).doc(id);
    const snap = await ref.get();
    if(!snap.exists){ res.status(404).json({error: 'Submission not found'}); return; }
    await ref.update({status, certLevel: status === 'approved' ? certLevel : null});
    res.status(200).json({ok: true});
  }catch(e){
    console.error('updateSubmission error:', e);
    res.status(500).json({error: 'Failed to update submission'});
  }
});
