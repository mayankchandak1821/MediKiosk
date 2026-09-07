# MediKiosk - Tech Stack & Technical Roadmap

**Project Title**: MediKiosk - AI-Powered Digital Clinical Intake & Vitals Platform with Multimodal Voice, Touch, Document OCR, and ABDM FHIR Integration  
**Initiative**: Ministry of Ayush / AIIA Digital Health Platform

---

## 🛠️ Complete Tech Stack (Currently Implemented)

### 1. Frontend Architecture
- **Core Framework**: **React 18** + **Vite 8** (Ultra-fast build & HMR development tool)
- **Design System & Styling**: **TailwindCSS** (Custom dark-mode glassmorphism theme, curated color tokens, HSL gradients)
- **Typography**: **Plus Jakarta Sans** (UI body typography) & **JetBrains Mono** (Vitals telemetry & FHIR JSON)
- **Iconography**: **Lucide React** (Medical & UI icons)

### 2. Hardware Abstraction Layer (HAL)
- **Native Browser WebSerial API**: Direct USB/Serial COM port protocol (9600 baud rate) to communicate with physical microcontrollers (Arduino, ESP32, USB Infrared Thermometers).
- **Native Browser WebHID API**: USB Human Interface Device protocol for plug-and-play medical peripherals.
- **REST Telemetry Poller**: Background hardware synchronization with local Python/Node sensor drivers (`http://localhost:5000/api/vitals`).
- **Reactive Subscription Architecture**: Event-emitter pattern (`hardwareAdapter.js`) for pushing live vitals telemetry (`temperature_c`, `heart_rate_bpm`, `spo2_percent`) directly to UI components.

### 3. Multimodal Voice & Vision AI
- **Multilingual Speech AI**: **Bhashini Speech AI** proxy & native **Web Speech API** (`window.SpeechRecognition` & `window.speechSynthesis`) for hands-free intake in Hindi and English.
- **Real-Time Camera Scanner**: **HTML5 Camera Viewfinder** (`getUserMedia` + `<canvas>`) for live paper prescription & lab report snapshotting.
- **Clinical Extraction Transformer (`ocrEngine.js`)**: NLP & Regular Expression transformation engine extracting Diagnoses, Rx Medications (Dosage, Frequency), Pathology Lab Ranges (`HIGH`, `CRITICAL`), and Drug Safety Warning guardrails.

### 4. Clinical Intelligence & Triage Engines
- **Allopathy SOCRATES Framework**: History of Present Illness (Site, Onset, Character, Radiation, Associations, Time, Exacerbating factors, Severity 1-10).
- **AYUSH Dashavidha Pariksha**: Ayurvedic clinical intake assessing Prakriti (Vata/Pitta/Kapha), Agni (Digestive fire), Koshtha, and Ahara-Vihara.
- **Emergency Priority Triage Engine**: Automated Red-Flag evaluator for critical vitals (SpO2 < 90%, Temp ≥ 39°C, Ischemic Pain Radiation to arm/jaw, severe dyspnea).
- **ABDM HL7 FHIR R4 Generator**: Converts encounters into standard HL7 FHIR R4 Document JSON Bundles linked with ABHA Health IDs.

### 5. Backend Server & Database
- **Backend Server Framework**: **Python 3.14 Flask** with CORS enabled (`backend/app.py`).
- **ORM & Database**: **SQLAlchemy 2.0** with SQLite/PostgreSQL storage for `Patient`, `Encounter`, and `ScannedDocument` models.
- **Hardware Serial Bridge**: **Python `pyserial`** script (`backend/hardware_bridge.py`) for reading USB COM ports.

---

## 🔮 Future Enhancements & Hackathon Pitch Roadmap

### Phase 1: Physical Hardware & Sensor Suite (Next 2 Weeks)
1. **ESP32 Microcontroller Integration**:
   - Flash ESP32 firmware connected to **MAX30102** (Pulse Oximeter & Heart Rate) and **MLX90614** (Contactless IR Body Temperature) sensors.
   - Output CSV strings over WebSerial USB or Bluetooth Low Energy (BLE).
2. **Nadi Pariksha Sensor (AYUSH Specialization)**:
   - Attach piezoelectric pressure sensors to measure radial arterial pulse waveforms for AYUSH Prakriti classification.

### Phase 2: Advanced AI & Local Edge Inference
1. **TrOCR / PaddleOCR Fine-Tuning**:
   - Fine-tune Vision Transformer models specifically on handwritten Indian doctor prescription scripts to improve recognition accuracy.
2. **Offline Medical LLM (Ollama / ONNX Runtime)**:
   - Deploy **BioMistral 7B** or **Llama 3.2 Medical 3B** locally on kiosk hardware to enable 100% offline clinical intake in rural Primary Health Centers (PHCs) without internet access.

### Phase 3: ABDM National Health Stack Integration
1. **NHA ABDM Sandbox Gateway Certification**:
   - Achieve **M1, M2, and M3 ABDM Milestone Certifications**:
     - M1: ABHA Number Creation & Authentication.
     - M2: Health Information Provider (HIP) - Linking EMR encounters.
     - M3: Health Information User (HIU) & Consent Manager (CM).

---

## 📁 Ready-to-Share Files for Your Teammates

- **Backend API Code**: [`backend/app.py`](file:///c:/Users/mayankpc/Desktop/Hackathon/backend/app.py)
- **Database Schema**: [`backend/models.py`](file:///c:/Users/mayankpc/Desktop/Hackathon/backend/models.py)
- **API Documentation**: [`backend/API_DOCUMENTATION.md`](file:///c:/Users/mayankpc/Desktop/Hackathon/backend/API_DOCUMENTATION.md)
- **Postman Collection**: [`backend/postman_collection.json`](file:///c:/Users/mayankpc/Desktop/Hackathon/backend/postman_collection.json)
