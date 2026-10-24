import React, { useState } from 'react';
import { Email, SmartRule, UserProfile } from '../../types/inbox';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Check,
} from 'lucide-react';

interface RulesSettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  emails: Email[];
  onSaveToast: () => void;
}

export const RulesSettings: React.FC<RulesSettingsProps> = ({
  userProfile,
  onUpdateProfile,
  emails,
  onSaveToast,
}) => {
  const defaultRules: SmartRule[] = [
    {
      id: 'rule-1',
      name: 'Flag overdue threads (>3 days)',
      description: 'Prioritize any email waiting more than 3 days for a response.',
      query: 'waiting_days >= 3',
      conditionType: 'waiting_days',
      action: 'flag_urgent',
      enabled: true,
    },
    {
      id: 'rule-2',
      name: 'Filter out unsolicited sales outreach',
      description: 'Skip cold sales pitches and create zero draft noise.',
      query: 'category == sales_outreach',
      conditionType: 'category',
      action: 'skip_draft',
      enabled: userProfile.skipColdOutreach,
    },
    {
      id: 'rule-3',
      name: 'Prioritize executive & manager escalations',
      description: 'Identify leadership or high-stake keywords like "steering committee" or "deliverable".',
      query: 'subject_contains: "urgent" OR "deliverable"',
      conditionType: 'subject_contains',
      action: 'flag_urgent',
      enabled: true,
    },
    {
      id: 'rule-4',
      name: 'Filter newsletters & automated digests',
      description: 'Skip weekly digests and platform notifications.',
      query: 'category == informational_newsletter',
      conditionType: 'category',
      action: 'skip_draft',
      enabled: true,
    },
  ];

  const [rules, setRules] = useState<SmartRule[]>(() => {
    try {
      const saved = localStorage.getItem('inbox_assistant_smart_rules');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultRules;
  });

  const [naturalInput, setNaturalInput] = useState('');
  const [previewRuleId, setPreviewRuleId] = useState<string | null>('rule-1');

  const handleToggleRule = (id: string) => {
    setRules((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
      try {
        localStorage.setItem('inbox_assistant_smart_rules', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => {
      const next = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('inbox_assistant_smart_rules', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (previewRuleId === id) setPreviewRuleId(null);
  };

  const handleAddNaturalRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalInput.trim()) return;

    const newRule: SmartRule = {
      id: `rule-${Date.now()}`,
      name: naturalInput.trim(),
      description: `Custom rule: "${naturalInput.trim()}"`,
      query: naturalInput.trim(),
      conditionType: 'subject_contains',
      action: naturalInput.toLowerCase().includes('skip') ? 'skip_draft' : 'flag_urgent',
      enabled: true,
    };

    setRules((prev) => {
      const next = [newRule, ...prev];
      try {
        localStorage.setItem('inbox_assistant_smart_rules', JSON.stringify(next));
      } catch {}
      return next;
    });
    setNaturalInput('');
    setPreviewRuleId(newRule.id);
    onSaveToast();
  };

  // Preview matching emails for the active rule
  const getMatchingEmails = (rule: SmartRule) => {
    return emails.filter((email) => {
      if (rule.conditionType === 'waiting_days') {
        return (email.waitingDays || 0) >= 3;
      }
      if (rule.conditionType === 'category') {
        return email.triage?.category === 'sales_outreach' || email.triage?.category === 'informational_newsletter';
      }
      const q = rule.name.toLowerCase();
      return (
        email.subject.toLowerCase().includes('urgent') ||
        email.body.toLowerCase().includes('deliverable') ||
        email.body.toLowerCase().includes('committee')
      );
    });
  };

  const selectedRule = rules.find((r) => r.id === previewRuleId) || rules[0];
  const matchedEmails = selectedRule ? getMatchingEmails(selectedRule) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
          Smart Rules Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Rules & Priority Settings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Express priority preferences in plain English. The assistant translates them into transparent rules and shows you exactly which emails match before activating.
        </p>
      </div>

      {/* Natural Language Rule Creator */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>Add Custom Natural Language Rule</span>
        </h3>

        <form onSubmit={handleAddNaturalRule} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            aria-label="Natural language rule input"
            value={naturalInput}
            onChange={(e) => setNaturalInput(e.target.value)}
            placeholder="e.g. 'Prioritize anything from my client Amanda' or 'Skip emails mentioning webinar'"
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!naturalInput.trim()}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Quick ideas:</span>
          <button
            type="button"
            onClick={() => setNaturalInput('Highlight threads waiting more than 3 days')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
          >
            "Highlight &gt;3 days waiting"
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setNaturalInput('Never draft payment commitments')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
          >
            "Never commit to payments"
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setNaturalInput('Skip newsletters and automated receipts')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 underline cursor-pointer"
          >
            "Skip newsletters"
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Rules List (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Configured Priority Rules</span>
          </h3>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                onClick={() => setPreviewRuleId(rule.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  previewRuleId === rule.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-400 dark:border-indigo-500/80 ring-1 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRule(rule.id);
                        }}
                        aria-label={`Toggle rule ${rule.name}`}
                        className="cursor-pointer"
                      >
                        {rule.enabled ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <h4
                        className={`text-xs font-semibold ${
                          rule.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-400 line-through'
                        }`}
                      >
                        {rule.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        rule.action === 'flag_urgent'
                          ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {rule.action === 'flag_urgent' ? 'FLAG URGENT' : 'SKIP DRAFT'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRule(rule.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer rounded"
                      title="Delete rule"
                      aria-label={`Delete ${rule.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Preview of Affected Emails (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <span>Live Rule Impact Preview</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {matchedEmails.length} matching conversation(s)
            </span>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm">
            <div className="text-xs text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              Showing threads that match rule: <strong className="text-slate-900 dark:text-white">"{selectedRule?.name}"</strong>
            </div>

            {matchedEmails.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No active conversations currently match this rule's criteria.
              </div>
            ) : (
              <div className="space-y-2.5">
                {matchedEmails.map((e) => (
                  <div
                    key={e.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">{e.sender}</span>
                      <span className="font-mono text-slate-500">{e.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 truncate">{e.subject}</p>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                      Effect: {selectedRule.action === 'flag_urgent' ? 'Elevated to Urgent Priority' : 'Silently skipped from draft creation'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
