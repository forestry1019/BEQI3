/* คำแปล EN/TH เฉพาะหน้า entrepreneur-portal.html และ entrepreneur-dashboard.html
   โหลดหลัง assets/js/i18n-dict.js และก่อน assets/js/i18n.js เสมอ */
Object.assign(window.BEQI_I18N_DICT = window.BEQI_I18N_DICT || {}, {

  /* ---------- entrepreneur-portal.html (ยืนยันตัวตนผู้ประกอบการ) ---------- */
  'entrepreneur.portal.portalAccessBtn': {en: 'Portal Access', th: 'เข้าสู่พอร์ทัล'},
  'entrepreneur.portal.heading': {en: 'Entrepreneur Verification', th: 'ยืนยันตัวตนผู้ประกอบการ'},
  'entrepreneur.portal.subheading': {
    en: 'Verify your business identity to submit properties for BEQI review and track certification status.',
    th: 'ยืนยันตัวตนสถานประกอบการของคุณ เพื่อส่งพื้นที่ให้ผู้ประเมินตรวจสอบ และติดตามสถานะการรับรอง'
  },
  'entrepreneur.portal.sideTitle': {en: 'Verified Entrepreneurs Only', th: 'สำหรับผู้ประกอบการที่ยืนยันตัวตนแล้วเท่านั้น'},
  'entrepreneur.portal.sideDesc': {
    en: 'BEQI certification review is limited to registered business representatives. Your Google account confirms who you are; the details below confirm which business you represent.',
    th: 'การตรวจรับรอง BEQI จำกัดเฉพาะผู้แทนสถานประกอบการที่ลงทะเบียนไว้ บัญชี Google ใช้ยืนยันตัวคุณ ส่วนข้อมูลด้านล่างใช้ยืนยันว่าคุณเป็นตัวแทนของสถานประกอบการใด'
  },
  'entrepreneur.portal.step1': {en: 'Sign in with your Google account', th: 'ลงชื่อเข้าใช้ด้วยบัญชี Google ของคุณ'},
  'entrepreneur.portal.step2': {en: 'Confirm your business details', th: 'ยืนยันข้อมูลสถานประกอบการของคุณ'},
  'entrepreneur.portal.step3': {en: 'Draw your property and submit for review', th: 'วาดขอบเขตพื้นที่และส่งให้ผู้ประเมินตรวจสอบ'},
  'entrepreneur.portal.googleBtn': {en: 'Sign in with Google', th: 'ลงชื่อเข้าใช้ด้วย Google'},
  'entrepreneur.portal.googleNote': {
    en: 'Used only to verify your identity in this prototype — no data is sent anywhere besides your browser.',
    th: 'ใช้เพื่อยืนยันตัวตนในต้นแบบนี้เท่านั้น — ไม่มีการส่งข้อมูลไปที่ใดนอกจากเบราว์เซอร์ของคุณ'
  },
  'entrepreneur.portal.googleNotConfigured': {
    en: 'Google Sign-In isn\'t configured yet — set clientId in assets/js/gee-config.js first.',
    th: 'ยังไม่ได้ตั้งค่า Google Sign-In — ต้องตั้งค่า clientId ใน assets/js/gee-config.js ก่อน'
  },
  'entrepreneur.portal.signedInAs': {en: 'Signed in as', th: 'ลงชื่อเข้าใช้ในชื่อ'},
  'entrepreneur.portal.switchAccount': {en: 'Not you? Switch account', th: 'ไม่ใช่คุณ? เปลี่ยนบัญชี'},
  'entrepreneur.portal.field.repName': {en: 'Representative Name', th: 'ชื่อผู้แทน'},
  'entrepreneur.portal.field.contactPerson': {en: 'Contact Person', th: 'ผู้ติดต่อ'},
  'entrepreneur.portal.field.contactPersonPh': {en: 'e.g., front-desk manager who can meet the evaluator on site', th: 'เช่น ผู้จัดการหน้างานที่จะนัดพบผู้ประเมิน'},
  'entrepreneur.portal.field.email': {en: 'Email', th: 'อีเมล'},
  'entrepreneur.portal.field.businessName': {en: 'Business / Establishment Name', th: 'ชื่อสถานประกอบการ'},
  'entrepreneur.portal.field.businessNamePh': {en: 'e.g., Phang Nga Eco Lodge', th: 'เช่น พังงา อีโค ลอดจ์'},
  'entrepreneur.portal.field.taxId': {en: 'Tax ID Number', th: 'เลขประจำตัวผู้เสียภาษี'},
  'entrepreneur.portal.field.taxIdPh': {en: '13-digit tax ID', th: 'เลข 13 หลัก'},
  'entrepreneur.portal.field.taxIdHint': {
    en: 'Used to verify your business is a registered legal entity — never shown publicly.',
    th: 'ใช้ยืนยันว่าสถานประกอบการจดทะเบียนถูกต้องตามกฎหมาย — ไม่แสดงต่อสาธารณะ'
  },
  'entrepreneur.portal.field.phone': {en: 'Phone Number', th: 'เบอร์โทรศัพท์'},
  'entrepreneur.portal.field.phonePh': {en: 'e.g., 08X-XXX-XXXX', th: 'เช่น 08X-XXX-XXXX'},
  'entrepreneur.portal.field.zone': {en: 'Coastal Zone', th: 'โซนชายฝั่ง'},
  'entrepreneur.portal.field.zonePlaceholder': {en: 'Select the zone your property is in...', th: 'เลือกโซนที่สถานประกอบการตั้งอยู่...'},
  'entrepreneur.portal.field.zoneNorth': {en: 'North Zone — Coral Beach & Bustling Beach', th: 'โซนเหนือ — หาดปะการังและหาดคึกคัก'},
  'entrepreneur.portal.field.zoneCentral': {en: 'Central Zone — Bang Niang Beach & Nang Thong Beach', th: 'โซนกลาง — หาดบางเนียงและหาดนางทอง'},
  'entrepreneur.portal.field.zoneSouth': {en: 'South Zone — Khao Lak-Lam Ru National Park', th: 'โซนใต้ — อุทยานแห่งชาติเขาหลัก-ลำรู่'},
  'entrepreneur.portal.formErrorRequired': {en: 'Please fill in all fields.', th: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'},
  'entrepreneur.portal.formErrorTaxId': {en: 'Tax ID must be 13 digits.', th: 'เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก'},
  'entrepreneur.portal.formErrorSignIn': {en: 'Please sign in with Google first.', th: 'กรุณาลงชื่อเข้าใช้ด้วย Google ก่อน'},
  'entrepreneur.portal.submitBtn': {en: 'Verify & Continue', th: 'ยืนยันและดำเนินการต่อ'},
  'entrepreneur.portal.checkStatusLink': {en: 'Already submitted before? Check your status', th: 'เคยส่งข้อมูลไปแล้ว? ตรวจสอบสถานะที่นี่'},
  'entrepreneur.footer.tagline1': {
    en: 'AN INNOVATIVE PROTOTYPE OF BIOPHILIC ENVIRONMENTAL QUALITY INDEX PORTFOLIO FOR SUSTAINABLE COASTAL TOURISM: ',
    th: 'ต้นแบบนวัตกรรมพอร์ตฟอลิโอดัชนีคุณภาพสภาพแวดล้อมเชิงไบโอฟิลิกเพื่อการท่องเที่ยวชายฝั่งอย่างยั่งยืน: '
  },
  'entrepreneur.footer.tagline2': {en: 'A CASE STUDY OF PHANG-NGA PROVINCE, THAILAND', th: 'กรณีศึกษาจังหวัดพังงา ประเทศไทย'},

  /* ---------- entrepreneur-dashboard.html (เหมือนหน้านักท่องเที่ยว + ส่งให้ผู้ประเมิน + ติดตามสถานะ) ---------- */
  'entrepreneur.dashboard.portalAccessBtn': {en: 'Log Out', th: 'ออกจากระบบ'},
  'entrepreneur.dashboard.tips.heading': {en: 'Sustainability Recommendations', th: 'คำแนะนำเพื่อความยั่งยืน'},
  'entrepreneur.dashboard.tips.tip1.title': {en: 'Add coastal planting', th: 'เพิ่มพืชพรรณชายฝั่ง'},
  'entrepreneur.dashboard.tips.tip1.body': {
    en: 'Native plants strengthen the visual connection with nature at your entrance and walkways.',
    th: 'ปลูกพืชพื้นถิ่นเพื่อยกระดับการเชื่อมโยงทางสายตากับธรรมชาติบริเวณทางเข้าและทางเดิน'
  },
  'entrepreneur.dashboard.tips.tip2.title': {en: 'Favor natural light', th: 'เพิ่มแสงธรรมชาติ'},
  'entrepreneur.dashboard.tips.tip2.body': {
    en: 'Reduce artificial lighting during daylight hours and let diffused sunlight reach main areas.',
    th: 'ลดแสงประดิษฐ์ในช่วงกลางวัน เปิดรับแสงกระจายจากธรรมชาติเข้าสู่พื้นที่ใช้งานหลัก'
  },
  'entrepreneur.dashboard.tips.tip3.title': {en: 'Capture rainwater visibly', th: 'เก็บกักน้ำฝนให้มองเห็นได้'},
  'entrepreneur.dashboard.tips.tip3.body': {
    en: 'A visible catchment system helps demonstrate water stewardship to evaluators and guests.',
    th: 'ระบบกักเก็บน้ำที่มองเห็นได้ช่วยแสดงความใส่ใจด้านน้ำต่อผู้ประเมินและผู้เข้าพัก'
  },
  'entrepreneur.dashboard.howto.heading': {en: 'How to Use This Page', th: 'วิธีใช้งานหน้านี้'},
  'entrepreneur.dashboard.howto.step1': {
    en: 'Draw your property boundary on the map, then click "Calculate BEQI" (indicators 1-3 are computed automatically from satellite imagery).',
    th: 'วาดขอบเขตพื้นที่ของคุณบนแผนที่ แล้วกด "คำนวณ BEQI" (ตัวชี้วัดที่ 1-3 คำนวณอัตโนมัติจากภาพถ่ายดาวเทียม)'
  },
  'entrepreneur.dashboard.howto.step2': {en: 'Click "Submit for Certification Review" on the result card.', th: 'กด "ส่งขอรับรองผลการประเมิน" ที่การ์ดผลลัพธ์'},
  'entrepreneur.dashboard.howto.step3': {en: 'Attach at least one photo of your property.', th: 'แนบรูปพื้นที่ของคุณอย่างน้อย 1 รูป'},
  'entrepreneur.dashboard.howto.step4': {
    en: 'Score indicator 4 using the 14 Patterns of Biophilic Design checklist that appears — a rubric score is calculated live as you go.',
    th: 'ให้คะแนนตัวชี้วัดที่ 4 ตามแบบตรวจสอบ 14 รูปแบบของการออกแบบเชิงไบโอฟิลิกที่ปรากฏขึ้น — ระบบคำนวณคะแนนให้ทันทีระหว่างทำ'
  },
  'entrepreneur.dashboard.howto.step5': {
    en: 'Review everything, tick the confirmation box, then send it to the evaluator — save the Submission ID and PIN you receive to check your result later.',
    th: 'ตรวจทานข้อมูลทั้งหมด ติ๊กยืนยัน แล้วส่งให้ผู้ประเมิน — บันทึกเลขที่ใบสมัครและ PIN ที่ได้รับไว้เพื่อตรวจสอบผลภายหลัง'
  },
  'entrepreneur.dashboard.rubric.heading': {en: 'Indicator 4 — 14 Patterns of Biophilic Design', th: 'ตัวชี้วัดที่ 4 — 14 รูปแบบของการออกแบบเชิงไบโอฟิลิก'},
  'entrepreneur.dashboard.rubric.hint': {
    en: 'Score only what is objectively visible as physical structure or material in your photos — not opinion or feeling. A short evidence note is required for every pattern.',
    th: 'ให้คะแนนเฉพาะโครงสร้าง/วัสดุทางกายภาพที่ปรากฏจริงในรูปเท่านั้น ไม่ใช่ความรู้สึกส่วนตัว ต้องระบุเหตุผล/หลักฐานสั้น ๆ ทุกข้อ'
  },
  'entrepreneur.dashboard.rubric.onsiteTag': {en: 'confirmed by evaluator on-site', th: 'ผู้ประเมินต้องยืนยัน ณ สถานที่'},
  'entrepreneur.dashboard.result.mapEmpty': {
    en: 'Draw your property boundary on the map and click "Calculate BEQI" to see indicators 1–3 here.',
    th: 'วาดขอบเขตพื้นที่ของคุณบนแผนที่ แล้วกด "คำนวณ BEQI" เพื่อดูตัวชี้วัดที่ 1-3 ที่นี่'
  },
  'entrepreneur.dashboard.rubric.notePlaceholder': {en: 'What evidence did you see? (required)', th: 'พบหลักฐานอะไรในรูป (จำเป็นต้องกรอก)'},
  'entrepreneur.dashboard.hero.title': {en: 'Assess Your Property', th: 'ประเมินพื้นที่ของคุณ'},
  'entrepreneur.dashboard.hero.subtitle': {
    en: 'Draw your property boundary, calculate its BEQI score, then submit it for official certification review.',
    th: 'วาดขอบเขตพื้นที่ของคุณ คำนวณคะแนน BEQI แล้วส่งให้ผู้ประเมินตรวจสอบเพื่อขอการรับรองอย่างเป็นทางการ'
  },
  'entrepreneur.dashboard.submitBtn': {en: 'Submit for Certification Review', th: 'ส่งขอรับรองผลการประเมิน'},
  'entrepreneur.dashboard.review.heading': {
    en: 'Upload photos of your property, its surrounding environment, and the coastal area, and fill in the information under each heading below',
    th: 'อัปโหลดรูปสถานประกอบการ สภาพแวดล้อมโดยรอบ และบริเวณริมชายฝั่ง และกรอกข้อมูลตามหัวข้อด้านล่าง'
  },
  'entrepreneur.dashboard.review.intro': {en: 'Please check the details below carefully — this is what the evaluator will receive.', th: 'กรุณาตรวจสอบข้อมูลด้านล่างให้ครบถ้วน — นี่คือข้อมูลที่ผู้ประเมินจะได้รับ'},
  'entrepreneur.dashboard.review.business': {en: 'Business', th: 'สถานประกอบการ'},
  'entrepreneur.dashboard.review.contact': {en: 'Contact', th: 'ข้อมูลติดต่อ'},
  'entrepreneur.dashboard.review.zone': {en: 'Registered Zone', th: 'โซนที่ลงทะเบียน'},
  'entrepreneur.dashboard.review.area': {en: 'Drawn Area', th: 'พื้นที่ที่วาด'},
  'entrepreneur.dashboard.review.photosLabel': {en: 'Attach photos (indicator 4 evidence) — required', th: 'แนบรูป (หลักฐานตัวชี้วัดที่ 4) — จำเป็นต้องแนบ'},
  'entrepreneur.dashboard.review.photosHint': {
    en: 'Upload photos of your property, including the building itself and its surrounding environment — especially the coastline. These will be reviewed by an evaluator.',
    th: 'อัปโหลดภาพถ่ายสถานประกอบการ ได้แก่ ภาพอาคาร และสภาพแวดล้อมโดยรอบ โดยเฉพาะบริเวณริมชายฝั่ง — ผู้ประเมินจะตรวจสอบรูปเหล่านี้'
  },
  'entrepreneur.dashboard.review.confirmLabel': {
    en: 'I have reviewed the information above and confirm it is accurate before sending to the evaluator.',
    th: 'ฉันได้ตรวจทานข้อมูลด้านบนแล้ว และยืนยันว่าถูกต้องก่อนส่งให้ผู้ประเมิน'
  },
  'entrepreneur.dashboard.review.confirmBtn': {en: 'Confirm & Send to Evaluator', th: 'ยืนยันและส่งให้ผู้ประเมิน'},
  'entrepreneur.dashboard.review.cancelBtn': {en: 'Cancel', th: 'ยกเลิก'},
  'entrepreneur.dashboard.submitting': {en: 'Submitting…', th: 'กำลังส่ง…'},
  'entrepreneur.dashboard.submitted': {en: 'Submitted — an evaluator will review it soon.', th: 'ส่งแล้ว — ผู้ประเมินจะตรวจสอบในเร็ว ๆ นี้'},
  'entrepreneur.dashboard.submitErr': {
    en: 'Could not send your submission. Please check your connection and try again.',
    th: 'ส่งข้อมูลไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง'
  },
  'entrepreneur.dashboard.result.heading': {en: 'Submission Received', th: 'ส่งข้อมูลสำเร็จ'},
  'entrepreneur.dashboard.result.body': {
    en: 'Save your Submission ID and PIN below — you\'ll need both to check your evaluation result later, from any device, without logging in.',
    th: 'บันทึกเลขที่ใบสมัครและ PIN ด้านล่างนี้ไว้ — ต้องใช้ทั้งสองอย่างเพื่อตรวจสอบผลการประเมินภายหลัง จากอุปกรณ์ใดก็ได้ โดยไม่ต้องเข้าสู่ระบบ'
  },
  'entrepreneur.dashboard.result.idLabel': {en: 'Submission ID', th: 'เลขที่ใบสมัคร'},
  'entrepreneur.dashboard.result.pinLabel': {en: 'PIN', th: 'รหัส PIN'},
  'entrepreneur.dashboard.result.checkLink': {en: 'Check status', th: 'ตรวจสอบสถานะ'},
  'entrepreneur.dashboard.result.closeBtn': {en: 'Done', th: 'เสร็จสิ้น'},
  'entrepreneur.dashboard.submissionsHeading': {en: 'My Submissions', th: 'รายการที่ส่งไปแล้ว'},
  'entrepreneur.dashboard.submissionsEmpty': {
    en: 'No submissions yet — calculate a BEQI score above, then submit it for review.',
    th: 'ยังไม่มีรายการที่ส่ง — คำนวณคะแนน BEQI ด้านบนแล้วส่งขอรับรอง'
  },
  'entrepreneur.dashboard.submissionsHint': {
    en: 'This list is a local convenience on this device only — your Submission ID and PIN are the real record. Save them somewhere safe.',
    th: 'รายการนี้เป็นเพียงทางลัดในเครื่องนี้เท่านั้น — เลขที่ใบสมัครและ PIN คือหลักฐานตัวจริง กรุณาบันทึกเก็บไว้ในที่ปลอดภัย'
  },
  'entrepreneur.dashboard.statusPending': {en: 'Pending Review', th: 'รอตรวจสอบ'},
  'entrepreneur.dashboard.statusApproved': {en: 'Approved', th: 'อนุมัติแล้ว'},
  'entrepreneur.dashboard.statusRevision': {en: 'Needs Revision', th: 'ต้องแก้ไข'},
  'entrepreneur.dashboard.submittedOn': {en: 'Submitted', th: 'ส่งเมื่อ'},
  'entrepreneur.dashboard.certifiedAs': {en: 'Certified level:', th: 'ระดับที่ได้รับการรับรอง:'},
  'entrepreneur.dashboard.comingSoonAlert': {
    en: 'This feature is still under development — it will be available in a future version.',
    th: 'ฟีเจอร์นี้ยังอยู่ระหว่างพัฒนา — จะเปิดใช้งานในเวอร์ชันถัดไป'
  }
});
