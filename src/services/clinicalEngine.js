/**
 * MediKiosk Clinical Intelligence Engine
 * Handles SOCRATES Allopathy, AYUSH Dashavidha Pariksha, Emergency Triage, and ABDM FHIR R4 formatting.
 */

export const SYMPTOM_CATEGORIES = [
  { id: 'routine_checkup', name: 'Routine OPD General Checkup', name_hi: 'αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ» αñôαñ¬αÑÇαñíαÑÇ αñ¬αñ░αñ╛αñ«αñ░αÑìαñ╢', category: 'General', icon: 'CheckCircle2' },
  { id: 'chest_pain', name: 'Chest Pain / Pressure', name_hi: 'αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñªαñ░αÑìαñª / αñ¡αñ╛αñ░αÑÇαñ¬αñ¿', category: 'Cardiovascular', icon: 'Heart', redFlagIf: ['radiation_arm', 'severe_dyspnea'] },
  { id: 'fever', name: 'Fever & Chills', name_hi: 'αñ¼αÑüαñûαñ╛αñ░ αñÅαñ╡αñé αñòαñéαñ¬αñòαñéαñ¬αÑÇ', category: 'General', icon: 'Thermometer' },
  { id: 'respiratory', name: 'Cough / Shortness of Breath', name_hi: 'αñûαñ╛αñéαñ╕αÑÇ / αñ╕αñ╛αñéαñ╕ αñ½αÑéαñ▓αñ¿αñ╛', category: 'Respiratory', icon: 'Wind', redFlagIf: ['spo2_below_90'] },
  { id: 'abdominal', name: 'Abdominal Pain & Digestion', name_hi: 'αñ¬αÑçαñƒ αñªαñ░αÑìαñª αñÅαñ╡αñé αñ¬αñ╛αñÜαñ¿ αññαñéαññαÑìαñ░', category: 'Gastrointestinal', icon: 'Activity' },
  { id: 'headache', name: 'Headache & Dizziness', name_hi: 'αñ╕αñ┐αñ░αñªαñ░αÑìαñª αñÅαñ╡αñé αñÜαñòαÑìαñòαñ░ αñåαñ¿αñ╛', category: 'Neurological', icon: 'Brain' },
  { id: 'joint_pain', name: 'Joint & Muscle Pain', name_hi: 'αñ£αÑïαñíαñ╝αÑïαñé αñ╡ αñ«αñ╛αñéαñ╕αñ¬αÑçαñ╢αñ┐αñ»αÑïαñé αñòαñ╛ αñªαñ░αÑìαñª', category: 'Musculoskeletal', icon: 'Activity' },
  { id: 'ayush_general', name: 'Ayurvedic Wellness & Prakriti Checkup', name_hi: 'αñåαñ»αÑüαñ░αÑìαñ╡αÑçαñªαñ┐αñò αñ¬αÑìαñ░αñòαÑâαññαñ┐ αñÅαñ╡αñé αñ╕αÑìαñ╡αñ╛αñ╕αÑìαñÑαÑìαñ» αñ£αñ╛αñéαñÜ', category: 'AYUSH Speciality', icon: 'Feather' }
];

export const SOCRATES_QUESTIONS = {
  site: {
    id: 'site',
    title: 'Where exactly is the pain or primary discomfort located?',
    title_hi: 'αñªαñ░αÑìαñª αñ»αñ╛ αññαñòαñ▓αÑÇαñ½ αñ╢αñ░αÑÇαñ░ αñòαÑç αñòαñ┐αñ╕ αñ╣αñ┐αñ╕αÑìαñ╕αÑç αñ«αÑçαñé αñ╣αÑê?',
    type: 'visual_body_map',
    options: [
      { id: 'chest_left', label: 'Left Side of Chest', label_hi: 'αñ╕αÑÇαñ¿αÑç αñòαÑÇ αñ¼αñ╛αñêαñé αññαñ░αñ½', icon: 'Heart' },
      { id: 'chest_center', label: 'Center of Chest', label_hi: 'αñ╕αÑÇαñ¿αÑç αñòαÑç αñ¼αÑÇαñÜ αñ«αÑçαñé', icon: 'Heart' },
      { id: 'abdomen_upper', label: 'Upper Abdomen / Stomach', label_hi: 'αñèαñ¬αñ░αÑÇ αñ¬αÑçαñƒ / αñàαñ«αñ╛αñ╢αñ»', icon: 'Square' },
      { id: 'head_forehead', label: 'Forehead / Temples', label_hi: 'αñ«αñ╛αñÑαñ╛ / αñòαñ¿αñ¬αñƒαÑÇ', icon: 'Brain' },
      { id: 'back_lumbar', label: 'Lower Back', label_hi: 'αñ¬αÑÇαñá αñòαÑç αñ¿αñ┐αñÜαñ▓αÑç αñ╣αñ┐αñ╕αÑìαñ╕αÑç αñ«αÑçαñé', icon: 'User' },
      { id: 'joints_limbs', label: 'Knee / Joints', label_hi: 'αñÿαÑüαñƒαñ¿αÑç / αñ£αÑïαñíαñ╝', icon: 'Activity' }
    ]
  },
  onset: {
    id: 'onset',
    title: 'How did the symptom start?',
    title_hi: 'αñ▓αñòαÑìαñ╖αñúαÑïαñé αñòαÑÇ αñ╢αÑüαñ░αÑüαñåαññ αñòαÑêαñ╕αÑç αñ╣αÑüαñê?',
    type: 'choice',
    options: [
      { id: 'sudden_acute', label: 'Sudden & Severe (Within minutes)', label_hi: 'αñàαñÜαñ╛αñ¿αñò αñöαñ░ αññαÑçαñ£ (αñòαÑüαñ¢ αñ«αñ┐αñ¿αñƒαÑïαñé αñòαÑç αñ¡αÑÇαññαñ░)', description: 'Started abruptly out of nowhere' },
      { id: 'gradual_hours', label: 'Gradual Onset (Over hours/days)', label_hi: 'αñºαÑÇαñ░αÑç-αñºαÑÇαñ░αÑç αñ╢αÑüαñ░αÑüαñåαññ (αñÿαñéαñƒαÑïαñé αñ»αñ╛ αñªαñ┐αñ¿αÑïαñé αñ«αÑçαñé)', description: 'Steadily grew worse over time' },
      { id: 'chronic_weeks', label: 'Long Standing / Chronic (Weeks/Months)', label_hi: 'αñ¬αÑüαñ░αñ╛αñ¿αñ╛ αñªαñ░αÑìαñª (αñ╣αñ½αÑìαññαÑïαñé αñ»αñ╛ αñ«αñ╣αÑÇαñ¿αÑïαñé αñ╕αÑç)', description: 'Intermittent or recurring issue' }
    ]
  },
  character: {
    id: 'character',
    title: 'What does the pain or discomfort feel like?',
    title_hi: 'αñªαñ░αÑìαñª αñòαÑÇ αñàαñ¿αÑüαñ¡αÑéαññαñ┐ αñòαÑêαñ╕αÑÇ αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑïαññαÑÇ αñ╣αÑê?',
    type: 'choice',
    options: [
      { id: 'pressure_squeezing', label: 'Heavy Pressure / Squeezing Tightness', label_hi: 'αñ¡αñ╛αñ░αÑÇ αñªαñ¼αñ╛αñ╡ / αñ╕αÑÇαñ¿αñ╛ αñòαñ╕αñ¿αñ╛ αñ»αñ╛ αñ£αñòαñíαñ╝αñ¿αñ╛', isUrgent: true },
      { id: 'sharp_stabbing', label: 'Sharp, Stabbing or Piercing', label_hi: 'αññαÑçαñ£ αñÜαÑüαñ¡αñ¿αÑç αñ╡αñ╛αñ▓αñ╛ αñ»αñ╛ αñ╕αÑéαñê αñ£αÑêαñ╕αñ╛ αñªαñ░αÑìαñª' },
      { id: 'dull_aching', label: 'Dull Aching or Constant Heavy Throbbing', label_hi: 'αñ╣αñ▓αÑìαñòαñ╛ αñ»αñ╛ αñ▓αñùαñ╛αññαñ╛αñ░ αñ¡αñ╛αñ░αÑÇ αñ«αÑÇαñáαñ╛ αñªαñ░αÑìαñª' },
      { id: 'burning', label: 'Burning Sensation / Acidity-like', label_hi: 'αñ£αñ▓αñ¿ / αññαÑçαñ£αñ╛αñ¼αñ┐αñ»αññ αñ£αÑêαñ╕αñ╛ αñÅαñ╕αñ┐αñíαñ┐αñƒαÑÇ αñªαñ░αÑìαñª' }
    ]
  },
  radiation: {
    id: 'radiation',
    title: 'Does the pain spread (radiate) anywhere else?',
    title_hi: 'αñòαÑìαñ»αñ╛ αñªαñ░αÑìαñª αñ╢αñ░αÑÇαñ░ αñòαÑç αñòαñ┐αñ╕αÑÇ αñàαñ¿αÑìαñ» αñ╣αñ┐αñ╕αÑìαñ╕αÑç αñ«αÑçαñé αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê?',
    type: 'choice',
    options: [
      { id: 'to_arm_jaw', label: 'Spreads to Left Arm, Neck or Jaw', label_hi: 'αñ¼αñ╛αñ»αÑçαñé αñ╣αñ╛αñÑ, αñùαñ░αÑìαñªαñ¿ αñ»αñ╛ αñ£αñ¼αñíαñ╝αÑç αñòαÑÇ αññαñ░αñ½ αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê', isRedFlag: true },
      { id: 'to_back', label: 'Spreads to Upper or Lower Back', label_hi: 'αñ¬αÑÇαñá αñòαÑç αñèαñ¬αñ░αÑÇ αñ»αñ╛ αñ¿αñ┐αñÜαñ▓αÑç αñ╣αñ┐αñ╕αÑìαñ╕αÑç αñ«αÑçαñé αñ½αÑêαñ▓αññαñ╛ αñ╣αÑê' },
      { id: 'none', label: 'Does not spread (Stays in one spot)', label_hi: 'αñòαñ╣αÑÇ αñ¿αñ╣αÑÇαñé αñ½αÑêαñ▓αññαñ╛ (αñÅαñò αñ╣αÑÇ αñ£αñùαñ╣ αñ░αñ╣αññαñ╛ αñ╣αÑê)' }
    ]
  },
  associations: {
    id: 'associations',
    title: 'Are you experiencing any accompanying symptoms?',
    title_hi: 'αñòαÑìαñ»αñ╛ αñåαñ¬αñòαÑï αñçαñ╕αñòαÑç αñ╕αñ╛αñÑ αñòαÑïαñê αñàαñ¿αÑìαñ» αñ▓αñòαÑìαñ╖αñú αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑï αñ░αñ╣αÑç αñ╣αÑêαñé?',
    type: 'multiselect',
    options: [
      { id: 'shortness_of_breath', label: 'Breathlessness / Difficulty Breathing', label_hi: 'αñ╕αñ╛αñéαñ╕ αñ½αÑéαñ▓αñ¿αñ╛ / αñ╕αñ╛αñéαñ╕ αñ▓αÑçαñ¿αÑç αñ«αÑçαñé αññαñòαñ▓αÑÇαñ½', isUrgent: true },
      { id: 'cold_sweats', label: 'Cold Sweating & Dizziness', label_hi: 'αñáαñéαñíαñ╛ αñ¬αñ╕αÑÇαñ¿αñ╛ αñåαñ¿αñ╛ αñÅαñ╡αñé αñÜαñòαÑìαñòαñ░ αñ«αñ╣αñ╕αÑéαñ╕ αñ╣αÑïαñ¿αñ╛', isUrgent: true },
      { id: 'nausea_vomiting', label: 'Nausea or Vomiting', label_hi: 'αñëαñ▓αÑìαñƒαÑÇ αñ»αñ╛ αñ«αñ┐αñÜαñ▓αÑÇ (αñ£αÑÇ αñ«αñ┐αñÜαñ▓αñ╛αñ¿αñ╛)' },
      { id: 'cough', label: 'Persistent Coughing', label_hi: 'αñ▓αñùαñ╛αññαñ╛αñ░ αñûαñ╛αñéαñ╕αÑÇ αñåαñ¿αñ╛' },
      { id: 'fever', label: 'High Body Temperature', label_hi: 'αññαÑçαñ£ αñ¼αÑüαñûαñ╛αñ░' }
    ]
  },
  severity: {
    id: 'severity',
    title: 'How severe is the pain/discomfort on a scale of 1 to 10?',
    title_hi: '1 αñ╕αÑç 10 αñòαÑç αñ¬αÑêαñ«αñ╛αñ¿αÑç αñ¬αñ░ αñªαñ░αÑìαñª αñòαñ┐αññαñ¿αñ╛ αññαÑÇαñ╡αÑìαñ░ αñ╣αÑê?',
    type: 'rating_scale',
    min: 1,
    max: 10
  }
};

export const AYUSH_QUESTIONS = {
  prakriti: {
    id: 'prakriti',
    title: 'Prakriti Assessment (Body Constitution & Dominant Dosha)',
    title_hi: 'αñ¬αÑìαñ░αñòαÑâαññαñ┐ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú (αññαÑìαñ░αñ┐αñªαÑïαñ╖ αñ¿αñ┐αñ░αÑìαñºαñ╛αñ░αñú)',
    type: 'choice',
    options: [
      { id: 'vata', label: 'Vata Dominant (Light build, dry skin, quick mind, active, irregular digestion)', label_hi: 'αñ╡αñ╛αññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ╣αñ▓αÑìαñòαñ╛ αñ╢αñ░αÑÇαñ░, αñ░αÑéαñûαÑÇ αññαÑìαñ╡αñÜαñ╛, αñÜαñéαñÜαñ▓ αñ«αñ¿, αñàαñ¿αñ┐αñ╢αÑìαñÜαñ┐αññ αñ¬αñ╛αñÜαñ¿)' },
      { id: 'pitta', label: 'Pitta Dominant (Medium build, warm body, strong digestion, sharp intellect)', label_hi: 'αñ¬αñ┐αññαÑìαññ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñºαÑìαñ»αñ« αñ╢αñ░αÑÇαñ░, αñùαñ░αÑìαñ« αññαÑìαñ╡αñÜαñ╛, αññαÑçαñ£ αñ¬αñ╛αñÜαñ¿, αñÅαñòαñ╛αñùαÑìαñ░ αñ¼αÑüαñªαÑìαñºαñ┐)' },
      { id: 'kapha', label: 'Kapha Dominant (Solid build, smooth skin, calm demeanor, steady digestion)', label_hi: 'αñòαñ½ αñ¬αÑìαñ░αñºαñ╛αñ¿ (αñ«αñ£αñ¼αÑéαññ αñ╢αñ░αÑÇαñ░, αñÜαñ┐αñòαñ¿αÑÇ αññαÑìαñ╡αñÜαñ╛, αñ╢αñ╛αñéαññ αñ╕αÑìαñ╡αñ¡αñ╛αñ╡, αñ╕αñ╣αñ¿αñ╢αÑÇαñ▓αññαñ╛)' },
      { id: 'tridosha', label: 'Dual / Mixed (Vata-Pitta / Pitta-Kapha)', label_hi: 'αñ«αñ┐αñ╢αÑìαñ░αñ┐αññ αñ¬αÑìαñ░αñòαÑâαññαñ┐ (αñ╡αñ╛αññ-αñ¬αñ┐αññαÑìαññ / αñ¬αñ┐αññαÑìαññ-αñòαñ½)' }
    ]
  },
  agni: {
    id: 'agni',
    title: 'Agni Pariksha (Digestive Fire Capacity)',
    title_hi: 'αñàαñùαÑìαñ¿αñ┐ αñ¬αñ░αÑÇαñòαÑìαñ╖αñú (αñ¬αñ╛αñÜαñ¿ αñòαÑìαñ╖αñ«αññαñ╛)',
    type: 'choice',
    options: [
      { id: 'sama_agni', label: 'Sama Agni (Normal, balanced appetite and smooth digestion)', label_hi: 'αñ╕αñ« αñàαñùαÑìαñ¿αñ┐ (αñ╕αñ╛αñ«αñ╛αñ¿αÑìαñ», αñ╕αñéαññαÑüαñ▓αñ┐αññ αñ¡αÑéαñû αñÅαñ╡αñé αñ╕αÑüαñÜαñ╛αñ░αÑé αñ¬αñ╛αñÜαñ¿)' },
      { id: 'manda_agni', label: 'Manda Agni (Sluggish digestion, heaviness after meals, low appetite)', label_hi: 'αñ«αñéαñª αñàαñùαÑìαñ¿αñ┐ (αñºαÑÇαñ«αÑÇ αñ¬αñ╛αñÜαñ¿ αñ╢αñòαÑìαññαñ┐, αñûαñ╛αñ¿αÑç αñòαÑç αñ¼αñ╛αñª αñ¡αñ╛αñ░αÑÇαñ¬αñ¿, αñòαñ« αñ¡αÑéαñû)' },
      { id: 'tikshna_agni', label: 'Tikshna Agni (Hyperactive digestion, frequent intense hunger, acidity)', label_hi: 'αññαÑÇαñòαÑìαñ╖αÑìαñú αñàαñùαÑìαñ¿αñ┐ (αñàαññαÑìαñ»αñºαñ┐αñò αññαÑÇαñ╡αÑìαñ░ αñ¡αÑéαñû, αñ╕αÑÇαñ¿αÑç αñ«αÑçαñé αñ£αñ▓αñ¿, αññαÑçαñ£ αññαÑçαñ£αñ╛αñ¼αñ┐αñ»αññ)' },
      { id: 'vishama_agni', label: 'Vishama Agni (Irregular, unpredictable digestive capacity)', label_hi: 'αñ╡αñ┐αñ╖αñ« αñàαñùαÑìαñ¿αñ┐ (αñàαñ¿αñ┐αñ╢αÑìαñÜαñ┐αññ, αñòαñ¡αÑÇ αññαÑçαñ£ αññαÑï αñòαñ¡αÑÇ αñ«αñéαñª αñ¬αñ╛αñÜαñ¿)' }
    ]
  },
  koshtha: {
    id: 'koshtha',
    title: 'Koshtha Pariksha (Bowel Nature & Elimination)',
    title_hi: 'αñòαÑïαñ╖αÑìαñá αñ¬αñ░αÑÇαñòαÑìαñ╖αñú (αñ¬αÑçαñƒ αñòαÑÇ αñ╕αñ½αñ╛αñê αñòαÑÇ αñ¬αÑìαñ░αñòαÑâαññαñ┐)',
    type: 'choice',
    options: [
      { id: 'krura', label: 'Krura Koshtha (Tendency towards constipation, hard bowel movements)', label_hi: 'αñòαÑìαñ░αÑéαñ░ αñòαÑïαñ╖αÑìαñá (αñòαñ¼αÑìαñ£ αñòαÑÇ αñ╢αñ┐αñòαñ╛αñ»αññ, αñ«αñ▓ αññαÑìαñ»αñ╛αñù αñ«αÑçαñé αñòαñáαñ┐αñ¿αñ╛αñê)' },
      { id: 'mridu', label: 'Mridu Koshtha (Soft bowel movements, sensitive to milk/spices)', label_hi: 'αñ«αÑâαñªαÑü αñòαÑïαñ╖αÑìαñá (αñ¿αñ░αñ« αñ«αñ▓, αñªαÑéαñº αñ»αñ╛ αñ«αñ┐αñ░αÑìαñÜ-αñ«αñ╕αñ╛αñ▓αÑç αñ╕αÑç αññαÑüαñ░αñéαññ αñªαñ╕αÑìαññ)' },
      { id: 'madhyama', label: 'Madhyama Koshtha (Regular, comfortable daily bowel elimination)', label_hi: 'αñ«αñºαÑìαñ»αñ« αñòαÑïαñ╖αÑìαñá (αñ¿αñ┐αñ»αñ«αñ┐αññ, αñåαñ░αñ╛αñ«αñªαñ╛αñ»αñò αñ¬αÑçαñƒ αñòαÑÇ αñ╕αñ½αñ╛αñê)' }
    ]
  },
  ahara_vihara: {
    id: 'ahara_vihara',
    title: 'Ahara-Vihara (Dietary & Daily Lifestyle Routine)',
    title_hi: 'αñåαñ╣αñ╛αñ░-αñ╡αñ┐αñ╣αñ╛αñ░ (αñûαñ╛αñ¿-αñ¬αñ╛αñ¿ αñÅαñ╡αñé αñ£αÑÇαñ╡αñ¿αñ╢αÑêαñ▓αÑÇ)',
    type: 'multiselect',
    options: [
      { id: 'spicy_oily', label: 'High consumption of spicy/oily/junk food', label_hi: 'αññαñ▓αñ╛-αñ¡αÑüαñ¿αñ╛ / αñ«αñ┐αñ░αÑìαñÜ-αñ«αñ╕αñ╛αñ▓αÑçαñªαñ╛αñ░ / αñ£αñéαñò αñ½αÑéαñí αñòαñ╛ αñàαñºαñ┐αñò αñ╕αÑçαñ╡αñ¿' },
      { id: 'irregular_sleep', label: 'Late night sleep / Irregular sleep schedule', label_hi: 'αñªαÑçαñ░ αñ░αñ╛αññ αññαñò αñ£αñ╛αñùαñ¿αñ╛ / αñàαñ¿αñ┐αñ»αñ«αñ┐αññ αñ¿αÑÇαñéαñª' },
      { id: 'high_stress', label: 'High mental stress / Sedentary routine', label_hi: 'αñ«αñ╛αñ¿αñ╕αñ┐αñò αññαñ¿αñ╛αñ╡ / αñ╢αñ╛αñ░αÑÇαñ░αñ┐αñò αñùαññαñ┐αñ╡αñ┐αñºαñ┐ αñòαÑÇ αñòαñ«αÑÇ' },
      { id: 'healthy_balanced', label: 'Fresh sattvic food & regular routine', label_hi: 'αññαñ╛αñ£αñ╛ αñ╕αñ╛αññαÑìαñ╡αñ┐αñò αñ¡αÑïαñ£αñ¿ αñÅαñ╡αñé αñ¿αñ┐αñ»αñ«αñ┐αññ αñªαñ┐αñ¿αñÜαñ░αÑìαñ»αñ╛' }
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
      redFlags.push(`High Fever Alert: Temperature ${temp}┬░C.`);
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
