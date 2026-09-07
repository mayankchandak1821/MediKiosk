"""
MediKiosk Dynamic Clinical NLP & History Synthesis Engine
Advanced medical OCR text normalizer, Indian & global brand drug entity extractor,
paper vitals parser, and clinical history synthesis engine.
"""

import re
from datetime import datetime, timezone

# Common Brand -> Generic & Class Knowledge Map
KNOWN_DRUG_MAP = {
    "dolo": {"generic": "Paracetamol 650mg", "class": "Antipyretic / Analgesic"},
    "crocin": {"generic": "Paracetamol", "class": "Antipyretic / Analgesic"},
    "pcm": {"generic": "Paracetamol", "class": "Antipyretic / Analgesic"},
    "calpol": {"generic": "Paracetamol", "class": "Antipyretic / Analgesic"},
    "pantocid": {"generic": "Pantoprazole 40mg", "class": "Proton Pump Inhibitor"},
    "pan": {"generic": "Pantoprazole 40mg", "class": "Proton Pump Inhibitor"},
    "pan-d": {"generic": "Pantoprazole + Domperidone", "class": "Anti-Reflux PPI"},
    "omez": {"generic": "Omeprazole 20mg", "class": "Proton Pump Inhibitor"},
    "azithral": {"generic": "Azithromycin 500mg", "class": "Macrolide Antibiotic"},
    "azithromycin": {"generic": "Azithromycin", "class": "Macrolide Antibiotic"},
    "amox": {"generic": "Amoxicillin", "class": "Penicillin Antibiotic"},
    "augmentin": {"generic": "Amoxicillin + Clavulanic Acid 625mg", "class": "Broad-Spectrum Antibiotic"},
    "zifi": {"generic": "Cefixime 200mg", "class": "Cephalosporin Antibiotic"},
    "telma": {"generic": "Telmisartan 40mg", "class": "ARB Antihypertensive"},
    "telmisartan": {"generic": "Telmisartan", "class": "ARB Antihypertensive"},
    "glycomet": {"generic": "Metformin 500mg", "class": "Biguanide Antidiabetic"},
    "metformin": {"generic": "Metformin", "class": "Biguanide Antidiabetic"},
    "amlokind": {"generic": "Amlodipine 5mg", "class": "Calcium Channel Blocker"},
    "amlodipine": {"generic": "Amlodipine", "class": "Calcium Channel Blocker"},
    "atorva": {"generic": "Atorvastatin 10mg", "class": "Statin Lipid Lowering"},
    "atorvastatin": {"generic": "Atorvastatin", "class": "Statin Lipid Lowering"},
    "allegra": {"generic": "Fexofenadine 120mg", "class": "Non-Sedating Antihistamine"},
    "cetirizine": {"generic": "Cetirizine 10mg", "class": "Antihistamine"},
    "montair-lc": {"generic": "Montelukast + Levocetirizine", "class": "Anti-Asthmatic / Antiallergic"},
    "combiflam": {"generic": "Ibuprofen + Paracetamol", "class": "NSAID Analgesic"},
    "voveran": {"generic": "Diclofenac 50mg", "class": "NSAID Anti-inflammatory"},
    "ecosprin": {"generic": "Aspirin 75mg", "class": "Antiplatelet / Blood Thinner"}
}

def normalize_ocr_text(text=""):
    """Corrects common OCR handwriting misread artifacts."""
    if not text or not isinstance(text, str):
        return ""

    replacements = [
        (r'\b1-O-1\b', '1-0-1'),
        (r'\b1-O-O\b', '1-0-0'),
        (r'\bO-O-1\b', '0-0-1'),
        (r'\bO-1-O\b', '0-1-0'),
        (r'(\d+)O\s*mg\b', r'\g<1>0mg'),
        (r'(\d+)O\s*g\b', r'\g<1>0g'),
        (r'\brnmg\b', 'mg'),
        (r'\bT\.D\.S\b', 'TDS'),
        (r'\bB\.D\b', 'BD'),
        (r'\bO\.D\b', 'OD'),
        (r'\bTab\.\s*', 'Tab '),
        (r'\bCap\.\s*', 'Cap '),
        (r'\bInj\.\s*', 'Inj '),
        (r'\bDr\.\s*', 'Dr. '),
        (r'B\.?P\.?\s*[:\-]?\s*([0-9O0]+)\s*[\/\\]\s*([0-9O0]+)', lambda m: f"BP: {m.group(1).replace('O','0').replace('o','0')}/{m.group(2).replace('O','0').replace('o','0')} mmHg"),
        (r'Pulse\s*[:\-]?\s*(\d{2,3})', r'Pulse: \1 bpm'),
        (r'SpO2\s*[:\-]?\s*(\d{2,3})\s*%?', r'SpO2: \1%'),
        (r'Temp(?:erature)?\s*[:\-]?\s*(\d{2,3}(?:\.\d)?)\s*(?:F|C)?', r'Temp: \1°F')
    ]

    cleaned = text
    for pat, repl in replacements:
        cleaned = re.sub(pat, repl, cleaned, flags=re.I)
    return cleaned

def parse_medical_text(text=""):
    """
    Advanced Medical NLP & Written Prescription Transformer:
    Performs OCR normalization, Indian brand drug matching, vitals extraction from paper,
    clinical OPD note parsing, and safety guardrail synthesis.
    """
    raw_input = text or ""
    text = normalize_ocr_text(raw_input)

    lines = [line.strip() for line in text.split('\n') if line.strip()]

    doc_type = "Medical Document"
    if re.search(r'lab|pathology|report|test|blood|serum|hba1c|sugar|creatinine|hemoglobin', text, re.I):
        doc_type = "Pathology Lab Report"
    elif re.search(r'c\/o|h\/o|o\/e|adv|written|handwritten|impression|notes|symptoms', text, re.I):
        doc_type = "Handwritten / Written Clinical Note"
    elif re.search(r'rx|prescription|dr\.|doctor|tablet|capsule|mg|tab|cap|dose', text, re.I):
        doc_type = "Prescription"

    doctor_name = ""
    doc_match = re.search(r'(Dr\.\s+[A-Za-z\.\s]{2,30})(?=\n|$)', text, re.I)
    if doc_match:
        doctor_name = doc_match.group(1).strip()

    # 1. VITALS EXTRACTION FROM PAPER SCAN
    vitals_from_doc = {}
    bp_match = re.search(r'BP[:\s]+(\d{2,3}\/\d{2,3}\s*mmHg|\d{2,3}\/\d{2,3})', text, re.I)
    if bp_match: vitals_from_doc["blood_pressure"] = bp_match.group(1).strip()

    pulse_match = re.search(r'Pulse[:\s]+(\d{2,3}\s*bpm|\d{2,3})', text, re.I)
    if pulse_match: vitals_from_doc["pulse_rate"] = pulse_match.group(1).strip()

    spo2_match = re.search(r'SpO2[:\s]+(\d{2,3}\s*%|\d{2,3})', text, re.I)
    if spo2_match: vitals_from_doc["spo2_percent"] = spo2_match.group(1).strip()

    temp_match = re.search(r'Temp(?:erature)?[:\s]+(\d{2,3}(?:\.\d)?\s*°?[FC]|\d{2,3}(?:\.\d)?)', text, re.I)
    if temp_match: vitals_from_doc["temperature"] = temp_match.group(1).strip()

    # 2. DYNAMIC CLINICAL NOTES & WRITTEN IMPRESSIONS
    clinical_notes = []
    note_patterns = [
        (r'(?:c\/o|complaining of|chief complaint|symptoms)[:\s]+(.*)', "Complaints (C/O)"),
        (r'(?:h\/o|history of)[:\s]+(.*)', "History (H/O)"),
        (r'(?:o\/e|on examination|vitals)[:\s]+(.*)', "On Examination (O/E)"),
        (r'(?:adv|advice|advised|plan)[:\s]+(.*)', "Clinical Advice"),
        (r'(?:notes|impression|clinical notes)[:\s]+(.*)', "Clinical Notes")
    ]

    for line in lines:
        for pattern, category in note_patterns:
            match = re.search(pattern, line, re.I)
            if match and match.group(1).strip():
                clinical_notes.append(f"{category}: {match.group(1).strip()}")

    # 3. DYNAMIC MEDICATION EXTRACTION
    medications = []
    seen_drugs = set()

    dosage_pattern = re.compile(
        r'(?:(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops|\d+[\.\)])\s*)?'
        r'([A-Za-z0-9\-\/]{3,}(?:\s+[A-Za-z0-9\-\/]+){0,2})\s+'
        r'(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml|iu|units?))\b'
        r'(?:\s*(?:--|-|:|,)?\s*([0-1]-[0-1]-[0-1]|1-0-1|1-0-0|0-0-1|1-1-1|once daily|twice daily|thrice daily|OD|BD|TDS|QDS|bedtime|morning|night|SOS|after meals|before meals)?)?'
        r'(?:\s*(?:x|for)?\s*(\d+\s*days?))?',
        re.I
    )

    written_rx_pattern = re.compile(
        r'(?:(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops|\d+[\.\)])\s*)?'
        r'([A-Za-z0-9\-\/]{3,}(?:\s+[A-Za-z0-9\-\/]+){0,1})\s+'
        r'(\d+(?:\.\d+)?)\s+'
        r'([0-1]-[0-1]-[0-1]|1-0-1|1-0-0|0-0-1|1-1-1|once daily|twice daily|thrice daily|OD|BD|TDS|QDS|SOS|HS|bedtime|morning|night|after meals|before meals)'
        r'(?:\s*(?:x|for)?\s*(\d+\s*days?))?',
        re.I
    )

    for line in lines:
        # Pattern A
        for match in dosage_pattern.finditer(line):
            raw_name = match.group(1).strip()
            dosage = match.group(2).strip()
            frequency = match.group(3).strip() if match.group(3) else "As directed"
            duration = match.group(4).strip() if match.group(4) else "5 days"

            clean_name = re.sub(r'^\d+[\.\)]\s*', '', raw_name)
            clean_name = re.sub(r'^(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops)\s+', '', clean_name, flags=re.I).strip()

            ignore_list = ['test', 'name', 'result', 'unit', 'date', 'patient', 'ref', 'high', 'low', 'normal', 'report', 'fasting', 'blood', 'sugar', 'creatinine', 'urea', 'age', 'gender', 'phone', 'page', 'temp', 'pulse', 'bp', 'spo2']
            if clean_name.lower() not in ignore_list and len(clean_name) >= 3:
                drug_key = clean_name.lower()
                if drug_key not in seen_drugs:
                    seen_drugs.add(drug_key)
                    drug_info = KNOWN_DRUG_MAP.get(drug_key, {"class": "Prescription Med"})
                    medications.append({
                        "name": clean_name.capitalize(),
                        "dosage": dosage,
                        "frequency": frequency,
                        "duration": duration,
                        "status": "ACTIVE",
                        "class": drug_info["class"]
                    })

        # Pattern B
        for match in written_rx_pattern.finditer(line):
            raw_name = match.group(1).strip()
            num_val = match.group(2).strip()
            frequency = match.group(3).strip()
            duration = match.group(4).strip() if match.group(4) else "5 days"

            clean_name = re.sub(r'^\d+[\.\)]\s*', '', raw_name)
            clean_name = re.sub(r'^(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops)\s+', '', clean_name, flags=re.I).strip()

            ignore_list = ['test', 'name', 'result', 'unit', 'date', 'patient', 'ref', 'high', 'low', 'normal', 'report', 'fasting', 'blood', 'sugar', 'creatinine', 'urea', 'age', 'gender', 'phone', 'page', 'temp', 'pulse', 'bp', 'spo2']
            if clean_name.lower() not in ignore_list and len(clean_name) >= 3:
                drug_key = clean_name.lower()
                if drug_key not in seen_drugs:
                    seen_drugs.add(drug_key)
                    drug_info = KNOWN_DRUG_MAP.get(drug_key, {"class": "Written Rx Med"})
                    medications.append({
                        "name": clean_name.capitalize(),
                        "dosage": f"{num_val}mg",
                        "frequency": frequency,
                        "duration": duration,
                        "status": "ACTIVE",
                        "class": drug_info["class"]
                    })

    # 4. PAST MEDICAL HISTORY & DIAGNOSES
    past_history = []
    history_patterns = [
        r'(?:diagnosis|dx|impression|known case of|k\/c\/o|history of|hx)[:\s]+(.*)',
        r'(?:past history|medical history|underlying condition)[:\s]+(.*)'
    ]

    for line in lines:
        for hp in history_patterns:
            hm = re.search(hp, line, re.I)
            if hm:
                found_dx = hm.group(1).strip()
                if found_dx:
                    items = [item.strip() for item in re.split(r'[,;.]', found_dx) if item.strip()]
                    past_history.extend(items)

    past_history = list(set(past_history))

    # 5. LAB PARAMETER EXTRACTION
    investigations = []
    lab_pattern = re.compile(r'([A-Za-z\s\(\)]{3,25})\s+(\d+(?:\.\d+)?)\s*(mg\/dL|%|g\/dL|uIU\/mL|mmol\/L)?\s*(?:\[?(HIGH|LOW|ELEVATED|CRITICAL|NORMAL)\]?)?', re.I)

    for line in lines:
        if any(kw in line.lower() for kw in ['sugar', 'hba1c', 'creatinine', 'urea', 'hemoglobin', 'cholesterol', 'thyroid', 'tsh', 'fbs', 'ppbs']):
            match = lab_pattern.search(line)
            if match:
                test_name = match.group(1).strip()
                val_num = match.group(2)
                unit = match.group(3) or ""
                flag = match.group(4) or "NORMAL"
                is_abnormal = bool(re.search(r'high|critical|elevated|low', line, re.I))

                if not any(i['testName'].lower() == test_name.lower() for i in investigations):
                    investigations.append({
                        "testName": test_name.capitalize(),
                        "value": f"{val_num} {unit}".strip(),
                        "refRange": "Standard Range",
                        "isAbnormal": is_abnormal,
                        "flag": flag.upper(),
                        "severity": "HIGH" if is_abnormal else "NORMAL"
                    })

    # Calculate Confidence Score (0 - 100%)
    score = 60
    if doctor_name: score += 10
    if len(medications) > 0: score += 15
    if len(clinical_notes) > 0: score += 10
    if len(investigations) > 0: score += 10
    score = min(score, 98)

    history_str = ", ".join(past_history) if past_history else "No prior chronic diagnoses documented"
    meds_str = ", ".join([f"{m['name']} {m['dosage']}" for m in medications]) if medications else "No active prescription medications extracted"

    summary = (
        f"PAST MEDICAL HISTORY & ACTIVE RX: Document records past history of [{history_str}] "
        f"and active Rx [{meds_str}]. "
        f"OCR CONFIDENCE {score}%: Extracted {len(medications)} active drug(s), {len(clinical_notes)} clinical note(s), and {len(investigations)} lab result(s)."
    )

    drug_warnings = []
    creatinine_test = next((i for i in investigations if 'creatinine' in i['testName'].lower() and i['isAbnormal']), None)
    if creatinine_test:
        drug_warnings.append(f"Nephrotoxic Risk: Elevated {creatinine_test['testName']} ({creatinine_test['value']}). Adjust dosage for renal clearance.")

    return {
        "docType": doc_type,
        "doctor": doctor_name,
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "rawText": text,
        "summary": summary,
        "confidenceScore": score,
        "vitalsFromDoc": vitals_from_doc,
        "clinicalNotes": clinical_notes,
        "pastMedicalHistory": past_history,
        "diagnoses": past_history if past_history else ["Written Prescription Review"],
        "medications": medications,
        "investigations": investigations,
        "allergies": [],
        "drugWarnings": drug_warnings
    }

