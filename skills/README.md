# Skills

โฟลเดอร์นี้เก็บ Claude Skills ที่ใช้ประกอบการทำดุษฎีนิพนธ์ BEQI
(นวัตกรรมต้นแบบพอร์ตฟอลิโอดัชนีคุณภาพสภาพแวดล้อมเชิงไบโอฟิลิก สำหรับแหล่งท่องเที่ยวยั่งยืนชายฝั่งทะเล: กรณีศึกษาจังหวัดพังงา)

เก็บไว้ในรีโปเพื่อทำ version control ของตัว skill เอง — ไม่เกี่ยวข้องกับหน้าเว็บ dashboard
(`index.html`, `assets/`, `data/`) และไม่ถูกโหลดโดย GitHub Pages

## รายการ skill

| Skill | ใช้ทำอะไร |
|---|---|
| `academics/` | ไปป์ไลน์เขียนบทความวิชาการแบบ 12 agent (intake → literature → structure → draft → peer review → format) รองรับ 6 รูปแบบบทความ, 5 รูปแบบการอ้างอิง (APA 7, Chicago, MLA, IEEE, Vancouver), บทคัดย่อสองภาษา และ output เป็น LaTeX/DOCX/PDF/Markdown |
| `academic-paper-strategist/` | วางแผนบทความแบบ 3 เฟสมีด่านตรวจ: เลือกวารสารเป้าหมาย + style guide → กรอบทฤษฎี + วิเคราะห์ช่องว่างงานวิจัย → outline ที่ให้คะแนนแบบ reviewer (7 มิติ / 35 คะแนน ต้องได้ ≥28 จึงเขียนต่อ) |
| `academic-paper-composer/` | เขียนบทความเต็มจาก outline ที่ผ่านการอนุมัติแล้ว 3 เฟส: วาง style guide + แผนบท → ร่างทีละบทพร้อมตรวจคุณภาพ → ขัดเกลาและเตรียมส่ง พร้อมประเมิน 35 คะแนนรอบสุดท้าย |
| `canvas-design/` | สร้างงานออกแบบภาพนิ่งเป็น .png / .pdf (โปสเตอร์ ป้าย งานนำเสนอเชิงกราฟิก) โดยเริ่มจากการเขียน design philosophy ก่อนแล้วจึงถ่ายทอดลงบนแคนวาส มีชุดฟอนต์ให้ใน `canvas-fonts/` |

## ลำดับการใช้งานที่แนะนำ

```
academic-paper-strategist  →  academic-paper-composer  →  academics (format / peer review)
                                                       ↘  canvas-design (รูปประกอบ, โปสเตอร์)
```

- เริ่มจาก **strategist** เมื่อยังไม่มี outline (เลือกวารสาร หาช่องว่างงานวิจัย)
- ใช้ **composer** เมื่อมี outline แล้วและต้องการร่างเนื้อความ
- ใช้ **academics** เมื่อต้องการ agent เฉพาะทาง เช่น ตรวจการอ้างอิง เขียนบทคัดย่อสองภาษา แปลงเป็น LaTeX/DOCX หรือถอดความเห็นกรรมการ
- ใช้ **canvas-design** สำหรับโปสเตอร์นำเสนอหรือภาพประกอบของงานวิจัย

## โครงสร้าง

```
skills/
├── academics/
│   ├── SKILL.md
│   └── agents/                  # 12 agent (intake, literature, structure, draft, review, format, ...)
├── academic-paper-strategist/
│   └── SKILL.md
├── academic-paper-composer/
│   └── SKILL.md
└── canvas-design/
    ├── SKILL.md
    ├── LICENSE.txt
    └── canvas-fonts/            # ฟอนต์สำหรับงานออกแบบ
```

## ที่มาและสัญญาอนุญาต

- `academic-paper-strategist` และ `academic-paper-composer` ดัดแปลงมาจาก
  [lishix520/academic-paper-skills](https://github.com/lishix520/academic-paper-skills) (MIT, Li Shixiong)
- `canvas-design` มีเงื่อนไขการใช้งานอยู่ใน `canvas-design/LICENSE.txt`
- `academics` เป็นไปป์ไลน์ที่พัฒนาต่อจาก academic-paper v3.1.1

## วิธีนำไปใช้

คัดลอกโฟลเดอร์ skill ที่ต้องการไปไว้ในไดเรกทอรี skills ของ Claude
(เช่น `~/.claude/skills/`) แล้วเรียกใช้ด้วยชื่อ skill ในการสนทนา
