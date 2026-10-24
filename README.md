# Inbox Assistant Studio 2.0
> **"Your inbox, understood. Your replies, ready. Your decision."**

Inbox Assistant Studio is a safe, intelligent email assistant designed for everyone—from everyday consumers to busy professionals. It connects to an authorized **Google Gmail** or **Microsoft Outlook** mailbox (or runs in **Certified Demo Mode**), understands incoming conversations, prepares personalized draft replies in your voice, and presents each draft for individual human review.

---

## 1. Core Safety Principle: Draft-Only Default

- **Review Required**: The assistant **never** sends messages automatically in its default mode.
- **Individual Decisions**: Each conversation is reviewed and approved on its own—never as a blind bulk batch.
- **Provider Draft Staging**: Drafts are safely saved to your Gmail or Outlook "Drafts" folder.
- **Anti-Prompt-Injection Shield**: Incoming email content is treated as untrusted data; adversarial instructions embedded in email bodies are neutralized.
- **Human-in-the-Loop Send Confirmation**: An individual send action requires explicit double-confirmation displaying the verified recipient and final message text.

---

## 2. Three Experience Modes

Switch modes anytime from the top navigation bar:

1. **Simple Mode**:
   - Friendly language without technical jargon.
   - Large, readable typography.
   - **One email at a time** stepper card with large "Save as Draft", "Make Shorter", "Make Warmer", and "Skip" buttons.
2. **Balanced Mode**:
   - Streamlined inbox queue, draft previews, and quick tone selectors.
   - Fast keyboard shortcuts (`J`/`K` navigation, `E` edit, `S` save draft, `X` skip).
   - Adjustable density for efficient morning sweeps.
3. **Advanced Mode**:
   - Full thread chronologies and sender history.
   - Confidence scores (0–100%) and 9-category triage classification.
   - Natural language rule builder with live email impact preview.
   - Raw diagnostic logs and token health telemetry.

---

## 3. Ten Cohesive Product Screens

| Screen | Description |
| :--- | :--- |
| **A. Setup Guide** | Guided 8-step onboarding wizard explaining capabilities, permissions, review periods, and verification. |
| **B. Mailbox Connection** | Truthful status reporting, live OAuth token authorization, setup guides, and Certified Demo Mode. |
| **C. Inbox Overview** | Visual summary of checked threads, 9-category breakdown, wait time tracking, and search filters. |
| **D. Review Workbench** | The flagship workbench: diff editing, tone switching, safety flags, draft saving, and individual send. |
| **E. Writing Voice** | Personal name, role, company, tone styles, and multi-language support (English, Hindi, Kannada, Spanish, French, German). |
| **F. Smart Rules** | Natural language rule builder with instant live preview of which emails are affected. |
| **G. Scheduled Checks** | Server-side recurring automation with cron cadences, pause/resume, and execution history. |
| **H. Audit Log** | Permanent, sanitized compliance trail with CSV export for auditing all scans and drafts. |
| **I. Privacy & Safety** | Data retention policy, anti-prompt-injection defense, zero password storage, and one-click token revocation. |
| **J. Help & FAQ** | Plain-language FAQ, keyboard shortcuts reference, and Microsoft 365 admin consent resolution. |

---

## 4. Intelligent Triage Taxonomy

Conversations are classified into 9 distinct categories:
1. `needs_reply`: Direct question or deliverable owed by the user.
2. `urgent_deadline`: Time-sensitive escalation or approaching deadline.
3. `waiting_on_other`: The user sent the last message and is waiting for a counterparty reply.
4. `followup_overdue`: A thread awaiting your follow-up for 3+ days.
5. `informational_newsletter`: Industry digests or newsletters (skipped).
6. `automated_alert`: System receipts, password alerts, CI/CD notifications (skipped).
7. `sales_outreach`: Unsolicited B2B sales pitches and cold sequences (skipped).
8. `resolved`: Closed conversations or thank-yous with no pending items.
9. `uncertain_review_required`: Ambiguous context requiring human judgment.

---

## 5. Provider OAuth Integration Guides

### Google Gmail Integration
1. Go to **Google Cloud Console > APIs & Services**. Enable the **Gmail API**.
2. Under **OAuth Consent Screen**, configure an application named *Inbox Assistant Studio*.
3. Add the minimum required scopes:
   - `https://www.googleapis.com/auth/gmail.readonly` (read incoming threads)
   - `https://www.googleapis.com/auth/gmail.compose` (create and hold drafts)
4. Under **Credentials**, create an OAuth 2.0 Client ID or generate an access token to authorize live draft staging.

### Microsoft Outlook / 365 Integration
1. Go to **Microsoft Entra ID (Azure Portal) > App Registrations > New Registration**.
2. Select *Accounts in any organizational directory and personal Microsoft accounts*.
3. Under **API Permissions > Microsoft Graph**, add delegated permissions:
   - `Mail.Read`
   - `Mail.ReadWrite`
4. **School / Enterprise Accounts**: If your organization requires administrator consent, request your M365 IT administrator approve `Mail.Read` and `Mail.ReadWrite`. Reading and drafting work seamlessly.

---

## 6. Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Set your GEMINI_API_KEY in .env

# 3. Run development server (runs full-stack Express + Vite on port 3000)
npm run dev

# 4. Run automated test suite
npm test

# 5. Type-check & build for production
npm run lint
npm run build
```

---

## 7. Feature Implementation Matrix

| Feature | Status | Implementation Details |
| :--- | :--- | :--- |
| **Review Workbench** | **Implemented** | Simple, Balanced, Advanced modes with diff editing, safety flags, and individual send. |
| **Intelligent Triage** | **Implemented** | 9-category classifier with Gemini API + high-fidelity fallback. |
| **Multi-Language Drafts** | **Implemented** | Supports English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ), Spanish, French, and German. |
| **Prompt Injection Shield** | **Implemented** | Inbound email sanitizer neutralizes adversarial directives before model evaluation. |
| **Draft-Only Staging** | **Implemented** | Writes real drafts to Gmail/Outlook APIs or certified demo sandbox. |
| **Individual Send Modal** | **Implemented** | Strict human confirmation dialog; refuses automated bulk sends. |
| **Audit Log Trail** | **Implemented** | Sanitized action logger with CSV export functionality. |
| **Certified Demo Mode** | **Implemented** | 6 realistic enterprise email scenarios; unmistakably labeled. |
| **Real Provider Connectors** | **Architecture Ready** | Token ingestion, Gmail & Graph API drafting endpoints with truthful error states. |
