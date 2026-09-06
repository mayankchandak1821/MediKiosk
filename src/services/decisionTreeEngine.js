/**
 * MediKiosk Universal Clinical Decision Tree Engine (SIH26047)
 * Implements dynamic, branching clinical symptom decision trees for:
 * - Chest Pain / Emergency
 * - Fever & Infections
 * - Abdominal Pain & Digestion
 * - Cough & Respiratory / Breathlessness
 * - Headache & Neurological
 * - AYUSH & Ayurvedic Prakriti
 * - Routine OPD General Checkup
 *
 * Computes Differential Diagnosis Probabilities and Immediate Red Flag Triage.
 */

export const DECISION_TREES = {
  chest_pain: {
    id: 'chest_pain',
    name: 'Cardiovascular & Chest Pain Decision Tree',
    steps: [
      {
        id: 'chest_character',
        title: 'Step 1: What is the exact sensation of the chest discomfort?',
        subtitle: 'Select primary character of chest pain',
        options: [
          { id: 'crushing_pressure', label: 'Crushing Heavy Pressure / Tight Band / Heavy Weight', icon: 'Heart', isRedFlag: true, weight: { acs: 40, gerd: 5, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'sharp_stabbing', label: 'Sharp Stabbing / Knife-like Pain', icon: 'Activity', weight: { acs: 10, gerd: 10, pleuritic: 40, musculoskeletal: 25 } },
          { id: 'substernal_burning', label: 'Substernal Burning / Acid Reflux / Heartburn', icon: 'Flame', weight: { acs: 10, gerd: 50, pleuritic: 5, musculoskeletal: 5 } },
          { id: 'chest_wall_soreness', label: 'Localized Tenderness / Pain When Pressing Chest Wall', icon: 'User', weight: { acs: 0, gerd: 5, pleuritic: 15, musculoskeletal: 60 } }
        ]
      },
      {
        id: 'chest_radiation',
        title: 'Step 2: Does the chest pain spread (radiate) to other body areas?',
        subtitle: 'Check for radiation patterns characteristic of myocardial ischemia',
        options: [
          { id: 'rad_arm_jaw_neck', label: 'Radiates to Left Arm, Shoulder, Jaw, or Neck', icon: 'ShieldAlert', isRedFlag: true, weight: { acs: 45, gerd: 0, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'rad_back', label: 'Radiates straight through to the Upper Back / Interscapular area', icon: 'AlertTriangle', isRedFlag: true, weight: { acs: 25, gerd: 10, pleuritic: 10, musculoskeletal: 10 } },
          { id: 'rad_epigastric', label: 'Spreads down towards Upper Stomach / Epigastrium', icon: 'Activity', weight: { acs: 20, gerd: 35, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'rad_none', label: 'Does NOT spread (Stays localized in one small spot)', icon: 'CheckCircle2', weight: { acs: 0, gerd: 10, pleuritic: 20, musculoskeletal: 30 } }
        ]
      },
      {
        id: 'chest_triggers',
        title: 'Step 3: What worsens or triggers the chest pain?',
        subtitle: 'Aggravating and relieving factor evaluation',
        options: [
          { id: 'trig_exertion', label: 'Worse with Physical Exertion, Walking, or Climbing Stairs', icon: 'Activity', isRedFlag: true, weight: { acs: 35, gerd: 0, pleuritic: 0, musculoskeletal: 5 } },
          { id: 'trig_breathing_cough', label: 'Worse with Deep Inspiration, Breathing, or Coughing', icon: 'Wind', weight: { acs: 5, gerd: 0, pleuritic: 50, musculoskeletal: 20 } },
          { id: 'trig_fatty_food', label: 'Worse after Fatty Meals or Lying Down Flat', icon: 'Flame', weight: { acs: 5, gerd: 45, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'trig_body_movement', label: 'Worse with Arm Movement or Twisting Torso', icon: 'User', weight: { acs: 0, gerd: 0, pleuritic: 10, musculoskeletal: 50 } }
        ]
      },
      {
        id: 'chest_associated',
        title: 'Step 4: Are you experiencing any accompanying emergency symptoms?',
        subtitle: 'Multi-system autonomic indicator check',
        isMultiSelect: true,
        options: [
          { id: 'assoc_sweating', label: 'Profuse Cold Sweating (Diaphoresis)', isRedFlag: true, weight: { acs: 25, gerd: 0, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'assoc_dyspnea', label: 'Severe Shortness of Breath / Air Hunger', isRedFlag: true, weight: { acs: 25, gerd: 0, pleuritic: 25, musculoskeletal: 0 } },
          { id: 'assoc_nausea_vomiting', label: 'Nausea or Vomiting', weight: { acs: 15, gerd: 20, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'assoc_dizziness', label: 'Dizziness / Lightheadedness / Fainting tendency', isRedFlag: true, weight: { acs: 20, gerd: 0, pleuritic: 0, musculoskeletal: 0 } }
        ]
      }
    ]
  },
  fever: {
    id: 'fever',
    name: 'Infectious & Pyrexia Decision Tree',
    steps: [
      {
        id: 'fever_pattern',
        title: 'Step 1: What is the temperature pattern and onset?',
        subtitle: 'Fever spike frequency and chills evaluation',
        options: [
          { id: 'spiking_chills', label: 'High Spiking Fever (>102°F) with Shaking Chills & Rigors', icon: 'Thermometer', isRedFlag: true, weight: { malaria: 45, bacterial: 35, dengue: 20 } },
          { id: 'continuous_moderate', label: 'Continuous Moderate Fever (99°F - 101°F)', icon: 'Activity', weight: { viral: 45, bacterial: 25, malaria: 10 } },
          { id: 'low_grade_night_sweats', label: 'Low-Grade Evening Spikes with Profuse Night Sweats', icon: 'Flame', weight: { tb: 50, chronic: 35, viral: 15 } }
        ]
      },
      {
        id: 'fever_focal_symptoms',
        title: 'Step 2: Which organ systems show focal infection symptoms?',
        subtitle: 'Anatomical symptom localization',
        isMultiSelect: true,
        options: [
          { id: 'focal_throat', label: 'Severe Sore Throat / Painful Swallowing', icon: 'Activity', weight: { pharyngitis: 45 } },
          { id: 'focal_cough_phlegm', label: 'Persistent Cough with Yellow/Green Phlegm', icon: 'Wind', weight: { pneumonia: 45 } },
          { id: 'focal_urinary', label: 'Burning Sensation while Urinating / High Frequency', icon: 'Activity', weight: { uti: 50 } },
          { id: 'focal_joint_eye', label: 'Severe Joint/Muscle Pain & Pain Behind Eyes', icon: 'ShieldAlert', weight: { dengue: 50 } }
        ]
      }
    ]
  },
  abdominal: {
    id: 'abdominal',
    name: 'Gastrointestinal & Abdominal Pain Decision Tree',
    steps: [
      {
        id: 'abdo_location',
        title: 'Step 1: Where in the abdomen is the pain located?',
        subtitle: 'Abdominal quadrant localization',
        options: [
          { id: 'epigastric', label: 'Upper Stomach / Epigastrium (Acid Reflux / Stomach)', icon: 'Flame', weight: { gerd: 45, gastritis: 45 } },
          { id: 'ruq', label: 'Right Upper Quadrant (Under Right Rib Cage)', icon: 'Activity', weight: { cholecystitis: 50 } },
          { id: 'rlq', label: 'Right Lower Quadrant (Near Right Hip Bone)', icon: 'ShieldAlert', isRedFlag: true, weight: { appendicitis: 55 } },
          { id: 'generalized_cramps', label: 'Diffuse Cramps & Bloating all over Stomach', icon: 'User', weight: { gastroenteritis: 45 } }
        ]
      },
      {
        id: 'abdo_red_flags',
        title: 'Step 2: Are you experiencing any severe GI red flags?',
        subtitle: 'Internal bleeding and peritonitis screening',
        isMultiSelect: true,
        options: [
          { id: 'abdo_vomit_blood', label: 'Vomiting Blood or Dark Coffee-Ground Fluid', icon: 'ShieldAlert', isRedFlag: true, weight: { gi_bleed: 50 } },
          { id: 'abdo_black_stool', label: 'Passing Black Tarry Stool (Melena)', icon: 'AlertTriangle', isRedFlag: true, weight: { gi_bleed: 50 } },
          { id: 'abdo_rigid_stomach', label: 'Stomach is Board-Like Hard & Painful to Touch', icon: 'ShieldAlert', isRedFlag: true, weight: { peritonitis: 55 } }
        ]
      }
    ]
  },
  respiratory: {
    id: 'respiratory',
    name: 'Respiratory & Breathlessness Decision Tree',
    steps: [
      {
        id: 'resp_dyspnea_severity',
        title: 'Step 1: How severe is the breathing difficulty?',
        subtitle: 'Air hunger and talk test evaluation',
        options: [
          { id: 'resp_rest_breathless', label: 'Breathless at Rest / Cannot Complete Short Sentences', icon: 'ShieldAlert', isRedFlag: true, weight: { acute_asthma: 45, heart_failure: 35, copd: 20 } },
          { id: 'resp_exertion_only', label: 'Breathless Only when Walking or Climbing Stairs', icon: 'Wind', weight: { copd: 40, asthma: 30, deconditioning: 30 } },
          { id: 'resp_positional', label: 'Cannot Lie Flat in Bed without Waking Up Gasping', icon: 'Heart', isRedFlag: true, weight: { heart_failure: 50, pulmonary_edema: 40 } }
        ]
      },
      {
        id: 'resp_cough_sputum',
        title: 'Step 2: What is the cough and sputum character?',
        subtitle: 'Auscultation & sputum analysis',
        options: [
          { id: 'dry_whistling', label: 'Dry Cough with High-Pitched Whistling / Wheezing Sound', icon: 'Wind', weight: { asthma: 50, copd: 35 } },
          { id: 'thick_yellow_green', label: 'Coughing up Thick Yellow / Green Phlegm', icon: 'Activity', weight: { pneumonia: 50, bronchitis: 40 } },
          { id: 'pink_frothy_blood', label: 'Coughing up Pink Frothy Sputum or Blood Spots', icon: 'ShieldAlert', isRedFlag: true, weight: { pulmonary_edema: 50, tb: 40 } }
        ]
      }
    ]
  },
  headache: {
    id: 'headache',
    name: 'Neurological & Headache Decision Tree',
    steps: [
      {
        id: 'head_onset_character',
        title: 'Step 1: What was the speed of onset and pain character?',
        subtitle: 'Intracranial pain pattern analysis',
        options: [
          { id: 'thunderclap_sudden', label: 'Sudden "Thunderclap" Explosion (Worst Headache of Life)', icon: 'ShieldAlert', isRedFlag: true, weight: { sah: 60, aneurysm: 35 } },
          { id: 'one_sided_throbbing', label: 'One-Sided Throbbing Pain with Nausea & Light Sensitivity', icon: 'Activity', weight: { migraine: 55, tension: 15 } },
          { id: 'tight_band_forehead', label: 'Constant Tight Squeezing Band Around Temples & Forehead', icon: 'User', weight: { tension: 60, fatigue: 30 } }
        ]
      },
      {
        id: 'head_neuro_deficits',
        title: 'Step 2: Are you experiencing any neurological red flags?',
        subtitle: 'FAST stroke & meningeal sign screening',
        isMultiSelect: true,
        options: [
          { id: 'stroke_facial_droop', label: 'Facial Droop, Arm Weakness, or Slurred Speech', icon: 'ShieldAlert', isRedFlag: true, weight: { stroke: 60 } },
          { id: 'stiff_neck_fever', label: 'Stiff Neck + High Fever + Sensitivity to Light', icon: 'ShieldAlert', isRedFlag: true, weight: { meningitis: 55 } },
          { id: 'vision_loss_double', label: 'Sudden Vision Loss, Double Vision, or Dizziness', icon: 'AlertTriangle', isRedFlag: true, weight: { stroke: 45 } }
        ]
      }
    ]
  },
  ayush_wellness: {
    id: 'ayush_wellness',
    name: 'AYUSH Prakriti & Dashavidha Pariksha Decision Tree',
    steps: [
      {
        id: 'ayush_dosha',
        title: 'Step 1: Dominant Body Constitution (Prakriti Pariksha)',
        subtitle: 'Ayurvedic tridosha assessment',
        options: [
          { id: 'vata_prakriti', label: 'Vata Dominant (Light build, dry skin, active mind, irregular digestion)', icon: 'Wind', weight: { vata: 60 } },
          { id: 'pitta_prakriti', label: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp focus)', icon: 'Flame', weight: { pitta: 60 } },
          { id: 'kapha_prakriti', label: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady endurance)', icon: 'User', weight: { kapha: 60 } }
        ]
      },
      {
        id: 'ayush_agni',
        title: 'Step 2: Digestive Fire Capacity (Agni Pariksha)',
        subtitle: 'Metabolic capacity evaluation',
        options: [
          { id: 'samagni', label: 'Sama Agni (Normal, smooth digestion without acidity or bloating)', icon: 'CheckCircle2', weight: { balanced: 50 } },
          { id: 'mandagni', label: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)', icon: 'Activity', weight: { kapha: 35 } },
          { id: 'tikshnagni', label: 'Tikshna Agni (Hyperactive digestion, frequent burning hunger, heartburn)', icon: 'Flame', weight: { pitta: 45 } }
        ]
      }
    ]
  },
  routine_checkup: {
    id: 'routine_checkup',
    name: 'Routine OPD General Checkup Decision Tree',
    steps: [
      {
        id: 'routine_purpose',
        title: 'Step 1: What is the primary purpose of today\'s visit?',
        subtitle: 'General preventive OPD checkup',
        options: [
          { id: 'general_wellness', label: 'General Health & Vital Screening (BP, Sugar, Weight)', icon: 'CheckCircle2', weight: { routine: 60 } },
          { id: 'med_refill', label: 'Routine Prescription Medication Refill / Follow-up', icon: 'Activity', weight: { routine: 50 } },
          { id: 'blood_report_review', label: 'Reviewing Pathology Blood / Lab Test Reports', icon: 'User', weight: { routine: 50 } }
        ]
      }
    ]
  }
};

class DecisionTreeEngine {
  /**
   * Get Decision Tree for a specific symptom category
   */
  getTreeForCategory(categoryId = 'routine_checkup') {
    return DECISION_TREES[categoryId] || DECISION_TREES.routine_checkup;
  }

  /**
   * Universal Differential Diagnosis & Red-Flag Evaluator for ANY category
   */
  evaluateTree(categoryId = 'chest_pain', treeAnswers = {}, vitals = {}) {
    if (categoryId === 'chest_pain') {
      return this.evaluateChestPainTree(treeAnswers, vitals);
    }

    const treeConfig = this.getTreeForCategory(categoryId);
    const redFlags = [];
    let riskPercentage = 15;
    let isRedFlag = false;

    // Scan for red flags across selected options
    treeConfig.steps.forEach(step => {
      const selected = treeAnswers[step.id];
      if (!selected) return;

      const selectedIds = Array.isArray(selected) ? selected : [selected];
      step.options.forEach(opt => {
        if (selectedIds.includes(opt.id)) {
          if (opt.isRedFlag) {
            isRedFlag = true;
            riskPercentage += 25;
            redFlags.push(opt.label);
          }
        }
      });
    });

    // Check vital telemetry
    const spo2 = vitals.spo2_percent || 98;
    if (spo2 < 90) {
      isRedFlag = true;
      riskPercentage += 35;
      redFlags.push(`Critical Hypoxia: SpO2 ${spo2}%`);
    }

    const temp = vitals.temperature_c || 37.0;
    if (temp >= 39.0) {
      riskPercentage += 15;
      redFlags.push(`High Fever: ${temp}°C`);
    }

    riskPercentage = Math.min(95, Math.max(10, riskPercentage));
    const priority = isRedFlag ? 'RED_FLAG_CRITICAL' : riskPercentage >= 35 ? 'URGENT' : 'ROUTINE';

    // Differentials list per category
    let differentials = [];
    if (categoryId === 'fever') {
      differentials = [
        { name: 'Acute Viral Pyrexia / Influenza', probability: 55, riskLevel: 'MODERATE', action: 'Antipyretics & Hydration' },
        { name: 'Malaria / Vector-Borne Infection', probability: 25, riskLevel: 'MODERATE', action: 'Peripheral Blood Smear / Rapid Antigen Test' },
        { name: 'Bacterial Pharyngitis / Chest Infection', probability: 20, riskLevel: 'LOW', action: 'CBC & Physical Exam' }
      ];
    } else if (categoryId === 'abdominal') {
      differentials = [
        { name: 'Gastritis / Peptic Acid Reflux', probability: 50, riskLevel: 'LOW', action: 'Oral Antacids & Diet Control' },
        { name: 'Acute Gastroenteritis / Food Intolerance', probability: 30, riskLevel: 'MODERATE', action: 'ORS Rehydration & Spasmolytics' },
        { name: 'Acute Appendicitis / Surgical Abdomen', probability: 20, riskLevel: isRedFlag ? 'HIGH_CRITICAL' : 'LOW', action: 'USG Abdomen & Surgical Triage' }
      ];
    } else if (categoryId === 'respiratory') {
      differentials = [
        { name: 'Acute Bronchial Asthma Exacerbation', probability: 45, riskLevel: 'MODERATE', action: 'Nebulization & Auscultation' },
        { name: 'Acute Bronchitis / Lower Respiratory Infection', probability: 35, riskLevel: 'MODERATE', action: 'Chest X-Ray & Sputum Culture' },
        { name: 'COPD Exacerbation / Acute Heart Failure', probability: 20, riskLevel: isRedFlag ? 'HIGH_CRITICAL' : 'LOW', action: '12-Lead ECG & SpO2 Monitoring' }
      ];
    } else if (categoryId === 'headache') {
      differentials = [
        { name: 'Tension Type Muscle Contraction Headache', probability: 55, riskLevel: 'LOW', action: 'Rest & Analgesic Relief' },
        { name: 'Acute Migraine with Vascular Aura', probability: 30, riskLevel: 'MODERATE', action: 'Triptan / Dark Room Rest' },
        { name: 'Subarachnoid Hemorrhage / Stroke Red Flag', probability: 15, riskLevel: isRedFlag ? 'HIGH_CRITICAL' : 'LOW', action: 'STAT Non-Contrast Brain CT' }
      ];
    } else {
      differentials = [
        { name: 'Routine Physical Wellness & Vitals Clearance', probability: 85, riskLevel: 'ROUTINE', action: 'Routine Doctor Consultation' },
        { name: 'Lifestyle / Preventive Diet Counseling', probability: 15, riskLevel: 'ROUTINE', action: 'Preventive Health Assessment' }
      ];
    }

    return {
      priority,
      isRedFlag,
      riskPercentage,
      redFlags: Array.from(new Set(redFlags)),
      differentials,
      recommendation: isRedFlag
        ? 'IMMEDIATE TRIAGE: High-risk clinical red flag detected. Route to Nursing Station immediately.'
        : 'Routine OPD Evaluation: Proceed with standard doctor consultation.'
    };
  }

  evaluateChestPainTree(treeAnswers = {}, vitals = {}) {
    let acsScore = 0;
    let gerdScore = 0;
    let pleuriticScore = 0;
    let musculoskeletalScore = 0;
    const redFlags = [];

    const char = treeAnswers.chest_character;
    const rad = treeAnswers.chest_radiation;
    const trig = treeAnswers.chest_triggers;
    const assoc = treeAnswers.chest_associated || [];

    // Character
    if (char === 'crushing_pressure') {
      acsScore += 40;
      redFlags.push('Squeezing Crushing Chest Pressure (High Ischemia Indicator)');
    } else if (char === 'sharp_stabbing') {
      pleuriticScore += 35;
      musculoskeletalScore += 25;
    } else if (char === 'substernal_burning') {
      gerdScore += 45;
    } else if (char === 'chest_wall_soreness') {
      musculoskeletalScore += 55;
    }

    // Radiation
    if (rad === 'rad_arm_jaw_neck') {
      acsScore += 40;
      redFlags.push('Radiation to Left Arm / Jaw / Neck (Classic ACS Indicator)');
    } else if (rad === 'rad_back') {
      acsScore += 20;
      pleuriticScore += 15;
      redFlags.push('Radiation to Upper Back (Aortic / Ischemic Alert)');
    } else if (rad === 'rad_epigastric') {
      gerdScore += 25;
      acsScore += 15;
    }

    // Triggers
    if (trig === 'trig_exertion') {
      acsScore += 30;
      redFlags.push('Chest Pain Exertional Onset (Angina / Ischemia)');
    } else if (trig === 'trig_breathing_cough') {
      pleuriticScore += 45;
    } else if (trig === 'trig_fatty_food') {
      gerdScore += 35;
    } else if (trig === 'trig_body_movement') {
      musculoskeletalScore += 45;
    }

    // Associated Symptoms
    if (assoc.includes('assoc_sweating')) {
      acsScore += 25;
      redFlags.push('Profuse Cold Sweating (Diaphoresis)');
    }
    if (assoc.includes('assoc_dyspnea')) {
      acsScore += 20;
      pleuriticScore += 20;
      redFlags.push('Acute Respiratory Distress / Air Hunger');
    }
    if (assoc.includes('assoc_dizziness')) {
      acsScore += 15;
      redFlags.push('Cardiovascular Syncope / Hypoperfusion Tendency');
    }

    // Vitals modifier
    const spo2 = vitals.spo2_percent || 98;
    if (spo2 < 90) {
      acsScore += 30;
      redFlags.push(`Critical Hypoxia: SpO2 ${spo2}%`);
    }

    const totalRaw = Math.max(1, acsScore + gerdScore + pleuriticScore + musculoskeletalScore);
    const acsProb = Math.min(95, Math.round((acsScore / totalRaw) * 100));
    const gerdProb = Math.round((gerdScore / totalRaw) * 100);
    const pleuriticProb = Math.round((pleuriticScore / totalRaw) * 100);
    const musculoProb = Math.round((musculoskeletalScore / totalRaw) * 100);

    const isRedFlag = acsProb >= 50 || redFlags.length >= 2;
    const priority = isRedFlag ? 'RED_FLAG_CRITICAL' : acsProb >= 30 ? 'URGENT' : 'ROUTINE';

    const differentials = [
      {
        name: 'Acute Coronary Syndrome (ACS / Angina / MI)',
        probability: acsProb,
        riskLevel: acsProb >= 60 ? 'HIGH_CRITICAL' : acsProb >= 35 ? 'MODERATE' : 'LOW',
        action: acsProb >= 40 ? 'Urgent 12-Lead ECG & Troponin STAT' : 'Routine Cardiac Check'
      },
      {
        name: 'Gastroesophageal Reflux (GERD) / Acid Gastritis',
        probability: gerdProb,
        riskLevel: gerdProb >= 50 ? 'MODERATE' : 'LOW',
        action: 'Oral Antacids / Proton Pump Inhibitor'
      },
      {
        name: 'Pleuritic / Pulmonary Pathologies (Pneumonia/Pleurisy)',
        probability: pleuriticProb,
        riskLevel: pleuriticProb >= 40 ? 'MODERATE' : 'LOW',
        action: 'Chest X-Ray & Auscultation'
      },
      {
        name: 'Musculoskeletal Chest Wall Soreness / Costochondritis',
        probability: musculoProb,
        riskLevel: 'LOW',
        action: 'Local Warm Compress / NSAID Analgesic'
      }
    ].sort((a, b) => b.probability - a.probability);

    return {
      priority,
      isRedFlag,
      riskPercentage: acsProb,
      redFlags: Array.from(new Set(redFlags)),
      differentials,
      recommendation: isRedFlag 
        ? 'IMMEDIATE CARDIAC TRIAGE: Perform 12-Lead ECG, administer Oxygen if SpO2 < 94%, and notify OPD Physician STAT.' 
        : 'Routine OPD Evaluation: Complete physical exam and baseline diagnostic workup.'
    };
  }
}

export const decisionTreeEngine = new DecisionTreeEngine();
