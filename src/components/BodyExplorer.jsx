import React, { useState } from 'react'

export function BodyExplorer() {
  const [activeHotspot, setActiveHotspot] = useState('scalp')

  const hotspotDetails = {
    scalp: {
      title: 'Crown Hair Shedding & Scalp Sensitivity',
      pill: 'Androgen Excess Pathway',
      desc: 'Elevated circulating dihydrotestosterone (DHT) acts on androgen receptors in hair follicles, shortening the growth phase and causing diffuse thinning along the part line (androgenic alopecia).',
      points: [
        'Everyday words: "Baal bohot jhad rahe hain, scalp visible ho rahi hai"',
        'Clinical term: Female Pattern Hair Loss / Androgenic Alopecia',
        'Doctor inquiry: "Can we test Free Testosterone, Ferritin, and DHEA-S levels?"',
      ],
    },
    face: {
      title: 'Jawline Cystic Acne & Facial Hirsutism',
      pill: 'Hyperandrogenism & Sebaceous Excess',
      desc: 'Androgens stimulate sebaceous glands to overproduce sebum and convert fine vellus hairs into thicker, pigmented terminal hairs on the chin, jawline, and upper lip.',
      points: [
        'Everyday words: "Chin par unwanted baal aur painful cystic pimples"',
        'Clinical term: Clinical Hirsutism & Hormonal Acne Vulgaris',
        'Doctor inquiry: "What are targeted anti-androgenic strategies for hirsutism?"',
      ],
    },
    neck: {
      title: 'Darkening of Neck & Skin Folds (Acanthosis Nigricans)',
      pill: 'Insulin Resistance Marker',
      desc: 'Chronically elevated insulin levels stimulate epidermal keratinocytes, resulting in velvety hyperpigmented darkening across the nape of the neck or underarms that does not wash off.',
      points: [
        'Everyday words: "Gale pe kaalapan hai jo scrub karne par bhi nahi nikalta"',
        'Clinical term: Acanthosis Nigricans (Cutaneous Sign of Hyperinsulinemia)',
        'Doctor inquiry: "Can we evaluate Fasting Insulin, Fasting Glucose (HOMA-IR), and HbA1c?"',
      ],
    },
    abdomen: {
      title: 'Central Weight Accumulation & Intense Cravings',
      pill: 'Metabolic & Adipose Redistribution',
      desc: 'Insulin resistance drives glucose to be stored preferentially as visceral abdominal fat, triggering reactive blood sugar dips and intense carbohydrate or sweet cravings.',
      points: [
        'Everyday words: "Pet par charbi badh rahi hai aur sweet cravings hoti hain"',
        'Clinical term: Android / Central Adiposity & Reactive Glycemia',
        'Doctor inquiry: "What is my fasting lipid profile and cardiometabolic risk score?"',
      ],
    },
    pelvis: {
      title: 'Irregular Ovulation, Oligomenorrhea & Ovarian Morphology',
      pill: 'Ovarian & Ovulatory Dysfunction',
      desc: 'Disrupted LH-to-FSH signaling prevents ovarian follicles from reaching full maturity and releasing an egg, leaving multiple arrested follicles that appear on pelvic ultrasound.',
      points: [
        'Everyday words: "Periods 2-3 mahine late aate hain ya skip ho jate hain"',
        'Clinical term: Oligo-ovulation / Anovulation & Polycystic Morphology',
        'Doctor inquiry: "Would a pelvic ultrasound evaluate my ovarian antral follicle count?"',
      ],
    },
  }

  const current = hotspotDetails[activeHotspot]

  return (
    <div className="body-explorer-container">
      <div className="silhouette-box">
        <svg className="silhouette-svg" viewBox="0 0 300 520" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Human body silhouette">
          <path d="M150 20 C135 20, 125 35, 125 55 C125 72, 133 85, 142 90 C130 98, 110 110, 105 130 C100 150, 92 200, 88 260 C85 300, 80 340, 82 355 C84 365, 95 365, 98 350 C103 310, 108 260, 115 220 C118 250, 120 300, 122 360 C125 430, 124 490, 138 495 C146 498, 149 485, 147 430 C146 380, 148 310, 150 280 C152 310, 154 380, 153 430 C151 485, 154 498, 162 495 C176 490, 175 430, 178 360 C180 300, 182 250, 185 220 C192 260, 197 310, 202 350 C205 365, 216 365, 218 355 C220 340, 215 300, 212 260 C208 200, 200 150, 195 130 C190 110, 170 98, 158 90 C167 85, 175 72, 175 55 C175 35, 165 20, 150 20 Z" fill="currentColor" opacity="0.12"/>
        </svg>

        <button
          type="button"
          className={`hotspot-node spot-scalp ${activeHotspot === 'scalp' ? 'active' : ''}`}
          onClick={() => setActiveHotspot('scalp')}
          title="Scalp & Hair"
          aria-label="Hotspot: Scalp and hair"
        >
          1
        </button>
        <button
          type="button"
          className={`hotspot-node spot-face ${activeHotspot === 'face' ? 'active' : ''}`}
          onClick={() => setActiveHotspot('face')}
          title="Face & Jawline"
          aria-label="Hotspot: Face and jawline"
        >
          2
        </button>
        <button
          type="button"
          className={`hotspot-node spot-neck ${activeHotspot === 'neck' ? 'active' : ''}`}
          onClick={() => setActiveHotspot('neck')}
          title="Neck & Folds"
          aria-label="Hotspot: Neck and skin folds"
        >
          3
        </button>
        <button
          type="button"
          className={`hotspot-node spot-abdomen ${activeHotspot === 'abdomen' ? 'active' : ''}`}
          onClick={() => setActiveHotspot('abdomen')}
          title="Abdomen & Metabolism"
          aria-label="Hotspot: Abdomen and metabolism"
        >
          4
        </button>
        <button
          type="button"
          className={`hotspot-node spot-pelvis ${activeHotspot === 'pelvis' ? 'active' : ''}`}
          onClick={() => setActiveHotspot('pelvis')}
          title="Pelvis & Ovaries"
          aria-label="Hotspot: Pelvis and ovaries"
        >
          5
        </button>
      </div>

      <div className="hotspot-card">
        <span className="hotspot-pill">{current.pill}</span>
        <h3>{current.title}</h3>
        <p>{current.desc}</p>
        <ul className="hotspot-list">
          {current.points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
