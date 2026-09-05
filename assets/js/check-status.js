/* check-status.html — ให้ผู้ประกอบการตรวจสอบผลการประเมินได้เองด้วยเลขที่ใบสมัคร + PIN โดยไม่ต้องล็อกอิน
   เรียก Cloud Function checkStatus (server/index.js) ตรง ๆ จากเบราว์เซอร์ — public endpoint, กันด้วย
   PIN 6 หลักที่สุ่มมาคู่กับเลขที่ใบสมัครตอนส่ง (ดู assets/js/entrepreneur-dashboard.js) */
(function(){
  const API = (typeof BEQI_API_CONFIG !== 'undefined') ? BEQI_API_CONFIG : null;
  const ZONE_KEY = {North: 'checkstatus.zoneNorth', Central: 'checkstatus.zoneCentral', South: 'checkstatus.zoneSouth'};

  const form = document.getElementById('statusForm');
  const errEl = document.getElementById('statusError');
  const btn = document.getElementById('statusSubmitBtn');
  const resultEl = document.getElementById('statusResult');

  function statusPillClass(status){
    return status === 'approved' ? 'status-approved' : status === 'revision' ? 'status-revision' : 'status-pending';
  }
  function statusLabel(status){
    return status === 'approved' ? I18N.t('entrepreneur.dashboard.statusApproved')
      : status === 'revision' ? I18N.t('entrepreneur.dashboard.statusRevision')
      : I18N.t('entrepreneur.dashboard.statusPending');
  }

  function showResult(sub){
    document.getElementById('resBusiness').textContent = sub.businessName;
    const pill = document.getElementById('resStatusPill');
    pill.className = 'status-pill ' + statusPillClass(sub.status);
    pill.textContent = statusLabel(sub.status);
    document.getElementById('resZone').textContent = ZONE_KEY[sub.zoneId] ? I18N.t(ZONE_KEY[sub.zoneId]) : (sub.zoneId || '--');
    document.getElementById('resDate').textContent = new Date(sub.createdAt).toLocaleDateString('th-TH');
    document.getElementById('resScore').textContent = sub.overall == null ? '--' : BeqiCore.fx(sub.overall, 1) + ' / 100';
    document.getElementById('resScoreCaption').textContent = sub.status === 'approved'
      ? I18N.t('checkstatus.resultScoreCaptionApproved')
      : I18N.t('checkstatus.resultScoreCaption');
    const certLine = document.getElementById('resCertLine');
    if(sub.status === 'approved' && sub.certLevel){
      certLine.textContent = I18N.t('entrepreneur.dashboard.certifiedAs') + ' ' + sub.certLevel;
      certLine.classList.remove('hidden');
    }else{
      certLine.classList.add('hidden');
    }
    form.hidden = true;
    resultEl.hidden = false;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    errEl.classList.add('hidden');
    const id = document.getElementById('inId').value.trim().toUpperCase();
    const pin = document.getElementById('inPin').value.trim();
    if(!id || !pin){
      errEl.textContent = I18N.t('checkstatus.errRequired');
      errEl.classList.remove('hidden');
      return;
    }
    if(!API || !API.statusUrl){
      errEl.textContent = I18N.t('checkstatus.errNetwork');
      errEl.classList.remove('hidden');
      return;
    }
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = I18N.t('checkstatus.checking');
    fetch(API.statusUrl + '?id=' + encodeURIComponent(id) + '&pin=' + encodeURIComponent(pin))
      .then(function(r){
        if(r.status === 404) throw {notFound: true};
        if(!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(sub){
        showResult(sub);
      })
      .catch(function(e){
        errEl.textContent = e && e.notFound ? I18N.t('checkstatus.errNotFound') : I18N.t('checkstatus.errNetwork');
        errEl.classList.remove('hidden');
      })
      .finally(function(){
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      });
  });

  document.getElementById('newSearchBtn').addEventListener('click', function(){
    resultEl.hidden = true;
    form.hidden = false;
    document.getElementById('inId').value = '';
    document.getElementById('inPin').value = '';
  });
})();
