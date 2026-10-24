import React, { useState } from 'react';
import { UserProfile } from '../types/inbox';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  Shield,
  Clock,
  Layers,
  Terminal,
  ExternalLink,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface PromptBuilderProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onGoToWorkbench: () => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  userProfile,
  onUpdateProfile,
  onGoToWorkbench,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTrigger, setCopiedTrigger] = useState(false);

  const providerName = userProfile.provider === 'outlook' ? 'Microsoft Outlook' : 'Gmail';

  const scheduleLabel =
    userProfile.frequency === 'twice_daily'
      ? 'twice each weekday (8:30 AM & 1:30 PM)'
      : userProfile.frequency === 'hourly'
      ? 'hourly between 9:00 AM and 5:00 PM'
      : `every morning at ${userProfile.scheduleTime}`;

  // Generated System Instructions
  const generatedSystemInstructions = `# Role: Autonomous Personal Inbox Assistant
# User Identity: ${userProfile.name} (${userProfile.role}${userProfile.company ? ` at ${userProfile.company}` : ''})
# Connected Mailbox: ${providerName} (ChatGPT Desktop App Work Mode)
# Cardinal Safety Policy: DRAFT-ONLY / STRICTLY FORBIDDEN FROM AUTO-SENDING

You are ${userProfile.name}'s executive inbox assistant. Your responsibility is to analyze incoming ${providerName} threads, identify messages that genuinely require a response, and prepare high-fidelity draft replies in the ${providerName} "Drafts" folder.

--------------------------------------------------------------------------------
1. CORE OPERATING PROTOCOL (DRAFT-ONLY)
--------------------------------------------------------------------------------
- UNDER NO CIRCUMSTANCES should you send an email directly or trigger a dispatch action.
- Every drafted response MUST be created exclusively as a draft in the user's ${providerName} Drafts folder.
- Hold all drafts for ${userProfile.name} to manually review, edit, and approve before sending.

--------------------------------------------------------------------------------
2. INBOX TRIAGE CRITERIA
--------------------------------------------------------------------------------
A. MUST DRAFT REPLY FOR:
- Direct questions from team members, clients, leadership, or active partners.
- Meeting scheduling or rescheduling requests.
- Decisions, status confirmations, or approvals blocking others.

B. DO NOT DRAFT / IGNORE OR ARCHIVE:
${userProfile.skipColdOutreach ? '- Unsolicited cold B2B sales pitches, marketing sequences, or sponsorship requests.' : ''}
- Automated newsletters, promotional alerts, receipt confirmations, and system notifications.
- Informational emails with "FYI only" or with no actionable question.

--------------------------------------------------------------------------------
3. VOICE, TONE & GUARDRAILS
--------------------------------------------------------------------------------
- Primary Tone Style: ${userProfile.defaultTone.toUpperCase()} (Clear, natural human prose; avoid robotic clichés like "I hope this email finds you well" or "As per your request").
${userProfile.calendarSafety ? '- CALENDAR SAFETY: Never commit to a firm meeting time without verifying. Use tentative phrasing such as "I will check my schedule for [Day] and confirm shortly."' : ''}
${userProfile.pricingSafety ? '- FINANCIAL SAFETY: Never commit to pricing discounts, refunds, or contractual adjustments without explicit human review.' : ''}
- Custom User Directives:
${userProfile.customRules ? `  * ${userProfile.customRules}` : '  * Be courteous, concise, and helpful.'}

- Standard Sign-Off:
${userProfile.signature || `Best regards,\n${userProfile.name}`}

--------------------------------------------------------------------------------
4. SCHEDULED EXECUTION SUMMARY
--------------------------------------------------------------------------------
When running on schedule (${scheduleLabel}):
Scan recent unread emails. Save all prepared replies into Drafts, then present a clean scannable briefing:
"📬 ${providerName} Sweep Complete:
- Prepared [N] draft replies in your Drafts folder.
- Skipped [M] newsletters / cold outreach.
Review your drafts before sending."`;

  // Generated Cron Trigger Prompt
  const generatedCronTrigger = `Every weekday at ${userProfile.scheduleTime}, run an automated inbox check on my connected ${providerName} account using my Inbox Assistant instructions. Find all emails that need a reply, compose draft responses for each, save them in my Drafts folder, and ping me with a quick review checklist so I can approve or edit them before anything goes out.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedSystemInstructions);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyTrigger = () => {
    navigator.clipboard.writeText(generatedCronTrigger);
    setCopiedTrigger(true);
    setTimeout(() => setCopiedTrigger(false), 2000);
  };

  const handleDownloadConfig = () => {
    const fileContent = `=== CHATGPT INBOX ASSISTANT CONFIGURATION ===\nProvider: ${providerName}\nSchedule: ${scheduleLabel}\nUser: ${userProfile.name} (${userProfile.role})\n\n--- 1. SYSTEM PROMPT (Paste into ChatGPT Custom Instructions or Custom GPT) ---\n${generatedSystemInstructions}\n\n--- 2. SCHEDULED CRON TRIGGER PROMPT ---\n${generatedCronTrigger}\n`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatgpt-inbox-assistant-${userProfile.provider}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
            Assistant Architect
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Configure Your ChatGPT Work Mode Assistant
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Tailor your identity, safety guardrails, and schedule. Copy the generated instructions straight into the ChatGPT Desktop App.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadConfig}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Config (.txt)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Provider Selection */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Target Inbox Provider</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateProfile({ provider: 'gmail' })}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  userProfile.provider === 'gmail'
                    ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-semibold text-white block">Google Gmail</span>
                <span className="text-[11px] text-slate-400">Google Workspace or personal</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateProfile({ provider: 'outlook' })}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  userProfile.provider === 'outlook'
                    ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-semibold text-white block">Microsoft Outlook</span>
                <span className="text-[11px] text-slate-400">Office 365 or Outlook.com</span>
              </button>
            </div>
          </div>

          {/* User Profile & Tone */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Identity & Communication Voice</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => onUpdateProfile({ name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Job Role
                </label>
                <input
                  type="text"
                  value={userProfile.role}
                  onChange={(e) => onUpdateProfile({ role: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Tone Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['balanced', 'concise', 'warm', 'firm'] as const).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => onUpdateProfile({ defaultTone: tone })}
                    className={`px-3 py-2 text-xs rounded-lg border text-left capitalize transition-colors cursor-pointer ${
                      userProfile.defaultTone === tone
                        ? 'bg-slate-800 border-indigo-500 text-white font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Standard Email Signature
              </label>
              <textarea
                rows={3}
                value={userProfile.signature}
                onChange={(e) => onUpdateProfile({ signature: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>
          </div>

          {/* Safety Guardrails */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Safety & Policy Guardrails</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.calendarSafety}
                  onChange={(e) => onUpdateProfile({ calendarSafety: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="font-semibold block text-white">Calendar Guardrail</span>
                  <span className="text-slate-400 text-[11px]">
                    Never confirm exact meeting times without qualification. Prompt user to check calendar.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.pricingSafety}
                  onChange={(e) => onUpdateProfile({ pricingSafety: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="font-semibold block text-white">Financial & Contract Guardrail</span>
                  <span className="text-slate-400 text-[11px]">
                    Prohibit committing to quotes, discounts, or contractual amendments.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userProfile.skipColdOutreach}
                  onChange={(e) => onUpdateProfile({ skipColdOutreach: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <span className="font-semibold block text-white">Filter Cold Outreach</span>
                  <span className="text-slate-400 text-[11px]">
                    Ignore unsolicited B2B sales pitches and save zero drafts for cold sequences.
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Custom Personal Rules
              </label>
              <textarea
                rows={3}
                value={userProfile.customRules}
                onChange={(e) => onUpdateProfile({ customRules: e.target.value })}
                placeholder="e.g. If my manager writes, flag it as urgent. Never agree to Friday afternoon meetings."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none font-sans"
              />
            </div>
          </div>

          {/* Schedule Settings */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Recurring Sweep Cadence</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdateProfile({ frequency: 'daily_morning' })}
                className={`p-2.5 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  userProfile.frequency === 'daily_morning'
                    ? 'bg-slate-800 border-indigo-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily Morning
              </button>

              <button
                type="button"
                onClick={() => onUpdateProfile({ frequency: 'twice_daily' })}
                className={`p-2.5 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  userProfile.frequency === 'twice_daily'
                    ? 'bg-slate-800 border-indigo-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Twice Daily
              </button>

              <button
                type="button"
                onClick={() => onUpdateProfile({ frequency: 'hourly' })}
                className={`p-2.5 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  userProfile.frequency === 'hourly'
                    ? 'bg-slate-800 border-indigo-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Business Hourly
              </button>
            </div>

            {userProfile.frequency === 'daily_morning' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Morning Sweep Time
                </label>
                <input
                  type="time"
                  value={userProfile.scheduleTime}
                  onChange={(e) => onUpdateProfile({ scheduleTime: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output Instructions & Desktop Setup Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Output 1: System Prompt */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>ChatGPT System Instructions</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Paste this into ChatGPT Work Mode or Custom GPT Instructions
                </p>
              </div>

              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Instructions</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {generatedSystemInstructions}
            </div>
          </div>

          {/* Output 2: Cron Trigger Prompt */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Scheduled Trigger Prompt</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Use this prompt to initiate your scheduled recurring sweep
                </p>
              </div>

              <button
                onClick={handleCopyTrigger}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedTrigger ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Trigger</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 leading-relaxed">
              "{generatedCronTrigger}"
            </div>
          </div>

          {/* Setup Walkthrough Cards */}
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">
              Desktop App Work Mode Setup Guide
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-white">
                    Open ChatGPT Desktop App with Work Mode
                  </h4>
                  <p className="text-xs text-slate-400">
                    Launch the ChatGPT app on macOS or Windows. Work mode enables connecting directly to workspace tools like your mail client.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-white">
                    Link Your {providerName} Account
                  </h4>
                  <p className="text-xs text-slate-400">
                    Go to <strong>Settings &gt; Connected Apps</strong> and authenticate your {providerName}. Grant read & draft creation access.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-white">
                    Paste the Custom Instructions
                  </h4>
                  <p className="text-xs text-slate-400">
                    Create a custom GPT named "Inbox Assistant" and paste the System Instructions above into the instructions box.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-white">
                    Test in Workbench & Set Recurring Trigger
                  </h4>
                  <p className="text-xs text-slate-400">
                    Test your drafts in the Review Workbench first. Once confident, paste the Scheduled Trigger Prompt to let ChatGPT check your inbox automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
