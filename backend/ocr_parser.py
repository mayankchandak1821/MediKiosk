"""
MediKiosk Dynamic Clinical NLP & History Synthesis Engine (SIH26047)
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

def correct_drug_name(name=""):
    """Repair an OCR misread of a drug name against the known-brand map.

    A camera photo of handwriting gave "Augmestin" for Augmentin. Left alone that is a
    drug nobody dispenses, and the class lookup misses too. difflib against the map is
    enough for single-character damage and cannot invent a name that is not already in
    the map.

    Returns (corrected_name, was_corrected). The caller keeps the flag so the doctor is
    told the software changed a drug name rather than being shown a silent edit —
    correcting a medicine behind a clinician's back is not a safe default.
    """
    import difflib

    key = (name or "").strip().lower()
    if not key or key in KNOWN_DRUG_MAP:
        return name, False
    # 0.82 keeps "Augmestin"->"Augmentin" (0.94) and rejects distinct drugs such as
    # "Amlodipine" vs "Amlokind". Tighten before loosening: a wrong correction on a
    # medicine is worse than no correction.
    hit = difflib.get_close_matches(key, KNOWN_DRUG_MAP.keys(), n=1, cutoff=0.82)
    if not hit or len(key) < 5:
        return name, False
    return hit[0].capitalize(), True


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
        # Confusions observed on an actual phone photo of a handwritten Rx:
        (r'\bhid\b', 'tid'),               # 't' read as 'h'
        (r'\bfab\b', 'tab'),               # 't' read as 'f'
        (r'\(\s*td\s*\)', '(tid)'),        # "(td)" written for thrice daily
        (r'(\d+)\s*mi\b', r'\g<1>ml'),     # 'ml' read as 'mi'
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
    # Was: any mention of test/blood/hba1c. A prescription that merely says "check
    # HbA1c in 3 months" was therefore filed as a lab report. Require markers a lab
    # report actually has, and let an Rx block win when both look plausible.
    has_rx = re.search(r'Rx|Tab|Cap|[0-1]-[0-1]-[0-1]', text, re.I)
    looks_like_lab = re.search(r'pathology|laborator|lab report|reference range|test\s+name', text, re.I)
    if looks_like_lab and not has_rx:
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

    # Advice wraps. "Advice: Steam inhalation twice daily. / Drink warm fluids. Rest."
    # is two lines on paper and two lines out of OCR, and reading only the first threw
    # away half of what the doctor told the patient. Absorb continuation lines until
    # something that starts a new section: another marker, or a numbered drug line.
    _CONTINUES = re.compile(
        r'^(?:\d+[\.\)]|Rx\b|Tab\b|Cap\b|Syr\b|Inj\b|c/o|h/o|o/e|adv|advice|notes|'
        r'impression|diagnosis|dx|medications?)\b', re.I)

    for idx, line in enumerate(lines):
        for pattern, category in note_patterns:
            match = re.search(pattern, line, re.I)
            if match and match.group(1).strip():
                parts = [match.group(1).strip()]
                for nxt in lines[idx + 1:]:
                    if _CONTINUES.match(nxt) or not nxt.strip():
                        break
                    parts.append(nxt.strip())
                    if len(" ".join(parts)) > 300:  # a note, not the whole page
                        break
                clinical_notes.append(f"{category}: {' '.join(parts)}")

    # 3. DYNAMIC MEDICATION EXTRACTION
    medications = []
    seen_drugs = set()

    dosage_pattern = re.compile(
        r'(?:(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops|\d+[\.\)])\s*)?'
        # Trailing ":" so "Syr Benadryl DR: 2 tsp" keeps its name.
        r'([A-Za-z0-9\-\/]{3,}(?:\s+[A-Za-z0-9\-\/]+){0,2})\s*:?\s+'
        # Syrups are dosed in tsp/tbsp/drops, never mg. Without these units
        # "Syr Benadryl DR: 2 tsp" carried no recognisable dose and the drug was
        # dropped from the list entirely — a missed medication, not a cosmetic miss.
        r'(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml|iu|units?|tsp|tbsp|teaspoons?|drops?))\b'
        # A prescriber writes "625mg 1 tab thrice daily". That "1 tab" sat between the
        # dose and the frequency, so the frequency never matched and every drug fell
        # back to "As directed" — losing SOS, the one instruction a patient must not
        # have to guess at.
        r'(?:\s*\d*\s*(?:tab|cap|tsp|tbsp|drops?)s?\.?)?'
        # ...and a parenthetical volume can sit in the same place: "2 tsp (10ml) tid".
        r'(?:\s*\([^)]{0,14}\))?'
        r'(?:\s*(?:--|-|:|,|\()?\s*(?P<freq>[0-1]-[0-1]-[0-1]|1-0-1|1-0-0|0-0-1|1-1-1|once daily|twice daily|thrice daily|four times daily|OD|BD|TDS|TID|QDS|QID|HS|STAT|bedtime|morning|night|SOS|after meals|before meals)\b)?'
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

            ignore_list = ['test', 'name', 'result', 'unit', 'date', 'patient', 'ref', 'high', 'low', 'normal', 'report', 'fasting', 'blood', 'sugar', 'creatinine', 'urea', 'age', 'gender', 'phone', 'page', 'temp', 'pulse', 'bp', 'spo2',
                                # Lab analytes carry a unit ('Hemoglobin 13.5 g/dL')
                                # so they match the dose pattern and were being
                                # listed as prescribed medicines.
                                'hemoglobin', 'hba1c', 'cholesterol', 'triglycerides',
                                'platelet', 'platelets', 'wbc', 'rbc', 'tsh', 't3', 't4',
                                'bilirubin', 'albumin', 'sodium', 'potassium', 'glucose',
                                'ppbs', 'fbs', 'esr', 'crp', 'uric']
            if clean_name.lower() not in ignore_list and len(clean_name) >= 3:
                fixed_name, was_corrected = correct_drug_name(clean_name)
                drug_key = fixed_name.lower()
                if drug_key not in seen_drugs:
                    seen_drugs.add(drug_key)
                    drug_info = KNOWN_DRUG_MAP.get(drug_key, {"class": "Prescription Med"})
                    medications.append({
                        "name": fixed_name.capitalize() if fixed_name.islower() else fixed_name,
                        "dosage": dosage,
                        "frequency": frequency,
                        "duration": duration,
                        "status": "ACTIVE",
                        "class": drug_info["class"],
                        # Surfaced so the doctor can see we changed a drug name, and
                        # what it said on the paper. Never a silent correction.
                        "ocrCorrected": was_corrected,
                        "ocrOriginal": clean_name if was_corrected else None
                    })

        # Pattern B
        for match in written_rx_pattern.finditer(line):
            raw_name = match.group(1).strip()
            num_val = match.group(2).strip()
            frequency = match.group(3).strip()
            duration = match.group(4).strip() if match.group(4) else "5 days"

            clean_name = re.sub(r'^\d+[\.\)]\s*', '', raw_name)
            clean_name = re.sub(r'^(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops)\s+', '', clean_name, flags=re.I).strip()

            ignore_list = ['test', 'name', 'result', 'unit', 'date', 'patient', 'ref', 'high', 'low', 'normal', 'report', 'fasting', 'blood', 'sugar', 'creatinine', 'urea', 'age', 'gender', 'phone', 'page', 'temp', 'pulse', 'bp', 'spo2',
                                # Lab analytes carry a unit ('Hemoglobin 13.5 g/dL')
                                # so they match the dose pattern and were being
                                # listed as prescribed medicines.
                                'hemoglobin', 'hba1c', 'cholesterol', 'triglycerides',
                                'platelet', 'platelets', 'wbc', 'rbc', 'tsh', 't3', 't4',
                                'bilirubin', 'albumin', 'sodium', 'potassium', 'glucose',
                                'ppbs', 'fbs', 'esr', 'crp', 'uric']
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
    # The name class must allow digits: without them "HbA1c" matched only its tail and
    # the test came out named "C". Anchored to a letter so a bare number is not a name.
    lab_pattern = re.compile(r'([A-Za-z][A-Za-z0-9\s\(\)\-\/]{2,24})\s+(\d+(?:\.\d+)?)\s*(mg\/dL|%|g\/dL|uIU\/mL|mmol\/L)?\s*(?:\[?(HIGH|LOW|ELEVATED|CRITICAL|NORMAL)\]?)?', re.I)

    for line in lines:
        if any(kw in line.lower() for kw in ['sugar', 'hba1c', 'creatinine', 'urea', 'hemoglobin', 'cholesterol', 'thyroid', 'tsh', 'fbs', 'ppbs']):
            match = lab_pattern.search(line)
            if match:
                test_name = match.group(1).strip()
                val_num = match.group(2)
                unit = match.group(3) or ""
                # The flag only lands in group 4 when it follows the unit directly. Real
                # reports put the reference range in between ("8.2 %  (4.0-5.6)  HIGH"),
                # so group 4 was empty and every abnormal value defaulted to NORMAL —
                # while is_abnormal below read the same line and said True. The record
                # contradicted itself, and the UI shows an alert badge reading "NORMAL".
                # Read the flag from the whole line, and keep the two in agreement.
                flag = match.group(4)
                if not flag:
                    line_flag = re.search(r'\b(CRITICAL|HIGH|ELEVATED|LOW|NORMAL)\b', line, re.I)
                    flag = line_flag.group(1) if line_flag else "NORMAL"
                is_abnormal = bool(re.search(r'\b(high|critical|elevated|low)\b', line, re.I))
                if is_abnormal and flag.upper() == "NORMAL":
                    flag = "ABNORMAL"  # never show "NORMAL" on a value we flagged

                if not any(i['testName'].lower() == test_name.lower() for i in investigations):
                    investigations.append({
                        # capitalize() would turn "HbA1c" into "Hba1c". Medical test names carry
                        # meaningful case, so only fix the all-lowercase ones.
                        "testName": test_name.capitalize() if test_name.islower() else test_name,
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

