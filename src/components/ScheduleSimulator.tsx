import React, { useState, useEffect } from 'react';
import { UserProfile, Email } from '../types/inbox';
import {
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Inbox,
  Filter,
  FileCheck,
  Zap,
} from 'lucide-react';

interface ScheduleSimulatorProps {
  userProfile: UserProfile;
  emails: Email[];
  onTriggerSweep: () => Promise<void>;
  onGoToWorkbench: () => void;
  isScanning: boolean;
}

interface SweepRunLog {
  id: string;
  time: string;
  scannedCount: number;
  draftsCount: number;
  skippedCount: number;
  status: 'completed' | 'in_progress';
}

export const ScheduleSimulator: React.FC<ScheduleSimulatorProps> = ({
  userProfile,
  emails,
  onTriggerSweep,
  onGoToWorkbench,
  isScanning,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [sweepLogs, setSweepLogs] = useState<SweepRunLog[]>([
    {
      id: 'sweep-prev',
      time: 'Yesterday at 08:30 AM',
      scannedCount: 5,
      draftsCount: 3,
      skippedCount: 2,
      status: 'completed',
    },
  ]);

  const providerName = userProfile.provider === 'outlook' ? 'Outlook' : 'Gmail';

  const runSimulation = async () => {
    setIsSimulating(true);
    setShowNotification(false);
    setActiveStep(1); // Connecting to mailbox

    setTimeout(() => {
      setActiveStep(2); // Fetching unread threads
    }, 800);

    setTimeout(() => {
      setActiveStep(3); // Applying triage filters
    }, 1600);

    setTimeout(() => {
      setActiveStep(4); // Drafting context replies
    }, 2400);

    setTimeout(() => {
      setActiveStep(5); // Staging to Drafts folder
    }, 3200);

    setTimeout(() => {
      setActiveStep(6); // Complete
      setIsSimulating(false);
      setShowNotification(true);

      const needsReplyCount = emails.filter((e) => e.triage?.needs_reply).length || 4;
      const skippedCount = emails.length - needsReplyCount;

      const newLog: SweepRunLog = {
        id: `sweep-${Date.now()}`,
        time: `Today at ${userProfile.scheduleTime || '08:30 AM'}`,
        scannedCount: emails.length,
        draftsCount: needsReplyCount,
        skippedCount: skippedCount,
        status: 'completed',
      };
      setSweepLogs((prev) => [newLog, ...prev]);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Automated Lifecycle
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Recurring Schedule Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Experience how ChatGPT executes its recurring sweep in Work mode: scanning incoming emails, staging replies exclusively into your {providerName} Drafts folder, and notifying you for final approval.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating || isScanning}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-indigo-600/30 disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>Simulating Schedule Run...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Trigger Scheduled Sweep Now</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Simulated Desktop Notification Banner */}
      {showNotification && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/40 shadow-xl shadow-indigo-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  ChatGPT Work Mode · {providerName} Assistant
                </span>
                <span className="text-[10px] font-mono text-slate-400">Just now</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                📬 Morning Sweep Complete: 4 draft replies have been prepared and staged in your {providerName} Drafts folder.
              </p>
              <p className="text-xs text-slate-400">
                Zero emails were sent automatically. Nothing goes out until you review or edit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onGoToWorkbench}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <span>Review Staged Drafts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Live Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep >= 1
              ? 'bg-slate-900 border-indigo-500/60 shadow-sm shadow-indigo-950/30'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-indigo-400 font-semibold">01. Connect</span>
            {activeStep > 1 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <h4 className="text-xs font-semibold text-white">Handshake Mailbox</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            ChatGPT verifies Work mode token for {providerName}.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep >= 2
              ? 'bg-slate-900 border-indigo-500/60 shadow-sm shadow-indigo-950/30'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-indigo-400 font-semibold">02. Fetch</span>
            {activeStep > 2 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <h4 className="text-xs font-semibold text-white">Scan Unread Threads</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Reads recent incoming messages from the last 24h.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep >= 3
              ? 'bg-slate-900 border-indigo-500/60 shadow-sm shadow-indigo-950/30'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-indigo-400 font-semibold">03. Triage</span>
            {activeStep > 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <h4 className="text-xs font-semibold text-white">Filter Needs-Reply</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Skips newsletters & cold pitches. Flags questions.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep >= 4
              ? 'bg-slate-900 border-indigo-500/60 shadow-sm shadow-indigo-950/30'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-indigo-400 font-semibold">04. Compose</span>
            {activeStep > 4 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <h4 className="text-xs font-semibold text-white">Apply Guardrails</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Drafts safe replies adhering to calendar & pricing rules.
          </p>
        </div>

        <div
          className={`p-4 rounded-xl border transition-all ${
            activeStep >= 5
              ? 'bg-slate-900 border-emerald-500/60 shadow-sm shadow-emerald-950/30'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">05. Hold</span>
            {activeStep >= 6 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </div>
          <h4 className="text-xs font-semibold text-white">Stage in Drafts</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Zero auto-send. Stored safely for human review.
          </p>
        </div>
      </div>

      {/* Execution Logs */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Automated Sweep History
            </h3>
            <p className="text-xs text-slate-400">
              Audit log of scheduled checks triggered by ChatGPT Work Mode
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Cadence: {userProfile.frequency === 'daily_morning' ? `Daily at ${userProfile.scheduleTime}` : 'Twice Daily'}
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {sweepLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium text-slate-200">{log.time}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{providerName} Connected</span>
              </div>

              <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
                <span>{log.scannedCount} emails scanned</span>
                <span className="text-emerald-400 font-semibold">{log.draftsCount} drafts staged</span>
                <span className="text-slate-500">{log.skippedCount} skipped</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                  {log.status === 'completed' ? 'Completed' : 'Running'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
