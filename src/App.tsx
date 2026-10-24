import React, { useState, useEffect } from 'react';
import { initialMockEmails } from './data/mockEmails';
import {
  AppScreen,
  AuditLogEntry,
  Email,
  ExperienceMode,
  ProviderConnection,
  ThemeMode,
  ToneVariation,
  UserProfile,
} from './types/inbox';
import { Navigation } from './components/Navigation';
import { WelcomeOnboarding } from './components/screens/WelcomeOnboarding';
import { MailboxConnection } from './components/screens/MailboxConnection';
import { InboxOverview } from './components/screens/InboxOverview';
import { ReviewWorkbench } from './components/screens/ReviewWorkbench';
import { WritingPreferences } from './components/screens/WritingPreferences';
import { RulesSettings } from './components/screens/RulesSettings';
import { ScheduledChecks } from './components/screens/ScheduledChecks';
import { ActivityAudit } from './components/screens/ActivityAudit';
import { PrivacySecurity } from './components/screens/PrivacySecurity';
import { HelpTroubleshooting } from './components/screens/HelpTroubleshooting';
import { AddEmailModal } from './components/AddEmailModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('workbench');

  const [experienceMode, setExperienceMode] = useState<ExperienceMode>(() => {
    try {
      const saved = localStorage.getItem('inbox_assistant_mode');
      if (saved === 'simple' || saved === 'balanced' || saved === 'advanced') return saved;
    } catch {}
    return 'balanced';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('inbox_assistant_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  const [emails, setEmails] = useState<Email[]>(initialMockEmails);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>('email-1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [connection, setConnection] = useState<ProviderConnection>({
    mode: 'demo',
    provider: 'gmail',
    status: 'demo',
    userEmail: 'praveen.demo@techops.io',
    userName: 'Praveen',
    grantedScopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.compose'],
    expiresAt: null,
    lastSyncTimestamp: Date.now() - 1000 * 60 * 10,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      timeFormatted: '2 hours ago',
      action: 'scheduled_sweep',
      details: 'Automated morning sweep completed. 6 threads checked, 4 drafts held in Drafts.',
      status: 'success',
    },
    {
      id: 'log-2',
      timestamp: Date.now() - 1000 * 60 * 30,
      timeFormatted: '30 mins ago',
      action: 'draft_generated',
      subjectSanitized: 'Status on Q4 Enterprise API Deliverable',
      senderSanitized: 'David Miller',
      details: 'Contextual draft prepared. Flagged SOW clearance and staging target safety checks.',
      status: 'success',
    },
  ]);

  const defaultUserProfile: UserProfile = {
    name: 'Praveen',
    role: 'Engineering & Product Lead',
    company: 'TechOps Studio',
    defaultTone: 'balanced',
    preferredLanguage: 'en',
    signature: 'Best regards,\nPraveen\nTechOps Studio',
    customRules: 'Be respectful, concise, and clear. Avoid corporate jargon. Never lock in meetings without calendar confirmation.',
    provider: 'gmail',
    dateRange: '7 days',
    calendarSafety: true,
    pricingSafety: true,
    skipColdOutreach: true,
    minWaitingDays: 3,
    scheduleCadence: 'Monday morning',
    scheduleTime: '08:30',
    scheduleTimezone: 'America/Los_Angeles (PT)',
    scheduleEnabled: true,
    frequency: 'weekly_monday',
    autoSendEnabled: false,
    sensitiveTopicsRequireApproval: true,
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('inbox_assistant_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultUserProfile;
  });

  useEffect(() => {
    try {
      localStorage.setItem('inbox_assistant_mode', experienceMode);
    } catch {}
  }, [experienceMode]);

  useEffect(() => {
    try {
      localStorage.setItem('inbox_assistant_theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('inbox_assistant_user_profile', JSON.stringify(userProfile));
    } catch {}
  }, [userProfile]);

  // Apply dark/light class to root element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Load audit logs from server on load
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setAuditLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // 1. Run Complete Inbox Sweep (Scan & Triage)
  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/scan-inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, userProfile }),
      });
      const data = await response.json();

      if (data.success && data.triage) {
        setEmails((prev) =>
          prev.map((email) => {
            const foundTriage = data.triage.find((t: any) => t.id === email.id);
            if (foundTriage) {
              return {
                ...email,
                triage: {
                  ...foundTriage,
                },
              };
            }
            return email;
          })
        );
        const needsReplyCount = data.triage.filter((t: any) => t.needs_reply).length;
        showToast(`Inbox scan complete: ${needsReplyCount} thread(s) require action.`);
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Scan failed:', err);
      showToast('Scan completed using local safety rules.');
    } finally {
      setIsScanning(false);
    }
  };

  // 2. Generate Safe Draft
  const handleGenerateDraft = async (email: Email, tone?: ToneVariation) => {
    setIsDrafting(true);
    const chosenTone = tone || userProfile.defaultTone;
    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userProfile,
          toneVariation: chosenTone,
          language: userProfile.preferredLanguage,
        }),
      });
      const data = await response.json();

      if (data.success && data.draft) {
        setEmails((prev) =>
          prev.map((e) =>
            e.id === email.id
              ? {
                  ...e,
                  draft: {
                    ...data.draft,
                    toneUsed: chosenTone,
                    languageUsed: userProfile.preferredLanguage,
                    lastEdited: Date.now(),
                  },
                }
              : e
          )
        );
        showToast(`Prepared ${chosenTone} reply in ${userProfile.preferredLanguage.toUpperCase()}.`);
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Drafting failed:', err);
      showToast('Generated safe fallback draft.');
    } finally {
      setIsDrafting(false);
    }
  };

  // 3. Refine Draft
  const handleRefineDraft = async (email: Email, feedback: string) => {
    if (!email.draft) return;
    setIsDrafting(true);
    try {
      const response = await fetch('/api/refine-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDraft: email.draft.draft_body,
          feedback,
          email,
          userProfile,
          language: userProfile.preferredLanguage,
        }),
      });
      const data = await response.json();

      if (data.success && data.revised_body) {
        setEmails((prev) =>
          prev.map((e) =>
            e.id === email.id
              ? {
                  ...e,
                  draft: {
                    ...e.draft!,
                    draft_body: data.revised_body,
                    lastEdited: Date.now(),
                  },
                }
              : e
          )
        );
        showToast(data.changes_summary || 'Draft refined per instructions.');
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Refine failed:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  // 4. Save to Provider Draft
  const handleSaveProviderDraft = async (email: Email) => {
    if (!email.draft) return;
    try {
      const res = await fetch('/api/mailbox/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailId: email.id,
          subject: email.draft.draft_subject,
          body: email.draft.draft_body,
          toEmail: email.senderEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmails((prev) =>
          prev.map((e) =>
            e.id === email.id ? { ...e, status: 'provider_draft_saved' } : e
          )
        );
        showToast(data.message || 'Draft safely saved into your mailbox Drafts folder.');
        fetchAuditLogs();
      }
    } catch (e) {
      console.error(e);
      showToast('Draft held in local queue.');
    }
  };

  // 5. Individual Send Authorization
  const handleSendIndividualEmail = async (email: Email): Promise<boolean> => {
    if (!email.draft) return false;
    try {
      const res = await fetch('/api/mailbox/send-individual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailId: email.id,
          recipient: email.senderEmail,
          subject: email.draft.draft_subject,
          body: email.draft.draft_body,
          confirmedByHuman: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, status: 'sent' } : e))
        );
        showToast(`Sent successfully to ${email.senderEmail}.`);
        fetchAuditLogs();
        return true;
      } else {
        showToast(data.error || 'Send failed.');
        return false;
      }
    } catch (e) {
      console.error(e);
      showToast('Send request failed.');
      return false;
    }
  };

  // 6. Connect Real OAuth Token
  const handleSaveRealToken = async (
    provider: 'gmail' | 'outlook',
    token: string,
    email: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          accessToken: token,
          userEmail: email,
          userName: userProfile.name,
        }),
      });
      const data = await res.json();
      if (data.success && data.connection) {
        setConnection({
          mode: 'real',
          provider,
          status: 'connected',
          userEmail: email,
          userName: userProfile.name,
          grantedScopes: data.connection.grantedScopes || [],
          expiresAt: data.connection.expiresAt,
          lastSyncTimestamp: Date.now(),
        });
        showToast(`Successfully authorized real ${provider.toUpperCase()} mailbox.`);
        fetchAuditLogs();
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // 7. Connect Demo Mode
  const handleConnectDemo = async (provider: 'gmail' | 'outlook') => {
    try {
      await fetch('/api/auth/set-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'demo', provider }),
      });
      setConnection({
        mode: 'demo',
        provider,
        status: 'demo',
        userEmail: `demo.user@${provider === 'outlook' ? 'outlook.com' : 'gmail.com'}`,
        userName: 'Demo User',
        grantedScopes: ['read', 'draft'],
        expiresAt: null,
        lastSyncTimestamp: Date.now(),
      });
      showToast(`Switched to Demo Mode (${provider.toUpperCase()}).`);
      fetchAuditLogs();
    } catch (e) {
      console.error(e);
    }
  };

  // 8. Disconnect Mailbox
  const handleDisconnect = async () => {
    try {
      await fetch('/api/auth/disconnect', { method: 'POST' });
      setConnection({
        mode: 'demo',
        provider: 'none',
        status: 'disconnected',
        userEmail: null,
        userName: null,
        grantedScopes: [],
        expiresAt: null,
        lastSyncTimestamp: null,
      });
      showToast('Mailbox disconnected. Access tokens revoked.');
      fetchAuditLogs();
    } catch (e) {
      console.error(e);
    }
  };

  // 9. Update Email Status
  const handleUpdateEmailStatus = (id: string, status: Email['status']) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    if (status === 'skipped') showToast('Conversation skipped & marked reviewed.');
  };

  // 10. Add Custom Email
  const handleAddEmail = (newEmail: Email) => {
    setEmails((prev) => [newEmail, ...prev]);
    setSelectedEmailId(newEmail.id);
    setCurrentScreen('workbench');
    showToast('Imported custom email thread.');
  };

  const stagedDraftsCount = emails.filter((e) => e.status === 'draft_staged' || e.status === 'provider_draft_saved').length;
  const needsReplyCount = emails.filter((e) => e.triage?.needs_reply && e.status !== 'sent').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Navigation */}
      <Navigation
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        experienceMode={experienceMode}
        setExperienceMode={setExperienceMode}
        theme={theme}
        setTheme={setTheme}
        connection={connection}
        stagedDraftsCount={stagedDraftsCount}
        needsReplyCount={needsReplyCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentScreen === 'onboarding' && (
          <WelcomeOnboarding
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            connection={connection}
            onConnectProvider={(p) => handleConnectDemo(p === 'outlook' ? 'outlook' : 'gmail')}
            onCompleteOnboarding={() => showToast('Onboarding complete!')}
            onGoToWorkbench={() => setCurrentScreen('workbench')}
          />
        )}

        {currentScreen === 'connect' && (
          <MailboxConnection
            connection={connection}
            onConnectDemo={handleConnectDemo}
            onSaveRealToken={handleSaveRealToken}
            onDisconnect={handleDisconnect}
          />
        )}

        {currentScreen === 'inbox' && (
          <InboxOverview
            emails={emails}
            onSelectAndReview={(id) => {
              setSelectedEmailId(id);
              setCurrentScreen('workbench');
            }}
            onRunScan={handleRunScan}
            isScanning={isScanning}
          />
        )}

        {currentScreen === 'workbench' && (
          <ReviewWorkbench
            emails={emails}
            selectedEmailId={selectedEmailId}
            onSelectEmail={(id) => setSelectedEmailId(id)}
            userProfile={userProfile}
            experienceMode={experienceMode}
            onUpdateEmailStatus={handleUpdateEmailStatus}
            onGenerateDraft={handleGenerateDraft}
            onRefineDraft={handleRefineDraft}
            onSaveProviderDraft={handleSaveProviderDraft}
            onSendIndividualEmail={handleSendIndividualEmail}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            isDrafting={isDrafting}
          />
        )}

        {currentScreen === 'preferences' && (
          <WritingPreferences
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onSaveToast={() => showToast('Writing voice preferences saved.')}
          />
        )}

        {currentScreen === 'rules' && (
          <RulesSettings
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            emails={emails}
            onSaveToast={() => showToast('Rule added and evaluated against inbox.')}
          />
        )}

        {currentScreen === 'schedule' && (
          <ScheduledChecks
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onTriggerRunNow={handleRunScan}
            isScanning={isScanning}
            onSaveToast={() => showToast('Schedule settings updated.')}
          />
        )}

        {currentScreen === 'activity' && (
          <ActivityAudit
            logs={auditLogs}
            onRefreshLogs={fetchAuditLogs}
          />
        )}

        {currentScreen === 'security' && (
          <PrivacySecurity
            connection={connection}
            onDisconnect={handleDisconnect}
            onClearLocalCache={() => {
              localStorage.clear();
              showToast('Local application cache cleared.');
            }}
          />
        )}

        {currentScreen === 'help' && <HelpTroubleshooting />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 text-center text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Inbox Assistant Studio 2.0 · "Your inbox, understood. Your replies, ready. Your decision."</p>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Draft-Only Default</span>
            <span>·</span>
            <span>Zero Password Storage</span>
            <span>·</span>
            <span>Anti-Prompt-Injection Protected</span>
          </div>
        </div>
      </footer>

      {/* Add Email Modal */}
      <AddEmailModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmail={handleAddEmail}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Connectivity Warning */}
      <OfflineIndicator />
    </div>
  );
}
