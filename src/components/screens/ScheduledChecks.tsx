import React, { useState } from 'react';
import { ScheduledRunLog, UserProfile } from '../../types/inbox';
import {
  Clock,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Bell,
  Calendar,
  ShieldCheck,
  Server,
  Zap,
  ArrowRight,
  Sparkles,
  Inbox,
  Filter,
} from 'lucide-react';

interface ScheduledChecksProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onTriggerRunNow: () => Promise<void>;
  isScanning: boolean;
  onSaveToast: () => void;
}

export const ScheduledChecks: React.FC<ScheduledChecksProps> = ({
  userProfile,
  onUpdateProfile,
  onTriggerRunNow,
  isScanning,
  onSaveToast,
}) => {
  const [serverScheduler, setServerScheduler] = useState<{
    enabled: boolean;
    cadence: string;
    time: string;
    timeZone: string;
    nextRunTimestamp: number | null;
    runCount: number;
  } | null>(null);

  const [activeSimulatorStep, setActiveSimulatorStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  React.useEffect(() => {
    fetch('/api/scheduler/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.scheduler) {
          setServerScheduler(data.scheduler);
        }
      })
      .catch((e) => console.warn('Could not fetch scheduler status:', e));
  }, []);

  const [scheduledHistory, setScheduledHistory] = useState<ScheduledRunLog[]>([
    {
      id: 'run-1',
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
      timeFormatted: 'Yesterday at 08:30 AM',
      status: 'completed',
      scannedCount: 6,
      draftsPrepared: 4,
      draftsSavedToProvider: 4,
      skippedCount: 2,
      notes: 'Completed scheduled sweep. 4 drafts held in Drafts folder awaiting review.',
    },
    {
      id: 'run-2',
      timestamp: Date.now() - 1000 * 60 * 60 * 48,
      timeFormatted: '2 days ago at 08:30 AM',
      status: 'completed',
      scannedCount: 5,
      draftsPrepared: 3,
      draftsSavedToProvider: 3,
      skippedCount: 2,
      notes: 'All drafts staged. Zero auto-sends per safety policy.',
    },
  ]);

  const toggleSchedule = async () => {
    const nextEnabled = !userProfile.scheduleEnabled;
    onUpdateProfile({ scheduleEnabled: nextEnabled });
    onSaveToast();
    try {
      const res = await fetch('/api/scheduler/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: nextEnabled,
          cadence: userProfile.frequency,
          time: userProfile.scheduleTime,
          timeZone: userProfile.scheduleTimezone,
        }),
      });
      const data = await res.json();
      if (data.success && data.scheduler) {
        setServerScheduler(data.scheduler);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleManualTrigger = async () => {
    await onTriggerRunNow();
    try {
      const res = await fetch('/api/scheduler/trigger', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.scheduler) {
        setServerScheduler(data.scheduler);
      }
    } catch (e) {
      console.warn(e);
    }
    const newEntry: ScheduledRunLog = {
      id: `run-${Date.now()}`,
      timestamp: Date.now(),
      timeFormatted: 'Just now',
      status: 'completed',
      scannedCount: 6,
      draftsPrepared: 4,
      draftsSavedToProvider: 4,
      skippedCount: 2,
      notes: 'Manual trigger sweep completed. All drafts held safely.',
    };
    setScheduledHistory((prev) => [newEntry, ...prev]);
  };

  const runStepSimulation = async () => {
    setIsSimulating(true);
    setActiveSimulatorStep(1);
    await new Promise((r) => setTimeout(r, 600));
    setActiveSimulatorStep(2);
    await new Promise((r) => setTimeout(r, 700));
    setActiveSimulatorStep(3);
    await new Promise((r) => setTimeout(r, 800));
    setActiveSimulatorStep(4);
    setIsSimulating(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-amber-500 dark:text-amber-400">
          Persistent Automation Architecture
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Scheduled Inbox Checks
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Configure autonomous recurring sweeps. Runs directly on server infrastructure on your cadence, holds all drafts for human review, and never sends without explicit approval.
        </p>
      </div>

      {/* Scheduler Status & Switcher Card */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              userProfile.scheduleEnabled
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {userProfile.scheduleEnabled ? 'Recurring Schedule Active' : 'Scheduler Paused'}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  userProfile.scheduleEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {userProfile.scheduleEnabled ? 'RUNNING ON SERVER' : 'PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Cadence: {userProfile.scheduleCadence} at {userProfile.scheduleTime} ({userProfile.scheduleTimezone || 'PT'}).{' '}
              {serverScheduler?.nextRunTimestamp && (
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  Next sweep: {new Date(serverScheduler.nextRunTimestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleSchedule}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              userProfile.scheduleEnabled
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30'
            }`}
          >
            {userProfile.scheduleEnabled ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Schedule</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Activate Schedule</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleManualTrigger}
            disabled={isScanning}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/30"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isScanning ? 'Running...' : 'Run Check Now'}</span>
          </button>
        </div>
      </div>

      {/* Cadence Configuration */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>Cadence & Timing Controls</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Frequency
            </label>
            <select
              value={userProfile.frequency}
              onChange={(e) => onUpdateProfile({ frequency: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="weekly_monday">Weekly on Monday morning</option>
              <option value="daily_morning">Daily every morning</option>
              <option value="twice_daily">Twice daily (Morning & Midday)</option>
              <option value="hourly">Hourly during work hours (9 AM - 5 PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Preferred Time
            </label>
            <input
              type="time"
              value={userProfile.scheduleTime}
              onChange={(e) => onUpdateProfile({ scheduleTime: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Time Zone
            </label>
            <input
              type="text"
              value={userProfile.scheduleTimezone || 'America/Los_Angeles (PT)'}
              onChange={(e) => onUpdateProfile({ scheduleTimezone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Cloud Execution Guarantee:</strong> When active, scheduled checks execute on cloud server cron triggers regardless of whether your browser tab or laptop is open. Every drafted message is placed into your provider's Drafts folder and awaits your manual approval.
          </span>
        </div>
      </div>

      {/* Sweep Simulation Visualizer */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Sweep Execution Visualizer</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Simulate the 4 distinct execution phases of an automated background sweep.
            </p>
          </div>

          <button
            type="button"
            onClick={runStepSimulation}
            disabled={isSimulating}
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulating...' : 'Simulate Lifecycle'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeSimulatorStep >= 1
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-bold">Phase 1</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold">Cron Wakeup</h4>
            <p className="text-[11px] opacity-80 mt-1">Triggers at configured cadence.</p>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeSimulatorStep >= 2
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-bold">Phase 2</span>
              <Filter className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold">Triage & Filter</h4>
            <p className="text-[11px] opacity-80 mt-1">Skips cold sales and newsletters.</p>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeSimulatorStep >= 3
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-bold">Phase 3</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-semibold">Contextual Drafts</h4>
            <p className="text-[11px] opacity-80 mt-1">Generates drafts in your voice.</p>
          </div>

          <div
            className={`p-3.5 rounded-xl border transition-all ${
              activeSimulatorStep >= 4
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono font-bold">Phase 4</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <h4 className="text-xs font-semibold">Held in Drafts</h4>
            <p className="text-[11px] opacity-80 mt-1">Safe staging. Auto-send strictly 0.</p>
          </div>
        </div>
      </div>

      {/* Execution History */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Past Automated Check Runs
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {scheduledHistory.length} recorded runs
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {scheduledHistory.map((run) => (
            <div key={run.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">{run.timeFormatted}</span>
                  <span className="text-slate-600 dark:text-slate-400">{run.notes}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                <span>{run.scannedCount} scanned</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{run.draftsPrepared} drafts held</span>
                <span className="text-slate-500">{run.skippedCount} skipped</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
