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
const PARAMS = require('./params.json');

const EE_CLOUD_PROJECT = process.env.GEE_CLOUD_PROJECT || 'beqi-488814';
const API_SECRET = process.env.BEQI_API_SECRET || '';
// จำกัดขนาดกรอบพื้นที่ที่ยอมรับ (องศา) กันการวาดพื้นที่ใหญ่เกินสมควร (~0.3° ราว ๆ 30 กม.) — ปรับได้ตามความเหมาะสม
const MAX_BBOX_DEG = 0.3;
const ALLOWED_ORIGIN = process.env.BEQI_ALLOWED_ORIGIN || '*';

const auth = new GoogleAuth({scopes: ['https://www.googleapis.com/auth/earthengine']});
let eeInitPromise = null;
let eeTokenExpiry = 0;

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

function setCors(res){
  res.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
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
