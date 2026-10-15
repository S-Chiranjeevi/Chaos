import { BookOpen, CalendarDays, HeartPulse, House, MessageCircle, Microscope, Stethoscope } from 'lucide-react'

export const MAIN_SECTIONS = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'talk', label: 'Talk or Type', icon: MessageCircle },
  { id: 'tracker', label: 'Cycle Insights & Forecast', shortLabel: 'Cycle', icon: CalendarDays },
  { id: 'insights', label: 'Early Warnings and Insights', shortLabel: 'Insights', icon: HeartPulse },
  { id: 'screening', label: 'PCOS Research Screening', shortLabel: 'Screening', icon: Microscope },
  { id: 'doctor', label: 'Doctor Summary', shortLabel: 'Doctor', icon: Stethoscope },
  { id: 'learn', label: 'Learn and Myths', shortLabel: 'Learn', icon: BookOpen },
]
