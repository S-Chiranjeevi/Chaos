import React from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner.jsx';
import { TalkOrType } from '../components/TalkOrType.jsx';

export function TalkView({ onNavigate, currentLanguage = 'en' }) {
  return (
    <div className="space-y-6">
      {/* Reusable Page Header with Back Button */}
      <PageHeader
        title="Talk or Type with Sakhi"
        description="Share your symptoms, feelings, or questions in your preferred language. All speech and text are processed strictly on your device."
        badge="Private Companion"
        badgeVariant="rose"
        onBack={() => onNavigate('/')}
        backLabel="Back to Home Dashboard"
        backHelperText="Returns to main overview"
      />

      <DisclaimerBanner dismissible={false} />

      {/* Main Talk or Type Engine */}
      <TalkOrType
        onHealthEntryCreated={() => {}}
      />
    </div>
  );
}

export default TalkView;
