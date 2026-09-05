/* คำแปล EN/TH เฉพาะหน้า check-status.html (ตรวจสอบผลด้วยเลขที่ใบสมัคร + PIN โดยไม่ต้องล็อกอิน)
   โหลดหลัง assets/js/i18n-dict.js และก่อน assets/js/i18n.js เสมอ */
Object.assign(window.BEQI_I18N_DICT = window.BEQI_I18N_DICT || {}, {

  'checkstatus.title': {en: 'Check Application Status', th: 'ตรวจสอบสถานะใบสมัคร'},
  'checkstatus.intro': {
    en: 'Enter the Submission ID and PIN you received when you submitted your property for certification review — no login required.',
    th: 'กรอกเลขที่ใบสมัครและ PIN ที่ได้รับตอนส่งขอรับรอง — ไม่ต้องเข้าสู่ระบบ'
  },
  'checkstatus.idLabel': {en: 'Submission ID', th: 'เลขที่ใบสมัคร'},
  'checkstatus.idPh': {en: 'e.g., BQ-XXXXXX', th: 'เช่น BQ-XXXXXX'},
  'checkstatus.pinLabel': {en: 'PIN', th: 'รหัส PIN'},
  'checkstatus.pinPh': {en: '6-digit PIN', th: 'รหัส 6 หลัก'},
  'checkstatus.submitBtn': {en: 'Check Status', th: 'ตรวจสอบสถานะ'},
  'checkstatus.checking': {en: 'Checking…', th: 'กำลังตรวจสอบ…'},
  'checkstatus.errRequired': {en: 'Please enter both the Submission ID and PIN.', th: 'กรุณากรอกเลขที่ใบสมัครและ PIN ให้ครบ'},
  'checkstatus.errNotFound': {
    en: 'No submission found for that ID and PIN — please double-check and try again.',
    th: 'ไม่พบใบสมัครที่ตรงกับเลขที่และ PIN นี้ — กรุณาตรวจสอบแล้วลองใหม่อีกครั้ง'
  },
  'checkstatus.errNetwork': {
    en: 'Could not reach the server. Please check your connection and try again.',
    th: 'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง'
  },
  'checkstatus.resultBusiness': {en: 'Business', th: 'สถานประกอบการ'},
  'checkstatus.resultZone': {en: 'Zone', th: 'โซน'},
  'checkstatus.resultSubmitted': {en: 'Submitted', th: 'ส่งเมื่อ'},
  'checkstatus.resultScoreCaption': {en: 'Self-assessed BEQI score (starting point, pending evaluator sign-off)', th: 'คะแนน BEQI ที่ประเมินตนเอง (คะแนนตั้งต้น รอผู้ประเมินยืนยัน)'},
  'checkstatus.resultScoreCaptionApproved': {en: 'Final BEQI score', th: 'คะแนน BEQI ที่ได้รับการรับรอง'},
  'checkstatus.zoneNorth': {en: 'North Zone', th: 'โซนเหนือ'},
  'checkstatus.zoneCentral': {en: 'Central Zone', th: 'โซนกลาง'},
  'checkstatus.zoneSouth': {en: 'South Zone', th: 'โซนใต้'},
  'checkstatus.newSearchBtn': {en: 'Check another submission', th: 'ตรวจสอบรายการอื่น'}
});
