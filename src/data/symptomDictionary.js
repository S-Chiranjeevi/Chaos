/**
 * Multilingual Clinical Symptom Dictionary for SakhiCare
 * 
 * Provides standardized mappings, descriptions, colloquial synonyms, and categories
 * across 7 languages:
 * - English (en)
 * - Hindi (hi)
 * - Kannada (kn)
 * - Tamil (ta)
 * - Telugu (te)
 * - Marathi (mr)
 * - Bengali (bn)
 */

export const SYMPTOM_DICTIONARY = [
  {
    id: 'irregular_periods',
    category: 'Menstrual & Hormonal',
    isRedFlag: false,
    labels: {
      en: 'Irregular or infrequent periods',
      hi: 'अनियमित माहवारी (पीरियड्स)',
      kn: 'ಅನಿಯಮಿತ ಮುಟ್ಟು (ಋತುಚಕ್ರ)',
      ta: 'ஒழுங்கற்ற அல்லது தாமதமான மாதவிடாய்',
      te: 'క్రమం తప్పిన లేదా ఆలస్యమైన నెలసరి',
      mr: 'अनियमित मासिक पाळी',
      bn: 'অনিয়মিত বা দেরিতে হওয়া মাসিক'
    },
    descriptions: {
      en: 'Menstrual cycles occurring less frequently than every 35 days, varying unpredictably, or absent for consecutive months.',
      hi: 'माहवारी चक्र 35 दिनों से अधिक समय में आना, अप्रत्याशित रूप से देर होना या लगातार महीनों तक न आना।',
      kn: 'ಋತುಚಕ್ರವು 35 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ತಡವಾಗುವುದು ಅಥವಾ ಅನಿಯಮಿತವಾಗಿ ಬರುವುದು.',
      ta: 'மாதவிடாய் 35 நாட்களுக்கு ஒருமுறைக்கு மேல் தாமதமாக வருவது அல்லது கணிக்க முடியாத வகையில் மாறுவது.',
      te: 'నెలసరి 35 రోజుల కంటే ఆలస్యంగా రావడం లేదా క్రమం తప్పడం.',
      mr: 'मासिक पाळी ३५ दिवसांपेक्षा जास्त उशिरा येणे किंवा चक्र अनियमित असणे.',
      bn: 'মাসিক চক্র ৩৫ দিনের বেশি দেরিতে হওয়া বা অনিয়মিত হওয়া।'
    },
    synonyms: {
      en: ['missed period', 'late period', 'delayed cycle', 'infrequent periods', 'every 2-3 months', 'unpredictable periods'],
      hi: ['पीरियड लेट', 'माहवारी में देरी', 'पीरियड्स नहीं आए', 'रुक रुक कर आना', 'चक्र अनियमित'],
      kn: ['ಮುಟ್ಟು ತಡ', 'ತಿಂಗಳು ಬರಲಿಲ್ಲ', 'ಋತುಚಕ್ರ ಆಲಸ್ಯ', 'ಮುಟ್ಟು ನಿಂತಿದೆ'],
      ta: ['மாதவிடாய் தாமதம்', 'பீரியட்ஸ் வரவில்லை', 'சுழற்சி மாற்றம்'],
      te: ['నెలసరి ఆలస్యం', 'పీరియడ్స్ రావడం లేదు', 'క్రమం తప్పింది'],
      mr: ['पाळी उशिरा येणे', 'पाळी चुकणे', 'अनियमित पाळी'],
      bn: ['মাসিক পিছিয়ে যাওয়া', 'পিরিয়ড বন্ধ', 'দেরিতে পিরিয়ড']
    }
  },
  {
    id: 'acne',
    category: 'Dermatological & Androgenic',
    isRedFlag: false,
    labels: {
      en: 'Acne and skin breakouts',
      hi: 'मुंहासे और दाने',
      kn: 'ಮೊಡವೆಗಳು ಮತ್ತು ಚರ್ಮದ ಕಲೆಗಳು',
      ta: 'முகப்பரு மற்றும் சருமக் கட்டிகள்',
      te: 'మొటిమలు మరియు చర్మ సమస్యలు',
      mr: 'मुरुमे आणि चेहऱ्यावरील पुरळ',
      bn: 'ব্রণ ও ত্বকের ফুসকুড়ি'
    },
    descriptions: {
      en: 'Persistent, inflammatory, or adult-onset pimples and deep cysts, frequently along the jawline, chin, and lower face.',
      hi: 'चेहरे, जबड़े और ठोड़ी पर लगातार निकलने वाले ज़िद्दी मुंहासे या कील-मुंहासे।',
      kn: 'ಮುಖ, ಗಲ್ಲದ ಮೇಲೆ ನಿರಂತರವಾಗಿ ಕಾಣಿಸಿಕೊಳ್ಳುವ ಕೀವು ತುಂಬಿದ ಮೊಡವೆಗಳು.',
      ta: 'தாடை மற்றும் முகத்தில் தொடர்ந்து வரும் ஆழமான பருக்கள்.',
      te: 'దవడ, గడ్డంపై నిరంతరం వచ్చే మొటిమలు.',
      mr: 'हनुवटी आणि चेहऱ्यावर सतत येणारी मुरुमे.',
      bn: 'মুখের ত্বক এবং চিবুকে ক্রমাগত হওয়া তীব্র ব্রণ।'
    },
    synonyms: {
      en: ['pimples', 'breakouts', 'cystic acne', 'zits', 'facial spots'],
      hi: ['कील-मुंहासे', 'फुंसियां', 'चेहरे के दाने', 'पिंपल्स'],
      kn: ['ಮೊಡವೆ', 'ಕೀವು ಗುಳ್ಳೆ', 'ಮುಖದ ಗುಳ್ಳೆಗಳು'],
      ta: ['பருக்கள்', 'முகக்கட்டிகள்', 'முகப்பரு'],
      te: ['మొటిమలు', 'ముఖంపై గుల్లలు', 'పింపుల్స్'],
      mr: ['मुरुम', 'पुटकुळ्या', 'चेहऱ्यावरील दाणे'],
      bn: ['ব্রণ', 'ফুসকুড়ি', 'পিম্পল']
    }
  },
  {
    id: 'increased_hair',
    category: 'Dermatological & Androgenic',
    isRedFlag: false,
    labels: {
      en: 'Increased facial or body hair (Hirsutism)',
      hi: 'चेहरे या शरीर पर अनचाहे बाल (हिर्सुटिज़्म)',
      kn: 'ಮುಖ ಮತ್ತು ದೇಹದ ಮೇಲೆ ಅತಿಯಾದ ಕೂದಲು',
      ta: 'முகத்தில் தேவையற்ற முடி வளர்ச்சி',
      te: 'ముఖంపై అవాంఛిత రోమాలు',
      mr: 'चेहऱ्यावर किंवा शरीरावर नको असलेले केस',
      bn: 'মুখে বা শরীরে অবাঞ্ছিত লোম বৃদ্ধি'
    },
    descriptions: {
      en: 'Coarse, dark hair growth in androgen-dependent zones such as chin, upper lip, chest, abdomen, or back.',
      hi: 'ठोड़ी, ऊपरी होंठ, छाती या पेट पर मोटे और काले अनचाहे बाल उगना।',
      kn: 'ಗಲ್ಲ, ಮೇಲ್ತುಟಿ ಅಥವಾ ಹೊಟ್ಟೆಯ ಮೇಲೆ ದಪ್ಪನೆಯ ಅನಗತ್ಯ ಕೂದಲು ಬೆಳೆಯುವುದು.',
      ta: 'தாடை, மேல் உதடு போன்ற பகுதிகளில் தடிமனான முடி வளர்ச்சி.',
      te: 'గడ్డం, పైపెదవి వద్ద ముదురు వెంట్రుకలు పెరగడం.',
      mr: 'हनुवटी, ओठांवर काळे जाड केस येणे.',
      bn: 'চিবুক, উপরের ঠোঁটে ঘন কালো লোম গজানো।'
    },
    synonyms: {
      en: ['facial hair', 'chin hair', 'unwanted hair', 'excess hair', 'hirsutism'],
      hi: ['चेहरे पर बाल', 'दाढ़ी पर बाल', 'अनचाहे बाल'],
      kn: ['ಮುಖದಲ್ಲಿ ಕೂದಲು', 'ಗಲ್ಲದ ಕೂದಲು', 'ಅನಗತ್ಯ ರೋಮಗಳು'],
      ta: ['முகத்தில் முடி', 'தாடி முடி', 'தேவையற்ற ரோமம்'],
      te: ['గడ్డం వెంట్రుకలు', 'అవాంఛిత రోమాలు'],
      mr: ['चेहऱ्यावरील केस', 'नको असलेले केस'],
      bn: ['মুখের লোম', 'চিবুকের লোম', 'অবাঞ্ছিত লোম']
    }
  },
  {
    id: 'severe_pain',
    category: 'Pain & Discomfort',
    isRedFlag: true,
    labels: {
      en: 'Severe pelvic or abdominal pain',
      hi: 'अत्यधिक तीव्र पेल्विक या पेट दर्द',
      kn: 'ತೀವ್ರವಾದ ಕಿಬ್ಬೊಟ್ಟೆ ನೋವು',
      ta: 'கடுமையான அடிவயிற்று வலி',
      te: 'తీవ్రమైన కటి లేదా పొత్తికడుపు నొప్పి',
      mr: 'ओटीपोटात तीव्र वेदना',
      bn: 'তলপেটে তীব্র বা অসহনীয় ব্যথা'
    },
    descriptions: {
      en: 'Intense, incapacitating, or sudden pain in the lower abdomen or pelvis that interferes with daily tasks.',
      hi: 'पेट के निचले हिस्से में असहनीय, तीव्र या अचानक होने वाला तेज दर्द।',
      kn: 'ದೈನಂದಿನ ಕೆಲಸಗಳನ್ನು ಮಾಡಲು ಅಡ್ಡಿಯಾಗುವಷ್ಟು ತೀವ್ರವಾದ ಹೊಟ್ಟೆ ನೋವು.',
      ta: 'தாங்க முடியாத அல்லது திடீரென ஏற்படும் கடுமையான வயிற்று வலி.',
      te: 'భరించలేని విధంగా హఠాత్తుగా వచ్చే తీవ్రమైన పొత్తికడుపు నొప్పి.',
      mr: 'सहन न होणाऱ्या आणि अचानक सुरू होणाऱ्या तीव्र वेदना.',
      bn: 'তলপেটে হঠাৎ হওয়া অসহ্য তীব্র ব্যথা।'
    },
    synonyms: {
      en: ['severe cramps', 'sharp pelvic pain', 'unbearable cramps', 'intense belly ache'],
      hi: ['असहनीय दर्द', 'पेट में तेज मरोड़', 'भीषण दर्द'],
      kn: ['ಭರಿಸಲಾಗದ ನೋವು', 'ತೀವ್ರ ಸೆಳೆತ'],
      ta: ['கடுமையான வலி', 'தாங்க முடியாத வலி'],
      te: ['భరించలేని నొప్పి', 'తీవ్రమైన తిమ్మిరి'],
      mr: ['असह्य वेदना', 'तीव्र पोटदुखी'],
      bn: ['তীব্র পেটব্যথা', 'অসহ্য যন্ত্রণা']
    }
  },
  {
    id: 'heavy_bleeding',
    category: 'Menstrual & Bleeding',
    isRedFlag: true,
    labels: {
      en: 'Very heavy menstrual bleeding',
      hi: 'अत्यधिक भारी मासिक रक्तस्राव',
      kn: 'ಅತಿಯಾದ ಮುಟ್ಟಿನ ರಕ್ತಸ್ರಾವ',
      ta: 'மிக அதிக மாதவிடாய் ரத்தப்போக்கு',
      te: 'అధిక ఋతు రక్తస్రావం',
      mr: 'अत्यधिक मासिक पाळीचा रक्तस्राव',
      bn: 'অত্যধিক বা অস্বাভাবিক মাসিক রক্তপাত'
    },
    descriptions: {
      en: 'Bleeding so heavy that it requires changing pads/tampons every hour for consecutive hours, or passing large blood clots.',
      hi: 'हर एक-दो घंटे में पैड बदलना पड़ना या बड़े-बड़े रक्त के थक्के (क्लॉट्स) आना।',
      kn: 'ಪ್ರತಿ ಗಂಟೆಗೊಮ್ಮೆ ಪ್ಯಾಡ್ ಬದಲಾಯಿಸಬೇಕಾದಷ್ಟು ವಿಪರೀತ ರಕ್ತಸ್ರಾವವಾಗುವುದು.',
      ta: 'ஒவ்வொரு மணி நேரத்திற்கும் பேட் மாற்ற வேண்டிய அளவிற்கு அதிக ரத்தப்போக்கு.',
      te: 'గంటకోసారి ప్యాడ్ మార్చాల్సి వచ్చేంత విపరీతమైన రక్తస్రావం.',
      mr: 'दर तासाला पॅड बदलावा लागणे किंवा रक्ताच्या मोठ्या गुठळ्या जाणे.',
      bn: 'ঘণ্টায় ঘণ্টায় প্যাড বদলাতে হওয়া বা রক্তজমাট বের হওয়া।'
    },
    synonyms: {
      en: ['flooding', 'soaking pads', 'menorrhagia', 'excessive bleeding', 'blood clots'],
      hi: ['बहुत ज्यादा ब्लीडिंग', 'खून के थक्के', 'भारी बहाव'],
      kn: ['ವಿಪರೀತ ರಕ್ತಸ್ರಾವ', 'ರಕ್ತದ ಹೆಪ್ಪುಗಟ್ಟುವಿಕೆ'],
      ta: ['அதிக உதிரப்போக்கு', 'ரத்தக் கட்டிகள்'],
      te: ['రక్తపు గడ్డలు', 'విపరీతమైన బ్లీడింగ్'],
      mr: ['अति रक्तस्राव', 'रक्ताच्या गाठी'],
      bn: ['ক্লট বের হওয়া', 'অতিরিক্ত রক্তক্ষরণ']
    }
  },
  {
    id: 'hair_thinning',
    category: 'Dermatological & Androgenic',
    isRedFlag: false,
    labels: {
      en: 'Scalp hair thinning or hair fall',
      hi: 'सिर के बाल झड़ना या पतले होना',
      kn: 'ತಲೆಯ ಕೂದಲು ಉದುರುವುದು ಅಥವಾ ತೆಳುವಾಗುವುದು',
      ta: 'தலைமுடி உதிர்தல் அல்லது மெலிதாகுதல்',
      te: 'జుట్టు రాలడం లేదా పలుచబడటం',
      mr: 'केस गळणे किंवा विरळ होणे',
      bn: 'মাথার চুল পড়া বা পাতলা হয়ে যাওয়া'
    },
    descriptions: {
      en: 'Noticeable widening of the middle hair part or diffuse hair loss across the crown.',
      hi: 'मांग चौड़ी होना या सिर के बीच के हिस्से से बाल तेजी से पतले होकर गिरना।',
      kn: 'ತಲೆಯ ಮಧ್ಯಭಾಗದಲ್ಲಿ ಕೂದಲು ಉದುರಿ ಬೋಳು ಕಾಣಿಸಿಕೊಳ್ಳುವುದು.',
      ta: 'தலையின் நடுப்பகுதியில் முடி மெலிந்து அடர்த்தி குறைவது.',
      te: 'తల మధ్యభాగంలో జుట్టు పలుచబడి రాలిపోవడం.',
      mr: 'भांग रुंद होणे आणि डोक्यावरील केस पातळ होणे.',
      bn: 'মাঝের সিঁথি চওড়া হওয়া বা মাথার চুল পাতলা হওয়া।'
    },
    synonyms: {
      en: ['hair fall', 'hair loss', 'alopecia', 'widening part', 'thinning crown'],
      hi: ['बाल गिरना', 'गंजापन', 'बाल पतले होना'],
      kn: ['ಕೂದಲು ಉದುರುವಿಕೆ', 'ಕೂದಲು ತೆಳು'],
      ta: ['முடி கொட்டுதல்', 'முடி உதிர்தல்'],
      te: ['జుట్టు రాలడం', 'బట్టతల'],
      mr: ['केस गळती', 'केस विरळ होणे'],
      bn: ['চুল ঝরে যাওয়া', 'চুল পাতলা হওয়া']
    }
  },
  {
    id: 'weight_changes',
    category: 'Metabolic & Endocrine',
    isRedFlag: false,
    labels: {
      en: 'Unexplained weight gain or difficulty losing weight',
      hi: 'वजन बढ़ना या वजन कम करने में कठिनाई',
      kn: 'ತೂಕ ಹೆಚ್ಚಳ ಅಥವಾ ತೂಕ ಇಳಿಸಲು ಕಷ್ಟವಾಗುವುದು',
      ta: 'திடீர் எடை அதிகரிப்பு அல்லது எடையைக் குறைக்க இயலாமை',
      te: 'వివరించలేని బరువు పెరుగుదల లేదా బరువు తగ్గకపోవడం',
      mr: 'वजन वाढणे किंवा वजन कमी न होणे',
      bn: 'অব্যক্ত ওজন বৃদ্ধি বা ওজন কমাতে অসুবিধা'
    },
    descriptions: {
      en: 'Gradual or rapid weight gain especially around the abdomen, often associated with insulin resistance.',
      hi: 'पेट के आसपास तेज़ी से चर्बी बढ़ना और संतुलित आहार के बावजूद वजन कम न होना।',
      kn: 'ಹೊಟ್ಟೆಯ ಸುತ್ತ ಕೊಬ್ಬು ಹೆಚ್ಚುವುದು ಮತ್ತು ತೂಕ ಇಳಿಸಲು ಕಷ್ಟವಾಗುವುದು.',
      ta: 'வயிற்றுப் பகுதியில் கொழுப்பு சேர்வது மற்றும் உடல் எடை கூடுவது.',
      te: 'పొట్ట చుట్టూ కొవ్వు చేరి బరువు పెరగడం.',
      mr: 'पोटाभोवती चरबी वाढणे आणि वजन सहज न घटणे.',
      bn: 'পেটের মেদ বৃদ্ধি এবং চেষ্টা করেও ওজন না কমা।'
    },
    synonyms: {
      en: ['weight gain', 'stubborn weight', 'metabolic slowdown', 'belly fat'],
      hi: ['मोटापा', 'वजन बढ़ रहा है', 'पेट की चर्बी'],
      kn: ['ತೂಕ ಏರಿಕೆ', 'ದಪ್ಪಗಾಗುವುದು'],
      ta: ['எடை கூடுதல்', 'தொப்பை'],
      te: ['లావెక్కడం', 'బరువు పెరగడం'],
      mr: ['वजन वाढ', 'जाड होणे'],
      bn: ['ওজন বাড়া', 'মোটা হওয়া']
    }
  },
  {
    id: 'fatigue',
    category: 'Systemic & Metabolic',
    isRedFlag: false,
    labels: {
      en: 'Persistent fatigue and low energy',
      hi: 'लगातार थकान और ऊर्जा की कमी',
      kn: 'ನಿರಂತರ ಆಯಾಸ ಮತ್ತು ಸುಸ್ತು',
      ta: 'தொடர் சோர்வு மற்றும் மந்தநிலை',
      te: 'నిరంతర అలసట మరియు నీరసం',
      mr: 'सतत जाणवणारा थकवा आणि अशक्तपणा',
      bn: 'ক্রমাগত ক্লান্তি এবং শক্তির অভাব'
    },
    descriptions: {
      en: 'Chronic sluggishness, afternoon energy crashes, and feeling unrefreshed despite adequate sleep.',
      hi: 'पर्याप्त नींद के बाद भी लगातार कमजोरी, सुस्ती और ऊर्जा में भारी गिरावट महसूस होना।',
      kn: 'ಸಾಕಷ್ಟು ನಿದ್ರೆಯ ನಂತರವೂ ನಿರಂತರವಾಗಿ ಆಯಾಸ ಮತ್ತು ನಿಶ್ಯಕ್ತಿ ಅನುಭವವಾಗುವುದು.',
      ta: 'போதுமான தூக்கத்திற்குப் பிறகும் ஆற்றல் இன்றி எப்போதும் சோர்வாக உணர்வது.',
      te: 'సరిపడా నిద్రపోయినా ఎప్పుడూ నీరసంగా, అలసటగా ఉండటం.',
      mr: 'पुरेशी झोप घेऊनही सतत थकवा आणि ग्लानी वाटणे.',
      bn: 'পর্যাপ্ত ঘুমের পরেও সারাদিন ক্লান্তিবোধ হওয়া।'
    },
    synonyms: {
      en: ['tiredness', 'exhaustion', 'sluggishness', 'low energy', 'brain fog'],
      hi: ['सुस्ती', 'कमजोरी', 'जल्दी थक जाना'],
      kn: ['ಆಲಸ್ಯ', 'ಸುಸ್ತು', 'ನಿಶ್ಯಕ್ತಿ'],
      ta: ['களைப்பு', 'உடல் சோர்வு'],
      te: ['నీరసం', 'బలహీనత'],
      mr: ['सुस्ती', 'अशक्तपणा'],
      bn: ['ক্লান্তি', 'দুর্বলতা']
    }
  },
  {
    id: 'dizziness',
    category: 'Systemic & Vital',
    isRedFlag: true,
    labels: {
      en: 'Dizziness, lightheadedness, or fainting',
      hi: 'चक्कर आना या बेहोशी जैसा लगना',
      kn: 'ತಲೆತಿರುಗುವಿಕೆ ಅಥವಾ ಮೂರ್ಛೆ',
      ta: 'தலைச்சுற்றல் அல்லது மயக்கம்',
      te: 'కళ్ళు తిరగడం లేదా మూర్ఛ రావడం',
      mr: 'चक्कर येणे किंवा भोवळ येणे',
      bn: 'মাথা ঘোরা বা অজ্ঞান হয়ে যাওয়া'
    },
    descriptions: {
      en: 'Feeling faint, room spinning, or blacking out, particularly during heavy menstrual flow or when standing up.',
      hi: 'खड़े होने पर या भारी मासिक बहाव के दौरान सिर घूमना, आंखों के आगे अंधेरा छाना या चक्कर आना।',
      kn: 'ನಿಂತಾಗ ಅಥವಾ ಅತಿಯಾದ ರಕ್ತಸ್ರಾವದ ಸಮಯದಲ್ಲಿ ತಲೆ ತಿರುಗಿ ಕಣ್ಣು ಕತ್ತಲೆ ಬರುವುದು.',
      ta: 'நிற்கும் போதோ அல்லது அதிக ரத்தப்போக்கின் போதோ தலைசுற்றுவது போல் தோன்றுவது.',
      te: 'నిలబడినప్పుడు లేదా అధిక రక్తస్రావ సమయంలో తల తిరగడం.',
      mr: 'उभे राहिल्यावर डोळ्यांसमोर अंधारी येणे किंवा चक्कर येणे.',
      bn: 'দাঁড়িয়ে থাকলে বা অতিরিক্ত রক্তপাতের সময় মাথা ঘোরা।'
    },
    synonyms: {
      en: ['faint', 'blackout', 'vertigo', 'lightheaded', 'passed out'],
      hi: ['सिर घूमना', 'बेहोशी', 'अंधेरा छाना'],
      kn: ['ಮೂರ್ಛೆ', 'ತಲೆ ತಿರುಗುವುದು'],
      ta: ['மயக்கம்', 'தலைச்சுற்றல்'],
      te: ['స్పృహ తప్పడం', 'కళ్ళు తిరగడం'],
      mr: ['भोवळ', 'चक्कर'],
      bn: ['অজ্ঞান হওয়া', 'মাথা ঘোরা']
    }
  }
]

/**
 * Searches and maps free-text inputs across all 7 languages to canonical symptom entries.
 * 
 * @param {string} query - Free text phrase in any supported language
 * @returns {Object|null} - Matched dictionary entry or null
 */
export function lookupSymptom(query = '') {
  if (!query || typeof query !== 'string') return null
  const clean = query.toLowerCase().trim()

  for (const item of SYMPTOM_DICTIONARY) {
    if (item.id === clean) return item

    // Check all language labels
    for (const label of Object.values(item.labels)) {
      if (label.toLowerCase().includes(clean) || clean.includes(label.toLowerCase())) {
        return item
      }
    }

    // Check all synonyms across all languages
    for (const synList of Object.values(item.synonyms)) {
      for (const syn of synList) {
        if (clean.includes(syn.toLowerCase()) || syn.toLowerCase().includes(clean)) {
          return item
        }
      }
    }
  }

  return null
}

/**
 * Returns localized symptom display name with safe English fallback.
 */
export function getSymptomLabel(id, lang = 'en') {
  const item = SYMPTOM_DICTIONARY.find((s) => s.id === id)
  if (!item) return id
  return item.labels[lang] || item.labels.en || id
}

/**
 * Returns all symptoms formatted for picker lists in requested language.
 */
export function getLocalizedSymptomList(lang = 'en') {
  return SYMPTOM_DICTIONARY.map((item) => ({
    id: item.id,
    label: item.labels[lang] || item.labels.en,
    category: item.category,
    isRedFlag: item.isRedFlag,
    description: item.descriptions[lang] || item.descriptions.en,
  }))
}

export default SYMPTOM_DICTIONARY
