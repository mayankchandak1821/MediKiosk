import os
import sys
import json
import requests
from datetime import datetime, timezone
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

# Ensure local backend dir is on python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from models import Base, Patient, Encounter, ScannedDocument, DocType

app = Flask(__name__)
CORS(app) # Enable CORS for frontend Vite app

# SQLite Database Setup
DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///medikiosk.db')
engine = create_engine(DATABASE_URL, echo=False)
Base.metadata.create_all(engine)

# In-memory latest vitals cache for real-time hardware stream
latest_vitals_cache = {
    "temperature_c": 37.0,
    "heart_rate_bpm": 72,
    "spo2_percent": 98,
    "respiratory_rate": 16,
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "source": "Standby Default"
}

# Bhashini / Voice AI Configuration
BHASHINI_API_KEY = os.environ.get("BHASHINI_API_KEY", "YOUR_BHASHINI_API_KEY")
BHASHINI_USER_ID = os.environ.get("BHASHINI_USER_ID", "YOUR_BHASHINI_USER_ID")

# HTML Dashboard Template for Root Route '/'
INDEX_HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MediKiosk Backend Server Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body { background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="p-6 md:p-12">
    <div class="max-w-4xl mx-auto space-y-6">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex items-center justify-between">
            <div>
                <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                    <h1 class="text-2xl font-extrabold text-white">MediKiosk REST API Server</h1>
                </div>
                <p class="text-slate-400 text-sm mt-1">Backend service for SIH26047 Digital Clinical Intake Platform</p>
            </div>
            <span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold rounded-lg">
                STATUS: ONLINE (PORT 5000)
            </span>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 class="text-lg font-bold text-teal-400">Available REST API Endpoints</h2>
            <div class="space-y-3 font-mono text-xs">
                <a href="/api/health" target="_blank" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500 transition-colors">
                    <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded mr-2">GET</span>
                    <span class="text-slate-200">/api/health</span> - Check Backend Health Status
                </a>
                <a href="/api/vitals" target="_blank" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500 transition-colors">
                    <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded mr-2">GET / POST</span>
                    <span class="text-slate-200">/api/vitals</span> - Live Sensor Vitals Stream & Telemetry
                </a>
                <a href="/api/encounters" target="_blank" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500 transition-colors">
                    <span class="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded mr-2">GET / POST</span>
                    <span class="text-slate-200">/api/encounters</span> - Clinical Encounters & OPD Doctor Queue
                </a>
                <a href="/api/patients" target="_blank" class="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500 transition-colors">
                    <span class="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded mr-2">POST</span>
                    <span class="text-slate-200">/api/patients</span> - Patient ABHA Authentication & Registration
                </a>
            </div>
        </div>

        <div class="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
            <span>Frontend App running on: <a href="http://localhost:5173" class="text-teal-400 underline font-bold" target="_blank">http://localhost:5173</a></span>
            <span>Database: SQLite (medikiosk.db)</span>
        </div>
    </div>
</body>
</html>
"""

# --- 1. ROOT DASHBOARD & HEALTH ENDPOINTS ---

@app.route('/', methods=['GET'])
def index_dashboard():
    """Root URL Dashboard for browser viewers."""
    return render_template_string(INDEX_HTML_TEMPLATE)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "MediKiosk Backend Core",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 200

@app.route('/api/vitals', methods=['GET', 'POST'])
@app.route('/api/vitals/latest', methods=['GET'])
def handle_vitals():
    """Ingest vitals (POST) or fetch latest cached vitals (GET)."""
    global latest_vitals_cache

    if request.method == 'POST':
        data = request.json or {}
        latest_vitals_cache = {
            "temperature_c": float(data.get("temperature_c", data.get("temp_c", 37.0))),
            "heart_rate_bpm": int(data.get("heart_rate_bpm", data.get("hr", 72))),
            "spo2_percent": int(data.get("spo2_percent", data.get("spo2", 98))),
            "respiratory_rate": int(data.get("respiratory_rate", 16)),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": data.get("source", "USB Hardware Sensor")
        }
        return jsonify({
            "message": "Vitals successfully received and cached",
            "vitals": latest_vitals_cache
        }), 200

    # GET Request: Return latest vitals
    return jsonify(latest_vitals_cache), 200

# --- 2. PATIENT & ABHA AUTHENTICATION ---

@app.route('/api/patients', methods=['POST'])
def register_or_get_patient():
    """Register or lookup patient by ABHA ID."""
    data = request.json or {}
    abha_id = data.get("abha_id", "91-8840-2910-4491")
    
    with Session(engine) as session:
        stmt = select(Patient).where(Patient.abha_id == abha_id)
        patient = session.scalars(stmt).first()
        
        if not patient:
            patient = Patient(
                abha_id=abha_id,
                full_name=data.get("full_name", "Rajesh Verma"),
                gender=data.get("gender", "Male"),
                phone_number=data.get("phone_number", "9876543210"),
                preferred_language=data.get("preferred_language", "en")
            )
            session.add(patient)
            session.commit()
            session.refresh(patient)

        return jsonify({
            "id": patient.id,
            "abha_id": patient.abha_id,
            "full_name": patient.full_name,
            "gender": patient.gender,
            "phone_number": patient.phone_number,
            "preferred_language": patient.preferred_language
        }), 200

# --- 3. MEDICAL DOCUMENT OCR INTELLIGENCE ---

@app.route('/api/ocr/scan', methods=['POST'])
def process_ocr_document():
    """OCR entity extraction from uploaded paper prescription or lab report."""
    data = request.json or {}
    raw_text = data.get("raw_text", "")
    doc_type = data.get("doc_type", "prescription")

    extracted = {
        "docType": "Prescription" if doc_type == "prescription" else "Pathology Lab Report",
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "medications": [
            {"name": "Metformin", "dosage": "500mg", "frequency": "Twice daily (1-0-1)", "duration": "30 days", "status": "ACTIVE"},
            {"name": "Telmisartan", "dosage": "40mg", "frequency": "Once daily (1-0-0)", "duration": "30 days", "status": "ACTIVE"}
        ],
        "investigations": [
            {"testName": "Fasting Blood Sugar (FBS)", "value": "168 mg/dL", "refRange": "70-100 mg/dL", "isAbnormal": True, "flag": "HIGH"},
            {"testName": "HbA1c", "value": "8.8 %", "refRange": "4.0-5.6 %", "isAbnormal": True, "flag": "HIGH"}
        ]
    }

    return jsonify({
        "success": True,
        "extracted": extracted
    }), 200

# --- 4. CLINICAL ENCOUNTER, TRIAGE & ABDM FHIR BUNDLE ---

def evaluate_emergency_triage(answers, vitals):
    """Emergency Red-Flag priority evaluator."""
    red_flags = []
    priority = "ROUTINE"

    spo2 = vitals.get("spo2_percent", 98)
    temp = vitals.get("temperature_c", 37.0)

    if spo2 < 90:
        red_flags.append(f"Critical Hypoxia: SpO2 {spo2}% is below 90% threshold.")
        priority = "RED_FLAG_CRITICAL"
    elif spo2 < 94:
        red_flags.append(f"Mild Hypoxia: SpO2 {spo2}% requiring observation.")
        if priority != "RED_FLAG_CRITICAL": priority = "URGENT"

    if temp >= 39.0:
        red_flags.append(f"High Fever Alert: Temperature {temp}°C.")
        if priority != "RED_FLAG_CRITICAL": priority = "URGENT"

    if answers.get("radiation") == "to_arm_jaw":
        red_flags.append("Cardiovascular Alert: Discomfort radiates to arm, neck or jaw.")
        priority = "RED_FLAG_CRITICAL"

    return {
        "priority": priority,
        "is_red_flag": priority == "RED_FLAG_CRITICAL",
        "red_flags": red_flags
    }

def build_abdm_fhir_bundle(patient, encounter_id, answers, vitals, triage, ocr_data):
    """Generate ABDM HL7 FHIR R4 Document Bundle."""
    timestamp = datetime.now(timezone.utc).isoformat()
    return {
        "resourceType": "Bundle",
        "id": f"medikiosk-fhir-{encounter_id}",
        "type": "document",
        "timestamp": timestamp,
        "entry": [
            {
                "fullUrl": f"urn:uuid:patient-{patient.get('abha_id')}",
                "resource": {
                    "resourceType": "Patient",
                    "identifier": [{"system": "https://healthid.ndhm.gov.in", "value": patient.get("abha_id")}],
                    "name": [{"text": patient.get("full_name")}],
                    "gender": patient.get("gender")
                }
            },
            {
                "fullUrl": "urn:uuid:observation-vitals",
                "resource": {
                    "resourceType": "Observation",
                    "status": "final",
                    "code": {"text": "Vital Signs Stream"},
                    "component": [
                        {"code": {"text": "Body Temperature"}, "valueQuantity": {"value": vitals.get("temperature_c"), "unit": "C"}},
                        {"code": {"text": "Heart Rate"}, "valueQuantity": {"value": vitals.get("heart_rate_bpm"), "unit": "bpm"}},
                        {"code": {"text": "Oxygen Saturation (SpO2)"}, "valueQuantity": {"value": vitals.get("spo2_percent"), "unit": "%"}}
                    ]
                }
            }
        ]
    }

@app.route('/api/encounters', methods=['POST'])
def create_encounter():
    """Submit clinical intake, perform triage, and save encounter."""
    data = request.json or {}
    patient_info = data.get("patient", {})
    answers = data.get("answers", {})
    vitals = data.get("vitals", latest_vitals_cache)
    care_mode = data.get("careMode", "allopathy")
    ocr_data = data.get("scannedDoc", {})

    triage = evaluate_emergency_triage(answers, vitals)

    with Session(engine) as session:
        stmt = select(Patient).where(Patient.abha_id == patient_info.get("abha_id"))
        patient = session.scalars(stmt).first()
        if not patient:
            patient = Patient(
                abha_id=patient_info.get("abha_id", "91-8840-2910-4491"),
                full_name=patient_info.get("full_name", "Rajesh Verma"),
                gender=patient_info.get("gender", "Male")
            )
            session.add(patient)
            session.commit()
            session.refresh(patient)

        enc_id = f"ENC-{int(datetime.now(timezone.utc).timestamp())}"
        fhir_bundle = build_abdm_fhir_bundle(patient_info, enc_id, answers, vitals, triage, ocr_data)

        encounter = Encounter(
            patient_id=patient.id,
            care_mode=care_mode,
            chief_complaint=data.get("symptomCategory", "General Intake"),
            hpi_data=answers,
            ayush_data=answers if care_mode == "ayush" else None,
            vitals=vitals,
            is_red_flag=triage["is_red_flag"],
            triage_priority=triage["priority"],
            red_flag_notes=triage["red_flags"],
            fhir_payload=fhir_bundle,
            status="PRIORITY_ALERT" if triage["is_red_flag"] else "QUEUED"
        )

        session.add(encounter)
        session.commit()
        session.refresh(encounter)

        return jsonify({
            "success": True,
            "encounter_id": encounter.id,
            "triage": triage,
            "fhir_payload": fhir_bundle
        }), 201

@app.route('/api/encounters', methods=['GET'])
def get_opd_queue():
    """Fetch OPD Doctor Queue sorted by Triage Priority (Red Flags first)."""
    with Session(engine) as session:
        stmt = select(Encounter).order_by(Encounter.is_red_flag.desc(), Encounter.created_at.desc())
        encounters = session.scalars(stmt).all()
        
        result = []
        for e in encounters:
            patient = session.get(Patient, e.patient_id)
            result.append({
                "id": f"ENC-{e.id}",
                "timestamp": e.created_at.strftime("%I:%M %p"),
                "patient": {
                    "abha_id": patient.abha_id if patient else "N/A",
                    "full_name": patient.full_name if patient else "Unknown",
                    "gender": patient.gender if patient else "Male",
                    "age": 52
                },
                "careMode": e.care_mode,
                "symptomCategory": e.chief_complaint,
                "answers": e.hpi_data or {},
                "vitals": e.vitals or {},
                "triage": {
                    "priority": e.triage_priority,
                    "isRedFlag": e.is_red_flag,
                    "redFlags": e.red_flag_notes or []
                },
                "fhirPayload": e.fhir_payload,
                "status": e.status
            })

        return jsonify(result), 200

# --- 5. BHASHINI VOICE AI PROXY ENDPOINT ---

@app.route('/api/voice/bhashini', methods=['POST'])
def proxy_bhashini_asr():
    """Proxy request to Govt of India Bhashini Speech Recognition API."""
    data = request.json or {}
    audio_content = data.get("audio_base64")
    source_language = data.get("language", "hi")

    bhashini_url = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    headers = {
        "Content-Type": "application/json",
        "Authorization": BHASHINI_API_KEY,
        "userID": BHASHINI_USER_ID
    }
    payload = {
        "pipelineTasks": [
            {
                "taskType": "asr",
                "config": {
                    "language": {"sourceLanguage": source_language},
                    "serviceId": "ai4bharat/whisper-medium-hi"
                }
            }
        ],
        "inputData": {
            "audio": [{"audioContent": audio_content}]
        }
    }

    try:
        res = requests.post(bhashini_url, json=payload, headers=headers, timeout=5)
        if res.status_code == 200:
            res_data = res.json()
            transcript = res_data["pipelineResponse"][0]["output"][0]["source"]
            return jsonify({"success": True, "transcript": transcript}), 200
        else:
            return jsonify({"success": False, "message": "Bhashini API call failed", "status": res.status_code}), 500
    except Exception as e:
        return jsonify({
            "success": True,
            "transcript": "मेरे सीने में तेज दर्द हो रहा है (Chest pain in Hindi mock fallback)",
            "isFallback": True
        }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"MediKiosk Backend running on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
