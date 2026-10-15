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
]

export const TRANSLATIONS = {
  en: {
    disclaimer: {
      standard: 'This is information, not a diagnosis.',
      pcosGuidance: 'These symptoms can sometimes occur with PCOS, but they can also have other causes.',
      full: 'LunaHer is an informational tool and does not provide clinical diagnosis or treatment. Always consult a certified medical practitioner or gynecologist for diagnosis and clinical care.'
    },
    nav: {
      home: 'Home',
      talk: 'Talk or Type',
      tracker: 'Health Tracker',
      summary: 'Doctor Summary',
      learn: 'Learn & Myths',
      patterns: 'Early Warnings'
    },
    safetyWarnings: {
      urgentTitle: 'Please seek urgent medical care',
      urgentDesc: 'Severe pain or very heavy bleeding can require immediate medical attention.',
      urgentAction: 'Contact local emergency services or visit an urgent care facility.',
      redFlagFever: 'Fever with severe pelvic pain',
      redFlagHeavy: 'Very heavy menstrual bleeding',
      redFlagDizziness: 'Fainting or dizziness with bleeding',
      redFlagPregnancy: 'Possible pregnancy with pain or bleeding',
      redFlagWeakness: 'Severe or sudden weakness'
    },
    buttons: {
      understandSymptoms: 'Understand my symptoms',
      logPeriod: 'Log Period Date',
      logSymptom: 'Log Symptom',
      copySummary: 'Copy Summary',
      copied: 'Copied to Clipboard!',
      printSummary: 'Print Summary',
      downloadText: 'Download Text (.txt)',
      exportJson: 'Export JSON',
      addInsight: 'Add Selected Insight',
      clearSummary: 'Clear Summary',
      editSummary: 'Edit Summary',
      save: 'Save Changes',
      cancel: 'Cancel',
      dismiss: 'Dismiss',
      addDoctorSummary: 'Add to Doctor Summary',
      addedDoctorSummary: 'Added to Doctor Summary',
      retry: 'Retry Voice',
      typeInstead: 'Type Instead'
    },
    emptyStates: {
      noPatterns: 'Keep logging periods and symptoms. We’ll help you notice patterns over time.',
      noSymptoms: 'No symptoms recorded yet. Type or speak what you are experiencing.',
      noDoctorSummary: 'No doctor summary created yet. Log your cycles or describe your symptoms to generate your brief.',
      noCycleEntries: 'No cycle entries logged yet. Add your period start dates to track regularity.'
    },
    errorStates: {
      permissionDenied: 'Microphone permission was denied. Please allow microphone access in your browser address bar to use voice input, or type below.',
      unsupportedBrowser: 'Speech Recognition is not supported by your current browser. You can still type your symptoms freely!',
      networkError: 'Network connection error during speech recognition. Please check your connection and try again.',
      couldNotHear: 'We could not hear you. Try again.',
      listening: 'Listening…',
      tapToStop: 'Tap to stop'
    },
    trackerLabels: {
      periodStartDate: 'Period Start Date',
      periodEndDate: 'Period End Date',
      cycleLength: 'Cycle Length',
      averageCycleLength: 'Average Cycle Length',
      symptomName: 'Symptom Name',
      severity: 'Severity',
      duration: 'Duration',
      frequency: 'Frequency',
      notes: 'Notes',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
      unspecified: 'Unspecified'
    },
    summaryLabels: {
      title: 'Clinician Discussion Summary',
      subtitle: 'A structured, non-diagnostic overview prepared for your appointment',
      mainSymptoms: 'Main Symptoms',
      cycleHistory: 'Cycle History & Regularity',
      averageCycleLengthLabel: 'Average Cycle Length',
      repeatedPatterns: 'Observed Patterns',
      redFlags: 'Immediate Attention Items',
      suggestedSpecialist: 'Suggested Specialist',
      questionsForDoctor: 'Questions to Ask Your Doctor',
      personalizedInsights: 'Personalized Care Insights',
      userNotes: 'Personal Notes & Goals',
      actions: 'Summary Actions',
      doctorDiscussionReady: 'Ready for Doctor Discussion',
      rotterdamNote: 'Evaluation according to clinical criteria (such as Rotterdam criteria) requires professional medical testing.'
    }
  },

  hi: {
    disclaimer: {
      standard: 'यह जानकारी है, कोई निदान (डायग्नोसिस) नहीं।',
      pcosGuidance: 'ये लक्षण कभी-कभी PCOS के साथ हो सकते हैं, लेकिन इनके अन्य कारण भी हो सकते हैं।',
      full: 'सखीकेयर केवल सूचनात्मक उपकरण है और कोई चिकित्सीय निदान प्रदान नहीं करता है। उचित मूल्यांकन के लिए हमेशा योग्य चिकित्सक से संपर्क करें।'
    },
    nav: {
      home: 'होम',
      talk: 'बोलें या लिखें',
      tracker: 'साइकिल ट्रैकर',
      summary: 'डॉक्टर सारांश',
      learn: 'तथ्य और मिथक',
      patterns: 'शुरुआती चेतावनी'
    },
    safetyWarnings: {
      urgentTitle: 'कृपया तुरंत आपातकालीन चिकित्सा सहायता लें',
      urgentDesc: 'बहुत तेज़ दर्द या बहुत भारी रक्तस्राव को तत्काल चिकित्सीय देखभाल की आवश्यकता हो सकती है।',
      urgentAction: 'स्थानीय आपातकालीन सेवाओं से संपर्क करें या तुरंत नजदीकी अस्पताल जाएँ।',
      redFlagFever: 'तेज़ बुखार के साथ पेल्विक दर्द',
      redFlagHeavy: 'अत्यधिक भारी मासिक रक्तस्राव',
      redFlagDizziness: 'रक्तस्राव के साथ चक्कर आना या बेहोशी',
      redFlagPregnancy: 'दर्द या रक्तस्राव के साथ संभावित गर्भावस्था',
      redFlagWeakness: 'अचानक अत्यधिक कमजोरी'
    },
    buttons: {
      understandSymptoms: 'मेरे लक्षण समझें',
      logPeriod: 'पीरियड की तारीख जोड़ें',
      logSymptom: 'लक्षण जोड़ें',
      copySummary: 'सारांश कॉपी करें',
      copied: 'कॉपी हो गया!',
      printSummary: 'प्रिंट करें',
      downloadText: 'टेक्स्ट डाउनलोड करें (.txt)',
      exportJson: 'JSON एक्सपोर्ट करें',
      addInsight: 'सुझाव जोड़ें',
      clearSummary: 'सारांश साफ़ करें',
      editSummary: 'सारांश संपादित करें',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      dismiss: 'हटाएं',
      addDoctorSummary: 'डॉक्टर सारांश में जोड़ें',
      addedDoctorSummary: 'डॉक्टर सारांश में जुड़ा हुआ',
      retry: 'पुनः प्रयास करें',
      typeInstead: 'इसके बजाय टाइप करें'
    },
    emptyStates: {
      noPatterns: 'पीरियड्स और लक्षण दर्ज करते रहें। हम समय के साथ पैटर्न समझने में आपकी मदद करेंगे।',
      noSymptoms: 'अभी तक कोई लक्षण दर्ज नहीं किया गया है। आप जो महसूस कर रहे हैं उसे लिखें या बोलें।',
      noDoctorSummary: 'अभी तक कोई डॉक्टर सारांश नहीं बना है। अपने चक्र या लक्षण दर्ज करें।',
      noCycleEntries: 'अभी तक कोई पीरियड दर्ज नहीं हुआ है।'
    },
    errorStates: {
      permissionDenied: 'माइक्रोफ़ोन की अनुमति अस्वीकृत कर दी गई थी। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।',
      unsupportedBrowser: 'इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। आप नीचे टाइप कर सकते हैं।',
      networkError: 'नेटवर्क कनेक्शन में समस्या आई है। कृपया पुनः प्रयास करें।',
      couldNotHear: 'हम आपकी आवाज़ नहीं सुन सके। कृपया पुनः प्रयास करें।',
      listening: 'सुन रहे हैं…',
      tapToStop: 'रोकने के लिए टैप करें'
    },
    trackerLabels: {
      periodStartDate: 'पीरियड शुरू होने की तारीख',
      periodEndDate: 'पीरियड खत्म होने की तारीख',
      cycleLength: 'चक्र की लंबाई',
      averageCycleLength: 'औसत चक्र लंबाई',
      symptomName: 'लक्षण का नाम',
      severity: 'गंभीरता',
      duration: 'अवधि',
      frequency: 'आवृत्ति',
      notes: 'टिप्पणी',
      mild: 'हल्का',
      moderate: 'मध्यम',
      severe: 'गंभीर',
      unspecified: 'अनिर्दिष्ट'
    },
    summaryLabels: {
      title: 'डॉक्टर परामर्श सारांश',
      subtitle: 'आपकी अगली मुलाकात के लिए तैयार की गई व्यवस्थित जानकारी',
      mainSymptoms: 'प्रमुख लक्षण',
      cycleHistory: 'मासिक चक्र इतिहास',
      averageCycleLengthLabel: 'औसत चक्र लंबाई',
      repeatedPatterns: 'देखे गए पैटर्न',
      redFlags: 'त्वरित ध्यान देने योग्य बिंदु',
      suggestedSpecialist: 'सुझाए गए विशेषज्ञ',
      questionsForDoctor: 'डॉक्टर से पूछने योग्य प्रश्न',
      personalizedInsights: 'व्यक्तिगत स्वास्थ्य सुझाव',
      userNotes: 'आपकी टिप्पणियाँ',
      actions: 'सारांश विकल्प',
      doctorDiscussionReady: 'डॉक्टर से चर्चा के लिए तैयार',
      rotterdamNote: 'PCOS का आधिकारिक निदान केवल योग्य चिकित्सक ही रक्त परीक्षण और जांच द्वारा कर सकते हैं।'
    }
  },

  kn: {
    disclaimer: {
      standard: 'ಇದು ಮಾಹಿತಿ ಮಾತ್ರ, ಯಾವುದೇ ರೋಗನಿರ್ಣಯವಲ್ಲ.',
      pcosGuidance: 'ಈ ಲಕ್ಷಣಗಳು ಕೆಲವೊಮ್ಮೆ PCOS ನಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳಬಹುದು, ಆದರೆ ಇತರ ಕಾರಣಗಳೂ ಇರಬಹುದು.',
      full: 'ಸಖಿಕೇರ್ ಕೇವಲ ಮಾಹಿತಿ ನೀಡುವ ಸಾಧನವಾಗಿದ್ದು, ಯಾವುದೇ ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವನ್ನು ಒದಗಿಸುವುದಿಲ್ಲ. ಯಾವಾಗಲೂ ತಜ್ಞ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.'
    },
    nav: {
      home: 'ಮುಖಪುಟ',
      talk: 'ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ',
      tracker: 'ಋತುಚಕ್ರ ಟ್ರ್ಯಾಕರ್',
      summary: 'ವೈದ್ಯರ ಸಾರಾಂಶ',
      learn: 'ಮಾಹಿತಿ ಮತ್ತು ತಪ್ಪು ಕಲ್ಪನೆಗಳು',
      patterns: 'ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು'
    },
    safetyWarnings: {
      urgentTitle: 'ದಯವಿಟ್ಟು ತಕ್ಷಣ ತುರ್ತು ವೈದ್ಯಕೀಯ ನೆರವು ಪಡೆಯಿರಿ',
      urgentDesc: 'ತೀವ್ರವಾದ ಹೊಟ್ಟೆ ನೋವು ಅಥವಾ ಅತಿಯಾದ ರಕ್ತಸ್ರಾವಕ್ಕೆ ತಕ್ಷಣದ ವೈದ್ಯಕೀಯ ಆರೈಕೆಯ ಅಗತ್ಯವಿರುತ್ತದೆ.',
      urgentAction: 'ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.',
      redFlagFever: 'ಜ್ವರದೊಂದಿಗೆ ತೀವ್ರ ಕಿಬ್ಬೊಟ್ಟೆ ನೋವು',
      redFlagHeavy: 'ಅತಿಯಾದ ಮುಟ್ಟಿನ ರಕ್ತಸ್ರಾವ',
      redFlagDizziness: 'ರಕ್ತಸ್ರಾವದೊಂದಿಗೆ ತಲೆತಿರುಗುವಿಕೆ ಅಥವಾ ಮೂರ್ಛೆ',
      redFlagPregnancy: 'ನೋವು ಅಥವಾ ರಕ್ತಸ್ರಾವದೊಂದಿಗೆ ಸಂಭವನೀಯ ಗರ್ಭಧಾರಣೆ',
      redFlagWeakness: 'ತೀವ್ರ ದೌರ್ಬಲ್ಯ'
    },
    buttons: {
      understandSymptoms: 'ನನ್ನ ಲಕ್ಷಣಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
      logPeriod: 'ಮುಟ್ಟಿನ ದಿನಾಂಕ ನಮೂದಿಸಿ',
      logSymptom: 'ಲಕ್ಷಣ ನಮೂದಿಸಿ',
      copySummary: 'ಸಾರಾಂಶ ನಕಲಿಸಿ',
      copied: 'ನಕಲಿಸಲಾಗಿದೆ!',
      printSummary: 'ಪ್ರಿಂಟ್ ಮಾಡಿ',
      downloadText: 'ಪಠ್ಯ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (.txt)',
      exportJson: 'JSON ರಫ್ತು ಮಾಡಿ',
      addInsight: 'ಮಾಹಿತಿ ಸೇರಿಸಿ',
      clearSummary: 'ಸಾರಾಂಶ ಅಳಿಸಿ',
      editSummary: 'ಸಂಪಾದಿಸಿ',
      save: 'ಉಳಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      dismiss: 'ತೆಗೆದುಹಾಕಿ',
      addDoctorSummary: 'ವೈದ್ಯರ ಸಾರಾಂಶಕ್ಕೆ ಸೇರಿಸಿ',
      addedDoctorSummary: 'ಸಾರಾಂಶಕ್ಕೆ ಸೇರಿಸಲಾಗಿದೆ',
      retry: 'ಮರುಪ್ರಯತ್ನಿಸಿ',
      typeInstead: 'ಟೈಪ್ ಮಾಡಿ'
    },
    emptyStates: {
      noPatterns: 'ಮುಟ್ಟು ಮತ್ತು ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸುತ್ತಿರಿ. ಕಾಲಕ್ರಮೇಣ ನಮೂನೆಗಳನ್ನು ಗುರುತಿಸಲು ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
      noSymptoms: 'ಇನ್ನೂ ಯಾವುದೇ ಲಕ್ಷಣಗಳು ದಾಖಲಾಗಿಲ್ಲ. ನೀವು ಅನುಭವಿಸುತ್ತಿರುವುದನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ.',
      noDoctorSummary: 'ಇನ್ನೂ ವೈದ್ಯರ ಸಾರಾಂಶ ಸಿದ್ಧವಾಗಿಲ್ಲ. ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
      noCycleEntries: 'ಯಾವುದೇ ಮುಟ್ಟಿನ ವಿವರಗಳು ನಮೂದಾಗಿಲ್ಲ.'
    },
    errorStates: {
      permissionDenied: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅನುಮತಿಸಿ.',
      unsupportedBrowser: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು.',
      networkError: 'ನೆಟ್‌ವರ್ಕ್ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ.',
      couldNotHear: 'ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.',
      listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇವೆ…',
      tapToStop: 'ನಿಲ್ಲಿಸಲು ಸ್ಪರ್ಶಿಸಿ'
    },
    trackerLabels: {
      periodStartDate: 'ಮುಟ್ಟು ಆರಂಭವಾದ ದಿನಾಂಕ',
      periodEndDate: 'ಮುಟ್ಟು ಮುಕ್ತಾಯವಾದ ದಿನಾಂಕ',
      cycleLength: 'ಚಕ್ರದ ಅವಧಿ',
      averageCycleLength: 'ಸರಾಸರಿ ಚಕ್ರದ ಅವಧಿ',
      symptomName: 'ಲಕ್ಷಣದ ಹೆಸರು',
      severity: 'ತೀವ್ರತೆ',
      duration: 'ಅವಧಿ',
      frequency: 'ಆವರ್ತನ',
      notes: 'ಟಿಪ್ಪಣಿಗಳು',
      mild: 'ಸ್ವಲ್ಪ',
      moderate: 'ಸಾಧಾರಣ',
      severe: 'ತೀವ್ರ',
      unspecified: 'ಅನಿರ್ದಿಷ್ಟ'
    },
    summaryLabels: {
      title: 'ವೈದ್ಯರ ಸಮಾಲೋಚನೆ ಸಾರಾಂಶ',
      subtitle: 'ನಿಮ್ಮ ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿಗಾಗಿ ಸಿದ್ಧಪಡಿಸಿದ ವ್ಯವಸ್ಥಿತ ಮಾಹಿತಿ',
      mainSymptoms: 'ಪ್ರಮುಖ ಲಕ್ಷಣಗಳು',
      cycleHistory: 'ಋತುಚಕ್ರದ ಇತಿಹಾಸ',
      averageCycleLengthLabel: 'ಸರಾಸರಿ ಚಕ್ರದ ಅವಧಿ',
      repeatedPatterns: 'ಕಂಡುಬಂದ ನಮೂನೆಗಳು',
      redFlags: 'ತಕ್ಷಣ ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು',
      suggestedSpecialist: 'ಸೂಚಿಸಲಾದ ತಜ್ಞ ವೈದ್ಯರು',
      questionsForDoctor: 'ವೈದ್ಯರನ್ನು ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು',
      personalizedInsights: 'ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸಲಹೆಗಳು',
      userNotes: 'ವೈಯಕ್ತಿಕ ಟಿಪ್ಪಣಿಗಳು',
      actions: 'ಸಾರಾಂಶದ ಆಯ್ಕೆಗಳು',
      doctorDiscussionReady: 'ವೈದ್ಯರ ಚರ್ಚೆಗೆ ಸಿದ್ಧ',
      rotterdamNote: 'PCOS ರೋಗನಿರ್ಣಯವನ್ನು ಕೇವಲ ಪ್ರಮಾಣೀಕೃತ ವೈದ್ಯರು ಮಾತ್ರ ಪರೀಕ್ಷೆಗಳ ಮೂಲಕ ಖಚಿತಪಡಿಸಲು ಸಾಧ್ಯ.'
    }
  },

  ta: {
    disclaimer: {
      standard: 'இது தகவல் மட்டுமே, நோயறிதல் அல்ல.',
      pcosGuidance: 'இந்த அறிகுறிகள் சில நேரங்களில் PCOS உடன் ஏற்படலாம், ஆனால் அவற்றுக்கு வேறு காரணங்களும் இருக்கலாம்.',
      full: 'சகிகேர் தகவல் நோக்கங்களுக்கானது மட்டுமே. மருத்துவ ஆலோசனைக்கு தகுதியான மருத்துவரை அணுகவும்.'
    },
    nav: {
      home: 'முகப்பு',
      talk: 'பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்',
      tracker: 'மாதவிடாய் கண்காணிப்பு',
      summary: 'மருத்துவர் சுருக்கம்',
      learn: 'உண்மைகள் & தவறான கருத்துக்கள்',
      patterns: 'முன்னெச்சரிக்கைகள்'
    },
    safetyWarnings: {
      urgentTitle: 'தயவுசெய்து உடனடியாக அவசர மருத்துவ சிகிச்சை பெறவும்',
      urgentDesc: 'கடுமையான வலி அல்லது அதிக ரத்தப்போக்குக்கு உடனடி மருத்துவ கவனிப்பு தேவைப்படலாம்.',
      urgentAction: 'உள்ளூர் அவசர சிகிச்சை சேவைகளை தொடர்பு கொள்ளவும் அல்லது மருத்துவமனைக்கு செல்லவும்.',
      redFlagFever: 'காய்ச்சலுடன் கடுமையான அடிவயிற்று வலி',
      redFlagHeavy: 'மிக அதிக மாதவிடாய் ரத்தப்போக்கு',
      redFlagDizziness: 'ரத்தப்போக்குடன் தலைச்சுற்றல் அல்லது மயக்கம்',
      redFlagPregnancy: 'வலியுடன் கூடிய சாத்தியமான கர்ப்ப அறிகுறிகள்',
      redFlagWeakness: 'கடுமையான பலவீனம்'
    },
    buttons: {
      understandSymptoms: 'என் அறிகுறிகளைப் புரிந்து கொள்ளுங்கள்',
      logPeriod: 'மாதவிடாய் தேதியைச் சேர்',
      logSymptom: 'அறிகுறியைச் சேர்',
      copySummary: 'சுருக்கத்தை நகலெடு',
      copied: 'நகலெடுக்கப்பட்டது!',
      printSummary: 'அச்சிடுக',
      downloadText: 'பதிவிறக்கம் (.txt)',
      exportJson: 'JSON ஏற்றுமதி செய்',
      addInsight: 'குறிப்பைச் சேர்',
      clearSummary: 'சுருக்கத்தை அழி',
      editSummary: 'திருத்து',
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      dismiss: 'நீக்கு',
      addDoctorSummary: 'மருத்துவர் சுருக்கத்தில் சேர்',
      addedDoctorSummary: 'சுருக்கத்தில் சேர்க்கப்பட்டது',
      retry: 'மீண்டும் முயற்சி செய்',
      typeInstead: 'தட்டச்சு செய்'
    },
    emptyStates: {
      noPatterns: 'மாதவிடாய் மற்றும் அறிகுறிகளைப் பதிவுசெய்து வாருங்கள். காலப்போக்கில் உடல் மாற்றங்களை அறிய உதவுவோம்.',
      noSymptoms: 'இதுவரை அறிகுறிகள் எதுவும் பதிவு செய்யப்படவில்லை. உங்கள் அனுபவங்களை எழுதுங்கள்.',
      noDoctorSummary: 'மருத்துவர் சுருக்கம் இன்னும் உருவாக்கப்படவில்லை.',
      noCycleEntries: 'மாதவிடாய் பதிவுகள் எதுவும் இல்லை.'
    },
    errorStates: {
      permissionDenied: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. அமைப்புகளில் அனுமதியை இயக்கவும்.',
      unsupportedBrowser: 'உங்கள் உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. தட்டச்சு செய்யலாம்.',
      networkError: 'நெட்வொர்க் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
      couldNotHear: 'உங்கள் குரல் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
      listening: 'கேட்கிறது…',
      tapToStop: 'நிறுத்த தட்டவும்'
    },
    trackerLabels: {
      periodStartDate: 'மாதவிடாய் தொடக்க தேதி',
      periodEndDate: 'மாதவிடாய் முடிவு தேதி',
      cycleLength: 'சுழற்சி காலம்',
      averageCycleLength: 'சராசரி சுழற்சி காலம்',
      symptomName: 'அறிகுறி பெயர்',
      severity: 'தீவிரம்',
      duration: 'கால அளவு',
      frequency: 'அதிர்வெண்',
      notes: 'குறிப்புகள்',
      mild: 'லேசான',
      moderate: 'மிதமான',
      severe: 'கடுமையான',
      unspecified: 'குறிப்பிடப்படவில்லை'
    },
    summaryLabels: {
      title: 'மருத்துவர் ஆலோசனை சுருக்கம்',
      subtitle: 'மருத்துவ சந்திப்பிற்கு தயாராக வடிவமைக்கப்பட்ட அறிக்கை',
      mainSymptoms: 'முக்கிய அறிகுறிகள்',
      cycleHistory: 'மாதவிடாய் வரலாறு',
      averageCycleLengthLabel: 'சராசரி சுழற்சி காலம்',
      repeatedPatterns: 'கவனிக்கப்பட்ட மாற்றங்கள்',
      redFlags: 'உடனடி கவனம் தேவைப்படுபவை',
      suggestedSpecialist: 'பரிந்துரைக்கப்படும் மருத்துவர்',
      questionsForDoctor: 'மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்',
      personalizedInsights: 'தனிப்பயனாக்கப்பட்ட நல்வாழ்வு குறிப்புகள்',
      userNotes: 'தனிப்பட்ட குறிப்புகள்',
      actions: 'செயல்கள்',
      doctorDiscussionReady: 'மருத்துவர் ஆலோசனைக்கு தயார்',
      rotterdamNote: 'PCOS நோயறிதலை முறையான மருத்துவ பரிசோதனைகள் மூலம் மட்டுமே மருத்துவரால் உறுதி செய்ய முடியும்.'
    }
  },

  te: {
    disclaimer: {
      standard: 'ఇది సమాచారం మాత్రమే, వ్యాధి నిర్ధారణ కాదు.',
      pcosGuidance: 'ఈ లక్షణాలు కొన్నిసార్లు PCOS తో సంభవించవచ్చు, కానీ ఇతర కారణాలు కూడా ఉండవచ్చు.',
      full: 'సఖికేర్ కేవలం సమాచార సాధనం మాత్రమే. ఖచ్చితమైన నిర్ధారణ కోసం అర్హతగల వైద్యుడిని సంప్రదించండి.'
    },
    nav: {
      home: 'హోమ్',
      talk: 'మాట్లాడండి లేదా టైప్ చేయండి',
      tracker: 'నెలసరి ట్రాకర్',
      summary: 'డాక్టర్ సారాంశం',
      learn: 'నిజాలు & అపోహలు',
      patterns: 'ముందస్తు హెచ్చరికలు'
    },
    safetyWarnings: {
      urgentTitle: 'దయచేసి వెంటనే అత్యవసర వైద్య సంరక్షణ పొందండి',
      urgentDesc: 'తీవ్రమైన నొప్పి లేదా విపరీతమైన రక్తస్రావానికి తక్షణ వైద్య సంరక్షణ అవసరం కావచ్చు.',
      urgentAction: 'స్థానిక అత్యవసర సేవలను సంప్రదించండి లేదా సమీపంలోని ఆసుపత్రికి వెళ్లండి.',
      redFlagFever: 'జ్వరంతో కూడిన తీవ్రమైన కటి నొప్పి',
      redFlagHeavy: 'అధిక ఋతు రక్తస్రావం',
      redFlagDizziness: 'రక్తస్రావంతో పాటు కళ్ళు తిరగడం లేదా మూర్ఛ',
      redFlagPregnancy: 'నొప్పి లేదా రక్తస్రావంతో సాధ్యమయ్యే గర్భం',
      redFlagWeakness: 'తీవ్రమైన బలహీనత'
    },
    buttons: {
      understandSymptoms: 'నా లక్షణాలను అర్థం చేసుకోండి',
      logPeriod: 'నెలసరి తేదీని నమోదు చేయండి',
      logSymptom: 'లక్షణాన్ని నమోదు చేయండి',
      copySummary: 'సారాంశాన్ని కాపీ చేయండి',
      copied: 'కాపీ చేయబడింది!',
      printSummary: 'ప్రింట్ చేయండి',
      downloadText: 'టెక్స్ట్ డౌన్‌లోడ్ (.txt)',
      exportJson: 'JSON ఎగుమతి',
      addInsight: 'సలహాను జోడించండి',
      clearSummary: 'సారాంశాన్ని తొలగించండి',
      editSummary: 'సవరించండి',
      save: 'భద్రపరచండి',
      cancel: 'రద్దు చేయండి',
      dismiss: 'తీసివేయండి',
      addDoctorSummary: 'డాక్టర్ సారాంశంలో చేర్చండి',
      addedDoctorSummary: 'సారాంశంలో చేర్చబడింది',
      retry: 'మళ్లీ ప్రయత్నించండి',
      typeInstead: 'టైప్ చేయండి'
    },
    emptyStates: {
      noPatterns: 'నెలసరి మరియు లక్షణాలను నమోదు చేస్తూ ఉండండి. కాలక్రమేణా మార్పులను గుర్తించడంలో మేము మీకు సహాయం చేస్తాము.',
      noSymptoms: 'ఇంకా ఎలాంటి లక్షణాలు నమోదు కాలేదు. మీ అనుభవాలను రాయండి లేదా మాట్లాడండి.',
      noDoctorSummary: 'ఇంకా డాక్టర్ సారాంశం తయారు కాలేదు.',
      noCycleEntries: 'నెలసరి వివరాలు ఏవీ నమోదు కాలేదు.'
    },
    errorStates: {
      permissionDenied: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించండి.',
      unsupportedBrowser: 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు. మీరు టైప్ చేయవచ్చు.',
      networkError: 'నెట్‌వర్క్ కనెక్షన్ లోపం. దయచేసి మళ్లీ ప్రయత్నించండి.',
      couldNotHear: 'మీ వాయిస్ వినబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
      listening: 'వింటున్నాము…',
      tapToStop: 'ఆపడానికి నొక్కండి'
    },
    trackerLabels: {
      periodStartDate: 'నెలసరి ప్రారంభ తేదీ',
      periodEndDate: 'నెలసరి ముగింపు తేదీ',
      cycleLength: 'సైకిల్ వ్యవధి',
      averageCycleLength: 'సగటు సైకిల్ వ్యవధి',
      symptomName: 'లక్షణం పేరు',
      severity: 'తీవ్రత',
      duration: 'వ్యవధి',
      frequency: 'ఫ్రీక్వెన్సీ',
      notes: 'గమనికలు',
      mild: 'స్వల్పం',
      moderate: 'మధ్యస్థం',
      severe: 'తీవ్రం',
      unspecified: 'పేర్కొనబడలేదు'
    },
    summaryLabels: {
      title: 'వైద్యుల సంప్రదింపు సారాంశం',
      subtitle: 'మీ తదుపరి వైద్యుల సందర్శన కోసం సిద్ధం చేయబడిన నివేదిక',
      mainSymptoms: 'ప్రధాన లక్షణాలు',
      cycleHistory: 'ఋతు చక్ర చరిత్ర',
      averageCycleLengthLabel: 'సగటు సైకిల్ వ్యవధి',
      repeatedPatterns: 'గమనించిన మార్పులు',
      redFlags: 'తక్షణ శ్రద్ధ అవసరమైనవి',
      suggestedSpecialist: 'సిఫార్సు చేయబడిన నిపుణులు',
      questionsForDoctor: 'డాక్టర్‌ను అడగవలసిన ప్రశ్నలు',
      personalizedInsights: 'వ్యక్తిగత ఆరోగ్య సూచనలు',
      userNotes: 'వ్యక్తిగత గమనికలు',
      actions: 'సారాంశ ఎంపికలు',
      doctorDiscussionReady: 'వైద్యుల చర్చకు సిద్ధంగా ఉంది',
      rotterdamNote: 'PCOS నిర్ధారణను కేవలం అర్హతగల వైద్యులు మాత్రమే వైద్య పరీక్షల ద్వారా నిర్ధారించగలరు.'
    }
  },

  mr: {
    disclaimer: {
      standard: 'ही केवळ माहिती आहे, निदान (डायग्नोसिस) नाही.',
      pcosGuidance: 'ही लक्षणे कधीकधी PCOS मुळे उद्भवू शकतात, परंतु त्यांची इतर कारणे देखील असू शकतात.',
      full: 'सखीकेअर हे केवळ माहिती देणारे साधन आहे आणि वैद्यकीय निदान करत नाही. नेहमी तज्ज्ञ डॉक्टरांचा सल्ला घ्या.'
    },
    nav: {
      home: 'मुख्यपृष्ठ',
      talk: 'बोला किंवा टाईप करा',
      tracker: 'मासिक पाळी ट्रॅकर',
      summary: 'डॉक्टर सारांश',
      learn: 'तथ्ये आणि गैरसमज',
      patterns: 'पूर्वसूचना'
    },
    safetyWarnings: {
      urgentTitle: 'कृपया त्वरित आपत्कालीन वैद्यकीय मदत घ्या',
      urgentDesc: 'अतिशय तीव्र वेदना किंवा अतिरक्तस्रावासाठी त्वरित वैद्यकीय उपचारांची आवश्यकता असू शकते.',
      urgentAction: 'स्थानिक आपत्कालीन सेवांशी संपर्क साधा किंवा जवळच्या रुग्णालयात जा.',
      redFlagFever: 'तापाबरोबर ओटीपोटात तीव्र वेदना',
      redFlagHeavy: 'अत्यधिक मासिक पाळीचा रक्तस्राव',
      redFlagDizziness: 'रक्तस्रावासह चक्कर येणे किंवा बेशुद्ध पडणे',
      redFlagPregnancy: 'वेदना किंवा रक्तस्रावासह संभाव्य गर्भधारणा',
      redFlagWeakness: 'अचानक तीव्र अशक्तपणा'
    },
    buttons: {
      understandSymptoms: 'माझी लक्षणे समजून घ्या',
      logPeriod: 'पाळीची तारीख नोंदवा',
      logSymptom: 'लक्षण नोंदवा',
      copySummary: 'सारांश कॉपी करा',
      copied: 'कॉपी झाले!',
      printSummary: 'प्रिंट करा',
      downloadText: 'मजकूर डाउनलोड (.txt)',
      exportJson: 'JSON निर्यात करा',
      addInsight: 'सूचना जोडा',
      clearSummary: 'सारांश हटवा',
      editSummary: 'संपादित करा',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      dismiss: 'काढून टाका',
      addDoctorSummary: 'डॉक्टर सारांशात जोडा',
      addedDoctorSummary: 'सारांशात जोडले',
      retry: 'पुन्हा प्रयत्न करा',
      typeInstead: 'टाईप करा'
    },
    emptyStates: {
      noPatterns: 'मासिक पाळी आणि लक्षणे नोंदवत राहा. आम्ही वेळोवेळी पॅटर्न समजून घेण्यात मदत करू.',
      noSymptoms: 'अजून कोणतीही लक्षणे नोंदवली गेलेली नाहीत. आपले अनुभव लिहा किंवा बोला.',
      noDoctorSummary: 'अद्याप कोणताही डॉक्टर सारांश तयार झालेला नाही.',
      noCycleEntries: 'पाळीच्या नोंदी उपलब्ध नाहीत.'
    },
    errorStates: {
      permissionDenied: 'मायक्रोफोनची परवानगी नाकारली गेली होती. कृपया ब्राऊझर सेटिंग्जमध्ये परवानगी द्या.',
      unsupportedBrowser: 'या ब्राऊझरमध्ये व्हॉइस ओळख उपलब्ध नाही. आपण टाईप करू शकता.',
      networkError: 'नेटवर्क कनेक्शन त्रुटी. कृपया पुन्हा प्रयत्न करा.',
      couldNotHear: 'तुमचा आवाज ऐकू आला नाही. कृपया पुन्हा प्रयत्न करा.',
      listening: 'ऐकत आहोत…',
      tapToStop: 'थांबवण्यासाठी टॅप करा'
    },
    trackerLabels: {
      periodStartDate: 'पाळी सुरू होण्याची तारीख',
      periodEndDate: 'पाळी संपण्याची तारीख',
      cycleLength: 'चक्राचा कालावधी',
      averageCycleLength: 'सरासरी चक्र कालावधी',
      symptomName: 'लक्षणाचे नाव',
      severity: 'तीव्रता',
      duration: 'कालावधी',
      frequency: 'वारंवारता',
      notes: 'टिपा',
      mild: 'सौम्य',
      moderate: 'मध्यम',
      severe: 'तीव्र',
      unspecified: 'अनिर्दिष्ट'
    },
    summaryLabels: {
      title: 'डॉक्टर सल्लामसलत सारांश',
      subtitle: 'पुढील भेटीसाठी तयार केलेली सुव्यवस्थित माहिती',
      mainSymptoms: 'प्रमुख लक्षणे',
      cycleHistory: 'मासिक पाळीचा इतिहास',
      averageCycleLengthLabel: 'सरासरी चक्र कालावधी',
      repeatedPatterns: 'निदर्शनास आलेले बदल',
      redFlags: 'त्वरित लक्ष देण्यासारखे मुद्दे',
      suggestedSpecialist: 'सुचवलेले तज्ज्ञ डॉक्टर',
      questionsForDoctor: 'डॉक्टरांना विचारायचे प्रश्न',
      personalizedInsights: 'वैयक्तिक आरोग्य टिप्स',
      userNotes: 'वैयक्तिक नोंदी',
      actions: 'पर्याय',
      doctorDiscussionReady: 'डॉक्टरांशी चर्चेसाठी तयार',
      rotterdamNote: 'PCOS चे अधिकृत निदान केवळ पात्र डॉक्टरच वैद्यकीय चाचण्यांद्वारे करू शकतात.'
    }
  },

  bn: {
    disclaimer: {
      standard: 'এটি তথ্য মাত্র, কোনো রোগ নির্ণয় (ডায়াগনোসিস) নয়।',
      pcosGuidance: 'এই লক্ষণগুলি কখনও কখনও PCOS-এর সাথে দেখা দিতে পারে, তবে এর অন্যান্য কারণও থাকতে পারে।',
      full: 'সখীকেয়ার একটি শিক্ষামূলক টুল এবং কোনো ক্লিনিকাল রোগ নির্ণয় প্রদান করে না। সর্বদা একজন যোগ্যতাসম্পন্ন চিকিৎসকের পরামর্শ নিন।'
    },
    nav: {
      home: 'হোম',
      talk: 'বলুন বা লিখুন',
      tracker: 'পিরিয়ড ট্র্যাকার',
      summary: 'ডাক্তারের সারাংশ',
      learn: 'তথ্য ও ভুল ধারণা',
      patterns: 'প্রাথমিক সতর্কতা'
    },
    safetyWarnings: {
      urgentTitle: 'অনুগ্রহ করে অবিলম্বে জরুরি চিকিৎসা সহায়তা নিন',
      urgentDesc: 'তীব্র ব্যথা বা অত্যধিক রক্তপাতের জন্য অবিলম্বে চিকিৎসার প্রয়োজন হতে পারে।',
      urgentAction: 'স্থানীয় জরুরি পরিষেবাগুলির সাথে যোগাযোগ করুন বা নিকটস্থ হাসপাতালে যান।',
      redFlagFever: 'জ্বরের সাথে তলপেটে তীব্র ব্যথা',
      redFlagHeavy: 'অত্যধিক মাসিক রক্তপাত',
      redFlagDizziness: 'রক্তপাতের সাথে মাথা ঘোরা বা অজ্ঞান হওয়া',
      redFlagPregnancy: 'ব্যথা বা রক্তপাতের সাথে সম্ভাব্য গর্ভাবস্থা',
      redFlagWeakness: 'হঠাৎ তীব্র দুর্বলতা'
    },
    buttons: {
      understandSymptoms: 'আমার লক্ষণগুলি বুঝুন',
      logPeriod: 'পিরিয়ডের তারিখ যোগ করুন',
      logSymptom: 'লক্ষণ যোগ করুন',
      copySummary: 'সারাংশ কপি করুন',
      copied: 'কপি করা হয়েছে!',
      printSummary: 'প্রিন্ট করুন',
      downloadText: 'টেক্সট ডাউনলোড (.txt)',
      exportJson: 'JSON এক্সপোর্ট করুন',
      addInsight: 'পরামর্শ যোগ করুন',
      clearSummary: 'সারাংশ মুছুন',
      editSummary: 'সম্পাদনা করুন',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল করুন',
      dismiss: 'বাতিল',
      addDoctorSummary: 'ডাক্তারের সারাংশে যোগ করুন',
      addedDoctorSummary: 'সারাংশে যোগ করা হয়েছে',
      retry: 'আবার চেষ্টা করুন',
      typeInstead: 'টাইপ করুন'
    },
    emptyStates: {
      noPatterns: 'পিরিয়ড এবং লক্ষণগুলি লগ করতে থাকুন। সময়ের সাথে প্যাটার্ন বুঝতে আমরা আপনাকে সাহায্য করব।',
      noSymptoms: 'এখনও কোনো লক্ষণ রেকর্ড করা হয়নি। আপনার অভিজ্ঞতা লিখুন বা বলুন।',
      noDoctorSummary: 'এখনও কোনো ডাক্তারের সারাংশ তৈরি করা হয়নি।',
      noCycleEntries: 'কোনো পিরিয়ডের তারিখ রেকর্ড করা হয়নি।'
    },
    errorStates: {
      permissionDenied: 'মাইক্রোফোনের অনুমতি প্রত্যাখ্যান করা হয়েছে। ব্রাউজার সেটিংসে গিয়ে অনুমতি দিন।',
      unsupportedBrowser: 'এই ব্রাউজারে ভয়েস সনাক্তকরণ সমর্থিত নয়। আপনি টাইপ করতে পারেন।',
      networkError: 'নেটওয়ার্ক সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      couldNotHear: 'আপনার ভয়েস শুনতে পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
      listening: 'শুনছি…',
      tapToStop: 'থামাতে আলতো চাপুন'
    },
    trackerLabels: {
      periodStartDate: 'পিরিয়ড শুরুর তারিখ',
      periodEndDate: 'পিরিয়ড শেষের তারিখ',
      cycleLength: 'সাইকেলের দৈর্ঘ্য',
      averageCycleLength: 'গড় সাইকেলের দৈর্ঘ্য',
      symptomName: 'লক্ষণের নাম',
      severity: 'তীব্রতা',
      duration: 'স্থায়িত্ব',
      frequency: 'পৌনঃপুনিকতা',
      notes: 'মন্তব্য',
      mild: 'মৃদু',
      moderate: 'মাঝারি',
      severe: 'তীব্র',
      unspecified: 'অনির্দিষ্ট'
    },
    summaryLabels: {
      title: 'ডাক্তারের সাথে আলোচনার সারাংশ',
      subtitle: 'আপনার পরবর্তী ডাক্তারের সাক্ষাতের জন্য প্রস্তুত তথ্য',
      mainSymptoms: 'প্রধান লক্ষণসমূহ',
      cycleHistory: 'মাসিক চক্রের ইতিহাস',
      averageCycleLengthLabel: 'গড় সাইকেলের দৈর্ঘ্য',
      repeatedPatterns: 'লক্ষিত প্যাটার্নসমূহ',
      redFlags: 'অবিলম্বে মনোযোগ প্রয়োজন এমন বিষয়',
      suggestedSpecialist: 'পরামর্শকৃত বিশেষজ্ঞ চিকিৎসক',
      questionsForDoctor: 'ডাক্তারকে জিজ্ঞাসা করার প্রশ্নাবলী',
      personalizedInsights: 'ব্যক্তিগত সুস্থতার পরামর্শ',
      userNotes: 'ব্যক্তিগত নোট',
      actions: 'সারাংশের বিকল্পসমূহ',
      doctorDiscussionReady: 'ডাক্তারের সাথে আলোচনার জন্য প্রস্তুত',
      rotterdamNote: 'PCOS-এর আনুষ্ঠানিক রোগ নির্ণয় কেবলমাত্র একজন প্রত্যয়িত চিকিৎসক ক্লিনিকাল পরীক্ষার মাধ্যমে করতে পারেন।'
    }
  }
}

/**
 * Safe translation resolver with robust fallback to English.
 * Guarantees safety warnings and disclaimers are always available.
 * 
 * @param {string} path - Dot-separated key path (e.g. "buttons.copySummary")
 * @param {string} lang - Language code ('en', 'hi', 'kn', 'ta', 'te', 'mr', 'bn')
 * @returns {string} - Translated text or English fallback
 */
export function t(path, lang = 'en') {
  if (!path) return ''
  const targetLang = TRANSLATIONS[lang] ? lang : 'en'
  const keys = path.split('.')

  // Try target language
  let current = TRANSLATIONS[targetLang]
  let found = true
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k]
    } else {
      found = false
      break
    }
  }

  if (found && typeof current === 'string') {
    return current
  }

  // Fallback to English
  let fallback = TRANSLATIONS.en
  for (const k of keys) {
    if (fallback && fallback[k] !== undefined) {
      fallback = fallback[k]
    } else {
      return path // Return key path if even English is missing
    }
  }

  return typeof fallback === 'string' ? fallback : path
}

export default TRANSLATIONS
