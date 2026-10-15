import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Cpu,
  FileCheck2,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Lock,
  Shield,
  Stethoscope
} from 'lucide-react';
import { runLocalScreening } from '../services/localScreening.js';
import { ClinicalScreeningForm } from '../components/screening/ClinicalScreeningForm.jsx';
import { UltrasoundImageAnalyzer } from '../components/screening/UltrasoundImageAnalyzer.jsx';
import { ScreeningResultsDashboard } from '../components/screening/ScreeningResultsDashboard.jsx';

export function ResearchScreeningPage() {
  const [activeTab, setActiveTab] = useState('clinical'); // 'clinical' | 'ultrasound' | 'transparency'
  
  // Ultrasound transfer state
  const [ultrasoundPreFill, setUltrasoundPreFill] = useState(null);

  // Form submission and results state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [lastSubmittedInputs, setLastSubmittedInputs] = useState(null);

  const handleClinicalSubmit = async (formData) => {
    setSubmitting(true);
    setSubmitError(null);
    setScreeningResult(null);

    try {
      const response = runLocalScreening(formData);
      setScreeningResult(response);
      setLastSubmittedInputs(formData);
      // Smooth scroll to results
      setTimeout(() => {
        const el = document.getElementById('screening-results-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setSubmitError(err.message || 'Failed to complete screening analysis.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUltrasoundTransferred = (ultrasoundResult) => {
    // Switch to clinical tab and pass the follicle count
    setUltrasoundPreFill(ultrasoundResult);
    setActiveTab('clinical');
    // Scroll to form
    setTimeout(() => {
      const el = document.getElementById('clinical-screening-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleResetResults = () => {
    setScreeningResult(null);
    setLastSubmittedInputs(null);
    setSubmitError(null);
  };

  return (
    <div className="page-stack max-w-4xl mx-auto px-4 py-6" data-page-heading>
      {/* Header Banner */}
      <div className="welcome-panel bg-gradient-to-br from-teal-900/90 to-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu size={16} />
            <span>LunaHer Pattern Screening Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            LunaHer Pattern Screening
          </h1>
          <p className="text-sm sm:text-base text-teal-100 max-w-2xl leading-relaxed">
            Review clinical, physical, and hormonal information with LunaHer’s research-only pattern screening model. It highlights statistical patterns to support a conversation with a qualified healthcare professional.
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-white/90">
            <Cpu size={13} />
            <span>Private browser-only pattern screening</span>
          </div>
        </div>
      </div>

      {/* Zero Retention & Privacy Guarantee */}
      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80 flex items-start gap-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
        <Lock size={18} className="text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-800 dark:text-stone-100 block mb-0.5">
            Privacy-First Architecture & Zero Data Retention Guarantee:
          </strong>
          All medical inputs and ultrasound images are processed transiently in volatile memory during the HTTP request. 
          <strong> No patient names, contact info, clinical values, or uploaded scans are ever persisted to disk, databases, or external servers.</strong> Image memory buffers are immediately purged after processing.
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-stone-200 dark:border-stone-700">
        <nav className="flex space-x-2 sm:space-x-4" aria-label="Screening Modes">
          <button
            type="button"
            onClick={() => setActiveTab('clinical')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'clinical'
                ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <Stethoscope size={16} />
            <span>Mode A: Clinical Parameters</span>
            {ultrasoundPreFill && (
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" title="Ultrasound data attached" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ultrasound')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ultrasound'
                ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <ImageIcon size={16} />
            <span>Mode B: Ultrasound Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transparency')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'transparency'
                ? 'border-teal-600 text-teal-700 dark:text-teal-400 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
          >
            <Info size={16} />
            <span>Model & Science Specs</span>
          </button>
        </nav>
      </div>

      {/* Tab 1: Mode A - Clinical Parameters Form */}
      {activeTab === 'clinical' && (
        <div className="space-y-6">
          <div id="clinical-screening-form">
            <ClinicalScreeningForm
              onSubmit={handleClinicalSubmit}
              isSubmitting={submitting}
              prefilledFollicles={ultrasoundPreFill}
            />
          </div>

          {submitError && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong>Analysis Error:</strong> {submitError}
              </div>
            </div>
          )}

          {/* Results Dashboard Section */}
          {screeningResult && (
            <div id="screening-results-section" className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <ScreeningResultsDashboard
                result={screeningResult}
                inputs={lastSubmittedInputs}
                onReset={handleResetResults}
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Mode B - Ultrasound Analysis */}
      {activeTab === 'ultrasound' && (
        <div className="space-y-6">
          <UltrasoundImageAnalyzer onApplyFollicles={handleUltrasoundTransferred} />
        </div>
      )}

      {/* Tab 3: Model & Science Transparency */}
      {activeTab === 'transparency' && (
        <div className="space-y-6 text-stone-700 dark:text-stone-300">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-semibold text-sm">
              <FileCheck2 size={20} />
              <h2>LunaHer Pattern Screening Model</h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              LunaHer’s pattern screening model organizes clinical parameters and image feature estimates for discussion with a qualified healthcare professional. It cannot diagnose PCOS or replace clinical care.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-xs text-stone-500 block">5-Fold CV Accuracy</span>
                <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">90.15%</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-xs text-stone-500 block">5-Fold CV F1 Score</span>
                <span className="text-xl font-bold font-mono text-teal-700 dark:text-teal-400">84.50%</span>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <span className="text-xs text-stone-500 block">5-Fold CV ROC-AUC</span>
                <span className="text-xl font-bold font-mono text-indigo-700 dark:text-indigo-400">95.44%</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs leading-relaxed">
              <h3 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                Transparent Pipeline Audit Findings
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-400">
                <li>
                  <strong>Trained XGBoost Classifier:</strong> Model artifact is stored in <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded">backend/app/ml_models/best_xgboost_model.pkl</code>. It uses 42 features exactly matching the Kaggle PCOS dataset feature matrix with median cohort imputation for optional lab values.
                </li>
                <li>
                  <strong>Ultrasound Image Estimation:</strong> LunaHer analyzes image contrast and connected regions to estimate candidate follicle-like areas. It does not provide a diagnostic interpretation of an ultrasound image.
                </li>
                <li>
                  <strong>Feature Independence:</strong> This screening tool is kept strictly decoupled from PCOS Saathi’s APIVerve menstrual cycle forecasting and daily symptom journal to avoid invalid confounding risk scores.
                </li>
                <li>
                  <strong>Model Context:</strong> LunaHer uses reference values from observational screening data. Results are informational estimates only and are not a diagnostic device.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResearchScreeningPage;
