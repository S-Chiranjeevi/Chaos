import { CalendarDays, Pencil, Stethoscope } from 'lucide-react'
import { explainCyclePatterns } from '../services/cycleAnalysis.js'

function displayDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function PatternTimeline({ entries, analysis, summaryIds, onEdit, onAddToSummary }) {
  const ordered = [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate))
  const explanations = explainCyclePatterns(analysis)

  return (
    <div className="cycle-timeline-column">
      <section className={`cycle-pattern-card ${analysis.urgentGuidance ? 'cycle-pattern-urgent' : ''}`} aria-labelledby="pattern-title" aria-live="polite">
        <div className="cycle-section-title"><span className="cycle-icon"><Stethoscope size={18} aria-hidden="true" /></span><div><h3 id="pattern-title">Pattern explanation</h3><p>Observations from your entries, not a diagnosis.</p></div></div>
        {analysis.urgentGuidance && <p className="cycle-urgent-alert" role="alert">Please seek urgent medical care or contact local emergency services.</p>}
        <ul className="cycle-explanations">{explanations.map((explanation) => <li key={explanation}>{explanation}</li>)}</ul>
        <div className="cycle-repeated-symptoms"><strong>Repeated symptoms</strong>{analysis.repeatedSymptoms.length ? <><p>You have logged this symptom several times: {analysis.repeatedSymptoms.map((item) => item.symptom).join(', ')}.</p><small>Consider discussing this pattern with a healthcare professional.</small></> : <p>Symptoms recorded more than once will appear here.</p>}</div>
        <a className="early-warning-link" href="#early-warning">See early warning information <span aria-hidden="true">↗</span></a>
      </section>

      <section className="cycle-timeline" aria-labelledby="cycle-timeline-title">
        <div className="cycle-section-title timeline-title"><span className="cycle-icon"><CalendarDays size={18} aria-hidden="true" /></span><div><h3 id="cycle-timeline-title">Your timeline</h3><p>Period dates and check-ins, newest first.</p></div></div>
        {ordered.length === 0 ? (
          <div className="cycle-empty"><CalendarDays size={25} aria-hidden="true" /><h4>Your timeline starts here</h4><p>Once you save a period start date, it will appear here.</p></div>
        ) : (
          <ol className="cycle-timeline-list">
            {ordered.map((entry) => (
              <li className="cycle-timeline-item" key={entry.id}>
                <span className="cycle-timeline-dot" aria-hidden="true" />
                <article className="cycle-entry-card">
                  <div className="cycle-entry-header"><div><time dateTime={entry.startDate}>{displayDate(entry.startDate)}</time><p>{entry.endDate ? `Period ended ${displayDate(entry.endDate)}` : 'End date not recorded'}</p>{analysis.intervals.find((interval) => interval.to === entry.startDate) && <p className="timeline-cycle-length">{analysis.intervals.find((interval) => interval.to === entry.startDate).days} days between period starts</p>}</div><button className="cycle-small-action" type="button" onClick={() => onEdit(entry)} aria-label={`Edit entry for ${displayDate(entry.startDate)}`}><Pencil size={13} aria-hidden="true" /> Edit</button></div>
                  <dl className="cycle-entry-details">
                    {entry.flowLevel && <div><dt>Flow</dt><dd>{entry.flowLevel}</dd></div>}
                    {entry.painLevel && <div><dt>Pain</dt><dd>{entry.painLevel}</dd></div>}
                    {entry.mood && <div><dt>Mood</dt><dd>{entry.mood}</dd></div>}
                    {entry.energyLevel && <div><dt>Energy</dt><dd>{entry.energyLevel}</dd></div>}
                  </dl>
                  {entry.symptoms?.length > 0 && <div className="cycle-entry-symptoms" aria-label="Symptoms">{entry.symptoms.map((symptom) => <span className="cycle-tag" key={symptom}>{symptom}</span>)}</div>}
                  {entry.notes && <p className="cycle-entry-note">“{entry.notes}”</p>}
                  <button className={`cycle-summary-action ${summaryIds.has(entry.id) ? 'added' : ''}`} type="button" disabled={summaryIds.has(entry.id)} onClick={() => onAddToSummary(entry)}><Stethoscope size={14} aria-hidden="true" />{summaryIds.has(entry.id) ? 'Added to doctor summary' : 'Add to doctor summary'}</button>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

export default PatternTimeline
