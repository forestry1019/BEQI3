/* ยูทิลิตี้กลางที่ใช้ร่วมกันในหน้าใหม่ (S1 Explore / S2-S2.1 Entrepreneur / S3-S3.1 Evaluator)
   โหลดข้อมูลจาก data/beqi.json ชุดเดียวกับแดชบอร์ดเดิม + ตรรกะการรับรองชุดเดียวกับ picker.js/app.js
   + session แบบ client-side (localStorage) สำหรับต้นแบบ — ยังไม่มี backend จริง รอพัฒนาในเฟสถัดไป */
const BEQI_SESSION_KEY = 'beqi_session';

const BeqiCore = (function(){
  const IND = ['ที่ 1 พื้นที่สีเขียว','ที่ 2 การเชื่อมโยง','ที่ 3 การเข้าถึงน้ำ','ที่ 4 องค์ประกอบไบโอฟิลิก'];
  const BAND_COLOR = {A:'#1a7d32',B:'#2A9D8F',C:'#E9C46A',D:'#E76F51',E:'#B5322C'};

  const fx = (v, d = 2) => Number(v).toLocaleString('th-TH', {minimumFractionDigits: d, maximumFractionDigits: d});

  let dataPromise = null;
  function loadData(){
    if(!dataPromise) dataPromise = fetch('data/beqi.json?v=17').then(r => r.json());
    return dataPromise;
  }

  // เหมือน certLevel ใน picker.js/app.js ทุกประการ — ใช้ meta.cert_rules ชุดเดียวกัน
  function certLevel(score, norm, certRules){
    const mn = Math.min(...norm);
    for(const rule of certRules) if(score >= rule.min_score && mn >= rule.min_ind) return rule;
    return {level: 'ไม่ผ่านการรับรอง', min_score: 0, min_ind: 0, years: 0};
  }

  function getSession(){
    try{ return JSON.parse(localStorage.getItem(BEQI_SESSION_KEY) || 'null'); }
    catch(e){ return null; }
  }
  function setSession(session){
    localStorage.setItem(BEQI_SESSION_KEY, JSON.stringify(session));
  }
  function clearSession(){
    localStorage.removeItem(BEQI_SESSION_KEY);
  }
  // การ์ด role-gate: ถ้ายังไม่ได้ล็อกอิน หรือ role ไม่ตรง ให้เด้งกลับไปหน้า login ที่กำหนด
  // ใช้กับ S2.1 (ต้องเป็น entrepreneur) และ S3/S3.1 (ต้องเป็น evaluator เท่านั้น)
  function requireRole(role, redirectTo){
    const s = getSession();
    if(!s || s.role !== role){
      window.location.href = redirectTo;
      return null;
    }
    return s;
  }

  return {IND, BAND_COLOR, fx, loadData, certLevel, getSession, setSession, clearSession, requireRole};
})();
