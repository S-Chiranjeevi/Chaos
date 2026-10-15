// Predefined test presets for interactive testing of the 10 requirements
export const PRESETS = [
  {
    id: 'empty_user',
    label: '1. New User (No Data)',
    description: 'User who just signed up, generating missing information insight',
    data: {
      userLanguage: 'English',
      periodLogs: [],
      symptomLogs: [],
      userPreferences: { communicationStyle: 'simple', preferredDoctor: 'female doctor' },
    },
  },
  {
    id: 'irregular_cycles',
    label: '2. 3 Irregular Cycles',
    description: 'Cycles of 58, 64, and 71 days showing cycle_pattern',
    data: {
      userLanguage: 'English',
      periodLogs: [
        { id: 'period-001', date: '2026-03-01', cycleLengthDays: 58 },
        { id: 'period-002', date: '2026-04-28', cycleLengthDays: 64 },
        { id: 'period-003', date: '2026-07-01', cycleLengthDays: 71 },
      ],
      symptomLogs: [],
      userPreferences: { communicationStyle: 'detailed', preferredDoctor: 'female doctor' },
    },
  },
  {
    id: 'repeated_acne',
    label: '3. Repeated Acne',
    description: 'Acne logged across 3 recent cycles',
    data: {
      userLanguage: 'English',
      periodLogs: [
        { id: 'p1', date: '2026-06-01' },
        { id: 'p2', date: '2026-07-01' },
        { id: 'p3', date: '2026-08-01' },
      ],
      symptomLogs: [
        { id: 'symp-acne-1', date: '2026-06-12', symptom: 'Acne', severity: 'Moderate' },
        { id: 'symp-acne-2', date: '2026-07-10', symptom: 'Acne', severity: 'Moderate' },
        { id: 'symp-acne-3', date: '2026-08-15', symptom: 'Acne', severity: 'Mild' },
      ],
      userPreferences: { communicationStyle: 'simple', preferredDoctor: 'a gynecologist' },
    },
  },
  {
    id: 'severe_pain_redflag',
    label: '4. Severe Pain (Safety Warning)',
    description: 'Emergency red-flag symptom triggering urgent safety warning',
    data: {
      userLanguage: 'English',
      periodLogs: [{ id: 'p1', date: '2026-10-01' }],
      symptomLogs: [
        { id: 'symp-sev-1', date: '2026-10-12', symptom: 'Severe pain', severity: 'Severe', notes: 'Unbearable cramps' },
      ],
      userPreferences: { communicationStyle: 'simple', preferredDoctor: 'female doctor' },
    },
  },
  {
    id: 'symptom_duration',
    label: '5. Fatigue > 1 Month (Duration)',
    description: 'Fatigue ongoing for more than a month',
    data: {
      userLanguage: 'English',
      periodLogs: [{ id: 'p1', date: '2026-08-01' }],
      symptomLogs: [
        { id: 'symp-fat-1', date: '2026-08-05', symptom: 'Fatigue', severity: 'Moderate', duration: 'Over 6 weeks' },
      ],
      userPreferences: { communicationStyle: 'simple', preferredDoctor: 'a gynecologist' },
    },
  },
  {
    id: 'hindi_multilingual',
    label: '6. Hindi Language (हिन्दी)',
    description: 'Translates educational insights into clean Hindi',
    data: {
      userLanguage: 'Hindi',
      periodLogs: [
        { id: 'period-001', date: '2026-03-01', cycleLengthDays: 58 },
        { id: 'period-002', date: '2026-04-28', cycleLengthDays: 64 },
        { id: 'period-003', date: '2026-07-01', cycleLengthDays: 71 },
      ],
      symptomLogs: [
        { id: 'symp-acne-1', date: '2026-06-12', symptom: 'Acne', severity: 'Moderate' },
      ],
      userPreferences: { communicationStyle: 'simple', preferredDoctor: 'female doctor' },
    },
  },
]
