# BEQI compute — Cloud Function backend

แทนที่การให้ผู้ใช้แต่ละคนล็อกอิน Google Earth Engine เองในเบราว์เซอร์ (แบบเดิม) ด้วย Cloud Function
ตัวเดียวที่ถือสิทธิ์ Earth Engine ผ่าน service account ของตัวเอง ผู้ใช้เว็บไม่ต้องล็อกอินอะไรเลย —
`explore.html` จะเรียก endpoint นี้แทนการเรียก `ee.data.*` ตรงจากเบราว์เซอร์

เหมาะสำหรับผู้ใช้กลุ่มเล็กที่รู้จักกันและแจกรหัสผ่าน (`BEQI_API_SECRET`) ให้ — **ไม่ใช่ระบบรักษาความปลอดภัย
ที่แท้จริง** เพราะรหัสที่ frontend ส่งไปจะมองเห็นได้เสมอผ่าน Network tab/view-source ของเบราว์เซอร์ ใช้กัน
การเรียกพร่ำเพรื่อโดยคนทั่วไปที่ไม่รู้รหัส ไม่ใช่กันผู้ที่ตั้งใจเจาะระบบจริงจัง

## 1) เตรียมโปรเจกต์ Google Cloud (ทำครั้งเดียว)

ใช้โปรเจกต์ Earth Engine เดิมที่ตั้งไว้แล้วใน `assets/js/gee-config.js` คือ `beqi-488814`
(เปลี่ยนเป็นโปรเจกต์อื่นได้ถ้าต้องการ — แก้ `--project=` ในคำสั่งด้านล่างทั้งหมด)

```bash
gcloud config set project beqi-488814
gcloud services enable earthengine.googleapis.com cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com run.googleapis.com aiplatform.googleapis.com --project=beqi-488814
```

(`aiplatform.googleapis.com` ใช้สำหรับ `aiDraftPatterns` — ตัวช่วยร่างคำตอบตัวชี้วัดที่ 4 ด้วย AI ดูหัวข้อ 6)

## 2) ติดตั้ง dependency แล้วทดสอบในเครื่องก่อน (ไม่บังคับ)

```bash
cd server
npm install
npm start   # รันที่ http://localhost:8080 ด้วย functions-framework
```

ทดสอบเรียกแบบง่าย (จะ error เรื่อง auth ถ้ายังไม่ได้ตั้ง Application Default Credentials ในเครื่อง —
`gcloud auth application-default login` ก่อน ถ้าอยากทดสอบในเครื่อง ไม่บังคับถ้าจะ deploy ตรง ๆ):

```bash
curl -X POST http://localhost:8080 -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","polygon":[[98.26,8.63],[98.27,8.63],[98.27,8.64],[98.26,8.64]]}'
```

## 3) Deploy

```bash
cd server
gcloud functions deploy computeBeqi \
  --gen2 \
  --runtime=nodejs20 \
  --region=asia-southeast1 \
  --source=. \
  --entry-point=computeBeqi \
  --trigger-http \
  --allow-unauthenticated \
  --project=beqi-488814 \
  --memory=512Mi \
  --timeout=60s \
  --max-instances=5 \
  --set-env-vars=BEQI_API_SECRET=CHANGE_ME_TO_A_REAL_SECRET,BEQI_ALLOWED_ORIGIN=https://forestry1019.github.io,GEE_CLOUD_PROJECT=beqi-488814
```

- `--allow-unauthenticated` คือจำเป็น เพราะหน้าเว็บ (ไม่มี backend ของตัวเอง) ต้องเรียก endpoint นี้ตรง ๆ
  จาก browser ได้ — ตัวที่กันคนทั่วไปเรียกเล่นคือ `BEQI_API_SECRET` ข้างใน request body แทน
- `BEQI_ALLOWED_ORIGIN` ตั้งเป็นโดเมนจริงที่เว็บจะรัน (เช่น GitHub Pages ของ BEQI3) กัน CORS จากโดเมนอื่น —
  ถ้ายังไม่รู้โดเมนสุดท้าย ตั้งเป็น `*` ไปก่อนแล้วค่อยจำกัดทีหลังได้
- คำสั่งจะพิมพ์ `url:` ของฟังก์ชันออกมาตอนจบ — เอา URL นั้นไปใส่ใน `assets/js/api-config.js` (ดูขั้นตอนที่ 5)

## 4) ให้สิทธิ์ Earth Engine กับ service account ของฟังก์ชัน

Cloud Functions gen2 รันด้วย default compute service account
(`PROJECT_NUMBER-compute@developer.gserviceaccount.com`) เว้นแต่ระบุ `--service-account` เอง

```bash
PROJECT_NUMBER=$(gcloud projects describe beqi-488814 --format='value(projectNumber)')
gcloud projects add-iam-policy-binding beqi-488814 \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/earthengine.viewer"
```

ถ้าเรียกฟังก์ชันแล้วยังเจอ error ทำนอง "not registered" หรือ "no project found" ให้ไปลงทะเบียน
service account ตัวนี้เพิ่มที่ https://code.earthengine.google.com/register (เลือกประเภท "Service account"
แล้วกรอกอีเมลของ service account ด้านบน)

## 5) ผูกกับ frontend

สร้าง (หรือแก้) `assets/js/api-config.js` ใน BEQI3:

```js
const BEQI_API_CONFIG = {
  computeUrl: 'https://asia-southeast1-beqi-488814.cloudfunctions.net/computeBeqi', // URL จากขั้นตอนที่ 3
  secret: 'CHANGE_ME_TO_A_REAL_SECRET' // ต้องตรงกับ BEQI_API_SECRET ที่ deploy ไว้
};
```

`picker.js` จะอ่านค่าจากไฟล์นี้แทนการเรียก `ee.data.*` ตรง ๆ — ไม่ต้องมีปุ่ม "เชื่อมต่อ Google Earth Engine"
ให้ผู้ใช้กดอีกต่อไป

## 6) Deploy aiDraftPatterns (ตัวช่วยร่างคำตอบตัวชี้วัดที่ 4 ด้วย AI — ไม่บังคับ)

ให้สิทธิ์ Vertex AI กับ service account เดียวกับข้อ 4 ก่อน:

```bash
PROJECT_NUMBER=$(gcloud projects describe beqi-488814 --format='value(projectNumber)')
gcloud projects add-iam-policy-binding beqi-488814 \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

แล้ว deploy ฟังก์ชันแยกต่างหาก (โค้ดอยู่ในไฟล์เดียวกับ `computeBeqi`/`submitApplication` คือ `server/index.js`
แค่คนละ entry-point):

```bash
cd server
gcloud functions deploy aiDraftPatterns \
  --gen2 \
  --runtime=nodejs20 \
  --region=asia-southeast1 \
  --source=. \
  --entry-point=aiDraftPatterns \
  --trigger-http \
  --allow-unauthenticated \
  --project=beqi-488814 \
  --memory=512Mi \
  --timeout=60s \
  --max-instances=5 \
  --set-env-vars=BEQI_API_SECRET=CHANGE_ME_TO_A_REAL_SECRET,BEQI_ALLOWED_ORIGIN=https://forestry1019.github.io,VERTEX_PROJECT=beqi-488814,VERTEX_LOCATION=us-central1,VERTEX_MODEL=gemini-2.5-flash
```

เอา URL ที่ได้ไปใส่เป็น `aiDraftUrl` ใน `assets/js/api-config.js` (ทำไว้ให้แล้ว รอแค่แทน URL จริงหลัง deploy)

**หมายเหตุด้านวิธีวิทยา (สำคัญสำหรับบทระเบียบวิธี):** ฟังก์ชันนี้ให้คำตอบเฉพาะ 10 ใน 14 รูปแบบที่ประเมินจาก
ภาพถ่ายได้ (`AI_PATTERNS` ใน `server/index.js`) — 4 รูปแบบที่ต้องยืนยัน ณ สถานที่จริง (Non-Visual Connection,
Connection to Natural Systems, Mystery, Risk/Peril) จะไม่ถูกส่งให้ AI ประเมินเด็ดขาด คำตอบที่ได้เป็นเพียง
"ร่าง" (draft) ที่ผู้ขอรับรองต้องตรวจทาน/แก้ไขเองก่อนส่ง ระบบเก็บทั้งคะแนนร่างจาก AI (`aiScore`) และคะแนน
สุดท้ายที่ยืนยันแล้ว (`score`) แยกกันไว้ใน Firestore ทุกใบสมัคร —ใช้คำนวณความสอดคล้อง (agreement) ระหว่าง
AI กับคำตอบสุดท้ายได้ในภายหลัง เพื่อรายงานความน่าเชื่อถือของเครื่องมือเชิงปริมาณในบทวิเคราะห์ผล

## หมายเหตุเรื่องต้นทุน/โควตา

Earth Engine ไม่คิดเงินสำหรับ non-commercial use ทั่วไป แต่ Cloud Functions/Cloud Build มี free tier
จำกัด — สำหรับผู้ใช้กลุ่มเล็กไม่น่าเกิน free tier แต่ถ้ากังวลเรื่องมีคนเรียกรัว ๆ ให้ปรับ `--max-instances`
ให้ต่ำ (ตั้งไว้ 5 ในคำสั่งตัวอย่าง) และเปลี่ยน `BEQI_API_SECRET` เป็นระยะได้

**`aiDraftPatterns` มีค่าใช้จ่ายจริงต่อการเรียกแต่ละครั้ง** (ต่างจาก Earth Engine) เพราะเรียกโมเดล Gemini
ผ่าน Vertex AI ซึ่งคิดเงินตามจำนวน token รวมรูปภาพที่ส่งเข้าไป — ดูราคาปัจจุบันที่
https://cloud.google.com/vertex-ai/generative-ai/pricing ก่อน deploy ให้ผู้ใช้จำนวนมากเรียกใช้งานจริง
