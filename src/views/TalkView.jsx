import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner.jsx';

export function TalkView({ onNavigate, currentLanguage = 'en' }) {
  const [mode, setMode] = useState('voice'); // 'voice' | 'type'
  const [isRecording, setIsRecording] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [recentTranscripts, setRecentTranscripts] = useState([
    {
      id: 'tx-1',
      time: 'Today 8:15 AM',
      mode: 'voice',
      snippet: 'Baby moved about 10 times right after I had my warm milk and almonds.',
      status: 'Captured locally'
    },
    {
      id: 'tx-2',
      time: 'Yesterday 7:40 PM',
      mode: 'type',
      snippet: 'My lower back feels tense whenever I stand by the kitchen counter for half an hour.',
      status: 'Captured locally'
    }
  ]);

  const samplePrompts = [
    'I have mild lower back ache after cooking dinner.',
    'Is occasional heartburn normal in the 24th week?',
    'What should my daily water intake target be?'
  ];

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleAddSample = (promptText) => {
    setTextInput(promptText);
    setMode('type');
  };

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const newTx = {
      id: `tx-${Date.now()}`,
      time: 'Just now',
      mode: 'type',
      snippet: textInput,
      status: 'Saved to device vault'
    };
    setRecentTranscripts([newTx, ...recentTranscripts]);
    setTextInput('');
  };

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

      {/* Mode Selector Tabs (Visible Text Labels with Helper Text) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md mx-auto">
        <Button
          variant={mode === 'voice' ? 'primary' : 'outline'}
          size="md"
          fullWidth
          onClick={() => setMode('voice')}
          ariaLabel="Switch to Voice Mode"
          helperText="Speak freely in your mother tongue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          }
        >
          Voice Input Mode
        </Button>

        <Button
          variant={mode === 'type' ? 'primary' : 'outline'}
          size="md"
          fullWidth
          onClick={() => setMode('type')}
          ariaLabel="Switch to Text Mode"
          helperText="Type or paste your notes"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        >
          Type Notes Mode
        </Button>
      </div>

      {/* Mode 1: Voice Recorder Interface Placeholder */}
      {mode === 'voice' && (
        <Card
          variant="accent"
          className="text-center py-8 px-4"
          title="Voice Companion Placeholder"
          subtitle="On-device speech recognition & triage interface"
        >
          <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-rose-200 rounded-full text-xs text-rose-900 shadow-xs">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-stone-400'}`} />
              <span className="font-semibold">
                {isRecording ? 'Listening locally in your language...' : 'Microphone Ready (Tap to Speak)'}
              </span>
            </div>

            {/* Microphone Large Action Button */}
            <div className="relative">
              {isRecording && (
                <div className="absolute -inset-3 rounded-full bg-rose-400/30 animate-pulse" />
              )}
              <button
                type="button"
                onClick={handleToggleRecord}
                className={`
                  relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-rose-400
                  ${isRecording
                    ? 'bg-red-600 text-white scale-105 shadow-red-200'
                    : 'bg-rose-700 hover:bg-rose-800 text-white hover:scale-105 shadow-rose-200'
                  }
                `}
                aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording in your language'}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isRecording ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                  )}
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                  {isRecording ? 'Tap to Stop' : 'Tap to Speak'}
                </span>
              </button>
            </div>

            <p className="text-xs text-stone-600 max-w-sm">
              Press the button to speak. Your voice is transcribed securely on your device without leaving your phone.
            </p>

            {/* Clean Feature Placeholder Banner */}
            <div className="p-3.5 bg-stone-100/90 rounded-2xl border border-stone-200 text-left w-full text-xs text-stone-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <span>⚡ Hackathon Placeholder:</span>
                <Badge variant="stone" size="sm">Speech-to-Text Engine</Badge>
              </div>
              <p className="text-[11px] text-stone-600">
                In this shell version, live audio hardware access is abstracted. In production, this connects to the local Whisper/WebSpeech model.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Mode 2: Typed Input Interface */}
      {mode === 'type' && (
        <Card
          title="Type Your Health Query or Notes"
          subtitle="Describe any sensations, cycle dates, or doctor questions"
        >
          <form onSubmit={handleSimulateSubmit} className="space-y-4">
            <div>
              <label htmlFor="health-text-input" className="block text-xs font-semibold text-stone-800 mb-1">
                What are you feeling today? (Plain English or native transliteration)
              </label>
              <textarea
                id="health-text-input"
                rows={4}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Example: I've noticed mild swelling in my ankles after lunch. No headache or vision issues..."
                className="w-full p-3.5 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm text-stone-900 placeholder:text-stone-400"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
                <span>Visible helper text: Be as detailed as you like.</span>
                <span>{textInput.length} characters</span>
              </div>
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                Suggested Prompts (Click to populate text):
              </span>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSample(prompt)}
                    className="text-xs bg-stone-100 hover:bg-rose-50 hover:text-rose-800 text-stone-700 px-3 py-1.5 rounded-xl border border-stone-200 transition-colors text-left"
                    aria-label={`Insert sample prompt: ${prompt}`}
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <span className="text-xs text-stone-500">
                🔒 Captured entries remain inside your encrypted browser storage.
              </span>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!textInput.trim()}
                ariaLabel="Save typed health note to local device"
                helperText="Stores entry in device log"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Save to Device Log
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Clean Placeholder Section: AI Symptom Triage */}
      <section aria-labelledby="triage-placeholder-title">
        <Card
          variant="outlined"
          title="Symptom Analysis & Triage Engine"
          subtitle="Clean placeholder section for upcoming algorithmic triage"
          helperText="Logic will be connected during backend integration"
        >
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">Coming in Next Phase</Badge>
              <span className="text-xs font-semibold text-stone-700">Offline Triage Engine</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Per specifications, algorithmic symptom analysis and severity calculations are decoupled from this UI shell.
              When connected, this container dynamically displays clinical red-flag checks, safe home care advice, and triage urgency levels.
            </p>
          </div>
        </Card>
      </section>

      {/* Recent Talk/Type Transcripts */}
      <section aria-labelledby="recent-transcripts-title">
        <h2 id="recent-transcripts-title" className="text-base font-bold text-stone-900 mb-3">
          Session Transcripts on This Device ({recentTranscripts.length})
        </h2>
        <div className="space-y-3">
          {recentTranscripts.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-800">
                    {item.mode === 'voice' ? '🎙️ Voice Note' : '⌨️ Typed Note'}
                  </span>
                  <span className="text-[11px] text-stone-400">· {item.time}</span>
                  <Badge variant="emerald" size="sm">{item.status}</Badge>
                </div>
                <p className="text-xs text-stone-600 italic">
                  "{item.snippet}"
                </p>
              </div>

              <div className="self-end sm:self-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('/tracker')}
                  ariaLabel="Add this transcript to Health Tracker"
                  helperText="Transfers note to tracker"
                >
                  Transfer to Tracker →
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TalkView;
