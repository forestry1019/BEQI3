/* คำแปล EN/TH เฉพาะหน้า explore.html (แผนที่วาดขอบเขต + ผลคำนวณ BEQI สูงสุด 3 พื้นที่พร้อมเปรียบเทียบ)
   ใช้ร่วมกับ entrepreneur-dashboard.html ด้วย (โหลดหลัง assets/js/i18n-dict.js และก่อน assets/js/i18n.js) */
Object.assign(window.BEQI_I18N_DICT = window.BEQI_I18N_DICT || {}, {

  /* ---------- header ---------- */
  'explore.header.portalAccess': {en: 'Portal Access', th: 'เข้าสู่พอร์ทัล'},

  /* ---------- hero ---------- */
  'explore.hero.title': {en: 'Explore the Coast', th: 'สำรวจชายฝั่ง'},

  /* ---------- how-to box ---------- */
  'explore.howto.heading': {en: 'How to Use This Page', th: 'วิธีใช้งานหน้านี้'},
  'explore.howto.intro': {
    en: 'Explore the Biophilic Environmental Quality Index (BEQI) across Khao Lak by calculating live satellite data for any custom zone.',
    th: 'สำรวจดัชนีคุณภาพสภาพแวดล้อมเชิงไบโอฟิลิก (BEQI) ในพื้นที่เขาหลัก ด้วยการคำนวณข้อมูลดาวเทียมแบบสดสำหรับพื้นที่ที่คุณกำหนดเอง'
  },
  'explore.howto.step1Title': {en: 'Trace Your Boundary', th: 'วาดขอบเขตพื้นที่ของคุณ'},
  'explore.howto.step1': {
    en: 'Click the map to drop points and outline your area of interest (minimum of three points). Click "Close shape" or click your starting point to seal the area.',
    th: 'คลิกบนแผนที่เพื่อปักจุดและวาดขอบเขตพื้นที่ที่สนใจ (อย่างน้อย 3 จุด) แล้วกด "ปิดรูปหลายเหลี่ยม" หรือคลิกจุดเริ่มต้นซ้ำเพื่อปิดพื้นที่'
  },
  'explore.howto.step2Title': {en: 'Calculate the Index', th: 'คำนวณดัชนี'},
  'explore.howto.step2': {
    en: 'Click "Calculate BEQI" to instantly compute Indicators 1–3 using live satellite imagery for your selected zone.',
    th: 'กดปุ่ม "คำนวณ BEQI" เพื่อคำนวณตัวชี้วัดที่ 1–3 ทันทีจากภาพถ่ายดาวเทียมสดของพื้นที่ที่เลือก'
  },
  'explore.howto.step3Title': {en: 'Compare Areas', th: 'เปรียบเทียบพื้นที่'},
  'explore.howto.step3': {
    en: 'Draw up to three distinct boundaries to evaluate them side-by-side, or check the box to compare your custom area against the Portfolio\'s three reference zones.',
    th: 'วาดได้สูงสุด 3 ขอบเขตเพื่อเปรียบเทียบกันเอง หรือติ๊กเลือกเพื่อเปรียบเทียบพื้นที่ของคุณกับ 3 โซนอ้างอิงของ Portfolio'
  },
  'explore.howto.step4Title': {en: 'Discover Certified Properties', th: 'ค้นหาสถานประกอบการที่ผ่านการรับรอง'},
  'explore.howto.step4': {
    en: 'Scroll down to the Certified Properties section to view local businesses that have achieved official BEQI certification.',
    th: 'เลื่อนลงไปที่ส่วน "สถานประกอบการที่ผ่านการรับรอง" เพื่อดูรายชื่อธุรกิจในพื้นที่ที่ได้รับการรับรอง BEQI อย่างเป็นทางการ'
  },

  /* ---------- draw tool controls ---------- */
  'explore.draw.undoBtn': {en: 'Undo last point', th: 'ย้อนจุดล่าสุด'},
  'explore.draw.closeBtn': {en: 'Close shape', th: 'ปิดรูปหลายเหลี่ยม'},
  'explore.draw.clearBtn': {en: 'Clear', th: 'ล้าง'},
  'explore.draw.runBtn': {en: 'Calculate BEQI', th: 'คำนวณ BEQI'},
  'explore.draw.mapLoading': {en: 'Loading map…', th: 'กำลังโหลดแผนที่…'},
  'explore.draw.mapLoadError': {en: 'Failed to load parameters', th: 'โหลดพารามิเตอร์ไม่สำเร็จ'},

  /* ---------- result cards (up to 3 areas, 4 indicators always shown + total when available) ---------- */
  'explore.result.areaLabel': {en: 'Area {n}', th: 'พื้นที่ {n}'},
  'explore.result.removeBtn': {en: 'Remove', th: 'ลบ'},
  'explore.result.scoreLabel': {en: 'BEQI Score', th: 'คะแนน BEQI'},
  'explore.result.bandLabel': {en: 'Certification Level', th: 'ระดับการรับรอง'},
  'explore.result.ciLabel': {en: '95% CI', th: 'ช่วงความเชื่อมั่น 95%'},
  'explore.result.notCertified': {en: 'Not certified', th: 'ไม่ผ่านการรับรอง'},
  'explore.result.empty': {en: 'Draw an area on the map and click "Calculate BEQI" to see indicators 1–3 here — draw up to 3 areas to compare them.', th: 'วาดพื้นที่บนแผนที่แล้วกด "คำนวณ BEQI" เพื่อดูตัวชี้วัดที่ 1-3 ที่นี่ — วาดได้สูงสุด 3 พื้นที่เพื่อเปรียบเทียบกัน'},
  'explore.result.footnote': {
    en: 'Indicators 1-3 are computed live from satellite imagery. Indicator 4 (biophilic composition) requires photo/on-site assessment per the 14-pattern checklist and is never estimated from satellite data — see the note on each card. The 95% confidence interval shown is a real-time approximation for this drawn area, not the offline Monte Carlo used for the 3 reference zones.',
    th: 'ตัวชี้วัดที่ 1-3 คำนวณสดจากภาพถ่ายดาวเทียม ส่วนตัวชี้วัดที่ 4 (องค์ประกอบไบโอฟิลิก) ต้องประเมินจากภาพถ่าย/ลงพื้นที่จริงตามแบบตรวจสอบ 14 รูปแบบเท่านั้น ไม่มีการประมาณจากดาวเทียมเด็ดขาด — ดูข้อความกำกับในแต่ละการ์ด ช่วงความเชื่อมั่น 95% ที่แสดงเป็นค่าประมาณแบบเรียลไทม์เฉพาะพื้นที่ที่วาดนี้ ไม่ใช่วิธี Monte Carlo แบบออฟไลน์ที่ใช้กับ 3 โซนอ้างอิง'
  },
  'explore.result.ind4NoneShort': {en: 'Pending', th: 'รอข้อมูล'},
  'explore.result.ind4Pending': {
    en: 'Indicator 4 not yet assessed — this area has no total score or certification yet.',
    th: 'ยังไม่มีการประเมินตัวชี้วัดที่ 4 — พื้นที่นี้ยังไม่มีคะแนนรวมหรือการรับรอง'
  },
  'explore.result.ind4ZoneContext': {
    en: 'Indicator 4 shown is borrowed from the {zone} zone\'s surrounding context — not measured from this exact plot. Certification cannot be issued from this preview.',
    th: 'ตัวชี้วัดที่ 4 ที่แสดงยืมมาจากค่าบริบทของโซน{zone} — ไม่ใช่ค่าที่วัดจากแปลงนี้จริง ไม่สามารถออกใบรับรองจากตัวอย่างนี้ได้'
  },
  'explore.result.awaitingScore': {en: 'Awaiting indicator 4 assessment', th: 'รอการประเมินตัวชี้วัดที่ 4'},
  'explore.result.previewTag': {en: '(preview)', th: '(ตัวอย่าง)'},
  'explore.result.pendingCert': {en: 'Pending assessment', th: 'รอการประเมิน'},

  /* ---------- public certification registry ---------- */
  'explore.registry.heading': {en: 'Certified Properties', th: 'สถานประกอบการที่ผ่านการรับรอง'},
  'explore.registry.subtitle': {
    en: 'Businesses that have completed evaluator review and received an official BEQI certification.',
    th: 'สถานประกอบการที่ผ่านการตรวจสอบจากผู้ประเมินและได้รับการรับรอง BEQI อย่างเป็นทางการแล้ว'
  },
  'explore.registry.empty': {en: 'No certified properties yet.', th: 'ยังไม่มีสถานประกอบการที่ผ่านการรับรอง'},
  'explore.registry.certifiedOn': {en: 'Certified', th: 'รับรองเมื่อ'},
  'explore.registry.zoneNorth': {en: 'North Zone — Coral Beach & Bustling Beach', th: 'โซนเหนือ — หาดปะการังและหาดคึกคัก'},
  'explore.registry.zoneCentral': {en: 'Central Zone — Bang Niang Beach & Nang Thong Beach', th: 'โซนกลาง — หาดบางเนียงและหาดนางทอง'},
  'explore.registry.zoneSouth': {en: 'South Zone — Khao Lak-Lam Ru National Park', th: 'โซนใต้ — อุทยานแห่งชาติเขาหลัก-ลำรู่'},

  /* ---------- compare section ---------- */
  'explore.compare.heading': {en: 'Compare Areas', th: 'เปรียบเทียบพื้นที่'},
  'explore.compare.maxReached': {en: 'Maximum {n} area(s) reached — remove one above to draw another', th: 'ครบ {n} พื้นที่แล้ว — ลบพื้นที่หนึ่งด้านบนก่อนวาดเพิ่ม'},
  'explore.compare.indicatorHeader': {en: 'Indicator', th: 'ตัวชี้วัด'},
  'explore.compare.totalScoreRow': {en: 'Total score', th: 'คะแนนรวม'},
  'explore.compare.beqiScoreLabel': {en: 'BEQI score', th: 'คะแนน BEQI'},
  'explore.compare.includeZonesLabel': {
    en: 'Compare against the Portfolio\'s 3 main zones as a reference benchmark',
    th: 'เทียบกับ 3 โซนหลักของ Portfolio เป็นมาตรฐานอ้างอิง'
  },
  'explore.compare.referenceSuffix': {en: 'reference', th: 'อ้างอิง'},
  'explore.compare.ind1': {en: 'Green area density', th: 'ความหนาแน่นพื้นที่สีเขียว'},
  'explore.compare.ind2': {en: 'Ecosystem connectivity', th: 'การเชื่อมโยงระบบนิเวศ'},
  'explore.compare.ind3': {en: 'Water access', th: 'การเข้าถึงแหล่งน้ำ'},
  'explore.compare.ind4': {en: 'Biophilic composition', th: 'องค์ประกอบไบโอฟิลิก'},

  /* ---------- picker.js: drawing status messages ---------- */
  'explore.picker.status.empty': {
    en: 'Click along the boundary point by point to start drawing an area',
    th: 'คลิกไล่ตามขอบเขตทีละจุดเพื่อเริ่มวาดพื้นที่'
  },
  'explore.picker.status.drawing': {
    en: 'Placed {n} point(s) — keep clicking to add more, click the first point again, or click "Close shape" once you have at least 3 points',
    th: 'วางแล้ว {n} จุด — คลิกต่อเพื่อเพิ่มจุด, คลิกจุดแรกซ้ำ หรือกด "ปิดรูปหลายเหลี่ยม" เมื่อครบ (อย่างน้อย 3 จุด)'
  },
  'explore.picker.status.closed': {
    en: 'Shape closed ({n} boundary points) — click "Calculate BEQI" to see your score',
    th: 'ปิดรูปแล้ว ({n} จุดขอบเขต) — กด "คำนวณ BEQI" เพื่อดูคะแนน'
  },
  'explore.picker.status.needsAuth': {en: '(must connect to Earth Engine first)', th: '(ต้องเชื่อมต่อ Earth Engine ก่อน)'},

  /* ---------- picker.js: Earth Engine auth UI (client-side fallback when no backend is configured) ---------- */
  'explore.picker.auth.libFailTitle': {en: 'Failed to load the Earth Engine library', th: 'โหลดไลบรารี Earth Engine ไม่สำเร็จ'},
  'explore.picker.auth.libFailBody': {en: 'Check your internet connection and refresh this page', th: 'ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วรีเฟรชหน้านี้'},
  'explore.picker.auth.notConfiguredTitle': {en: 'Google Earth Engine is not configured yet', th: 'ยังไม่ได้ตั้งค่า Google Earth Engine'},
  'explore.picker.auth.notConfiguredBody': {
    en: 'Edit <code>assets/js/gee-config.js</code> and fill in the OAuth Client ID and Cloud Project ID before using this tool (see the steps in README.md)',
    th: 'แก้ไขไฟล์ <code>assets/js/gee-config.js</code> ใส่ OAuth Client ID และ Cloud Project ID ก่อนใช้งานเครื่องมือนี้ (ดูขั้นตอนใน README.md)'
  },
  'explore.picker.auth.fileProtocolTitle': {en: 'Opened directly from disk (file://) — cannot connect to Earth Engine', th: 'เปิดไฟล์โดยตรงอยู่ (file://) — เชื่อมต่อ Earth Engine ไม่ได้'},
  'explore.picker.auth.fileProtocolBody': {
    en: 'The OAuth Client ID only allows pre-registered domains (such as http://localhost:8000 or https://forestry1019.github.io) — opening the file directly via file:// will never connect. Run a local server first with <code>python3 -m http.server 8000</code> and open http://localhost:8000 (see the "Usage" section in README.md)',
    th: 'OAuth Client ID อนุญาตเฉพาะโดเมนที่ลงทะเบียนไว้ล่วงหน้า (เช่น http://localhost:8000 หรือ https://forestry1019.github.io) การเปิดไฟล์ตรง ๆ ผ่าน file:// จะเชื่อมต่อไม่ได้เสมอ ให้รันเซิร์ฟเวอร์ในเครื่องก่อนด้วยคำสั่ง <code>python3 -m http.server 8000</code> แล้วเปิด http://localhost:8000 (ดูหัวข้อ "การใช้งาน" ใน README.md)'
  },
  'explore.picker.auth.checking': {en: 'Checking connection status…', th: 'กำลังตรวจสอบสถานะการเชื่อมต่อ…'},
  'explore.picker.auth.loginBtn': {en: 'Connect Google Earth Engine account', th: 'เชื่อมต่อบัญชี Google Earth Engine'},
  'explore.picker.auth.notConnected': {en: 'Not connected yet', th: 'ยังไม่ได้เชื่อมต่อ'},
  'explore.picker.auth.openingPopup': {
    en: 'Opening the Google login window… (if no popup appears, check whether your browser is blocking popups for this page, allow it, then try again)',
    th: 'กำลังเปิดหน้าต่างล็อกอินของ Google… (หากไม่มีป๊อปอัปเด้งขึ้นมา ให้ตรวจสอบว่าเบราว์เซอร์บล็อกป๊อปอัปของหน้านี้อยู่หรือไม่ แล้วอนุญาตแล้วลองใหม่)'
  },
  'explore.picker.auth.connected': {en: 'Connected — ready to calculate', th: 'เชื่อมต่อสำเร็จ พร้อมคำนวณ'},
  'explore.picker.auth.connectFailed': {en: 'Connection failed: {msg} (see more detail in the Console — press F12)', th: 'เชื่อมต่อไม่สำเร็จ: {msg} (ดูรายละเอียดเพิ่มเติมใน Console — กด F12)'},

  /* ---------- picker.js: analysis run ---------- */
  'explore.picker.run.processing': {en: 'Calculating…', th: 'กำลังคำนวณ…'},
  'explore.picker.run.slow': {
    en: 'Processing is taking unusually long (over 30 seconds). This may be because the drawn area is too large, the internet connection is slow, or the Earth Engine account/project doesn’t have access yet — try drawing a smaller area or refresh and reconnect your account.',
    th: 'การประมวลผลใช้เวลานานผิดปกติ (เกิน 30 วินาที) อาจเกิดจากแปลงที่วาดมีขนาดใหญ่เกินไป การเชื่อมต่ออินเทอร์เน็ตช้า หรือบัญชี/โปรเจกต์ Earth Engine ยังไม่ได้รับสิทธิ์ใช้งาน — ลองวาดแปลงให้เล็กลง หรือรีเฟรชหน้าแล้วเชื่อมต่อบัญชีใหม่'
  },
  'explore.picker.run.apiFailed': {en: 'Calculation failed: {msg}', th: 'คำนวณไม่สำเร็จ: {msg}'}
});
