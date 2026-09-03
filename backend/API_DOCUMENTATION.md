# MediKiosk (SIH26047) - REST API Documentation for Teammates

This document provides a complete guide to all backend REST API endpoints available on `http://localhost:5000`. Teammates can import `backend/postman_collection.json` into Postman to test APIs in 1 click.

---

## Base Server URL
```http
http://localhost:5000
```

---

## 1. System Health Check
Check backend server online status and timestamp.

* **Endpoint**: `GET /api/health`
* **Response `200 OK`**:
  ```json
  {
    "service": "MediKiosk Backend Core",
    "status": "online",
    "timestamp": "2026-08-31T17:42:20.898026"
  }
  ```

---

## 2. Ingest Hardware Vitals Stream
Receive real-time vitals telemetry from USB serial sensors (WebSerial/WebHID), local Python bridge, or frontend sliders.

* **Endpoint**: `POST /api/vitals`
* **Request Body**:
  ```json
  {
    "temperature_c": 39.4,
    "heart_rate_bpm": 110,
    "spo2_percent": 87,
    "respiratory_rate": 22,
    "source": "USB Serial Thermometer / Pulse Oximeter"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "message": "Vitals successfully received and cached",
    "vitals": {
      "temperature_c": 39.4,
      "heart_rate_bpm": 110,
      "spo2_percent": 87,
      "respiratory_rate": 22,
      "timestamp": "2026-08-31T17:42:20.000000",
      "source": "USB Serial Thermometer / Pulse Oximeter"
    }
  }
  ```

---

## 3. Fetch Latest Cached Vitals
Fetch the current real-time vitals reading for display on kiosk or doctor dashboard.

* **Endpoint**: `GET /api/vitals/latest`
* **Response `200 OK`**:
  ```json
  {
    "temperature_c": 39.4,
    "heart_rate_bpm": 110,
    "spo2_percent": 87,
    "respiratory_rate": 22,
    "timestamp": "2026-08-31T17:42:20.000000",
    "source": "USB Serial Thermometer"
  }
  ```

---

## 4. Patient ABHA Authentication & Registration
Register a new patient or lookup existing records via ABHA ID.

* **Endpoint**: `POST /api/patients`
* **Request Body**:
  ```json
  {
    "abha_id": "91-8840-2910-4491",
    "full_name": "Rajesh Verma",
    "gender": "Male",
    "phone_number": "9876543210",
    "preferred_language": "hi"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "id": 1,
    "abha_id": "91-8840-2910-4491",
    "full_name": "Rajesh Verma",
    "gender": "Male",
    "phone_number": "9876543210",
    "preferred_language": "hi"
  }
  ```

---

## 5. Medical Document OCR Extraction
Simulate/Execute OCR entity extraction from paper prescriptions or lab reports.

* **Endpoint**: `POST /api/ocr/scan`
* **Request Body**:
  ```json
  {
    "doc_type": "prescription",
    "raw_text": "Metformin 500mg 1-0-1, Telmisartan 40mg 1-0-0"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "success": true,
    "extracted": {
      "docType": "Prescription",
      "date": "2026-08-31",
      "medications": [
        { "name": "Metformin", "dosage": "500mg", "frequency": "Twice daily (1-0-1)", "duration": "30 days", "status": "ACTIVE" },
        { "name": "Telmisartan", "dosage": "40mg", "frequency": "Once daily (1-0-0)", "duration": "30 days", "status": "ACTIVE" }
      ],
      "investigations": [
        { "testName": "HbA1c", "value": "8.8 %", "refRange": "4.0-5.6 %", "isAbnormal": true, "flag": "HIGH" }
      ]
    }
  }
  ```

---

## 6. Submit Clinical Intake Encounter
Submit patient questionnaire, perform emergency red-flag triage evaluation, and generate ABDM HL7 FHIR R4 JSON document bundle.

* **Endpoint**: `POST /api/encounters`
* **Request Body**:
  ```json
  {
    "patient": {
      "abha_id": "91-8840-2910-4491",
      "full_name": "Rajesh Verma",
      "gender": "Male"
    },
    "careMode": "allopathy",
    "symptomCategory": "Chest Pain / Pressure",
    "answers": {
      "site": "chest_left",
      "character": "pressure_squeezing",
      "radiation": "to_arm_jaw",
      "associations": ["shortness_of_breath", "cold_sweats"],
      "severity": 8
    },
    "vitals": {
      "temperature_c": 38.2,
      "heart_rate_bpm": 124,
      "spo2_percent": 88
    }
  }
  ```
* **Response `201 Created`**:
  ```json
  {
    "success": true,
    "encounter_id": 1,
    "triage": {
      "priority": "RED_FLAG_CRITICAL",
      "is_red_flag": true,
      "red_flags": [
        "Critical Hypoxia: SpO2 88% is below 90% threshold.",
        "Cardiovascular Alert: Discomfort radiates to arm, neck or jaw."
      ]
    },
    "fhir_payload": {
      "resourceType": "Bundle",
      "id": "medikiosk-fhir-ENC-1",
      "type": "document"
    }
  }
  ```

---

## 7. Fetch OPD Doctor Queue
Get all queued patients sorted by emergency priority (Red Flags first).

* **Endpoint**: `GET /api/encounters`
* **Response `200 OK`**:
  ```json
  [
    {
      "id": "ENC-1",
      "timestamp": "11:12 PM",
      "patient": { "abha_id": "91-8840-2910-4491", "full_name": "Rajesh Verma", "gender": "Male", "age": 52 },
      "careMode": "allopathy",
      "symptomCategory": "Chest Pain / Pressure",
      "vitals": { "temperature_c": 38.2, "heart_rate_bpm": 124, "spo2_percent": 88 },
      "triage": { "priority": "RED_FLAG_CRITICAL", "isRedFlag": true, "redFlags": ["Critical Hypoxia: SpO2 88%"] },
      "status": "PRIORITY_ALERT"
    }
  ]
  ```

---

## 8. Bhashini Multilingual Speech API Proxy
Proxy speech recognition request to Govt of India Bhashini ULCA API.

* **Endpoint**: `POST /api/voice/bhashini`
* **Request Body**:
  ```json
  {
    "audio_base64": "UklGRi...",
    "language": "hi"
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "success": true,
    "transcript": "मेरे सीने में तेज दर्द हो रहा है"
  }
  ```
