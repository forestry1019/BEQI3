/* S2.1 — แดชบอร์ดผู้ประกอบการ: ใช้เครื่องมือ "วาดขอบเขต & คำนวณ BEQI" ร่วมกับหน้านักท่องเที่ยว
   (explore.html) ผ่าน assets/js/picker.js ตัวเดียวกัน แต่จำกัดให้วาดได้เพียง 1 แปลง (window.BEQI_MAX_SITES=1
   ตั้งไว้ใน entrepreneur-dashboard.html) เพราะผู้ประกอบการมีสถานประกอบการเดียว ไม่ต้องเปรียบเทียบหลายแปลง
   เหมือนนักท่องเที่ยว — และมีปุ่ม "ส่งขอรับรอง" เดียวโผล่ท้ายรายการการ์ด (picker.js เช็คว่ามี
   window.BEQI_SUBMIT_TO_EVALUATOR หรือไม่ก่อนแสดงปุ่ม)

   ตามลำดับงาน 4 ขั้นในหัวข้อ 5.3.9 ของดุษฎีนิพนธ์ การส่งขอรับรองเกิดขึ้น "ก่อน" การให้คะแนนตัวชี้วัดที่ 4
   ปุ่ม "ส่งขอรับรอง" จึงเปิดหน้าจอ "ตรวจทานก่อนส่ง" ซึ่งบังคับตามลำดับ: (1) แนบรูปอย่างน้อย 1 รูป
   (2) ให้คะแนนตัวชี้วัดที่ 4 ครบทั้ง 14 รูปแบบผ่าน rubric ของ Kellert & Calabrese (2015) พร้อมเหตุผล
   ประกอบทุกข้อ (คำนวณคะแนนสดให้เห็นทันที) (3) ติ๊กยืนยันว่าตรวจทานแล้ว — ครบทั้ง 3 อย่างถึงส่งได้จริง
   คะแนนนี้เป็นเพียง "คะแนนตั้งต้นที่ผู้ขอรับรองประเมินตนเอง" ผู้ประเมิน (evaluator-dashboard.js) จะเห็น
   รายละเอียดคะแนน+เหตุผลทุกข้อ และเป็นผู้ตัดสินขั้นสุดท้ายว่าจะอนุมัติหรือขอแก้ไข ตามหลัก ISO/IEC 17065
   ที่อ้างถึงในหัวข้อ 5.3.8 (ผู้ขอรับรองเป็นผู้จัดหาหลักฐาน ผู้ประเมินเป็นผู้ตัดสิน)

   ใบสมัครถูกส่งไปเก็บที่ Firestore ผ่าน Cloud Function submitApplication (server/index.js) แทน
   localStorage — เพราะผู้ประกอบการกับผู้ประเมินอยู่คนละเครื่อง/เบราว์เซอร์กัน localStorage เดิมทำให้
   ผู้ประเมินไม่เห็นข้อมูลจริงเลยถ้าไม่ได้ทดสอบในเบราว์เซอร์เดียวกัน ตอนส่งสำเร็จจะได้ "เลขที่ใบสมัคร + PIN"
   กลับมา ใช้ตรวจสอบผลภายหลังได้เองที่ check-status.html โดยไม่ต้องล็อกอิน — คีย์ localStorage
   "beqi_my_submissions" ที่ยังใช้อยู่ในไฟล์นี้เป็นเพียง cache สะดวก ๆ ในเครื่องนี้เพื่อแสดงรายการ
   "My Submissions" เท่านั้น ไม่ใช่ต้นทางข้อมูลจริง (ต้นทางจริงคือ Firestore) */
(function(){
  const session = BeqiCore.requireRole('entrepreneur', 'entrepreneur-portal.html');
  if(!session) return;

  document.getElementById('whoami').textContent = session.businessName + ' · ' + session.repName;
  document.getElementById('logoutBtn').addEventListener('click', function(){
    BeqiCore.clearSession();
    window.location.href = 'index.html';
  });

  const API = (typeof BEQI_API_CONFIG !== 'undefined') ? BEQI_API_CONFIG : null;
  // ปุ่ม "Fill test data" สำหรับทดสอบเท่านั้น — ซ่อนไว้เสมอ ยกเว้นเปิดด้วย ?dev=1 ในลิงก์ หรือ
  // localStorage.setItem('beqi_dev','1') ผ่าน console เพื่อไม่ให้ผู้เข้าร่วมงานวิจัยจริงเห็นหรือกดโดยไม่ตั้งใจ
  const DEV_MODE = new URLSearchParams(location.search).get('dev') === '1' || localStorage.getItem('beqi_dev') === '1';
  const MY_SUBS_KEY = 'beqi_my_submissions';
  function loadMySubs(){ try{ return JSON.parse(localStorage.getItem(MY_SUBS_KEY) || '[]'); }catch(e){ return []; } }
  function saveMySubs(list){ localStorage.setItem(MY_SUBS_KEY, JSON.stringify(list)); }

  const ZONE_LABEL = {North:'North Zone', Central:'Central Zone', South:'South Zone'};
  const lang = () => (typeof I18N !== 'undefined' ? I18N.getLang() : 'en');

  function statusPill(status){
    const cls = status === 'approved' ? 'status-approved' : status === 'revision' ? 'status-revision' : 'status-pending';
    const label = status === 'approved' ? I18N.t('entrepreneur.dashboard.statusApproved')
      : status === 'revision' ? I18N.t('entrepreneur.dashboard.statusRevision')
      : I18N.t('entrepreneur.dashboard.statusPending');
    return '<span class="status-pill ' + cls + '">' + label + '</span>';
  }

  function fetchStatus(id, pin){
    if(!API || !API.statusUrl) return Promise.resolve(null);
    return fetch(API.statusUrl + '?id=' + encodeURIComponent(id) + '&pin=' + encodeURIComponent(pin))
      .then(function(r){ return r.ok ? r.json() : null; })
      .catch(function(){ return null; });
  }

  function renderSubmissions(){
    const mine = loadMySubs().slice().reverse();
    document.getElementById('submissionsEmpty').hidden = mine.length > 0;
    document.getElementById('submissionsHint').hidden = mine.length === 0;
    const list = document.getElementById('submissionsList');
    list.innerHTML = mine.map(function(s){
      return '<div class="organic-border bg-white p-5 flex flex-wrap items-center gap-4" data-row="' + s.id + '">' +
        '<div class="flex-1 min-w-[200px]">' +
        '<p class="font-body-md text-sm text-on-surface-variant">' + s.businessName + ' · <span class="font-data-viz">' + s.id + '</span></p>' +
        '<p class="font-body-md text-xs text-on-surface-variant mt-1">' + I18N.t('entrepreneur.dashboard.submittedOn') + ' ' + new Date(s.createdAt).toLocaleDateString('th-TH') + '</p>' +
        '</div></div>';
    }).join('');
    mine.forEach(function(s){
      fetchStatus(s.id, s.pin).then(function(sub){
        const row = list.querySelector('[data-row="' + s.id + '"]');
        if(!row) return;
        if(!sub) return; // เครือข่ายมีปัญหา/ยังโหลดไม่เสร็จ — คงข้อความพื้นฐานไว้เฉย ๆ
        const certLine = sub.status === 'approved'
          ? '<p class="font-body-md text-sm text-tertiary mt-1">' + I18N.t('entrepreneur.dashboard.certifiedAs') + ' <b>' + sub.certLevel + '</b></p>'
          : '';
        const scoreLabel = sub.overall == null ? '--' : BeqiCore.fx(sub.overall, 1);
        row.innerHTML =
          '<div class="flex-1 min-w-[200px]">' +
          '<div class="flex items-center gap-3">' +
          '<span class="font-display-lg text-[24px] text-primary">' + scoreLabel + '</span>' +
          statusPill(sub.status) +
          '</div>' +
          '<p class="font-body-md text-xs text-on-surface-variant mt-1">' + s.businessName + ' · <span class="font-data-viz">' + s.id + '</span> · ' + I18N.t('entrepreneur.dashboard.submittedOn') + ' ' + new Date(sub.createdAt).toLocaleDateString('th-TH') + '</p>' +
          certLine +
          '</div>';
      });
    });
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

  // ลดขนาดรูปก่อนแปลงเป็น base64 (canvas, ด้านยาวสุด 1600px, JPEG คุณภาพ 0.75) เพื่อไม่ให้ payload
  // ที่ส่งไป Cloud Function ใหญ่เกินไป (รูปจากมือถือมักหลาย MB ต่อรูป) และประหยัดพื้นที่ Cloud Storage
  function resizeImage(file){
    return new Promise(function(resolve, reject){
      const reader=new FileReader();
      reader.onload=function(){
        const img=new Image();
        img.onload=function(){
          const maxDim=1600;
          let w=img.width, h=img.height;
          if(w>maxDim||h>maxDim){
            const scale=maxDim/Math.max(w,h);
            w=Math.round(w*scale); h=Math.round(h*scale);
          }
          const canvas=document.createElement('canvas');
          canvas.width=w; canvas.height=h;
          canvas.getContext('2d').drawImage(img,0,0,w,h);
          resolve(canvas.toDataURL('image/jpeg',0.75));
        };
        img.onerror=reject;
        img.src=reader.result;
      };
      reader.onerror=reject;
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
    document.getElementById('submitResult').hidden=true;
    document.getElementById('fillTestDataBtn').hidden=!DEV_MODE;
    document.getElementById('reviewBusiness').textContent=session.businessName;
    document.getElementById('reviewContact').textContent=session.repName+' · '+session.email+(session.phone?' · '+session.phone:'');
    document.getElementById('reviewZone').textContent=ZONE_LABEL[session.zoneId]||session.zoneId||'--';
    document.getElementById('reviewArea').textContent=BeqiCore.fx(site.norm[0],2)+' green · '+BeqiCore.fx(site.norm[2],2)+' water access (indicators 1 & 3, normalised)';
    refreshConfirmState();
    const section=document.getElementById('submitReview');
    section.hidden=false;
    section.scrollIntoView({behavior:'smooth', block:'start'});
  }

  // เติมรูปตัวอย่าง + คะแนน rubric ทั้ง 14 ข้อ + ติ๊กยืนยัน ให้อัตโนมัติ — ใช้ทดสอบ flow เท่านั้น
  // (ปุ่มนี้ซ่อนอยู่เสมอนอกโหมด DEV_MODE ด้านบน ห้ามให้ผู้เข้าร่วมงานวิจัยจริงเห็น)
  function fillTestData(){
    if(reviewPhotos.length===0){
      const canvas=document.createElement('canvas');
      canvas.width=480; canvas.height=360;
      const ctx=canvas.getContext('2d');
      ctx.fillStyle='#2A9D8F'; ctx.fillRect(0,0,480,360);
      ctx.fillStyle='#ffffff'; ctx.font='24px sans-serif'; ctx.textAlign='center';
      ctx.fillText('TEST PHOTO', 240, 170);
      ctx.fillText(new Date().toLocaleString('th-TH'), 240, 200);
      reviewPhotos=[canvas.toDataURL('image/jpeg',0.8)];
      renderPhotoPreview();
    }
    PATTERNS.forEach(function(p){
      rubricAnswers[p.n]={score:2, note:'ข้อมูลทดสอบ (dev fill) — ' + p.en};
    });
    renderRubric();
    document.getElementById('reviewConfirmChk').checked=true;
    refreshConfirmState();
  }
  document.getElementById('fillTestDataBtn').addEventListener('click', fillTestData);

  document.getElementById('reviewPhotoInput').addEventListener('change', function(e){
    Promise.all(Array.from(e.target.files).map(resizeImage)).then(function(dataUrls){
      reviewPhotos=reviewPhotos.concat(dataUrls);
      renderPhotoPreview();
    });
  });
  document.getElementById('reviewConfirmChk').addEventListener('change', refreshConfirmState);
  document.getElementById('reviewCancelBtn').addEventListener('click', function(){
    document.getElementById('submitReview').hidden=true;
    reviewSite=null; reviewPhotos=[]; rubricAnswers={};
  });
  document.getElementById('resultCloseBtn').addEventListener('click', function(){
    document.getElementById('submitResult').hidden=true;
  });
  document.getElementById('reviewConfirmBtn').addEventListener('click', function(){
    if(!reviewSite || !reviewPhotos.length || !rubricComplete() || !API || !API.submitUrl) return;
    const btn=this;
    const errEl=document.getElementById('reviewError');
    errEl.classList.add('hidden');
    const originalText=btn.textContent;
    btn.disabled=true;
    btn.textContent=I18N.t('entrepreneur.dashboard.submitting');

    const ind4Raw=rubricRawScore();
    const ind4Norm=ind4Raw/28;
    const norm4=reviewSite.norm.slice(0,3).concat([ind4Norm]);
    const overall=norm4.reduce(function(a,b){ return a+b; },0)/norm4.length*100;
    const patternScores=PATTERNS.map(function(p){
      return {n:p.n, name_en:p.en, name_th:p.th, onsite:p.onsite, score:rubricAnswers[p.n].score, note:rubricAnswers[p.n].note};
    });
    const payload={
      secret: API.secret,
      businessName: session.businessName, repName: session.repName, email: session.email,
      taxId: session.taxId, phone: session.phone, zoneId: session.zoneId,
      polygon: reviewSite.polygon, norm: norm4, overall: overall,
      ind4Raw: ind4Raw, patternScores: patternScores, photos: reviewPhotos
    };

    fetch(API.submitUrl, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
      .then(function(r){ return r.json().then(function(data){ return {ok:r.ok, data}; }); })
      .then(function(res){
        if(!res.ok) throw new Error((res.data && res.data.error) || 'submit failed');
        const mine=loadMySubs();
        mine.push({id: res.data.id, pin: res.data.pin, businessName: session.businessName, createdAt: new Date().toISOString()});
        saveMySubs(mine);
        reviewSite.submitted=true;
        if(window.BEQI_RERENDER_SITES) window.BEQI_RERENDER_SITES();
        document.getElementById('submitReview').hidden=true;
        document.getElementById('resultId').textContent=res.data.id;
        document.getElementById('resultPin').textContent=res.data.pin;
        const resultSection=document.getElementById('submitResult');
        resultSection.hidden=false;
        resultSection.scrollIntoView({behavior:'smooth', block:'start'});
        reviewSite=null; reviewPhotos=[]; rubricAnswers={};
        renderSubmissions();
      })
      .catch(function(e){
        console.error('BEQI submitApplication error', e);
        errEl.textContent=I18N.t('entrepreneur.dashboard.submitErr');
        errEl.classList.remove('hidden');
        btn.disabled=false;
        btn.textContent=originalText;
      });
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
