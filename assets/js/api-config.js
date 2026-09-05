/* ตั้งค่าก่อนใช้งานเครื่องมือ "วาดขอบเขต & คำนวณ BEQI" ในหน้า explore.html
   ขั้นตอน deploy ฝั่ง server อยู่ใน server/README.md — ทำตามนั้นก่อนแล้วมาแทนค่า 2 ค่านี้:

   1. computeUrl — URL ของ Cloud Function ที่ได้จากตอน deploy (server/README.md ขั้นตอนที่ 3)
   2. secret     — ต้องตรงกับค่า BEQI_API_SECRET ที่ตั้งไว้ตอน deploy ฟังก์ชัน (แจกให้ผู้ใช้กลุ่มเล็กที่รู้จักกัน
                   เท่านั้น — ไม่ใช่กลไกความปลอดภัยจริงจัง เพราะค่านี้มองเห็นได้เสมอผ่าน view-source) */
const BEQI_API_CONFIG = {
  computeUrl: 'https://asia-southeast1-beqi-488814.cloudfunctions.net/computeBeqi',
  submitUrl: 'https://asia-southeast1-beqi-488814.cloudfunctions.net/submitApplication',
  statusUrl: 'https://asia-southeast1-beqi-488814.cloudfunctions.net/checkStatus',
  listSubmissionsUrl: 'https://asia-southeast1-beqi-488814.cloudfunctions.net/listSubmissions',
  updateSubmissionUrl: 'https://asia-southeast1-beqi-488814.cloudfunctions.net/updateSubmission',
  secret: 'ouN5_fkgzniQyQ9gjcaTWc54lUp8gv0k'
};
