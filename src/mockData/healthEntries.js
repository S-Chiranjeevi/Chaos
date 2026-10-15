/**
 * SakhiCare Mock Health Entries
 * Compatible with the shared HealthEntry schema.
 * Fully device-local mock entries illustrating maternal & women's health logs.
 */

export const MOCK_HEALTH_ENTRIES = [
  {
    id: 'entry-001',
    timestamp: '2026-10-15T08:15:00Z',
    dateFormatted: 'Today, 8:15 AM',
    category: 'vital',
    title: 'Morning Fetal Kick Count & BP',
    severity: 'mild',
    stage: '2nd Trimester · Week 24',
    tags: ['Kick Count', 'Blood Pressure', 'Routine'],
    notes: 'Counted 10 distinct movements within 35 minutes after warm breakfast. Resting blood pressure recorded with home cuff.',
    vitals: {
      bpSystolic: 118,
      bpDiastolic: 76,
      pulse: 74,
      fetalKicksCount: 10
    },
    isUrgent: false,
    source: 'quick-log'
  },
  {
    id: 'entry-002',
    timestamp: '2026-10-14T19:40:00Z',
    dateFormatted: 'Yesterday, 7:40 PM',
    category: 'symptom',
    title: 'Mild Lower Back Tension & Pelvic Heaviness',
    severity: 'mild',
    stage: '2nd Trimester · Week 24',
    tags: ['Backache', 'Posture', 'Standing Fatigue'],
    notes: 'Developed after standing for approximately 40 minutes preparing dinner. Eased after resting on left lateral side with a cushion.',
    vitals: {
      bpSystolic: null,
      bpDiastolic: null,
      pulse: 80
    },
    isUrgent: false,
    source: 'voice'
  },
  {
    id: 'entry-003',
    timestamp: '2026-10-13T14:10:00Z',
    dateFormatted: '13 Oct 2026, 2:10 PM',
    category: 'mood',
    title: 'Calm and Energized After Prenatal Walk',
    severity: 'mild',
    stage: '2nd Trimester · Week 24',
    tags: ['Mindfulness', 'Energy', 'Gentle Walk'],
    notes: 'Completed a 20-minute shaded walking loop with mother. Feeling well-hydrated with fresh coconut water.',
    vitals: {
      pulse: 82
    },
    isUrgent: false,
    source: 'typed'
  },
  {
    id: 'entry-004',
    timestamp: '2026-10-11T09:00:00Z',
    dateFormatted: '11 Oct 2026, 9:00 AM',
    category: 'note',
    title: 'Questions for Dr. Radhika (Upcoming Ultrasound)',
    severity: 'mild',
    stage: '2nd Trimester · Week 23',
    tags: ['Doctor Visit', 'Anomaly Scan', 'Iron Supplements'],
    notes: '1. Ask if current iron chewable tablets can be taken with lemon water for better absorption. 2. Verify anomaly scan results schedule.',
    isUrgent: false,
    source: 'typed'
  },
  {
    id: 'entry-005',
    timestamp: '2026-10-09T22:30:00Z',
    dateFormatted: '09 Oct 2026, 10:30 PM',
    category: 'symptom',
    title: 'Nighttime Heartburn / Acid Reflux',
    severity: 'moderate',
    stage: '2nd Trimester · Week 23',
    tags: ['Heartburn', 'Digestion', 'Late Meal'],
    notes: 'Experienced burning sensation behind chest bone after having spicy dal for dinner. Elevated head of bed with two extra pillows.',
    isUrgent: false,
    source: 'voice'
  }
];

export const MOCK_USER_PROFILE = {
  name: 'Ananya Sharma',
  age: 28,
  preferredLanguage: 'en', // 'en' | 'hi' | 'bn' | 'ta' | 'te'
  currentStage: 'Pregnancy · 2nd Trimester (Week 24)',
  deviceStorageStatus: '100% Encrypted Local SQLite / IndexedDB',
  lastSyncedDeviceTime: 'Just now'
};

export const MOCK_LEARN_ARTICLES = [
  {
    id: 'art-01',
    title: 'Understanding Red Flag Symptoms During Pregnancy',
    category: 'Urgent Care & Triage',
    categoryColor: 'rose',
    readingTime: '4 min read',
    summary: 'Clear guidance on when to seek immediate medical attention: sudden facial swelling, severe headaches, or reduced movements.',
    tags: ['Red Flags', 'Safety', 'Emergency Care'],
    urgentContext: true
  },
  {
    id: 'art-02',
    title: 'Maximizing Iron and Folate Absorption Naturally',
    category: 'Nutrition & Diet',
    categoryColor: 'emerald',
    readingTime: '3 min read',
    summary: 'Why pairing your green leafy vegetables and jaggery with Vitamin C (amla, lemon) doubles your body’s iron uptake.',
    tags: ['Nutrition', 'Iron Deficiency', 'Traditional Foods'],
    urgentContext: false
  },
  {
    id: 'art-03',
    title: 'Gentle Pelvic Floor and Breathing Exercises',
    category: 'Physical Wellness',
    categoryColor: 'purple',
    readingTime: '5 min read',
    summary: 'Step-by-step gentle movements to ease lower back tension, improve posture, and prepare for safe labor.',
    tags: ['Exercise', 'Pelvic Health', 'Breathwork'],
    urgentContext: false
  },
  {
    id: 'art-04',
    title: 'Recognizing Emotional Shifts & Asking for Support',
    category: 'Mental Wellbeing',
    categoryColor: 'blue',
    readingTime: '4 min read',
    summary: 'Hormonal fluctuations affect mood. Learn practical self-care rituals and how to speak openly with family or your Sakhi.',
    tags: ['Emotional Health', 'Postpartum Preparation'],
    urgentContext: false
  }
];
