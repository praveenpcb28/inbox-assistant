import React, { useState } from 'react';
import { ProviderConnection } from '../../types/inbox';
import {
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Key,
  Server,
  Layers,
} from 'lucide-react';

interface MailboxConnectionProps {
  connection: ProviderConnection;
  onConnectDemo: (provider: 'gmail' | 'outlook') => void;
  onSaveRealToken: (provider: 'gmail' | 'outlook', token: string, email: string) => Promise<boolean>;
  onDisconnect: () => void;
}

export const MailboxConnection: React.FC<MailboxConnectionProps> = ({
  connection,
  onConnectDemo,
  onSaveRealToken,
  onDisconnect,
}) => {
  const [provider, setProvider] = useState<'gmail' | 'outlook'>('gmail');
  const [tokenInput, setTokenInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedScope, setCopiedScope] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'gmail' | 'outlook'>('gmail');

  const handleConnectToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim() || !emailInput.trim()) return;
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      const ok = await onSaveRealToken(provider, tokenInput.trim(), emailInput.trim());
      if (ok) {
        setTokenInput('');
      } else {
        setErrorMessage('Failed to validate access token. Please ensure it has not expired and has draft scopes.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Token verification error.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyScopes = (scopes: string) => {
    navigator.clipboard.writeText(scopes);
    setCopiedScope(true);
    setTimeout(() => setCopiedScope(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
          Mailbox Integration Architecture
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Connect Your Gmail or Microsoft Outlook
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Connect an authorized mailbox via secure OAuth with minimum required permissions (read threads + create drafts), or test safely in Certified Demo Mode.
        </p>
      </div>

      {/* Current Connection Truth Badge */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              connection.mode === 'real'
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {connection.mode === 'real' ? <ShieldCheck className="w-5 h-5" /> : <Server className="w-5 h-5" />}
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {connection.mode === 'real'
                  ? `Active Real Mailbox: ${connection.provider.toUpperCase()}`
                  : `Certified Demo Mode (${connection.provider.toUpperCase()} Simulated)`}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  connection.mode === 'real'
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300'
                }`}
              >
                {connection.mode === 'real' ? 'LIVE OAUTH' : 'SANDBOX DEMO'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 break-words">
              {connection.mode === 'real'
                ? `Authorized user: ${connection.userEmail} · Scopes: ${connection.grantedScopes.join(', ')}`
                : 'Using realistic enterprise sample threads (David Miller, Sarah Chen, Elena Rostova, Marcus Vance). No live mail is touched.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {connection.mode === 'real' ? (
            <button
              type="button"
              onClick={onDisconnect}
              className="min-h-[44px] px-3.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/40 rounded-lg transition-colors cursor-pointer"
            >
              Disconnect Mailbox
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onConnectDemo(provider)}
              className="min-h-[44px] px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Reset Demo Threads</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Connect & OAuth Credentials (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Connect Live Mailbox with Access Token</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              To connect a real Gmail or Outlook account in preview environments without exposing client secrets or needing permanent redirect URIs, generate a scoped OAuth Access Token from your provider and save it below.
            </p>

            <form onSubmit={handleConnectToken} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('gmail')}
                    className={`min-h-[44px] py-2 px-3 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                      provider === 'gmail'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Google Gmail
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('outlook')}
                    className={`min-h-[44px] py-2 px-3 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                      provider === 'outlook'
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Microsoft Outlook
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={provider === 'gmail' ? 'yourname@gmail.com' : 'yourname@outlook.com'}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  OAuth Access Token (Bearer)
                </label>
                <textarea
                  required
                  rows={3}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste your OAuth access token (starts with ya29... for Google or Ew... for Microsoft)"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  Tokens are stored exclusively in secure server-side session memory and never logged or exposed in client bundles.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onConnectDemo(provider)}
                  className="min-h-[44px] px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Use Demo Mode Instead
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-600/30"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-200" />
                      <span>Authorize Connection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Provider Setup Guides (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>Provider OAuth Setup Guide</span>
              </h3>

              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('gmail')}
                  className={`min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeGuideTab === 'gmail'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Gmail
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGuideTab('outlook')}
                  className={`min-h-[36px] px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeGuideTab === 'outlook'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Outlook
                </button>
              </div>
            </div>

            {activeGuideTab === 'gmail' ? (
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Google Workspace / Gmail Setup:
                </p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Open <strong>Google Cloud Console &gt; APIs & Services</strong>. Enable the <strong>Gmail API</strong>.
                  </li>
                  <li>
                    Under <strong>OAuth Consent Screen</strong>, configure an Internal or External app named <em>Inbox Assistant Studio</em>.
                  </li>
                  <li>
                    Add the least-privilege scopes:
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-between break-all">
                      <span className="truncate pr-2">gmail.readonly, gmail.compose</span>
                      <button
                        type="button"
                        onClick={() => copyScopes('https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose')}
                        className="p-1 hover:text-slate-900 dark:hover:text-white shrink-0 cursor-pointer"
                        title="Copy scopes"
                      >
                        {copiedScope ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </li>
                  <li>
                    Under <strong>Credentials</strong>, generate a test token via OAuth Playground or your Google Workspace account and save it on the left.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Microsoft 365 / Outlook Setup:
                </p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Open <strong>Microsoft Entra ID (Azure Portal) &gt; App Registrations</strong>. Click <strong>New Registration</strong>.
                  </li>
                  <li>
                    Supported account types: <em>Accounts in any organizational directory and personal Microsoft accounts</em>.
                  </li>
                  <li>
                    Under <strong>API Permissions &gt; Microsoft Graph</strong>, add delegated permissions:
                    <div className="mt-1 p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                      <span>Mail.Read, Mail.ReadWrite</span>
                      <button
                        type="button"
                        onClick={() => copyScopes('Mail.Read Mail.ReadWrite')}
                        className="p-1 hover:text-slate-900 dark:hover:text-white shrink-0 cursor-pointer"
                        title="Copy scopes"
                      >
                        {copiedScope ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </li>
                  <li>
                    <strong>School & Enterprise Accounts:</strong> If your tenant requires admin consent, request your M365 administrator approve the <em>Mail.Read</em> and <em>Mail.ReadWrite</em> permissions. Reading and drafting work seamlessly.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
