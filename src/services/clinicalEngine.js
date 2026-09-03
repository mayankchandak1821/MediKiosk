/**
 * MediKiosk Clinical Intelligence Engine
 * Handles SOCRATES Allopathy, AYUSH Dashavidha Pariksha, Emergency Triage, and ABDM FHIR R4 formatting.
 */

export const SYMPTOM_CATEGORIES = [
  { id: 'routine_checkup', name: 'Routine OPD General Checkup', category: 'General', icon: 'CheckCircle2' },
  { id: 'chest_pain', name: 'Chest Pain / Pressure', category: 'Cardiovascular', icon: 'Heart', redFlagIf: ['radiation_arm', 'severe_dyspnea'] },
  { id: 'fever', name: 'Fever & Chills', category: 'General', icon: 'Thermometer' },
  { id: 'respiratory', name: 'Cough / Shortness of Breath', category: 'Respiratory', icon: 'Wind', redFlagIf: ['spo2_below_90'] },
  { id: 'abdominal', name: 'Abdominal Pain & Digestion', category: 'Gastrointestinal', icon: 'Activity' },
  { id: 'headache', name: 'Headache & Dizziness', category: 'Neurological', icon: 'Brain' },
  { id: 'joint_pain', name: 'Joint & Muscle Pain', category: 'Musculoskeletal', icon: 'Activity' },
  { id: 'ayush_general', name: 'Ayurvedic Wellness & Prakriti Checkup', category: 'AYUSH Speciality', icon: 'Feather' }
];

export const SOCRATES_QUESTIONS = {
  site: {
    id: 'site',
    title: 'Where exactly is the pain or primary discomfort located?',
    type: 'visual_body_map',
    options: [
      { id: 'chest_left', label: 'Left Side of Chest', icon: 'Heart' },
      { id: 'chest_center', label: 'Center of Chest', icon: 'Heart' },
      { id: 'abdomen_upper', label: 'Upper Abdomen / Stomach', icon: 'Square' },
      { id: 'head_forehead', label: 'Forehead / Temples', icon: 'Brain' },
      { id: 'back_lumbar', label: 'Lower Back', icon: 'User' },
      { id: 'joints_limbs', label: 'Knee / Joints', icon: 'Activity' }
    ]
  },
  onset: {
    id: 'onset',
    title: 'How did the symptom start?',
    type: 'choice',
    options: [
      { id: 'sudden_acute', label: 'Sudden & Severe (Within minutes)', description: 'Started abruptly out of nowhere' },
      { id: 'gradual_hours', label: 'Gradual Onset (Over hours/days)', description: 'Steadily grew worse over time' },
      { id: 'chronic_weeks', label: 'Long Standing / Chronic (Weeks/Months)', description: 'Intermittent or recurring issue' }
    ]
  },
  character: {
    id: 'character',
    title: 'What does the pain or discomfort feel like?',
    type: 'choice',
    options: [
      { id: 'pressure_squeezing', label: 'Heavy Pressure / Squeezing Tightness', isUrgent: true },
      { id: 'sharp_stabbing', label: 'Sharp, Stabbing or Piercing' },
      { id: 'dull_aching', label: 'Dull Aching or Constant Heavy Throbbing' },
      { id: 'burning', label: 'Burning Sensation / Acidity-like' }
    ]
  },
  radiation: {
    id: 'radiation',
    title: 'Does the pain spread (radiate) anywhere else?',
    type: 'choice',
    options: [
      { id: 'to_arm_jaw', label: 'Spreads to Left Arm, Neck or Jaw', isRedFlag: true },
      { id: 'to_back', label: 'Spreads to Upper or Lower Back' },
      { id: 'none', label: 'Does not spread (Stays in one spot)' }
    ]
  },
  associations: {
    id: 'associations',
    title: 'Are you experiencing any accompanying symptoms?',
    type: 'multiselect',
    options: [
      { id: 'shortness_of_breath', label: 'Breathlessness / Difficulty Breathing', isUrgent: true },
      { id: 'cold_sweats', label: 'Cold Sweating & Dizziness', isUrgent: true },
      { id: 'nausea_vomiting', label: 'Nausea or Vomiting' },
      { id: 'cough', label: 'Persistent Coughing' },
      { id: 'fever', label: 'High Body Temperature' }
    ]
  },
  severity: {
    id: 'severity',
    title: 'How severe is the pain/discomfort on a scale of 1 to 10?',
    type: 'rating_scale',
    min: 1,
    max: 10
  }
};

export const AYUSH_QUESTIONS = {
  prakriti: {
    id: 'prakriti',
    title: 'Prakriti Assessment (Body Constitution & Dominant Dosha)',
    type: 'choice',
    options: [
      { id: 'vata', label: 'Vata Dominant (Light build, dry skin, quick mind, active, irregular digestion)' },
      { id: 'pitta', label: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp intellect)' },
      { id: 'kapha', label: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady digestion)' },
      { id: 'tridosha', label: 'Dual / Mixed (Vata-Pitta / Pitta-Kapha)' }
    ]
  },
  agni: {
    id: 'agni',
    title: 'Agni Pariksha (Digestive Fire Capacity)',
    type: 'choice',
    options: [
      { id: 'sama_agni', label: 'Sama Agni (Normal, balanced appetite and smooth digestion)' },
      { id: 'manda_agni', label: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)' },
      { id: 'tikshna_agni', label: 'Tikshna Agni (Hyperactive digestion, frequent intense hunger, acidity)' },
      { id: 'vishama_agni', label: 'Vishama Agni (Irregular, unpredictable digestive capacity)' }
    ]
  },
  koshtha: {
    id: 'koshtha',
    title: 'Koshtha Pariksha (Bowel Nature & Elimination)',
    type: 'choice',
    options: [
      { id: 'krura', label: 'Krura Koshtha (Tendency towards constipation, hard bowel movements)' },
      { id: 'mridu', label: 'Mridu Koshtha (Soft bowel movements, sensitive to milk/spices)' },
      { id: 'madhyama', label: 'Madhyama Koshtha (Regular, comfortable daily bowel elimination)' }
    ]
  },
  ahara_vihara: {
    id: 'ahara_vihara',
    title: 'Ahara-Vihara (Dietary & Daily Lifestyle Routine)',
    type: 'multiselect',
    options: [
      { id: 'spicy_oily', label: 'High consumption of spicy/oily/junk food' },
      { id: 'irregular_sleep', label: 'Late night sleep / Irregular sleep schedule' },
      { id: 'high_stress', label: 'High mental stress / Sedentary routine' },
      { id: 'healthy_balanced', label: 'Fresh sattvic food & regular routine' }
    ]
  }
};

class ClinicalEngine {
  /**
   * Evaluate Emergency Red-Flag Triage & Quantitative Risk Score (0% - 100%)
   */
  evaluateTriage(answers = {}, vitals = {}) {
    const redFlags = [];
    let priority = 'ROUTINE';
    let riskScore = 0;

    // 1. SpO2 Oxygen Saturation Contribution (Max 40 Points)
    const spo2 = vitals.spo2_percent || 98;
    if (spo2 < 88) {
      riskScore += 40;
      redFlags.push(`Critical Hypoxia: SpO2 ${spo2}% is dangerously below 90% threshold.`);
      priority = 'RED_FLAG_CRITICAL';
    } else if (spo2 < 90) {
      riskScore += 32;
      redFlags.push(`Severe Hypoxia: SpO2 ${spo2}% below 90%.`);
      priority = 'RED_FLAG_CRITICAL';
    } else if (spo2 < 94) {
      riskScore += 18;
      redFlags.push(`Mild Hypoxia: SpO2 ${spo2}% requiring observation.`);
      if (priority !== 'RED_FLAG_CRITICAL') priority = 'URGENT';
    }

    // 2. Temperature / Pyrexia Contribution (Max 15 Points)
    const temp = vitals.temperature_c || 37.0;
    if (temp >= 39.0) {
      riskScore += 15;
      redFlags.push(`High Fever Alert: Temperature ${temp}°C.`);
      if (priority !== 'RED_FLAG_CRITICAL') priority = 'URGENT';
    } else if (temp >= 38.0) {
      riskScore += 8;
    }

    // 3. Heart Rate Dysrhythmia Contribution (Max 10 Points)
    const hr = vitals.heart_rate_bpm || 72;
    if (hr > 130 || hr < 45) {
      riskScore += 10;
      redFlags.push(`Severe Dysrhythmia: Heart rate ${hr} BPM.`);
      if (priority !== 'RED_FLAG_CRITICAL') priority = 'URGENT';
    } else if (hr > 100) {
      riskScore += 5;
    }

    // 4. Cardiovascular Radiation & Character Contribution (Max 30 Points)
    if (answers.radiation === 'to_arm_jaw') {
      riskScore += 22;
      redFlags.push('Cardiovascular Alert: Discomfort radiates to arm, neck or jaw.');
      priority = 'RED_FLAG_CRITICAL';
    }

    if (answers.character === 'pressure_squeezing') {
      riskScore += 12;
      redFlags.push('Ischemic Symptom Pattern: Squeezing chest pressure reported.');
      if (priority !== 'RED_FLAG_CRITICAL') priority = 'URGENT';
    }

    // 5. Associated Emergency Symptoms Contribution (Max 15 Points)
    if (answers.associations && answers.associations.includes('shortness_of_breath')) {
      riskScore += 10;
      redFlags.push('Acute Respiratory Distress: Associated severe breathlessness reported.');
      if (priority !== 'RED_FLAG_CRITICAL') priority = 'URGENT';
    }

    if (answers.associations && answers.associations.includes('cold_sweats')) {
      riskScore += 8;
      redFlags.push('Autonomic Response: Cold sweats & syncope tendency.');
      if (priority !== 'RED_FLAG_CRITICAL') priority = 'URGENT';
    }

    // 6. Pain Severity Contribution (Max 10 Points)
    const severity = answers.severity || 0;
    if (severity >= 8) {
      riskScore += 10;
      redFlags.push(`Extreme Pain Scale: ${severity}/10 reported.`);
      if (priority !== 'RED_FLAG_CRITICAL') priority = 'URGENT';
    } else if (severity >= 5) {
      riskScore += 5;
    }

    // Compute final percentage between 5% and 98%
    const riskPercentage = Math.min(98, Math.max(5, riskScore));
    const riskLevel = riskPercentage >= 60 ? 'HIGH_CRITICAL' : riskPercentage >= 30 ? 'MODERATE' : 'LOW_ROUTINE';

    return {
      priority,
      isRedFlag: priority === 'RED_FLAG_CRITICAL',
      riskPercentage,
      riskLevel,
      redFlags
    };
  }

  // Generate ABDM HL7 FHIR R4 Bundle
  generateFHIRPayload(patient, encounter, answers, vitals, triage, scannedDoc) {
    return {
      resourceType: "Bundle",
      id: `bundle-${encounter.id || Date.now()}`,
      meta: {
        lastUpdated: new Date().toISOString()
      },
      identifier: {
        system: "https://healthid.ndhm.gov.in",
        value: patient.abha_id
      },
      type: "document",
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patient.abha_id}`,
          resource: {
            resourceType: "Patient",
            id: patient.abha_id,
            identifier: [
              {
                system: "https://healthid.ndhm.gov.in",
                value: patient.abha_id
              }
            ],
            name: [{ text: patient.full_name }],
            gender: patient.gender?.toLowerCase(),
            telecom: [{ system: "phone", value: patient.phone }]
          }
        },
        {
          fullUrl: "urn:uuid:observation-vitals",
          resource: {
            resourceType: "Observation",
            status: "final",
            code: { text: "Peripheral Vitals Readout" },
            component: [
              { code: { text: "Body Temperature" }, valueQuantity: { value: vitals.temperature_c, unit: "C" } },
              { code: { text: "Heart Rate" }, valueQuantity: { value: vitals.heart_rate_bpm, unit: "bpm" } },
              { code: { text: "Oxygen Saturation" }, valueQuantity: { value: vitals.spo2_percent, unit: "%" } }
            ]
          }
        },
        {
          fullUrl: "urn:uuid:risk-assessment",
          resource: {
            resourceType: "RiskAssessment",
            status: "final",
            prediction: [
              {
                outcome: { text: triage.priority },
                qualitativeRisk: { text: `${triage.riskPercentage}% ${triage.riskLevel}` },
                rationale: triage.redFlags.join('; ')
              }
            ]
          }
        }
      ]
    };
  }
}

export const clinicalEngine = new ClinicalEngine();
