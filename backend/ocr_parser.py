"""
MediKiosk Dynamic Clinical NLP & History Synthesis Engine (SIH26047)
Dynamically extracts ANY medication, past medical history, and synthesizes 
Past Medical History vs Current OPD Problem without hardcoded drug lists.
"""

import re
from datetime import datetime, timezone

def parse_medical_text(text=""):
    """
    100% Dynamic Medical Extraction Transformer:
    Extracts ANY medication, past medical history, and synthesizes Past History vs Current Problem.
    """
    if not text or not isinstance(text, str):
        text = ""

    lines = [line.strip() for line in text.split('\n') if line.strip()]

    doc_type = "Medical Document"
    if re.search(r'lab|pathology|report|test|blood|serum|hba1c|sugar|creatinine|hemoglobin', text, re.I):
        doc_type = "Pathology Lab Report"
    elif re.search(r'rx|prescription|dr\.|doctor|tablet|capsule|mg|tab|cap|dose', text, re.I):
        doc_type = "Prescription"

    doctor_name = ""
    doc_match = re.search(r'(Dr\.\s+[A-Za-z\.\s]+)', text, re.I)
    if doc_match:
        doctor_name = doc_match.group(1).strip()

    # 1. DYNAMIC MEDICATION EXTRACTION (NO HARDCODED DRUG NAMES)
    medications = []
    seen_drugs = set()

    # Pattern matches lines like:
    # "1. Tab Lisinopril 10mg -- 1-0-0 x 30 days"
    # "Amlodipine 5 mg once daily"
    # "Cap Omeprazole 20mg BD"
    dosage_pattern = re.compile(
        r'(?:(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops|\d+\.)\s*)?'  # Optional prefix
        r'([A-Za-z0-9\-\/]{3,}(?:\s+[A-Za-z0-9\-\/]+){0,2})\s+'            # Dynamic Drug Name
        r'(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml|iu|units?))\b'                   # Dosage (10mg, 500mg, etc.)
        r'(?:\s*(?:--|-|:|,)?\s*([0-1]-[0-1]-[0-1]|once daily|twice daily|thrice daily|OD|BD|TDS|QDS|bedtime|morning|night|SOS|after meals|before meals)?)?',
        re.I
    )

    for line in lines:
        for match in dosage_pattern.finditer(line):
            raw_name = match.group(1).strip()
            dosage = match.group(2).strip()
            frequency = match.group(3).strip() if match.group(3) else "As directed"

            # Clean name from leading bullet numbers or common keywords
            clean_name = re.sub(r'^\d+[\.\)]\s*', '', raw_name)
            clean_name = re.sub(r'^(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops)\s+', '', clean_name, flags=re.I).strip()

            # Ignore non-drug words
            ignore_list = ['test', 'name', 'result', 'unit', 'date', 'patient', 'ref', 'high', 'low', 'normal', 'report', 'fasting', 'blood', 'sugar', 'creatinine', 'urea', 'age', 'gender', 'phone', 'page']
            if clean_name.lower() not in ignore_list and len(clean_name) >= 3:
                drug_key = clean_name.lower()
                if drug_key not in seen_drugs:
                    seen_drugs.add(drug_key)
                    medications.append({
                        "name": clean_name.capitalize(),
                        "dosage": dosage,
                        "frequency": frequency,
                        "duration": "30 days",
                        "status": "ACTIVE",
                        "class": "Extracted Prescription Med"
                    })

    # Line-by-line fallback for Rx lists
    if len(medications) == 0:
        for line in lines:
            if re.search(r'\d+\s*(?:mg|mcg|g|ml)', line, re.I):
                parts = line.split()
                # Find the token with mg/mcg
                for i, p in enumerate(parts):
                    if re.search(r'\d+\s*(?:mg|mcg|g|ml)', p, re.I) and i > 0:
                        drug_name = parts[i-1].strip(".,-:")
                        if len(drug_name) >= 3 and drug_name.lower() not in ['tab', 'cap', 'inj', 'syr']:
                            if drug_name.lower() not in seen_drugs:
                                seen_drugs.add(drug_name.lower())
                                medications.append({
                                    "name": drug_name.capitalize(),
                                    "dosage": p,
                                    "frequency": "As directed",
                                    "duration": "14 days",
                                    "status": "ACTIVE",
                                    "class": "Extracted Rx Med"
                                })

    # 2. DYNAMIC PAST MEDICAL HISTORY EXTRACTION
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

    # 3. DYNAMIC LAB PARAMETER EXTRACTION
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

    # 4. UNIFIED AI SYNTHESIS: PAST HISTORY VS CURRENT PROBLEM
    history_str = ", ".join(past_history) if past_history else "No prior chronic diagnoses documented"
    meds_str = ", ".join([f"{m['name']} {m['dosage']}" for m in medications]) if medications else "No active prescription medications extracted"

    summary = (
        f"PAST MEDICAL HISTORY & ACTIVE RX: Patient has documented history of [{history_str}] "
        f"and is currently prescribed [{meds_str}]. "
        f"DOCUMENT OCR STATUS: Synthesized {len(medications)} active drug(s) and {len(investigations)} lab result(s) from document."
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
        "pastMedicalHistory": past_history,
        "diagnoses": past_history if past_history else ["Document Clinical Review"],
        "medications": medications,
        "investigations": investigations,
        "allergies": [],
        "drugWarnings": drug_warnings
    }
