import React from 'react';
import { TalkOrTypePage } from '../pages/TalkOrTypePage.jsx';

export function TalkView({ onNavigate, currentLanguage = 'en' }) {
  return <TalkOrTypePage onNavigate={onNavigate} currentLanguage={currentLanguage} />;
}

export default TalkView;
