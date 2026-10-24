import React, { useState } from 'react';
import { X, Plus, Sparkles, Mail } from 'lucide-react';
import { Email } from '../types/inbox';

interface AddEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmail: (email: Email) => void;
}

export const AddEmailModal: React.FC<AddEmailModalProps> = ({
  isOpen,
  onClose,
  onAddEmail,
}) => {
  const [sender, setSender] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  if (!isOpen) return null;

  const handlePreloadSample = (type: 'client' | 'interview' | 'sales') => {
    if (type === 'client') {
      setSender('Amanda Cross');
      setSenderEmail('amanda@crosspartners.com');
      setSubject('Contract review for Q1 retainer extension');
      setBody(`Hi Praveen,

We just reviewed the proposal for extending the engineering retainer into Q1. 

Could we schedule 15 minutes this Wednesday at 11am to clarify the scope breakdown on the cloud migration items? If that time doesn't work, let me know what does.

Thanks,
Amanda Cross`);
    } else if (type === 'interview') {
      setSender('Jordan Lee');
      setSenderEmail('jordan.lee@talentsearch.org');
      setSubject('Senior Frontend Architect candidate debrief');
      setBody(`Hi Praveen,

The hiring panel has completed their notes on yesterday's candidate. 

Do you have any final thoughts before we make an offer decision tomorrow morning? Please let me know your verdict today.

Best,
Jordan`);
    } else {
      setSender('Sales Rep');
      setSenderEmail('outreach@growthblast.ai');
      setSubject('Double your lead conversion with autonomous agents');
      setBody(`Hey there,

Saw your company is expanding. We help teams automate all outreach with AI bots. 

Got 5 minutes for a quick chat this week?

Unsubscribe link below.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !subject.trim() || !body.trim()) return;

    const newEmail: Email = {
      id: `custom-${Date.now()}`,
      sender: sender.trim(),
      senderEmail: senderEmail.trim() || `${sender.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      subject: subject.trim(),
      body: body.trim(),
      date: 'Just now',
      timestamp: Date.now(),
      waitingDays: 1,
      isUnread: true,
      avatarColor: 'from-violet-600 to-indigo-700',
      status: 'pending_review',
    };

    onAddEmail(newEmail);
    onClose();
    // Reset form
    setSender('');
    setSenderEmail('');
    setSubject('');
    setBody('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-email-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 id="add-email-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Add or Paste Email Thread
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test how the assistant triages and drafts replies for real messages
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Preload Templates */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Quick Presets:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePreloadSample('client')}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Client Meeting Request
            </button>
            <button
              type="button"
              onClick={() => handlePreloadSample('interview')}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Internal Decision Blocker
            </button>
            <button
              type="button"
              onClick={() => handlePreloadSample('sales')}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cold Pitch (Skip Test)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Sender Name
              </label>
              <input
                type="text"
                required
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Amanda Cross"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="amanda@crosspartners.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Schedule review for next week"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Body Content
            </label>
            <textarea
              required
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste email message text here..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import to Workbench</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
