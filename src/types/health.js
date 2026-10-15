/**
 * Luna Her Shared Health Data Model
 * 
 * Defines standard schemas compatible with downstream symptom checkers,
 * cycle loggers, clinical summary generators, and offline encrypted storage.
 */

/**
 * @typedef {Object} HealthEntry
 * @property {string} id - Unique identifier (e.g. entry-2026-10-14-01)
 * @property {string} timestamp - ISO 8601 string representation of entry time
 * @property {string} dateFormatted - Localized human readable date & time
 * @property {'symptom' | 'cycle' | 'vital' | 'mood' | 'note'} category - Entry classification
 * @property {string} title - Short descriptive title of the entry
 * @property {'mild' | 'moderate' | 'severe'} severity - Perceived severity level
 * @property {string} [stage] - Life/maternal stage (e.g. "2nd Trimester (Week 24)")
 * @property {string[]} tags - Categorization tags
 * @property {string} notes - User's narrative or speech-transcribed notes
 * @property {Object} [vitals] - Associated physiological vitals
 * @property {number} [vitals.bpSystolic] - Blood pressure systolic (mmHg)
 * @property {number} [vitals.bpDiastolic] - Blood pressure diastolic (mmHg)
 * @property {number} [vitals.pulse] - Resting pulse (bpm)
 * @property {number} [vitals.fetalKicksCount] - 1-hour fetal movement count if pregnant
 * @property {number} [vitals.temperature] - Temperature in Fahrenheit
 * @property {boolean} isUrgent - Flag indicates red-flag clinical symptom
 * @property {'voice' | 'typed' | 'quick-log'} source - Method used to log entry
 */

export const ENTRY_CATEGORIES = {
  SYMPTOM: {
    id: 'symptom',
    label: 'Symptom Log',
    helperText: 'Physical discomforts, pain, nausea, or bodily sensations',
    badgeColor: 'amber'
  },
  CYCLE: {
    id: 'cycle',
    label: 'Cycle & Ovulation',
    helperText: 'Menstrual dates, flow levels, and cycle indicators',
    badgeColor: 'rose'
  },
  VITAL: {
    id: 'vital',
    label: 'Vitals & Measurements',
    helperText: 'Blood pressure, weight, kicks count, and heart rate',
    badgeColor: 'emerald'
  },
  MOOD: {
    id: 'mood',
    label: 'Mood & Emotional State',
    helperText: 'Anxiety, joy, sleep quality, and emotional wellbeing',
    badgeColor: 'purple'
  },
  NOTE: {
    id: 'note',
    label: 'Personal Health Note',
    helperText: 'Questions for doctor visits and daily reflections',
    badgeColor: 'blue'
  }
};
