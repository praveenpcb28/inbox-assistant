import { Email } from '../types/inbox';

export const initialMockEmails: Email[] = [
  {
    id: 'email-1',
    sender: 'David Miller',
    senderEmail: 'dmiller@apexsystems.com',
    senderRole: 'VP of Technology, Apex Systems',
    subject: 'Urgent: Status on Q4 Enterprise API Deliverable & SOW Renewal',
    date: '4 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    waitingDays: 4,
    isUnread: true,
    avatarColor: 'from-blue-600 to-indigo-700',
    status: 'pending_review',
    body: `Hi,

I hope your week is wrapping up well.

Our steering committee meets this Thursday at 10:00 AM, and the leadership team is asking for a firm update on the Q4 Enterprise API integration. Specifically:
1. Are we still on track for the staging milestone by November 15?
2. Did your legal counsel approve the revised SOW amendment we sent over last Tuesday?

If we need to adjust dates, please let me know by this afternoon so I can set expectations with the VP of Operations.

Best,
David Miller
VP of Technology | Apex Systems`,
    triage: {
      needs_reply: true,
      priority: 'urgent',
      category: 'urgent_deadline',
      categoryLabel: 'Urgent / Deadline-Sensitive',
      confidenceScore: 98,
      reason: 'Overdue 4 days: Executive client asking for milestone confirmation ahead of a Thursday steering committee meeting.',
      suggested_action: 'Draft priority status update confirming milestone timeline; verify SOW legal status first.',
      detectedDeadlines: ['Thursday 10:00 AM steering committee', 'November 15 staging milestone'],
      detectedQuestions: ['Are we on track for Nov 15 staging?', 'Did legal counsel approve revised SOW amendment?'],
      missingContextWarnings: ['Check with legal regarding SOW amendment clearance'],
    },
    draft: {
      draft_subject: 'Re: Status on Q4 Enterprise API Deliverable & SOW Renewal',
      draft_body: `Hi David,

Thanks for checking in and apologies for the brief delay. 

1. On the Q4 Enterprise API milestone: We are currently on track for the November 15 staging target, and our team has completed the authentication layer. 
2. On the SOW amendment: I am checking in with our legal counsel right now to ensure the revised language is cleared and will follow up with confirmation by 3:00 PM today.

I will send a concise summary slide before your Thursday committee meeting so you have everything in hand for leadership.

Best regards,
Praveen`,
      rationale: 'Addresses both questions directly, acknowledges the wait time politely, commits to an afternoon confirmation without over-promising legal clearance.',
      safety_flags: [
        'Verify with legal before 3:00 PM confirmation',
        'Double-check staging deployment status against Nov 15 target',
      ],
      key_points_addressed: [
        'Confirmed Nov 15 milestone target is on track',
        'Provided 3:00 PM deadline for SOW status',
        'Offered summary slide for Thursday steering committee',
      ],
      toneUsed: 'balanced',
      lastEdited: Date.now() - 1000 * 60 * 30,
    },
  },
  {
    id: 'email-2',
    sender: 'Sarah Chen',
    senderEmail: 'sarah.chen@innovatecorp.io',
    senderRole: 'Head of Product Design',
    subject: 'Quick sync on the mobile workspace redesign (tomorrow 2:30 PM?)',
    date: '1 day ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    waitingDays: 1,
    isUnread: true,
    avatarColor: 'from-emerald-600 to-teal-700',
    status: 'pending_review',
    body: `Hey Praveen,

We just finalized the initial Figma prototypes for the mobile inbox drawer and notification banner. 

Do you have 20 minutes tomorrow afternoon around 2:30 PM PT to review the user flow? If that doesn't work, Thursday morning after 10:30 AM also works on my end.

Looking forward to hearing your thoughts!

Cheers,
Sarah`,
    triage: {
      needs_reply: true,
      priority: 'high',
      category: 'needs_reply',
      categoryLabel: 'Needs a Reply',
      confidenceScore: 94,
      reason: 'Direct scheduling request for mobile design review with two proposed time slots.',
      suggested_action: 'Check calendar availability and confirm or suggest alternate window.',
      detectedDeadlines: ['Tomorrow 2:30 PM PT', 'Thursday after 10:30 AM'],
      detectedQuestions: ['Available for 20 mins to review Figma prototype?'],
    },
    draft: {
      draft_subject: 'Re: Quick sync on the mobile workspace redesign (tomorrow 2:30 PM?)',
      draft_body: `Hi Sarah,

The prototypes sound great—excited to see the new drawer flow.

Tomorrow at 2:30 PM PT works well for me. Please feel free to send a calendar invite with the Figma link attached, and I'll jump on.

Looking forward to it!

Best,
Praveen`,
      rationale: 'Warm and concise acceptance of the preferred 2:30 PM slot, prompting for calendar invite.',
      safety_flags: [
        'Calendar safety: Ensure 2:30 PM PT is open on your calendar before sending',
      ],
      key_points_addressed: [
        'Confirmed tomorrow at 2:30 PM PT',
        'Requested calendar invite with Figma link',
      ],
      toneUsed: 'warm',
      lastEdited: Date.now() - 1000 * 60 * 50,
    },
  },
  {
    id: 'email-3',
    sender: 'Elena Rostova',
    senderEmail: 'elena@internal-ops.dev',
    senderRole: 'Staff Infrastructure Engineer',
    subject: 'Rollback protocol for Saturday database migration',
    date: '5 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    waitingDays: 5,
    isUnread: false,
    avatarColor: 'from-amber-600 to-orange-700',
    status: 'pending_review',
    body: `Hi team,

Here is the draft rollback checklist for our Postgres 16 partition split scheduled for Saturday 02:00 UTC. 

Please review section 3 (Read replica failover fail-safes) and confirm if your service can tolerate up to 90 seconds of read-only mode during the swap.

Let me know if you foresee any blocking issues before our go/no-go sync on Friday.

Thanks,
Elena`,
    triage: {
      needs_reply: true,
      priority: 'urgent',
      category: 'followup_overdue',
      categoryLabel: 'Follow-Up Overdue',
      confidenceScore: 92,
      reason: 'Overdue 5 days: Engineering peer waiting for confirmation on 90-second read-only tolerance before Friday go/no-go.',
      suggested_action: 'Confirm read-only tolerance and note any affected cron jobs.',
      detectedDeadlines: ['Saturday 02:00 UTC migration', 'Friday go/no-go sync'],
      detectedQuestions: ['Can your service tolerate 90s of read-only mode during replica failover?'],
    },
    draft: {
      draft_subject: 'Re: Rollback protocol for Saturday database migration',
      draft_body: `Hi Elena,

Thanks for putting this together, and sorry for the delay in reviewing. 

I've reviewed section 3. Our services cache reads locally and can comfortably tolerate the 90-second read-only swap without customer impact. We don't have any heavy batch writes scheduled during the 02:00 UTC window.

Good to go on our end for the Friday check-in.

Best,
Praveen`,
      rationale: 'Direct confirmation of the technical tolerance, unblocking the infrastructure team.',
      safety_flags: [
        'Confirm no scheduled background jobs run at Saturday 02:00 UTC',
      ],
      key_points_addressed: [
        'Approved 90s read-only tolerance',
        'Confirmed no conflicting write jobs',
      ],
      toneUsed: 'concise',
      lastEdited: Date.now() - 1000 * 60 * 60 * 2,
    },
  },
  {
    id: 'email-4',
    sender: 'Brad Hunter',
    senderEmail: 'brad.hunter@pipelineboost.biz',
    senderRole: 'Account Executive, PipelineBoost',
    subject: '15 mins to supercharge your outbound pipeline?',
    date: '3 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    waitingDays: 3,
    isUnread: true,
    avatarColor: 'from-slate-600 to-zinc-700',
    status: 'ignored',
    body: `Hey Praveen,

I noticed you're heading engineering and product workflows. Most leaders I speak with are struggling to hit Q4 customer acquisition targets without burning out their reps.

We built an autonomous AI SDR that booked 43 meetings for Acme last month. 

Do you have 15 minutes this Thursday for a quick demo? If not, feel free to check out our one-pager attached.

Best,
Brad Hunter | PipelineBoost`,
    triage: {
      needs_reply: false,
      priority: 'low',
      category: 'sales_outreach',
      categoryLabel: 'Sales / Cold Outreach',
      confidenceScore: 96,
      reason: 'Unsolicited B2B sales email asking for a discovery demo call.',
      suggested_action: 'Skip and archive. No reply required per inbox assistant guardrails.',
    },
  },
  {
    id: 'email-5',
    sender: 'Tech Engineering Weekly',
    senderEmail: 'digest@techengineeringweekly.com',
    senderRole: 'Industry Newsletter',
    subject: 'Issue #142: Zero-Trust Microservices & Async Worker Patterns',
    date: '6 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
    waitingDays: 6,
    isUnread: false,
    avatarColor: 'from-purple-600 to-violet-800',
    status: 'ignored',
    body: `Tech Engineering Weekly — Issue 142

In this issue:
- Why teams are moving away from monolithic queues
- 10 architectural patterns for low-latency event-driven workers
- New releases: Node 22 features benchmarked

Click here to view online or adjust subscription preferences.`,
    triage: {
      needs_reply: false,
      priority: 'low',
      category: 'informational_newsletter',
      categoryLabel: 'Informational Newsletter',
      confidenceScore: 98,
      reason: 'Automated newsletter with zero direct questions or human action items.',
      suggested_action: 'Ignore / Keep for casual reading.',
    },
  },
  {
    id: 'email-6',
    sender: 'Marcus Vance',
    senderEmail: 'm.vance@cloudlinepartners.org',
    senderRole: 'Procurement Specialist, CloudLine Partners',
    subject: 'Invoice #INV-2026-889 discrepancy on license tiers',
    date: '2 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    waitingDays: 2,
    isUnread: true,
    avatarColor: 'from-rose-600 to-pink-700',
    status: 'pending_review',
    body: `Hi Praveen,

We received invoice #INV-2026-889 for October. The seat count is billed at 50 enterprise users ($7,500), but per our addendum signed in August, the first 10 seats were to be credited as trial licenses for 90 days.

Could you verify this with your billing operations and send an updated credit memo? We cannot release payment on the invoice until the count is corrected.

Thanks,
Marcus Vance
Finance & Procurement | CloudLine Partners`,
    triage: {
      needs_reply: true,
      priority: 'urgent',
      category: 'urgent_deadline',
      categoryLabel: 'Urgent / Deadline-Sensitive',
      confidenceScore: 99,
      reason: 'Client finance dispute holding invoice payment due to license seat discrepancy.',
      suggested_action: 'Acknowledge note, loop in billing/finance, and confirm credit memo investigation.',
      detectedDeadlines: ['Payment released upon corrected invoice'],
      detectedQuestions: ['Can you verify 10 trial licenses addendum and send updated credit memo?'],
      missingContextWarnings: ['Confirm 10-seat trial addendum terms with Finance Manager before sending'],
    },
    draft: {
      draft_subject: 'Re: Invoice #INV-2026-889 discrepancy on license tiers',
      draft_body: `Hi Marcus,

Thank you for flagging this right away.

You are completely right regarding the 10-seat trial credit addendum. I have looped in our finance team to review invoice #INV-2026-889 and issue the updated credit memo reflecting the adjusted seat count.

We will have the corrected invoice back over to you by tomorrow morning so you can release payment.

Appreciate your patience!

Best regards,
Praveen`,
      rationale: 'Validates the customer concern immediately, references the agreed addendum, and sets clear expectation for corrected memo.',
      safety_flags: [
        'Finance safety: Confirm addendum terms with billing manager before sending',
        'Verify invoice number #INV-2026-889 in billing ledger',
      ],
      key_points_addressed: [
        'Acknowledged the 10-seat trial addendum',
        'Escalated to finance for credit memo',
        'Set resolution timeline for tomorrow morning',
      ],
      toneUsed: 'balanced',
      lastEdited: Date.now() - 1000 * 60 * 10,
    },
  },
];
