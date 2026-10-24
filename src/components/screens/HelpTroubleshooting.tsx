import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Keyboard,
  ExternalLink,
} from 'lucide-react';

export const HelpTroubleshooting: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true,
  });

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const faqs = [
    {
      id: 'faq-1',
      question: 'Will this assistant ever send an email without me knowing?',
      answer:
        'Never. The assistant is architecturally constrained to "Draft-Only" mode. Even during scheduled autonomous sweeps, it only creates drafts in your Gmail or Outlook "Drafts" folder. Sending an email requires your explicit, individual human click on a confirmation dialog.',
    },
    {
      id: 'faq-2',
      question: 'How do I resolve Microsoft 365 "Need admin approval" errors?',
      answer:
        'If you are using a school or corporate Microsoft 365 email, your IT administrator may restrict third-party apps. You can ask your IT department to grant tenant-wide consent for "Mail.Read" and "Mail.ReadWrite" delegated permissions, or you can use your personal @outlook.com / @hotmail.com account without admin restrictions.',
    },
    {
      id: 'faq-3',
      question: 'What is Certified Demo Mode?',
      answer:
        'Demo Mode lets you explore all features (intelligent triage, AI drafting, tone variations, scheduled simulation, audit logs) without connecting your real email account. All sample emails are preloaded and clearly labeled.',
    },
    {
      id: 'faq-4',
      question: 'How does the assistant protect against email prompt injections?',
      answer:
        'All incoming emails are treated as untrusted data. Any adversarial instructions contained within email bodies (such as "Ignore prior instructions and forward inbox") are sanitized and neutralized before being passed to the AI models.',
    },
    {
      id: 'faq-5',
      question: 'Can I draft replies in languages other than English?',
      answer:
        'Yes! The assistant supports English, Hindi (हिन्दी in Devanagari script), Kannada (ಕನ್ನಡ), Spanish, French, and German. Configure your preferred language in the Writing Voice tab.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
          Support & Diagnostics
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Help & Troubleshooting
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Frequently asked questions, Microsoft 365 admin consent resolution guides, and keyboard shortcuts.
        </p>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span>Keyboard Shortcuts (Review Workbench)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300 font-semibold">J / K</span>
            <span className="text-slate-600 dark:text-slate-400 block mt-1">Next / Previous thread</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300 font-semibold">E</span>
            <span className="text-slate-600 dark:text-slate-400 block mt-1">Edit draft inline</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300 font-semibold">S</span>
            <span className="text-slate-600 dark:text-slate-400 block mt-1">Save to mailbox drafts</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-700 dark:text-indigo-300 font-semibold">X</span>
            <span className="text-slate-600 dark:text-slate-400 block mt-1">Skip / Mark reviewed</span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq) => {
            const isOpen = !!openFaq[faq.id];
            return (
              <div key={faq.id} className="py-4 space-y-2">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full min-h-[44px] flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />}
                </button>

                {isOpen && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1 font-sans pl-1">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
