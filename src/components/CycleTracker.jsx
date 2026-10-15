import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Plus, TrendingUp } from 'lucide-react'

const STORAGE_KEY = 'sakhicare_cycle_tracker'

function readEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CycleTracker({ latestEntry }) {
  const [entries, setEntries] = useState(readEntries)
  const [cycleDate, setCycleDate] = useState('')
  const [cycleNote, setCycleNote] = useState('')

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) }, [entries])

  const pattern = useMemo(() => {
    const irregular = entries.filter((entry) => /irregular|late|missed|2.?3 months|infrequent/i.test(entry.note)).length
    if (irregular >= 3) return 'Three or more entries mention irregular cycles. Consider bringing this timeline to a gynecologist.'
    if (entries.length >= 3) return 'You have three or more entries. This timeline can make your doctor conversation easier.'
    return null
  }, [entries])

  function addCycle(event) {
    event.preventDefault()
    if (!cycleDate) return
    const note = cycleNote.trim() || latestEntry?.symptoms?.map((symptom) => symptom.symptom).join(', ') || 'Period logged'
    setEntries((current) => [...current, { id: `${Date.now()}`, date: cycleDate, note }].sort((a, b) => b.date.localeCompare(a.date)))
    setCycleDate('')
    setCycleNote('')
  }

  return <div className="tracker-card">
    <div className="tracker-intro"><CalendarDays size={22} /><div><h3>Cycle and symptom log</h3><p>Stored only on this device. Add past cycles to spot repeated patterns.</p></div></div>
    <form className="tracker-form" onSubmit={addCycle}>
      <label>Period start date<input type="date" value={cycleDate} onChange={(event) => setCycleDate(event.target.value)} required /></label>
      <label>Optional note<input value={cycleNote} onChange={(event) => setCycleNote(event.target.value)} placeholder="For example: cycle was late, acne" /></label>
      <button className="tracker-add" type="submit"><Plus size={16} /> Add log</button>
    </form>
    {pattern && <div className="pattern-alert"><TrendingUp size={18} /><span>{pattern}</span></div>}
    {entries.length === 0 ? <p className="tracker-empty">No tracker data yet. Add a period start date or symptom note when you are ready.</p> : <ul className="tracker-list">{entries.map((entry) => <li key={entry.id}><strong>{new Date(`${entry.date}T12:00:00`).toLocaleDateString()}</strong><span>{entry.note}</span></li>)}</ul>}
    <p className="tracker-disclaimer">This is information, not a diagnosis.</p>
  </div>
}
