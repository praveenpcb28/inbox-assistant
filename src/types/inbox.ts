export type ExperienceMode = 'simple' | 'balanced' | 'advanced';
export type ThemeMode = 'dark' | 'light';

export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export type TriageCategory =
  | 'needs_reply'
  | 'urgent_deadline'
  | 'waiting_on_other'
  | 'followup_overdue'
  | 'informational_newsletter'
  | 'automated_alert'
  | 'sales_outreach'
  | 'resolved'
  | 'uncertain_review_required';

export type ToneVariation =
  | 'balanced'
  | 'concise'
  | 'warm'
  | 'executive'
  | 'formal'
  | 'friendly'
  | 'firm';

export type EmailCategory = TriageCategory;

export type SupportedLanguage =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'es' // Spanish
  | 'fr' // French
  | 'de'; // German

export type EmailStatus =
  | 'pending_review'
  | 'draft_staged'
  | 'provider_draft_saved'
  | 'sent'
  | 'ignored'
  | 'skipped';

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  senderRole?: string;
  subject: string;
  body: string;
  date: string;
  timestamp: number;
  waitingDays: number; // e.g. 4 days overdue
  isUnread: boolean;
  avatarColor: string;
  isDemo?: boolean;
  providerThreadId?: string;
  lastMessageByMe?: boolean;
  triage?: {
    needs_reply: boolean;
    priority: Priority;
    category: TriageCategory;
    categoryLabel: string;
    confidenceScore: number; // 0 to 100
    reason: string;
    suggested_action: string;
    detectedDeadlines?: string[];
    detectedQuestions?: string[];
    missingContextWarnings?: string[];
  };
  draft?: {
    draft_subject: string;
    draft_body: string;
    rationale: string;
    languageUsed?: SupportedLanguage;
    safety_flags: string[];
    key_points_addressed: string[];
    toneUsed?: ToneVariation;
    lastEdited?: number;
    providerDraftId?: string;
  };
  status: EmailStatus;
}

export interface UserProfile {
  name: string;
  role: string;
  company: string;
  defaultTone: ToneVariation;
  preferredLanguage: SupportedLanguage;
  signature: string;
  customRules: string;
  provider: 'gmail' | 'outlook' | 'demo';
  dateRange: '7 days' | '14 days' | '30 days';
  calendarSafety: boolean;
  pricingSafety: boolean;
  skipColdOutreach: boolean;
  minWaitingDays: number;
  scheduleCadence: 'Monday morning' | 'weekday at 8:00 AM' | 'Friday afternoon' | 'custom';
  scheduleTime: string;
  scheduleTimezone: string;
  scheduleEnabled: boolean;
  frequency: 'daily_morning' | 'twice_daily' | 'hourly' | 'weekly_monday';
  autoSendEnabled: false; // Cardinal rule: NEVER true by default
  sensitiveTopicsRequireApproval: boolean;
}

export interface ProviderConnection {
  mode: 'demo' | 'real';
  provider: 'gmail' | 'outlook' | 'none';
  status: 'connected' | 'demo' | 'disconnected' | 'error';
  userEmail: string | null;
  userName: string | null;
  grantedScopes: string[];
  expiresAt: number | null;
  lastSyncTimestamp: number | null;
  errorMessage?: string;
}

export interface SmartRule {
  id: string;
  name: string;
  description: string;
  query: string;
  conditionType: 'waiting_days' | 'sender_contains' | 'subject_contains' | 'body_contains' | 'category';
  action: 'flag_urgent' | 'skip_draft' | 'require_human_check' | 'assign_tone';
  actionValue?: string;
  enabled: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  timeFormatted: string;
  action:
    | 'inbox_scan'
    | 'draft_generated'
    | 'draft_refined'
    | 'draft_staged'
    | 'provider_draft_created'
    | 'individual_send_authorized'
    | 'thread_skipped'
    | 'rule_applied'
    | 'auth_connected'
    | 'auth_disconnected'
    | 'scheduled_sweep';
  threadId?: string;
  subjectSanitized?: string;
  senderSanitized?: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

export interface ScheduledRunLog {
  id: string;
  timestamp: number;
  timeFormatted: string;
  status: 'completed' | 'failed' | 'partial';
  scannedCount: number;
  draftsPrepared: number;
  draftsSavedToProvider: number;
  skippedCount: number;
  notes?: string;
}

export type AppScreen =
  | 'onboarding'
  | 'inbox'
  | 'workbench'
  | 'connect'
  | 'preferences'
  | 'rules'
  | 'schedule'
  | 'activity'
  | 'security'
  | 'help';
