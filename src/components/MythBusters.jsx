import React from 'react'
import { XCircle, CheckCircle } from 'lucide-react'

export function MythBusters() {
  const myths = [
    {
      myth: 'Myth: Having PCOS means you can never get pregnant.',
      fact: 'PCOS is one of the most treatable causes of ovulatory subfertility. Many women conceive naturally with cycle regulation and lifestyle interventions, or with first-line medical ovulation induction (like letrozole).',
    },
    {
      myth: 'Myth: PCOS only affects people who are overweight.',
      fact: 'Up to 30% of women diagnosed with PCOS have a normal body mass index ("Lean PCOS"). They still experience hyperandrogenism, irregular ovulation, and subtle insulin resistance.',
    },
    {
      myth: 'Myth: Birth control pills "cure" PCOS.',
      fact: 'Oral contraceptive pills help manage symptoms by inducing regular withdrawal bleeds and suppressing androgen production, but they do not alter the underlying metabolic biology.',
    },
    {
      myth: 'Myth: Multiple small follicles on ultrasound always mean you have PCOS.',
      fact: 'Up to 25% of healthy young women have multifollicular ovaries on ultrasound without having PCOS. The international Rotterdam criteria require at least two distinct criteria and ruling out mimics.',
    },
  ]

  return (
    <div className="myths-grid">
      {myths.map((item, idx) => (
        <div key={idx} className="myth-item">
          <div className="myth-title">
            <XCircle size={18} className="myth-icon" />
            <span>{item.myth}</span>
          </div>
          <div className="myth-reality">
            <CheckCircle size={16} className="reality-icon" />
            <p><strong>Fact:</strong> {item.fact}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
