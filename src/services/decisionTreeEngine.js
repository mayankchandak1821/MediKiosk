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
    name_hi: 'हृदय एवं सीने के दर्द का निर्णय वृक्ष',
    steps: [
      {
        id: 'chest_character',
        title: 'Step 1: What is the exact sensation of the chest discomfort?',
        title_hi: 'चरण 1: सीने में दर्द की सही अनुभूति क्या है?',
        subtitle: 'Select primary character of chest pain',
        subtitle_hi: 'सीने में दर्द के प्राथमिक प्रकार का चयन करें',
        options: [
          { id: 'crushing_pressure', label: 'Crushing Heavy Pressure / Tight Band / Heavy Weight', label_hi: 'दबाव भरा भारीपन / कसता हुआ बैंड / भारी वजन महसूस होना', icon: 'Heart', isRedFlag: true, weight: { acs: 40, gerd: 5, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'sharp_stabbing', label: 'Sharp Stabbing / Knife-like Pain', label_hi: 'तेज चुभन वाला / चाकू जैसा तेज दर्द', icon: 'Activity', weight: { acs: 10, gerd: 10, pleuritic: 40, musculoskeletal: 25 } },
          { id: 'substernal_burning', label: 'Substernal Burning / Acid Reflux / Heartburn', label_hi: 'सीने के बीच में जलन / एसिड रिफ्लक्स / एसिडिटी', icon: 'Flame', weight: { acs: 10, gerd: 50, pleuritic: 5, musculoskeletal: 5 } },
          { id: 'chest_wall_soreness', label: 'Localized Tenderness / Pain When Pressing Chest Wall', label_hi: 'सीने की दीवार को दबाने पर दर्द / मांसपेशियों का खिंचाव', icon: 'User', weight: { acs: 0, gerd: 5, pleuritic: 15, musculoskeletal: 60 } }
        ]
      },
      {
        id: 'chest_radiation',
        title: 'Step 2: Does the chest pain spread (radiate) to other body areas?',
        title_hi: 'चरण 2: क्या सीने का दर्द शरीर के अन्य हिस्सों में फैलता है?',
        subtitle: 'Check for radiation patterns characteristic of myocardial ischemia',
        subtitle_hi: 'हृदय घात (मायोकार्डियल इस्किमिया) के लक्षणों की जांच करें',
        options: [
          { id: 'rad_arm_jaw_neck', label: 'Radiates to Left Arm, Shoulder, Jaw, or Neck', label_hi: 'बायें हाथ, कंधे, जबड़े या गर्दन की तरफ फैलता है', icon: 'ShieldAlert', isRedFlag: true, weight: { acs: 45, gerd: 0, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'rad_back', label: 'Radiates straight through to the Upper Back / Interscapular area', label_hi: 'पीछे पीठ / कंधों के बीच सीधे फैलता है', icon: 'AlertTriangle', isRedFlag: true, weight: { acs: 25, gerd: 10, pleuritic: 10, musculoskeletal: 10 } },
          { id: 'rad_epigastric', label: 'Spreads down towards Upper Stomach / Epigastrium', label_hi: 'ऊपरी पेट की तरफ नीचे फैलता है', icon: 'Activity', weight: { acs: 20, gerd: 35, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'rad_none', label: 'Does NOT spread (Stays localized in one small spot)', label_hi: 'कही नहीं फैलता (एक ही स्थान पर सीमित रहता है)', icon: 'CheckCircle2', weight: { acs: 0, gerd: 10, pleuritic: 20, musculoskeletal: 30 } }
        ]
      },
      {
        id: 'chest_triggers',
        title: 'Step 3: What worsens or triggers the chest pain?',
        title_hi: 'चरण 3: किस गतिविधि से दर्द बढ़ता या ट्रिगर होता है?',
        subtitle: 'Aggravating and relieving factor evaluation',
        subtitle_hi: 'दर्द को बढ़ाने और घटाने वाले कारकों का मूल्यांकन',
        options: [
          { id: 'trig_exertion', label: 'Worse with Physical Exertion, Walking, or Climbing Stairs', label_hi: 'शारीरिक परिश्रम, चलने या सीढ़ियां चढ़ने से दर्द बढ़ता है', icon: 'Activity', isRedFlag: true, weight: { acs: 35, gerd: 0, pleuritic: 0, musculoskeletal: 5 } },
          { id: 'trig_breathing_cough', label: 'Worse with Deep Inspiration, Breathing, or Coughing', label_hi: 'गहरी सांस लेने, छींकने या खांसने से बढ़ता है', icon: 'Wind', weight: { acs: 5, gerd: 0, pleuritic: 50, musculoskeletal: 20 } },
          { id: 'trig_fatty_food', label: 'Worse after Fatty Meals or Lying Down Flat', label_hi: 'तला-भुना खाने या सीधे लेटने से बढ़ता है', icon: 'Flame', weight: { acs: 5, gerd: 45, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'trig_body_movement', label: 'Worse with Arm Movement or Twisting Torso', label_hi: 'हाथ हिलाने या धड़ को मोड़ने से दर्द बढ़ता है', icon: 'User', weight: { acs: 0, gerd: 0, pleuritic: 10, musculoskeletal: 50 } }
        ]
      },
      {
        id: 'chest_associated',
        title: 'Step 4: Are you experiencing any accompanying emergency symptoms?',
        title_hi: 'चरण 4: क्या आपको इनमें से कोई गंभीर आपातकालीन लक्षण महसूस हो रहे हैं?',
        subtitle: 'Multi-system autonomic indicator check',
        subtitle_hi: 'बहु-प्रणाली स्वायत्त आपातकालीन संकेतों की जांच करें',
        isMultiSelect: true,
        options: [
          { id: 'assoc_sweating', label: 'Profuse Cold Sweating (Diaphoresis)', label_hi: 'अत्यधिक ठंडा पसीना आना (डाइफोरेसिस)', isRedFlag: true, weight: { acs: 25, gerd: 0, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'assoc_dyspnea', label: 'Severe Shortness of Breath / Air Hunger', label_hi: 'सांस लेने में भारी तकलीफ / हवा की कमी महसूस होना', isRedFlag: true, weight: { acs: 25, gerd: 0, pleuritic: 25, musculoskeletal: 0 } },
          { id: 'assoc_nausea_vomiting', label: 'Nausea or Vomiting', label_hi: 'उल्टी या मिचली (जी मिचलाना)', weight: { acs: 15, gerd: 20, pleuritic: 0, musculoskeletal: 0 } },
          { id: 'assoc_dizziness', label: 'Dizziness / Lightheadedness / Fainting tendency', label_hi: 'चक्कर आना / बेहोशी की स्थिति बनना', isRedFlag: true, weight: { acs: 20, gerd: 0, pleuritic: 0, musculoskeletal: 0 } }
        ]
      }
    ]
  },
  fever: {
    id: 'fever',
    name: 'Infectious & Pyrexia Decision Tree',
    name_hi: 'बुखार एवं संक्रमण निर्णय वृक्ष',
    steps: [
      {
        id: 'fever_pattern',
        title: 'Step 1: What is the temperature pattern and onset?',
        title_hi: 'चरण 1: बुखार का पैटर्न और शुरुआत कैसी है?',
        subtitle: 'Fever spike frequency and chills evaluation',
        subtitle_hi: 'बुखार का स्तर और कंपकंपी की जांच करें',
        options: [
          { id: 'spiking_chills', label: 'High Spiking Fever (>102°F) with Shaking Chills & Rigors', label_hi: 'कंपकंपी और ठंड के साथ तेज बुखार (>102°F)', icon: 'Thermometer', isRedFlag: true, weight: { malaria: 45, bacterial: 35, dengue: 20 } },
          { id: 'continuous_moderate', label: 'Continuous Moderate Fever (99°F - 101°F)', label_hi: 'लगातार हल्का या मध्यम बुखार (99°F - 101°F)', icon: 'Activity', weight: { viral: 45, bacterial: 25, malaria: 10 } },
          { id: 'low_grade_night_sweats', label: 'Low-Grade Evening Spikes with Profuse Night Sweats', label_hi: 'शाम को बुखार चढ़ना और रात में अत्यधिक पसीना आना', icon: 'Flame', weight: { tb: 50, chronic: 35, viral: 15 } }
        ]
      },
      {
        id: 'fever_focal_symptoms',
        title: 'Step 2: Which organ systems show focal infection symptoms?',
        title_hi: 'चरण 2: शरीर के किस अंग में संक्रमण के लक्षण दिख रहे हैं?',
        subtitle: 'Anatomical symptom localization',
        subtitle_hi: 'संक्रमण के स्थान की पहचान करें',
        isMultiSelect: true,
        options: [
          { id: 'focal_throat', label: 'Severe Sore Throat / Painful Swallowing', label_hi: 'गले में तेज दर्द / निगलने में तकलीफ', icon: 'Activity', weight: { pharyngitis: 45 } },
          { id: 'focal_cough_phlegm', label: 'Persistent Cough with Yellow/Green Phlegm', label_hi: 'लगातार खांसी के साथ पीला/हरा बलगम', icon: 'Wind', weight: { pneumonia: 45 } },
          { id: 'focal_urinary', label: 'Burning Sensation while Urinating / High Frequency', label_hi: 'पेशाब में जलन / बार-बार पेशाब जाना', icon: 'Activity', weight: { uti: 50 } },
          { id: 'focal_joint_eye', label: 'Severe Joint/Muscle Pain & Pain Behind Eyes', label_hi: 'जोड़ों व मांसपेशियों में तेज दर्द और आंखों के पीछे दर्द', icon: 'ShieldAlert', weight: { dengue: 50 } }
        ]
      }
    ]
  },
  abdominal: {
    id: 'abdominal',
    name: 'Gastrointestinal & Abdominal Pain Decision Tree',
    name_hi: 'पेट दर्द एवं पाचन तंत्र निर्णय वृक्ष',
    steps: [
      {
        id: 'abdo_location',
        title: 'Step 1: Where in the abdomen is the pain located?',
        title_hi: 'चरण 1: पेट में दर्द किस हिस्से में महसूस हो रहा है?',
        subtitle: 'Abdominal quadrant localization',
        subtitle_hi: 'पेट दर्द के क्षेत्र का चयन करें',
        options: [
          { id: 'epigastric', label: 'Upper Stomach / Epigastrium (Acid Reflux / Stomach)', label_hi: 'ऊपरी पेट / नाभि के ऊपर (एसिडिटी / जलन)', icon: 'Flame', weight: { gerd: 45, gastritis: 45 } },
          { id: 'ruq', label: 'Right Upper Quadrant (Under Right Rib Cage)', label_hi: 'दाहिनी पसली के नीचे (पित्ताशय / यकृत क्षेत्र)', icon: 'Activity', weight: { cholecystitis: 50 } },
          { id: 'rlq', label: 'Right Lower Quadrant (Near Right Hip Bone)', label_hi: 'दाहिनी तरफ नीचे पेट में (अपेंडिक्स क्षेत्र)', icon: 'ShieldAlert', isRedFlag: true, weight: { appendicitis: 55 } },
          { id: 'generalized_cramps', label: 'Diffuse Cramps & Bloating all over Stomach', label_hi: 'पूरे पेट में मरोड़, ऐंठन और गैस भर जाना', icon: 'User', weight: { gastroenteritis: 45 } }
        ]
      },
      {
        id: 'abdo_red_flags',
        title: 'Step 2: Are you experiencing any severe GI red flags?',
        title_hi: 'चरण 2: क्या आपको इनमें से कोई गंभीर आपातकालीन लक्षण हैं?',
        subtitle: 'Internal bleeding and peritonitis screening',
        subtitle_hi: 'आंतरिक रक्तस्राव और गंभीर पेट संक्रमण की जांच',
        isMultiSelect: true,
        options: [
          { id: 'abdo_vomit_blood', label: 'Vomiting Blood or Dark Coffee-Ground Fluid', label_hi: 'उल्टी में खून या गाढ़ा भूरा तरल आना', icon: 'ShieldAlert', isRedFlag: true, weight: { gi_bleed: 50 } },
          { id: 'abdo_black_stool', label: 'Passing Black Tarry Stool (Melena)', label_hi: 'काला तारकोल जैसा मल (पखाना) आना', icon: 'AlertTriangle', isRedFlag: true, weight: { gi_bleed: 50 } },
          { id: 'abdo_rigid_stomach', label: 'Stomach is Board-Like Hard & Painful to Touch', label_hi: 'पेट लकड़ी जैसा कड़ा होना और छूने पर तेज दर्द होना', icon: 'ShieldAlert', isRedFlag: true, weight: { peritonitis: 55 } }
        ]
      }
    ]
  },
  respiratory: {
    id: 'respiratory',
    name: 'Respiratory & Breathlessness Decision Tree',
    name_hi: 'सांस फूलना एवं खांसी निर्णय वृक्ष',
    steps: [
      {
        id: 'resp_dyspnea_severity',
        title: 'Step 1: How severe is the breathing difficulty?',
        title_hi: 'चरण 1: सांस लेने में तकलीफ कितनी गंभीर है?',
        subtitle: 'Air hunger and talk test evaluation',
        subtitle_hi: 'सांस की कमी एवं बोलने की क्षमता की जांच',
        options: [
          { id: 'resp_rest_breathless', label: 'Breathless at Rest / Cannot Complete Short Sentences', label_hi: 'बैठे-बैठे सांस फूलना / पूरे वाक्य न बोल पाना', icon: 'ShieldAlert', isRedFlag: true, weight: { acute_asthma: 45, heart_failure: 35, copd: 20 } },
          { id: 'resp_exertion_only', label: 'Breathless Only when Walking or Climbing Stairs', label_hi: 'केवल चलने या सीढ़ियां चढ़ने पर सांस फूलना', icon: 'Wind', weight: { copd: 40, asthma: 30, deconditioning: 30 } },
          { id: 'resp_positional', label: 'Cannot Lie Flat in Bed without Waking Up Gasping', label_hi: 'बिना तकिये सीधे लेटने पर सांस रुकना और जागना', icon: 'Heart', isRedFlag: true, weight: { heart_failure: 50, pulmonary_edema: 40 } }
        ]
      },
      {
        id: 'resp_cough_sputum',
        title: 'Step 2: What is the cough and sputum character?',
        title_hi: 'चरण 2: खांसी और बलगम का प्रकार कैसा है?',
        subtitle: 'Auscultation & sputum analysis',
        subtitle_hi: 'खांसी की आवाज और बलगम की जांच',
        options: [
          { id: 'dry_whistling', label: 'Dry Cough with High-Pitched Whistling / Wheezing Sound', label_hi: 'सूखी खांसी के साथ सीटी जैसी आवाज (सीटी बजना)', icon: 'Wind', weight: { asthma: 50, copd: 35 } },
          { id: 'thick_yellow_green', label: 'Coughing up Thick Yellow / Green Phlegm', label_hi: 'गाढ़ा पीला या हरा बलगम निकलना', icon: 'Activity', weight: { pneumonia: 50, bronchitis: 40 } },
          { id: 'pink_frothy_blood', label: 'Coughing up Pink Frothy Sputum or Blood Spots', label_hi: 'गुलाबी झागदार बलगम या खून के धब्बे आना', icon: 'ShieldAlert', isRedFlag: true, weight: { pulmonary_edema: 50, tb: 40 } }
        ]
      }
    ]
  },
  headache: {
    id: 'headache',
    name: 'Neurological & Headache Decision Tree',
    name_hi: 'सिरदर्द एवं तंत्रिका तंत्र निर्णय वृक्ष',
    steps: [
      {
        id: 'head_onset_character',
        title: 'Step 1: What was the speed of onset and pain character?',
        title_hi: 'चरण 1: सिरदर्द की शुरुआत और प्रकृति कैसी थी?',
        subtitle: 'Intracranial pain pattern analysis',
        subtitle_hi: 'दर्द के प्रकार का विश्लेषण करें',
        options: [
          { id: 'thunderclap_sudden', label: 'Sudden "Thunderclap" Explosion (Worst Headache of Life)', label_hi: 'अचानक बिजली जैसा धमाका (जीवन का सबसे भयानक सिरदर्द)', icon: 'ShieldAlert', isRedFlag: true, weight: { sah: 60, aneurysm: 35 } },
          { id: 'one_sided_throbbing', label: 'One-Sided Throbbing Pain with Nausea & Light Sensitivity', label_hi: 'एक तरफा टपकता दर्द, मिचली और रोशनी से तकलीफ', icon: 'Activity', weight: { migraine: 55, tension: 15 } },
          { id: 'tight_band_forehead', label: 'Constant Tight Squeezing Band Around Temples & Forehead', label_hi: 'माथे और कनपटी के चारों ओर कसता हुआ तनावयुक्त दर्द', icon: 'User', weight: { tension: 60, fatigue: 30 } }
        ]
      },
      {
        id: 'head_neuro_deficits',
        title: 'Step 2: Are you experiencing any neurological red flags?',
        title_hi: 'चरण 2: क्या आपको इनमें से कोई न्यूरोलॉजिकल आपातकालीन लक्षण हैं?',
        subtitle: 'FAST stroke & meningeal sign screening',
        subtitle_hi: 'लकवा (स्ट्रोक) और दिमागी बुखार की जांच',
        isMultiSelect: true,
        options: [
          { id: 'stroke_facial_droop', label: 'Facial Droop, Arm Weakness, or Slurred Speech', label_hi: 'चेहरा टेढ़ा होना, हाथ में कमजोरी या आवाज तुतलाना', icon: 'ShieldAlert', isRedFlag: true, weight: { stroke: 60 } },
          { id: 'stiff_neck_fever', label: 'Stiff Neck + High Fever + Sensitivity to Light', label_hi: 'गर्दन में अकड़न + तेज बुखार + रोशनी से डर लगना', icon: 'ShieldAlert', isRedFlag: true, weight: { meningitis: 55 } },
          { id: 'vision_loss_double', label: 'Sudden Vision Loss, Double Vision, or Dizziness', label_hi: 'अचानक आंखों से धुंधला दिखना, दो-दो दिखना या चक्कर', icon: 'AlertTriangle', isRedFlag: true, weight: { stroke: 45 } }
        ]
      }
    ]
  },
  ayush_wellness: {
    id: 'ayush_wellness',
    name: 'AYUSH Prakriti & Dashavidha Pariksha Decision Tree',
    name_hi: 'आयुष एवं आयुर्वेदिक प्रकृति परीक्षण',
    steps: [
      {
        id: 'ayush_dosha',
        title: 'Step 1: Dominant Body Constitution (Prakriti Pariksha)',
        title_hi: 'चरण 1: आपकी मुख्य शारीरिक प्रकृति (त्रिदोष परीक्षण)',
        subtitle: 'Ayurvedic tridosha assessment',
        subtitle_hi: 'आयुर्वेदिक वात, पित्त, कफ प्रकृति निर्धारण',
        options: [
          { id: 'vata_prakriti', label: 'Vata Dominant (Light build, dry skin, active mind, irregular digestion)', label_hi: 'वात प्रधान (हल्का शरीर, रूखी त्वचा, चंचल मन, अनिश्चित पाचन)', icon: 'Wind', weight: { vata: 60 } },
          { id: 'pitta_prakriti', label: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp focus)', label_hi: 'पित्त प्रधान (मध्यम शरीर, गर्म त्वचा, तेज पाचन, एकाग्र बुद्धि)', icon: 'Flame', weight: { pitta: 60 } },
          { id: 'kapha_prakriti', label: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady endurance)', label_hi: 'कफ प्रधान (मजबूत शरीर, चिकनी त्वचा, शांत स्वभाव, सहनशीलता)', icon: 'User', weight: { kapha: 60 } }
        ]
      },
      {
        id: 'ayush_agni',
        title: 'Step 2: Digestive Fire Capacity (Agni Pariksha)',
        title_hi: 'चरण 2: जठराग्नि एवं पाचन क्षमता (अग्नि परीक्षण)',
        subtitle: 'Metabolic capacity evaluation',
        subtitle_hi: 'पाचन एवं चयापचय क्षमता का परीक्षण',
        options: [
          { id: 'samagni', label: 'Sama Agni (Normal, smooth digestion without acidity or bloating)', label_hi: 'सम अग्नि (सामान्य, सुचारू पाचन, बिना एसिडिटी के)', icon: 'CheckCircle2', weight: { balanced: 50 } },
          { id: 'mandagni', label: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)', label_hi: 'मंद अग्नि (धीमी पाचन शक्ति, खाने के बाद भारीपन, कम भूख)', icon: 'Activity', weight: { kapha: 35 } },
          { id: 'tikshnagni', label: 'Tikshna Agni (Hyperactive digestion, frequent burning hunger, heartburn)', label_hi: 'तीक्ष्ण अग्नि (अत्यधिक तीव्र भूख, सीने में जलन, तेज तेजाबियत)', icon: 'Flame', weight: { pitta: 45 } }
        ]
      }
    ]
  },
  routine_checkup: {
    id: 'routine_checkup',
    name: 'Routine OPD General Checkup Decision Tree',
    name_hi: 'सामान्य स्वास्थ्य एवं ओपीडी परामर्श',
    steps: [
      {
        id: 'routine_purpose',
        title: 'Step 1: What is the primary purpose of today\'s visit?',
        title_hi: 'चरण 1: आज के अस्पताल आगमन का मुख्य कारण क्या है?',
        subtitle: 'General preventive OPD checkup',
        subtitle_hi: 'सामान्य स्वास्थ्य परीक्षण एवं परामर्श',
        options: [
          { id: 'general_wellness', label: 'General Health & Vital Screening (BP, Sugar, Weight)', label_hi: 'सामान्य स्वास्थ्य परीक्षण (बीपी, शुगर, वजन जांच)', icon: 'CheckCircle2', weight: { routine: 60 } },
          { id: 'med_refill', label: 'Routine Prescription Medication Refill / Follow-up', label_hi: 'नियमित दवाइयों का परचा दोबारा लिखवाना / फॉलो-अप', icon: 'Activity', weight: { routine: 50 } },
          { id: 'blood_report_review', label: 'Reviewing Pathology Blood / Lab Test Reports', label_hi: 'खून व लैब जांच रिपोर्ट डॉक्टर को दिखाना', icon: 'User', weight: { routine: 50 } }
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
