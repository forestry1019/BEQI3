/* ทะเบียนสาธารณะของสถานประกอบการที่ผ่านการรับรองแล้ว (หัวข้อ 5.4.1 ของดุษฎีนิพนธ์ — "ส่วนที่สี่คือทะเบียน
   สาธารณะ ซึ่งทำให้บุคคลภายนอกตรวจสอบสถานะของใบรับรองแต่ละฉบับได้") แสดงบนหน้าบุคคลทั่วไป (explore.html)

   ข้อจำกัดของต้นแบบ: อ่านจาก localStorage key "beqi_submissions" เดียวกับที่ผู้ประกอบการ/ผู้ประเมินใช้
   ซึ่งเป็นข้อมูลเฉพาะเบราว์เซอร์เครื่องนั้น ๆ ไม่ได้ sync ข้ามเครื่อง/ข้ามผู้ใช้จริง (ต้นแบบยังไม่มี backend
   กลางสำหรับเก็บข้อมูลนี้ — ดู server/README.md หากต้องการขยายเป็นฐานข้อมูลจริงในอนาคต) */
(function(){
  const ZONE_LABEL_KEY = {North:'explore.registry.zoneNorth', Central:'explore.registry.zoneCentral', South:'explore.registry.zoneSouth'};
  const t = key => (typeof I18N !== 'undefined' ? I18N.t(key) : key);

  function loadApproved(){
    try{
      const subs = JSON.parse(localStorage.getItem('beqi_submissions') || '[]');
      return subs.filter(function(s){ return s.status === 'approved'; }).reverse();
    }catch(e){ return []; }
  }

  function render(){
    const list = document.getElementById('registryList');
    const empty = document.getElementById('registryEmpty');
    if(!list) return;
    const approved = loadApproved();
    empty.hidden = approved.length > 0;
    list.innerHTML = approved.map(function(s){
      const zoneLabel = s.zoneId && ZONE_LABEL_KEY[s.zoneId] ? t(ZONE_LABEL_KEY[s.zoneId]) : '';
      return '<div class="organic-border bg-white p-6 sketch-shadow flex flex-col gap-2">' +
        '<span class="font-label-caps text-label-caps text-tertiary">' + (s.certLevel || s.level || '') + '</span>' +
        '<h3 class="font-headline-md text-headline-md text-andaman-deep">' + s.businessName + '</h3>' +
        '<p class="font-body-md text-sm text-on-surface-variant">' + zoneLabel + '</p>' +
        '<p class="font-body-md text-xs text-outline mt-2">' + t('explore.registry.certifiedOn') + ' ' + new Date(s.createdAt).toLocaleDateString('th-TH') + '</p>' +
        '</div>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('beqi:langchange', render);
})();
