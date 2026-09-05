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
  'entrepreneur.portal.field.businessName': {en: 'Business / Establishment Name', th: 'ชื่อสถานประกอบการ'},
  'entrepreneur.portal.field.businessNamePh': {en: 'e.g., Phang Nga Eco Lodge', th: 'เช่น พังงา อีโค ลอดจ์'},
  'entrepreneur.portal.field.taxId': {en: 'Tax ID Number', th: 'เลขประจำตัวผู้เสียภาษี'},
  'entrepreneur.portal.field.taxIdPh': {en: '13-digit tax ID', th: 'เลข 13 หลัก'},
  'entrepreneur.portal.field.taxIdHint': {
    en: 'Used to verify your business is a registered legal entity — never shown publicly.',
    th: 'ใช้ยืนยันว่าสถานประกอบการจดทะเบียนถูกต้องตามกฎหมาย — ไม่แสดงต่อสาธารณะ'
  },
  'entrepreneur.portal.formErrorRequired': {en: 'Please fill in all fields.', th: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'},
  'entrepreneur.portal.formErrorTaxId': {en: 'Tax ID must be 13 digits.', th: 'เลขประจำตัวผู้เสียภาษีต้องมี 13 หลัก'},
  'entrepreneur.portal.formErrorSignIn': {en: 'Please sign in with Google first.', th: 'กรุณาลงชื่อเข้าใช้ด้วย Google ก่อน'},
  'entrepreneur.portal.submitBtn': {en: 'Verify & Continue', th: 'ยืนยันและดำเนินการต่อ'},
  'entrepreneur.footer.tagline1': {
    en: 'AN INNOVATIVE PROTOTYPE OF BIOPHILIC ENVIRONMENTAL QUALITY INDEX PORTFOLIO FOR SUSTAINABLE COASTAL TOURISM: ',
    th: 'ต้นแบบนวัตกรรมพอร์ตฟอลิโอดัชนีคุณภาพสภาพแวดล้อมเชิงไบโอฟิลิกเพื่อการท่องเที่ยวชายฝั่งอย่างยั่งยืน: '
  },
  'entrepreneur.footer.tagline2': {en: 'A CASE STUDY OF PHANG-NGA PROVINCE, THAILAND', th: 'กรณีศึกษาจังหวัดพังงา ประเทศไทย'},

  /* ---------- entrepreneur-dashboard.html (เหมือนหน้านักท่องเที่ยว + ส่งให้ผู้ประเมิน + ติดตามสถานะ) ---------- */
  'entrepreneur.dashboard.portalAccessBtn': {en: 'Log Out', th: 'ออกจากระบบ'},
  'entrepreneur.dashboard.hero.title': {en: 'Assess Your Property', th: 'ประเมินพื้นที่ของคุณ'},
  'entrepreneur.dashboard.hero.subtitle': {
    en: 'Draw your property boundary, calculate its BEQI score, then submit it for official certification review.',
    th: 'วาดขอบเขตพื้นที่ของคุณ คำนวณคะแนน BEQI แล้วส่งให้ผู้ประเมินตรวจสอบเพื่อขอการรับรองอย่างเป็นทางการ'
  },
  'entrepreneur.dashboard.submitBtn': {en: 'Submit for Certification Review', th: 'ส่งขอรับรองผลการประเมิน'},
  'entrepreneur.dashboard.submitting': {en: 'Submitting…', th: 'กำลังส่ง…'},
  'entrepreneur.dashboard.submitted': {en: 'Submitted — an evaluator will review it soon.', th: 'ส่งแล้ว — ผู้ประเมินจะตรวจสอบในเร็ว ๆ นี้'},
  'entrepreneur.dashboard.submissionsHeading': {en: 'My Submissions', th: 'รายการที่ส่งไปแล้ว'},
  'entrepreneur.dashboard.submissionsEmpty': {
    en: 'No submissions yet — calculate a BEQI score above, then submit it for review.',
    th: 'ยังไม่มีรายการที่ส่ง — คำนวณคะแนน BEQI ด้านบนแล้วส่งขอรับรอง'
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
