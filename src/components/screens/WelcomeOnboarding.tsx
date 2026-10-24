import React, { useState } from 'react';
import { UserProfile, ProviderConnection } from '../../types/inbox';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Lock,
  Sparkles,
  Sliders,
  Check,
  Eye,
  HelpCircle,
} from 'lucide-react';

interface WelcomeOnboardingProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  connection: ProviderConnection;
  onConnectProvider: (provider: 'gmail' | 'outlook' | 'demo') => void;
  onCompleteOnboarding: () => void;
  onGoToWorkbench: () => void;
}

export const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({
  userProfile,
  onUpdateProfile,
  connection,
  onConnectProvider,
  onCompleteOnboarding,
  onGoToWorkbench,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onCompleteOnboarding();
      onGoToWorkbench();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Progress Indicator */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
            Onboarding · Step {currentStep} of {totalSteps}
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6">
        {/* Step 1: Welcome & Core Boundary */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Welcome to Inbox Assistant Studio
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Your email assistant understands incoming conversations, identifies which ones need a reply, and drafts a complete response in your voice.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Our Cardinal Rule: Review Required Before Any Send</span>
              </div>
              <p className="text-xs text-indigo-800 dark:text-slate-300 leading-relaxed">
                The assistant never sends an email on its own in default mode. Every single reply remains in your drafts folder awaiting your personal inspection and explicit authorization.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Choose Mailbox Provider */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step 2: Choose your mailbox provider
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Both Google Gmail and Microsoft Outlook are fully supported with safe draft staging.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  onUpdateProfile({ provider: 'gmail' });
                  onConnectProvider('gmail');
                }}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                  userProfile.provider === 'gmail'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Google Gmail</span>
                  {userProfile.provider === 'gmail' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Google Workspace or personal @gmail.com account.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateProfile({ provider: 'outlook' });
                  onConnectProvider('outlook');
                }}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                  userProfile.provider === 'outlook'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Microsoft Outlook</span>
                  {userProfile.provider === 'outlook' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Microsoft 365, Hotmail, or Outlook.com account.
                </p>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Want to test the app without signing into a real email right now? You can also explore our pre-configured Demo Mode at any time.
            </p>
          </div>
        )}

        {/* Step 3: Plain-Language Permissions */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step 3: What permissions we request & why
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                We believe in complete transparency. We follow the principle of least privilege.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Read-Only Email Access</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Allows the assistant to read recent incoming email threads to determine if someone is waiting on a reply.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Create & Save Drafts</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Allows the assistant to save proposed replies directly into your Drafts folder so you can review them.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Lock className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">No Direct Automated Sending</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    The assistant does not send emails on its own. Sending requires your manual click on each individual message.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Connect Account / Demo Mode */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step 4: Authorize your mailbox or launch Demo Mode
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Connect via official Google / Microsoft OAuth, or explore with realistic sample data.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {connection.mode === 'demo' ? 'Currently Running in Certified Demo Mode' : 'Connected to ' + connection.provider.toUpperCase()}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {connection.mode === 'demo'
                    ? 'Demo Mode is active with 6 realistic enterprise threads (client urgency, meeting requests, vendor pitch to ignore, bug blockers).'
                    : `Active connection to ${connection.userEmail}.`}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onConnectProvider('demo')}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  Stay in Demo Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Choose Review Period */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step 5: How far back should we look?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Select your lookback window for unanswered threads.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['7 days', '14 days', '30 days'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => onUpdateProfile({ dateRange: range })}
                  className={`min-h-[44px] p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    userProfile.dateRange === range
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500 text-indigo-700 dark:text-white font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-base font-bold block">{range}</span>
                  <span className="text-xs text-slate-500">
                    {range === '7 days' ? 'Recommended for daily users' : range === '14 days' ? 'Catches vacation backlog' : 'Comprehensive deep sweep'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Personal Writing Style & Language */}
        {currentStep === 6 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step 6: Writing style, language & signature
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Help the assistant draft replies that sound like you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => onUpdateProfile({ name: e.target.value })}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Language</label>
                <select
                  value={userProfile.preferredLanguage}
                  onChange={(e) => onUpdateProfile({ preferredLanguage: e.target.value as any })}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  <option value="en">English (Default)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="fr">French (Français)</option>
                  <option value="de">German (Deutsch)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Default Tone</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['balanced', 'concise', 'warm', 'executive', 'formal', 'friendly'] as const).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => onUpdateProfile({ defaultTone: tone })}
                    className={`min-h-[44px] py-2 px-1 text-xs rounded-lg border text-center capitalize transition-colors cursor-pointer ${
                      userProfile.defaultTone === tone
                        ? 'bg-indigo-50 dark:bg-slate-800 border-indigo-500 text-indigo-700 dark:text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Initial Read-Only Scan */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step 7: Initial read-only inbox scan
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                The assistant analyzes recent threads chronologically and filters out newsletters and spam.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-800 dark:text-slate-300 font-medium">Scanned 6 active threads from the last {userProfile.dateRange}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-800 dark:text-slate-300 font-medium">Filtered out 1 cold sales sequence and 1 weekly newsletter</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-800 dark:text-slate-300 font-medium">4 threads identified that require a reply from you</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Verifying Your First Proposed Reply */}
        {currentStep === 8 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Step 8: How to verify your drafts
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Before releasing any draft, read it side-by-side with the real email.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Your Quick 3-Point Sanity Check:</h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">1.</span>
                  <span><strong>Check facts and commitments:</strong> Ensure the draft doesn't promise a time or price without verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">2.</span>
                  <span><strong>Tone check:</strong> Confirm it sounds like you, not an AI chatbot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">3.</span>
                  <span><strong>Decide individually:</strong> Authorize each reply one by one.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="min-h-[44px] px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="min-h-[44px] px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Restart
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < totalSteps && (
              <button
                type="button"
                onClick={() => {
                  onCompleteOnboarding();
                  onGoToWorkbench();
                }}
                className="min-h-[44px] px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Skip to Workbench
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/30"
            >
              <span>{currentStep === totalSteps ? 'Open Review Workbench' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
