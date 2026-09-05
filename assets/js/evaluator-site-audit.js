/* S3.1 — Site Audit: ระบบตรวจสอบภาคสนามสำหรับตัวชี้วัดที่ 4 (องค์ประกอบไบโอฟิลิก)
   เดิม (README เก่า) บันทึกไว้ว่ายังไม่มีระบบรองรับ FR3 — หน้านี้คือการเติมส่วนที่ขาดนั้น
   คะแนน 3 เกณฑ์ (Materiality/Soundscape/Thermal Comfort เฉลี่ย /10) แทนที่ norm[3] เดิม (ประมาณจากดาวเทียม)
   แล้วคำนวณ BEQI รวมใหม่ด้วยน้ำหนักเดิมจาก meta.weights — ผลลัพธ์เก็บไว้ใน localStorage เท่านั้น (ต้นแบบ) */
(function(){
  const session = BeqiCore.getSession();
  if(!session || session.role !== 'evaluator'){
    window.location.href = 'evaluator-portal.html?blocked=1';
    return;
  }
  document.getElementById('sidebarWho').textContent = session.name;
  document.getElementById('logoutBtn').addEventListener('click', function(){
    BeqiCore.clearSession();
    window.location.href = 'index.html';
  });

  const IND_LABEL = ['พื้นที่สีเขียว','การเชื่อมโยง','การเข้าถึงน้ำ','องค์ประกอบไบโอฟิลิก (ภาคสนาม)'];

  function loadAudits(){ return JSON.parse(localStorage.getItem('beqi_site_audits') || '{}'); }
  function saveAudits(a){ localStorage.setItem('beqi_site_audits', JSON.stringify(a)); }

  let D = null, zones = [], selectedZoneId = null;

  BeqiCore.loadData().then(function(data){
    D = data; zones = data.zones;
    selectedZoneId = zones[0].id;
    renderList();
    wireSliders();
    loadIntoForm();
  });
  document.addEventListener('beqi:langchange', function(){ if(D) { renderList(); updateGauge(); } });

  function renderList(){
    const audits = loadAudits();
    document.getElementById('assessmentList').innerHTML = zones.map(function(z){
      const a = audits[z.id];
      const status = a ? a.status : 'not_started';
      const dotColor = {committed: '#94d1d1', draft: '#ff5a52', not_started: '#e4e2de'}[status];
      const label = {
        committed: I18N.t('evaluator.audit.statusCompleted'),
        draft: I18N.t('evaluator.audit.statusInProgress'),
        not_started: I18N.t('evaluator.audit.statusNotStarted')
      }[status];
      const active = z.id === selectedZoneId;
      return '<div class="flex items-center justify-between p-4 border rounded hover:bg-surface-container-low transition-colors cursor-pointer" ' +
        'data-zone="' + z.id + '" style="border-color:' + (active ? '#095353' : 'rgba(217,200,178,.5)') + '">' +
        '<div class="flex items-start gap-4"><div class="mt-1 h-3 w-3 rounded-full" style="background:' + dotColor + '"></div>' +
        '<div><h4 class="font-body-md font-medium text-andaman-deep">' + z.name_th + I18N.t('evaluator.audit.siteAuditSuffix') + '</h4>' +
        '<p class="font-data-viz text-data-viz text-on-surface-variant mt-1">' + z.sub_th + '</p></div></div>' +
        '<span class="font-label-caps text-label-caps text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded">' + label + '</span></div>';
    }).join('');
    document.querySelectorAll('#assessmentList [data-zone]').forEach(function(row){
      row.addEventListener('click', function(){ selectedZoneId = row.dataset.zone; renderList(); loadIntoForm(); });
    });
  }

  function wireSliders(){
    ['Materiality', 'Soundscape', 'Thermal'].forEach(function(key){
      document.getElementById('slider' + key).addEventListener('input', function(){
        document.getElementById('val' + key).textContent = Number(this.value).toFixed(1);
        updateGauge();
      });
    });
    document.getElementById('btnSaveDraft').addEventListener('click', function(){ persist('draft'); });
    document.getElementById('btnCommit').addEventListener('click', function(){ persist('committed'); });
  }

  function loadIntoForm(){
    const zone = zones.find(function(z){ return z.id === selectedZoneId; });
    document.getElementById('auditSiteLabel').textContent = zone.name_th;
    const audits = loadAudits();
    const a = audits[selectedZoneId] || {materiality: 5, soundscape: 5, thermal: 5};
    document.getElementById('sliderMateriality').value = a.materiality;
    document.getElementById('sliderSoundscape').value = a.soundscape;
    document.getElementById('sliderThermal').value = a.thermal;
    document.getElementById('valMateriality').textContent = Number(a.materiality).toFixed(1);
    document.getElementById('valSoundscape').textContent = Number(a.soundscape).toFixed(1);
    document.getElementById('valThermal').textContent = Number(a.thermal).toFixed(1);
    document.getElementById('auditSavedNote').classList.add('hidden');
    updateGauge();
  }

  function currentNorm(){
    const zone = zones.find(function(z){ return z.id === selectedZoneId; });
    const materiality = +document.getElementById('sliderMateriality').value;
    const soundscape = +document.getElementById('sliderSoundscape').value;
    const thermal = +document.getElementById('sliderThermal').value;
    const ind4 = (materiality + soundscape + thermal) / 30; // เฉลี่ย 3 เกณฑ์ (เต็ม 10) -> สัดส่วน 0-1
    const norm = zone.norm.slice(0, 3).concat([ind4]);
    return {zone, norm, materiality, soundscape, thermal};
  }

  function updateGauge(){
    const {norm} = currentNorm();
    const score = norm.reduce(function(a, b){ return a + b; }, 0) / norm.length * 100;
    document.getElementById('auditGaugeScore').textContent = BeqiCore.fx(score, 0);
    const circumference = 2 * Math.PI * 45;
    document.getElementById('auditGaugeCircle').style.strokeDashoffset = circumference * (1 - Math.min(score, 100) / 100);
    document.getElementById('auditIntegrity').textContent = score >= 71 ? I18N.t('evaluator.audit.integrityExcellent') : score >= 41 ? I18N.t('evaluator.audit.integrityFavorable') : I18N.t('evaluator.audit.integrityNeeds');
    document.getElementById('auditIndicatorBars').innerHTML = norm.map(function(v, i){
      return '<div><div class="flex justify-between text-xs font-data-viz text-on-surface-variant mb-1"><span>' + IND_LABEL[i] + '</span><span>' + BeqiCore.fx(v, 3) + '</span></div>' +
        '<div class="h-1.5 bg-surface-container-high rounded overflow-hidden"><div class="h-full bg-primary" style="width:' + (v * 100) + '%"></div></div></div>';
    }).join('');
  }

  function persist(status){
    const {zone, materiality, soundscape, thermal} = currentNorm();
    const audits = loadAudits();
    audits[zone.id] = {materiality, soundscape, thermal, status, updatedAt: new Date().toISOString(), evaluator: session.name};
    saveAudits(audits);
    renderList();
    const note = document.getElementById('auditSavedNote');
    note.textContent = status === 'committed'
      ? I18N.t('evaluator.audit.savedCommittedPrefix') + zone.name_th + I18N.t('evaluator.audit.savedCommittedSuffix')
      : I18N.t('evaluator.audit.savedDraft');
    note.className = status === 'committed' ? 'text-sm text-primary' : 'text-sm text-outline';
    note.classList.remove('hidden');
  }
})();
