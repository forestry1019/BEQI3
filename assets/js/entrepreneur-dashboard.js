/* S2.1 — แดชบอร์ดผู้ประกอบการ: หน้าตา/การใช้งานเหมือนเครื่องมือ "วาดขอบเขต & คำนวณ BEQI" ของนักท่องเที่ยว
   (explore.html) ทุกประการ รวมถึงวาดได้สูงสุด 3 พื้นที่พร้อมกัน — ใช้ assets/js/picker.js ตัวเดียวกัน
   ต่างกันแค่หน้านี้มีปุ่ม "ส่งขอรับรอง" โผล่ในการ์ดผลลัพธ์แต่ละใบ (picker.js เช็คว่ามี
   window.BEQI_SUBMIT_TO_EVALUATOR หรือไม่ก่อนแสดงปุ่ม — ฟังก์ชันนี้แค่บันทึกคิว ส่วนสถานะ
   "ส่งแล้ว" ของการ์ดแต่ละใบ picker.js จัดการ re-render เองผ่าน site.submitted)

   คิวส่งงานไปยังผู้ประเมินเก็บใน localStorage key "beqi_submissions" (ต้นแบบยังไม่มี backend กลาง
   จึงสาธิต flow ผู้ประกอบการ → ผู้ประเมินภายในเบราว์เซอร์เดียวกันเท่านั้น — ดู evaluator-dashboard.js) */
(function(){
  const session = BeqiCore.requireRole('entrepreneur', 'entrepreneur-portal.html');
  if(!session) return;

  document.getElementById('whoami').textContent = session.businessName + ' · ' + session.repName;
  document.getElementById('logoutBtn').addEventListener('click', function(){
    BeqiCore.clearSession();
    window.location.href = 'index.html';
  });

  function loadSubs(){ return JSON.parse(localStorage.getItem('beqi_submissions') || '[]'); }
  function saveSubs(subs){ localStorage.setItem('beqi_submissions', JSON.stringify(subs)); }

  function statusPill(status){
    const cls = status === 'approved' ? 'status-approved' : status === 'revision' ? 'status-revision' : 'status-pending';
    const label = status === 'approved' ? I18N.t('entrepreneur.dashboard.statusApproved')
      : status === 'revision' ? I18N.t('entrepreneur.dashboard.statusRevision')
      : I18N.t('entrepreneur.dashboard.statusPending');
    return '<span class="status-pill ' + cls + '">' + label + '</span>';
  }

  function renderSubmissions(){
    const mine = loadSubs().filter(function(s){ return s.email === session.email; }).reverse();
    document.getElementById('submissionsEmpty').hidden = mine.length > 0;
    document.getElementById('submissionsList').innerHTML = mine.map(function(s){
      const certLine = s.status === 'approved'
        ? '<p class="font-body-md text-sm text-tertiary mt-1">' + I18N.t('entrepreneur.dashboard.certifiedAs') + ' <b>' + (s.certLevel || s.level) + '</b></p>'
        : '';
      return '<div class="organic-border bg-white p-5 flex flex-wrap items-center gap-4">' +
        '<div class="flex-1 min-w-[200px]">' +
        '<div class="flex items-center gap-3">' +
        '<span class="font-display-lg text-[24px] text-primary">' + BeqiCore.fx(s.overall, 1) + '</span>' +
        statusPill(s.status) +
        '</div>' +
        '<p class="font-body-md text-xs text-on-surface-variant mt-1">' + I18N.t('entrepreneur.dashboard.submittedOn') + ' ' + new Date(s.createdAt).toLocaleDateString('th-TH') + '</p>' +
        certLine +
        '</div></div>';
    }).join('');
  }

  window.BEQI_SUBMIT_TO_EVALUATOR = function(site){
    const subs = loadSubs();
    subs.push({
      id: 'sub_' + Date.now(),
      businessName: session.businessName, repName: session.repName, email: session.email, taxId: session.taxId,
      polygon: site.polygon, overall: site.overall, level: site.level, ci: site.ci, norm: site.norm,
      createdAt: new Date().toISOString(), status: 'pending'
    });
    saveSubs(subs);
    renderSubmissions();
  };

  renderSubmissions();
  document.addEventListener('beqi:langchange', renderSubmissions);
})();
