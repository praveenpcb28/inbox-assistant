import React, { useState, useEffect } from 'react';
import {
  Email,
  ExperienceMode,
  Priority,
  ToneVariation,
  UserProfile,
} from '../../types/inbox';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Send,
  Archive,
  Edit3,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Wand2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  X,
  FileCheck,
} from 'lucide-react';

interface ReviewWorkbenchProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
  userProfile: UserProfile;
  experienceMode: ExperienceMode;
  onUpdateEmailStatus: (id: string, status: Email['status']) => void;
  onGenerateDraft: (email: Email, tone?: ToneVariation) => Promise<void>;
  onRefineDraft: (email: Email, feedback: string) => Promise<void>;
  onSaveProviderDraft: (email: Email) => Promise<void>;
  onSendIndividualEmail: (email: Email) => Promise<boolean>;
  onOpenAddModal: () => void;
  isDrafting: boolean;
}

export const ReviewWorkbench: React.FC<ReviewWorkbenchProps> = ({
  emails,
  selectedEmailId,
  onSelectEmail,
  userProfile,
  experienceMode,
  onUpdateEmailStatus,
  onGenerateDraft,
  onRefineDraft,
  onSaveProviderDraft,
  onSendIndividualEmail,
  onOpenAddModal,
  isDrafting,
}) => {
  const [filter, setFilter] = useState<'all' | 'needs_reply' | 'overdue_3_days' | 'draft_ready' | 'approved' | 'skipped'>('all');
  const [mobileTab, setMobileTab] = useState<'queue' | 'detail'>('queue');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBody, setEditedBody] = useState('');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [safetyChecklist, setSafetyChecklist] = useState<Record<string, boolean>>({});

  // Individual Send Confirmation Modal State
  const [sendModalEmail, setSendModalEmail] = useState<Email | null>(null);
  const [sendConfirmedCheck, setSendConfirmedCheck] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Filtered emails
  const filteredEmails = emails.filter((e) => {
    if (filter === 'needs_reply') return e.triage?.needs_reply && e.status !== 'sent' && e.status !== 'ignored';
    if (filter === 'overdue_3_days') return (e.waitingDays || 0) >= 3 && e.triage?.needs_reply && e.status !== 'sent';
    if (filter === 'draft_ready') return !!e.draft && e.status === 'pending_review';
    if (filter === 'approved') return e.status === 'draft_staged' || e.status === 'provider_draft_saved' || e.status === 'sent';
    if (filter === 'skipped') return e.status === 'ignored' || e.status === 'skipped' || e.triage?.needs_reply === false;
    return true;
  });

  const selectedIndex = filteredEmails.findIndex((e) => e.id === selectedEmailId);
  const selectedEmail = (selectedIndex >= 0 ? filteredEmails[selectedIndex] : filteredEmails[0]) || null;

  const handleSelect = (email: Email) => {
    onSelectEmail(email.id);
    setIsEditMode(false);
    setEditedBody(email.draft?.draft_body || '');
    setSafetyChecklist({});
    setMobileTab('detail');
  };

  const handleStartEdit = () => {
    setIsEditMode(true);
    setEditedBody(selectedEmail?.draft?.draft_body || '');
  };

  const handleSaveEdit = () => {
    if (selectedEmail && selectedEmail.draft) {
      selectedEmail.draft.draft_body = editedBody;
      selectedEmail.draft.lastEdited = Date.now();
    }
    setIsEditMode(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleCustomRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim() || !selectedEmail) return;
    await onRefineDraft(selectedEmail, refinePrompt);
    setRefinePrompt('');
  };

  const toggleSafetyItem = (flag: string) => {
    setSafetyChecklist((prev) => ({
      ...prev,
      [flag]: !prev[flag],
    }));
  };

  // Keyboard Shortcuts (J / K navigation, E edit, S save draft, X skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'j' || e.key === 'J') {
        if (selectedIndex < filteredEmails.length - 1) {
          handleSelect(filteredEmails[selectedIndex + 1]);
        }
      } else if (e.key === 'k' || e.key === 'K') {
        if (selectedIndex > 0) {
          handleSelect(filteredEmails[selectedIndex - 1]);
        }
      } else if (e.key === 'e' || e.key === 'E') {
        if (selectedEmail?.draft) {
          setIsEditMode((prev) => !prev);
          setEditedBody(selectedEmail.draft.draft_body);
        }
      } else if (e.key === 's' || e.key === 'S') {
        if (selectedEmail?.draft) {
          onSaveProviderDraft(selectedEmail);
        }
      } else if (e.key === 'x' || e.key === 'X') {
        if (selectedEmail) {
          onUpdateEmailStatus(selectedEmail.id, 'skipped');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredEmails, selectedEmail, onSaveProviderDraft, onUpdateEmailStatus]);

  // Stepper navigation for Simple Mode
  const handlePrevStep = () => {
    if (selectedIndex > 0) {
      handleSelect(filteredEmails[selectedIndex - 1]);
    }
  };

  const handleNextStep = () => {
    if (selectedIndex < filteredEmails.length - 1) {
      handleSelect(filteredEmails[selectedIndex + 1]);
    }
  };

  // Individual Send Dialog Handlers
  const handleOpenSendDialog = (email: Email) => {
    setSendModalEmail(email);
    setSendConfirmedCheck(false);
  };

  const handleConfirmSendAction = async () => {
    if (!sendModalEmail || !sendConfirmedCheck) return;
    setIsSending(true);
    try {
      const ok = await onSendIndividualEmail(sendModalEmail);
      if (ok) {
        setSendModalEmail(null);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* =========================================================================
          SIMPLE MODE: Friendly, Distraction-Free One-Email-At-A-Time Review Card
          ========================================================================= */}
      {experienceMode === 'simple' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Simple Stepper Header */}
          <div className="rounded-xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-4 flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={selectedIndex <= 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-700 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Email</span>
            </button>

            <span className="text-xs font-mono font-bold text-indigo-400">
              Email {selectedIndex + 1} of {filteredEmails.length}
            </span>

            <button
              onClick={handleNextStep}
              disabled={selectedIndex >= filteredEmails.length - 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-700 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Next Email</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {selectedEmail ? (
            <div className="rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 p-6 sm:p-8 space-y-6 shadow-xl">
              {/* Message Header */}
              <div className="space-y-2 pb-4 border-b border-slate-800 light:border-slate-200">
                <span className="text-xs font-semibold text-indigo-400">From {selectedEmail.sender}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900">
                  {selectedEmail.subject}
                </h2>
                <p className="text-xs text-slate-400">
                  Received {selectedEmail.date} · Waiting {selectedEmail.waitingDays} day(s) for your response
                </p>
              </div>

              {/* Original Message Box */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Original Message:
                </span>
                <div className="p-4 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-sm text-slate-200 light:text-slate-800 whitespace-pre-line leading-relaxed">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Why reply is needed */}
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                <span className="font-semibold block text-indigo-300">Why the assistant flagged this:</span>
                <p>{selectedEmail.triage?.reason || 'A response is expected.'}</p>
              </div>

              {/* Proposed Reply */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white light:text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Proposed Reply for You:</span>
                  </span>
                  <button
                    onClick={() => handleCopy(selectedEmail.draft?.draft_body || '')}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {selectedEmail.draft ? (
                  <div className="p-4 rounded-xl bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-sm text-slate-100 light:text-slate-900 whitespace-pre-line leading-relaxed">
                    {selectedEmail.draft.draft_body}
                  </div>
                ) : (
                  <button
                    onClick={() => onGenerateDraft(selectedEmail)}
                    disabled={isDrafting}
                    className="w-full py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-600/30"
                  >
                    Draft Reply in My Voice
                  </button>
                )}
              </div>

              {/* Simple Big Action Buttons */}
              {selectedEmail.draft && (
                <div className="pt-4 border-t border-slate-800 light:border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => onSaveProviderDraft(selectedEmail)}
                      className="py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save as Draft in {userProfile.provider === 'outlook' ? 'Outlook' : 'Gmail'}</span>
                    </button>

                    <button
                      onClick={() => handleOpenSendDialog(selectedEmail)}
                      className="py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-sky-400" />
                      <span>Review & Send Email</span>
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => onRefineDraft(selectedEmail, 'Make it shorter and more concise')}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Make it shorter
                    </button>

                    <button
                      onClick={() => onRefineDraft(selectedEmail, 'Make it warmer and friendlier')}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Make it warmer
                    </button>

                    <button
                      onClick={() => onUpdateEmailStatus(selectedEmail.id, 'ignored')}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Skip this conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">All caught up! No emails pending review.</div>
          )}
        </div>
      )}

      {/* =========================================================================
          BALANCED & ADVANCED MODE: Dual-Pane List & Flagship Draft Inspector
          ========================================================================= */}
      {(experienceMode === 'balanced' || experienceMode === 'advanced') && (
        <div className="space-y-4">
          {/* Mobile / Tablet Segment Tab Switcher (< 1024px) */}
          <div className="lg:hidden flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setMobileTab('queue')}
              className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mobileTab === 'queue'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Review Queue</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
                {filteredEmails.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('detail')}
              className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mobileTab === 'detail'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="truncate max-w-[130px]">
                {selectedEmail ? selectedEmail.sender.split(' ')[0] : 'Draft Inspector'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
            {/* Left Column: Email List (5 cols) */}
            <div className={`flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm lg:col-span-5 ${
              mobileTab === 'queue' ? 'flex' : 'hidden lg:flex'
            }`}>
            {/* Header & Filter Bar */}
            <div className="p-4 border-b border-slate-800 light:border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white light:text-slate-900">
                    Review Queue
                  </h2>
                  <span className="text-xs text-slate-400 light:text-slate-500">
                    {filteredEmails.length} messages · Decide each one individually
                  </span>
                </div>
                <button
                  onClick={onOpenAddModal}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-200 light:text-slate-700 bg-slate-800 light:bg-slate-100 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Add Thread</span>
                </button>
              </div>

              {/* Segmented Filter Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-950/70 light:bg-slate-100 rounded-lg overflow-x-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    filter === 'all'
                      ? 'bg-slate-800 light:bg-white text-white light:text-slate-900 shadow-sm'
                      : 'text-slate-400 light:text-slate-600 hover:text-white'
                  }`}
                >
                  All ({emails.length})
                </button>
                <button
                  onClick={() => setFilter('needs_reply')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    filter === 'needs_reply'
                      ? 'bg-slate-800 light:bg-white text-white light:text-slate-900 shadow-sm'
                      : 'text-slate-400 light:text-slate-600 hover:text-white'
                  }`}
                >
                  Needs Reply
                </button>
                <button
                  onClick={() => setFilter('overdue_3_days')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    filter === 'overdue_3_days'
                      ? 'bg-slate-800 light:bg-white text-white light:text-slate-900 shadow-sm'
                      : 'text-slate-400 light:text-slate-600 hover:text-white'
                  }`}
                >
                  &gt;3 Days
                </button>
                <button
                  onClick={() => setFilter('draft_ready')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    filter === 'draft_ready'
                      ? 'bg-slate-800 light:bg-white text-white light:text-slate-900 shadow-sm'
                      : 'text-slate-400 light:text-slate-600 hover:text-white'
                  }`}
                >
                  Draft Ready
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    filter === 'approved'
                      ? 'bg-slate-800 light:bg-white text-white light:text-slate-900 shadow-sm'
                      : 'text-slate-400 light:text-slate-600 hover:text-white'
                  }`}
                >
                  Approved
                </button>
              </div>
            </div>

            {/* Email Rows */}
            <div className="flex-1 divide-y divide-slate-800/60 light:divide-slate-200 overflow-y-auto max-h-[700px]">
              {filteredEmails.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs text-slate-400">No emails match the selected filter.</p>
                  <button
                    onClick={() => setFilter('all')}
                    className="text-xs text-indigo-400 hover:underline cursor-pointer"
                  >
                    Reset filter
                  </button>
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  const initials = email.sender
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <button
                      key={email.id}
                      onClick={() => handleSelect(email)}
                      className={`w-full text-left p-4 transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/30 light:bg-indigo-50/70 border-l-2 border-indigo-500'
                          : 'hover:bg-slate-800/40 light:hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${email.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm`}
                      >
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs truncate ${
                              email.isUnread ? 'font-semibold text-white light:text-slate-900' : 'font-medium text-slate-300 light:text-slate-700'
                            }`}
                          >
                            {email.sender}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap shrink-0">
                            {email.date}
                          </span>
                        </div>

                        <p
                          className={`text-xs truncate ${
                            email.isUnread ? 'font-medium text-slate-200 light:text-slate-800' : 'text-slate-400 light:text-slate-500'
                          }`}
                        >
                          {email.subject}
                        </p>

                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {email.body.replace(/\n+/g, ' ')}
                        </p>

                        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                          {email.triage?.needs_reply ? (
                            <span className="text-amber-400 font-medium">Needs Reply</span>
                          ) : (
                            <span className="text-slate-500">Skip</span>
                          )}
                          <span>·</span>
                          {email.waitingDays > 0 ? (
                            <span className="text-rose-400 font-mono">{email.waitingDays}d waiting</span>
                          ) : (
                            <span>Fresh</span>
                          )}

                          {email.status === 'provider_draft_saved' && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-400 font-medium">Saved in Provider</span>
                            </>
                          )}
                          {email.status === 'draft_staged' && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-400 font-medium">Draft Staged</span>
                            </>
                          )}
                          {email.status === 'sent' && (
                            <>
                              <span>·</span>
                              <span className="text-sky-400 font-medium">Sent</span>
                            </>
                          )}
                          {experienceMode === 'advanced' && email.triage?.confidenceScore && (
                            <>
                              <span>·</span>
                              <span className="font-mono text-slate-500">{email.triage.confidenceScore}%</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Thread & Flagship Draft Inspector (7 cols) */}
          <div className={`flex-col rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm lg:col-span-7 ${
            mobileTab === 'detail' ? 'flex' : 'hidden lg:flex'
          }`}>
            {selectedEmail ? (
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Mobile Back-to-Queue button (< 1024px) */}
                <div className="lg:hidden p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setMobileTab('queue')}
                    className="min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Queue</span>
                  </button>
                  <span className="text-xs font-mono text-slate-500">
                    Email {selectedIndex + 1} of {filteredEmails.length}
                  </span>
                </div>
                {/* Incoming Thread Section */}
                <div className="p-6 border-b border-slate-800 light:border-slate-200 space-y-4 bg-slate-950/40 light:bg-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white light:text-slate-900 leading-snug">
                        {selectedEmail.subject}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 light:text-slate-600 mt-1">
                        <span className="font-medium text-slate-200 light:text-slate-800">{selectedEmail.sender}</span>
                        <span>&lt;{selectedEmail.senderEmail}&gt;</span>
                        <span>·</span>
                        <span className="font-mono text-rose-400 font-semibold">{selectedEmail.waitingDays} days overdue</span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                          selectedEmail.triage?.needs_reply
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {selectedEmail.triage?.categoryLabel || (selectedEmail.triage?.needs_reply ? 'Action Required' : 'No Reply Needed')}
                      </span>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="p-4 rounded-lg bg-slate-900 light:bg-white border border-slate-800/80 light:border-slate-200 text-xs sm:text-sm text-slate-300 light:text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                    {selectedEmail.body}
                  </div>

                  {/* Triage Verdict Explanation */}
                  {selectedEmail.triage && (
                    <div className="p-3 rounded-lg bg-slate-950/70 light:bg-slate-100 border border-slate-800/80 light:border-slate-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200 light:text-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Why this needs a reply:</span>
                        {experienceMode === 'advanced' && (
                          <span className="text-slate-400 font-normal font-mono">
                            (Confidence: {selectedEmail.triage.confidenceScore}%)
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 light:text-slate-600">{selectedEmail.triage.reason}</p>
                    </div>
                  )}
                </div>

                {/* AI Draft & Review Arena */}
                <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 light:border-slate-200">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-semibold text-white light:text-slate-900">
                          Proposed Reply (Human Review Required)
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedEmail.draft && (
                          <>
                            <button
                              onClick={() => setIsEditMode(!isEditMode)}
                              className="px-2.5 py-1 text-xs font-medium text-slate-300 light:text-slate-700 hover:text-white bg-slate-800 light:bg-slate-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{isEditMode ? 'Preview Mode' : 'Edit Reply'}</span>
                            </button>

                            <button
                              onClick={() => handleCopy(selectedEmail.draft?.draft_body || '')}
                              className="px-2.5 py-1 text-xs font-medium text-slate-300 light:text-slate-700 hover:text-white bg-slate-800 light:bg-slate-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              {copiedDraft ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {selectedEmail.draft ? (
                      <div className="mt-4 space-y-4">
                        {/* Safety Flags Warning Box */}
                        {selectedEmail.draft.safety_flags && selectedEmail.draft.safety_flags.length > 0 && (
                          <div className="p-3.5 rounded-lg bg-amber-950/20 light:bg-amber-50 border border-amber-800/40 light:border-amber-300 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 light:text-amber-800">
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>Verification Check: Confirm before approving:</span>
                            </div>
                            <div className="space-y-1.5 pl-5">
                              {selectedEmail.draft.safety_flags.map((flag, idx) => (
                                <label
                                  key={idx}
                                  className="flex items-start gap-2 text-xs text-amber-200/90 light:text-amber-900 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!safetyChecklist[flag]}
                                    onChange={() => toggleSafetyItem(flag)}
                                    className="mt-0.5 rounded border-amber-700 text-amber-500 focus:ring-0 cursor-pointer"
                                  />
                                  <span className={safetyChecklist[flag] ? 'line-through opacity-70' : ''}>
                                    {flag}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Draft Content: View vs Edit */}
                        {isEditMode ? (
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400">
                              Edit reply text directly:
                            </label>
                            <textarea
                              rows={8}
                              value={editedBody}
                              onChange={(e) => setEditedBody(e.target.value)}
                              className="w-full p-4 rounded-lg bg-slate-950 light:bg-white border border-slate-800 light:border-slate-300 text-xs sm:text-sm text-slate-200 light:text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors font-sans resize-none leading-relaxed"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setIsEditMode(false)}
                                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm cursor-pointer"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-lg bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 text-xs sm:text-sm text-slate-200 light:text-slate-800 whitespace-pre-line leading-relaxed font-sans relative">
                            {selectedEmail.draft.draft_body}
                          </div>
                        )}

                        {/* Tone & Style Adjustments */}
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-medium">
                              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                              Regenerate Style:
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Current: {selectedEmail.draft.toneUsed || userProfile.defaultTone}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <button
                              onClick={() => onGenerateDraft(selectedEmail, 'concise')}
                              disabled={isDrafting}
                              className="p-2 text-xs rounded-lg bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 hover:border-slate-700 text-slate-300 light:text-slate-700 transition-all text-center cursor-pointer disabled:opacity-50"
                            >
                              <span className="font-semibold block">Concise</span>
                              <span className="text-[10px] text-slate-500">2-3 sentences</span>
                            </button>

                            <button
                              onClick={() => onGenerateDraft(selectedEmail, 'balanced')}
                              disabled={isDrafting}
                              className="p-2 text-xs rounded-lg bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 hover:border-slate-700 text-slate-300 light:text-slate-700 transition-all text-center cursor-pointer disabled:opacity-50"
                            >
                              <span className="font-semibold block">Balanced</span>
                              <span className="text-[10px] text-slate-500">Clear & polite</span>
                            </button>

                            <button
                              onClick={() => onGenerateDraft(selectedEmail, 'warm')}
                              disabled={isDrafting}
                              className="p-2 text-xs rounded-lg bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 hover:border-slate-700 text-slate-300 light:text-slate-700 transition-all text-center cursor-pointer disabled:opacity-50"
                            >
                              <span className="font-semibold block">Warm</span>
                              <span className="text-[10px] text-slate-500">Collaborative</span>
                            </button>

                            <button
                              onClick={() => onGenerateDraft(selectedEmail, 'executive')}
                              disabled={isDrafting}
                              className="p-2 text-xs rounded-lg bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 hover:border-slate-700 text-slate-300 light:text-slate-700 transition-all text-center cursor-pointer disabled:opacity-50"
                            >
                              <span className="font-semibold block">Executive</span>
                              <span className="text-[10px] text-slate-500">Formal boundary</span>
                            </button>
                          </div>
                        </div>

                        {/* Quick Refine Input */}
                        <form onSubmit={handleCustomRefine} className="pt-2">
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Refine instructions for this draft:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={refinePrompt}
                              onChange={(e) => setRefinePrompt(e.target.value)}
                              placeholder="e.g. 'Push meeting to 4pm' or 'Make it more formal'"
                              className="flex-1 px-3 py-2 text-xs bg-slate-950 light:bg-white border border-slate-800 light:border-slate-300 rounded-lg text-white light:text-slate-900 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              type="submit"
                              disabled={isDrafting || !refinePrompt.trim()}
                              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 light:bg-slate-200 light:text-slate-900 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                            >
                              Refine
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="py-12 text-center space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-white light:text-slate-900">
                            No Draft Prepared Yet
                          </h4>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            {selectedEmail.triage?.needs_reply
                              ? 'This message requires a response. Click below to draft a reply in your voice.'
                              : 'This email was triaged as an FYI or cold pitch. You can still generate a response if you choose.'}
                          </p>
                        </div>
                        <button
                          onClick={() => onGenerateDraft(selectedEmail)}
                          disabled={isDrafting}
                          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-600/30"
                        >
                          <Sparkles className="w-4 h-4 text-indigo-200" />
                          <span>Draft Follow-Up Reply</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  {selectedEmail.draft && (
                    <div className="pt-6 border-t border-slate-800 light:border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateEmailStatus(selectedEmail.id, 'skipped')}
                          className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-950 light:bg-slate-100 hover:bg-slate-800 rounded-lg border border-slate-800 light:border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Skip / Mark Reviewed</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Save to Provider Draft Button */}
                        <button
                          onClick={() => onSaveProviderDraft(selectedEmail)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                            selectedEmail.status === 'provider_draft_saved' || selectedEmail.status === 'draft_staged'
                              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                          }`}
                        >
                          <Save className="w-4 h-4" />
                          <span>
                            {selectedEmail.status === 'provider_draft_saved'
                              ? `Saved in ${userProfile.provider === 'outlook' ? 'Outlook' : 'Gmail'} Drafts`
                              : `Save as ${userProfile.provider === 'outlook' ? 'Outlook' : 'Gmail'} Draft`}
                          </span>
                        </button>

                        {/* Individual Send Button */}
                        <button
                          onClick={() => handleOpenSendDialog(selectedEmail)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 light:bg-slate-200 light:text-slate-900 hover:bg-slate-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-sky-400" />
                          <span>Send Individual Email</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-sm">
                Select an email from the queue on the left to inspect and review drafts.
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* =========================================================================
          INDIVIDUAL SEND CONFIRMATION MODAL (Section 10 Safety Guarantee)
          ========================================================================= */}
      {sendModalEmail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="send-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 id="send-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                  Confirm Individual Send Action
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSendModalEmail(null)}
                aria-label="Close modal"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Recipient:</span>{' '}
                  <strong className="text-slate-900 dark:text-white">{sendModalEmail.sender} &lt;{sendModalEmail.senderEmail}&gt;</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Subject:</span>{' '}
                  <span className="text-slate-900 dark:text-white">{sendModalEmail.draft?.draft_subject || sendModalEmail.subject}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold block mb-1 text-slate-700 dark:text-slate-400">Final Message to Send:</span>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 whitespace-pre-line max-h-48 overflow-y-auto font-sans leading-relaxed text-slate-900 dark:text-slate-200">
                  {sendModalEmail.draft?.draft_body}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200">
                <p>
                  <strong>Human Authorization Notice:</strong> Sending is a real, consequential action under your name. Once dispatched, it cannot be recalled.
                </p>
              </div>

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendConfirmedCheck}
                  onChange={(e) => setSendConfirmedCheck(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span className="text-slate-900 dark:text-white font-medium">
                  I have verified the recipient, facts, commitments, and wording, and authorize sending this individual email.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSendModalEmail(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!sendConfirmedCheck || isSending}
                onClick={handleConfirmSendAction}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                {isSending ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Authorize & Send Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
