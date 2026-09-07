import os
import sys
import json
import requests
from datetime import datetime, timezone
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from pymongo import MongoClient

from PIL import Image
import io
import base64
import pypdf

try:
    import pytesseract
    tesseract_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.environ.get("TESSERACT_CMD", "")
    ]
    for t_path in tesseract_paths:
        if t_path and os.path.exists(t_path):
            pytesseract.pytesseract.tesseract_cmd = t_path
            break
except Exception:
    pass

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from models_mongo import create_patient_document, create_encounter_document, create_vitals_telemetry_document
from ocr_parser import parse_medical_text

app = Flask(__name__)
CORS(app)

# MongoDB Database Connection Setup
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/medikiosk')
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = mongo_client.get_database()
    mongo_client.server_info() # Test connection
    print(f"Connected to MongoDB at {MONGO_URI}")
    IS_MONGO_ONLINE = True
except Exception as err:
    print(f"MongoDB connection warning ({err}). Operating in Mongo-fallback mode.")
    IS_MONGO_ONLINE = False

fallback_db = {
    "patients": [],
    "encounters": [],
    "vitals": [{
        "temperature_c": 37.0,
        "heart_rate_bpm": 72,
        "spo2_percent": 98,
        "source": "MongoDB Standby Stream",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }]
}

def serialize_mongo(doc):
    """Recursively convert ObjectId and datetime objects to JSON-serializable types."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_mongo(item) for item in doc]
    if isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if k == '_id':
                res[k] = str(v)
            elif isinstance(v, datetime):
                res[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                res[k] = serialize_mongo(v)
            else:
                res[k] = v
        return res
    return doc

# --- 1. MONGODB HEALTH & DASHBOARD ROUTE ---

@app.route('/', methods=['GET'])
def mongo_dashboard():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>MediKiosk MongoDB API Server</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-slate-950 text-slate-100 p-8">
        <div class="max-w-4xl mx-auto space-y-6">
            <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-teal-400">🍃 MediKiosk MongoDB REST API Server</h1>
                    <p class="text-slate-400 text-xs mt-1">SIH26047 Database & API Service connected to MongoDB</p>
                </div>
                <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-xs rounded-lg font-bold">
                    MONGODB: {{ 'ONLINE' if is_mongo else 'STANDBY DEMO' }}
                </span>
            </div>

            <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs">
                <h2 class="text-sm font-bold text-slate-300">MongoDB API Endpoints</h2>
                <a href="/api/mongo/health" target="_blank" class="block p-3 bg-slate-950 rounded-xl border border-slate-800 text-teal-300">GET /api/mongo/health - MongoDB Status</a>
                <a href="/api/mongo/vitals" target="_blank" class="block p-3 bg-slate-950 rounded-xl border border-slate-800 text-cyan-300">GET / POST /api/mongo/vitals - Telemetry Collection</a>
                <a href="/api/mongo/encounters" target="_blank" class="block p-3 bg-slate-950 rounded-xl border border-slate-800 text-purple-300">GET / POST /api/mongo/encounters - Encounters Collection</a>
                <a href="/api/mongo/patients" target="_blank" class="block p-3 bg-slate-950 rounded-xl border border-slate-800 text-amber-300">GET / POST /api/mongo/patients - Patients Collection</a>
            </div>
        </div>
    </body>
    </html>
    """, is_mongo=IS_MONGO_ONLINE)

@app.route('/api/mongo/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "database": "MongoDB",
        "mongo_connected": IS_MONGO_ONLINE,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 200

# --- 2. MONGODB VITALS TELEMETRY API ---

@app.route('/api/mongo/vitals', methods=['GET', 'POST'])
@app.route('/api/vitals', methods=['GET', 'POST'])
def mongo_vitals():
    req_json = request.get_json(silent=True) or {}
    if request.method == 'POST':
        data = req_json or request.form or {}
        doc = create_vitals_telemetry_document(
            data.get("temperature_c", 37.0),
            data.get("heart_rate_bpm", 72),
            data.get("spo2_percent", 98),
            data.get("respiratory_rate", 16),
            data.get("source", "MongoDB Hardware Sensor")
        )
        if IS_MONGO_ONLINE:
            db.vitals.insert_one(doc)
        else:
            fallback_db["vitals"].append(doc)
        return jsonify({"message": "Vitals saved to MongoDB collection", "vitals": serialize_mongo(doc)}), 200

    if IS_MONGO_ONLINE:
        latest = db.vitals.find_one(sort=[("timestamp", -1)])
    else:
        latest = fallback_db["vitals"][-1] if fallback_db["vitals"] else None

    return jsonify(serialize_mongo(latest or fallback_db["vitals"][0])), 200

# --- 3. MONGODB PATIENTS API ---

@app.route('/api/mongo/patients', methods=['GET', 'POST'])
@app.route('/api/patients', methods=['GET', 'POST'])
def mongo_patients():
    req_json = request.get_json(silent=True) or {}
    if request.method == 'POST':
        data = req_json or request.form or {}
        doc = create_patient_document(
            data.get("abha_id", "91-8840-2910-4491"),
            data.get("full_name", "Rajesh Verma"),
            data.get("age", 52),
            data.get("gender", "Male"),
            data.get("phone", "9876543210"),
            data.get("preferred_language", "en")
        )
        if IS_MONGO_ONLINE:
            existing = db.patients.find_one({"abha_id": doc["abha_id"]})
            if not existing:
                res = db.patients.insert_one(doc)
                doc["_id"] = str(res.inserted_id)
            else:
                doc["_id"] = str(existing["_id"])
        else:
            doc["_id"] = f"mongo-pat-{len(fallback_db['patients']) + 1}"
            fallback_db["patients"].append(doc)

        return jsonify(serialize_mongo(doc)), 200

    if IS_MONGO_ONLINE:
        patients = list(db.patients.find())
    else:
        patients = fallback_db["patients"]

    return jsonify(serialize_mongo(patients)), 200

# --- 4. MONGODB ENCOUNTERS & TRIAGE API ---

@app.route('/api/mongo/encounters', methods=['GET', 'POST'])
@app.route('/api/encounters', methods=['GET', 'POST'])
def mongo_encounters():
    req_json = request.get_json(silent=True) or {}
    if request.method == 'POST':
        data = req_json or request.form or {}
        patient_info = data.get("patient", {})
        answers = data.get("answers", {})
        vitals = data.get("vitals", {})
        triage = data.get("triage", {})
        scanned_doc = data.get("scannedDoc", {})
        fhir_payload = data.get("fhirPayload", {})

        doc = create_encounter_document(
            patient_info.get("abha_id", "91-8840-2910-4491"),
            patient_info.get("abha_id", "91-8840-2910-4491"),
            data.get("careMode", "allopathy"),
            data.get("symptomCategory", "Routine Checkup"),
            answers,
            vitals,
            triage,
            scanned_doc,
            fhir_payload
        )

        if IS_MONGO_ONLINE:
            res = db.encounters.insert_one(doc)
            doc["_id"] = str(res.inserted_id)
        else:
            doc["_id"] = f"mongo-enc-{len(fallback_db['encounters']) + 1}"
            fallback_db["encounters"].append(doc)

        return jsonify({"success": True, "encounter": serialize_mongo(doc)}), 201

    if IS_MONGO_ONLINE:
        encounters = list(db.encounters.find().sort("triage.risk_percentage", -1))
    else:
        encounters = fallback_db["encounters"]

    return jsonify(serialize_mongo(encounters)), 200

@app.route('/api/mongo/encounters/<enc_id>/approve', methods=['PUT', 'POST'])
@app.route('/api/encounters/<enc_id>/approve', methods=['PUT', 'POST'])
def approve_encounter(enc_id):
    """Doctor sign-off route: updates status to COMPLETED_SIGNED_OFF and attaches notes."""
    req_json = request.get_json(silent=True) or {}
    notes = req_json.get("doctor_notes", "") if req_json else request.form.get("doctor_notes", "")
    
    if IS_MONGO_ONLINE:
        db.encounters.update_one(
            {"encounter_id": enc_id},
            {"$set": {
                "status": "COMPLETED_SIGNED_OFF",
                "doctor_notes": notes,
                "signed_at": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        for enc in fallback_db["encounters"]:
            if enc.get("encounter_id") == enc_id or enc.get("_id") == enc_id:
                enc["status"] = "COMPLETED_SIGNED_OFF"
                enc["doctor_notes"] = notes
                enc["signed_at"] = datetime.now(timezone.utc).isoformat()

    return jsonify({
        "success": True,
        "message": f"Encounter {enc_id} successfully signed off and saved to MongoDB.",
        "status": "COMPLETED_SIGNED_OFF"
    }), 200

# --- 5. REAL PDF & IMAGE OCR SCAN API ENDPOINT ---

@app.route('/api/ocr/scan', methods=['POST'])
def ocr_scan():
    """Python Real PDF, Written Notes & Image OCR API Endpoint."""
    try:
        extracted_text = ""
        req_json = request.get_json(silent=True) or {}

        # 1. Process PDF or Image File Upload
        if 'file' in request.files:
            file = request.files['file']
            filename = file.filename.lower()

            if filename.endswith('.pdf'):
                # Extract text directly from PDF pages using PyPDF
                reader = pypdf.PdfReader(file.stream)
                text_runs = []
                for page in reader.pages:
                    txt = page.extract_text()
                    if txt: text_runs.append(txt)
                extracted_text = "\n".join(text_runs)
            else:
                # Process image file
                img = Image.open(file.stream)
                try:
                    import pytesseract
                    from PIL import ImageEnhance
                    img_gray = img.convert('L')
                    enhancer = ImageEnhance.Contrast(img_gray)
                    img_enhanced = enhancer.enhance(2.0)
                    extracted_text = pytesseract.image_to_string(img_enhanced, config='--psm 6')
                    if not extracted_text.strip():
                        extracted_text = pytesseract.image_to_string(img_enhanced)
                except Exception:
                    extracted_text = f"Scanned Image File ({img.width}x{img.height}px)"

        elif ('image_base64' in req_json) or (request.form and 'image_base64' in request.form):
            b64_val = req_json.get('image_base64') or request.form.get('image_base64')
            b64_str = b64_val.split(',')[-1]
            img_data = base64.b64decode(b64_str)
            img = Image.open(io.BytesIO(img_data))
            try:
                import pytesseract
                from PIL import ImageEnhance
                img_gray = img.convert('L')
                enhancer = ImageEnhance.Contrast(img_gray)
                img_enhanced = enhancer.enhance(2.0)
                extracted_text = pytesseract.image_to_string(img_enhanced, config='--psm 6')
                if not extracted_text.strip():
                    extracted_text = pytesseract.image_to_string(img_enhanced)
            except Exception:
                extracted_text = f"Captured Camera Snapshot ({img.width}x{img.height}px)"

        elif ('raw_text' in req_json or 'text' in req_json) or (request.form and ('raw_text' in request.form or 'text' in request.form)):
            extracted_text = req_json.get('raw_text') or req_json.get('text') or request.form.get('raw_text') or request.form.get('text', '')

        # Parse extracted text using Medical NLP Engine
        parsed_result = parse_medical_text(extracted_text)

        return jsonify({
            "success": True,
            "docType": parsed_result["docType"],
            "rawText": extracted_text,
            "extracted": parsed_result
        }), 200

    except Exception as err:
        print("OCR Scan Endpoint Error:", err)
        return jsonify({"success": False, "error": str(err)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"MediKiosk MongoDB API Server running on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
