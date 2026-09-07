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
    name: 'AYUSH 5-Step Diagnostic & Treatment Protocol Tree',
    name_hi: 'आयुष एवं आयुर्वेदिक 5-चरणीय निदान व उपचार प्रक्रिया',
    steps: [
      {
        id: 'ayush_dosha',
        title: 'Step 1: Prakriti Pariksha (Dominant Body Constitution)',
        title_hi: 'चरण 1: प्रकृति एवं त्रिदोष परीक्षण (शारीरिक प्रकृति)',
        subtitle: 'Baseline Ayurvedic Tridosha assessment (Vata, Pitta, Kapha)',
        subtitle_hi: 'आयुर्वेदिक वात, पित्त, कफ एवं द्वंद्वज प्रकृति निर्धारण',
        options: [
          { id: 'vata_prakriti', label: 'Vata Dominant (Light build, dry skin, active mind, irregular digestion)', label_hi: 'वात प्रधान (हल्का शरीर, रूखी त्वचा, चंचल मन, अनिश्चित पाचन)', icon: 'Wind', weight: { vata: 60 } },
          { id: 'pitta_prakriti', label: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp focus)', label_hi: 'पित्त प्रधान (मध्यम शरीर, गर्म त्वचा, तेज पाचन, एकाग्र बुद्धि)', icon: 'Flame', weight: { pitta: 60 } },
          { id: 'kapha_prakriti', label: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady endurance)', label_hi: 'कफ प्रधान (मजबूत शरीर, चिकनी त्वचा, शांत स्वभाव, सहनशीलता)', icon: 'User', weight: { kapha: 60 } },
          { id: 'dvandvaja_prakriti', label: 'Dvandvaja Prakriti (Dual Tridosha dominance - Vata-Pitta / Pitta-Kapha)', label_hi: 'द्वंद्वज प्रकृति (दो दोषों की प्रधानता - वात-पित्त / पित्त-कफ)', icon: 'Sparkles', weight: { balanced: 50 } }
        ]
      },
      {
        id: 'ayush_agni',
        title: 'Step 2: Agni & Koshtha Pariksha (Digestive Fire & Bowel)',
        title_hi: 'चरण 2: अग्नि एवं कोष्ठ परीक्षण (जठराग्नि व पेट सफाई)',
        subtitle: 'Metabolic capacity & bowel elimination pattern',
        subtitle_hi: 'पाचन अग्नि क्षमता एवं कोष्ठ की प्रकृति',
        options: [
          { id: 'samagni_madhyama', label: 'Sama Agni & Madhyama Koshtha (Balanced digestion, comfortable daily bowel)', label_hi: 'सम अग्नि एवं मध्यम कोष्ठ (संतुलित पाचन, नियमित व सुचारू पेट सफाई)', icon: 'CheckCircle2', weight: { balanced: 50 } },
          { id: 'mandagni_krura', label: 'Manda Agni & Krura Koshtha (Sluggish digestion, heaviness, hard constipation)', label_hi: 'मंद अग्नि एवं क्रूर कोष्ठ (धीमी पाचन शक्ति, भोजन बाद भारीपन, कड़ा मल)', icon: 'Activity', weight: { kapha: 40, vata: 30 } },
          { id: 'tikshnagni_mridu', label: 'Tikshna Agni & Mridu Koshtha (Hyperactive digestion, acidity, loose bowel)', label_hi: 'तीक्ष्ण अग्नि एवं मृदु कोष्ठ (अत्यधिक तीव्र भूख, एसिडिटी, ढीला मल)', icon: 'Flame', weight: { pitta: 50 } },
          { id: 'vishamagni_gas', label: 'Vishama Agni & Irregular Koshtha (Irregular unpredictable digestion & bloating)', label_hi: 'विषम अग्नि एवं अनिश्चित कोष्ठ (अनिश्चित पाचन, पेट गैस व आफरा)', icon: 'Wind', weight: { vata: 45 } }
        ]
      },
      {
        id: 'ayush_nadi',
        title: 'Step 3: Nadi & Vikriti Pariksha (Pulse & Pathology)',
        title_hi: 'चरण 3: नाड़ी एवं विकृति परीक्षण (नाड़ी गति व दोष प्रकोप)',
        subtitle: 'Pulse rhythm & Dhatu/Srotas vitiation assessment',
        subtitle_hi: 'नाड़ी की गति (सर्प, मण्डूक, हंस) एवं धातु-स्रोतस दुष्टि',
        options: [
          { id: 'nadi_sarpa_vata', label: 'Sarpa Gati Nadi (Snake Pulse / Vata Aggravation - Anxiety, Joint Pain, Insomnia)', label_hi: 'सर्प गति नाड़ी (वात प्रकोप - चंचलता, जोड़ों में दर्द, अनिद्रा)', icon: 'Wind', weight: { vata: 50 } },
          { id: 'nadi_manduka_pitta', label: 'Manduka Gati Nadi (Frog Pulse / Pitta Aggravation - Internal Heat, Acidity, Rashes)', label_hi: 'मण्डूक गति नाड़ी (पित्त प्रकोप - तेजाबियत, शरीर में जलन, चकत्ते)', icon: 'Flame', weight: { pitta: 50 } },
          { id: 'nadi_hamsa_kapha', label: 'Hamsa Gati Nadi (Swan Pulse / Kapha Aggravation - Heaviness, Mucus Congestion)', label_hi: 'हंस गति नाड़ी (कफ प्रकोप - मंद गति नाड़ी, भारीपन, बलगम)', icon: 'User', weight: { kapha: 50 } },
          { id: 'nadi_sannipata', label: 'Sannipata Nadi (Complex Tri-Dosha vitiation requiring urgent specialist Vaidya)', label_hi: 'सन्निपात नाड़ी (त्रिदोष का मिश्रित प्रकोप, विशेषज्ञ वैद्य परामर्श आवश्यक)', icon: 'AlertTriangle', isRedFlag: false, weight: { vata: 30, pitta: 30, kapha: 30 } }
        ]
      },
      {
        id: 'ayush_ahara',
        title: 'Step 4: Ahara-Vihara Routine (Diet & Lifestyle)',
        title_hi: 'चरण 4: आहार-विहार एवं दिनचर्या (खान-पान व जीवनशैली)',
        subtitle: 'Nutritional habits, sleep cycle & physical activity routine',
        subtitle_hi: 'आहार के गुण, रात्रि जागरण एवं शारीरिक गतिविधि का मूल्यांकन',
        options: [
          { id: 'ahara_sattvic', label: 'Sattvic Ahara & Synchronized Dinacharya (Fresh warm food, early sleep, yoga)', label_hi: 'सात्विक आहार एवं नियमित दिनचर्या (ताजा सुपाच्य भोजन, सही समय निद्रा)', icon: 'CheckCircle2', weight: { balanced: 50 } },
          { id: 'ahara_ushna_spicy', label: 'Excessive Spicy, Deep-Fried, Acidic Diet & Tea/Coffee', label_hi: 'अत्यधिक तीखा, तला हुआ व अमलीय भोजन (मिर्च-मसाला, चाय-कॉफी)', icon: 'Flame', weight: { pitta: 40 } },
          { id: 'ahara_irregular_night', label: 'Irregular Meal Timings, Suppressing Urges & Late Night Awake', label_hi: 'असमय भोजन, वेग धारण (मल-मूत्र रोकना) एवं देर रात तक जागना', icon: 'Wind', weight: { vata: 40 } },
          { id: 'ahara_heavy_sedentary', label: 'Heavy Cold Processed Food & Lack of Physical Exercise', label_hi: 'भारी ठंडा बासी भोजन एवं व्यायाम की कमी (दिन में सोना, जंक फूड)', icon: 'Activity', weight: { kapha: 40 } }
        ]
      },
      {
        id: 'ayush_chikitsa',
        title: 'Step 5: Chikitsa & Panchakarma Protocol (Treatment Plan)',
        title_hi: 'चरण 5: चिकित्सा एवं पंचकर्म उपचार योजना (उपचार विधान)',
        subtitle: 'Personalised Ayurvedic therapy (Deepana-Pachana, Shamana, Shodhana & Rasayana)',
        subtitle_hi: 'व्यक्तिगत उपचार योजना (दीपन-पाचन, शमन, पंचकर्म एवं रसायन)',
        options: [
          { id: 'chikitsa_shamana', label: 'Shamana Chikitsa (Dosha pacifying oral herbal medicine: Samshamani Vati, Giloy)', label_hi: 'शमन चिकित्सा (दोषों को शांत करने वाली आंतरिक जड़ी-बूटी औषधियां)', icon: 'Stethoscope', weight: { balanced: 40 } },
          { id: 'chikitsa_deepana_pachana', label: 'Deepana & Pachana Protocol (Bio-fire stimulation: Trikatu, Chitrakadi Vati)', label_hi: 'दीपन-पाचन उपचार (पाचकाग्नि दीप्त करने एवं आम-दोष निवारण हेतु)', icon: 'Flame', weight: { kapha: 35, pitta: 35 } },
          { id: 'chikitsa_panchakarma', label: 'Panchakarma Detox Triage (Virechana / Basti / Nasyam bio-cleansing therapy)', label_hi: 'पंचकर्म शोधन चिकित्सा (शरीर के विषैले तत्वों का निष्कासन - विरेचन/वस्ति)', icon: 'Sparkles', weight: { vata: 40, pitta: 40 } },
          { id: 'chikitsa_rasayana', label: 'Rasayana & Ojas Rejuvenation (Immunity booster: Chyawanprash, Ashwagandha)', label_hi: 'रसायन एवं ओज संवर्धन (रोग प्रतिरोधक क्षमता एवं नया ओज-बल संचार)', icon: 'CheckCircle2', weight: { balanced: 50 } }
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
    } else if (categoryId === 'ayush_wellness') {
      const dosha = treeAnswers.ayush_dosha;
      const agni = treeAnswers.ayush_agni;
      const nadi = treeAnswers.ayush_nadi;
      const ahara = treeAnswers.ayush_ahara;
      const chikitsa = treeAnswers.ayush_chikitsa;

      const isPitta = dosha === 'pitta_prakriti' || agni === 'tikshnagni_mridu' || nadi === 'nadi_manduka_pitta' || ahara === 'ahara_ushna_spicy';
      const isVata = dosha === 'vata_prakriti' || agni === 'vishamagni_gas' || nadi === 'nadi_sarpa_vata' || ahara === 'ahara_irregular_night';
      const isKapha = dosha === 'kapha_prakriti' || agni === 'mandagni_krura' || nadi === 'nadi_hamsa_kapha' || ahara === 'ahara_heavy_sedentary';

      const needsPanchakarma = chikitsa === 'chikitsa_panchakarma' || nadi === 'nadi_sannipata';
      const needsDeepana = chikitsa === 'chikitsa_deepana_pachana' || agni === 'mandagni_krura';

      differentials = [
        {
          name: isPitta ? 'Step 1-3: Pitta-Pradhana Agnimandya / Tikshnagni (Internal Heat & Acidity)' :
                isVata ? 'Step 1-3: Vata-Pradhana Vishamagni & Krura Koshtha (Dryness, Gas & Irregular Digestion)' :
                'Step 1-3: Kapha-Pradhana Mandagni (Sluggish Metabolism, Mucus & Body Heaviness)',
          probability: 50,
          riskLevel: 'AYUSH_CHIKITSA',
          action: isPitta ? 'Deepana-Pachana & Pitta Shamana Ahara (Shatavari, Avipattikar)' :
                  isVata ? 'Vata Shamana, Snehana & Anulomana Herbs (Dashamoola, Eranda)' :
                  'Langhana & Kapha-Hara Triphala Decoction (Trikatu, Kanchanar)'
        },
        {
          name: needsPanchakarma ? 'Step 5: Panchakarma Shodhana Detoxification Triage Protocol' :
                needsDeepana ? 'Step 5: Deepana-Pachana Ama Digestant & Agni Activation' :
                'Step 5: Shamana Chikitsa & Tridosha Pacifying Herbal Regimen',
          probability: 30,
          riskLevel: needsPanchakarma ? 'PANCHAKARMA_TRIAGE' : 'AYUSH_CHIKITSA',
          action: needsPanchakarma ? 'Vaidya Referral for Virechana / Basti Therapy' :
                  needsDeepana ? 'Trikatu & Chitrakadi Vati prior to meals' :
                  'Samshamani Vati & Giloy Ghan Vati'
        },
        {
          name: 'Step 4: Pathya-Apathya Ahara, Dinacharya & Rasayana Ojas Enhancement',
          probability: 20,
          riskLevel: 'PREVENTIVE',
          action: 'Sattvic Ahara, Warm Hydration & Ashwagandha / Chyawanprash'
        }
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

export const TREE_TRANSLATIONS = {
  // --- CHEST PAIN ---
  chest_character: {
    title: {
      en: 'Step 1: What is the exact sensation of the chest discomfort?',
      hi: 'चरण 1: सीने में दर्द की सही अनुभूति क्या है?',
      ta: 'படி 1: நெஞ்சு அசௌகரியத்தின் துல்லியமான உணர்வு என்ன?',
      te: 'దశ 1: ఛాతీ అసౌకర్యం యొక్క ఖచ్చితమైన అనుభూతి ఏమిటి?',
      mr: 'टप्पा 1: छातीत होणाऱ्या त्रासाची नेमकी अनुभूती काय आहे?',
      bn: 'ধাপ ১: বুকের অস্বস্তির সঠিক অনুভূতি কী?'
    },
    subtitle: {
      en: 'Select primary character of chest pain',
      hi: 'सीने में दर्द के प्राथमिक प्रकार का चयन करें',
      ta: 'மார்பு வலியின் முதன்மை தன்மையைத் தேர்ந்தெடுக்கவும்',
      te: 'ఛాతీ నొప్పి యొక్క ప్రాథమిక రకాన్ని ఎంచుకోండి',
      mr: 'छातीतील वेदनेचा प्राथमिक प्रकार निवडा',
      bn: 'বুকের ব্যথার প্রাথমিক ধরন নির্বাচন করুন'
    }
  },
  crushing_pressure: {
    en: 'Crushing Heavy Pressure / Tight Band / Heavy Weight',
    hi: 'दबाव भरा भारीपन / कसता हुआ बैंड / भारी वजन महसूस होना',
    ta: 'அழுத்தும் பாரமான உணர்வு / இறுக்கமான பட்டை / பாரம்',
    te: 'నలిపివేసే బరువు / బిగుతుగా ఉన్న బ్యాండ్ / బరువు महसूस కావడం',
    mr: 'दाबावयुक्त जडपणा / घट्ट पट्टा / जड वजन जाणवणे',
    bn: 'পেষণকারী ভারী চাপ / টাইট ব্যান্ড / ভারী ওজন অনুভব'
  },
  sharp_stabbing: {
    en: 'Sharp Stabbing / Knife-like Pain',
    hi: 'तेज चुभन वाला / चाकू जैसा तेज दर्द',
    ta: 'கூர்மையான குத்தும் வலி / கத்தி போன்ற வலி',
    te: 'తీవ్రమైన గుచ్చుకునే నొప్పి / కత్తి లాంటి నొప్పి',
    mr: 'तीव्र टोचणारी वेदना / सुरीसारखी कळा',
    bn: 'তীব্র সূঁচ ফোটানোর মতো / ছুরির মতো তীব্র ব্যথা'
  },
  substernal_burning: {
    en: 'Substernal Burning / Acid Reflux / Heartburn',
    hi: 'सीने के बीच में जलन / एसिड रिफ्लक्स / एसिडिटी',
    ta: 'மார்பின் நடுவில் எரிச்சல் / அமில ரிஃப்ளக்ஸ்',
    te: 'ఛాతీ మధ్యలో మంట / యాసిడ్ రిఫ్లక్స్ / గుండెల్లో మంట',
    mr: 'छातीच्या मध्यभागी जळजळ / ॲसिडिटी',
    bn: 'বুকের মাঝে জ্বালাপোড়া / এসিডিটি / অম্বল'
  },
  chest_wall_soreness: {
    en: 'Localized Tenderness / Pain When Pressing Chest Wall',
    hi: 'सीने की दीवार को दबाने पर दर्द / मांसपेशियों का खिंचाव',
    ta: 'மார்பை அழுத்தும் போது வலி / தசை பிடிப்பு',
    te: 'ఛాతీపై నొక్కినప్పుడు నొప్పి / కండరాల నొప్పులు',
    mr: 'छातीवर दाबल्यावर होणारी वेदना / स्नायूंचा ताण',
    bn: 'বুকে চাপ দিলে ব্যথা / পেশীর টান'
  },
  chest_radiation: {
    title: {
      en: 'Step 2: Does the chest pain spread (radiate) to other body areas?',
      hi: 'चरण 2: क्या सीने का दर्द शरीर के अन्य हिस्सों में फैलता है?',
      ta: 'படி 2: மார்பு வலி உடலின் பிற பகுதிகளுக்கு பரவுகிறதா?',
      te: 'దశ 2: ఛాతీ నొప్పి శరీరంలోని ఇతర భాగాలకు వ్యాపిస్తుందా?',
      mr: 'टप्पा 2: छातीतील वेदना शरीराच्या इतर भागांत पसरते का?',
      bn: 'ধাপ ২: বুকের ব্যথা কি শরীরের অন্যান্য অংশে ছড়িয়ে পড়ে?'
    },
    subtitle: {
      en: 'Check for radiation patterns characteristic of myocardial ischemia',
      hi: 'हृदय घात (मायोकार्डियल इस्किमिया) के लक्षणों की जांच करें',
      ta: 'இதய பாதிப்பின் அறிகுறிகளை சரிபார்க்கவும்',
      te: 'గుండెపోటు లక్షణాలను తనిఖీ చేయండి',
      mr: 'हृदयविकाराच्या लक्षणांची तपासणी करा',
      bn: 'হৃদরোগের লক্ষণ পরীক্ষা করুন'
    }
  },
  rad_arm_jaw_neck: {
    en: 'Radiates to Left Arm, Shoulder, Jaw, or Neck',
    hi: 'बायें हाथ, कंधे, जबड़े या गर्दन की तरफ फैलता है',
    ta: 'இடது கை, தோள், தாடை அல்லது கழுத்துக்கு பரவுகிறது',
    te: 'ఎడమ చేయి, భుజం, దవడ లేదా మెడకు వ్యాపిస్తుంది',
    mr: 'डावा हात, खांदा, नाडी किंवा मानेकडे पसरते',
    bn: 'বাম হাত, কাঁধ, চোয়াল বা ঘাড়ে ছড়িয়ে পড়ে'
  },
  rad_back: {
    en: 'Radiates straight through to the Upper Back / Interscapular area',
    hi: 'पीछे पीठ / कंधों के बीच सीधे फैलता है',
    ta: 'முதுகின் மேல் பகுதிக்கு நேரடி பரவல்',
    te: 'వెనుక వీపు / భుజాల మధ్యలోకి నేరుగా వ్యాపిస్తుంది',
    mr: 'पाठीच्या वरच्या भागात सरळ पसरते',
    bn: 'পিঠের ওপরের অংশে ছড়িয়ে পড়ে'
  },
  rad_epigastric: {
    en: 'Spreads down towards Upper Stomach / Epigastrium',
    hi: 'ऊपरी पेट की तरफ नीचे फैलता है',
    ta: 'மேல் வயிற்றை நோக்கி கீழே பரவுகிறது',
    te: 'పై కడుపు వైపు కిందికి వ్యాపిస్తుంది',
    mr: 'वरच्या पोटाकडे खाली पसरते',
    bn: 'উপরের পেটের দিকে ছড়িয়ে পড়ে'
  },
  rad_none: {
    en: 'Does NOT spread (Stays localized in one small spot)',
    hi: 'कही नहीं फैलता (एक ही स्थान पर सीमित रहता है)',
    ta: 'பரவவில்லை (ஒரே இடத்தில் மட்டுமே உள்ளது)',
    te: 'వ్యాపించదు (ఒకే చోట స్థానికంగా ఉంటుంది)',
    mr: 'पसरत नाही (एकाच ठिकाणी मर्यादित राहते)',
    bn: 'ছড়িয়ে পড়ে না (একই স্থানে সীমাবদ্ধ থাকে)'
  },
  chest_triggers: {
    title: {
      en: 'Step 3: What worsens or triggers the chest pain?',
      hi: 'चरण 3: किस गतिविधि से दर्द बढ़ता या ट्रिगर होता है?',
      ta: 'படி 3: மார்பு வலியை தீவிரமாக்குவது எது?',
      te: 'దశ 3: నొప్పిని పెంచే కారణాలు ఏమిటి?',
      mr: 'टप्पा 3: कशाने वेदना वाढते किंवा सुरू होते?',
      bn: 'ধাপ ৩: কীসের কারণে ব্যথা বাড়ে বা শুরু হয়?'
    },
    subtitle: {
      en: 'Aggravating and relieving factor evaluation',
      hi: 'दर्द को बढ़ाने और घटाने वाले कारकों का मूल्यांकन',
      ta: 'வலியை அதிகரிக்கும் காரணிகளின் மதிப்பீடு',
      te: 'నొప్పిని పెంచే అంశాల మూల్యాంకనం',
      mr: 'वेदना वाढवणाऱ्या घटकांचे मूल्यमापन',
      bn: 'ব্যথা বাড়ানোর কারণসমূহের মূল্যায়ন'
    }
  },
  trig_exertion: {
    en: 'Worse with Physical Exertion, Walking, or Climbing Stairs',
    hi: 'शारीरिक परिश्रम, चलने या सीढ़ियां चढ़ने से दर्द बढ़ता है',
    ta: 'உடற்பயிற்சி, நடப்பது அல்லது படிக்கட்டுகளில் ஏறும் போது மோசமாகிறது',
    te: 'శారీరక శ్రమ, నడక లేదా మెట్లు ఎక్కేటప్పుడు ఎక్కువవుతుంది',
    mr: 'शारीरिक श्रम, चालणे किंवा पायऱ्या चढल्याने वेदना वाढते',
    bn: 'শারীরিক পরিশ্রম, হাঁটা বা সিঁড়ি চড়লে ব্যথা বাড়ে'
  },
  trig_breathing_cough: {
    en: 'Worse with Deep Inspiration, Breathing, or Coughing',
    hi: 'गहरी सांस लेने, छींकने या खांसने से बढ़ता है',
    ta: 'ஆழ்ந்த மூச்சு அல்லது இருமலின் போது மோசமாகிறது',
    te: 'గాఢంగా ఊపిరి పీల్చడం లేదా దగ్గినప్పుడు ఎక్కువవుతుంది',
    mr: 'दीर्घ श्वास घेणे किंवा खोकल्याने वेदना वाढते',
    bn: 'গভীর শ্বাস নেওয়া বা কাশার সাথে ব্যথা বাড়ে'
  },
  trig_fatty_food: {
    en: 'Worse after Fatty Meals or Lying Down Flat',
    hi: 'तला-भुना खाने या सीधे लेटने से बढ़ता है',
    ta: 'கொழுப்பு உணவுகள் அல்லது நேராக படுக்கும் போது மோசமாகிறது',
    te: 'కొవ్వు పదార్థాలు తిన్న తర్వాత లేదా పడుకున్నప్పుడు ఎక్కువవుతుంది',
    mr: 'तेलकट अन्न किंवा सरळ झोपल्याने वेदना वाढते',
    bn: 'চর্বিযুক্ত খাবার খাওয়া বা শোওয়ার পর ব্যথা বাড়ে'
  },
  trig_body_movement: {
    en: 'Worse with Arm Movement or Twisting Torso',
    hi: 'हाथ हिलाने या धड़ को मोड़ने से दर्द बढ़ता है',
    ta: 'கை அசைவு அல்லது உடலை திருப்பும் போது மோசமாகிறது',
    te: 'చేతులు కదల్చడం లేదా శరీరాన్ని తిప్పినప్పుడు ఎక్కువవుతుంది',
    mr: 'हात हलवणे किंवा शरीर वळवल्याने वेदना वाढते',
    bn: 'হাত নাড়াচাড়া করা বা শরীর ঘোরালে ব্যথা বাড়ে'
  },
  chest_associated: {
    title: {
      en: 'Step 4: Are you experiencing any accompanying emergency symptoms?',
      hi: 'चरण 4: क्या आपको इनमें से कोई गंभीर आपातकालीन लक्षण महसूस हो रहे हैं?',
      ta: 'படி 4: அவசர அறிகுறிகள் ஏதேனும் உள்ளதா?',
      te: 'దశ 4: ఇతర అత్యవసర లక్షణాలు ఏమైనా ఉన్నాయా?',
      mr: 'टप्पा 4: काही गंभीर आणीबाणीची लक्षणे जाणवत आहेत का?',
      bn: 'ধাপ ৪: অন্যান্য জরুরি কোনো লক্ষণ দেখা দিচ্ছে কি?'
    },
    subtitle: {
      en: 'Multi-system autonomic indicator check',
      hi: 'बहु-प्रणाली स्वायत्त आपातकालीन संकेतों की जांच करें',
      ta: 'அவசர அறிகுறிகளின் சோதனை',
      te: 'అత్యవసర సంకేతాల తనిఖీ',
      mr: 'आणीबाणीच्या लक्षणांची तपासणी',
      bn: 'জরুরি লক্ষণের পরীক্ষা'
    }
  },
  assoc_sweating: {
    en: 'Profuse Cold Sweating (Diaphoresis)',
    hi: 'अत्यधिक ठंडा पसीना आना (डाइफोरेसिस)',
    ta: 'அதிக குளிர்ந்த வேர்வை',
    te: 'అధికంగా చల్లని చెమటలు పట్టడం',
    mr: 'अति प्रमाणात गार घाम येणे',
    bn: 'প্রচুর ঠাণ্ডা ঘাম হওয়া'
  },
  assoc_dyspnea: {
    en: 'Severe Shortness of Breath / Air Hunger',
    hi: 'सांस लेने में भारी तकलीफ / हवा की कमी महसूस होना',
    ta: 'கடுமையான மூச்சுத்திணறல்',
    te: 'తీవ్రమైన ఊపిరాడకపోవడం',
    mr: 'श्वास घेण्यास प्रचंड त्रास होणे',
    bn: 'তীব্র শ্বাসকষ্ট হওয়া'
  },
  assoc_nausea_vomiting: {
    en: 'Nausea or Vomiting',
    hi: 'उल्टी या मिचली (जी मिचलाना)',
    ta: 'குமட்டல் அல்லது வாந்தி',
    te: 'వికారం లేదా వాంతులు',
    mr: 'मळमळ किंवा उलटी होणे',
    bn: 'বমি ভাব বা বমি হওয়া'
  },
  assoc_dizziness: {
    en: 'Dizziness / Lightheadedness / Fainting tendency',
    hi: 'चक्कर आना / बेहोशी की स्थिति बनना',
    ta: 'தலைச்சுற்றல் / மயக்கம் வருவது போன்ற உணர்வு',
    te: 'మైకము / స్పృహ తప్పే పరిస్థితి',
    mr: 'चक्कर येणे / चक्कर येऊन पडण्याची शक्यता',
    bn: 'মাথা ঘোরা / অজ্ঞান হয়ে যাওয়ার ভাব'
  },

  // --- FEVER ---
  fever_pattern: {
    title: {
      en: 'Step 1: What is the temperature pattern and onset?',
      hi: 'चरण 1: बुखार का पैटर्न और शुरुआत कैसी है?',
      ta: 'படி 1: காய்ச்சலின் முறை மற்றும் ஆரம்பம் எவ்வாறு உள்ளது?',
      te: 'దశ 1: జ్వరం యొక్క తీరు మరియు ప్రారంభం ఎలా ఉంది?',
      mr: 'टप्पा 1: तापाचे स्वरूप आणि सुरुवात कशी आहे?',
      bn: 'ধাপ ১: জ্বরের ধরন এবং শুরু কেমন?'
    },
    subtitle: {
      en: 'Fever spike frequency and chills evaluation',
      hi: 'बुखार का स्तर और कंपकंपी की जांच करें',
      ta: 'காய்ச்சலின் அளவு சோதனை',
      te: 'జ్వరం తీవ్రత తనిఖీ',
      mr: 'तापाची तीव्रता तपासा',
      bn: 'জ্বরের মাত্রা পরীক্ষা করুন'
    }
  },
  spiking_chills: {
    en: 'High Spiking Fever (>102°F) with Shaking Chills & Rigors',
    hi: 'कंपकंपी और ठंड के साथ तेज बुखार (>102°F)',
    ta: 'நடுக்கத்துடன் கூடிய அதிக காய்ச்சல் (>102°F)',
    te: 'వణుకు మరియు చలితో కూడిన తీవ్రమైన జ్వరం (>102°F)',
    mr: 'थंडी वजून तीव्र ताप येणे (>102°F)',
    bn: 'কাঁপুনি ও ঠাণ্ডাসহ খুব বেশি জ্বর (>102°F)'
  },
  continuous_moderate: {
    en: 'Continuous Moderate Fever (99°F - 101°F)',
    hi: 'लगातार हल्का या मध्यम बुखार (99°F - 101°F)',
    ta: 'தொடர்ச்சியான மிதமான காய்ச்சல் (99°F - 101°F)',
    te: 'నిరంతర మితమైన జ్వరం (99°F - 101°F)',
    mr: 'सतत असणारा मध्यम ताप (99°F - 101°F)',
    bn: 'অনবরত মাঝারি জ্বর (99°F - 101°F)'
  },
  low_grade_night_sweats: {
    en: 'Low-Grade Evening Spikes with Profuse Night Sweats',
    hi: 'शाम को बुखार चढ़ना और रात में अत्यधिक पसीना आना',
    ta: 'மாலை நேரக் காய்ச்சல் மற்றும் இரவு வேர்வை',
    te: 'సాయంత్రం జ్వరం రావడం మరియు రాత్రి చెమటలు పట్టడం',
    mr: 'संध्याकाळी ताप चढणे आणि रात्री खूप घाम येणे',
    bn: 'সাঁঝের বেলা জ্বর ওঠা ও রাতে প্রচুর ঘাম হওয়া'
  },
  fever_focal_symptoms: {
    title: {
      en: 'Step 2: Which organ systems show focal infection symptoms?',
      hi: 'चरण 2: शरीर के किस अंग में संक्रमण के लक्षण दिख रहे हैं?',
      ta: 'படி 2: எந்த உறுப்பில் தொற்று அறிகுறிகள் உள்ளன?',
      te: 'దశ 2: ఏ అవయవంలో ఇన్ఫెక్షన్ లక్షణాలు ఉన్నాయి?',
      mr: 'टप्पा 2: शरीराच्या कोणत्या भागात संसर्गाची लक्षणे आहेत?',
      bn: 'ধাপ ২: শরীরের কোন অংশে সংক্রমণের লক্ষণ বিদ্যমান?'
    },
    subtitle: {
      en: 'Anatomical symptom localization',
      hi: 'संक्रमण के स्थान की पहचान करें',
      ta: 'தொற்று இடத்தை அடையாளம் காணவும்',
      te: 'ఇన్ఫెక్షన్ ప్రాంతాన్ని గుర్తించండి',
      mr: 'संसर्गाची जागा ओळखा',
      bn: 'সংক্রমণের স্থান চিহ্নিত করুন'
    }
  },
  focal_throat: {
    en: 'Severe Sore Throat / Painful Swallowing',
    hi: 'गले में तेज दर्द / निगलने में तकलीफ',
    ta: 'கடுமையான தொண்டை வலி / விழுங்குவதில் சிரமம்',
    te: 'తీవ్రమైన గొంతు నొప్పి / మింగడంలో ఇబ్బంది',
    mr: 'घशात तीव्र वेदना / गिळताना त्रास',
    bn: 'তীব্র গলা ব্যথা / গিলতে অসুবিধা'
  },
  focal_cough_phlegm: {
    en: 'Persistent Cough with Yellow/Green Phlegm',
    hi: 'लगातार खांसी के साथ पीला/हरा बलगम',
    ta: 'மஞ்சள்/பச்சை சளியுடன் தொடர்ச்சியான இருமல்',
    te: 'పసుపు/పచ్చని కఫంతో కూడిన నిరంతర దగ్గు',
    mr: 'पिवळ्या/हिरव्या कफासह सतत खोकला',
    bn: 'হলুদ/সবুজ কফসহ অনবরত কাশি'
  },
  focal_urinary: {
    en: 'Burning Sensation while Urinating / High Frequency',
    hi: 'पेशाब में जलन / बार-बार पेशाब जाना',
    ta: 'சிறுநீர் கழிக்கும் போது எரிச்சல்',
    te: 'మూత్రవిసర్జనలో మంట / తరచుగా వెళ్లాల్సి రావడం',
    mr: 'लघवी करताना जळजळ / वारंवार लघवी होणे',
    bn: 'পস্রাবে জ্বালাপোড়া / ঘন ঘন পস্রাব হওয়া'
  },
  focal_joint_eye: {
    en: 'Severe Joint/Muscle Pain & Pain Behind Eyes',
    hi: 'जोड़ों व मांसपेशियों में तेज दर्द और आंखों के पीछे दर्द',
    ta: 'கடுமையான மூட்டு/தசை வலி மற்றும் கண் வலி',
    te: 'తీవ్రమైన కీళ్ళు/కండరాల నొప్పి మరియు కళ్ళ వెనుక నొప్పి',
    mr: 'सांधेदुखी, स्नायूदुखी आणि डोळ्यांच्या मागे वेदना',
    bn: 'তীব্র জোড়া/পেশী ব্যথা এবং চোখের পেছনে ব্যথা'
  },

  // --- ABDOMINAL ---
  abdo_location: {
    title: {
      en: 'Step 1: Where in the abdomen is the pain located?',
      hi: 'चरण 1: पेट में दर्द किस हिस्से में महसूस हो रहा है?',
      ta: 'படி 1: வயிற்றில் வலி எங்கு உள்ளது?',
      te: 'దశ 1: కడుపులో నొప్పి ఏ భాగంలో ఉంది?',
      mr: 'टप्पा 1: पोटात वेदना नेमकी कोठे होत आहे?',
      bn: 'ধাপ ১: পেটের কোন অংশে ব্যথা হচ্ছে?'
    },
    subtitle: {
      en: 'Abdominal quadrant localization',
      hi: 'पेट दर्द के क्षेत्र का चयन करें',
      ta: 'வயிறு வலி பகுதியைத் தேர்ந்தெடுக்கவும்',
      te: 'కడుపు నొప్పి ప్రాంతాన్ని ఎంచుకోండి',
      mr: 'पोटदुखीचा भाग निवडा',
      bn: 'পেট ব্যথার স্থান নির্বাচন করুন'
    }
  },
  epigastric: {
    en: 'Upper Stomach / Epigastrium (Acid Reflux / Stomach)',
    hi: 'ऊपरी पेट / नाभि के ऊपर (एसिडिटी / जलन)',
    ta: 'மேல் வயிறு (அசிடிட்டி / எரிச்சல்)',
    te: 'పై కడుపు / నాభి పైన (యాసిడిటీ / మంట)',
    mr: 'वरचे पोट / छातीखालील भाग (ॲसिडिटी)',
    bn: 'উপরের পেট / নাভির উপরে (এসিডিটি / জ্বালা)'
  },
  ruq: {
    en: 'Right Upper Quadrant (Under Right Rib Cage)',
    hi: 'दाहिनी पसली के नीचे (पित्ताशय / यकृत क्षेत्र)',
    ta: 'வலது விலா எலும்புக்கு கீழே',
    te: 'కుడి పక్కటెముక కింద (పిత్తాశయం/కాలేయం)',
    mr: 'उजव्या बरगडीखाली (पित्ताशय/यकृत भाग)',
    bn: 'ডান পাঁজরের নিচে (পিত্তথলি/কলিজার অংশ)'
  },
  rlq: {
    en: 'Right Lower Quadrant (Near Right Hip Bone)',
    hi: 'दाहिनी तरफ नीचे पेट में (अपेंडिक्स क्षेत्र)',
    ta: 'வலது கீழ் வயிறு (அப்பென்டிக்ஸ் பகுதி)',
    te: 'కుడి కింది కడుపు (అపెండిక్స్ ప్రాంతం)',
    mr: 'उजव्या बाजूला खाली पोटात (अपेंडिक्स भाग)',
    bn: 'ডান দিকের তলপেটে (অ্যাপেন্ডিক্স অংশ)'
  },
  generalized_cramps: {
    en: 'Diffuse Cramps & Bloating all over Stomach',
    hi: 'पूरे पेट में मरोड़, ऐंठन और गैस भर जाना',
    ta: 'வயிறு முழுவதும் பிடிப்பு மற்றும் உப்பசம்',
    te: 'కడుపు అంతటా తిమ్మిర్లు మరియు గ్యాస్ రావడం',
    mr: 'संपूर्ण पोटात पिळवटणे आणि गॅस होणे',
    bn: 'সারা পেটে কামড়ানো ব্যথা ও গ্যাস জমা'
  },
  abdo_red_flags: {
    title: {
      en: 'Step 2: Are you experiencing any severe GI red flags?',
      hi: 'चरण 2: क्या आपको इनमें से कोई गंभीर आपातकालीन लक्षण हैं?',
      ta: 'படி 2: கடுமையான அவசர அறிகுறிகள் ஏதேனும் உள்ளதா?',
      te: 'దశ 2: తీవ్రమైన అత్యవసర లక్షణాలు ఏమైనా ఉన్నాయా?',
      mr: 'टप्पा 2: काही गंभीर आणीबाणीची लक्षणे आहेत का?',
      bn: 'ধাপ ২: কোনো গুরুতর জরুরি লক্ষণ দেখা দিচ্ছে কি?'
    },
    subtitle: {
      en: 'Internal bleeding and peritonitis screening',
      hi: 'आंतरिक रक्तस्राव और गंभीर पेट संक्रमण की जांच',
      ta: 'உள் ரத்தப்போக்கு பரிசோதனை',
      te: 'ఆంతరిక రక్తస్రావం తనిఖీ',
      mr: 'अंतर्गत रक्तस्त्राव तपासणी',
      bn: 'অভ্যন্তরীণ রক্তপাত পরীক্ষা'
    }
  },
  abdo_vomit_blood: {
    en: 'Vomiting Blood or Dark Coffee-Ground Fluid',
    hi: 'उल्टी में खून या गाढ़ा भूरा तरल आना',
    ta: 'வாந்தியில் ரத்தம் அல்லது காபி நிற திரவம்',
    te: 'వాంతిలో రక్తం లేదా నల్లని ద్రవం రావడం',
    mr: 'उल्टीमध्ये रक्त किंवा काळा द्रव येणे',
    bn: 'বমিতে রক্ত বা গাঢ় কফি রঙের তরল বের হওয়া'
  },
  abdo_black_stool: {
    en: 'Passing Black Tarry Stool (Melena)',
    hi: 'काला तारकोल जैसा मल (पखाना) आना',
    ta: 'கருப்பு நிற மலம் கழித்தல்',
    te: 'నల్లని మలం రావడం (మెలేనా)',
    mr: 'काळ्या रंगाचे शौच होणे',
    bn: 'কালো রঙের পায়খানা হওয়া'
  },
  abdo_rigid_stomach: {
    en: 'Stomach is Board-Like Hard & Painful to Touch',
    hi: 'पेट लकड़ी जैसा कड़ा होना और छूने पर तेज दर्द होना',
    ta: 'வயிறு பலகை போல் கடினமாக இருத்தல்',
    te: 'కడుపు కలపలా గట్టిగా అవ్వడం మరియు తాకితే నొప్పి',
    mr: 'पोट लाकडासारखे कडक होणे आणि शिवल्यास अति वेदना',
    bn: 'পেট কাঠের মতো শক্ত হওয়া এবং ছোঁয়া মাত্রই ব্যথা'
  },

  // --- RESPIRATORY ---
  resp_dyspnea_severity: {
    title: {
      en: 'Step 1: How severe is the breathing difficulty?',
      hi: 'चरण 1: सांस लेने में तकलीफ कितनी गंभीर है?',
      ta: 'படி 1: மூச்சுத்திணறல் எவ்வளவு கடுமையாக உள்ளது?',
      te: 'దశ 1: ఊపిరాడకపోవడం ఎంత తీవ్రంగా ఉంది?',
      mr: 'टप्पा 1: श्वास घेण्यास होणारा त्रास किती गंभीर आहे?',
      bn: 'ধাপ ১: শ্বাসকষ্ট কতটা তীব্র?'
    },
    subtitle: {
      en: 'Air hunger and talk test evaluation',
      hi: 'सांस की कमी एवं बोलने की क्षमता की जांच',
      ta: 'மூச்சு அளவு சோதனை',
      te: 'శ్వాస సామర్థ్య తనిఖీ',
      mr: 'श्वासाची क्षमता तपासा',
      bn: 'শ্বাস নেওয়ার ক্ষমতা পরীক্ষা'
    }
  },
  resp_rest_breathless: {
    en: 'Breathless at Rest / Cannot Complete Short Sentences',
    hi: 'बैठे-बैठे सांस फूलना / पूरे वाक्य न बोल पाना',
    ta: 'ஓய்வில் இருக்கும் போதும் மூச்சுத்திணறல்',
    te: 'కూర్చున్నప్పుడు కూడా ఊపిరాడకపోవడం / చిన్న వాక్యాలు మాట్లాడలేకపోవడం',
    mr: 'बसल्या जागी श्वास फुलणे / पूर्ण वाक्य बोलता न येणे',
    bn: 'বসে থাকলেও শ্বাসকষ্ট হওয়া / পুরো বাক্য বলতে না পারা'
  },
  resp_exertion_only: {
    en: 'Breathless Only when Walking or Climbing Stairs',
    hi: 'केवल चलने या सीढ़ियां चढ़ने पर सांस फूलना',
    ta: 'நடக்கும் போது அல்லது படிக்கட்டுகளில் ஏறும் போது மட்டும் மூச்சுத்திணறல்',
    te: 'నడిచినప్పుడు లేదా మెట్లు ఎక్కినప్పుడు మాత్రమే ఊపిరాడకపోవడం',
    mr: 'फक्त चालताना किंवा पायऱ्या चढताना श्वास फुलणे',
    bn: 'শুধু হাঁটার সময় বা সিঁড়ি দিয়ে ওঠার সময় শ্বাসকষ্ট'
  },
  resp_positional: {
    en: 'Cannot Lie Flat in Bed without Waking Up Gasping',
    hi: 'बिना तकिये सीधे लेटने पर सांस रुकना और जागना',
    ta: 'படுக்கையில் நேராக படுக்க முடியாமை',
    te: 'నేరుగా పడుకున్నప్పుడు ఊపిరి అందక మేల్కోవడం',
    mr: 'सरळ झोपल्यास श्वास कोंडणे आणि जाग येणे',
    bn: 'সোজা হয়ে শুতে না পারা এবং শ্বাসের জন্য জেগে ওঠা'
  },
  resp_cough_sputum: {
    title: {
      en: 'Step 2: What is the cough and sputum character?',
      hi: 'चरण 2: खांसी और बलगम का प्रकार कैसा है?',
      ta: 'படி 2: இருமல் மற்றும் சளியின் தன்மை என்ன?',
      te: 'దశ 2: దగ్గు మరియు కఫం రకం ఎలా ఉంది?',
      mr: 'टप्पा 2: खोकला आणि कफाचे स्वरूप कसे आहे?',
      bn: 'ধাপ ২: কাশি ও কফের ধরন কেমন?'
    },
    subtitle: {
      en: 'Auscultation & sputum analysis',
      hi: 'खांसी की आवाज और बलगम की जांच',
      ta: 'இருமல் ஒலி சோதனை',
      te: 'దగ్గు ధ్వని తనిఖీ',
      mr: 'खोकल्याचा आवाज तपासा',
      bn: 'কাশির শব্দ পরীক্ষা'
    }
  },
  dry_whistling: {
    en: 'Dry Cough with High-Pitched Whistling / Wheezing Sound',
    hi: 'सूखी खांसी के साथ सीटी जैसी आवाज (सीटी बजना)',
    ta: 'உலர் இருமலுடன் விசில் போன்ற ஒலி',
    te: 'పొడి దగ్గు మరియు ఈల వేసినట్లు శబ్దం రావడం',
    mr: 'कोरड्या खोकल्यासह शिटीसारखा आवाज येणे',
    bn: 'শুকনো কাশি ও বাঁশির মতো আওয়াজ হওয়া'
  },
  thick_yellow_green: {
    en: 'Coughing up Thick Yellow / Green Phlegm',
    hi: 'गाढ़ा पीला या हरा बलगम निकलना',
    ta: 'தடிமனான மஞ்சள் / பச்சை சளி',
    te: 'మందపాటి పసుపు / పచ్చని కఫం రావడం',
    mr: 'घट्ट पिवळा किंवा हिरवा कफ पडणे',
    bn: 'ঘন হলুদ বা সবুজ কফ বের হওয়া'
  },
  pink_frothy_blood: {
    en: 'Coughing up Pink Frothy Sputum or Blood Spots',
    hi: 'गुलाबी झागदार बलगम या खून के धब्बे आना',
    ta: 'இளஞ்சிவப்பு நுரை சளி அல்லது ரத்த புள்ளிகள்',
    te: 'గులాబీ రంగు నురుగు కఫం లేదా రక్తం చుక్కలు రావడం',
    mr: 'गुलाबी फेसयुक्त कफ किंवा रक्ताचे डाग येणे',
    bn: 'গোলাপী ফেনার মতো কফ বা রক্তের দাগ বের হওয়া'
  },

  // --- HEADACHE ---
  head_onset_character: {
    title: {
      en: 'Step 1: What was the speed of onset and pain character?',
      hi: 'चरण 1: सिरदर्द की शुरुआत और प्रकृति कैसी थी?',
      ta: 'படி 1: தலைவலியின் வேகம் மற்றும் தன்மை என்ன?',
      te: 'దశ 1: తలనొప్పి ప్రారంభం మరియు స్వభావం ఎలా ఉంది?',
      mr: 'टप्पा 1: डोकेदुखीची सुरुवात आणि स्वरूप कसे होते?',
      bn: 'ধাপ ১: মাথাব্যথা শুরু হওয়ার গতি ও ধরন কেমন?'
    },
    subtitle: {
      en: 'Intracranial pain pattern analysis',
      hi: 'दर्द के प्रकार का विश्लेषण करें',
      ta: 'தலைவலி முறை பகுப்பாய்வு',
      te: 'నొప్పి స్వభావ విశ్లేషణ',
      mr: 'वेदना प्रकाराचे विश्लेषण',
      bn: 'ব্যথার ধরনের বিশ্লেষণ'
    }
  },
  thunderclap_sudden: {
    en: 'Sudden "Thunderclap" Explosion (Worst Headache of Life)',
    hi: 'अचानक बिजली जैसा धमाका (जीवन का सबसे भयानक सिरदर्द)',
    ta: 'திடீர் இடி போன்ற தலைவலி',
    te: 'హఠాత్తుగా పిడుగు పడినట్లు తలనొప్పి (జీవితంలో అత్యంత భయంకరమైనది)',
    mr: 'अचानक विजेसारखा झटका (जीवनातील सर्वात भयानक डोकेदुखी)',
    bn: 'হঠাৎ বাজ পড়ার মতো তীব্র মাথাব্যথা (জীবনের সবচেয়ে খারাপ ব্যথায়)'
  },
  one_sided_throbbing: {
    en: 'One-Sided Throbbing Pain with Nausea & Light Sensitivity',
    hi: 'एक तरफा टपकता दर्द, मिचली और रोशनी से तकलीफ',
    ta: 'ஒரு பக்க தலைவலி மற்றும் குமட்டல்',
    te: 'ఒకవైపున నరం లాగుతున్నట్లు నొప్పి మరియు వెలుగును చూడలేకపోవడం',
    mr: 'एका बाजूला होणारी कसकस आणि प्रकाशाचा त्रास',
    bn: 'একপাশে দপদপ করা ব্যথা ও আলোতে কষ্ট হওয়া'
  },
  tight_band_forehead: {
    en: 'Constant Tight Squeezing Band Around Temples & Forehead',
    hi: 'माथे और कनपटी के चारों ओर कसता हुआ तनावयुक्त दर्द',
    ta: 'நெற்றியைச் சுற்றி இறுக்கமான பட்டை போன்ற வலி',
    te: 'నుదురు మరియు శంఖము చుట్టూ బిగుతుగా ఉండే నొప్పి',
    mr: 'कपाळाभोवती घट्ट पट्टी बांधल्यासारखी वेदना',
    bn: 'কপালের চারপাশে শক্ত ব্যান্ডের মতো চাপযুক্ত ব্যথা'
  },
  head_neuro_deficits: {
    title: {
      en: 'Step 2: Are you experiencing any neurological red flags?',
      hi: 'चरण 2: क्या आपको इनमें से कोई न्यूरोलॉजिकल आपातकालीन लक्षण हैं?',
      ta: 'படி 2: நரம்பியல் அவசர அறிகுறிகள் உள்ளனவா?',
      te: 'దశ 2: న్యూరోలాజికల్ అత్యవసర లక్షణాలు ఉన్నాయా?',
      mr: 'टप्पा 2: काही न्यूरोलॉजिकल आणीबाणीची लक्षणे आहेत का?',
      bn: 'ধাপ ২: কোনো নিউরোলজিক্যাল জরুরি লক্ষণ আছে কি?'
    },
    subtitle: {
      en: 'FAST stroke & meningeal sign screening',
      hi: 'लकवा (स्ट्रोक) और दिमागी बुखार की जांच',
      ta: 'பக்கவாதம் மற்றும் மூளைக்காய்ச்சல் சோதனை',
      te: 'పక్షవాతం మరియు మెదడు జ్వరం తనిఖీ',
      mr: 'पक्षाघात आणि मेंदूज्वर तपासणी',
      bn: 'পক্ষাঘাত ও মস্তিষ্কের জ্বরের পরীক্ষা'
    }
  },
  stroke_facial_droop: {
    en: 'Facial Droop, Arm Weakness, or Slurred Speech',
    hi: 'चेहरा टेढ़ा होना, हाथ में कमजोरी या आवाज तुतलाना',
    ta: 'முகம் கோணுதல், கை பலவீனம் அல்லது தெளிவற்ற பேச்சு',
    te: 'ముఖం వంకరపోవడం, చేయి బలహీనపడటం లేదా మాట తొట్రూపడటం',
    mr: 'चेहरा वाकडा होणे, हातात अशक्तपणा किंवा बोलणे तोतरे होणे',
    bn: 'মুখ বেঁকে যাওয়া, হাতে দুর্বলতা বা অস্পষ্ট কথা'
  },
  stiff_neck_fever: {
    en: 'Stiff Neck + High Fever + Sensitivity to Light',
    hi: 'गर्दन में अकड़न + तेज बुखार + रोशनी से डर लगना',
    ta: 'கழுத்து விறைப்பு + அதிக காய்ச்சல்',
    te: 'మెడ బిగుతుగా ఉండటం + తీవ్రమైన జ్వరం + వెలుగును చూడలేకపోవడం',
    mr: 'मान कडक होणे + तीव्र ताप + प्रकाशाची भीती',
    bn: 'ঘাড় শক্ত হওয়া + তীব্র জ্বর + আলোতে কষ্ট হওয়া'
  },
  vision_loss_double: {
    en: 'Sudden Vision Loss, Double Vision, or Dizziness',
    hi: 'अचानक आंखों से धुंधला दिखना, दो-दो दिखना या चक्कर',
    ta: 'திடீர் பார்வையிழப்பு அல்லது இரட்டைப் பார்வை',
    te: 'హఠాత్తుగా చూపు మసకబారడం, రెండేసిగా కనిపించడం లేదా మైకం',
    mr: 'अचानक अंधुक दिसणे, दोन-दोन दिसणे किंवा चक्कर येणे',
    bn: 'হঠাৎ চোখে না দেখা, দুটো দুটো দেখা বা মাথা ঘোরা'
  },

  // --- AYUSH WELLNESS ---
  ayush_dosha: {
    title: {
      en: 'Step 1: Dominant Body Constitution (Prakriti Pariksha)',
      hi: 'चरण 1: आपकी मुख्य शारीरिक प्रकृति (त्रिदोष परीक्षण)',
      ta: 'படி 1: உங்கள் முதன்மை உடல் தத்துவம் (பிரகிருதி பரிசோதனை)',
      te: 'దశ 1: మీ ప్రధాన శరీర తత్వం (ప్రకృతి పరీక్ష)',
      mr: 'टप्पा 1: तुमचे मुख्य शारीरिक स्वरूप (त्रिदोष परीक्षा)',
      bn: 'ধাপ ১: আপনার প্রধান শারীরিক গঠন (প্রকৃতি পরীক্ষা)'
    },
    subtitle: {
      en: 'Ayurvedic tridosha assessment',
      hi: 'आयुर्वेदिक वात, पित्त, कफ प्रकृति निर्धारण',
      ta: 'ஆயுர்வேத வாத, பித்த, கப சோதனை',
      te: 'ఆయుర్వేద వాత, పిత్త, కఫ పరీక్ష',
      mr: 'आयुर्वेदिक वात, पित्त, कफ मूल्यमापन',
      bn: 'আয়ুর্বেদিক বাত, পিত্ত, কফ পরীক্ষা'
    }
  },
  vata_prakriti: {
    en: 'Vata Dominant (Light build, dry skin, active mind, irregular digestion)',
    hi: 'वात प्रधान (हल्का शरीर, रूखी त्वचा, चंचल मन, अनिश्चित पाचन)',
    ta: 'வாத பிரதானம் (மெல்லிய உடல், வறண்ட தோள், சுறுசுறுப்பான மனம்)',
    te: 'వాత ప్రధానం (లేత శరీరం, పొడి చర్మం, చంచలమైన మనస్సు)',
    mr: 'वात प्रधान (हळुवार शरीर, कोरडी त्वचा, चंचल मन)',
    bn: 'বাত প্রধান (হালকা গঠন, শুষ্ক ত্বক, চঞ্চল মন)'
  },
  pitta_prakriti: {
    en: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp focus)',
    hi: 'पित्त प्रधान (मध्यम शरीर, गर्म त्वचा, तेज पाचन, एकाग्र बुद्धि)',
    ta: 'பித்த பிரதானம் (நடுத்தர உடல், சூடான தோள், கூர்மையான கவனம்)',
    te: 'పిత్త ప్రధానం (మధ్యస్థ శరీరం, వెచ్చని చర్మం, తక్షణ జీర్ణక్రియ)',
    mr: 'पित्त प्रधान (मध्यम शरीर, उष्ण त्वचा, तीक्ष्ण बुद्धी)',
    bn: 'পিত্ত প্রধান (মাঝারি গঠন, উষ্ণ ত্বক, তীক্ষ্ণ মন)'
  },
  kapha_prakriti: {
    en: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady endurance)',
    hi: 'कफ प्रधान (मजबूत शरीर, चिकनी त्वचा, शांत स्वभाव, सहनशीलता)',
    ta: 'கப பிரதானம் (உறுதியான உடல், மென்மையான தோள், அமைதியான குணம்)',
    te: 'కఫ ప్రధానం (బలమైన శరీరం, మృదువైన చర్మం, ప్రశాంత మనస్సు)',
    mr: 'कफ प्रधान (मजबूत शरीर, गुळगुळीत त्वचा, शांत स्वभाव)',
    bn: 'কফ প্রধান (শক্তিশালী গঠন, মসৃণ ত্বক, শান্ত স্বভাব)'
  },
  ayush_agni: {
    title: {
      en: 'Step 2: Digestive Fire Capacity (Agni Pariksha)',
      hi: 'चरण 2: जठराग्नि एवं पाचन क्षमता (अग्नि परीक्षण)',
      ta: 'படி 2: செரிமானத் திறன் சோதனை (அக்னி பரிசோதனை)',
      te: 'దశ 2: జీర్ణక్రియ సామర్థ్యం (అగ్ని పరీక్ష)',
      mr: 'टप्पा 2: पचन क्षमता (अग्नी परीक्षा)',
      bn: 'ধাপ ২: হজম ক্ষমতা (অগ্নি পরীক্ষা)'
    },
    subtitle: {
      en: 'Metabolic capacity evaluation',
      hi: 'पाचन एवं चयापचय क्षमता का परीक्षण',
      ta: 'செரிமான திறன் மதிப்பீடு',
      te: 'జీర్ణ సామర్థ్య మూల్యాంకనం',
      mr: 'पचन क्षमता तपासणी',
      bn: 'মেটাবলিক ক্ষমতা পরীক্ষা'
    }
  },
  samagni: {
    en: 'Sama Agni (Normal, smooth digestion without acidity or bloating)',
    hi: 'सम अग्नि (सामान्य, सुचारू पाचन, बिना एसिडिटी के)',
    ta: 'சம அக்னி (இயல்பான செரிமானம்)',
    te: 'సమ అగ్ని (సాధారణ మరియు సులభమైన జీర్ణక్రియ)',
    mr: 'सम अग्नी (सामान्य आणि सुरळीत पचन)',
    bn: 'সম অগ্নি (স্বাভাবিক ও মসৃণ হজম)'
  },
  mandagni: {
    en: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)',
    hi: 'मंद अग्नि (धीमी पाचन शक्ति, खाने के बाद भारीपन, कम भूख)',
    ta: 'மந்த அக்னி (மந்தமான செரிமானம், சாப்பிட்ட பின் பாரம்)',
    te: 'మంద అగ్ని (నెమ్మదైన జీర్ణక్రియ, తిన్న తర్వాత బరువుగా అనిపించడం)',
    mr: 'मंद अग्नी (मंद पचनशक्ती, जेवणानंतर जडपणा)',
    bn: 'মন্দ অগ্নি (ধীরগতির হজম, খাওয়ার পর ভারী ভাব)'
  },
  tikshnagni: {
    en: 'Tikshna Agni (Hyperactive digestion, frequent burning hunger, heartburn)',
    hi: 'तीक्ष्ण अग्नि (अत्यधिक तीव्र भूख, सीने में जलन, तेज तेजाबियत)',
    ta: 'தீக்ஷ்ண அக்னி (அதிக பசி, நெஞ்செரிச்சல்)',
    te: 'తీక్షణ అగ్ని (అధిక ఆకలి, గుండెల్లో మంట, యాసిడిటీ)',
    mr: 'तीक्ष्ण अग्नी (अति तीव्र भूक, छातीत जळजळ)',
    bn: 'তীক্ষ্ণ অগ্নি (অতিরিক্ত তীব্র ক্ষুধা, বুকে জ্বালা)'
  },

  // --- ROUTINE CHECKUP ---
  routine_purpose: {
    title: {
      en: 'Step 1: What is the primary purpose of today\'s visit?',
      hi: 'चरण 1: आज के अस्पताल आगमन का मुख्य कारण क्या है?',
      ta: 'படி 1: இன்றைய வருகையின் முக்கிய நோக்கம் என்ன?',
      te: 'దశ 1: నేటి ఆసుపత్రి రాకకు ప్రధాన కారణం ఏమిటి?',
      mr: 'टप्पा 1: आजच्या हॉस्पिटल भेटीचे मुख्य कारण काय आहे?',
      bn: 'ধাপ ১: আজকের হাসপাতালে আসার প্রধান কারণ কী?'
    },
    subtitle: {
      en: 'General preventive OPD checkup',
      hi: 'सामान्य स्वास्थ्य परीक्षण एवं परामर्श',
      ta: 'பொது சுகாதார சோதனை',
      te: 'సాధారణ ఆరోగ్య తనిఖీ',
      mr: 'सामान्य आरोग्य तपासणी',
      bn: 'সাধারণ স্বাস্থ্য পরীক্ষা'
    }
  },
  general_wellness: {
    en: 'General Health & Vital Screening (BP, Sugar, Weight)',
    hi: 'सामान्य स्वास्थ्य परीक्षण (बीपी, शुगर, वजन जांच)',
    ta: 'பொது சுகாதார சோதனை (பிபி, சுகர், எடை)',
    te: 'సాధారణ ఆరోగ్య తనిఖీ (BP, షుగర్, బరువు తనిఖీ)',
    mr: 'सामान्य आरोग्य तपासणी (बीपी, शुगर, वजन)',
    bn: 'সাধারণ স্বাস্থ্য পরীক্ষা (বিপি, শুগার, ওজন)'
  },
  med_refill: {
    en: 'Routine Prescription Medication Refill / Follow-up',
    hi: 'नियमित दवाइयों का परचा दोबारा लिखवाना / फॉलो-अप',
    ta: 'வழக்கமான மருந்து மறுபதிவு / பின்தொடர்தல்',
    te: 'రెగ్యులర్ మందుల ప్రిస్క్రిప్షన్ రాయింపు / ఫాలో-అప్',
    mr: 'नियमित औषधांचे प्रिस्क्रिप्शन पुन्हा लिहिणे / फॉलो-अप',
    bn: 'নিয়মিত ওষুধের প্রেসক্রিপশন নতুন করে নেওয়া / ফলো-আপ'
  },
  blood_report_review: {
    en: 'Reviewing Pathology Blood / Lab Test Reports',
    hi: 'खून व लैब जांच रिपोर्ट डॉक्टर को दिखाना',
    ta: 'ரத்தப் பரிசோதனை அறிக்கைகளை ஆய்வு செய்தல்',
    te: 'రక్త పరీక్ష / ల్యాబ్ నివేదికలను డాక్టర్‌కు చూపించడం',
    mr: 'रक्त आणि लॅब तपासणी अहवाल डॉक्टरांना दाखवणे',
    bn: 'রক্ত ও ল্যাব টেস্ট রিপোর্ট ডাক্তারকে দেখানো'
  }
};

/**
 * Get dynamic language text for an option, step title, or step subtitle.
 */
export function getOptionLabel(opt, currentLang = 'en') {
  if (!opt) return '';
  const optId = typeof opt === 'string' ? opt : opt.id;
  if (TREE_TRANSLATIONS[optId]) {
    const entry = TREE_TRANSLATIONS[optId];
    if (typeof entry === 'string') return entry;
    if (entry[currentLang]) return entry[currentLang];
    if (entry.en) return entry.en;
  }
  // Fallbacks if not found in dictionary
  if (currentLang === 'hi' && opt.label_hi) return opt.label_hi;
  return opt.label || opt.name || optId;
}

export function getStepTitle(step, currentLang = 'en') {
  if (!step) return '';
  const stepId = typeof step === 'string' ? step : step.id;
  if (TREE_TRANSLATIONS[stepId] && TREE_TRANSLATIONS[stepId].title) {
    const titles = TREE_TRANSLATIONS[stepId].title;
    if (titles[currentLang]) return titles[currentLang];
    if (titles.en) return titles.en;
  }
  if (currentLang === 'hi' && step.title_hi) return step.title_hi;
  return step.title || '';
}

export function getStepSubtitle(step, currentLang = 'en') {
  if (!step) return '';
  const stepId = typeof step === 'string' ? step : step.id;
  if (TREE_TRANSLATIONS[stepId] && TREE_TRANSLATIONS[stepId].subtitle) {
    const subs = TREE_TRANSLATIONS[stepId].subtitle;
    if (subs[currentLang]) return subs[currentLang];
    if (subs.en) return subs.en;
  }
  if (currentLang === 'hi' && step.subtitle_hi) return step.subtitle_hi;
  return step.subtitle || '';
}

