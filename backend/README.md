# MediKiosk Backend API & Hardware Service

Production-ready Python Flask backend for **MediKiosk** digital clinical intake platform.

## Features
- **Flask REST API**: Endpoints for Patient Registration, Vitals Telemetry, OCR Entity Extraction, Emergency Triage, and ABDM FHIR R4 document generation.
- **SQLAlchemy 2.0 Database**: SQLite/PostgreSQL models for Patient, Encounter, and ScannedDocument with JSON column support for SOCRATES & AYUSH Dashavidha Pariksha summaries.
- **Hardware Bridge (`hardware_bridge.py`)**: Reads USB Serial / COM port sensors (thermometers, pulse oximeters) using `pyserial` and POSTs live vitals to `/api/vitals`.
- **Bhashini Voice AI Proxy**: Integrates with Government of India Bhashini ULCA API for multilingual Indian speech recognition.

## Quick Start

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run Flask API Server**:
   ```bash
   python app.py
   ```
   The backend will start at `http://localhost:5000`.

3. **Run Hardware Serial Listener (Optional)**:
   ```bash
   python hardware_bridge.py
   ```
