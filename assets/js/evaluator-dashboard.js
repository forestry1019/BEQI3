/* S3 — Evaluator Dashboard
   คิวรอตรวจอ่านจาก localStorage key "beqi_submissions" ที่ผู้ประกอบการเติมตอนกด "ส่งขอรับรอง"
   ในแดชบอร์ดของตนเอง (entrepreneur-dashboard.html) หลังวาดขอบเขตแปลงจริงแล้วคำนวณผ่าน picker.js
   (ต้นแบบยังไม่มี backend กลาง จึงสาธิต flow ผู้ประกอบการ → ผู้ประเมินภายในเบราว์เซอร์เดียวกัน)
   คะแนน/ตัวชี้วัดเป็นผลคำนวณจริงของแปลงที่ส่งมา (sub.overall/sub.norm/sub.ci) ไม่ใช่ค่าเฉลี่ยของโซนอีกต่อไป */
(function(){
  const session = BeqiCore.getSession();
  if(!session || session.role !== 'evaluator'){
    window.location.href = 'evaluator-portal.html?blocked=1';
    return;
  }
  document.getElementById('sidebarWho').textContent = session.name + ' · ' + session.org;
  document.getElementById('logoutBtn').addEventListener('click', function(){
    BeqiCore.clearSession();
    window.location.href = 'index.html';
  });
  document.querySelectorAll('.comingsoon').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); alert(I18N.t('evaluator.dashboard.comingSoonAlert')); });
  });
  document.addEventListener('beqi:langchange', function(){ renderList(); });

  const IND_LABEL = ['พื้นที่สีเขียว (NDVI≥0.4)','การเชื่อมโยงระบบนิเวศ (PC)','การเข้าถึงแหล่งน้ำ (800ม.)','องค์ประกอบไบโอฟิลิก'];
  const IND_ICON = ['park','hub','water_drop','auto_awesome'];

  function loadSubs(){ return JSON.parse(localStorage.getItem('beqi_submissions') || '[]'); }
  function saveSubs(subs){ localStorage.setItem('beqi_submissions', JSON.stringify(subs)); }

  let D = null, selectedId = null;

  BeqiCore.loadData().then(function(data){
    D = data;
    renderList();
  });

  function fmtLatLng(polygon){
    if(!Array.isArray(polygon) || !polygon.length) return '--';
    const lats = polygon.map(function(p){ return p[1]; }), lngs = polygon.map(function(p){ return p[0]; });
    const clat = lats.reduce(function(a,b){ return a+b; },0)/lats.length;
    const clng = lngs.reduce(function(a,b){ return a+b; },0)/lngs.length;
    return clat.toFixed(4) + '° N, ' + clng.toFixed(4) + '° E';
  }

  function renderList(){
    const subs = loadSubs();
    document.getElementById('reviewEmpty').classList.toggle('hidden', subs.length > 0);
    if(!selectedId && subs.length) selectedId = subs[subs.length - 1].id;
    document.getElementById('reviewList').innerHTML = subs.slice().reverse().map(function(s){
      const active = s.id === selectedId;
      const statusLabel = {
        pending: I18N.t('evaluator.dashboard.statusNew'),
        approved: I18N.t('evaluator.dashboard.statusApproved'),
        revision: I18N.t('evaluator.dashboard.statusRevision')
      }[s.status] || I18N.t('evaluator.dashboard.statusNew');
      return '<div class="bg-surface-container-lowest organic-border rounded p-5 cursor-pointer transition-all" ' +
        'data-id="' + s.id + '" style="' + (active ? 'box-shadow:0 10px 30px rgba(44,107,107,.04);border-left:4px solid #095353' : 'opacity:.75') + '">' +
        '<div class="flex justify-between items-start mb-3">' +
        '<h4 class="font-headline-md text-lg text-andaman-deep' + (active ? ' font-semibold' : '') + '">' + s.businessName + '</h4>' +
        '<span class="bg-surface-container px-2 py-1 rounded text-xs font-label-caps text-on-surface-variant">' + statusLabel + '</span></div>' +
        '<p class="text-sm text-on-surface-variant mb-1">' + s.repName + ' · ' + BeqiCore.fx(s.overall, 1) + '/100</p>' +
        '<p class="text-sm text-on-surface-variant">' + I18N.t('evaluator.dashboard.submittedPrefix') + new Date(s.createdAt).toLocaleDateString('th-TH') + '</p></div>';
    }).join('');
    document.querySelectorAll('#reviewList [data-id]').forEach(function(card){
      card.addEventListener('click', function(){ selectedId = card.dataset.id; renderList(); renderDetail(); });
    });
    renderDetail();
  }

  function renderDetail(){
    const subs = loadSubs();
    const sub = subs.find(function(s){ return s.id === selectedId; });
    const pane = document.getElementById('detailPane');
    if(!sub || !D){
      pane.innerHTML = '<div class="bg-surface-container-lowest organic-border rounded p-8 text-center text-on-surface-variant">' + I18N.t('evaluator.dashboard.selectPrompt') + '</div>';
      return;
    }
    const rules = D.meta.cert_rules;
    const currentCert = BeqiCore.certLevel(sub.overall, sub.norm, rules);

    pane.innerHTML =
      '<div class="relative bg-surface-container-lowest organic-border rounded overflow-hidden p-8 flex flex-col items-center justify-center min-h-[280px]">' +
      '<div class="relative z-10 text-center space-y-4">' +
      '<h2 class="font-headline-md text-2xl text-andaman-deep mb-2">' + sub.businessName + '</h2>' +
      '<p class="font-label-caps text-on-surface-variant tracking-widest">' + I18N.t('evaluator.dashboard.scoreCaption') + fmtLatLng(sub.polygon) + ')</p>' +
      '<div class="text-7xl font-display-lg text-primary tracking-tighter">' + BeqiCore.fx(sub.overall, 0) + '<span class="text-3xl text-outline">/100</span></div>' +
      (sub.ci ? '<p class="font-data-viz text-data-viz text-on-surface-variant">' + I18N.t('evaluator.dashboard.ciLabel') + ' ' + BeqiCore.fx(sub.ci.lo,1) + ' – ' + BeqiCore.fx(sub.ci.hi,1) + '</p>' : '') +
      '<div class="w-full max-w-md mx-auto flex justify-between text-xs font-data-viz text-on-surface-variant mt-4">' +
      '<span>' + I18N.t('evaluator.dashboard.scalePoor') + '</span><span>' + I18N.t('evaluator.dashboard.scaleModerate') + '</span><span>' + I18N.t('evaluator.dashboard.scaleExcellent') + '</span></div>' +
      '<div class="w-full max-w-md mx-auto h-2 bg-surface-container-high rounded overflow-hidden">' +
      '<div class="h-full bg-primary" style="width:' + Math.min(sub.overall, 100) + '%"></div></div></div></div>' +

      '<div class="bg-surface-container-lowest organic-border rounded p-8">' +
      '<h3 class="font-label-caps text-label-caps text-primary border-b border-limestone-gray pb-4 mb-6 uppercase tracking-widest">' + I18N.t('evaluator.dashboard.metricsHeading') + '</h3>' +
      '<div class="overflow-x-auto"><table class="w-full text-left border-collapse">' +
      '<thead><tr class="font-label-caps text-xs text-on-surface-variant border-b border-limestone-gray">' +
      '<th class="py-3 px-4 font-normal">' + I18N.t('evaluator.dashboard.colMetric') + '</th><th class="py-3 px-4 font-normal">' + I18N.t('evaluator.dashboard.colSubmission') + '</th>' +
      '<th class="py-3 px-4 font-normal">' + I18N.t('evaluator.dashboard.colStandardPrefix') + currentCert.level + ')</th><th class="py-3 px-4 font-normal text-right">' + I18N.t('evaluator.dashboard.colVariance') + '</th></tr></thead>' +
      '<tbody class="font-body-md text-sm">' +
      sub.norm.map(function(v, i){
        const minInd = currentCert.min_ind || rules[rules.length - 1].min_ind;
        const variance = v - minInd;
        const flagged = variance < 0;
        return '<tr class="border-b border-limestone-gray/50 hover:bg-surface-bright transition-colors">' +
          '<td class="py-4 px-4 font-medium flex items-center gap-2"><span class="material-symbols-outlined text-tertiary">' + IND_ICON[i] + '</span> ' + IND_LABEL[i] + '</td>' +
          '<td class="py-4 px-4">' + BeqiCore.fx(v, 3) + '</td>' +
          '<td class="py-4 px-4">≥ ' + BeqiCore.fx(minInd, 2) + '</td>' +
          '<td class="py-4 px-4 text-right ' + (flagged ? 'text-coral-warmth font-semibold' : 'text-tertiary') + '">' +
          (flagged ? '' : '+') + BeqiCore.fx(variance, 3) + (flagged ? I18N.t('evaluator.dashboard.flaggedSuffix') : '') + '</td></tr>';
      }).join('') + '</tbody></table></div></div>' +

      '<div class="bg-surface-container-lowest organic-border rounded p-8">' +
      '<h3 class="font-label-caps text-label-caps text-primary border-b border-limestone-gray pb-4 mb-6 uppercase tracking-widest">' + I18N.t('evaluator.dashboard.certHeading') + '</h3>' +
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" id="certRadios">' +
      rules.map(function(r){
        const isSel = r.level === currentCert.level;
        return '<label class="cursor-pointer relative"><input class="peer sr-only" name="certification" type="radio" value="' + r.level + '"' + (isSel ? ' checked' : '') + '>' +
          '<div class="organic-border rounded p-6 text-center transition-all ' + (isSel ? 'bg-surface-container border-primary shadow-sm' : 'hover:bg-surface-bright') + '">' +
          '<div class="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-dim border border-outline flex items-center justify-center">' +
          '<span class="material-symbols-outlined text-outline">workspace_premium</span></div>' +
          '<h4 class="font-headline-md text-md text-andaman-deep">' + r.level + '</h4>' +
          '<p class="text-xs text-on-surface-variant mt-2 font-data-viz">' + I18N.t('evaluator.dashboard.scorePrefix') + r.min_score + '+ · ' + I18N.t('evaluator.dashboard.minPrefix') + BeqiCore.fx(r.min_ind, 2) + '</p></div></label>';
      }).join('') +
      '</div>' +
      '<p class="text-sm text-on-surface-variant mb-4" id="decisionNote">' +
      (sub.status === 'approved' ? I18N.t('evaluator.dashboard.decisionApprovedPrefix') + (sub.certLevel || currentCert.level) :
       sub.status === 'revision' ? I18N.t('evaluator.dashboard.decisionRevision') : I18N.t('evaluator.dashboard.decisionPending')) + '</p>' +
      '<div class="flex justify-end gap-4 border-t border-limestone-gray pt-6">' +
      '<button id="btnRevision" class="font-label-caps text-label-caps border border-primary text-primary px-6 py-3 rounded hover:bg-surface-container-high transition-all">' + I18N.t('evaluator.dashboard.btnRevision') + '</button>' +
      '<button id="btnApprove" class="font-label-caps text-label-caps bg-primary text-on-primary px-6 py-3 rounded hover:bg-primary-container transition-all">' + I18N.t('evaluator.dashboard.btnApprove') + '</button>' +
      '</div></div>';

    document.getElementById('btnApprove').addEventListener('click', function(){
      const chosen = document.querySelector('input[name="certification"]:checked').value;
      updateSub(sub.id, {status: 'approved', certLevel: chosen});
    });
    document.getElementById('btnRevision').addEventListener('click', function(){
      updateSub(sub.id, {status: 'revision'});
    });
  }

  function updateSub(id, patch){
    const subs = loadSubs();
    const idx = subs.findIndex(function(s){ return s.id === id; });
    if(idx >= 0){ Object.assign(subs[idx], patch); saveSubs(subs); }
    renderList();
  }
})();
