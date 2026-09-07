/**
 * MediKiosk Clinical Intelligence Engine
 * Handles SOCRATES Allopathy, AYUSH Dashavidha Pariksha, Emergency Triage, and ABDM FHIR R4 formatting.
 */

export const SYMPTOM_CATEGORIES = [
  { id: 'routine_checkup', name: 'Routine OPD General Checkup', name_hi: 'सामान्य ओपीडी परामर्श', category: 'General', icon: 'CheckCircle2' },
  { id: 'chest_pain', name: 'Chest Pain / Pressure', name_hi: 'सीने में दर्द / भारीपन', category: 'Cardiovascular', icon: 'Heart', redFlagIf: ['radiation_arm', 'severe_dyspnea'] },
  { id: 'fever', name: 'Fever & Chills', name_hi: 'बुखार एवं कंपकंपी', category: 'General', icon: 'Thermometer' },
  { id: 'respiratory', name: 'Cough / Shortness of Breath', name_hi: 'खांसी / सांस फूलना', category: 'Respiratory', icon: 'Wind', redFlagIf: ['spo2_below_90'] },
  { id: 'abdominal', name: 'Abdominal Pain & Digestion', name_hi: 'पेट दर्द एवं पाचन तंत्र', category: 'Gastrointestinal', icon: 'Activity' },
  { id: 'headache', name: 'Headache & Dizziness', name_hi: 'सिरदर्द एवं चक्कर आना', category: 'Neurological', icon: 'Brain' },
  { id: 'joint_pain', name: 'Joint & Muscle Pain', name_hi: 'जोड़ों व मांसपेशियों का दर्द', category: 'Musculoskeletal', icon: 'Activity' },
  { id: 'ayush_general', name: 'Ayurvedic Wellness & Prakriti Checkup', name_hi: 'आयुर्वेदिक प्रकृति एवं स्वास्थ्य जांच', category: 'AYUSH Speciality', icon: 'Feather' }
];

export const SOCRATES_QUESTIONS = {
  site: {
    id: 'site',
    title: 'Where exactly is the pain or primary discomfort located?',
    title_hi: 'दर्द या तकलीफ शरीर के किस हिस्से में है?',
    type: 'visual_body_map',
    options: [
      { id: 'chest_left', label: 'Left Side of Chest', label_hi: 'सीने की बाईं तरफ', icon: 'Heart' },
      { id: 'chest_center', label: 'Center of Chest', label_hi: 'सीने के बीच में', icon: 'Heart' },
      { id: 'abdomen_upper', label: 'Upper Abdomen / Stomach', label_hi: 'ऊपरी पेट / अमाशय', icon: 'Square' },
      { id: 'head_forehead', label: 'Forehead / Temples', label_hi: 'माथा / कनपटी', icon: 'Brain' },
      { id: 'back_lumbar', label: 'Lower Back', label_hi: 'पीठ के निचले हिस्से में', icon: 'User' },
      { id: 'joints_limbs', label: 'Knee / Joints', label_hi: 'घुटने / जोड़', icon: 'Activity' }
    ]
  },
  onset: {
    id: 'onset',
    title: 'How did the symptom start?',
    title_hi: 'लक्षणों की शुरुआत कैसे हुई?',
    type: 'choice',
    options: [
      { id: 'sudden_acute', label: 'Sudden & Severe (Within minutes)', label_hi: 'अचानक और तेज (कुछ मिनटों के भीतर)', description: 'Started abruptly out of nowhere' },
      { id: 'gradual_hours', label: 'Gradual Onset (Over hours/days)', label_hi: 'धीरे-धीरे शुरुआत (घंटों या दिनों में)', description: 'Steadily grew worse over time' },
      { id: 'chronic_weeks', label: 'Long Standing / Chronic (Weeks/Months)', label_hi: 'पुराना दर्द (हफ्तों या महीनों से)', description: 'Intermittent or recurring issue' }
    ]
  },
  character: {
    id: 'character',
    title: 'What does the pain or discomfort feel like?',
    title_hi: 'दर्द की अनुभूति कैसी महसूस होती है?',
    type: 'choice',
    options: [
      { id: 'pressure_squeezing', label: 'Heavy Pressure / Squeezing Tightness', label_hi: 'भारी दबाव / सीना कसना या जकड़ना', isUrgent: true },
      { id: 'sharp_stabbing', label: 'Sharp, Stabbing or Piercing', label_hi: 'तेज चुभने वाला या सूई जैसा दर्द' },
      { id: 'dull_aching', label: 'Dull Aching or Constant Heavy Throbbing', label_hi: 'हल्का या लगातार भारी मीठा दर्द' },
      { id: 'burning', label: 'Burning Sensation / Acidity-like', label_hi: 'जलन / तेजाबियत जैसा एसिडिटी दर्द' }
    ]
  },
  radiation: {
    id: 'radiation',
    title: 'Does the pain spread (radiate) anywhere else?',
    title_hi: 'क्या दर्द शरीर के किसी अन्य हिस्से में फैलता है?',
    type: 'choice',
    options: [
      { id: 'to_arm_jaw', label: 'Spreads to Left Arm, Neck or Jaw', label_hi: 'बायें हाथ, गर्दन या जबड़े की तरफ फैलता है', isRedFlag: true },
      { id: 'to_back', label: 'Spreads to Upper or Lower Back', label_hi: 'पीठ के ऊपरी या निचले हिस्से में फैलता है' },
      { id: 'none', label: 'Does not spread (Stays in one spot)', label_hi: 'कही नहीं फैलता (एक ही जगह रहता है)' }
    ]
  },
  associations: {
    id: 'associations',
    title: 'Are you experiencing any accompanying symptoms?',
    title_hi: 'क्या आपको इसके साथ कोई अन्य लक्षण महसूस हो रहे हैं?',
    type: 'multiselect',
    options: [
      { id: 'shortness_of_breath', label: 'Breathlessness / Difficulty Breathing', label_hi: 'सांस फूलना / सांस लेने में तकलीफ', isUrgent: true },
      { id: 'cold_sweats', label: 'Cold Sweating & Dizziness', label_hi: 'ठंडा पसीना आना एवं चक्कर महसूस होना', isUrgent: true },
      { id: 'nausea_vomiting', label: 'Nausea or Vomiting', label_hi: 'उल्टी या मिचली (जी मिचलाना)' },
      { id: 'cough', label: 'Persistent Coughing', label_hi: 'लगातार खांसी आना' },
      { id: 'fever', label: 'High Body Temperature', label_hi: 'तेज बुखार' }
    ]
  },
  severity: {
    id: 'severity',
    title: 'How severe is the pain/discomfort on a scale of 1 to 10?',
    title_hi: '1 से 10 के पैमाने पर दर्द कितना तीव्र है?',
    type: 'rating_scale',
    min: 1,
    max: 10
  }
};

export const AYUSH_QUESTIONS = {
  prakriti: {
    id: 'prakriti',
    title: 'Prakriti Assessment (Body Constitution & Dominant Dosha)',
    title_hi: 'प्रकृति परीक्षण (त्रिदोष निर्धारण)',
    type: 'choice',
    options: [
      { id: 'vata', label: 'Vata Dominant (Light build, dry skin, quick mind, active, irregular digestion)', label_hi: 'वात प्रधान (हल्का शरीर, रूखी त्वचा, चंचल मन, अनिश्चित पाचन)' },
      { id: 'pitta', label: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp intellect)', label_hi: 'पित्त प्रधान (मध्यम शरीर, गर्म त्वचा, तेज पाचन, एकाग्र बुद्धि)' },
      { id: 'kapha', label: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady digestion)', label_hi: 'कफ प्रधान (मजबूत शरीर, चिकनी त्वचा, शांत स्वभाव, सहनशीलता)' },
      { id: 'tridosha', label: 'Dual / Mixed (Vata-Pitta / Pitta-Kapha)', label_hi: 'मिश्रित प्रकृति (वात-पित्त / पित्त-कफ)' }
    ]
  },
  agni: {
    id: 'agni',
    title: 'Agni Pariksha (Digestive Fire Capacity)',
    title_hi: 'अग्नि परीक्षण (पाचन क्षमता)',
    type: 'choice',
    options: [
      { id: 'sama_agni', label: 'Sama Agni (Normal, balanced appetite and smooth digestion)', label_hi: 'सम अग्नि (सामान्य, संतुलित भूख एवं सुचारू पाचन)' },
      { id: 'manda_agni', label: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)', label_hi: 'मंद अग्नि (धीमी पाचन शक्ति, खाने के बाद भारीपन, कम भूख)' },
      { id: 'tikshna_agni', label: 'Tikshna Agni (Hyperactive digestion, frequent intense hunger, acidity)', label_hi: 'तीक्ष्ण अग्नि (अत्यधिक तीव्र भूख, सीने में जलन, तेज तेजाबियत)' },
      { id: 'vishama_agni', label: 'Vishama Agni (Irregular, unpredictable digestive capacity)', label_hi: 'विषम अग्नि (अनिश्चित, कभी तेज तो कभी मंद पाचन)' }
    ]
  },
  koshtha: {
    id: 'koshtha',
    title: 'Koshtha Pariksha (Bowel Nature & Elimination)',
    title_hi: 'कोष्ठ परीक्षण (पेट की सफाई की प्रकृति)',
    type: 'choice',
    options: [
      { id: 'krura', label: 'Krura Koshtha (Tendency towards constipation, hard bowel movements)', label_hi: 'क्रूर कोष्ठ (कब्ज की शिकायत, मल त्याग में कठिनाई)' },
      { id: 'mridu', label: 'Mridu Koshtha (Soft bowel movements, sensitive to milk/spices)', label_hi: 'मृदु कोष्ठ (नरम मल, दूध या मिर्च-मसाले से तुरंत दस्त)' },
      { id: 'madhyama', label: 'Madhyama Koshtha (Regular, comfortable daily bowel elimination)', label_hi: 'मध्यम कोष्ठ (नियमित, आरामदायक पेट की सफाई)' }
    ]
  },
  ahara_vihara: {
    id: 'ahara_vihara',
    title: 'Ahara-Vihara (Dietary & Daily Lifestyle Routine)',
    title_hi: 'आहार-विहार (खान-पान एवं जीवनशैली)',
    type: 'multiselect',
    options: [
      { id: 'spicy_oily', label: 'High consumption of spicy/oily/junk food', label_hi: 'तला-भुना / मिर्च-मसालेदार / जंक फूड का अधिक सेवन' },
      { id: 'irregular_sleep', label: 'Late night sleep / Irregular sleep schedule', label_hi: 'देर रात तक जागना / अनियमित नींद' },
      { id: 'high_stress', label: 'High mental stress / Sedentary routine', label_hi: 'मानसिक तनाव / शारीरिक गतिविधि की कमी' },
      { id: 'healthy_balanced', label: 'Fresh sattvic food & regular routine', label_hi: 'ताजा सात्विक भोजन एवं नियमित दिनचर्या' }
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
