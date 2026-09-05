/* S2.1 — แดชบอร์ดผู้ประกอบการ: หน้าตา/การใช้งานเหมือนเครื่องมือ "วาดขอบเขต & คำนวณ BEQI" ของนักท่องเที่ยว
   (explore.html) ทุกประการ รวมถึงวาดได้สูงสุด 3 พื้นที่พร้อมกัน — ใช้ assets/js/picker.js ตัวเดียวกัน
   ต่างกันแค่หน้านี้มีปุ่ม "ส่งขอรับรอง" โผล่ในการ์ดผลลัพธ์แต่ละใบ (picker.js เช็คว่ามี
   window.BEQI_SUBMIT_TO_EVALUATOR หรือไม่ก่อนแสดงปุ่ม)

   ตามลำดับงาน 4 ขั้นในหัวข้อ 5.3.9 ของดุษฎีนิพนธ์ การส่งขอรับรองเกิดขึ้น "ก่อน" การให้คะแนนตัวชี้วัดที่ 4
   (ผู้ประกอบการส่งหลักฐาน/รูปถ่าย → แบบจำลอง/ผู้ประเมินให้คะแนนทีหลัง) ปุ่ม "ส่งขอรับรอง" ในการ์ดผลลัพธ์
   จึงไม่รอให้ ind4Source==='assessed' ก่อน แต่เปิดหน้าจอ "ตรวจทานก่อนส่ง" ที่นี่แทน — บังคับให้แนบรูปอย่างน้อย
   1 รูปและติ๊กยืนยันว่าตรวจทานข้อมูลแล้ว ก่อนกดส่งจริง สอดคล้องกับหลักการแยกบทบาท "ผู้ขอรับรองเป็นผู้จัดหา
   หลักฐาน ผู้ประเมินเป็นผู้ให้คะแนน" ตามมาตรฐาน ISO/IEC 17065 ที่อ้างถึงในหัวข้อ 5.3.8

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

  const ZONE_LABEL = {North:'North Zone', Central:'Central Zone', South:'South Zone'};

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
      const scoreLabel = s.overall == null ? '--' : BeqiCore.fx(s.overall, 1);
      return '<div class="organic-border bg-white p-5 flex flex-wrap items-center gap-4">' +
        '<div class="flex-1 min-w-[200px]">' +
        '<div class="flex items-center gap-3">' +
        '<span class="font-display-lg text-[24px] text-primary">' + scoreLabel + '</span>' +
        statusPill(s.status) +
        '</div>' +
        '<p class="font-body-md text-xs text-on-surface-variant mt-1">' + I18N.t('entrepreneur.dashboard.submittedOn') + ' ' + new Date(s.createdAt).toLocaleDateString('th-TH') + '</p>' +
        certLine +
        '</div></div>';
    }).join('');
  }

  /* ---------------- ตรวจทานก่อนส่ง (แนบรูป + ยืนยัน) ---------------- */
  let reviewSite=null, reviewBtn=null, reviewPhotos=[];

  function readFileAsDataUrl(file){
    return new Promise(function(resolve){
      const reader=new FileReader();
      reader.onload=function(){ resolve(reader.result); };
      reader.readAsDataURL(file);
    });
  }

  function renderPhotoPreview(){
    document.getElementById('reviewPhotoPreview').innerHTML=reviewPhotos.map(function(p,i){
      return '<img src="'+p+'" style="width:64px;height:64px;object-fit:cover;border-radius:4px;border:1px solid #D9C8B2" data-idx="'+i+'">';
    }).join('');
    refreshConfirmState();
  }

  function refreshConfirmState(){
    const chk=document.getElementById('reviewConfirmChk').checked;
    document.getElementById('reviewConfirmBtn').disabled = !(chk && reviewPhotos.length>0);
  }

  function openReview(site,btn){
    reviewSite=site; reviewBtn=btn; reviewPhotos=[];
    document.getElementById('reviewPhotoInput').value='';
    document.getElementById('reviewPhotoPreview').innerHTML='';
    document.getElementById('reviewConfirmChk').checked=false;
    document.getElementById('reviewError').classList.add('hidden');
    document.getElementById('reviewBusiness').textContent=session.businessName;
    document.getElementById('reviewContact').textContent=session.repName+' · '+session.email+(session.phone?' · '+session.phone:'');
    document.getElementById('reviewZone').textContent=ZONE_LABEL[session.zoneId]||session.zoneId||'--';
    document.getElementById('reviewArea').textContent=BeqiCore.fx(site.norm[0],2)+' green · '+BeqiCore.fx(site.norm[2],2)+' water access (indicators 1 & 3, normalised)';
    refreshConfirmState();
    const section=document.getElementById('submitReview');
    section.hidden=false;
    section.scrollIntoView({behavior:'smooth', block:'start'});
  }

  document.getElementById('reviewPhotoInput').addEventListener('change', function(e){
    Promise.all(Array.from(e.target.files).map(readFileAsDataUrl)).then(function(dataUrls){
      reviewPhotos=reviewPhotos.concat(dataUrls);
      renderPhotoPreview();
    });
  });
  document.getElementById('reviewConfirmChk').addEventListener('change', refreshConfirmState);
  document.getElementById('reviewCancelBtn').addEventListener('click', function(){
    document.getElementById('submitReview').hidden=true;
    reviewSite=null; reviewBtn=null; reviewPhotos=[];
  });
  document.getElementById('reviewConfirmBtn').addEventListener('click', function(){
    if(!reviewSite || !reviewPhotos.length) return;
    const subs=loadSubs();
    subs.push({
      id: 'sub_' + Date.now(),
      businessName: session.businessName, repName: session.repName, email: session.email,
      taxId: session.taxId, phone: session.phone, zoneId: session.zoneId,
      polygon: reviewSite.polygon, overall: reviewSite.overall, level: reviewSite.level,
      ci: reviewSite.ci, norm: reviewSite.norm, ind4Source: reviewSite.ind4Source,
      photos: reviewPhotos,
      createdAt: new Date().toISOString(), status: 'pending'
    });
    saveSubs(subs);
    reviewSite.submitted=true;
    if(window.BEQI_RERENDER_SITES) window.BEQI_RERENDER_SITES();
    document.getElementById('submitReview').hidden=true;
    reviewSite=null; reviewBtn=null; reviewPhotos=[];
    renderSubmissions();
  });

  window.BEQI_SUBMIT_TO_EVALUATOR = function(site, btn){
    openReview(site, btn);
  };

  renderSubmissions();
  document.addEventListener('beqi:langchange', renderSubmissions);
})();
