import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/inbox';
import {
  CheckCircle2,
  Circle,
  Copy,
  Check,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
} from 'lucide-react';

interface InteractiveChecklistProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onGoToWorkbench: () => void;
  onGoToSimulator: () => void;
}

interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  content: string;
  promptSnippet?: string;
  tip?: string;
  whyItMatters?: string;
  actionText?: string;
  actionHandler?: 'workbench' | 'simulator';
}

export const InteractiveChecklist: React.FC<InteractiveChecklistProps> = ({
  userProfile,
  onUpdateProfile,
  onGoToWorkbench,
  onGoToSimulator,
}) => {
  // Load checked items from localStorage for persistence
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('inbox_assistant_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'step-pick-inbox': true,
      'step-first-prompt': false,
      'step-check-thread': false,
      'step-priorities': false,
      'step-schedule': false,
    };
  });

  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({
    'step-first-prompt': true,
    'step-check-thread': true,
    'step-schedule': true,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('inbox_assistant_checklist', JSON.stringify(checkedSteps));
    } catch (e) {}
  }, [checkedSteps]);

  const toggleCheck = (id: string) => {
    setCheckedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const providerLabel = userProfile.provider === 'outlook' ? 'Outlook' : 'Gmail';

  const initialDraftPrompt = `Look through my ${providerLabel} inbox from the last ${userProfile.dateRange || '7 days'} for every email thread that's overdue for a reply or waiting on me to respond. For each one, draft a short, complete follow-up reply I could send as-is, in my own voice. Show me each draft next to a summary of its thread before doing anything else, and don't send any of them.`;

  const priorityInstructionsPrompt = `Here is how I want you to prioritize my inbox replies:
• Only flag threads that have been waiting more than three days.
• Skip anything from an internal team channel, receipt, or a newsletter.
• Always draft a follow-up and remind me if something's overdue, but never send without me approving it first.`;

  const recurringTaskPrompt = `Every ${userProfile.scheduleCadence || 'Monday morning'}, check my inbox for anything overdue or needing a response the way you just did, using the priorities I just gave you. Draft a follow-up for anything you find, but hold every draft for my approval the same way, never send on your own. If nothing qualifies, send me nothing.`;

  const steps: StepItem[] = [
    {
      id: 'step-pick-inbox',
      stepNumber: '01',
      title: 'Pick your inbox (Gmail or Outlook Mail)',
      subtitle: 'Both work identically in ChatGPT Work mode',
      content:
        'Choose whether you want to connect your Google Gmail or Microsoft Outlook mailbox. If your account is a school or work Microsoft 365 account, sending may need an admin approval first, but reading and drafting work seamlessly either way.',
    },
    {
      id: 'step-first-prompt',
      stepNumber: '02',
      title: 'Start a new chat in ChatGPT Work & send the triage prompt',
      subtitle: 'Connects your inbox, finds overdue threads, and prepares drafts with no sending',
      content:
        "Paste the initial prompt into ChatGPT Work. If your inbox isn't connected yet, ChatGPT will prompt you to connect it right there. Sign in, approve access, and it will pick up your request immediately.",
      promptSnippet: initialDraftPrompt,
      tip: 'If nothing qualifies, ask it to widen the date range (e.g. 14 or 30 days) rather than accept a weak match.',
      whyItMatters:
        'Starting with an explicit lookback window and "don\'t send any of them" ensures you see the threads and drafts safely before any external action is taken.',
    },
    {
      id: 'step-check-thread',
      stepNumber: '03',
      title: 'Go thread by thread: Read the real email next to the draft',
      subtitle: 'Decide each draft individually—never approve in a batch',
      content:
        "Open the real email and read it side-by-side with the AI draft. Confirm the draft is accurate to the real thread and sounds like you. If it's right, tell ChatGPT to send it. If not, tell it what to fix (for example, a wrong detail or a tone that's too formal) and ask for a revised draft before approving.",
      whyItMatters:
        "The assistant drafts from whatever each thread says at face value. Sending is a real, hard-to-undo action under your name, so checking every draft on its own, instead of approving the whole batch at once, is what makes the next step safe to turn on.",
      actionText: 'Practice in Review Workbench',
      actionHandler: 'workbench',
    },
    {
      id: 'step-priorities',
      stepNumber: '04',
      title: 'Calibrate your priorities in the same chat',
      subtitle: 'Teach the assistant what counts as overdue and what to skip',
      content:
        'Now that you have seen it get one real draft right, tell ChatGPT how you want it to prioritize going forward in the exact same chat thread.',
      promptSnippet: priorityInstructionsPrompt,
      tip: 'The assistant will remember these triage rules for your recurring schedule.',
    },
    {
      id: 'step-schedule',
      stepNumber: '05',
      title: 'Turn it into a recurring task that runs on its own schedule',
      subtitle: 'Runs on OpenAI cloud servers—even when your computer is asleep or off',
      content:
        'Paste the scheduling prompt in the same chat so it picks up the priorities you just set. Once scheduled, it runs on OpenAI servers, drafting and holding replies. You review and approve each one from a live chat. You can review or pause any time in Settings > Notifications > Manage tasks.',
      promptSnippet: recurringTaskPrompt,
      actionText: 'Simulate Scheduled Run',
      actionHandler: 'simulator',
      whyItMatters:
        "Because it is built to draft and hold rather than send by itself, you get the speed of an automated assistant with the peace of mind of human-in-the-loop sign-off.",
    },
  ];

  const totalSteps = steps.length;
  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* College Student / EDU Callout Banner */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Student & Education Access
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                ChatGPT EDU / Plus
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              If your school has ChatGPT EDU, log in with your school email to access ChatGPT Plus features. If your school does not have ChatGPT EDU, you can access eligible student Plus access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs font-semibold text-indigo-200 bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/40 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open ChatGPT Work</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hero Header with Progress Tracker */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400">
              <span>Step-by-Step Curriculum</span>
              <span>·</span>
              <span>Track Progress As You Go</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Create Your Inbox Assistant
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Build an assistant that finds emails needing replies and drafts them for you. Approve or edit that one real draft first, then put the cycle on a recurring schedule to run on its own.
            </p>
          </div>

          {/* Progress Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 shrink-0 min-w-[200px] space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-400">Progress</span>
              <span className="text-white font-mono">{completedCount} of {totalSteps} complete ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">Check off steps as you complete them in ChatGPT.</p>
          </div>
        </div>

        {/* Mailbox & Dynamic Variable Controls */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Customize Prompt Variables:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Mailbox Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Mailbox Provider
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ provider: 'gmail' })}
                  className={`py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    userProfile.provider === 'gmail'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Gmail
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ provider: 'outlook' })}
                  className={`py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    userProfile.provider === 'outlook'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Outlook
                </button>
              </div>
            </div>

            {/* Date Range Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Lookback Window
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-lg">
                {(['7 days', '14 days', '30 days'] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => onUpdateProfile({ dateRange: range })}
                    className={`py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      userProfile.dateRange === range
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Recurring Cadence Selector */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Scheduled Cadence
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg">
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ scheduleCadence: 'Monday morning' })}
                  className={`py-1 text-xs font-medium rounded transition-colors cursor-pointer truncate ${
                    userProfile.scheduleCadence === 'Monday morning'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monday 8 AM
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ scheduleCadence: 'weekday at 8:00 AM' })}
                  className={`py-1 text-xs font-medium rounded transition-colors cursor-pointer truncate ${
                    userProfile.scheduleCadence === 'weekday at 8:00 AM'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Every Weekday
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Step-by-Step Interactive Checklist */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isChecked = !!checkedSteps[step.id];
          const isExpanded = !!expandedDetails[step.id];

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all ${
                isChecked
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-5 flex items-start gap-4">
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleCheck(step.id)}
                  className="mt-1 cursor-pointer text-slate-400 hover:text-white transition-colors"
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">
                        {step.stepNumber}
                      </span>
                      <h3
                        className={`text-base font-semibold transition-colors ${
                          isChecked ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(step.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">{step.subtitle}</p>

                  {/* Expanded Body Content */}
                  {isExpanded && (
                    <div className="pt-3 space-y-3.5 border-t border-slate-800/80">
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {step.content}
                      </p>

                      {/* Prompt Snippet Box */}
                      {step.promptSnippet && (
                        <div className="rounded-lg bg-slate-950 border border-slate-800 p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase tracking-wider">
                              Prompt to send in ChatGPT:
                            </span>
                            <button
                              type="button"
                              onClick={() => copyText(step.id, step.promptSnippet!)}
                              className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === step.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Prompt</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                            "{step.promptSnippet}"
                          </p>
                        </div>
                      )}

                      {/* Tip */}
                      {step.tip && (
                        <div className="text-xs text-slate-400 flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                          <span className="font-semibold text-slate-300">Tip:</span>
                          <span>{step.tip}</span>
                        </div>
                      )}

                      {/* Why This Matters Callout */}
                      {step.whyItMatters && (
                        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>Why this matters:</span>
                          </div>
                          <p className="text-amber-200/90 leading-relaxed">
                            {step.whyItMatters}
                          </p>
                        </div>
                      )}

                      {/* Quick Interactive Jump Button */}
                      {step.actionText && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (step.actionHandler === 'workbench') onGoToWorkbench();
                              if (step.actionHandler === 'simulator') onGoToSimulator();
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
                          >
                            <span>{step.actionText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* (Optional) Extension Ideas Hub */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-sky-400">
            Power User Customizations
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            (Optional) Extension Ideas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            None of these are required. ChatGPT can set most of them up from a prompt, the same way you built the assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Extension 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                1. Split Urgent from Routine
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ask it to flag anything from your manager or a deadline-sensitive thread separately from newsletters and FYIs, so the two never sit in the same batch.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copyText(
                  'ext-1',
                  'When triaging my inbox, create two separate sections: Urgent / Action Required (for my manager or hard deadlines) and Routine / Follow-up. Never mix them into one batch.'
                )
              }
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedId === 'ext-1' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Extension 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                2. Cover a Second Inbox
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Point the same recurring task at a shared or secondary inbox you also check, so one schedule handles both instead of you repeating the setup.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copyText(
                  'ext-2',
                  'Also check my secondary connected inbox [shared-inbox@company.com] during the same scheduled sweep. Apply the same triage criteria and draft holding rules.'
                )
              }
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedId === 'ext-2' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Extension 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                3. Turn it into a Weekly Digest
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instead of reviewing drafts one at a time, ask it to hold everything and send you one Monday summary of what needed a reply and what it drafted.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copyText(
                  'ext-3',
                  'Every Monday morning, prepare all pending draft replies and send me one structured executive digest summarizing: 1) Who is waiting on me, 2) The proposed draft reply, and 3) Next actions.'
                )
              }
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedId === 'ext-3' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          </div>

          {/* Extension 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                4. Ask Instead of Building a New Task
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Point ChatGPT at your inbox and ask ad-hoc questions like which threads have been waiting longest, or who you owe a reply to that you keep skipping.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onGoToWorkbench();
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
            >
              <span>Try Ad-Hoc Q&A in Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
