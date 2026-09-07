"""
MediKiosk MongoDB Collections & Document Schemas
Schema reference definitions for MongoDB BSON records.
"""

from datetime import datetime, timezone

def create_patient_document(abha_id, full_name, age, gender, phone, language="en"):
    """MongoDB Document Schema for Patient Collection."""
    return {
        "abha_id": abha_id,
        "full_name": full_name,
        "age": int(age) if age else 30,
        "gender": gender,
        "phone": phone,
        "preferred_language": language,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

def create_encounter_document(patient_id, abha_id, care_mode, symptom_category, answers, vitals, triage, scanned_doc, fhir_payload):
    """MongoDB Document Schema for Encounters Collection."""
    return {
        "encounter_id": f"ENC-{int(datetime.now(timezone.utc).timestamp())}",
        "patient_id": str(patient_id),
        "abha_id": abha_id,
        "care_mode": care_mode, # "allopathy" | "ayush"
        "symptom_category": symptom_category,
        "answers": answers, # SOCRATES & AYUSH Dashavidha Pariksha
        "vitals": vitals, # { temperature_c, heart_rate_bpm, spo2_percent }
        "triage": {
            "priority": triage.get("priority", "ROUTINE"),
            "is_red_flag": triage.get("isRedFlag", False),
            "risk_percentage": triage.get("riskPercentage", 15),
            "risk_level": triage.get("riskLevel", "LOW_ROUTINE"),
            "red_flags": triage.get("redFlags", [])
        },
        "scanned_doc": scanned_doc, # AI OCR extracted medications & lab flags
        "fhir_payload": fhir_payload, # ABDM HL7 FHIR R4 Bundle JSON
        "status": "PRIORITY_ALERT" if triage.get("isRedFlag") else "QUEUED",
        "doctor_notes": "",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

def create_vitals_telemetry_document(temperature_c, heart_rate_bpm, spo2_percent, respiratory_rate=16, source="Peripheral Sensors"):
    """MongoDB Document Schema for Real-time Hardware Vitals Stream Collection."""
    return {
        "temperature_c": float(temperature_c),
        "heart_rate_bpm": int(heart_rate_bpm),
        "spo2_percent": int(spo2_percent),
        "respiratory_rate": int(respiratory_rate),
        "source": source,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
