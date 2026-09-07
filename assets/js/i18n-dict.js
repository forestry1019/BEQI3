/* พจนานุกรมคำแปล EN/TH ของทั้งเว็บ — โหลดก่อน assets/js/i18n.js เสมอ
   คีย์ตั้งชื่อเป็น "หน้า.ส่วน.รายละเอียด" เพื่อไม่ให้ชนกันข้ามหน้า
   คีย์ในกลุ่ม "common.*" ใช้ร่วมกันหลายหน้า (เมนู/ปุ่มภาษา/footer ฯลฯ) */
window.BEQI_I18N_DICT = {

  /* ---------- common: header / nav / footer ---------- */
  'common.nav.tourists': {en: 'General Public (Government Officials/ Researchers)', th: 'บุคคลทั่วไป (เจ้าหน้าที่รัฐ/ นักวิจัย)'},
  'common.nav.entrepreneurs': {en: 'Entrepreneurs', th: 'ผู้ประกอบการ'},
  'common.nav.evaluators': {en: 'Evaluators', th: 'ผู้ประเมิน'},
  'common.footer.copyright': {
    en: 'Copyright © 2026 Ph.D.Dissertation of Panichat Kitisittichai 6581019720. All rights reserved.',
    th: 'สงวนลิขสิทธิ์ © 2026 ดุษฎีนิพนธ์ของ ปาณิชาติ กิติสิทธิชัย รหัสนิสิต 6581019720 CUTIP'
  },

  /* ---------- index.html ---------- */
  'index.hero.label': {en: 'Biophilic Environmental Quality Index', th: 'ดัชนีคุณภาพสภาพแวดล้อมเชิงไบโอฟิลิก'},
  'index.hero.quote': {
    en: '"If you can\'t measure it, you can\'t improve it."<br>- Lord Kelvin',
    th: '"หากวัดไม่ได้ ก็ปรับปรุงไม่ได้"<br>- ลอร์ดเคลวิน'
  },
  'index.hero.cta': {en: 'Explore the Index', th: 'สำรวจดัชนี'},

  /* ---------- index.html: About BEQI Portfolio section ---------- */
  'index.about.title': {en: 'BEQI Portfolio', th: 'BEQI Portfolio'},
  'index.about.intro': {
    en: 'BEQI Portfolio is an innovative web-based platform that calculates and compares Biophilic Environmental Quality Index (BEQI) scores across multiple locations to drive sustainable coastal tourism.',
    th: 'BEQI Portfolio คือนวัตกรรมแพลตฟอร์มดิจิทัลบนเว็บแอปพลิเคชัน ที่ช่วยคำนวณและเปรียบเทียบคะแนนดัชนีคุณภาพสภาพแวดล้อมเชิงไบโอฟิลิก (Biophilic Environmental Quality Index) ของหลายพื้นที่ เพื่อขับเคลื่อนการท่องเที่ยวชายฝั่งทะเลอย่างยั่งยืน'
  },
  'index.about.bullet1.title': {en: 'Data-Driven Scoring', th: 'ให้คะแนนจากข้อมูลจริง'},
  'index.about.bullet1.body': {
    en: 'Translates physical data from satellite imagery and on-site surveys, measured against the 14 Patterns of Biophilic Design, into a precise BEQI score for individual sites.',
    th: 'แปลงข้อมูลเชิงกายภาพจากภาพถ่ายดาวเทียมและการสำรวจภาคสนามตามกรอบ 14 Patterns of Biophilic Design ให้เป็นคะแนนดัชนี BEQI ที่แม่นยำของแต่ละพื้นที่'
  },
  'index.about.bullet2.title': {en: 'Portfolio Comparison', th: 'เปรียบเทียบแบบพอร์ตโฟลิโอ'},
  'index.about.bullet2.body': {
    en: 'Displays multiple locations side-by-side, equipping stakeholders with clear data to support strategic investment and risk-management decisions.',
    th: 'แสดงผลหลายพื้นที่เทียบเคียงกัน ให้ผู้มีส่วนเกี่ยวข้องมีข้อมูลชัดเจนประกอบการตัดสินใจเชิงกลยุทธ์ด้านการลงทุนและการบริหารความเสี่ยง'
  },
  'index.about.bullet3.title': {en: 'Commercial Certification', th: 'การรับรองเชิงพาณิชย์'},
  'index.about.bullet3.body': {
    en: 'Operates a tiered "BEQI Certified" system (Silver, Gold, and Platinum) to incentivize and recognize eco-friendly development.',
    th: 'ดำเนินระบบ "BEQI Certified" แบบมีระดับ (Silver, Gold, Platinum) เพื่อจูงใจและยกย่องการพัฒนาที่เป็นมิตรต่อสิ่งแวดล้อม'
  },
  'index.about.bullet4.title': {en: 'Real-World Application', th: 'การประยุกต์ใช้จริง'},
  'index.about.bullet4.body': {
    en: 'Currently demonstrated through a comprehensive case study focused on coastal tourism in Phang Nga Province, Thailand.',
    th: 'สาธิตผ่านกรณีศึกษาการท่องเที่ยวชายฝั่งทะเลในจังหวัดพังงา ประเทศไทย'
  },
  'index.about.biophilia.title': {en: 'What Is Biophilia?', th: 'ไบโอฟิเลีย (Biophilia) คืออะไร'},
  'index.about.biophilia.intro': {
    en: 'Biophilia describes the innate human drive to connect with the natural world. Over the past 50 years, the concept has evolved from a psychological theory into a measurable architectural framework:',
    th: 'ไบโอฟิเลียหมายถึงแรงปรารถนาโดยกำเนิดของมนุษย์ที่จะเชื่อมโยงกับโลกธรรมชาติ ตลอด 50 ปีที่ผ่านมา แนวคิดนี้พัฒนาจากทฤษฎีทางจิตวิทยาสู่กรอบสถาปัตยกรรมที่วัดผลได้:'
  },
  'index.about.biophilia.item1.year': {en: '1973', th: '1973'},
  'index.about.biophilia.item1.title': {en: 'The Concept', th: 'จุดกำเนิดแนวคิด'},
  'index.about.biophilia.item1.body': {
    en: 'Erich Fromm first defined biophilia as "a passionate love of life and of all that is alive," reflecting a fundamental human drive to nurture growth.',
    th: 'Erich Fromm นิยามไบโอฟิเลียไว้เป็นคนแรกว่าคือ "ความรักที่แรงกล้าต่อสิ่งมีชีวิตทั้งหมด" สะท้อนแรงปรารถนาพื้นฐานของมนุษย์ในการส่งเสริมการเติบโตของชีวิต'
  },
  'index.about.biophilia.item2.year': {en: '1984', th: '1984'},
  'index.about.biophilia.item2.title': {en: 'The Hypothesis', th: 'สมมติฐาน'},
  'index.about.biophilia.item2.body': {
    en: 'E.O. Wilson expanded the idea, proposing that our urge to affiliate with nature is an innate, biologically rooted evolutionary trait.',
    th: 'E.O. Wilson ต่อยอดแนวคิดนี้ โดยเสนอว่าแรงโหยหาธรรมชาติของมนุษย์เป็นลักษณะทางวิวัฒนาการที่มีรากฐานทางชีววิทยาโดยกำเนิด'
  },
  'index.about.biophilia.item3.year': {en: '2015', th: '2015'},
  'index.about.biophilia.item3.title': {en: 'The Application', th: 'การประยุกต์ใช้'},
  'index.about.biophilia.item3.body': {
    en: 'Kellert &amp; Calabrese translated this biology into Biophilic Design — the science of creating built environments that restore our connection to nature.',
    th: 'Kellert &amp; Calabrese แปลงหลักชีววิทยานี้เป็น "การออกแบบเชิงไบโอฟิลิก" (Biophilic Design) — ศาสตร์แห่งการออกแบบสภาพแวดล้อมก่อสร้างให้ฟื้นฟูความสัมพันธ์ระหว่างมนุษย์กับธรรมชาติ'
  },
  'index.about.biophilia.closing': {
    en: 'This practical application relies on the 14 Patterns of Biophilic Design (such as visual connections to nature, the presence of water, and biomorphic forms), which serve as the foundational metric for BEQI\'s Indicator 4.',
    th: 'การประยุกต์ใช้เชิงปฏิบัตินี้อาศัยกรอบ 14 Patterns of Biophilic Design (เช่น การเชื่อมโยงด้วยสายตากับธรรมชาติ การมีอยู่ของน้ำ และรูปทรงชีวภาพ) ซึ่งเป็นตัวชี้วัดพื้นฐานของตัวชี้วัดที่ 4 ของ BEQI'
  },
  'index.about.beqi.title': {en: 'What Is BEQI?', th: 'BEQI คืออะไร'},
  'index.about.beqi.intro': {
    en: 'The Biophilic Environmental Quality Index (BEQI) converts these design principles into an objective, measurable score. It relies entirely on physical data gathered via Google Earth Engine satellite imagery and on-site field surveys, tracking four specific indicators:',
    th: 'ดัชนีคุณภาพสภาพแวดล้อมเชิงไบโอฟิลิก (BEQI) แปลงหลักการออกแบบข้างต้นให้เป็นคะแนนที่วัดผลได้อย่างเป็นภววิสัย โดยอิงข้อมูลเชิงกายภาพทั้งหมดจากภาพถ่ายดาวเทียม Google Earth Engine และการสำรวจภาคสนาม ครอบคลุม 4 ตัวชี้วัด ได้แก่:'
  },
  'index.about.beqi.item1': {en: 'Structural green-space density', th: 'ความหนาแน่นของพื้นที่สีเขียวเชิงโครงสร้าง'},
  'index.about.beqi.item2': {en: 'Ecological network connectivity', th: 'ความต่อเนื่องของโครงข่ายนิเวศ'},
  'index.about.beqi.item3': {en: 'Access to water', th: 'การเข้าถึงพื้นที่น้ำ'},
  'index.about.beqi.item4': {en: 'Density of biophilic design elements (utilizing the 14 Patterns)', th: 'ความหนาแน่นขององค์ประกอบการออกแบบเชิงไบโอฟิลิก (ตามกรอบ 14 Patterns)'},
  'index.about.whyIndex.title': {en: 'Why an Index?', th: 'ทำไมต้องทำเป็น "ดัชนี"'},
  'index.about.whyIndex.subtitle': {en: 'Not relying solely on human-opinion surveys', th: 'ไม่ใช้แบบสอบถามความเห็นคนอย่างเดียว'},
  'index.about.whyIndex.intro': {
    en: 'Existing assessment tools (like Blue Flag or GSTC) and previous biophilia research rely heavily on psychological surveys. Human-opinion metrics are vulnerable to personal bias, fluctuate with respondent mood, require complex ethics reviews (IRB), and are expensive to update. A quantitative, data-driven index solves this by providing metrics that are:',
    th: 'เครื่องมือประเมินแบบเดิม (Blue Flag, GSTC ฯลฯ) และงานวิจัยไบโอฟิเลียส่วนใหญ่ในอดีตพึ่งพาการสำรวจเชิงจิตวิทยาเป็นหลัก ตัวชี้วัดจากความคิดเห็นมนุษย์เสี่ยงต่ออคติส่วนบุคคล ผันแปรตามอารมณ์ผู้ตอบ ต้องผ่านการพิจารณาจริยธรรมวิจัยที่ซับซ้อน (IRB) และมีต้นทุนสูงในการอัปเดต ดัชนีเชิงปริมาณจากข้อมูลจริงแก้ปัญหานี้ได้ด้วยคุณสมบัติดังนี้:'
  },
  'index.about.whyIndex.item1.title': {en: 'Objective & Empirical', th: 'ภววิสัยและเชิงประจักษ์'},
  'index.about.whyIndex.item1.body': {
    en: 'Grounded in hard physical data, offering concrete evidence for policy-making while actively preventing "greenwashing."',
    th: 'อิงข้อมูลเชิงกายภาพที่จับต้องได้ ให้หลักฐานที่เป็นรูปธรรมสำหรับการกำหนดนโยบาย พร้อมป้องกันการ "ฟอกเขียว" (Greenwashing) อย่างจริงจัง'
  },
  'index.about.whyIndex.item2.title': {en: 'Agile & Replicable', th: 'คล่องตัวและทำซ้ำได้'},
  'index.about.whyIndex.item2.body': {
    en: 'Significantly lower-cost and easier to continuously update without relying on human surveying.',
    th: 'ต้นทุนต่ำกว่าอย่างมีนัยสำคัญ และอัปเดตต่อเนื่องได้ง่ายโดยไม่ต้องพึ่งพาการสำรวจความคิดเห็นมนุษย์'
  },
  'index.about.whyPortfolio.title': {en: 'Why a Portfolio?', th: 'ทำไมต้องทำเป็น "Portfolio"'},
  'index.about.whyPortfolio.subtitle': {en: 'Not just assessing one site at a time', th: 'ไม่ใช่แค่ประเมินทีละพื้นที่'},
  'index.about.whyPortfolio.body': {
    en: 'Drawing on Cooper et al.\'s (2001) portfolio-innovation theory, managing single projects in isolation cannot build a sustainable business advantage. The BEQI platform reframes individual destinations as "strategic investment units" by assessing multiple sites side by side (such as Khao Lak, Phang Nga\'s North, Central, and South zones). This comparative approach allows stakeholders to:',
    th: 'อิงทฤษฎีนวัตกรรมเชิงพอร์ตโฟลิโอของ Cooper et al. (2001) ที่ว่าการบริหารแบบ "โครงการเดี่ยว" ไม่พอสำหรับสร้างความได้เปรียบทางธุรกิจที่ยั่งยืน BEQI Portfolio จึงเปลี่ยนมุมมอง "แหล่งท่องเที่ยว" ให้เป็น "หน่วยลงทุนเชิงกลยุทธ์" โดยประเมินหลายพื้นที่เทียบเคียงกัน เช่น 3 โซนเขาหลัก พังงา ได้แก่ โซนเหนือ โซนกลาง และโซนใต้ แนวทางเชิงเปรียบเทียบนี้ช่วยให้ผู้มีส่วนเกี่ยวข้อง:'
  },
  'index.about.whyPortfolio.item1.title': {en: 'Prioritize Investment', th: 'จัดลำดับความสำคัญการลงทุน'},
  'index.about.whyPortfolio.item1.body': {
    en: 'Identify exactly which sites will yield the highest return for development spending.',
    th: 'รู้ชัดเจนว่าควรลงทุนพัฒนาพื้นที่ไหนก่อนจึงจะคุ้มค่าที่สุด'
  },
  'index.about.whyPortfolio.item2.title': {en: 'Manage Risk', th: 'บริหารความเสี่ยง'},
  'index.about.whyPortfolio.item2.body': {
    en: 'Diversify resources so funding can seamlessly pivot if one zone becomes ecologically degraded or overcrowded.',
    th: 'กระจายทรัพยากร เพื่อให้โยกงบประมาณไปโซนอื่นได้ทันทีหากโซนหนึ่งเสื่อมโทรมทางนิเวศหรือแออัดเกินไป'
  },
  'index.about.whyPortfolio.item3.title': {en: 'Drive Competition', th: 'สร้างการแข่งขันเชิงบวก'},
  'index.about.whyPortfolio.item3.body': {
    en: 'Foster benchmarking among sites and operators to generate a "Green Premium," ultimately supporting the commercial "BEQI Certified" standard.',
    th: 'ส่งเสริม Benchmarking ระหว่างพื้นที่/ผู้ประกอบการ นำไปสู่ "ส่วนต่างราคาสีเขียว" (Green Premium) และต่อยอดสู่มาตรฐานรับรองเชิงพาณิชย์ "BEQI Certified" ได้จริง'
  }
};
