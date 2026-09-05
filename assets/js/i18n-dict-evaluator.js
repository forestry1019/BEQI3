/* คำแปล EN/TH เฉพาะกลุ่มหน้าผู้ประเมิน (evaluator-portal / evaluator-dashboard / evaluator-site-audit)
   โหลดหลัง assets/js/i18n-dict.js และก่อน assets/js/i18n.js เสมอ */
Object.assign(window.BEQI_I18N_DICT = window.BEQI_I18N_DICT || {}, {

  /* ---------- evaluator-portal.html ---------- */
  'evaluator.portal.title': {en: 'Evaluator Access', th: 'สิทธิ์เข้าใช้งานผู้ประเมิน'},
  'evaluator.portal.intro': {
    en: 'This page is reserved for assigned evaluators only. You must register with an evaluator access code before you can enter the Evaluator Dashboard and Site Audit.',
    th: 'หน้านี้สงวนไว้สำหรับผู้ประเมินที่ได้รับมอบหมายเท่านั้น ต้องลงทะเบียนด้วยรหัสผู้ประเมินก่อนจึงจะเข้าสู่ Evaluator Dashboard และ Site Audit ได้'
  },
  'evaluator.portal.blockedNote': {
    en: 'The account currently logged in is not an evaluator account. Please register with an evaluator access code below before using this page.',
    th: 'บัญชีที่ล็อกอินอยู่ไม่ใช่บัญชีผู้ประเมิน กรุณาลงทะเบียนด้วยรหัสผู้ประเมินด้านล่างก่อนเข้าใช้งานหน้านี้'
  },
  'evaluator.portal.nameLabel': {en: 'Evaluator Name', th: 'ชื่อผู้ประเมิน'},
  'evaluator.portal.emailLabel': {en: 'Evaluator Email', th: 'อีเมลผู้ประเมิน'},
  'evaluator.portal.orgLabel': {en: 'Organization', th: 'หน่วยงาน'},
  'evaluator.portal.codeLabel': {en: 'Evaluator Access Code', th: 'รหัสผู้ประเมิน'},
  'evaluator.portal.codePlaceholder': {en: 'Code provided by the administrator', th: 'รหัสที่ได้รับจากผู้ดูแลระบบ'},
  'evaluator.portal.codeHint': {
    en: 'This prototype uses the test code <code>BEQI-EVAL-2026</code> — the production version will switch to administrator-issued verification.',
    th: 'ต้นแบบนี้ใช้รหัสทดสอบ <code>BEQI-EVAL-2026</code> — เวอร์ชันจริงจะเปลี่ยนเป็นการยืนยันตัวตนโดยผู้ดูแลระบบ'
  },
  'evaluator.portal.submitBtn': {en: 'Enter Evaluator Dashboard', th: 'เข้าสู่แดชบอร์ดผู้ประเมิน'},
  'evaluator.portal.errCode': {en: 'Invalid evaluator access code', th: 'รหัสผู้ประเมินไม่ถูกต้อง'},
  'evaluator.portal.errRequired': {en: 'Please fill in all fields', th: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'},

  /* ---------- shared sidebar/header: evaluator-dashboard.html + evaluator-site-audit.html ---------- */
  'evaluator.dashboard.sidebarSubtitle': {en: 'Coastal Quality Framework', th: 'กรอบคุณภาพชายฝั่ง'},
  'evaluator.dashboard.navBiophilic': {en: 'Biophilic Index', th: 'ดัชนีไบโอฟิลิก'},
  'evaluator.dashboard.navSiteAudit': {en: 'Site Audit', th: 'ตรวจภาคสนาม'},
  'evaluator.dashboard.navReports': {en: 'Local Reports', th: 'รายงานท้องถิ่น'},
  'evaluator.dashboard.navSettings': {en: 'Settings', th: 'ตั้งค่า'},
  'evaluator.dashboard.logout': {en: 'Log Out', th: 'ออกจากระบบ'},

  /* ---------- evaluator-dashboard.html + evaluator-dashboard.js ---------- */
  'evaluator.dashboard.title': {en: 'Evaluator Dashboard', th: 'แดชบอร์ดผู้ประเมิน'},
  'evaluator.dashboard.subtitle': {
    en: 'Review incoming entrepreneur submissions against BEQI standards to maintain biophilic integrity along the Andaman coast.',
    th: 'ตรวจสอบคำขอที่ผู้ประกอบการส่งเข้ามาเทียบกับมาตรฐาน BEQI เพื่อรักษาความสมบูรณ์เชิงไบโอฟิลิกของชายฝั่งอันดามัน'
  },
  'evaluator.dashboard.pendingReviews': {en: 'Pending Reviews', th: 'รายการรอตรวจ'},
  'evaluator.dashboard.reviewEmpty': {
    en: 'No requests from entrepreneurs yet — once someone submits from the Entrepreneur Dashboard, it will appear here automatically (from any device).',
    th: 'ยังไม่มีคำขอจากผู้ประกอบการ — เมื่อมีการส่งจากแดชบอร์ดผู้ประกอบการ รายการจะปรากฏที่นี่โดยอัตโนมัติ (จากอุปกรณ์ใดก็ได้)'
  },
  'evaluator.dashboard.loadErr': {
    en: 'Could not load submissions from the server. Please check your connection and reload the page.',
    th: 'โหลดรายการจากเซิร์ฟเวอร์ไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วโหลดหน้าใหม่'
  },
  'evaluator.dashboard.updateErr': {
    en: 'Could not save your decision. Please check your connection and try again.',
    th: 'บันทึกผลการตัดสินใจไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง'
  },
  'evaluator.dashboard.comingSoonAlert': {en: 'This feature is still under development', th: 'ฟีเจอร์นี้ยังอยู่ระหว่างพัฒนา'},
  'evaluator.dashboard.statusNew': {en: 'NEW', th: 'ใหม่'},
  'evaluator.dashboard.statusApproved': {en: 'APPROVED', th: 'อนุมัติแล้ว'},
  'evaluator.dashboard.statusRevision': {en: 'NEEDS REVISION', th: 'ต้องแก้ไข'},
  'evaluator.dashboard.submittedPrefix': {en: 'Submitted: ', th: 'ส่งคำขอ: '},
  'evaluator.dashboard.selectPrompt': {en: 'Select an item on the left to see details', th: 'เลือกรายการทางซ้ายเพื่อดูรายละเอียด'},
  'evaluator.dashboard.scoreCaption': {en: 'Calculated BEQI Score (drawn area centroid: ', th: 'คะแนน BEQI ที่คำนวณ (จุดกึ่งกลางพื้นที่ที่วาด: '},
  'evaluator.dashboard.ciLabel': {en: '95% CI:', th: 'ช่วงความเชื่อมั่น 95%:'},
  'evaluator.dashboard.scalePoor': {en: 'Poor (0-40)', th: 'แย่ (0-40)'},
  'evaluator.dashboard.scaleModerate': {en: 'Moderate (41-70)', th: 'ปานกลาง (41-70)'},
  'evaluator.dashboard.scaleExcellent': {en: 'Excellent (71-100)', th: 'ดีเยี่ยม (71-100)'},
  'evaluator.dashboard.metricsHeading': {en: 'Detailed Comparison Metrics', th: 'รายละเอียดตัวชี้วัดเปรียบเทียบ'},
  'evaluator.dashboard.photosHeading': {en: 'Submitted Evidence Photos', th: 'รูปหลักฐานที่ส่งมา'},
  'evaluator.dashboard.awaitingInd4': {
    en: 'Awaiting indicator 4 (biophilic composition) assessment — review the submitted photos below and score against the 14-pattern checklist before a total score can be shown.',
    th: 'รอการประเมินตัวชี้วัดที่ 4 (องค์ประกอบไบโอฟิลิก) — ตรวจสอบรูปที่ส่งมาด้านล่างแล้วให้คะแนนตามแบบตรวจสอบ 14 รูปแบบ ก่อนจึงจะแสดงคะแนนรวมได้'
  },
  'evaluator.dashboard.awaitingInd4Short': {en: 'Awaiting indicator 4', th: 'รอตัวชี้วัดที่ 4'},
  'evaluator.dashboard.rubricHeading': {en: 'Applicant Self-Assessment (14 Patterns) — Starting Score Only', th: 'คะแนนตั้งต้นที่ผู้ขอรับรองประเมินตนเอง (14 รูปแบบ) — ยังไม่ใช่ผลตัดสิน'},
  'evaluator.dashboard.rubricPattern': {en: 'Pattern', th: 'รูปแบบ'},
  'evaluator.dashboard.rubricScore': {en: 'Score', th: 'คะแนน'},
  'evaluator.dashboard.rubricNote': {en: 'Evidence Note', th: 'เหตุผล/หลักฐาน'},
  'evaluator.dashboard.rubricOnsite': {en: 'confirm on-site', th: 'ต้องยืนยัน ณ สถานที่'},
  'evaluator.dashboard.rubricTotal': {en: 'Raw total', th: 'คะแนนดิบรวม'},
  'evaluator.dashboard.colMetric': {en: 'Metric', th: 'ตัวชี้วัด'},
  'evaluator.dashboard.colSubmission': {en: 'Submission Data', th: 'ข้อมูลที่ส่ง'},
  'evaluator.dashboard.colStandardPrefix': {en: 'BEQI Standard (', th: 'มาตรฐาน BEQI ('},
  'evaluator.dashboard.colVariance': {en: 'Variance', th: 'ผลต่าง'},
  'evaluator.dashboard.flaggedSuffix': {en: ' (Flagged)', th: ' (ถูกตั้งค่าสถานะ)'},
  'evaluator.dashboard.certHeading': {en: 'Certification Decision', th: 'การตัดสินใจรับรอง'},
  'evaluator.dashboard.scorePrefix': {en: 'Score ', th: 'คะแนน '},
  'evaluator.dashboard.minPrefix': {en: 'Min ', th: 'ขั้นต่ำ '},
  'evaluator.dashboard.decisionApprovedPrefix': {en: 'Approved at level ', th: 'อนุมัติแล้วในระดับ '},
  'evaluator.dashboard.decisionRevision': {en: 'Sent back for revision', th: 'ส่งกลับให้แก้ไขแล้ว'},
  'evaluator.dashboard.decisionPending': {en: 'No decision yet', th: 'ยังไม่มีการตัดสินใจ'},
  'evaluator.dashboard.btnRevision': {en: 'Request Revision', th: 'ขอให้แก้ไข'},
  'evaluator.dashboard.btnApprove': {en: 'Approve Certification', th: 'อนุมัติการรับรอง'},

  /* ---------- evaluator-site-audit.html + evaluator-site-audit.js ---------- */
  'evaluator.audit.eyebrow': {en: 'Evaluator Portal', th: 'พอร์ทัลผู้ประเมิน'},
  'evaluator.audit.subtitle': {
    en: 'Field audit form for indicator 4 (biophilic composition) — previously unsupported. Scores from these 3 criteria will replace the satellite estimate for indicator 4 in the BEQI calculation below.',
    th: 'แบบตรวจสอบภาคสนามสำหรับตัวชี้วัดที่ 4 (องค์ประกอบไบโอฟิลิก) — เดิมยังไม่มีระบบรองรับ คะแนนจาก 3 เกณฑ์นี้จะแทนที่ค่าประมาณจากดาวเทียมของตัวชี้วัดที่ 4 ในการคำนวณ BEQI ด้านล่าง'
  },
  'evaluator.audit.activeAssessments': {en: 'Active Assessments', th: 'รายการที่กำลังตรวจ'},
  'evaluator.audit.calculatedBeqi': {en: 'Calculated BEQI', th: 'BEQI ที่คำนวณได้'},
  'evaluator.audit.ecosystemIntegrity': {en: 'Ecosystem Integrity: ', th: 'ความสมบูรณ์เชิงนิเวศ: '},
  'evaluator.audit.indicatorsHeading': {
    en: 'All 4 indicators (after field-audit adjustment)',
    th: 'ตัวชี้วัดทั้ง 4 ด้าน (หลังปรับด้วยผลตรวจภาคสนาม)'
  },
  'evaluator.audit.criteriaHeading': {en: 'Biophilic Criteria', th: 'เกณฑ์ไบโอฟิลิก'},
  'evaluator.audit.liveAudit': {en: 'Live Audit', th: 'กำลังตรวจสด'},
  'evaluator.audit.materialityLabel': {en: '1. Materiality', th: '1. วัสดุธรรมชาติ'},
  'evaluator.audit.materialityDesc': {
    en: 'Assessment of natural vs. synthetic materials used in structural integration with the coastal environment.',
    th: 'การประเมินการใช้วัสดุธรรมชาติเทียบกับวัสดุสังเคราะห์ในโครงสร้างที่ผสานกับสภาพแวดล้อมชายฝั่ง'
  },
  'evaluator.audit.materialitySynthetic': {en: 'Synthetic (0)', th: 'วัสดุสังเคราะห์ (0)'},
  'evaluator.audit.materialityOrganic': {en: 'Organic (10)', th: 'วัสดุธรรมชาติ (10)'},
  'evaluator.audit.soundscapeLabel': {en: '2. Soundscape', th: '2. ภูมิทัศน์เสียง'},
  'evaluator.audit.soundscapeDesc': {
    en: 'Ratio of natural biophony (waves, wind, wildlife) to anthropogenic noise pollution.',
    th: 'สัดส่วนเสียงธรรมชาติ (คลื่น ลม สัตว์ป่า) เทียบกับมลภาวะทางเสียงจากกิจกรรมมนุษย์'
  },
  'evaluator.audit.soundscapeDisruptive': {en: 'Disruptive (0)', th: 'รบกวน (0)'},
  'evaluator.audit.soundscapeHarmonious': {en: 'Harmonious (10)', th: 'กลมกลืน (10)'},
  'evaluator.audit.thermalLabel': {en: '3. Thermal Comfort', th: '3. สภาวะน่าสบายเชิงความร้อน'},
  'evaluator.audit.thermalDesc': {
    en: 'Effectiveness of passive cooling, natural ventilation, and shading mimicking mangrove canopies.',
    th: 'ประสิทธิภาพของการทำความเย็นแบบพาสซีฟ การระบายอากาศตามธรรมชาติ และร่มเงาที่เลียนแบบเรือนยอดป่าชายเลน'
  },
  'evaluator.audit.thermalArtificial': {en: 'Artificial (0)', th: 'ประดิษฐ์ (0)'},
  'evaluator.audit.thermalPassive': {en: 'Passive (10)', th: 'พาสซีฟ (10)'},
  'evaluator.audit.btnSaveDraft': {en: 'Save Draft', th: 'บันทึกร่าง'},
  'evaluator.audit.btnCommit': {en: 'Commit Data', th: 'ยืนยันข้อมูล'},
  'evaluator.audit.statusCompleted': {en: 'Completed', th: 'เสร็จสมบูรณ์'},
  'evaluator.audit.statusInProgress': {en: 'In Progress', th: 'กำลังดำเนินการ'},
  'evaluator.audit.statusNotStarted': {en: 'Not Started', th: 'ยังไม่เริ่ม'},
  'evaluator.audit.siteAuditSuffix': {en: ' — Site Audit', th: ' — ตรวจภาคสนาม'},
  'evaluator.audit.integrityExcellent': {en: 'Excellent', th: 'ดีเยี่ยม'},
  'evaluator.audit.integrityFavorable': {en: 'Favorable', th: 'ค่อนข้างดี'},
  'evaluator.audit.integrityNeeds': {en: 'Needs Improvement', th: 'ต้องปรับปรุง'},
  'evaluator.audit.savedCommittedPrefix': {en: 'Field audit results for ', th: 'บันทึกผลตรวจภาคสนามของ '},
  'evaluator.audit.savedCommittedSuffix': {
    en: ' saved successfully — now replacing the satellite estimate for indicator 4.',
    th: ' เรียบร้อย — ใช้แทนค่าประมาณดาวเทียมของตัวชี้วัดที่ 4 แล้ว'
  },
  'evaluator.audit.savedDraft': {en: 'Draft saved. Not yet confirmed as official data.', th: 'บันทึกร่างไว้แล้ว ยังไม่ยืนยันเป็นข้อมูลทางการ'}
});
