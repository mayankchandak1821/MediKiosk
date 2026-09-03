/**
 * MediKiosk AI Clinical Entity & OCR Intelligence Service
 * Performs 100% Dynamic Medication Extraction (NO hardcoded drug lists) and
 * synthesizes Past Medical History vs Current Chief Complaint.
 */
import { createWorker } from 'tesseract.js';

export const SAMPLE_OCR_TEMPLATES = [
  {
    id: 'rx_diabetes_hypertension',
    name: 'Prescription A (Diabetes & Hypertension)',
    type: 'PRESCRIPTION',
    rawText: `Dr. R. K. Sharma, MD (Internal Med) - Reg No: 48291
Patient: Rajesh Verma, 52M | Date: 12/05/2026
Diagnosis: Type 2 Diabetes Mellitus, Essential Hypertension

Rx:
1. Tab Metformin 500mg -- 1 tab twice daily (after meals) x 30 days
2. Tab Telmisartan 40mg -- 1 tab once daily in morning x 30 days
3. Tab Atorvastatin 10mg -- 1 tab at bedtime x 30 days

Advice: Low salt diet, regular morning walk 30 mins, check HbA1c in 3 months.`,
    extracted: {
      docType: 'Prescription',
      doctor: 'Dr. R. K. Sharma, MD',
      date: '2026-05-12',
      summary: 'Patient on dual antihypertensive & antidiabetic therapy. Known Type 2 Diabetes & Hypertension.',
      diagnoses: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      pastMedicalHistory: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily (1-0-1)', duration: '30 days', status: 'ACTIVE', class: 'Antidiabetic' },
        { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily (1-0-0)', duration: '30 days', status: 'ACTIVE', class: 'ARB Antihypertensive' },
        { name: 'Atorvastatin', dosage: '10mg', frequency: 'Bedtime (0-0-1)', duration: '30 days', status: 'ACTIVE', class: 'Statin Lipid Lowering' }
      ],
      investigations: [],
      allergies: ['Penicillin (Mild Rash)'],
      drugWarnings: []
    }
  },
  {
    id: 'lab_metabolic_panel',
    name: 'Lab Report B (Metabolic & Kidney Panel)',
    type: 'LAB_REPORT',
    rawText: `METROPOLIS PATHOLOGY LABS
Patient: Rajesh Verma | Ref by: Dr. Sharma | Date: 10/05/2026

TEST NAME                       RESULT       UNIT       REFERENCE RANGE
Fasting Blood Sugar (FBS)      168          mg/dL      70 - 100       [HIGH]
Post Prandial Blood Sugar      240          mg/dL      < 140          [CRITICAL HIGH]
HbA1c (Glycated Hemoglobin)     8.8          %          4.0 - 5.6      [HIGH]
Serum Creatinine                1.4          mg/dL      0.7 - 1.2      [ELEVATED]
Blood Urea                      42           mg/dL      15 - 40        [MILD HIGH]
Hemoglobin (Hb)                 14.2         g/dL       13.0 - 17.0    [NORMAL]`,
    extracted: {
      docType: 'Pathology Lab Report',
      facility: 'Metropolis Pathology Labs',
      date: '2026-05-10',
      summary: 'Poor glycemic control (HbA1c 8.8%) with early signs of mild renal impairment (Creatinine 1.4 mg/dL).',
      diagnoses: ['Uncontrolled Hyperglycemia', 'Mild Renal Impairment'],
      pastMedicalHistory: ['Uncontrolled Hyperglycemia', 'Mild Renal Impairment'],
      medications: [],
      investigations: [
        { testName: 'Fasting Blood Sugar (FBS)', value: '168 mg/dL', refRange: '70 - 100 mg/dL', isAbnormal: true, flag: 'HIGH', severity: 'HIGH' },
        { testName: 'Post Prandial Blood Sugar (PPBS)', value: '240 mg/dL', refRange: '< 140 mg/dL', isAbnormal: true, flag: 'CRITICAL HIGH', severity: 'CRITICAL' },
        { testName: 'HbA1c (Glycated Hb)', value: '8.8 %', refRange: '4.0 - 5.6 %', isAbnormal: true, flag: 'HIGH', severity: 'HIGH' },
        { testName: 'Serum Creatinine', value: '1.4 mg/dL', refRange: '0.7 - 1.2 mg/dL', isAbnormal: true, flag: 'ELEVATED', severity: 'MODERATE' }
      ],
      allergies: [],
      drugWarnings: ['NSAIDs (Ibuprofen/Naproxen) should be used with caution due to elevated Serum Creatinine (1.4 mg/dL).']
    }
  }
];

class OCREngine {
  /**
   * Safe Tesseract.js Image OCR text recognition
   */
  async recognizeTextFromImage(imageFileOrUrl, onProgress = null) {
    if (!imageFileOrUrl) return '';

    try {
      // Ensure image source is an image Data URL string or HTMLImageElement
      let targetSource = imageFileOrUrl;
      if (imageFileOrUrl instanceof File || imageFileOrUrl instanceof Blob) {
        if (!imageFileOrUrl.type.startsWith('image/')) {
          // Non-image files like PDF are handled by backend PDF parser
          return '';
        }
        targetSource = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(imageFileOrUrl);
        });
      }

      if (!targetSource || typeof targetSource !== 'string' || !targetSource.startsWith('data:image')) {
        return '';
      }

      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text' && onProgress && typeof onProgress === 'function') {
            onProgress(Math.round(m.progress * 100));
          }
        }
      });
      const ret = await worker.recognize(targetSource);
      await worker.terminate();
      return ret.data.text || '';
    } catch (err) {
      console.warn('Tesseract OCR Image Read Exception Handled:', err);
      return '';
    }
  }

  /**
   * 100% Dynamic Medical Extraction Transformer
   */
  transformRawTextToEntities(text = '') {
    if (!text || typeof text !== 'string') {
      text = '';
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const extracted = {
      docType: 'Medical Document',
      doctor: '',
      facility: '',
      date: new Date().toISOString().split('T')[0],
      rawText: text,
      summary: '',
      pastMedicalHistory: [],
      diagnoses: [],
      medications: [],
      investigations: [],
      allergies: [],
      drugWarnings: []
    };

    if (/lab|pathology|report|test|blood|serum|hba1c|sugar|creatinine/i.test(text)) {
      extracted.docType = 'Pathology Lab Report';
    } else if (/rx|prescription|dr\.|doctor|tablet|capsule|mg|tab|cap/i.test(text)) {
      extracted.docType = 'Prescription';
    }

    const docMatch = text.match(/(Dr\.\s+[A-Za-z\.\s]+)/i);
    if (docMatch) extracted.doctor = docMatch[1].trim();

    // 1. DYNAMIC MEDICATION PATTERN MATCHING (NO HARDCODED DRUGS)
    const seen = new Set();
    const dynamicMedRegex = /(?:(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops|\d+\.)\s*)?([A-Za-z0-9\-\/]{3,}(?:\s+[A-Za-z0-9\-\/]+){0,2})\s+(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml|iu|units?))\b(?:\s*(?:--|-|:|,)?\s*([0-1]-[0-1]-[0-1]|once daily|twice daily|thrice daily|OD|BD|TDS|QDS|bedtime|morning|night|SOS|after meals|before meals)?)?/gi;

    let match;
    while ((match = dynamicMedRegex.exec(text)) !== null) {
      let drugName = match[1].trim();
      drugName = drugName.replace(/^\d+[\.\)]\s*/, '');
      drugName = drugName.replace(/^(?:Tab|Cap|Inj|Syr|Tablet|Capsule|Ointment|Drops)\s+/i, '').trim();

      const ignore = ['test', 'name', 'result', 'unit', 'date', 'patient', 'ref', 'high', 'low', 'normal', 'report', 'fasting', 'blood', 'sugar', 'creatinine', 'urea', 'age', 'gender', 'phone'];
      if (!ignore.includes(drugName.toLowerCase()) && drugName.length >= 3) {
        const drugKey = drugName.toLowerCase();
        if (!seen.has(drugKey)) {
          seen.add(drugKey);
          extracted.medications.push({
            name: drugName.charAt(0).toUpperCase() + drugName.slice(1),
            dosage: match[2] || 'Standard Dose',
            frequency: match[3] || 'As directed',
            duration: '30 days',
            status: 'ACTIVE',
            class: 'Extracted Rx Medication'
          });
        }
      }
    }

    // 2. DYNAMIC PAST MEDICAL HISTORY EXTRACTION
    const historyPatterns = [
      /(?:diagnosis|dx|impression|known case of|k\/c\/o|history of|hx)[:\s]+(.*)/i,
      /(?:past history|medical history|underlying condition)[:\s]+(.*)/i
    ];

    lines.forEach(line => {
      historyPatterns.forEach(hp => {
        const hm = line.match(hp);
        if (hm && hm[1]) {
          const items = hm[1].split(/[,;.]/).map(i => i.trim()).filter(Boolean);
          extracted.pastMedicalHistory.push(...items);
        }
      });
    });

    extracted.pastMedicalHistory = Array.from(new Set(extracted.pastMedicalHistory));
    extracted.diagnoses = extracted.pastMedicalHistory.length > 0 ? extracted.pastMedicalHistory : ['Document Clinical Review'];

    // 3. PATHOLOGY LAB PARAMETERS
    const labPattern = /([A-Za-z\s\(\)]{3,25})\s+(\d+(?:\.\d+)?)\s*(mg\/dL|%|g\/dL|uIU\/mL|mmol\/L)?\s*(?:\[?(HIGH|LOW|ELEVATED|CRITICAL|NORMAL)\]?)?/i;
    lines.forEach(line => {
      if (/sugar|hba1c|creatinine|urea|hemoglobin|cholesterol|thyroid|tsh|fbs|ppbs/i.test(line)) {
        const lm = line.match(labPattern);
        if (lm) {
          const testName = lm[1].trim();
          const valNum = lm[2];
          const unit = lm[3] || '';
          const flag = lm[4] || 'NORMAL';
          const isAbnormal = /high|critical|elevated|low/i.test(line);

          if (!extracted.investigations.some(i => i.testName.toLowerCase() === testName.toLowerCase())) {
            extracted.investigations.push({
              testName: testName.charAt(0).toUpperCase() + testName.slice(1),
              value: `${valNum} ${unit}`.trim(),
              refRange: 'Standard Range',
              isAbnormal: isAbnormal,
              flag: flag.toUpperCase(),
              severity: isAbnormal ? 'HIGH' : 'NORMAL'
            });
          }
        }
      }
    });

    const historyStr = extracted.pastMedicalHistory.length > 0 ? extracted.pastMedicalHistory.join(', ') : 'No prior chronic diagnoses documented';
    const medsStr = extracted.medications.length > 0 ? extracted.medications.map(m => `${m.name} ${m.dosage}`).join(', ') : 'No active medications extracted';

    extracted.summary = `PAST MEDICAL HISTORY & ACTIVE RX: Document records past history of [${historyStr}] and active Rx [${medsStr}]. Extracted ${extracted.medications.length} drug(s) and ${extracted.investigations.length} lab value(s).`;

    return extracted;
  }

  // Process document or camera image
  async processDocumentImage(fileOrBlob, selectedPresetId = null, onProgress = null) {
    if (selectedPresetId) {
      const template = SAMPLE_OCR_TEMPLATES.find(t => t.id === selectedPresetId);
      if (template) return template.extracted;
    }

    if (fileOrBlob) {
      try {
        const formData = new FormData();
        if (fileOrBlob instanceof File || fileOrBlob instanceof Blob) {
          formData.append('file', fileOrBlob);
        } else if (typeof fileOrBlob === 'string' && fileOrBlob.startsWith('data:')) {
          formData.append('image_base64', fileOrBlob);
        }

        const response = await fetch('http://localhost:5000/api/ocr/scan', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const apiResult = await response.json();
          if (apiResult.success && apiResult.extracted && (apiResult.extracted.medications?.length > 0 || apiResult.extracted.investigations?.length > 0 || apiResult.extracted.rawText?.length > 0)) {
            return apiResult.extracted;
          }
        }
      } catch (err) {
        console.warn('Backend OCR API call fallback:', err);
      }
    }

    if (fileOrBlob) {
      const recognizedText = await this.recognizeTextFromImage(fileOrBlob, onProgress);
      if (recognizedText && recognizedText.trim().length > 5) {
        return this.transformRawTextToEntities(recognizedText);
      }
    }

    return this.transformRawTextToEntities("");
  }

  // Synthesize Unified AI Executive Highlights
  synthesizeExecutiveHighlights(patient, answers, vitals, triage, scannedDoc) {
    const highlights = [];

    const pastHistoryList = scannedDoc?.pastMedicalHistory || scannedDoc?.diagnoses || [];
    const pastHistoryStr = pastHistoryList.length > 0 ? pastHistoryList.join(', ') : 'No documented prior chronic illness';
    const currentComplaint = answers?.symptom_category_name || answers?.character || 'General Checkup';

    highlights.push({
      type: 'ALERT',
      title: 'Past History vs Current Chief Complaint',
      detail: `Past History (From Prescription): [${pastHistoryStr}] | Today's OPD Complaint: [${currentComplaint} at ${answers?.site || 'body zone'}, Severity ${answers?.severity || 2}/10]`
    });

    if (vitals.spo2_percent < 90) {
      highlights.push({
        type: 'CRITICAL',
        title: 'Severe Hypoxia Alert',
        detail: `SpO2 is ${vitals.spo2_percent}% (Below 90% threshold). Immediate oxygen therapy advised.`
      });
    }

    if (vitals.temperature_c >= 39.0) {
      highlights.push({
        type: 'WARNING',
        title: 'High Pyrexia (Fever)',
        detail: `Body temperature is ${vitals.temperature_c}°C (${((vitals.temperature_c * 9/5) + 32).toFixed(1)}°F).`
      });
    }

    if (answers.radiation === 'to_arm_jaw') {
      highlights.push({
        type: 'CRITICAL',
        title: 'Cardiovascular Ischemia Indicator',
        detail: `Discomfort radiates to left arm/jaw in patient with past history of [${pastHistoryStr}]. Rule out ACS!`
      });
    }

    if (scannedDoc && scannedDoc.medications && scannedDoc.medications.length > 0) {
      highlights.push({
        type: 'NORMAL',
        title: 'Active Extracted Medications',
        detail: scannedDoc.medications.map(m => `${m.name} ${m.dosage} (${m.frequency})`).join(' | ')
      });
    }

    if (scannedDoc && scannedDoc.investigations) {
      const abnormalLabs = scannedDoc.investigations.filter(i => i.isAbnormal);
      if (abnormalLabs.length > 0) {
        highlights.push({
          type: 'ALERT',
          title: 'Abnormal Pathology Findings',
          detail: abnormalLabs.map(i => `${i.testName}: ${i.value} (${i.flag})`).join(' | ')
        });
      }
    }

    if (scannedDoc && scannedDoc.drugWarnings && scannedDoc.drugWarnings.length > 0) {
      highlights.push({
        type: 'WARNING',
        title: 'AI Contraindication Guardrail',
        detail: scannedDoc.drugWarnings.join('; ')
      });
    }

    return highlights;
  }
}

export const ocrEngine = new OCREngine();
