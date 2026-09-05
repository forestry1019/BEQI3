/* เครื่องมือ "วาดขอบเขต & คำนวณ BEQI" ของหน้า explore.html (แท็บนักท่องเที่ยว) และ entrepreneur-dashboard.html
   ผู้ใช้คลิกไล่ตามขอบเขตพื้นที่จริงทีละจุด (waypoint) เพื่อสร้างรูปหลายเหลี่ยม แล้วคำนวณตัวชี้วัดทั้ง 4 สด
   จากภาพดาวเทียมเฉพาะภายในรูปทรงนั้นผ่าน Google Earth Engine โดยใช้พารามิเตอร์ชุดเดียวกับต้นแบบ
   (meta.params ใน data/beqi.json) — ตรงกับวิธีของ https://forestry1019.github.io/BEQI/ ทุกประการ

   วาดและคำนวณได้สูงสุด 3 พื้นที่พร้อมกัน (MAX_SITES) เพื่อเปรียบเทียบสมรรถนะเชิงพื้นที่กัน — มีทั้งการ์ดผลลัพธ์
   ต่อพื้นที่ (3 ค่า: คะแนนรวม/ระดับการรับรอง/ช่วงความเชื่อมั่น 95%) และตาราง+กราฟแท่งเปรียบเทียบเมื่อมี ≥1 พื้นที่

   คำนวณผ่านสองทางเลือก เลือกอัตโนมัติตามว่ามีการตั้งค่าใดพร้อมใช้งาน:
   1) Backend proxy (assets/js/api-config.js + server/) — ถ้าตั้งค่า computeUrl ไว้แล้ว ผู้ใช้ไม่ต้องล็อกอินเลย
   2) Client-side Google Earth Engine OAuth (assets/js/gee-config.js) — ถ้ายังไม่ได้ตั้งค่า backend
      ผู้ใช้ต้องล็อกอินบัญชี Google Earth Engine ของตัวเองก่อน (เหมือนต้นแบบเดิม/BEQI1 ทุกประการ)
      วิธีนี้ใช้งานได้ทันทีเพราะ OAuth Client ID + Cloud Project ถูกตั้งค่าไว้แล้วใน gee-config.js

   ตัวชี้วัดที่ 4 (องค์ประกอบไบโอฟิลิก) ตามระเบียบวิธีของดุษฎีนิพนธ์ (หัวข้อ 5.3.8) ต้องมาจากแบบตรวจสอบ 14 รูปแบบ
   ที่ประเมินจากภาพถ่าย/ลงพื้นที่จริง — ห้ามประมาณจากภาพดาวเทียมเด็ดขาด เพราะทำลายคุณสมบัติ "หลักฐานเชิงกายภาพล้วน"
   ของดัชนี พื้นที่ที่เพิ่งวาดขึ้นใหม่จึงมี 3 สถานะสำหรับตัวชี้วัดที่ 4 เท่านั้น:
     'none'         ยังไม่มีข้อมูลเลย — แสดงเฉพาะตัวชี้วัดที่ 1-3 ไม่มีคะแนนรวม ไม่มีการรับรอง
     'zone_context' ยืมค่าของโซนที่พื้นที่นี้ตกอยู่ในนั้นมาแสดงเป็นค่าตัวอย่างชั่วคราว (กำกับชัดเจนว่ายืมมา
                    ไม่ใช่ค่าที่วัดจากแปลงนี้จริง) — มีคะแนนรวม/ช่วงความเชื่อมั่นให้ดูเป็นตัวอย่าง แต่ **ห้ามสรุป
                    สถานะการรับรองจากสถานะนี้เด็ดขาด** (บังคับในโค้ด ไม่ใช่แค่ข้อความกำกับ)
     'assessed'     ประเมินจริงแล้ว (ผ่านรูปถ่าย+AI ร่างคะแนน+ผู้ประเมินยืนยัน) — สถานะเดียวที่สรุปการรับรองได้
   ปุ่ม "ส่งขอรับรอง" จึงใช้งานได้เฉพาะพื้นที่ที่อยู่ในสถานะ assessed เท่านั้น

   ช่วงความเชื่อมั่น 95% เป็นการประมาณการแบบเรียลไทม์ในเบราว์เซอร์จากความแม่นยำของแบบจำแนกภาพ
   (meta.accuracy.producers) — คนละวิธีกับ Monte Carlo 5,000 รอบที่คำนวณไว้ล่วงหน้าแบบออฟไลน์สำหรับ
   3 โซนอ้างอิงใน data/beqi.json ซึ่งใช้ในหน้าอื่น ไม่ใช่พื้นที่ที่ผู้ใช้วาดเอง */
(function(){
// entrepreneur-dashboard.html ตั้ง window.BEQI_MAX_SITES=1 ไว้ก่อนโหลดไฟล์นี้ (ผู้ประกอบการมีสถานประกอบการ
// เดียว ไม่ต้องเปรียบเทียบหลายแปลงเหมือนหน้านักท่องเที่ยว) — ถ้าไม่ตั้งไว้ ใช้ค่าเริ่มต้น 3 เหมือนเดิม
const MAX_SITES=(typeof window.BEQI_MAX_SITES==='number'?window.BEQI_MAX_SITES:3);
const AOI_COL=['#2A9D8F','#E9C46A','#0B3D45']; // สีอ้างอิง 3 โซนหลัก — แสดงเป็นบริบทบนแผนที่เท่านั้น ไม่ใช่ข้อจำกัดของรูปที่วาด
const SITE_COL=['#095353','#C9962C','#6A4C93']; // สีของพื้นที่ที่ 1/2/3 ที่ผู้ใช้วาด — เลี่ยงโทนแดง/ส้มแดงเพราะสื่อถึง error/danger ตามธรรมเนียม UI
const IND_LABEL_KEYS=['explore.compare.ind1','explore.compare.ind2','explore.compare.ind3','explore.compare.ind4'];
const el=id=>document.getElementById(id);
const fx=(v,d=2)=>Number(v).toLocaleString('th-TH',{minimumFractionDigits:d,maximumFractionDigits:d});
const clamp01=v=>Math.min(Math.max(v,0),1);
const t=key=>(typeof I18N!=='undefined'?I18N.t(key):key);

let meta=null, zones=null, map=null, ready=false;
let verts=[], vmarkers=[], polyline=null, polygon=null, closed=false, computing=false;
let sites=[], siteSeq=0, compareChart=null, compareRadar=null; // พื้นที่ที่คำนวณแล้วทั้งหมด (สูงสุด MAX_SITES พื้นที่พร้อมกัน)

// ใช้ backend proxy ถ้าตั้งค่า assets/js/api-config.js ไว้แล้ว (ดู server/README.md) — ไม่งั้น fallback ไป
// ล็อกอิน Google Earth Engine เองในเบราว์เซอร์ (ใช้งานได้ทันทีเพราะ gee-config.js ตั้งค่าไว้แล้ว)
function apiConfig(){
  return typeof BEQI_API_CONFIG!=='undefined'?BEQI_API_CONFIG:null;
}
function backendConfigured(){
  const cfg=apiConfig();
  return !!(cfg && cfg.computeUrl && cfg.computeUrl.indexOf('YOUR_')!==0);
}

fetch('data/beqi.json?v=17').then(r=>r.json()).then(d=>{meta=d.meta; zones=d.zones; boot()})
  .catch(()=>{el('pickerMapNote').textContent=t('explore.draw.mapLoadError');});

function boot(){
  initMap();
  wireButtons();
  if(backendConfigured()){
    ready=true;
    const box=el('geeAuthBox'); if(box) box.hidden=true;
  }else{
    initAuthUI();
  }
  refreshButtons();
  document.addEventListener('beqi:langchange', onLangChange);
  // ให้หน้าที่เรียก window.BEQI_SUBMIT_TO_EVALUATOR (entrepreneur-dashboard.js) เรียกกลับมา re-render
  // การ์ดได้ หลังจากผู้ใช้ยืนยันส่งจริงในหน้าจอตรวจทานของตัวเอง (ตั้ง site.submitted=true เองก่อนเรียก)
  window.BEQI_RERENDER_SITES = renderSiteCards;
}

function onLangChange(){
  statusNote();
  renderSiteCards();
  renderCompare();
  renderAuthBox();
}

function initMap(){
  map=L.map('pickerMap').setView([8.63,98.26],11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
  zones.forEach((z,i)=>{
    const latlngs=z.boundary.map(([lon,lat])=>[lat,lon]);
    L.polygon(latlngs,
      {color:AOI_COL[i],weight:1.5,fillOpacity:.05,dashArray:'4,4'})
      .bindTooltip(z.name_th+' — '+z.sub_th).addTo(map);
  });
  map.on('click',e=>{
    if(closed||sites.length>=MAX_SITES) return;
    addVertex(e.latlng);
  });
  statusNote();
}

function addVertex(ll){
  verts.push(ll);
  const m=L.circleMarker(ll,{radius:8,color:'#0B3D45',weight:2,fillColor:'#fff',fillOpacity:1}).addTo(map);
  // คลิกจุดแรกซ้ำเพื่อปิดรูปได้ทันที (พฤติกรรมมาตรฐานของเครื่องมือวาดรูปหลายเหลี่ยม)
  if(verts.length===1) m.on('click',()=>{ if(!closed) closePolygon(); });
  vmarkers.push(m);
  if(polyline) map.removeLayer(polyline);
  polyline=L.polyline(verts,{color:'#0B3D45',weight:2,dashArray:'5,5'}).addTo(map);
  refreshButtons();
  statusNote();
}

function undoVertex(){
  if(closed||!verts.length) return;
  verts.pop();
  map.removeLayer(vmarkers.pop());
  if(polyline){map.removeLayer(polyline);polyline=null;}
  if(verts.length) polyline=L.polyline(verts,{color:'#0B3D45',weight:2,dashArray:'5,5'}).addTo(map);
  refreshButtons();
  statusNote();
}

function closePolygon(){
  if(closed||verts.length<3) return;
  closed=true;
  if(polyline){map.removeLayer(polyline);polyline=null;}
  polygon=L.polygon(verts,{color:'#0B3D45',weight:2,fillColor:'#2A9D8F',fillOpacity:.18}).addTo(map);
  refreshButtons();
  statusNote();
}

function clearAll(){
  vmarkers.forEach(m=>map.removeLayer(m)); vmarkers=[];
  if(polyline){map.removeLayer(polyline);polyline=null;}
  if(polygon){map.removeLayer(polygon);polygon=null;}
  verts=[]; closed=false;
  refreshButtons();
  statusNote();
}

function wireButtons(){
  el('undoBtn').onclick=undoVertex;
  el('closeBtn').onclick=closePolygon;
  el('clearBtn').onclick=clearAll;
  el('runBtn').onclick=runAnalysis;
  const zonesChk=el('includeZonesChk');
  if(zonesChk) zonesChk.addEventListener('change',renderCompare);
  refreshButtons();
}
function refreshButtons(){
  el('undoBtn').disabled=closed||!verts.length;
  el('closeBtn').disabled=closed||verts.length<3;
  el('runBtn').disabled=!closed||computing||!ready||sites.length>=MAX_SITES;
}
function statusNote(){
  if(sites.length>=MAX_SITES&&!closed){
    el('pickerMapNote').textContent=t('explore.compare.maxReached').replace('{n}',MAX_SITES);
  }else if(closed){
    el('pickerMapNote').innerHTML=t('explore.picker.status.closed').replace('{n}',verts.length)+
      (ready?'':' <span class="text-coral-warmth">'+t('explore.picker.status.needsAuth')+'</span>');
  }else if(verts.length){
    el('pickerMapNote').textContent=t('explore.picker.status.drawing').replace('{n}',verts.length);
  }else{
    el('pickerMapNote').textContent=t('explore.picker.status.empty');
  }
}

/* ---------------- ทางเลือกที่ 1: ล็อกอิน Google Earth Engine เองในเบราว์เซอร์ ---------------- */
// สถานะปัจจุบันของกล่อง Earth Engine — เก็บไว้เพื่อ re-render ข้อความใหม่ตามภาษาที่เลือก โดยไม่ต้องรันตรรกะ auth ซ้ำ
let authState=null;
function renderAuthBox(){
  const box=el('geeAuthBox');
  if(!box||!authState) return;
  if(authState==='checking'){
    box.innerHTML='<span class="text-on-surface-variant" id="geeStatus">'+t('explore.picker.auth.checking')+'</span>';
  }else if(authState==='loginButton'){
    box.innerHTML='<button id="geeLogin" class="tool-btn primary">'+t('explore.picker.auth.loginBtn')+'</button> '+
      '<span class="text-on-surface-variant ml-3" id="geeStatus">'+t('explore.picker.auth.notConnected')+'</span>';
    el('geeLogin').onclick=onLoginClick;
  }else if(authState==='connected'){
    box.innerHTML='<span class="text-tertiary" id="geeStatus">'+t('explore.picker.auth.connected')+'</span>';
  }else if(authState==='openingPopup'){
    box.innerHTML='<span class="text-on-surface-variant" id="geeStatus">'+t('explore.picker.auth.openingPopup')+'</span>';
  }else if(authState&&authState.kind==='error'){
    box.innerHTML='<span class="text-coral-warmth" id="geeStatus">'+t('explore.picker.auth.connectFailed').replace('{msg}',authState.msg)+'</span>';
  }else if(authState&&authState.kind==='static'){
    box.innerHTML=authState.html;
  }
}
function initAuthUI(){
  const box=el('geeAuthBox');
  if(!box) return;
  if(typeof ee==='undefined'){
    authState={kind:'static', html:'<b>'+t('explore.picker.auth.libFailTitle')+'</b> '+t('explore.picker.auth.libFailBody')};
    renderAuthBox(); return;
  }
  if(!GEE_CONFIG||!GEE_CONFIG.clientId||GEE_CONFIG.clientId.indexOf('YOUR_')===0){
    authState={kind:'static', html:'<b>'+t('explore.picker.auth.notConfiguredTitle')+'</b><br>'+t('explore.picker.auth.notConfiguredBody')};
    renderAuthBox(); return;
  }
  if(location.protocol==='file:'){
    authState={kind:'static', html:'<b>'+t('explore.picker.auth.fileProtocolTitle')+'</b><br>'+t('explore.picker.auth.fileProtocolBody')};
    renderAuthBox(); return;
  }
  let authSettled=false;
  const fallback=setTimeout(()=>{ if(!authSettled) showLoginButton(); },4000);
  const onImmediateFailed=()=>{ authSettled=true; clearTimeout(fallback); showLoginButton(); };
  const onImmediateAuthed=()=>{ authSettled=true; clearTimeout(fallback); onAuthed(); };
  authState='checking'; renderAuthBox();
  ee.data.authenticateViaOauth(GEE_CONFIG.clientId, onImmediateAuthed, ()=>{},
    ['https://www.googleapis.com/auth/earthengine.readonly'], onImmediateFailed, true);
}
function showLoginButton(){
  authState='loginButton'; renderAuthBox();
}
function onLoginClick(){
  authState='openingPopup'; renderAuthBox();
  try{
    ee.data.authenticateViaPopup(onAuthed, onAuthErr);
  }catch(e){
    onAuthErr(e);
  }
}
function onAuthed(){
  ee.initialize(null,null,()=>{
    ready=true;
    authState='connected'; renderAuthBox();
    refreshButtons();
    statusNote();
  }, onAuthErr, null, GEE_CONFIG.cloudProject);
}
function onAuthErr(e){
  console.error('BEQI picker: Earth Engine auth/init error',e);
  const msg=(e&&e.message)?e.message:(typeof e==='string'?e:JSON.stringify(e));
  authState={kind:'error', msg}; renderAuthBox();
}

// ดึงค่าจาก ee.Dictionary แบบปลอดภัย — ถ้าไม่มีคีย์นั้น (เช่น แปลงที่วาดไม่มีพิกเซลสีเขียว/น้ำเลย
// ในแบนด์นั้น ทำให้ reduceRegion ไม่คืนคีย์นั้นมา) ให้ใช้ 0 แทน โดยไม่พึ่ง .get(key, default)
function safeGet(dict,key){
  return ee.Algorithms.If(dict.contains(key), dict.get(key), 0);
}

// คำนวณตรงในเบราว์เซอร์ผ่าน Earth Engine JS client (ee.data ที่ authenticate ไว้แล้วด้านบน)
// สูตร/พารามิเตอร์ตรงกับ server/index.js (backend proxy) และต้นแบบเดิมทุกประการ
function runViaClientGEE(ring){
  const p=meta.params;
  const closedRing=ring.slice(); closedRing.push(closedRing[0]);
  const poly=ee.Geometry.Polygon([closedRing]);

  const s2=ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterDate('2024-01-14','2025-12-24').filterBounds(poly)
    .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE',p.cloud_filter_pct)).median();
  const ndvi=s2.normalizedDifference(['B8','B4']).rename('ndvi');
  const wc=ee.ImageCollection('ESA/WorldCover/v200').first().select('Map');
  const land=wc.neq(80).rename('land');
  const water=wc.eq(80).rename('water');
  const greenLand=ndvi.gte(p.ndvi_threshold).and(land).rename('green');

  const ind1=greenLand.updateMask(land).reduceRegion(
    {reducer:ee.Reducer.mean(),geometry:poly,scale:p.scale_m,maxPixels:1e9,bestEffort:true});

  const patch=greenLand.selfMask().connectedPixelCount({maxSize:256,eightConnected:true});
  const ind2=patch.reduceRegion(
    {reducer:ee.Reducer.mean(),geometry:poly,scale:p.scale_m,maxPixels:1e9,bestEffort:true});

  const dist=water.fastDistanceTransform(256).sqrt().multiply(p.scale_m);
  const within=dist.lte(800).rename('w800');
  const ind3=within.updateMask(land).reduceRegion(
    {reducer:ee.Reducer.mean(),geometry:poly,scale:p.scale_m,maxPixels:1e9,bestEffort:true});

  // ตัวชี้วัดที่ 4 (ประมาณการ): ระเบียบวิธีต้นแบบต้องใช้แบบตรวจสอบภาคสนาม 14 รูปแบบซึ่งยังไม่มีระบบรองรับ
  // จึงใช้ค่าเบี่ยงเบนมาตรฐานของ NDVI แทนความหลากหลายเชิงพื้นผิวของพืชพรรณ (proxy ของรูปแบบเชิงซ้อน/ธรรมชาติ)
  const ind4sd=ndvi.updateMask(land).reduceRegion(
    {reducer:ee.Reducer.stdDev(),geometry:poly,scale:p.scale_m,maxPixels:1e9,bestEffort:true});

  const combined=ee.Dictionary({
    g:safeGet(ind1,'green'), p:safeGet(ind2,'green'), w:safeGet(ind3,'w800'),
    sd:safeGet(ind4sd,'ndvi'), area:poly.area(1)
  });

  const timer=setTimeout(()=>{
    el('pickerMapNote').innerHTML='<span class="text-coral-warmth">'+t('explore.picker.run.slow')+'</span>';
  },30000);
  combined.evaluate((r,err)=>{
    clearTimeout(timer);
    computing=false; refreshButtons();
    if(err){
      console.error('BEQI picker: Earth Engine evaluate error',err);
      el('pickerMapNote').innerHTML='<span class="text-coral-warmth">'+t('explore.picker.run.apiFailed').replace('{msg}',err)+'</span>';
      return;
    }
    onResult(r, ring);
  });
}

/* ---------------- ทางเลือกที่ 2: เรียก backend proxy (server/) ---------------- */
function runViaBackend(cfg,ring){
  fetch(cfg.computeUrl,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({polygon:ring, secret:cfg.secret})
  }).then(r=>r.json().then(data=>({ok:r.ok, data})))
    .then(({ok,data})=>{
      computing=false; refreshButtons();
      if(!ok) throw new Error((data&&data.error)||('HTTP error'));
      onResult(data, ring);
    })
    .catch(err=>{
      computing=false; refreshButtons();
      console.error('BEQI compute API error',err);
      el('pickerMapNote').innerHTML='<span class="text-coral-warmth">'+
        t('explore.picker.run.apiFailed').replace('{msg}',(err&&err.message)?err.message:err)+'</span>';
    });
}

function runAnalysis(){
  if(!closed||computing||!ready||sites.length>=MAX_SITES) return;
  computing=true; refreshButtons();
  el('pickerMapNote').textContent=t('explore.picker.run.processing');
  const ring=verts.map(v=>[v.lng,v.lat]);

  try{
    if(backendConfigured()) runViaBackend(apiConfig(),ring);
    else runViaClientGEE(ring);
  }catch(e){
    computing=false; refreshButtons();
    console.error('BEQI picker: error building Earth Engine request',e);
    el('pickerMapNote').innerHTML='<span class="text-coral-warmth">'+
      t('explore.picker.run.apiFailed').replace('{msg}',(e&&e.message?e.message:e))+'</span>';
  }
}

// จุดกึ่งกลางของรูปหลายเหลี่ยมที่วาด ตกอยู่ในโซนอ้างอิงใดหรือไม่ (ray-casting point-in-polygon) —
// ใช้สำหรับสถานะ 'zone_context' เท่านั้น (ยืมค่าตัวชี้วัดที่ 4 ของโซนนั้นมาแสดงเป็นตัวอย่างชั่วคราว)
function pointInPolygon(pt,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const xi=poly[i][0], yi=poly[i][1], xj=poly[j][0], yj=poly[j][1];
    const intersect=((yi>pt[1])!==(yj>pt[1]))&&(pt[0]<(xj-xi)*(pt[1]-yi)/(yj-yi)+xi);
    if(intersect) inside=!inside;
  }
  return inside;
}
function findContainingZone(ring){
  const lons=ring.map(p=>p[0]), lats=ring.map(p=>p[1]);
  const cx=lons.reduce((a,b)=>a+b,0)/lons.length, cy=lats.reduce((a,b)=>a+b,0)/lats.length;
  return zones.find(z=>pointInPolygon([cx,cy],z.boundary))||null;
}

function certLevel(score,norm){
  const mn=Math.min(...norm);
  for(const rule of meta.cert_rules) if(score>=rule.min_score&&mn>=rule.min_ind) return rule.level;
  return null; // null = ยังไม่ผ่านการรับรอง (แปลผ่าน I18N ตอน render)
}

// จำลอง Monte Carlo แบบเรียลไทม์ในเบราว์เซอร์ (ไม่ใช่ MC 5,000 รอบแบบออฟไลน์ของ 3 โซนอ้างอิง) เพื่อประมาณ
// ช่วงความเชื่อมั่น 95% ของพื้นที่ที่ผู้ใช้วาดเอง โดยอิงจากความแม่นยำของแบบจำแนกภาพ (producer's accuracy)
// ของคลาส "ป่าไม้/ป่าชายเลน" และ "แหล่งน้ำ" ใน meta.accuracy — ยิ่งแบบจำแนกภาพแม่นยำน้อย ยิ่งสุ่มรบกวนค่า
// ตัวชี้วัดมาก แล้วดูการกระจายของคะแนนรวมที่ได้ (percentile 2.5–97.5)
function gaussianNoise(){
  let u=0,v=0; while(u===0)u=Math.random(); while(v===0)v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}
function estimateCI(norm){
  const acc=meta.accuracy;
  const pForest=(acc&&acc.producers)?acc.producers[0]:0.85;
  const pWater=(acc&&acc.producers)?acc.producers[4]:0.85;
  const sdGreen=clamp01(1-pForest)*0.5;
  const sdWater=clamp01(1-pWater)*0.5;
  const N=1500;
  const scores=new Array(N);
  for(let i=0;i<N;i++){
    const g=clamp01(norm[0]+gaussianNoise()*sdGreen);
    const pc=clamp01(norm[1]+gaussianNoise()*sdGreen*0.6);
    const w=clamp01(norm[2]+gaussianNoise()*sdWater);
    const ind4=clamp01(0.4*g+0.3*w+0.3*clamp01(norm[3]+gaussianNoise()*0.05));
    scores[i]=(g+pc+w+ind4)/4*100;
  }
  scores.sort((a,b)=>a-b);
  return {lo:scores[Math.floor(N*0.025)], hi:scores[Math.ceil(N*0.975)-1]};
}

// แปลงผลดิบ (จาก client-side GEE หรือ backend ก็ตาม รูปแบบผลลัพธ์เดียวกัน) เป็นพื้นที่หนึ่งรายการ
// วาดรูปถาวรลงแผนที่ด้วยสีประจำลำดับพื้นที่ แล้วเพิ่มเข้าชุดเปรียบเทียบ (สูงสุด MAX_SITES พื้นที่)
// ตัวชี้วัดที่ 1-3 มาจากดาวเทียมเสมอ (เชื่อถือได้) ส่วนตัวชี้วัดที่ 4 มี 3 สถานะตามหัวข้อ 5.3.8 ของดุษฎีนิพนธ์
function onResult(r,ring){
  const green=(r.g||0)*100, pc=clamp01((r.p||0)/256), w800=(r.w||0)*100;
  const norm3=[clamp01(green/100),pc,clamp01(w800/100)];

  const zone=findContainingZone(ring);
  const ind4Source=zone?'zone_context':'none';
  const ind4Value=zone?zone.norm[3]:null;
  const norm=norm3.concat([ind4Value]);

  let overall=null, level=null, ci=null;
  if(ind4Source!=='none'){
    overall=norm.reduce((a,b)=>a+b,0)/norm.length*100;
    ci=estimateCI(norm);
    if(ind4Source==='assessed') level=certLevel(overall,norm);
  }

  if(polygon){map.removeLayer(polygon);polygon=null;}
  const color=SITE_COL[sites.length%SITE_COL.length];
  const layer=L.polygon(ring.map(([lng,lat])=>[lat,lng]),{color,weight:2,fillColor:color,fillOpacity:.22}).addTo(map);

  const site={id:++siteSeq,norm,overall,level,ci,ind4Source,ind4ZoneName:zone?zone.name_th:null,polygon:ring,layer,color};
  sites.push(site);
  renderSiteCards();
  renderCompare();

  vmarkers.forEach(m=>map.removeLayer(m)); vmarkers=[];
  verts=[]; closed=false;
  refreshButtons();
  statusNote();
}

function removeSite(id){
  const idx=sites.findIndex(s=>s.id===id);
  if(idx<0) return;
  map.removeLayer(sites[idx].layer);
  sites.splice(idx,1);
  renderSiteCards();
  renderCompare();
  refreshButtons();
  statusNote();
}

// การ์ดผลลัพธ์ต่อพื้นที่ (สูงสุด 3 การ์ด) — แสดงตัวชี้วัดรายตัวทั้ง 4 ด้านคู่กับคะแนนรวมเสมอ (ห้ามสรุปด้วย
// คะแนนรวมเพียงตัวเดียวโดยลำพัง ตามหัวข้อ 3.4.2) และบังคับ 3 สถานะของตัวชี้วัดที่ 4 ตามหัวข้อ 5.3.8:
// none = ยังไม่มีคะแนนรวม/การรับรอง, zone_context = คะแนนรวมเป็นตัวอย่างเท่านั้น ห้ามสรุปการรับรอง,
// assessed = สถานะเดียวที่สรุปการรับรองและส่งขอรับรองได้ ปุ่ม "ส่งขอรับรอง" จะโผล่เฉพาะหน้าที่กำหนด
// window.BEQI_SUBMIT_TO_EVALUATOR ไว้ (entrepreneur-dashboard.html)
function renderSiteCards(){
  const empty=el('pickerResultEmpty');
  const list=el('siteCards');
  if(!list) return;
  if(empty) empty.hidden=sites.length>0;
  const canSubmit=typeof window.BEQI_SUBMIT_TO_EVALUATOR==='function';
  list.innerHTML=sites.map((s,i)=>{
    const indLabels=IND_LABEL_KEYS.map(t);
    const ind4Cell=s.ind4Source==='none'
      ? '<span class="text-outline">'+t('explore.result.ind4NoneShort')+'</span>'
      : '<b>'+fx(s.norm[3],3)+'</b>'+(s.ind4Source==='zone_context'?' <span class="text-outline">('+t('explore.compare.referenceSuffix')+')</span>':'');
    const indicatorRows='<div class="flex flex-col gap-1 text-xs border-t border-limestone-gray pt-3">'+
      [0,1,2].map(function(idx){
        return '<div class="flex justify-between"><span class="text-on-surface-variant">'+indLabels[idx]+'</span><b>'+fx(s.norm[idx],3)+'</b></div>';
      }).join('')+
      '<div class="flex justify-between"><span class="text-on-surface-variant">'+indLabels[3]+'</span>'+ind4Cell+'</div>'+
      '</div>';

    const noteHtml=s.ind4Source==='none'
      ? '<p class="font-body-md text-xs text-coral-warmth">'+t('explore.result.ind4Pending')+'</p>'
      : s.ind4Source==='zone_context'
        ? '<p class="font-body-md text-xs text-coral-warmth">'+t('explore.result.ind4ZoneContext').replace('{zone}',s.ind4ZoneName)+'</p>'
        : '';

    const scoreBlock=s.overall==null
      ? '<div class="font-body-md text-sm text-on-surface-variant py-2">'+t('explore.result.awaitingScore')+'</div>'
      : '<div class="flex items-baseline gap-2">'+
          '<span class="font-display-lg text-[36px] text-primary leading-none">'+fx(s.overall,1)+'</span>'+
          '<span class="font-body-md text-sm text-outline">/ 100</span>'+
          (s.ind4Source==='zone_context'?' <span class="font-label-caps text-label-caps text-coral-warmth">'+t('explore.result.previewTag')+'</span>':'')+
          '</div>';

    const levelBlock=s.overall==null?'':(
      '<div class="flex items-center justify-between text-sm">'+
      '<span class="text-on-surface-variant">'+t('explore.result.bandLabel')+'</span>'+
      (s.ind4Source==='assessed'
        ? '<b class="text-andaman-deep">'+(s.level||t('explore.result.notCertified'))+'</b>'
        : '<b class="text-outline">'+t('explore.result.pendingCert')+'</b>')+
      '</div>');

    const ciBlock=s.ci?(
      '<div class="flex items-center justify-between text-sm">'+
      '<span class="text-on-surface-variant">'+t('explore.result.ciLabel')+'</span>'+
      '<b class="font-data-viz text-on-surface-variant">'+fx(s.ci.lo,1)+' – '+fx(s.ci.hi,1)+'</b></div>'
    ):'';

    return '<div class="organic-border bg-white p-6 sketch-shadow flex flex-col gap-4" style="border-left:4px solid '+s.color+'">'+
      '<div class="flex items-center justify-between">'+
      '<span class="font-label-caps text-label-caps text-outline">'+t('explore.result.areaLabel').replace('{n}',i+1)+'</span>'+
      '<button class="text-outline hover:text-coral-warmth material-symbols-outlined text-[18px]" data-remove="'+s.id+'" title="'+t('explore.result.removeBtn')+'">close</button>'+
      '</div>'+
      scoreBlock+noteHtml+levelBlock+ciBlock+indicatorRows+
      '</div>';
  }).join('');

  // ปุ่ม "ส่งขอรับรอง" มีเพียงปุ่มเดียวอยู่ล่างสุดของรายการการ์ดทั้งหมด (ไม่ใช่ปุ่มแยกต่อการ์ดเหมือนเดิม
  // ซึ่งสับสนเมื่อมีหลายพื้นที่) ทำงานกับพื้นที่ล่าสุดที่ยังไม่ได้ส่ง — ตามลำดับงานหัวข้อ 5.3.9 การส่งขอรับรอง
  // เกิด "ก่อน" การให้คะแนนตัวชี้วัดที่ 4 เสมอ ปุ่มนี้จึงใช้งานได้ทันทีที่มีตัวชี้วัด 1-3 แล้ว ไม่ต้องรอ
  // ind4Source==='assessed' — คลิกแล้วเปิดหน้าจอตรวจทาน+แนบรูปแทนการส่งทันที
  const pendingSite=sites.slice().reverse().find(function(s){ return !s.submitted; });
  if(canSubmit && sites.length){
    list.innerHTML+= pendingSite
      ? '<button class="tool-btn primary w-full" id="siteSubmitBtn">'+t('entrepreneur.dashboard.submitBtn')+'</button>'
      : '<p class="font-body-md text-xs text-center text-tertiary">'+t('entrepreneur.dashboard.submitted')+'</p>';
  }

  list.querySelectorAll('[data-remove]').forEach(function(b){
    b.addEventListener('click',function(){ removeSite(+b.dataset.remove); });
  });
  const submitBtn=el('siteSubmitBtn');
  if(submitBtn){
    // ปุ่มนี้แค่ "เปิด" หน้าจอตรวจทานก่อนส่งของ entrepreneur-dashboard.js เท่านั้น — ยังไม่ถือว่าส่งจริง
    // จนกว่าผู้ใช้จะยืนยันที่นั่น (แนบรูป + ติ๊กยืนยัน) ตัวนั้นเป็นคนตั้ง site.submitted=true แล้วเรียก
    // window.BEQI_RERENDER_SITES() กลับมาที่นี่เพื่ออัปเดตการ์ดให้ตรงสถานะ
    submitBtn.addEventListener('click',function(){
      window.BEQI_SUBMIT_TO_EVALUATOR(pendingSite);
    });
  }
}

// ตาราง + กราฟเรดาร์ + กราฟแท่งเปรียบเทียบพื้นที่ทั้งหมดที่คำนวณไว้ (สูงสุด 3 พื้นที่พร้อมกัน)
// เลือกได้ว่าจะรวม 3 โซนหลักของ Portfolio เข้ามาเป็นมาตรฐานอ้างอิงด้วยหรือไม่ (เส้นประในกราฟ)
function renderCompare(){
  const section=el('compareSection');
  if(!section) return;
  section.hidden=sites.length<1;
  if(!sites.length) return;

  const zonesChk=el('includeZonesChk');
  const includeZones=zonesChk?zonesChk.checked:false;
  const refZones=includeZones?zones:[];

  const siteLabels=sites.map((s,i)=>t('explore.result.areaLabel').replace('{n}',i+1));
  const zoneLabels=refZones.map(z=>z.name_th+' ('+t('explore.compare.referenceSuffix')+')');
  const labels=siteLabels.concat(zoneLabels);
  const allNorm=sites.map(s=>s.norm).concat(refZones.map(z=>z.norm));
  const allOverall=sites.map(s=>s.overall).concat(refZones.map(z=>z.beqi));
  const allColors=sites.map(s=>s.color).concat(refZones.map((z,i)=>AOI_COL[i]));
  const indLabels=IND_LABEL_KEYS.map(t);

  el('compareTable').innerHTML='<thead><tr><th class="text-left py-2 pr-4 font-label-caps text-label-caps text-outline">'+
    t('explore.compare.indicatorHeader')+'</th>'+
    labels.map(function(lb){ return '<th class="text-right py-2 pl-4 font-label-caps text-label-caps text-outline">'+lb+'</th>'; }).join('')+
    '</tr></thead><tbody>'+
    indLabels.map(function(nm,i){
      return '<tr class="border-t border-limestone-gray"><td class="py-2 pr-4">'+nm+'</td>'+
        allNorm.map(function(n){ return '<td class="text-right py-2 pl-4 font-data-viz">'+(n[i]==null?'–':fx(n[i],3))+'</td>'; }).join('')+
        '</tr>';
    }).join('')+
    '<tr class="border-t border-limestone-gray font-semibold"><td class="py-2 pr-4">'+t('explore.compare.totalScoreRow')+'</td>'+
    allOverall.map(function(v){ return '<td class="text-right py-2 pl-4 font-data-viz">'+(v==null?'–':fx(v,1))+'</td>'; }).join('')+
    '</tr></tbody>';

  if(typeof Chart==='undefined') return;
  if(compareRadar) compareRadar.destroy();
  compareRadar=new Chart(el('compareRadar'),{type:'radar',
    data:{labels:indLabels, datasets:labels.map(function(lb,i){
      return {label:lb, data:allNorm[i], borderColor:allColors[i], backgroundColor:'transparent',
        borderWidth:2, pointRadius:3, borderDash:i>=sites.length?[4,3]:[]};
    })},
    options:{scales:{r:{min:0,max:1,ticks:{stepSize:.2}}},plugins:{legend:{position:'bottom'}}}});

  if(compareChart) compareChart.destroy();
  compareChart=new Chart(el('compareBar'),{type:'bar',
    data:{labels, datasets:[{label:t('explore.compare.beqiScoreLabel'), data:allOverall, backgroundColor:allColors}]},
    options:{scales:{y:{beginAtZero:true,max:100}},plugins:{legend:{display:false}}}});
}
})();
