import React, { useState } from 'react';
import { AuditLogEntry } from '../../types/inbox';
import {
  FileText,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Save,
  RotateCcw,
} from 'lucide-react';

interface ActivityAuditProps {
  logs: AuditLogEntry[];
  onRefreshLogs: () => void;
}

export const ActivityAudit: React.FC<ActivityAuditProps> = ({
  logs,
  onRefreshLogs,
}) => {
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    if (filterAction === 'all') return true;
    return log.action === filterAction;
  });

  function sanitizeCsvCell(value: string | number | undefined | null): string {
    if (value === undefined || value === null) return '""';
    if (typeof value === 'number') return String(value);
    let str = String(value).replace(/"/g, '""');
    // Formula injection defense: if cell starts with formula characters (=, +, -, @, tab, CR), prepend single quote
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str}"`;
  }

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Time', 'Action', 'Subject', 'Sender', 'Status', 'Details'];
    const rows = logs.map((l) => [
      l.timestamp,
      sanitizeCsvCell(l.timeFormatted),
      sanitizeCsvCell(l.action),
      sanitizeCsvCell(l.subjectSanitized || ''),
      sanitizeCsvCell(l.senderSanitized || ''),
      sanitizeCsvCell(l.status),
      sanitizeCsvCell(l.details),
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inbox-assistant-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
            Accountability & Compliance Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Activity & Audit History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            A permanent record of every triage scan, drafted reply, provider save, and individual send authorization. Full message bodies are never exposed in ordinary logs to protect your privacy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefreshLogs}
            className="min-h-[44px] px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: `All Events (${logs.length})` },
          { id: 'inbox_scan', label: 'Triage Scans' },
          { id: 'draft_generated', label: 'Drafts Created' },
          { id: 'provider_draft_created', label: 'Saved to Mailbox' },
          { id: 'individual_send_authorized', label: 'Approved Sends' },
          { id: 'scheduled_sweep', label: 'Scheduled Sweeps' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterAction(tab.id)}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterAction === tab.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
              No audit logs recorded for this event category yet.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isSend = log.action === 'individual_send_authorized';
              const isDraft = log.action === 'draft_generated' || log.action === 'provider_draft_created';
              const isScan = log.action === 'inbox_scan' || log.action === 'scheduled_sweep';

              return (
                <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSend
                          ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400'
                          : isDraft
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {isSend ? (
                        <Send className="w-4 h-4" />
                      ) : isDraft ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white font-mono text-[11px] uppercase tracking-wider">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{log.timeFormatted}</span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans break-words">
                        {log.details}
                      </p>

                      {(log.subjectSanitized || log.senderSanitized) && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-2 pt-0.5">
                          {log.senderSanitized && <span>Target: {log.senderSanitized}</span>}
                          {log.subjectSanitized && <span>· Subject: "{log.subjectSanitized}"</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md ${
                        log.status === 'success'
                          ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                          : log.status === 'warning'
                          ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
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
