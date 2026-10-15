import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner.jsx';
import { MOCK_LEARN_ARTICLES } from '../mockData/healthEntries.js';

export function LearnView({ onNavigate }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  const tags = ['All', 'Red Flags', 'Nutrition', 'Pelvic Health', 'Emotional Health'];

  const filteredArticles = MOCK_LEARN_ARTICLES.filter(art => {
    const matchesTag = selectedTag === 'All' || art.tags.includes(selectedTag);
    const matchesQuery = !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Maternal & Women’s Health Knowledge"
        description="Evidence-based care guides, nutrition hacks, and essential red-flag symptom indicators tailored for your journey."
        badge="Evidence-Based"
        badgeVariant="blue"
        onBack={() => onNavigate('/')}
        backLabel="Back to Home Dashboard"
        backHelperText="Returns to main overview"
      />

      <DisclaimerBanner dismissible={true} />

      {/* Search & Tag Filter Bar */}
      <div className="space-y-3">
        <div>
          <label htmlFor="search-guides" className="block text-xs font-semibold text-stone-700 mb-1">
            Search Health Guides & Safe Practices
          </label>
          <div className="relative">
            <input
              id="search-guides"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Iron absorption, backache, headache, nutrition..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
            <div className="absolute left-3.5 top-3 text-stone-400" aria-hidden="true">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Filter articles across clinical topics and traditional maternal wisdom.
          </span>
        </div>

        {/* Category Filter Chips with Visible Labels */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${isSelected
                    ? 'bg-rose-700 text-white shadow-xs ring-2 ring-rose-400/30'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }
                `}
                aria-pressed={isSelected}
                aria-label={`Filter articles by category ${tag}`}
              >
                {tag === 'Red Flags' ? '🚨 ' : ''}{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Article Reader Modal / Drawer if opened */}
      {activeArticle && (
        <Card
          variant="accent"
          title={activeArticle.title}
          subtitle={`${activeArticle.category} · ${activeArticle.readingTime}`}
          headerAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveArticle(null)}
              ariaLabel="Close reader view"
              helperText="Returns to guide list"
            >
              ✕ Close Guide
            </Button>
          }
        >
          <div className="space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed max-w-2xl">
            <p className="font-semibold text-rose-900 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {activeArticle.summary}
            </p>

            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 text-sm">Key Practical Takeaways for Home Care:</h4>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                <li><strong>Stay Consistent:</strong> Small daily habits like hydration and mindful rest yield compounding benefits.</li>
                <li><strong>Never Hesitate to Ask:</strong> Bring any unusual sensation up with your ASHA worker or doctor during routine antenatal checkups.</li>
                <li><strong>Safe Family Sharing:</strong> You can discuss these tips with your partner or elder family members to coordinate healthy meal preparation.</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">
                Curated in consultation with community obstetric guidelines.
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveArticle(null)}
                ariaLabel="Finished reading guide"
                helperText="Back to list"
              >
                Done Reading
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            variant="default"
            className="hover:border-rose-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  variant={article.urgentContext ? 'danger' : article.categoryColor || 'blue'}
                  size="sm"
                  showDot={article.urgentContext}
                >
                  {article.category}
                </Badge>
                <span className="text-[11px] text-stone-500 font-medium">
                  ⏱️ {article.readingTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-700">
                {article.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {article.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {article.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Safe Educational Guide
              </span>

              <Button
                variant={article.urgentContext ? 'danger' : 'outline'}
                size="sm"
                onClick={() => setActiveArticle(article)}
                ariaLabel={`Read guide: ${article.title}`}
                helperText="Opens complete article"
              >
                Read Article →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LearnView;
