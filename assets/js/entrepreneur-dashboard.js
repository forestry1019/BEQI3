/* S2.1 — แดชบอร์ดผู้ประกอบการ: หน้าตา/การใช้งานเหมือนเครื่องมือ "วาดขอบเขต & คำนวณ BEQI" ของนักท่องเที่ยว
   (explore.html) ทุกประการ รวมถึงวาดได้สูงสุด 3 พื้นที่พร้อมกัน — ใช้ assets/js/picker.js ตัวเดียวกัน
   ต่างกันแค่หน้านี้มีปุ่ม "ส่งขอรับรอง" โผล่ในการ์ดผลลัพธ์แต่ละใบ (picker.js เช็คว่ามี
   window.BEQI_SUBMIT_TO_EVALUATOR หรือไม่ก่อนแสดงปุ่ม)

   ตามลำดับงาน 4 ขั้นในหัวข้อ 5.3.9 ของดุษฎีนิพนธ์ การส่งขอรับรองเกิดขึ้น "ก่อน" การให้คะแนนตัวชี้วัดที่ 4
   ปุ่ม "ส่งขอรับรอง" จึงเปิดหน้าจอ "ตรวจทานก่อนส่ง" ซึ่งบังคับตามลำดับ: (1) แนบรูปอย่างน้อย 1 รูป
   (2) ให้คะแนนตัวชี้วัดที่ 4 ครบทั้ง 14 รูปแบบผ่าน rubric ของ Kellert & Calabrese (2015) พร้อมเหตุผล
   ประกอบทุกข้อ (คำนวณคะแนนสดให้เห็นทันที) (3) ติ๊กยืนยันว่าตรวจทานแล้ว — ครบทั้ง 3 อย่างถึงส่งได้จริง
   คะแนนนี้เป็นเพียง "คะแนนตั้งต้นที่ผู้ขอรับรองประเมินตนเอง" ผู้ประเมิน (evaluator-dashboard.js) จะเห็น
   รายละเอียดคะแนน+เหตุผลทุกข้อ และเป็นผู้ตัดสินขั้นสุดท้ายว่าจะอนุมัติหรือขอแก้ไข ตามหลัก ISO/IEC 17065
   ที่อ้างถึงในหัวข้อ 5.3.8 (ผู้ขอรับรองเป็นผู้จัดหาหลักฐาน ผู้ประเมินเป็นผู้ตัดสิน)

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
  const lang = () => (typeof I18N !== 'undefined' ? I18N.getLang() : 'en');

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

  /* ---------------- Rubric: 14 Patterns of Biophilic Design (Browning et al., 2014; Kellert & Calabrese, 2015) ----------------
     ข้อความตรงกับตารางที่ 4/5 ของดุษฎีนิพนธ์ทุกตัวอักษร (ดู server/BEQI_Indicator4_14Patterns.xlsx) */
  const PATTERNS=[
    {n:1,cat:'A',onsite:false,en:'Visual Connection with Nature',th:'การเชื่อมโยงด้วยสายตากับธรรมชาติ',
     c:[{en:'No vegetation or water body visible in the frame',th:'ไม่ปรากฏพืชพรรณหรือผืนน้ำในเฟรมภาพ'},
        {en:'Vegetation as a decorative border, covering less than 1/4 of the frame',th:'พืชพรรณเป็นแนวประดับ ครอบคลุมน้อยกว่าหนึ่งในสี่ของเฟรม'},
        {en:'Vegetation or water covers more than half the frame, visible from the main use area',th:'พืชพรรณหรือผืนน้ำครอบคลุมมากกว่าครึ่งเฟรม และมองเห็นได้จากจุดใช้งานหลัก'}]},
    {n:2,cat:'A',onsite:true,en:'Non-Visual Connection',th:'การเชื่อมโยงโดยปราศจากการมองเห็น',
     c:[{en:'No sound/smell/texture-generating structure found',th:'ไม่พบโครงสร้างกำเนิดเสียง กลิ่น หรือผิวสัมผัส'},
        {en:'One element found, e.g. a small fountain',th:'พบหนึ่งองค์ประกอบ เช่น น้ำพุขนาดเล็ก'},
        {en:'Two or more sensory channels found in the same area',th:'พบตั้งแต่สองช่องทางประสาทสัมผัสขึ้นไปในบริเวณเดียวกัน'}]},
    {n:3,cat:'A',onsite:false,en:'Non-Rhythmic Sensory Stimuli',th:'สิ่งเร้าทางประสาทสัมผัสแบบไม่เป็นจังหวะ',
     c:[{en:'No naturally moving elements found',th:'ไม่พบองค์ประกอบที่เคลื่อนไหวตามธรรมชาติ'},
        {en:'Leaf shadows or plant movement visible in frame',th:'พบเงาใบไม้หรือการเคลื่อนไหวของพืชพรรณในเฟรม'},
        {en:'Natural moving element at a position where users linger',th:'พบองค์ประกอบเคลื่อนไหวตามธรรมชาติในตำแหน่งที่ผู้ใช้อยู่เป็นเวลานาน'}]},
    {n:4,cat:'A',onsite:false,en:'Thermal & Airflow Variability',th:'ความแปรผันของอุณหภูมิและการไหลของอากาศ',
     c:[{en:'Enclosed building, no openings',th:'อาคารปิดทึบ ไม่มีช่องเปิด'},
        {en:'Openings or louvers allowing airflow',th:'พบช่องเปิดหรือระแนงที่เอื้อให้ลมผ่าน'},
        {en:'Deliberate shade/airflow design creating perceptible temperature contrast',th:'พบการออกแบบร่มเงาและช่องลมที่จงใจสร้างความต่างของอุณหภูมิที่รับรู้ได้'}]},
    {n:5,cat:'A',onsite:false,en:'Presence of Water',th:'การมีอยู่ของน้ำ',
     c:[{en:'No water body found',th:'ไม่พบผืนน้ำ'},
        {en:'Small or temporary water feature',th:'พบองค์ประกอบน้ำขนาดเล็กหรือชั่วคราว'},
        {en:'Permanent water body continuously visible from the main use area',th:'พบผืนน้ำถาวรที่มองเห็นต่อเนื่องจากพื้นที่ใช้งานหลัก'}]},
    {n:6,cat:'A',onsite:false,en:'Dynamic & Diffuse Light',th:'แสงพลวัตและแสงกระจาย',
     c:[{en:'Uniform artificial lighting throughout',th:'ใช้แสงประดิษฐ์สม่ำเสมอทั้งพื้นที่'},
        {en:'Natural light filtering in some areas',th:'พบการกรองแสงธรรมชาติบางบริเวณ'},
        {en:'Light filtered through canopy or louvers in the main use area',th:'พบการกรองแสงผ่านเรือนยอดหรือระแนงในพื้นที่ใช้งานหลัก'}]},
    {n:7,cat:'A',onsite:true,en:'Connection to Natural Systems',th:'การเชื่อมต่อกับระบบธรรมชาติ',
     c:[{en:'No ecological water-management structure found',th:'ไม่พบโครงสร้างจัดการน้ำเชิงนิเวศ'},
        {en:'Small bioswale or infiltration bed',th:'พบรางระบายน้ำชีวภาพหรือแปลงซึมน้ำขนาดเล็ก'},
        {en:'Visible, explainable rainwater-harvesting system',th:'พบระบบกักเก็บน้ำฝนที่ออกแบบให้มองเห็นและอธิบายได้'}]},
    {n:8,cat:'B',onsite:false,en:'Biomorphic Forms & Patterns',th:'รูปทรงและรูปแบบชีวภาพ',
     c:[{en:'All straight lines and right angles',th:'โครงสร้างใช้เส้นตรงและมุมฉากทั้งหมด'},
        {en:'Curves in secondary elements, e.g. a pavilion or walkway',th:'พบเส้นโค้งในองค์ประกอบรอง เช่น ศาลาหรือทางเดิน'},
        {en:'Curves or spiral (Fibonacci) proportions in the main building structure',th:'พบเส้นโค้งหรือสัดส่วนแบบก้นหอยในโครงสร้างหลักของอาคาร'}]},
    {n:9,cat:'B',onsite:false,en:'Material Connection with Nature',th:'การเชื่อมโยงวัสดุกับธรรมชาติ',
     c:[{en:'Main structure entirely synthetic materials',th:'โครงสร้างหลักเป็นวัสดุสังเคราะห์ทั้งหมด'},
        {en:'Local materials used as surface decoration',th:'ใช้วัสดุพื้นถิ่นเป็นวัสดุตกแต่งผิว'},
        {en:'Minimally-processed local materials in the main structure, e.g. logs, natural stone, thatch roof',th:'ใช้วัสดุพื้นถิ่นแปรรูปขั้นต่ำในโครงสร้างหลัก เช่น ไม้ท่อน หินธรรมชาติ หลังคามุงจาก'}]},
    {n:10,cat:'B',onsite:false,en:'Complexity & Order',th:'ความซับซ้อนอย่างมีระเบียบ',
     c:[{en:'Smooth surface, no pattern',th:'พื้นผิวเรียบไม่มีลวดลาย'},
        {en:'Repeating pattern in a single plane',th:'พบลวดลายซ้ำในระนาบเดียว'},
        {en:'Fractal-like geometric pattern with hierarchy across two or more planes',th:'พบลวดลายเรขาคณิตย่อยที่มีลำดับชั้นตั้งแต่สองระนาบขึ้นไป'}]},
    {n:11,cat:'C',onsite:false,en:'Prospect',th:'มุมมองแบบคาดการณ์',
     c:[{en:'Visibility blocked in all directions',th:'ทัศนวิสัยถูกปิดกั้นในทุกทิศ'},
        {en:'Visibility open up to 6 metres',th:'เปิดทัศนวิสัยได้ไม่เกิน 6 เมตร'},
        {en:'Elevated deck/terrace opening visibility beyond 6 metres',th:'พบระเบียงหรือลานยกระดับที่เปิดทัศนวิสัยเกิน 6 เมตร'}]},
    {n:12,cat:'C',onsite:false,en:'Refuge',th:'พื้นที่หลบภัย',
     c:[{en:'No area protected from above and behind',th:'ไม่มีพื้นที่ที่ปกป้องด้านบนและด้านหลัง'},
        {en:'Roofed but open on all sides',th:'มีหลังคาคลุมแต่เปิดโล่งรอบด้าน'},
        {en:'Pavilion/alcove protected above and behind, with seating',th:'มีศาลาหรือซุ้มที่ปกป้องทั้งด้านบนและด้านหลัง พร้อมที่นั่ง'}]},
    {n:13,cat:'C',onsite:true,en:'Mystery',th:'ความลึกลับ',
     c:[{en:'Entire path visible from the start',th:'เห็นปลายทางเดินได้ทั้งหมดตั้งแต่ต้นทาง'},
        {en:'Path partially obscured by vegetation',th:'ทางเดินถูกบังบางส่วนด้วยพืชพรรณ'},
        {en:'Curved path obscured, view continuously hidden ahead',th:'ทางเดินโค้งถูกบังจนเกิดการบดบังทัศนวิสัยล่วงหน้าตลอดเส้นทาง'}]},
    {n:14,cat:'C',onsite:true,en:'Risk / Peril',th:'ความเสี่ยงหรือภัยอันตรายจำลอง',
     c:[{en:'Not found',th:'ไม่พบ'},
        {en:'Elevated structure with a safety railing',th:'พบโครงสร้างยกระดับที่มีราวกันตก'},
        {en:'Structure creating a clear sense of risk with a visible safeguard',th:'พบโครงสร้างที่สร้างความรู้สึกเสี่ยงชัดเจนพร้อมกลไกป้องกันที่มองเห็นได้'}]}
  ];
  const CAT_LABEL={A:{en:'A. Nature in the Space',th:'ก. ธรรมชาติในพื้นที่'},B:{en:'B. Natural Analogues',th:'ข. แบบจำลองธรรมชาติ'},C:{en:'C. Nature of the Space',th:'ค. ธรรมชาติของพื้นที่'}};

  let rubricAnswers={}; // {n: {score, note}}

  function renderRubric(){
    const l=lang();
    const html=['A','B','C'].map(function(cat){
      const rows=PATTERNS.filter(function(p){ return p.cat===cat; }).map(function(p){
        const ans=rubricAnswers[p.n]||{score:null,note:''};
        const onsiteTag=p.onsite?' <span class="text-coral-warmth">('+I18N.t('entrepreneur.dashboard.rubric.onsiteTag')+')</span>':'';
        const options=[0,1,2].map(function(score){
          const checked=ans.score===score?' checked':'';
          return '<label class="flex items-start gap-2 text-xs cursor-pointer p-2 organic-border '+(ans.score===score?'bg-surface-container-low border-primary':'')+'">'+
            '<input type="radio" name="rub_'+p.n+'" value="'+score+'"'+checked+' class="mt-0.5">'+
            '<span><b>'+score+'</b> — '+p.c[score][l]+'</span></label>';
        }).join('');
        return '<div class="organic-border p-4">'+
          '<p class="font-body-md text-sm font-semibold text-andaman-deep mb-2">'+p.n+'. '+p[l]+onsiteTag+'</p>'+
          '<div class="grid grid-cols-1 gap-2 mb-2">'+options+'</div>'+
          '<input type="text" data-note="'+p.n+'" placeholder="'+I18N.t('entrepreneur.dashboard.rubric.notePlaceholder')+'" value="'+(ans.note||'').replace(/"/g,'&quot;')+'" class="w-full text-xs border-0 border-b border-limestone-gray focus:ring-0 focus:border-primary bg-transparent py-1">'+
          '</div>';
      }).join('');
      return '<div><h4 class="font-label-caps text-label-caps text-outline mb-2">'+CAT_LABEL[cat][l]+'</h4><div class="flex flex-col gap-3">'+rows+'</div></div>';
    }).join('<div class="border-t border-limestone-gray my-2"></div>');
    document.getElementById('rubricList').innerHTML=html;

    document.querySelectorAll('#rubricList input[type=radio]').forEach(function(r){
      r.addEventListener('change', function(){
        const n=+r.name.split('_')[1];
        rubricAnswers[n]=rubricAnswers[n]||{score:null,note:''};
        rubricAnswers[n].score=+r.value;
        renderRubric();
      });
    });
    document.querySelectorAll('#rubricList input[data-note]').forEach(function(inp){
      inp.addEventListener('input', function(){
        const n=+inp.dataset.note;
        rubricAnswers[n]=rubricAnswers[n]||{score:null,note:''};
        rubricAnswers[n].note=inp.value;
        refreshConfirmState();
      });
    });
    updateRubricScoreLine();
    refreshConfirmState();
  }

  function rubricComplete(){
    return PATTERNS.every(function(p){
      const a=rubricAnswers[p.n];
      return a && (a.score===0||a.score===1||a.score===2) && a.note && a.note.trim().length>0;
    });
  }
  function rubricRawScore(){
    return PATTERNS.reduce(function(sum,p){ const a=rubricAnswers[p.n]; return sum+(a&&a.score!=null?a.score:0); },0);
  }
  function updateRubricScoreLine(){
    const raw=rubricRawScore();
    document.getElementById('rubricScoreLine').textContent=raw+' / 28 ('+(raw/28).toFixed(2)+')';
  }

  /* ---------------- ตรวจทานก่อนส่ง (แนบรูป → ให้คะแนน rubric → ยืนยัน) ---------------- */
  let reviewSite=null, reviewPhotos=[];

  function readFileAsDataUrl(file){
    return new Promise(function(resolve){
      const reader=new FileReader();
      reader.onload=function(){ resolve(reader.result); };
      reader.readAsDataURL(file);
    });
  }

  function renderPhotoPreview(){
    document.getElementById('reviewPhotoPreview').innerHTML=reviewPhotos.map(function(p){
      return '<img src="'+p+'" style="width:64px;height:64px;object-fit:cover;border-radius:4px;border:1px solid #D9C8B2">';
    }).join('');
    const rubricBox=document.getElementById('reviewRubric');
    rubricBox.hidden = reviewPhotos.length===0;
    if(reviewPhotos.length>0) renderRubric();
    refreshConfirmState();
  }

  function refreshConfirmState(){
    const chk=document.getElementById('reviewConfirmChk').checked;
    document.getElementById('reviewConfirmBtn').disabled = !(chk && reviewPhotos.length>0 && rubricComplete());
  }

  function openReview(site){
    reviewSite=site; reviewPhotos=[]; rubricAnswers={};
    document.getElementById('reviewPhotoInput').value='';
    document.getElementById('reviewPhotoPreview').innerHTML='';
    document.getElementById('reviewRubric').hidden=true;
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
    reviewSite=null; reviewPhotos=[]; rubricAnswers={};
  });
  document.getElementById('reviewConfirmBtn').addEventListener('click', function(){
    if(!reviewSite || !reviewPhotos.length || !rubricComplete()) return;
    const ind4Raw=rubricRawScore();
    const ind4Norm=ind4Raw/28;
    const norm4=reviewSite.norm.slice(0,3).concat([ind4Norm]);
    const overall=norm4.reduce(function(a,b){ return a+b; },0)/norm4.length*100;
    const patternScores=PATTERNS.map(function(p){
      return {n:p.n, name_en:p.en, name_th:p.th, onsite:p.onsite, score:rubricAnswers[p.n].score, note:rubricAnswers[p.n].note};
    });
    const subs=loadSubs();
    subs.push({
      id: 'sub_' + Date.now(),
      businessName: session.businessName, repName: session.repName, email: session.email,
      taxId: session.taxId, phone: session.phone, zoneId: session.zoneId,
      polygon: reviewSite.polygon, overall: overall, level: null, ci: null, norm: norm4,
      ind4Source: 'assessed', ind4Level: 'A', ind4Raw: ind4Raw, ind4AssessedPatterns: 14,
      ind4AssessedDate: new Date().toISOString(), patternScores: patternScores,
      photos: reviewPhotos,
      createdAt: new Date().toISOString(), status: 'pending'
    });
    saveSubs(subs);
    reviewSite.submitted=true;
    if(window.BEQI_RERENDER_SITES) window.BEQI_RERENDER_SITES();
    document.getElementById('submitReview').hidden=true;
    reviewSite=null; reviewPhotos=[]; rubricAnswers={};
    renderSubmissions();
  });

  window.BEQI_SUBMIT_TO_EVALUATOR = function(site){
    openReview(site);
  };

  renderSubmissions();
  document.addEventListener('beqi:langchange', function(){
    renderSubmissions();
    if(!document.getElementById('reviewRubric').hidden) renderRubric();
  });
})();
