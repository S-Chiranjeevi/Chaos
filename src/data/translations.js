/**
 * Multilingual Translations Dictionary for Luna Her
 * 
 * Supports:
 * - English (en)
 * - Hindi (hi - हिन्दी)
 * - Kannada (kn - ಕನ್ನಡ)
 * - Tamil (ta - தமிழ்)
 * - Telugu (te - తెలుగు)
 * - Marathi (mr - मराठी)
 * - Bengali (bn - বাংলা)
 * - Malayalam (ml - മലയാളം)
 * 
 * Includes safe fallback mechanism:
 * Never hides or mistranslates safety information.
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', script: 'Latin' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', script: 'Devanagari' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', script: 'Kannada' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', script: 'Tamil' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', script: 'Telugu' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', script: 'Bengali' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', script: 'Malayalam' },
];

export const TRANSLATIONS = {
  "en": {
    "disclaimer": {
      "standard": "This is information, not a diagnosis.",
      "pcosGuidance": "These symptoms can sometimes occur with PCOS, but they can also have other causes.",
      "full": "LunaHer is an informational tool and does not provide clinical diagnosis or treatment. Always consult a certified medical practitioner or gynecologist for diagnosis and clinical care."
    },
    "nav": {
      "home": "Home",
      "talk": "Talk or Type",
      "tracker": "Cycle Insights & Forecast",
      "summary": "Doctor Summary",
      "learn": "Learn and Myths",
      "patterns": "Early Warnings",
      "trackerShort": "Cycle",
      "insights": "Early Warnings and Insights",
      "insightsShort": "Insights",
      "screening": "PCOS Research Screening",
      "screeningShort": "Screening",
      "doctor": "Doctor Summary",
      "doctorShort": "Doctor",
      "learnShort": "Learn",
      "privacyNote": "Your health notes stay on this device."
    },
    "safetyWarnings": {
      "urgentTitle": "Please seek urgent medical care",
      "urgentDesc": "Severe pain or very heavy bleeding can require immediate medical attention.",
      "urgentAction": "Contact local emergency services or visit an urgent care facility.",
      "redFlagFever": "Fever with severe pelvic pain",
      "redFlagHeavy": "Very heavy menstrual bleeding",
      "redFlagDizziness": "Fainting or dizziness with bleeding",
      "redFlagPregnancy": "Possible pregnancy with pain or bleeding",
      "redFlagWeakness": "Severe or sudden weakness"
    },
    "buttons": {
      "understandSymptoms": "Understand my symptoms",
      "logPeriod": "Log Period Date",
      "logSymptom": "Log Symptom",
      "copySummary": "Copy Summary",
      "copied": "Copied to Clipboard!",
      "printSummary": "Print Summary",
      "downloadText": "Download Text (.txt)",
      "exportJson": "Export JSON",
      "addInsight": "Add Selected Insight",
      "clearSummary": "Clear Summary",
      "editSummary": "Edit Summary",
      "save": "Save Changes",
      "cancel": "Cancel",
      "dismiss": "Dismiss",
      "addDoctorSummary": "Add to Doctor Summary",
      "addedDoctorSummary": "Added to Doctor Summary",
      "retry": "Retry Voice",
      "typeInstead": "Type Instead",
      "change": "Change",
      "backToHome": "Back to Home Dashboard"
    },
    "emptyStates": {
      "noPatterns": "Keep logging periods and symptoms. We’ll help you notice patterns over time.",
      "noSymptoms": "No symptoms recorded yet. Type or speak what you are experiencing.",
      "noDoctorSummary": "No doctor summary created yet. Log your cycles or describe your symptoms to generate your brief.",
      "noCycleEntries": "No cycle entries logged yet. Add your period start dates to track regularity."
    },
    "errorStates": {
      "permissionDenied": "Microphone permission was denied. Please allow microphone access in your browser address bar to use voice input, or type below.",
      "unsupportedBrowser": "Speech Recognition is not supported by your current browser. You can still type your symptoms freely!",
      "networkError": "Network connection error during speech recognition. Please check your connection and try again.",
      "couldNotHear": "We could not hear you. Try again.",
      "listening": "Listening…",
      "tapToStop": "Tap to stop"
    },
    "trackerLabels": {
      "periodStartDate": "Period Start Date",
      "periodEndDate": "Period End Date",
      "cycleLength": "Cycle Length",
      "averageCycleLength": "Average Cycle Length",
      "symptomName": "Symptom Name",
      "severity": "Severity",
      "duration": "Duration",
      "frequency": "Frequency",
      "notes": "Notes",
      "mild": "Mild",
      "moderate": "Moderate",
      "severe": "Severe",
      "unspecified": "Unspecified"
    },
    "summaryLabels": {
      "title": "Clinician Discussion Summary",
      "subtitle": "A structured, non-diagnostic overview prepared for your appointment",
      "mainSymptoms": "Main Symptoms",
      "cycleHistory": "Cycle History & Regularity",
      "averageCycleLengthLabel": "Average Cycle Length",
      "repeatedPatterns": "Observed Patterns",
      "redFlags": "Immediate Attention Items",
      "suggestedSpecialist": "Suggested Specialist",
      "questionsForDoctor": "Questions to Ask Your Doctor",
      "personalizedInsights": "Personalized Care Insights",
      "userNotes": "Personal Notes & Goals",
      "actions": "Summary Actions",
      "doctorDiscussionReady": "Ready for Doctor Discussion",
      "rotterdamNote": "Evaluation according to clinical criteria (such as Rotterdam criteria) requires professional medical testing."
    },
    "homePage": {
      "heroEyebrow": "A gentle place to begin",
      "heroTitle": "Your health, in your words.",
      "heroDescription": "You do not need medical words or all the answers. Choose one thing that would help you today.",
      "heroButton": "Describe my symptoms",
      "sectionEyebrow": "Choose what feels useful",
      "sectionTitle": "How can we help today?",
      "talkLabel": "Describe my symptoms",
      "talkDetail": "Write or say what you notice, using your own words.",
      "trackerLabel": "Track my cycle",
      "trackerDetail": "Add a period date if you would like to keep a record.",
      "insightsLabel": "View my insights",
      "insightsDetail": "Review notes you have saved on this device.",
      "screeningLabel": "PCOS Research Screening",
      "screeningDetail": "Screen clinical and lab values using AMD-SlingShot ML models.",
      "doctorLabel": "Prepare for a doctor visit",
      "doctorDetail": "Make a simple summary and questions to bring.",
      "learnLabel": "Learn about PCOS",
      "learnDetail": "Read clear, gentle information and myth checks.",
      "footnote": "Take your time. You can skip any step and come back later."
    },
    "talkPage": {
      "title": "Talk or Type with LumaHer",
      "description": "Describe symptoms in your own words, by voice or text. Results are educational, not diagnostic.",
      "badge": "Private Companion",
      "backHome": "Back to Home Dashboard"
    },
    "trackerPage": {
      "eyebrow": "Data-based cycle observations, on your device",
      "title": "Cycle Insights & Forecast",
      "description": "Record period dates to observe your cycle trends, view transparent irregularity classifications, and receive estimated upcoming windows."
    },
    "insightsPage": {
      "eyebrow": "Personal pattern recognition",
      "title": "Early Warnings and Insights",
      "description": "Review repeated patterns, cycle observations, and safety flags detected from your logs."
    },
    "learnPage": {
      "eyebrow": "Learn at your own pace",
      "title": "Learn and myths",
      "description": "Short, clear information can help you prepare questions. It cannot diagnose a condition."
    },
    "chatbot": {
      "launcherOpen": "Close chat",
      "launcherClosed": "Ask LumaHer",
      "title": "Ask LumaHer",
      "subtitle": "Private, local guidance",
      "safetyNote": "Urgent symptoms are checked before guidance.",
      "placeholder": "Ask about tracking or preparing for a visit"
    }
  },
  "hi": {
    "disclaimer": {
      "standard": "यह जानकारी है, कोई निदान (डायग्नोसिस) नहीं।",
      "pcosGuidance": "ये लक्षण कभी-कभी PCOS के साथ हो सकते हैं, लेकिन इनके अन्य कारण भी हो सकते हैं।",
      "full": "सखीकेयर केवल सूचनात्मक उपकरण है और कोई चिकित्सीय निदान प्रदान नहीं करता है। उचित मूल्यांकन के लिए हमेशा योग्य चिकित्सक से संपर्क करें।"
    },
    "nav": {
      "home": "होम",
      "talk": "बोलें या लिखें",
      "tracker": "साइकिल इनसाइट्स और पूर्वानुमान",
      "summary": "डॉक्टर सारांश",
      "learn": "तथ्य और मिथक",
      "patterns": "शुरुआती चेतावनी",
      "trackerShort": "साइकिल",
      "insights": "शुरुआती चेतावनी और अंतर्दृष्टि",
      "insightsShort": "अंतर्दृष्टि",
      "screening": "PCOS रिसर्च स्क्रीनिंग",
      "screeningShort": "स्क्रीनिंग",
      "doctor": "डॉक्टर सारांश",
      "doctorShort": "डॉक्टर",
      "learnShort": "सीखें",
      "privacyNote": "आपका स्वास्थ्य डेटा आपके डिवाइस पर सुरक्षित रहता है।"
    },
    "safetyWarnings": {
      "urgentTitle": "कृपया तुरंत आपातकालीन चिकित्सा सहायता लें",
      "urgentDesc": "बहुत तेज़ दर्द या बहुत भारी रक्तस्राव को तत्काल चिकित्सीय देखभाल की आवश्यकता हो सकती है।",
      "urgentAction": "स्थानीय आपातकालीन सेवाओं से संपर्क करें या तुरंत नजदीकी अस्पताल जाएँ।",
      "redFlagFever": "तेज़ बुखार के साथ पेल्विक दर्द",
      "redFlagHeavy": "अत्यधिक भारी मासिक रक्तस्राव",
      "redFlagDizziness": "रक्तस्राव के साथ चक्कर आना या बेहोशी",
      "redFlagPregnancy": "दर्द या रक्तस्राव के साथ संभावित गर्भावस्था",
      "redFlagWeakness": "अचानक अत्यधिक कमजोरी"
    },
    "buttons": {
      "understandSymptoms": "मेरे लक्षण समझें",
      "logPeriod": "पीरियड की तारीख जोड़ें",
      "logSymptom": "लक्षण जोड़ें",
      "copySummary": "सारांश कॉपी करें",
      "copied": "कॉपी हो गया!",
      "printSummary": "प्रिंट करें",
      "downloadText": "टेक्स्ट डाउनलोड करें (.txt)",
      "exportJson": "JSON एक्सपोर्ट करें",
      "addInsight": "सुझाव जोड़ें",
      "clearSummary": "सारांश साफ़ करें",
      "editSummary": "सारांश संपादित करें",
      "save": "सुरक्षित करें",
      "cancel": "रद्द करें",
      "dismiss": "हटाएं",
      "addDoctorSummary": "डॉक्टर सारांश में जोड़ें",
      "addedDoctorSummary": "डॉक्टर सारांश में जुड़ा हुआ",
      "retry": "पुनः प्रयास करें",
      "typeInstead": "इसके बजाय टाइप करें",
      "change": "बदलें",
      "backToHome": "होम डैशबोर्ड पर वापस जाएं"
    },
    "emptyStates": {
      "noPatterns": "पीरियड्स और लक्षण दर्ज करते रहें। हम समय के साथ पैटर्न समझने में आपकी मदद करेंगे।",
      "noSymptoms": "अभी तक कोई लक्षण दर्ज नहीं किया गया है। आप जो महसूस कर रहे हैं उसे लिखें या बोलें।",
      "noDoctorSummary": "अभी तक कोई डॉक्टर सारांश नहीं बना है। अपने चक्र या लक्षण दर्ज करें।",
      "noCycleEntries": "अभी तक कोई पीरियड दर्ज नहीं हुआ है।"
    },
    "errorStates": {
      "permissionDenied": "माइक्रोफ़ोन की अनुमति अस्वीकृत कर दी गई थी। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।",
      "unsupportedBrowser": "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। आप नीचे टाइप कर सकते हैं।",
      "networkError": "नेटवर्क कनेक्शन में समस्या आई है। कृपया पुनः प्रयास करें।",
      "couldNotHear": "हम आपकी आवाज़ नहीं सुन सके। कृपया पुनः प्रयास करें।",
      "listening": "सुन रहे हैं…",
      "tapToStop": "रोकने के लिए टैप करें"
    },
    "trackerLabels": {
      "periodStartDate": "पीरियड शुरू होने की तारीख",
      "periodEndDate": "पीरियड खत्म होने की तारीख",
      "cycleLength": "चक्र की लंबाई",
      "averageCycleLength": "औसत चक्र लंबाई",
      "symptomName": "लक्षण का नाम",
      "severity": "गंभीरता",
      "duration": "अवधि",
      "frequency": "आवृत्ति",
      "notes": "टिप्पणी",
      "mild": "हल्का",
      "moderate": "मध्यम",
      "severe": "गंभीर",
      "unspecified": "अनिर्दिष्ट"
    },
    "summaryLabels": {
      "title": "डॉक्टर परामर्श सारांश",
      "subtitle": "आपकी अगली मुलाकात के लिए तैयार की गई व्यवस्थित जानकारी",
      "mainSymptoms": "प्रमुख लक्षण",
      "cycleHistory": "मासिक चक्र इतिहास",
      "averageCycleLengthLabel": "औसत चक्र लंबाई",
      "repeatedPatterns": "देखे गए पैटर्न",
      "redFlags": "त्वरित ध्यान देने योग्य बिंदु",
      "suggestedSpecialist": "सुझाए गए विशेषज्ञ",
      "questionsForDoctor": "डॉक्टर से पूछने योग्य प्रश्न",
      "personalizedInsights": "व्यक्तिगत स्वास्थ्य सुझाव",
      "userNotes": "आपकी टिप्पणियाँ",
      "actions": "सारांश विकल्प",
      "doctorDiscussionReady": "डॉक्टर से चर्चा के लिए तैयार",
      "rotterdamNote": "PCOS का आधिकारिक निदान केवल योग्य चिकित्सक ही रक्त परीक्षण और जांच द्वारा कर सकते हैं।"
    },
    "homePage": {
      "heroEyebrow": "शुरुआत के लिए एक सहज स्थान",
      "heroTitle": "आपका स्वास्थ्य, आपके शब्दों में।",
      "heroDescription": "आपको चिकित्सीय शब्दों की आवश्यकता नहीं है। चुनें कि आज आपकी क्या मदद कर सकता है।",
      "heroButton": "अपने लक्षण बताएं",
      "sectionEyebrow": "उपयोगी विकल्प चुनें",
      "sectionTitle": "आज हम आपकी कैसे मदद कर सकते हैं?",
      "talkLabel": "अपने लक्षण बताएं",
      "talkDetail": "बोलकर या लिखकर बताएं कि आप क्या महसूस कर रही हैं।",
      "trackerLabel": "साइकिल ट्रैक करें",
      "trackerDetail": "रिकॉर्ड रखने के लिए पीरियड की तारीख जोड़ें।",
      "insightsLabel": "मेरी अंतर्दृष्टि देखें",
      "insightsDetail": "इस डिवाइस पर सुरक्षित अपने नोट्स की समीक्षा करें।",
      "screeningLabel": "PCOS रिसर्च स्क्रीनिंग",
      "screeningDetail": "नैदानिक और प्रयोगशाला मूल्यों की स्क्रीनिंग करें।",
      "doctorLabel": "डॉक्टर की सलाह की तैयारी",
      "doctorDetail": "डॉक्टर के पास ले जाने के लिए सारांश और प्रश्न तैयार करें।",
      "learnLabel": "PCOS के बारे में जानें",
      "learnDetail": "स्पष्ट जानकारी और मिथकों की जांच पढ़ें।",
      "footnote": "अपना समय लें। आप किसी भी कदम को छोड़कर बाद में वापस आ सकती हैं।"
    },
    "talkPage": {
      "title": "LumaHer के साथ बोलें या लिखें",
      "description": "अपने लक्षणों को अपनी आवाज़ या शब्दों में बताएं। परिणाम शैक्षिक हैं, निदान नहीं।",
      "badge": "निजी साथी",
      "backHome": "होम डैशबोर्ड पर वापस जाएं"
    },
    "trackerPage": {
      "eyebrow": "डेटा-आधारित साइकिल अवलोकन, आपके डिवाइस पर",
      "title": "साइकिल इनसाइट्स और पूर्वानुमान",
      "description": "अपनी साइकिल के रुझान देखने और आगामी तारीखों का अनुमान पाने के लिए पीरियड दर्ज करें।"
    },
    "insightsPage": {
      "eyebrow": "व्यक्तिगत पैटर्न पहचान",
      "title": "शुरुआती चेतावनी और अंतर्दृष्टि",
      "description": "अपने रिकॉर्ड से दोहराए जाने वाले पैटर्न और सुरक्षा अलर्ट की समीक्षा करें।"
    },
    "learnPage": {
      "eyebrow": "अपनी गति से सीखें",
      "title": "तथ्य और मिथक",
      "description": "सटीक जानकारी प्रश्न तैयार करने में मदद करती है। यह कोई निदान नहीं है।"
    },
    "chatbot": {
      "launcherOpen": "चैट बंद करें",
      "launcherClosed": "LumaHer से पूछें",
      "title": "LumaHer से पूछें",
      "subtitle": "निजी, स्थानीय मार्गदर्शन",
      "safetyNote": "गंभीर लक्षणों की पहले जांच की जाती है।",
      "placeholder": "ट्रैकिंग या डॉक्टर की मुलाकात के बारे में पूछें"
    }
  },
  "kn": {
    "disclaimer": {
      "standard": "ಇದು ಮಾಹಿತಿ ಮಾತ್ರ, ಯಾವುದೇ ರೋಗನಿರ್ಣಯವಲ್ಲ.",
      "pcosGuidance": "ಈ ಲಕ್ಷಣಗಳು ಕೆಲವೊಮ್ಮೆ PCOS ನಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳಬಹುದು, ಆದರೆ ಇತರ ಕಾರಣಗಳೂ ಇರಬಹುದು.",
      "full": "ಸಖಿಕೇರ್ ಕೇವಲ ಮಾಹಿತಿ ನೀಡುವ ಸಾಧನವಾಗಿದ್ದು, ಯಾವುದೇ ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವನ್ನು ಒದಗಿಸುವುದಿಲ್ಲ. ಯಾವಾಗಲೂ ತಜ್ಞ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
    },
    "nav": {
      "home": "ಮುಖಪುಟ",
      "talk": "ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ",
      "tracker": "ಋತುಚಕ್ರ ಮಾಹಿತಿ ಮತ್ತು ಮುನ್ಸೂಚನೆ",
      "summary": "ವೈದ್ಯರ ಸಾರಾಂಶ",
      "learn": "ಮಾಹಿತಿ ಮತ್ತು ತಪ್ಪು ಕಲ್ಪನೆಗಳು",
      "patterns": "ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು",
      "trackerShort": "ಋತುಚಕ್ರ",
      "insights": "ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಒಳನೋಟಗಳು",
      "insightsShort": "ಒಳನೋಟ",
      "screening": "PCOS ಸಂಶೋಧನಾ ತಪಾಸಣೆ",
      "screeningShort": "ತಪಾಸಣೆ",
      "doctor": "ವೈದ್ಯರ ಸಾರಾಂಶ",
      "doctorShort": "ವೈದ್ಯರು",
      "learnShort": "ತಿಳಿಯಿರಿ",
      "privacyNote": "ನಿಮ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿಯು ಈ ಸಾಧನದಲ್ಲೇ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ।"
    },
    "safetyWarnings": {
      "urgentTitle": "ದಯವಿಟ್ಟು ತಕ್ಷಣ ತುರ್ತು ವೈದ್ಯಕೀಯ ನೆರವು ಪಡೆಯಿರಿ",
      "urgentDesc": "ತೀವ್ರವಾದ ಹೊಟ್ಟೆ ನೋವು ಅಥವಾ ಅತಿಯಾದ ರಕ್ತಸ್ರಾವಕ್ಕೆ ತಕ್ಷಣದ ವೈದ್ಯಕೀಯ ಆರೈಕೆಯ ಅಗತ್ಯವಿರುತ್ತದೆ.",
      "urgentAction": "ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.",
      "redFlagFever": "ಜ್ವರದೊಂದಿಗೆ ತೀವ್ರ ಕಿಬ್ಬೊಟ್ಟೆ ನೋವು",
      "redFlagHeavy": "ಅತಿಯಾದ ಮುಟ್ಟಿನ ರಕ್ತಸ್ರಾವ",
      "redFlagDizziness": "ರಕ್ತಸ್ರಾವದೊಂದಿಗೆ ತಲೆತಿರುಗುವಿಕೆ ಅಥವಾ ಮೂರ್ಛೆ",
      "redFlagPregnancy": "ನೋವು ಅಥವಾ ರಕ್ತಸ್ರಾವದೊಂದಿಗೆ ಸಂಭವನೀಯ ಗರ್ಭಧಾರಣೆ",
      "redFlagWeakness": "ತೀವ್ರ ದೌರ್ಬಲ್ಯ"
    },
    "buttons": {
      "understandSymptoms": "ನನ್ನ ಲಕ್ಷಣಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
      "logPeriod": "ಮುಟ್ಟಿನ ದಿನಾಂಕ ನಮೂದಿಸಿ",
      "logSymptom": "ಲಕ್ಷಣ ನಮೂದಿಸಿ",
      "copySummary": "ಸಾರಾಂಶ ನಕಲಿಸಿ",
      "copied": "ನಕಲಿಸಲಾಗಿದೆ!",
      "printSummary": "ಪ್ರಿಂಟ್ ಮಾಡಿ",
      "downloadText": "ಪಠ್ಯ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (.txt)",
      "exportJson": "JSON ರಫ್ತು ಮಾಡಿ",
      "addInsight": "ಮಾಹಿತಿ ಸೇರಿಸಿ",
      "clearSummary": "ಸಾರಾಂಶ ಅಳಿಸಿ",
      "editSummary": "ಸಂಪಾದಿಸಿ",
      "save": "ಉಳಿಸಿ",
      "cancel": "ರದ್ದುಮಾಡಿ",
      "dismiss": "ತೆಗೆದುಹಾಕಿ",
      "addDoctorSummary": "ವೈದ್ಯರ ಸಾರಾಂಶಕ್ಕೆ ಸೇರಿಸಿ",
      "addedDoctorSummary": "ಸಾರಾಂಶಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ",
      "retry": "ಮರುಪ್ರಯತ್ನಿಸಿ",
      "typeInstead": "ಟೈಪ್ ಮಾಡಿ",
      "change": "ಬದಲಾಯಿಸಿ",
      "backToHome": "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ"
    },
    "emptyStates": {
      "noPatterns": "ಮುಟ್ಟು ಮತ್ತು ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸುತ್ತಿರಿ. ಕಾಲಕ್ರಮೇಣ ನಮೂನೆಗಳನ್ನು ಗುರುತಿಸಲು ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.",
      "noSymptoms": "ಇನ್ನೂ ಯಾವುದೇ ಲಕ್ಷಣಗಳು ದಾಖಲಾಗಿಲ್ಲ. ನೀವು ಅನುಭವಿಸುತ್ತಿರುವುದನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ.",
      "noDoctorSummary": "ಇನ್ನೂ ವೈದ್ಯರ ಸಾರಾಂಶ ಸಿದ್ಧವಾಗಿಲ್ಲ. ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
      "noCycleEntries": "ಯಾವುದೇ ಮುಟ್ಟಿನ ವಿವರಗಳು ನಮೂದಾಗಿಲ್ಲ."
    },
    "errorStates": {
      "permissionDenied": "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅನುಮತಿಸಿ.",
      "unsupportedBrowser": "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು.",
      "networkError": "ನೆಟ್‌ವರ್ಕ್ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.",
      "couldNotHear": "ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.",
      "listening": "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ…",
      "tapToStop": "ನಿಲ್ಲಿಸಲು ಸ್ಪರ್ಶಿಸಿ"
    },
    "trackerLabels": {
      "periodStartDate": "ಮುಟ್ಟು ಆರಂಭವಾದ ದಿನಾಂಕ",
      "periodEndDate": "ಮುಟ್ಟು ಮುಕ್ತಾಯವಾದ ದಿನಾಂಕ",
      "cycleLength": "ಚಕ್ರದ ಅವಧಿ",
      "averageCycleLength": "ಸರಾಸರಿ ಚಕ್ರದ ಅವಧಿ",
      "symptomName": "ಲಕ್ಷಣದ ಹೆಸರು",
      "severity": "ತೀವ್ರತೆ",
      "duration": "ಅವಧಿ",
      "frequency": "ಆವರ್ತನ",
      "notes": "ಟಿಪ್ಪಣಿಗಳು",
      "mild": "ಸ್ವಲ್ಪ",
      "moderate": "ಸಾಧಾರಣ",
      "severe": "ತೀವ್ರ",
      "unspecified": "ಅನಿರ್ದಿಷ್ಟ"
    },
    "summaryLabels": {
      "title": "ವೈದ್ಯರ ಸಮಾಲೋಚನೆ ಸಾರಾಂಶ",
      "subtitle": "ನಿಮ್ಮ ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿಗಾಗಿ ಸಿದ್ಧಪಡಿಸಿದ ವ್ಯವಸ್ಥಿತ ಮಾಹಿತಿ",
      "mainSymptoms": "ಪ್ರಮುಖ ಲಕ್ಷಣಗಳು",
      "cycleHistory": "ಋತುಚಕ್ರದ ಇತಿಹಾಸ",
      "averageCycleLengthLabel": "ಸರಾಸರಿ ಚಕ್ರದ ಅವಧಿ",
      "repeatedPatterns": "ಕಂಡುಬಂದ ನಮೂನೆಗಳು",
      "redFlags": "ತಕ್ಷಣ ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು",
      "suggestedSpecialist": "ಸೂಚಿಸಲಾದ ತಜ್ಞ ವೈದ್ಯರು",
      "questionsForDoctor": "ವೈದ್ಯರನ್ನು ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು",
      "personalizedInsights": "ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
      "userNotes": "ವೈಯಕ್ತಿಕ ಟಿಪ್ಪಣಿಗಳು",
      "actions": "ಸಾರಾಂಶದ ಆಯ್ಕೆಗಳು",
      "doctorDiscussionReady": "ವೈದ್ಯರ ಚರ್ಚೆಗೆ ಸಿದ್ಧ",
      "rotterdamNote": "PCOS ರೋಗನಿರ್ಣಯವನ್ನು ಕೇವಲ ಪ್ರಮಾಣೀಕೃತ ವೈದ್ಯರು ಮಾತ್ರ ಪರೀಕ್ಷೆಗಳ ಮೂಲಕ ಖಚಿತಪಡಿಸಲು ಸಾಧ್ಯ."
    },
    "homePage": {
      "heroEyebrow": "ಆರಂಭಿಸಲು ಒಂದು ಶಾಂತಿಯುತ ಸ್ಥಳ",
      "heroTitle": "ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಿಮ್ಮದೇ ಮಾತುಗಳಲ್ಲಿ.",
      "heroDescription": "ನಿಮಗೆ ವೈದ್ಯಕೀಯ ಪದಗಳು ಅಥವಾ ಎಲ್ಲಾ ಉತ್ತರಗಳು ತಿಳಿದಿರಬೇಕಾಗಿಲ್ಲ. ಇಂದು ನಿಮಗೆ ನೆರವಾಗುವ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
      "heroButton": "ನನ್ನ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ",
      "sectionEyebrow": "ನಿಮಗೆ ಉಪಯುಕ್ತವಾದದ್ದನ್ನು ಆರಿಸಿ",
      "sectionTitle": "ಇಂದು ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
      "talkLabel": "ನನ್ನ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ",
      "talkDetail": "ನಿಮ್ಮದೇ ಮಾತುಗಳಲ್ಲಿ ನೀವು ಅನುಭವಿಸುತ್ತಿರುವುದನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ.",
      "trackerLabel": "ನನ್ನ ಮುಟ್ಟಿನ ಚಕ್ರ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "trackerDetail": "ದಾಖಲೆಗಾಗಿ ನಿಮ್ಮ ಮುಟ್ಟಿನ ದಿನಾಂಕವನ್ನು ಸೇರಿಸಿ.",
      "insightsLabel": "ನನ್ನ ಒಳನೋಟಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      "insightsDetail": "ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾದ ನಿಮ್ಮ ಟಿಪ್ಪಣಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      "screeningLabel": "PCOS ಸಂಶೋಧನಾ ತಪಾಸಣೆ",
      "screeningDetail": "ಕ್ಲಿನಿಕಲ್ ಮತ್ತು ಲ್ಯಾಬ್ ಮೌಲ್ಯಗಳನ್ನು ಸ್ಕ್ರೀನಿಂಗ್ ಮಾಡಿ.",
      "doctorLabel": "ವೈದ್ಯರ ಭೇಟಿಗೆ ಸಿದ್ಧರಾಗಿ",
      "doctorDetail": "ವೈದ್ಯರೊಂದಿಗೆ ಚರ್ಚಿಸಲು ಸಾರಾಂಶ ಮತ್ತು ಪ್ರಶ್ನೆಗಳನ್ನು ರಚಿಸಿ.",
      "learnLabel": "PCOS ಬಗ್ಗೆ ತಿಳಿಯಿರಿ",
      "learnDetail": "ಸ್ಪಷ್ಟ ಮಾಹಿತಿ ಮತ್ತು ತಪ್ಪು ಕಲ್ಪನೆಗಳ ಪರಿಶೀಲನೆ ಓದಿ.",
      "footnote": "ನಿಧಾನವಾಗಿ ಮುಂದುವರಿಯಿರಿ. ನೀವು ಯಾವುದೇ ಹಂತವನ್ನು ಬಿಟ್ಟು ನಂತರ ಹಿಂತಿರುಗಬಹುದು."
    },
    "talkPage": {
      "title": "LumaHer ನೊಂದಿಗೆ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ",
      "description": "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ನಿಮ್ಮದೇ ಮಾತುಗಳಲ್ಲಿ ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ವಿವರಿಸಿ. ಫಲಿತಾಂಶಗಳು ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ ಮಾತ್ರ, ರೋಗನಿರ್ಣಯವಲ್ಲ.",
      "badge": "ಖಾಸಗಿ ಸಹವರ್ತಿ",
      "backHome": "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ"
    },
    "trackerPage": {
      "eyebrow": "ಡೇಟಾ ಆಧಾರಿತ ಮುಟ್ಟಿನ ಅವಲೋಕನಗಳು, ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ",
      "title": "ಋತುಚಕ್ರ ಮಾಹಿತಿ ಮತ್ತು ಮುನ್ಸೂಚನೆ",
      "description": "ನಿಮ್ಮ ಮುಟ್ಟಿನ ಟ್ರೆಂಡ್‌ಗಳನ್ನು ಗಮನಿಸಲು, ಅಕ್ರಮತೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮತ್ತು ಮುಂಬರುವ ದಿನಾಂಕಗಳ ಅಂದಾಜು ಪಡೆಯಲು ದಿನಾಂಕಗಳನ್ನು ದಾಖಲಿಸಿ."
    },
    "insightsPage": {
      "eyebrow": "ವೈಯಕ್ತಿಕ ಮಾದರಿ ಗುರುತಿಸುವಿಕೆ",
      "title": "ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಒಳನೋಟಗಳು",
      "description": "ನಿಮ್ಮ ದಾಖಲೆಗಳಿಂದ ಪುನರಾವರ್ತಿತ ಮಾದರಿಗಳು ಮತ್ತು ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
    },
    "learnPage": {
      "eyebrow": "ನಿಮ್ಮದೇ ವೇಗದಲ್ಲಿ ಕಲಿಯಿರಿ",
      "title": "ಮಾಹಿತಿ ಮತ್ತು ತಪ್ಪು ಕಲ್ಪನೆಗಳು",
      "description": "ಸರಳ ಮಾಹಿತಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ."
    },
    "chatbot": {
      "launcherOpen": "ಚಾಟ್ ಮುಚ್ಚಿ",
      "launcherClosed": "LumaHer ಅನ್ನು ಕೇಳಿ",
      "title": "LumaHer ಅನ್ನು ಕೇಳಿ",
      "subtitle": "ಖಾಸಗಿ, ಸ್ಥಳೀಯ ಮಾರ್ಗದರ್ಶನ",
      "safetyNote": "ತುರ್ತು ಲಕ್ಷಣಗಳನ್ನು ಮೊದಲು ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
      "placeholder": "ಟ್ರ್ಯಾಕಿಂಗ್ ಅಥವಾ ವೈದ್ಯರ ಭೇಟಿಯ ಬಗ್ಗೆ ಕೇಳಿ"
    }
  },
  "ta": {
    "disclaimer": {
      "standard": "இது தகவல் மட்டுமே, நோயறிதல் அல்ல.",
      "pcosGuidance": "இந்த அறிகுறிகள் சில நேரங்களில் PCOS உடன் ஏற்படலாம், ஆனால் அவற்றுக்கு வேறு காரணங்களும் இருக்கலாம்.",
      "full": "சகிகேர் தகவல் நோக்கங்களுக்கானது மட்டுமே. மருத்துவ ஆலோசனைக்கு தகுதியான மருத்துவரை அணுகவும்."
    },
    "nav": {
      "home": "முகப்பு",
      "talk": "பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்",
      "tracker": "சுழற்சி நுண்ணறிவு & முன்னறிவிப்பு",
      "summary": "மருத்துவர் சுருக்கம்",
      "learn": "அறிந்து கொள்ளுங்கள் & தவறான கருத்துக்கள்",
      "patterns": "முன்னெச்சரிக்கைகள்",
      "trackerShort": "சுழற்சி",
      "insights": "முன்னெச்சரிக்கை & நுண்ணறிவு",
      "insightsShort": "நுண்ணறிவு",
      "screening": "PCOS ஆராய்ச்சி பரிசோதனை",
      "screeningShort": "பரிசோதனை",
      "doctor": "மருத்துவர் சுருக்கம்",
      "doctorShort": "மருத்துவர்",
      "learnShort": "கற்க",
      "privacyNote": "உங்கள் சுகாதார குறிப்புகள் இந்த சாதனத்திலேயே இருக்கும்."
    },
    "safetyWarnings": {
      "urgentTitle": "தயவுசெய்து உடனடியாக அவசர மருத்துவ சிகிச்சை பெறவும்",
      "urgentDesc": "கடுமையான வலி அல்லது அதிக ரத்தப்போக்குக்கு உடனடி மருத்துவ கவனிப்பு தேவைப்படலாம்.",
      "urgentAction": "உள்ளூர் அவசர சிகிச்சை சேவைகளை தொடர்பு கொள்ளவும் அல்லது மருத்துவமனைக்கு செல்லவும்.",
      "redFlagFever": "காய்ச்சலுடன் கடுமையான அடிவயிற்று வலி",
      "redFlagHeavy": "மிக அதிக மாதவிடாய் ரத்தப்போக்கு",
      "redFlagDizziness": "ரத்தப்போக்குடன் தலைச்சுற்றல் அல்லது மயக்கம்",
      "redFlagPregnancy": "வலியுடன் கூடிய சாத்தியமான கர்ப்ப அறிகுறிகள்",
      "redFlagWeakness": "கடுமையான பலவீனம்"
    },
    "buttons": {
      "understandSymptoms": "என் அறிகுறிகளைப் புரிந்து கொள்ளுங்கள்",
      "logPeriod": "மாதவிடாய் தேதியைச் சேர்",
      "logSymptom": "அறிகுறியைச் சேர்",
      "copySummary": "சுருக்கத்தை நகலெடு",
      "copied": "நகலெடுக்கப்பட்டது!",
      "printSummary": "அச்சிடுக",
      "downloadText": "பதிவிறக்கம் (.txt)",
      "exportJson": "JSON ஏற்றுமதி செய்",
      "addInsight": "குறிப்பைச் சேர்",
      "clearSummary": "சுருக்கத்தை அழி",
      "editSummary": "திருத்து",
      "save": "சேமி",
      "cancel": "ரத்து செய்",
      "dismiss": "நீக்கு",
      "addDoctorSummary": "மருத்துவர் சுருக்கத்தில் சேர்",
      "addedDoctorSummary": "சுருக்கத்தில் சேர்க்கப்பட்டது",
      "retry": "மீண்டும் முயற்சி செய்",
      "typeInstead": "தட்டச்சு செய்",
      "change": "மாற்று",
      "backToHome": "முகப்புக்குத் திரும்பு"
    },
    "emptyStates": {
      "noPatterns": "மாதவிடாய் மற்றும் அறிகுறிகளைப் பதிவுசெய்து வாருங்கள். காலப்போக்கில் உடல் மாற்றங்களை அறிய உதவுவோம்.",
      "noSymptoms": "இதுவரை அறிகுறிகள் எதுவும் பதிவு செய்யப்படவில்லை. உங்கள் அனுபவங்களை எழுதுங்கள்.",
      "noDoctorSummary": "மருத்துவர் சுருக்கம் இன்னும் உருவாக்கப்படவில்லை.",
      "noCycleEntries": "மாதவிடாய் பதிவுகள் எதுவும் இல்லை."
    },
    "errorStates": {
      "permissionDenied": "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. அமைப்புகளில் அனுமதியை இயக்கவும்.",
      "unsupportedBrowser": "உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. தட்டச்சு செய்யலாம்.",
      "networkError": "நெட்வொர்க் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      "couldNotHear": "உங்கள் குரல் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.",
      "listening": "கேட்கிறது…",
      "tapToStop": "நிறுத்த தட்டவும்"
    },
    "trackerLabels": {
      "periodStartDate": "மாதவிடாய் தொடக்க தேதி",
      "periodEndDate": "மாதவிடாய் முடிவு தேதி",
      "cycleLength": "சுழற்சி காலம்",
      "averageCycleLength": "சராசரி சுழற்சி காலம்",
      "symptomName": "அறிகுறி பெயர்",
      "severity": "தீவிரம்",
      "duration": "கால அளவு",
      "frequency": "அதிர்வெண்",
      "notes": "குறிப்புகள்",
      "mild": "லேசான",
      "moderate": "மிதமான",
      "severe": "கடுமையான",
      "unspecified": "குறிப்பிடப்படவில்லை"
    },
    "summaryLabels": {
      "title": "மருத்துவர் ஆலோசனை சுருக்கம்",
      "subtitle": "மருத்துவ சந்திப்பிற்கு தயாராக வடிவமைக்கப்பட்ட அறிக்கை",
      "mainSymptoms": "முக்கிய அறிகுறிகள்",
      "cycleHistory": "மாதவிடாய் வரலாறு",
      "averageCycleLengthLabel": "சராசரி சுழற்சி காலம்",
      "repeatedPatterns": "கவனிக்கப்பட்ட மாற்றங்கள்",
      "redFlags": "உடனடி கவனம் தேவைப்படுபவை",
      "suggestedSpecialist": "பரிந்துரைக்கப்படும் மருத்துவர்",
      "questionsForDoctor": "மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்",
      "personalizedInsights": "தனிப்பயனாக்கப்பட்ட நல்வாழ்வு குறிப்புகள்",
      "userNotes": "தனிப்பட்ட குறிப்புகள்",
      "actions": "செயல்கள்",
      "doctorDiscussionReady": "மருத்துவர் ஆலோசனைக்கு தயார்",
      "rotterdamNote": "PCOS நோயறிதலை முறையான மருத்துவ பரிசோதனைகள் மூலம் மட்டுமே மருத்துவரால் உறுதி செய்ய முடியும்."
    },
    "homePage": {
      "heroEyebrow": "தொடங்குவதற்கான அமைதியான இடம்",
      "heroTitle": "உங்கள் ஆரோக்கியம், உங்கள் வார்த்தைகளில்.",
      "heroDescription": "உங்களுக்கு மருத்துவ சொற்கள் தேவையில்லை. இன்று உங்களுக்கு உதவும் ஒன்றை தேர்வு செய்யவும்.",
      "heroButton": "என் அறிகுறிகளை விவரிக்கவும்",
      "sectionEyebrow": "பயனுள்ளதை தேர்வு செய்யவும்",
      "sectionTitle": "இன்று நாங்கள் எவ்வாறு உதவலாம்?",
      "talkLabel": "என் அறிகுறிகளை விவரிக்கவும்",
      "talkDetail": "உங்கள் சொந்த வார்த்தைகளில் அறிகுறிகளை எழுதவும் அல்லது பேசவும்.",
      "trackerLabel": "என் சுழற்சியைக் கண்காணிக்கவும்",
      "trackerDetail": "பதிவிற்காக மாதவிடாய் தேதியைச் சேர்க்கவும்.",
      "insightsLabel": "நுண்ணறிவுகளைப் பார்க்கவும்",
      "insightsDetail": "சேமிக்கப்பட்ட குறிப்புகளை மதிப்பாய்வு செய்யவும்.",
      "screeningLabel": "PCOS ஆராய்ச்சி பரிசோதனை",
      "screeningDetail": "மருத்துவ ஆய்வக மதிப்புகளை மதிப்பீடு செய்யவும்.",
      "doctorLabel": "மருத்துவர் சந்திப்புக்குத் தயாராகுங்கள்",
      "doctorDetail": "எளிய சுருக்கம் மற்றும் கேள்விகளைத் தயார் செய்யவும்.",
      "learnLabel": "PCOS பற்றி அறியுங்கள்",
      "learnDetail": "தெளிவான தகவல் மற்றும் கட்டுக்கதைகளின் உண்மைகள்.",
      "footnote": "உங்கள் நேரத்தை எடுத்துக் கொள்ளுங்கள். எந்தப் படியையும் விட்டுவிட்டு பின்னர் திரும்பலாம்."
    },
    "talkPage": {
      "title": "LumaHer உடன் பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்",
      "description": "உங்கள் அறிகுறிகளை குரல் அல்லது உரை மூலம் விவரிக்கவும். முடிவுகள் கல்வித் தகவல் மட்டுமே, நோயறிதல் அல்ல.",
      "badge": "தனிப்பட்ட தோழி",
      "backHome": "முகப்புக்குத் திரும்பு"
    },
    "trackerPage": {
      "eyebrow": "தரவு அடிப்படையிலான சுழற்சி கண்காணிப்பு, உங்கள் சாதனத்தில்",
      "title": "சுழற்சி நுண்ணறிவு & முன்னறிவிப்பு",
      "description": "சுழற்சி முறைகளைக் கண்காணிக்கவும் வரவிருக்கும் தேதிகளைக் கணிக்கவும் தேதிகளைப் பதிவு செய்யவும்."
    },
    "insightsPage": {
      "eyebrow": "தனிப்பயன் முறை அடையாளம்",
      "title": "முன்னெச்சரிக்கை & நுண்ணறிவு",
      "description": "மீண்டும் மீண்டும் நிகழும் முறைகள் மற்றும் எச்சரிக்கைகளை மதிப்பாய்வு செய்யவும்."
    },
    "learnPage": {
      "eyebrow": "உங்கள் சொந்த வேகத்தில் கற்கவும்",
      "title": "அறிந்து கொள்ளுங்கள் & தவறான கருத்துக்கள்",
      "description": "தெளிவான தகவல்கள் கேள்விகளைத் தயாரிக்க உதவும். இது மருத்துவ நோயறிதல் அல்ல."
    },
    "chatbot": {
      "launcherOpen": "அரட்டையை மூடு",
      "launcherClosed": "LumaHer இடம் கேளுங்கள்",
      "title": "LumaHer இடம் கேளுங்கள்",
      "subtitle": "தனிப்பட்ட, உள்ளூர் வழிகாட்டுதல்",
      "safetyNote": "அவசர அறிகுறிகள் முதலில் சோதிக்கப்படும்.",
      "placeholder": "கண்காணிப்பு அல்லது மருத்துவர் வருகை பற்றி கேளுங்கள்"
    }
  },
  "te": {
    "disclaimer": {
      "standard": "ఇది సమాచారం మాత్రమే, వ్యాధి నిర్ధారణ కాదు.",
      "pcosGuidance": "ఈ లక్షణాలు కొన్నిసార్లు PCOS తో సంభవించవచ్చు, కానీ ఇతర కారణాలు కూడా ఉండవచ్చు.",
      "full": "సఖికేర్ కేవలం సమాచార సాధనం మాత్రమే. ఖచ్చితమైన నిర్ధారణ కోసం అర్హతగల వైద్యుడిని సంప్రదించండి."
    },
    "nav": {
      "home": "హోమ్",
      "talk": "మాట్లాడండి లేదా టైప్ చేయండి",
      "tracker": "పీరియడ్ సైకిల్ & అంచనా",
      "summary": "డాక్టర్ సారాంశం",
      "learn": "వాస్తవాలు & అపోహలు",
      "patterns": "ముందస్తు హెచ్చరికలు",
      "trackerShort": "సైకిల్",
      "insights": "ముందస్తు హెచ్చరికలు & అంతర్దృష్టులు",
      "insightsShort": "అంతర్దృష్టులు",
      "screening": "PCOS పరిశోధన స్క్రీనింగ్",
      "screeningShort": "స్క్రీనింగ్",
      "doctor": "వైద్యుల సారాంశం",
      "doctorShort": "వైద్యులు",
      "learnShort": "నేర్చుకోండి",
      "privacyNote": "మీ ఆరోగ్య డేటా మీ పరికరంలోనే సురక్షితంగా ఉంటుంది."
    },
    "safetyWarnings": {
      "urgentTitle": "దయచేసి వెంటనే అత్యవసర వైద్య సంరక్షణ పొందండి",
      "urgentDesc": "తీవ్రమైన నొప్పి లేదా విపరీతమైన రక్తస్రావానికి తక్షణ వైద్య సంరక్షణ అవసరం కావచ్చు.",
      "urgentAction": "స్థానిక అత్యవసర సేవలను సంప్రదించండి లేదా సమీపంలోని ఆసుపత్రికి వెళ్లండి.",
      "redFlagFever": "జ్వరంతో కూడిన తీవ్రమైన కటి నొప్పి",
      "redFlagHeavy": "అధిక ఋతు రక్తస్రావం",
      "redFlagDizziness": "రక్తస్రావంతో పాటు కళ్ళు తిరగడం లేదా మూర్ఛ",
      "redFlagPregnancy": "నొప్పి లేదా రక్తస్రావంతో సాధ్యమయ్యే గర్భం",
      "redFlagWeakness": "తీవ్రమైన బలహీనత"
    },
    "buttons": {
      "understandSymptoms": "నా లక్షణాలను అర్థం చేసుకోండి",
      "logPeriod": "నెలసరి తేదీని నమోదు చేయండి",
      "logSymptom": "లక్షణాన్ని నమోదు చేయండి",
      "copySummary": "సారాంశాన్ని కాపీ చేయండి",
      "copied": "కాపీ చేయబడింది!",
      "printSummary": "ప్రింట్ చేయండి",
      "downloadText": "టెక్స్ట్ డౌన్‌లోడ్ (.txt)",
      "exportJson": "JSON ఎగుమతి",
      "addInsight": "సలహాను జోడించండి",
      "clearSummary": "సారాంశాన్ని తొలగించండి",
      "editSummary": "సవరించండి",
      "save": "భద్రపరచండి",
      "cancel": "రద్దు చేయండి",
      "dismiss": "తీసివేయండి",
      "addDoctorSummary": "డాక్టర్ సారాంశంలో చేర్చండి",
      "addedDoctorSummary": "సారాంశంలో చేర్చబడింది",
      "retry": "మళ్లీ ప్రయత్నించండి",
      "typeInstead": "టైప్ చేయండి",
      "change": "మార్చండి",
      "backToHome": "హోమ్ డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి"
    },
    "emptyStates": {
      "noPatterns": "నెలసరి మరియు లక్షణాలను నమోదు చేస్తూ ఉండండి. కాలక్రమేణా మార్పులను గుర్తించడంలో మేము మీకు సహాయం చేస్తాము.",
      "noSymptoms": "ఇంకా ఎలాంటి లక్షణాలు నమోదు కాలేదు. మీ అనుభవాలను రాయండి లేదా మాట్లాడండి.",
      "noDoctorSummary": "ఇంకా డాక్టర్ సారాంశం తయారు కాలేదు.",
      "noCycleEntries": "నెలసరి వివరాలు ఏవీ నమోదు కాలేదు."
    },
    "errorStates": {
      "permissionDenied": "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి.",
      "unsupportedBrowser": "ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు. మీరు టైప్ చేయవచ్చు.",
      "networkError": "నెట్‌వర్క్ కనెక్షన్ లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.",
      "couldNotHear": "మీ వాయిస్ వినబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
      "listening": "వింటున్నాము…",
      "tapToStop": "ఆపడానికి నొక్కండి"
    },
    "trackerLabels": {
      "periodStartDate": "నెలసరి ప్రారంభ తేదీ",
      "periodEndDate": "నెలసరి ముగింపు తేదీ",
      "cycleLength": "సైకిల్ వ్యవధి",
      "averageCycleLength": "సగటు సైకిల్ వ్యవధి",
      "symptomName": "లక్షణం పేరు",
      "severity": "తీవ్రత",
      "duration": "వ్యవధి",
      "frequency": "ఫ్రీక్వెన్సీ",
      "notes": "గమనికలు",
      "mild": "స్వల్పం",
      "moderate": "మధ్యస్థం",
      "severe": "తీవ్రం",
      "unspecified": "పేర్కొనబడలేదు"
    },
    "summaryLabels": {
      "title": "వైద్యుల సంప్రదింపు సారాంశం",
      "subtitle": "మీ తదుపరి వైద్యుల సందర్శన కోసం సిద్ధం చేయబడిన నివేదిక",
      "mainSymptoms": "ప్రధాన లక్షణాలు",
      "cycleHistory": "ఋతు చక్ర చరిత్ర",
      "averageCycleLengthLabel": "సగటు సైకిల్ వ్యవధి",
      "repeatedPatterns": "గమనించిన మార్పులు",
      "redFlags": "తక్షణ శ్రద్ధ అవసరమైనవి",
      "suggestedSpecialist": "సిఫార్సు చేయబడిన నిపుణులు",
      "questionsForDoctor": "డాక్టర్‌ను అడగవలసిన ప్రశ్నలు",
      "personalizedInsights": "వ్యక్తిగత ఆరోగ్య సూచనలు",
      "userNotes": "వ్యక్తిగత గమనికలు",
      "actions": "సారాంశ ఎంపికలు",
      "doctorDiscussionReady": "వైద్యుల చర్చకు సిద్ధంగా ఉంది",
      "rotterdamNote": "PCOS నిర్ధారణను కేవలం అర్హతగల వైద్యులు మాత్రమే వైద్య పరీక్షల ద్వారా నిర్ధారించగలరు."
    },
    "homePage": {
      "heroEyebrow": "ప్రారంభించడానికి ఒక సురక్షిత ప్రదేశం",
      "heroTitle": "మీ ఆరోగ్యం, మీ మాటల్లో.",
      "heroDescription": "వైద్య పదాలు లేదా అన్ని సమాధానాలు అవసరం లేదు. ఈరోజు మీకు సహాయపడేదాన్ని ఎంచుకోండి.",
      "heroButton": "నా లక్షణాలను వివరించండి",
      "sectionEyebrow": "ఉపయోగకరమైనదాన్ని ఎంచుకోండి",
      "sectionTitle": "ఈరోజు మేము ఎలా సహాయపడగలం?",
      "talkLabel": "నా లక్షణాలను వివరించండి",
      "talkDetail": "మీ మాటల్లో లక్షణాలను రాయండి లేదా మాట్లాడండి.",
      "trackerLabel": "పీరియడ్ సైకిల్ ట్రాక్ చేయండి",
      "trackerDetail": "రికార్డ్ కోసం పీరియడ్ తేదీని జోడించండి.",
      "insightsLabel": "నా అంతర్దృష్టులను చూడండి",
      "insightsDetail": "సేవ్ చేసిన గమనికలను సమీక్షించండి.",
      "screeningLabel": "PCOS పరిశోధన స్క్రీనింగ్",
      "screeningDetail": "క్లినికల్ మరియు ల్యాబ్ విలువలను పరీక్షించండి.",
      "doctorLabel": "వైద్యుల సంప్రదింపుకు సిద్ధం కండి",
      "doctorDetail": "వైద్యులతో చర్చించడానికి సారాంశం మరియు ప్రశ్నలను తయారు చేయండి.",
      "learnLabel": "PCOS గురించి తెలుసుకోండి",
      "learnDetail": "స్పష్టమైన సమాచారం మరియు అపోహల నిజాలు చదవండి.",
      "footnote": "సమయం తీసుకోండి. మీరు ఏ దశనైనా దాటవేసి తర్వాత తిరిగి రావచ్చు."
    },
    "talkPage": {
      "title": "LumaHer తో మాట్లాడండి లేదా టైప్ చేయండి",
      "description": "మీ లక్షణాలను వాయిస్ లేదా టెక్స్ట్ ద్వారా వివరించండి. ఫలితాలు సమాచారం మాత్రమే, నిర్ధారణ కాదు.",
      "badge": "వ్యక్తిగత సహచరి",
      "backHome": "హోమ్ డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి"
    },
    "trackerPage": {
      "eyebrow": "డేటా ఆధారిత సైకిల్ పరిశీలనలు, మీ పరికరంలో",
      "title": "పీరియడ్ సైకిల్ & అంచనా",
      "description": "మీ సైకిల్ పోకడలను గమనించడానికి మరియు రాబోయే తేదీలను అంచనా వేయడానికి తేదీలను నమోదు చేయండి."
    },
    "insightsPage": {
      "eyebrow": "వ్యక్తిగత నమూనాల గుర్తింపు",
      "title": "ముందస్తు హెచ్చరికలు & అంతర్దృష్టులు",
      "description": "పునరావృతమయ్యే లక్షణాలు మరియు భద్రతా హెచ్చరికలను సమీక్షించండి."
    },
    "learnPage": {
      "eyebrow": "మీ స్వంత వేగంతో నేర్చుకోండి",
      "title": "వాస్తవాలు & అపోహలు",
      "description": "స్పష్టమైన సమాచారం ప్రశ్నలను సిద్ధం చేయడానికి సహాయపడుతుంది. ఇది వైద్య నిర్ధారణ కాదు."
    },
    "chatbot": {
      "launcherOpen": "చాట్ మూసివేయండి",
      "launcherClosed": "LumaHer ని అడగండి",
      "title": "LumaHer ని అడగండి",
      "subtitle": "వ్యక్తిగత, స్థానిక మార్గదర్శకత్వం",
      "safetyNote": "అత్యవసర లక్షణాలు మొదట తనిఖీ చేయబడతాయి.",
      "placeholder": "ట్రాకింగ్ లేదా వైద్యుల సందర్శన గురించి అడగండి"
    }
  },
  "mr": {
    "disclaimer": {
      "standard": "ही केवळ माहिती आहे, निदान (डायग्नोसिस) नाही.",
      "pcosGuidance": "ही लक्षणे कधीकधी PCOS मुळे उद्भवू शकतात, परंतु त्यांची इतर कारणे देखील असू शकतात.",
      "full": "सखीकेअर हे केवळ माहिती देणारे साधन आहे आणि वैद्यकीय निदान करत नाही. नेहमी तज्ज्ञ डॉक्टरांचा सल्ला घ्या."
    },
    "nav": {
      "home": "मुख्यपृष्ठ",
      "talk": "बोला किंवा टाईप करा",
      "tracker": "मासिक पाळी अंदाज व निरीक्षण",
      "summary": "डॉक्टर सारांश",
      "learn": "माहिती आणि गैरसमज",
      "patterns": "पूर्वसूचना",
      "trackerShort": "पाळी",
      "insights": "पूर्वसूचना आणि निरीक्षणे",
      "insightsShort": "निरीक्षणे",
      "screening": "PCOS संशोधन स्क्रीनिंग",
      "screeningShort": "स्क्रीनिंग",
      "doctor": "डॉक्टर सारांश",
      "doctorShort": "डॉक्टर",
      "learnShort": "जाणून घ्या",
      "privacyNote": "तुमच्या आरोग्याची माहिती तुमच्याच डिव्हाइसवर सुरक्षित राहते."
    },
    "safetyWarnings": {
      "urgentTitle": "कृपया त्वरित आपत्कालीन वैद्यकीय मदत घ्या",
      "urgentDesc": "अतिशय तीव्र वेदना किंवा अतिरक्तस्रावासाठी त्वरित वैद्यकीय उपचारांची आवश्यकता असू शकते.",
      "urgentAction": "स्थानिक आपत्कालीन सेवांशी संपर्क साधा किंवा जवळच्या रुग्णालयात जा.",
      "redFlagFever": "तापाबरोबर ओटीपोटात तीव्र वेदना",
      "redFlagHeavy": "अत्यधिक मासिक पाळीचा रक्तस्राव",
      "redFlagDizziness": "रक्तस्रावासह चक्कर येणे किंवा बेशुद्ध पडणे",
      "redFlagPregnancy": "वेदना किंवा रक्तस्रावासह संभाव्य गर्भधारणा",
      "redFlagWeakness": "अचानक तीव्र अशक्तपणा"
    },
    "buttons": {
      "understandSymptoms": "माझी लक्षणे समजून घ्या",
      "logPeriod": "पाळीची तारीख नोंदवा",
      "logSymptom": "लक्षण नोंदवा",
      "copySummary": "सारांश कॉपी करा",
      "copied": "कॉपी झाले!",
      "printSummary": "प्रिंट करा",
      "downloadText": "मजकूर डाउनलोड (.txt)",
      "exportJson": "JSON निर्यात करा",
      "addInsight": "सूचना जोडा",
      "clearSummary": "सारांश हटवा",
      "editSummary": "संपादित करा",
      "save": "जतन करा",
      "cancel": "रद्द करा",
      "dismiss": "काढून टाका",
      "addDoctorSummary": "डॉक्टर सारांशात जोडा",
      "addedDoctorSummary": "सारांशात जोडले",
      "retry": "पुन्हा प्रयत्न करा",
      "typeInstead": "टाईप करा",
      "change": "बदला",
      "backToHome": "मुख्यपृष्ठावर परत जा"
    },
    "emptyStates": {
      "noPatterns": "मासिक पाळी आणि लक्षणे नोंदवत राहा. आम्ही वेळोवेळी पॅटर्न समजून घेण्यात मदत करू.",
      "noSymptoms": "अजून कोणतीही लक्षणे नोंदवली गेलेली नाहीत. आपले अनुभव लिहा किंवा बोला.",
      "noDoctorSummary": "अद्याप कोणताही डॉक्टर सारांश तयार झालेला नाही.",
      "noCycleEntries": "पाळीच्या नोंदी उपलब्ध नाहीत."
    },
    "errorStates": {
      "permissionDenied": "मायक्रोफोनची परवानगी नाकारली गेली होती. कृपया ब्राऊझर सेटिंग्जमध्ये परवानगी द्या.",
      "unsupportedBrowser": "या ब्राऊझरमध्ये व्हॉइस ओळख उपलब्ध नाही. आपण टाईप करू शकता.",
      "networkError": "नेटवर्क कनेक्शन त्रुटी. कृपया पुन्हा प्रयत्न करा.",
      "couldNotHear": "तुमचा आवाज ऐकू आला नाही. कृपया पुन्हा प्रयत्न करा.",
      "listening": "ऐकत आहोत…",
      "tapToStop": "थांबवण्यासाठी टॅप करा"
    },
    "trackerLabels": {
      "periodStartDate": "पाळी सुरू होण्याची तारीख",
      "periodEndDate": "पाळी संपण्याची तारीख",
      "cycleLength": "चक्राचा कालावधी",
      "averageCycleLength": "सरासरी चक्र कालावधी",
      "symptomName": "लक्षणाचे नाव",
      "severity": "तीव्रता",
      "duration": "कालावधी",
      "frequency": "वारंवारता",
      "notes": "टिपा",
      "mild": "सौम्य",
      "moderate": "मध्यम",
      "severe": "तीव्र",
      "unspecified": "अनिर्दिष्ट"
    },
    "summaryLabels": {
      "title": "डॉक्टर सल्लामसलत सारांश",
      "subtitle": "पुढील भेटीसाठी तयार केलेली सुव्यवस्थित माहिती",
      "mainSymptoms": "प्रमुख लक्षणे",
      "cycleHistory": "मासिक पाळीचा इतिहास",
      "averageCycleLengthLabel": "सरासरी चक्र कालावधी",
      "repeatedPatterns": "निदर्शनास आलेले बदल",
      "redFlags": "त्वरित लक्ष देण्यासारखे मुद्दे",
      "suggestedSpecialist": "सुचवलेले तज्ज्ञ डॉक्टर",
      "questionsForDoctor": "डॉक्टरांना विचारायचे प्रश्न",
      "personalizedInsights": "वैयक्तिक आरोग्य टिप्स",
      "userNotes": "वैयक्तिक नोंदी",
      "actions": "पर्याय",
      "doctorDiscussionReady": "डॉक्टरांशी चर्चेसाठी तयार",
      "rotterdamNote": "PCOS चे अधिकृत निदान केवळ पात्र डॉक्टरच वैद्यकीय चाचण्यांद्वारे करू शकतात."
    },
    "homePage": {
      "heroEyebrow": "सुरुवात करण्यासाठी एक सुरक्षित जागा",
      "heroTitle": "तुमचे आरोग्य, तुमच्या शब्दांत.",
      "heroDescription": "वैद्यकीय शब्दांची गरज नाही. आज तुम्हाला मदत करेल असा एक पर्याय निवडा.",
      "heroButton": "माझी लक्षणे सांगा",
      "sectionEyebrow": "उपयुक्त पर्याय निवडा",
      "sectionTitle": "आज आम्ही कशी मदत करू शकतो?",
      "talkLabel": "माझी लक्षणे सांगा",
      "talkDetail": "तुम्हाला काय जाणवत आहे ते तुमच्या शब्दांत लिहा किंवा बोला.",
      "trackerLabel": "मासिक पाळी ट्रॅक करा",
      "trackerDetail": "नोंद ठेवण्यासाठी पाळीची तारीख जोडा.",
      "insightsLabel": "माझी निरीक्षणे पहा",
      "insightsDetail": "डिव्हाइसवर सेव्ह केलेल्या नोंदी तपासा.",
      "screeningLabel": "PCOS संशोधन स्क्रीनिंग",
      "screeningDetail": "क्लिनिकल व लॅब मूल्यांचे स्क्रीनिंग करा.",
      "doctorLabel": "डॉक्टरांच्या भेटीची तयारी",
      "doctorDetail": "डॉक्टरांशी चर्चा करण्यासाठी सारांश व प्रश्न तयार करा.",
      "learnLabel": "PCOS बद्दल जाणून घ्या",
      "learnDetail": "स्पष्ट माहिती आणि गैरसमजांची खरी वस्तुस्थिती वाचा.",
      "footnote": "तुमचा वेळ घ्या. तुम्ही कोणतीही पायरी वगळून नंतर परत येऊ शकता."
    },
    "talkPage": {
      "title": "LumaHer सोबत बोला किंवा टाइप करा",
      "description": "तुमची लक्षणे आवाजाने किंवा लिहून सांगा. हे केवळ शैक्षणिक मार्गदर्शनासाठी आहे, निदान नाही.",
      "badge": "खाजगी सखी",
      "backHome": "मुख्यपृष्ठावर परत जा"
    },
    "trackerPage": {
      "eyebrow": "मासिक पाळीची निरीक्षणे, तुमच्या डिव्हाइसवर",
      "title": "मासिक पाळी अंदाज व निरीक्षण",
      "description": "पाळीच्या सायकलचा अंदाज घेण्यासाठी आणि पुढील तारखा तपासण्यासाठी तारखा नोंदवा."
    },
    "insightsPage": {
      "eyebrow": "वैयक्तिक पॅटर्न ओळख",
      "title": "पूर्वसूचना आणि निरीक्षणे",
      "description": "वारंवार आढळणारे पॅटर्न आणि सुरक्षा सूचनांची समीक्षा करा."
    },
    "learnPage": {
      "eyebrow": "तुमच्या गतीने शिका",
      "title": "माहिती आणि गैरसमज",
      "description": "स्पष्ट माहिती प्रश्न तयार करण्यास मदत करते. हे कोणतेही निदान नाही."
    },
    "chatbot": {
      "launcherOpen": "चॅट बंद करा",
      "launcherClosed": "LumaHer ला विचारा",
      "title": "LumaHer ला विचारा",
      "subtitle": "खाजगी, स्थानिक मार्गदर्शन",
      "safetyNote": "तातडीच्या लक्षणांची आधी तपासणी केली जाते.",
      "placeholder": "ट्रॅकिंग किंवा डॉक्टरांच्या भेटीबद्दल विचारा"
    }
  },
  "bn": {
    "disclaimer": {
      "standard": "এটি তথ্য মাত্র, কোনো রোগ নির্ণয় (ডায়াগনোসিস) নয়।",
      "pcosGuidance": "এই লক্ষণগুলি কখনও কখনও PCOS-এর সাথে দেখা দিতে পারে, তবে এর অন্যান্য কারণও থাকতে পারে।",
      "full": "সখীকেয়ার একটি শিক্ষামূলক টুল এবং কোনো ক্লিনিকাল রোগ নির্ণয় প্রদান করে না। সর্বদা একজন যোগ্যতাসম্পন্ন চিকিৎসকের পরামর্শ নিন।"
    },
    "nav": {
      "home": "হোম",
      "talk": "বলুন বা লিখুন",
      "tracker": "পিরিয়ড ট্র্যাকার ও পূর্বাভাস",
      "summary": "ডাক্তারের সারাংশ",
      "learn": "তথ্য ও ভুল ধারণা",
      "patterns": "প্রাথমিক সতর্কতা",
      "trackerShort": "পিরিয়ড",
      "insights": "সতর্কতা এবং পর্যবেক্ষণ",
      "insightsShort": "পর্যবেক্ষণ",
      "screening": "PCOS গবেষণা স্ক্রীনিং",
      "screeningShort": "স্ক্রীনিং",
      "doctor": "ডাক্তারের সারাংশ",
      "doctorShort": "ডাক্তার",
      "learnShort": "জানুন",
      "privacyNote": "আপনার স্বাস্থ্য সংক্রান্ত তথ্য এই ডিভাইসেই সুরক্ষিত থাকে।"
    },
    "safetyWarnings": {
      "urgentTitle": "অনুগ্রহ করে অবিলম্বে জরুরি চিকিৎসা সহায়তা নিন",
      "urgentDesc": "তীব্র ব্যথা বা অত্যধিক রক্তপাতের জন্য অবিলম্বে চিকিৎসার প্রয়োজন হতে পারে।",
      "urgentAction": "স্থানীয় জরুরি পরিষেবাগুলির সাথে যোগাযোগ করুন বা নিকটস্থ হাসপাতালে যান।",
      "redFlagFever": "জ্বরের সাথে তলপেটে তীব্র ব্যথা",
      "redFlagHeavy": "অত্যধিক মাসিক রক্তপাত",
      "redFlagDizziness": "রক্তপাতের সাথে মাথা ঘোরা বা অজ্ঞান হওয়া",
      "redFlagPregnancy": "ব্যথা বা রক্তপাতের সাথে সম্ভাব্য গর্ভাবস্থা",
      "redFlagWeakness": "হঠাৎ তীব্র দুর্বলতা"
    },
    "buttons": {
      "understandSymptoms": "আমার লক্ষণগুলি বুঝুন",
      "logPeriod": "পিরিয়ডের তারিখ যোগ করুন",
      "logSymptom": "লক্ষণ যোগ করুন",
      "copySummary": "সারাংশ কপি করুন",
      "copied": "কপি করা হয়েছে!",
      "printSummary": "প্রিন্ট করুন",
      "downloadText": "টেক্সট ডাউনলোড (.txt)",
      "exportJson": "JSON এক্সপোর্ট করুন",
      "addInsight": "পরামর্শ যোগ করুন",
      "clearSummary": "সারাংশ মুছুন",
      "editSummary": "সম্পাদনা করুন",
      "save": "সংরক্ষণ করুন",
      "cancel": "বাতিল করুন",
      "dismiss": "বাতিল",
      "addDoctorSummary": "ডাক্তারের সারাংশে যোগ করুন",
      "addedDoctorSummary": "সারাংশে যোগ করা হয়েছে",
      "retry": "আবার চেষ্টা করুন",
      "typeInstead": "টাইপ করুন",
      "change": "পরিবর্তন",
      "backToHome": "হোম ড্যাশবোর্ডে ফিরে যান"
    },
    "emptyStates": {
      "noPatterns": "পিরিয়ড এবং লক্ষণগুলি লগ করতে থাকুন। সময়ের সাথে প্যাটার্ন বুঝতে আমরা আপনাকে সাহায্য করব।",
      "noSymptoms": "এখনও কোনো লক্ষণ রেকর্ড করা হয়নি। আপনার অভিজ্ঞতা লিখুন বা বলুন।",
      "noDoctorSummary": "এখনও কোনো ডাক্তারের সারাংশ তৈরি করা হয়নি।",
      "noCycleEntries": "কোনো পিরিয়ডের তারিখ রেকর্ড করা হয়নি।"
    },
    "errorStates": {
      "permissionDenied": "মাইক্রোফোনের অনুমতি প্রত্যাখ্যান করা হয়েছে। ব্রাউজার সেটিংসে গিয়ে অনুমতি দিন।",
      "unsupportedBrowser": "এই ব্রাউজারে ভয়েস সনাক্তকরণ সমর্থিত নয়। আপনি টাইপ করতে পারেন।",
      "networkError": "নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      "couldNotHear": "আপনার ভয়েস শুনতে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
      "listening": "শুনছি…",
      "tapToStop": "থামাতে আলতো চাপুন"
    },
    "trackerLabels": {
      "periodStartDate": "পিরিয়ড শুরুর তারিখ",
      "periodEndDate": "পিরিয়ড শেষের তারিখ",
      "cycleLength": "সাইকেলের দৈর্ঘ্য",
      "averageCycleLength": "গড় সাইকেলের দৈর্ঘ্য",
      "symptomName": "লক্ষণের নাম",
      "severity": "তীব্রতা",
      "duration": "স্থায়িত্ব",
      "frequency": "পৌনঃপুনিকতা",
      "notes": "মন্তব্য",
      "mild": "মৃদু",
      "moderate": "মাঝারি",
      "severe": "তীব্র",
      "unspecified": "অনির্দিষ্ট"
    },
    "summaryLabels": {
      "title": "ডাক্তারের সাথে আলোচনার সারাংশ",
      "subtitle": "আপনার পরবর্তী ডাক্তারের সাক্ষাতের জন্য প্রস্তুত তথ্য",
      "mainSymptoms": "প্রধান লক্ষণসমূহ",
      "cycleHistory": "মাসিক চক্রের ইতিহাস",
      "averageCycleLengthLabel": "গড় সাইকেলের দৈর্ঘ্য",
      "repeatedPatterns": "লক্ষিত প্যাটার্নসমূহ",
      "redFlags": "অবিলম্বে মনোযোগ প্রয়োজন এমন বিষয়",
      "suggestedSpecialist": "পরামর্শকৃত বিশেষজ্ঞ চিকিৎসক",
      "questionsForDoctor": "ডাক্তারকে জিজ্ঞাসা করার প্রশ্নাবলী",
      "personalizedInsights": "ব্যক্তিগত সুস্থতার পরামর্শ",
      "userNotes": "ব্যক্তিগত নোট",
      "actions": "সারাংশের বিকল্পসমূহ",
      "doctorDiscussionReady": "ডাক্তারের সাথে আলোচনার জন্য প্রস্তুত",
      "rotterdamNote": "PCOS-এর আনুষ্ঠানিক রোগ নির্ণয় কেবলমাত্র একজন প্রত্যয়িত চিকিৎসক ক্লিনিকাল পরীক্ষার মাধ্যমে করতে পারেন।"
    },
    "homePage": {
      "heroEyebrow": "শুরু করার জন্য একটি শান্ত জায়গা",
      "heroTitle": "আপনার স্বাস্থ্য, আপনার ভাষায়।",
      "heroDescription": "চিকিৎসা সংক্রান্ত জটিল শব্দের প্রয়োজন নেই। আজ আপনার যা কাজে লাগবে তা বেছে নিন।",
      "heroButton": "আমার লক্ষণ বর্ণনা করুন",
      "sectionEyebrow": "প্রয়োজনীয় বিকল্প বেছে নিন",
      "sectionTitle": "আজ আমরা কীভাবে সাহায্য করতে পারি?",
      "talkLabel": "আমার লক্ষণ বর্ণনা করুন",
      "talkDetail": "আপনি যা অনুভব করছেন তা নিজের কথায় লিখুন বা বলুন।",
      "trackerLabel": "পিরিয়ড ট্র্যাক করুন",
      "trackerDetail": "রেকর্ড রাখার জন্য পিরিয়ডের তারিখ যোগ করুন।",
      "insightsLabel": "আমার অন্তর্দৃষ্টি দেখুন",
      "insightsDetail": "ডিভাইসে সংরক্ষিত নোটগুলি পর্যালোচনা করুন।",
      "screeningLabel": "PCOS গবেষণা স্ক্রীনিং",
      "screeningDetail": "ক্লিনিকাল ও ল্যাব মান পরীক্ষা করুন।",
      "doctorLabel": "ডাক্তার সাক্ষাতের প্রস্তুতি",
      "doctorDetail": "ডাক্তারের সাথে আলোচনার জন্য সারাংশ ও প্রশ্ন প্রস্তুত করুন।",
      "learnLabel": "PCOS সম্পর্কে জানুন",
      "learnDetail": "সহজ তথ্য এবং প্রচলিত ভুল ধারণার সত্যতা পড়ুন।",
      "footnote": "সময় নিন। আপনি যেকোনো পদক্ষেপ এড়িয়ে পরে ফিরে আসতে পারেন।"
    },
    "talkPage": {
      "title": "LumaHer-এর সাথে বলুন বা টাইপ করুন",
      "description": "আপনার লক্ষণগুলি ভয়েস বা টেক্সটের মাধ্যমে বর্ণনা করুন। ফলাফলগুলি তথ্যমূলক, কোনো রোগ নির্ণয় নয়।",
      "badge": "ব্যক্তিগত সঙ্গী",
      "backHome": "হোম ড্যাশবোর্ডে ফিরে যান"
    },
    "trackerPage": {
      "eyebrow": "পিরিয়ডের তথ্য পর্যবেক্ষণ, আপনার ডিভাইসে",
      "title": "পিরিয়ড ট্র্যাকার ও পূর্বাভাস",
      "description": "পিরিয়ডের চক্র এবং পরবর্তী তারিখের আনুমানিক হিসাব পেতে তারিখ রেকর্ড করুন।"
    },
    "insightsPage": {
      "eyebrow": "ব্যক্তিগত প্যাটার্ন শনাক্তকরণ",
      "title": "সতর্কতা এবং পর্যবেক্ষণ",
      "description": "বারবার দেখা দেওয়া লক্ষণ এবং জরুরি সতর্কবার্তা পর্যালোচনা করুন।"
    },
    "learnPage": {
      "eyebrow": "আপনার সুবিধাজনক গতিতে জানুন",
      "title": "তথ্য ও ভুল ধারণা",
      "description": "সঠিক তথ্য ডাক্তারের কাছে প্রশ্ন করতে সহায়তা করে। এটি কোনো রোগ নির্ণয় নয়।"
    },
    "chatbot": {
      "launcherOpen": "চ্যাট বন্ধ করুন",
      "launcherClosed": "LumaHer-কে জিজ্ঞাসা করুন",
      "title": "LumaHer-কে জিজ্ঞাসা করুন",
      "subtitle": "ব্যক্তিগত ও স্থানীয় পরামর্শ",
      "safetyNote": "জরুরি লক্ষণগুলি প্রথমে পরীক্ষা করা হয়।",
      "placeholder": "ট্র্যাকিং বা ডাক্তার সাক্ষাতের বিষয়ে জিজ্ঞাসা করুন"
    }
  }
};

/**
 * Safe translation resolver with robust fallback to English.
 * Guarantees safety warnings and disclaimers are always available.
 * 
 * @param {string} path - Dot-separated key path (e.g. "buttons.copySummary")
 * @param {string} lang - Language code ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'bn', 'ml')
 * @returns {string} - Translated text or English fallback
 */
export function t(path, lang = 'en') {
  if (!path) return '';
  const targetLang = TRANSLATIONS[lang] ? lang : 'en';
  const keys = path.split('.');

  // Try target language
  let current = TRANSLATIONS[targetLang];
  let found = true;
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      found = false;
      break;
    }
  }

  if (found && typeof current === 'string') {
    return current;
  }

  // Fallback to English
  let fallback = TRANSLATIONS.en;
  for (const k of keys) {
    if (fallback && fallback[k] !== undefined) {
      fallback = fallback[k];
    } else {
      return path; // Return key path if even English is missing
    }
  }

  return typeof fallback === 'string' ? fallback : path;
}

export default TRANSLATIONS;
