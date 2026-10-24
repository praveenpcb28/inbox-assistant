import React, { useState } from 'react';
import { Email, TriageCategory } from '../../types/inbox';
import {
  Inbox,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

interface InboxOverviewProps {
  emails: Email[];
  onSelectAndReview: (emailId: string) => void;
  onRunScan: () => void;
  isScanning: boolean;
}

export const InboxOverview: React.FC<InboxOverviewProps> = ({
  emails,
  onSelectAndReview,
  onRunScan,
  isScanning,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TriageCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const needsReplyCount = emails.filter((e) => e.triage?.needs_reply && e.status !== 'sent').length;
  const urgentCount = emails.filter((e) => e.triage?.priority === 'urgent' && e.status !== 'sent').length;
  const stagedCount = emails.filter((e) => e.status === 'draft_staged' || e.draft).length;
  const skippedCount = emails.filter((e) => e.triage?.needs_reply === false || e.status === 'ignored').length;
  const overdue3DaysCount = emails.filter((e) => e.waitingDays >= 3 && e.triage?.needs_reply).length;

  const categories: { key: TriageCategory; label: string; count: number }[] = [
    { key: 'needs_reply', label: 'Needs a Reply', count: emails.filter((e) => e.triage?.category === 'needs_reply').length },
    { key: 'urgent_deadline', label: 'Urgent / Deadline-Sensitive', count: emails.filter((e) => e.triage?.category === 'urgent_deadline').length },
    { key: 'followup_overdue', label: 'Follow-Up Overdue', count: emails.filter((e) => e.triage?.category === 'followup_overdue').length },
    { key: 'waiting_on_other', label: 'Waiting on Other', count: emails.filter((e) => e.triage?.category === 'waiting_on_other').length },
    { key: 'informational_newsletter', label: 'Newsletter / FYI', count: emails.filter((e) => e.triage?.category === 'informational_newsletter').length },
    { key: 'automated_alert', label: 'Automated Alert', count: emails.filter((e) => e.triage?.category === 'automated_alert').length },
    { key: 'sales_outreach', label: 'Sales / Cold Outreach', count: emails.filter((e) => e.triage?.category === 'sales_outreach').length },
    { key: 'resolved', label: 'Resolved / Closed', count: emails.filter((e) => e.triage?.category === 'resolved').length },
    { key: 'uncertain_review_required', label: 'Uncertain: Review Needed', count: emails.filter((e) => e.triage?.category === 'uncertain_review_required').length },
  ];

  const filtered = emails.filter((email) => {
    if (selectedCategory !== 'all' && email.triage?.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        email.sender.toLowerCase().includes(q) ||
        email.subject.toLowerCase().includes(q) ||
        email.body.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Quick Sweep Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
            Intelligent Triage & Health Monitor
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Inbox Overview
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {emails.length} conversations analyzed chronologically. Filtered by urgency, wait time, and whether an action is actually owed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRunScan}
            disabled={isScanning}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-indigo-600/30 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>{isScanning ? 'Analyzing Threads...' : 'Re-Analyze Inbox'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Checked Threads</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {emails.length}
          </p>
          <span className="text-[11px] text-slate-500">Last 7–14 days</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/40 space-y-1 shadow-sm">
          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Needs Reply</span>
          </span>
          <p className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono tabular-nums">
            {needsReplyCount}
          </p>
          <span className="text-[11px] text-amber-800/80 dark:text-amber-200/80">Pending human review</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/40 space-y-1 shadow-sm">
          <span className="text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Urgent Deadlines</span>
          </span>
          <p className="text-xl sm:text-2xl font-bold text-rose-700 dark:text-rose-400 font-mono tabular-nums">
            {urgentCount}
          </p>
          <span className="text-[11px] text-rose-800/80 dark:text-rose-200/80">Same-day turnaround</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">&gt;3 Days Overdue</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {overdue3DaysCount}
          </p>
          <span className="text-[11px] text-slate-500">Awaiting response</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Skipped News/Sales</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {skippedCount}
          </p>
          <span className="text-[11px] text-slate-500">Zero draft noise</span>
        </div>
      </div>

      {/* 9-Category Filter Bar & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Filter by Triage Classification:
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              aria-label="Search sender or subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender or subject..."
              className="w-full min-h-[44px] pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Threads ({emails.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                selectedCategory === cat.key
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Conversations Table */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                You're all caught up!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No conversations match the selected filter.
              </p>
            </div>
          ) : (
            filtered.map((email) => {
              const initials = email.sender
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <div
                  key={email.id}
                  className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${email.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                    >
                      {initials}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {email.sender}
                        </span>
                        <span className="text-slate-400 text-xs">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono break-all">
                          {email.senderEmail}
                        </span>
                        {email.waitingDays > 0 && (
                          <>
                            <span className="text-slate-400 text-xs">·</span>
                            <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-semibold">
                              {email.waitingDays}d waiting
                            </span>
                          </>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {email.subject}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        {email.body.replace(/\n+/g, ' ')}
                      </p>

                      {/* Clean Metadata Indicators */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {email.triage?.categoryLabel || 'Needs Reply'}
                        </span>
                        <span>·</span>
                        <span>Confidence: {email.triage?.confidenceScore || 90}%</span>
                        {email.triage?.reason && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-xs sm:max-w-md">
                              {email.triage.reason}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onSelectAndReview(email.id)}
                      className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
                    >
                      <span>Review Draft</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
