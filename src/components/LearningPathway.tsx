import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
  Calendar,
  AlertTriangle,
  FileCheck,
  ChevronRight,
} from 'lucide-react';

interface LearningPathwayProps {
  onGoToWorkbench: () => void;
  onGoToArchitect: () => void;
  onGoToSimulator: () => void;
}

export const LearningPathway: React.FC<LearningPathwayProps> = ({
  onGoToWorkbench,
  onGoToArchitect,
  onGoToSimulator,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'step-1-1': true,
    'step-1-2': false,
    'step-2-1': true,
    'step-2-2': false,
    'step-3-1': false,
  });

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Overview */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 p-6 sm:p-10 overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400">
            <span>Official Blueprint</span>
            <span>·</span>
            <span>ChatGPT Work Mode + Gmail / Outlook</span>
            <span>·</span>
            <span>Safe Drafting Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Create Your Safe, Scheduled Inbox Assistant
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Checking an AI’s drafts yourself before letting it work on its own is what makes an inbox assistant dependable.
            Master connecting your Gmail or Outlook in ChatGPT Work mode, judging drafts before they leave under your name,
            and triggering autonomous recurring sweeps.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Human-Approved (Draft-Only)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-400" />
              <span>Zero-Risk Sandboxed Staging</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Recurring Autonomous Sweeps</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1 */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">
                Milestone 01
              </span>
              <span className="text-xs text-slate-400">Foundation</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Connect & Calibrate</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Link Gmail or Outlook to the ChatGPT Desktop App with Work mode. Configure permissions so it can read incoming threads and compose drafts without send access.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => toggleStep('step-1-1')}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-xs text-slate-300 group cursor-pointer"
              >
                {completedSteps['step-1-1'] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 group-hover:text-slate-400" />
                )}
                <span>Install ChatGPT Desktop App (free Work mode)</span>
              </button>

              <button
                onClick={() => toggleStep('step-1-2')}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-xs text-slate-300 group cursor-pointer"
              >
                {completedSteps['step-1-2'] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 group-hover:text-slate-400" />
                )}
                <span>Authorize Gmail / Outlook with Draft-Only privileges</span>
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onGoToArchitect}
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Build Connection Instructions</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Module 2 */}
        <div className="rounded-xl bg-slate-900/80 border border-indigo-900/40 p-6 flex flex-col justify-between hover:border-indigo-800/60 transition-all shadow-sm shadow-indigo-950/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Milestone 02
              </span>
              <span className="text-xs text-emerald-400/80 font-medium">Core Safeguard</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Judge & Refine Drafts</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Before anything leaves your inbox under your name, audit each AI draft against the 4 judgment rules: commitments, calendar, tone, and facts.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => toggleStep('step-2-1')}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-xs text-slate-300 group cursor-pointer"
              >
                {completedSteps['step-2-1'] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 group-hover:text-slate-400" />
                )}
                <span>Test triage on real threads (Needs Reply vs Skip)</span>
              </button>

              <button
                onClick={() => toggleStep('step-2-2')}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-xs text-slate-300 group cursor-pointer"
              >
                {completedSteps['step-2-2'] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 group-hover:text-slate-400" />
                )}
                <span>Audit safety flags & polish wording in Diff Editor</span>
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onGoToWorkbench}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
            >
              <span>Open Review Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Module 3 */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                Milestone 03
              </span>
              <span className="text-xs text-slate-400">Automation</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Set Recurring Schedule</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Once drafts consistently match your voice and standards, set ChatGPT to check your inbox on a recurring timer (e.g. 8:30 AM daily).
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => toggleStep('step-3-1')}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/60 transition-colors text-xs text-slate-300 group cursor-pointer"
              >
                {completedSteps['step-3-1'] ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 group-hover:text-slate-400" />
                )}
                <span>Simulate scheduled sweeps & desktop notifications</span>
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onGoToSimulator}
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Test Automation Simulator</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Deep Dive: The 4 Judgment Rules */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Safety Standard
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            The 4 Golden Rules for Judging AI Drafts
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Never trust an AI draft blindly. In your review flow, run your eye down these four critical vectors before releasing an email.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">1. Calendar Commitment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Did the AI promise a specific time slot? Check your real calendar first or use tentative phrasing like <span className="text-slate-300 font-mono text-[11px]">"I'll confirm Tuesday afternoon"</span>.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">2. Scope & Pricing Creep</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure the draft doesn't casually agree to budget discounts, contract waivers, or unverified feature deadlines.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">3. Tone & Robotic Clichés</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strip out robotic filler like "I hope this email finds you well" or "Per your request". Keep it concise, natural, and authentically yours.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">4. Attachment & Link Check</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If the draft says "I've attached the file below", make sure you actually attach the file before hitting send!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
