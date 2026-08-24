# 🛡️ Parvona AI

### AI-powered safety and monitoring system for kindergartens

**Parvona AI** — bog‘cha va maktabgacha ta’lim muassasalarida xavfsizlikni oshirish uchun ishlab chiqilayotgan **Computer Vision va Artificial Intelligence asosidagi aqlli kuzatuv tizimi**.

Loyiha real-time kameralar orqali hududdagi odamlarni aniqlash, kuzatish va tanish/notanish shaxslarni aniqlashga yordam beradi. Tizimning asosiy maqsadi — bog‘cha hududiga ruxsatsiz yoki noma’lum shaxs kirgan holatlarda mas’ullarga tezkor xabar berish va xavfsizlik monitoringini avtomatlashtirish.

> 🚀 **Parvona AI** — oddiy CCTV monitoringdan AI-powered proactive safety system tomon.

---

## 🎯 Loyiha muammosi

An’anaviy videokuzatuv tizimlarida kameralar videoni yozib oladi, lekin barcha kameralarni doimiy ravishda inson kuzatib borishi kerak.

Bog‘cha sharoitida esa:

* bir nechta kamera mavjud bo‘lishi mumkin;
* bolalar va kattalar doimiy harakatda bo‘ladi;
* kamera operatori har bir hodisani real vaqt rejimida kuzata olmaydi;
* notanish shaxsni tez aniqlash qiyin;
* muhim hodisalar orasida kerakli videoni topish vaqt talab qiladi.

**Parvona AI** ushbu jarayonning muhim qismini avtomatlashtirishni maqsad qiladi.

---

# 💡 Yechim

Parvona AI Computer Vision pipeline orqali kameradan kelayotgan videoni tahlil qiladi:

```text
IP Camera / Video Stream
        ↓
Frame Extraction
        ↓
Person Detection
        ↓
Object Tracking
        ↓
Face Detection
        ↓
Face Recognition
        ↓
Identity Matching
        ↓
Known / Unknown Decision
        ↓
Event Detection
        ↓
Alert / Dashboard
```

Tizim keyinchalik Person Re-ID, anti-spoofing va behavior analysis kabi imkoniyatlar bilan kengaytirilishi mumkin.

---

# 🧠 AI Pipeline

## 1. Person Detection

Kamera tasviridagi odamlarni aniqlash uchun **YOLO** oilasidagi object detection modellari ishlatiladi.

Asosiy vazifalar:

* odamlarni aniqlash;
* bounding box yaratish;
* confidence score hisoblash;
* real-time detection.

Loyiha uchun YOLO11 oilasidan foydalanish rejalashtirilgan.

---

## 2. Object Tracking

Aniqlangan odamlar ketma-ket kadrlarda kuzatiladi va ularga vaqtinchalik unique tracking ID beriladi.

Bu quyidagilar uchun kerak:

* bir odamni qayta-qayta yangi odam sifatida hisoblamaslik;
* odamning harakatini kuzatish;
* kamera ichidagi trajectory yaratish;
* keyinchalik multi-camera tracking imkoniyatini qo‘shish.

Tracking uchun **BoT-SORT / ByteTrack** kabi algoritmlardan foydalanish mumkin.

---

## 3. Face Detection

Person bounding box ichidan yuz aniqlanadi.

Loyihada:

* SCRFD
* RetinaFace

kabi face detection modellaridan foydalanish mumkin.

---

## 4. Face Recognition

Aniqlangan yuzdan embedding olinadi va oldindan ro‘yxatdan o'tkazilgan shaxslarning embeddinglari bilan solishtiriladi.

Tavsiya etilgan stack:

```text
InsightFace
    ↓
ArcFace
    ↓
Face Embedding
    ↓
Similarity Search
    ↓
Known / Unknown
```

Bu orqali tizim:

* tanish xodim;
* ota-ona;
* ruxsat berilgan shaxs;
* noma’lum shaxs

o‘rtasidagi farqni aniqlashga yordam beradi.

---

## 5. Vector Search

Face embeddinglarni samarali qidirish uchun **FAISS** yoki boshqa vector search texnologiyalaridan foydalanish mumkin.

Kichik datasetlarda oddiy cosine similarity ham yetarli bo‘lishi mumkin.

---

## 6. Person Re-Identification

Face recognition faqat yuz ko‘rinib turganda samarali ishlaydi.

Agar odam kameraga orqa o‘girib tursa, **Person Re-ID** yordamida uning tashqi ko‘rinish xususiyatlarini kuzatish mumkin.

Re-ID quyidagilardan foydalanishi mumkin:

* kiyim;
* tana shakli;
* tashqi appearance;
* aksessuarlar;
* boshqa visual features.

Kelajakda OSNet, TransReID yoki boshqa Re-ID modellarini integratsiya qilish mumkin.

---

# 🎥 Video-to-Frame Dataset Tool

Repository tarkibidagi `video_to_frames_app` — Parvona AI uchun dataset tayyorlashga yordam beruvchi kichik yordamchi dastur.

Uning asosiy vazifasi:

```text
Input Video
     ↓
Frame Extraction
     ↓
Selected Frames
     ↓
Dataset Preparation
     ↓
Annotation
     ↓
YOLO Training Dataset
```

Bu tool yordamida mavjud videolardan kerakli frame'larni ajratib olish va keyingi AI model training jarayoni uchun dataset tayyorlash mumkin.

Shunday qilib:

```text
Parvona AI
│
├── MVP
│   └── Real-time AI safety system
│
└── video_to_frames_app
    └── Dataset preparation tool
```

`video_to_frames_app` — alohida mahsulot emas, balki **Parvona AI AI/data pipeline'ini qo‘llab-quvvatlovchi komponent** hisoblanadi.

---

# 🏗️ Umumiy arxitektura

Kelajakdagi to‘liq tizim quyidagi arxitekturaga ega bo‘lishi mumkin:

```text
                    ┌──────────────────┐
                    │   IP Cameras     │
                    │     RTSP         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Video Processing │
                    │    OpenCV        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  YOLO Detection  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Tracking      │
                    │  BoT-SORT /      │
                    │   ByteTrack      │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
        ┌────────────────┐      ┌────────────────┐
        │ Face Detection │      │   Person       │
        │ SCRFD/RetinaFace│      │    Re-ID       │
        └───────┬────────┘      └───────┬────────┘
                │                       │
                ▼                       │
        ┌────────────────┐              │
        │ ArcFace /      │              │
        │ InsightFace    │              │
        └───────┬────────┘              │
                │                       │
                └───────────┬───────────┘
                            ▼
                   ┌──────────────────┐
                   │ Identity Engine  │
                   │  FAISS / Vector  │
                   │     Search       │
                   └────────┬─────────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │ Event / Alert      │
                  │     System         │
                  └─────────┬──────────┘
                            │
                    ┌───────┴────────┐
                    ▼                ▼
               Dashboard         Telegram /
                                 WebSocket
```

---

# 🛠️ Technology Stack

## Artificial Intelligence

* Python
* YOLO / YOLO11
* InsightFace
* ArcFace
* SCRFD / RetinaFace
* BoT-SORT / ByteTrack
* Person Re-ID
* FAISS
* PyTorch
* ONNX Runtime
* OpenCV

## Backend

* FastAPI
* PostgreSQL
* SQLAlchemy
* Redis
* Celery

## Frontend

* React / Next.js
* WebSocket
* Modern responsive dashboard

## Infrastructure

* Docker
* Git
* GitHub
* Linux / Windows
* GPU acceleration

---

# 🗄️ Database

Production versiyada quyidagi asosiy entitylar ishlatilishi mumkin:

```text
persons
face_embeddings
reid_embeddings
events
alerts
cameras
```

Masalan:

```text
Person
 ├── Face Embeddings
 ├── Re-ID Embeddings
 └── Events

Camera
 └── Events

Event
 └── Alert
```

---

# 🚨 Alert System

Tizim noma’lum yoki shubhali holat aniqlanganda real-time notification yuborishni qo‘llab-quvvatlashi mumkin.

Masalan:

```text
Unknown Person Detected
        ↓
Event Created
        ↓
Confidence Check
        ↓
Alert Generated
        ↓
Dashboard / Telegram
```

Kelajakda quyidagi hodisalarni aniqlash mumkin:

* Unknown person
* Loitering
* Tailgating
* Restricted zone entry
* Unusual activity
* Time-based access violation

---

# 📊 Dataset

AI modelni bog‘cha sharoitiga moslashtirish uchun real muhitdan olingan dataset muhim hisoblanadi.

Dataset pipeline:

```text
Real Video
    ↓
video_to_frames_app
    ↓
Frame Selection
    ↓
Annotation
    ↓
Train / Validation / Test
    ↓
YOLO Training
    ↓
Evaluation
    ↓
Deployment
```

Datasetga quyidagilar kirishi mumkin:

* turli kamera burchaklari;
* turli yorug‘lik sharoitlari;
* turli masofalar;
* turli kiyimlar;
* turli harakatlar;
* occlusion;
* indoor / outdoor holatlar.

> ⚠️ Real bolalar yoki boshqa shaxslarning biometrik ma’lumotlarini yig‘ish va ishlatishda tegishli qonunchilik, rozilik va privacy talablariga rioya qilish zarur.

---

# 🔐 Privacy & Responsible AI

Parvona AI xavfsizlik tizimi bo‘lgani uchun privacy va responsible AI loyihaning muhim qismidir.

Asosiy tamoyillar:

* Data minimization
* Access control
* Encryption
* Secure storage
* Audit logging
* Retention policy
* Explicit consent where required
* Minimal collection of biometric data
* Human verification for critical alerts

AI tizimi tomonidan berilgan qarorlar muhim xavfsizlik qarorlarida imkon qadar inson tomonidan tekshirilishi kerak.

---

# 🚀 Development Roadmap

## Phase 1 — POC

* [x] Basic video processing
* [x] Initial computer vision pipeline
* [x] Dataset preparation tool

## Phase 2 — MVP

* [x] Working MVP
* [ ] Real-time camera integration
* [ ] Person detection
* [ ] Face recognition
* [ ] Tracking
* [ ] Dashboard
* [ ] Real-time alerts

## Phase 3 — Advanced AI

* [ ] Person Re-ID
* [ ] Anti-spoofing
* [ ] Multi-camera tracking
* [ ] Behavior analysis
* [ ] Advanced event detection

## Phase 4 — Production

* [ ] Edge deployment
* [ ] TensorRT / ONNX optimization
* [ ] PostgreSQL production setup
* [ ] Monitoring
* [ ] Security hardening
* [ ] Audit system

---

# 📈 Expected Performance

Aniqlik real kamera, lighting, distance, dataset va threshold sozlamalariga bog‘liq.

Shuning uchun quyidagi qiymatlar **benchmark yoki dastlabki targetlar** sifatida qaraladi, production kafolati sifatida emas:

| Module           | Target |
| ---------------- | -----: |
| Person Detection | 96–98% |
| Face Detection   | 97–99% |
| Face Recognition | 95–98% |
| Person Re-ID     | 85–92% |
| Anti-Spoofing    | 95–97% |
| End-to-End       | 92–96% |

Haqiqiy performance loyihaning validation datasetida o‘lchanadi.

---

# 💻 Local Development

Repository clone qilinadi:

```bash
git clone https://github.com/ifarohiddin/Parvona-AI.git
cd Parvona-AI
```

Kerakli branchga o'tish:

```bash
git checkout main
```

Agar development branch ishlatilsa:

```bash
git checkout feature/video-to-frame
```

---

# 📁 Repository Structure

Repository rivojlanishi bilan taxminiy structure:

```text
Parvona-AI/
│
├── README.md
├── .gitignore
├── LICENSE
│
├── mvp/
│   ├── frontend/
│   ├── backend/
│   └── ...
│
├── video_to_frames_app/
│   ├── README.md
│   ├── requirements.txt
│   └── ...
│
├── docs/
│   ├── architecture/
│   └── ...
│
└── ...
```

> Repositorydagi real papkalar MVP va boshqa komponentlar GitHub'ga qo‘shilishi bilan yangilanadi.

---

# 🏆 Competition

**Parvona AI** — O‘zbekistonda AI asosidagi innovatsion loyihalarni rivojlantirishga qaratilgan **President AI Award 2026** tanlovida ishtirok etish uchun ishlab chiqilmoqda.

Loyiha asosiy maqsadi:

> **AI yordamida maktabgacha ta’lim muassasalarida xavfsizlik monitoringini avtomatlashtirish va noma’lum shaxslarni tezkor aniqlash.**

---

# 👥 Team

Parvona AI jamoasi tomonidan ishlab chiqilmoqda.

Team members va ularning rollari loyiha rivojlanishi bilan ushbu bo‘limga qo‘shiladi.

---

# 🌱 Future Vision

Parvona AI kelajakda faqat noma’lum shaxslarni aniqlash bilan cheklanmasdan, bog‘cha xavfsizligi uchun to‘liq AI platformaga aylantirilishi rejalashtirilgan.

Kelajakdagi imkoniyatlar:

* Multi-camera intelligence
* Person Re-ID
* Advanced behavior analysis
* Mobile application
* Real-time analytics
* Edge AI
* Automated incident reports
* Privacy-preserving AI
* Centralized monitoring platform

---

## ⭐ Project Vision

**Parvona AI — kamerani shunchaki ko‘radigan qurilmadan, vaziyatni tushunadigan aqlli xavfsizlik tizimiga aylantirish.**

> **Detect. Track. Recognize. Protect.**

---

## 📄 License

License information will be added as the project is finalized.
