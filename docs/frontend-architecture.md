# GentleΩ Platform - Frontend Component Architecture
**Version**: 0.1.0  
**Date**: November 6, 2025  
**Framework**: React 19.2.0 + TypeScript 5.8.2  
**Styling**: Tailwind CSS + Framer Motion 11.3.1  
**State Management**: React Context + TanStack Query (React Query) for server state

---

## Component Hierarchy & Organization

```
components/
├── layout/
│   ├── Header.tsx ✅ (existing - needs update)
│   ├── Footer.tsx ✅ (existing)
│   ├── Sidebar.tsx (new - for dashboards)
│   └── MainLayout.tsx (new - wrapper)
│
├── auth/
│   ├── LoginPage.tsx ✅ (existing - adequate)
│   ├── SignupPage.tsx ✅ (existing - needs KYC fields)
│   └── ProfilePage.tsx ✅ (existing - needs enhancement)
│
├── campaigns/
│   ├── CampaignBrowser.tsx (new)
│   ├── CampaignCard.tsx (new)
│   ├── CampaignDetails.tsx (new)
│   ├── CampaignTimeline.tsx (new)
│   └── CampaignStatusBadge.tsx (new)
│
├── tenders/
│   ├── TenderApplicationForm.tsx (new)
│   ├── TenderStatusCard.tsx (new)
│   ├── MyTenders.tsx (new)
│   └── TenderWithdrawal.tsx (new)
│
├── kyc/
│   ├── KYCVerificationWidget.tsx (new)
│   ├── KYCStatusBadge.tsx (new)
│   ├── KYCDocumentUpload.tsx (new)
│   └── KYCProviderFrame.tsx (new - Sumsub/Onfido iframe)
│
├── payments/
│   ├── DepositWidget.tsx (new)
│   ├── PaymentMethods.tsx (new)
│   ├── StripePaymentForm.tsx (new)
│   └── PaymentReceipt.tsx (new)
│
├── dashboards/
│   ├── PublicDashboard.tsx (new)
│   ├── UserDashboard.tsx (new)
│   ├── AdminDashboard.tsx (new)
│   ├── KPICard.tsx (new)
│   ├── FundPoolsChart.tsx (new)
│   ├── SLAMonitor.tsx (new)
│   └── TransparencyMetrics.tsx (new)
│
├── tasks/
│   ├── TaskList.tsx (new)
│   ├── TaskCard.tsx (new)
│   ├── TaskDetails.tsx (new)
│   ├── DeliverableUpload.tsx (new)
│   └── TaskVerification.tsx (new - validator only)
│
├── refunds/
│   ├── RefundRequest.tsx (new)
│   ├── RefundHistory.tsx (new)
│   └── RefundStatusTracker.tsx (new)
│
├── payouts/
│   ├── PayoutHistory.tsx (new)
│   ├── WithdrawalRequest.tsx (new)
│   └── PayoutMethodSetup.tsx (new)
│
├── audit/
│   ├── AuditLogViewer.tsx (new - admin only)
│   ├── AuditReceipt.tsx (new)
│   └── HashVerification.tsx (new)
│
├── admin/
│   ├── CampaignManagement.tsx (new)
│   ├── TenderReview.tsx (new)
│   ├── SelectionAnnouncement.tsx (new)
│   ├── SLAViolations.tsx (new)
│   └── FundReconciliation.tsx (new)
│
├── common/
│   ├── Button.tsx (new)
│   ├── Card.tsx (new)
│   ├── Modal.tsx (new)
│   ├── LoadingSpinner.tsx (new)
│   ├── ErrorBoundary.tsx (new)
│   ├── Toast.tsx (new)
│   └── Pagination.tsx (new)
│
└── home/ ✅ (existing marketing pages)
    ├── Hero.tsx
    ├── WhyChooseUs.tsx
    ├── MenuPreview.tsx
    └── ... (keep as-is for now)
```

---

## Detailed Component Specifications

## 1. Layout Components

### MainLayout.tsx (new)
**Purpose**: Wrapper for all authenticated pages with sidebar navigation

```tsx
interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  pageTitle?: string;
}

// Features:
// - Responsive sidebar (collapsible on mobile)
// - Header with user menu (already exists)
// - Breadcrumb navigation
// - Footer
// - Toast notifications container
```

---

### Sidebar.tsx (new)
**Purpose**: Navigation sidebar for dashboard pages

```tsx
interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number; // For notifications
  roles?: UserRole[]; // Show only for specific roles
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon />, roles: ['all'] },
  { label: 'Campaigns', href: '/campaigns', icon: <CampaignIcon />, roles: ['all'] },
  { label: 'My Tenders', href: '/tenders', icon: <TenderIcon />, roles: ['applicant', 'committee_member'] },
  { label: 'Tasks', href: '/tasks', icon: <TaskIcon />, roles: ['committee_member', 'director'] },
  { label: 'Payouts', href: '/payouts', icon: <PayoutIcon />, roles: ['all'] },
  { label: 'Admin', href: '/admin', icon: <AdminIcon />, roles: ['admin', 'director'] },
];

// Features:
// - Active link highlighting
// - Role-based visibility
// - Notification badges
// - Collapsible sections
```

---

### Header.tsx (update existing)
**Current State**: User dropdown with logout ✅  
**Needed Updates**:
- Add campaign navigation links
- Add notification bell icon with count
- Add global search (optional)
- Update navigation based on user role

```tsx
// Add to existing Header.tsx:
// - Notification bell with Firestore listener for real-time count
// - Link to /campaigns in main nav
// - Link to /dashboard in main nav
// - Remove old marketing nav items when user is authenticated
```

---

## 2. Campaign Components

### CampaignBrowser.tsx (new)
**Purpose**: Main campaign listing page with filters

```tsx
interface CampaignBrowserProps {}

// Features:
// - Filter by tier (A, B, C)
// - Filter by status (open, active, completed)
// - Search by campaign title/code
// - Sort by start date, seats available
// - Pagination
// - CampaignCard grid layout

// API: GET /v1/campaigns?tier=A&status=open&page=1&limit=20
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ Campaigns                    [+ Create] │ (admin only)
├─────────────────────────────────────────┤
│ [Filter: Tier] [Filter: Status] [Search]│
├─────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │Campaign │ │Campaign │ │Campaign │   │
│ │ Card A  │ │ Card B  │ │ Card C  │   │
│ └─────────┘ └─────────┘ └─────────┘   │
│ ┌─────────┐ ┌─────────┐               │
│ │Campaign │ │Campaign │               │
│ │ Card D  │ │ Card E  │               │
│ └─────────┘ └─────────┘               │
├─────────────────────────────────────────┤
│           [1] 2 3 ... 10                │
└─────────────────────────────────────────┘
```

---

### CampaignCard.tsx (new)
**Purpose**: Single campaign preview card

```tsx
interface CampaignCardProps {
  campaign: Campaign;
}

// Display:
// - Campaign code & title
// - Tier badge (A/B/C with color)
// - Commitment fee
// - Timeline progress bar (visual days remaining)
// - Seats: X / Y filled
// - Status badge (Open, Closed, Active)
// - CTA: "Apply Now" or "View Details"

// Styling: Card with gradient border based on tier
// - Tier A: Gold/Yellow gradient
// - Tier B: Blue gradient
// - Tier C: Purple gradient
```

---

### CampaignDetails.tsx (new)
**Purpose**: Full campaign information page

```tsx
interface CampaignDetailsProps {
  campaignId: string;
}

// Sections:
// 1. Header: Title, tier, status, timeline
// 2. Description: Full campaign details
// 3. Requirements: KYC level, commitment fee
// 4. Timeline: Start, end, selection deadline (visual calendar)
// 5. Seats: Progress bar showing filled/total
// 6. Apply Button (if eligible)
// 7. My Application Status (if already applied)

// API: GET /v1/campaigns/:id
```

---

### CampaignTimeline.tsx (new)
**Purpose**: Visual timeline component for campaign phases

```tsx
interface CampaignTimelineProps {
  startDate: Date;
  endDate: Date;
  selectionDeadline: Date;
}

// Visual:
// ─────○─────────○─────────○─────
//    Start   Selection   End
//           Deadline

// Highlight current phase with color
```

---

## 3. Tender (Application) Components

### TenderApplicationForm.tsx (new)
**Purpose**: Multi-step form for tender submission

```tsx
interface TenderApplicationFormProps {
  campaignId: string;
}

// Steps:
// 1. KYC Check (redirect if not soft_kyc_approved)
// 2. Motivation & Skills
// 3. Review & Submit
// 4. Deposit Payment (after submit)

// Validation:
// - Motivation: min 100 chars
// - Skills: required
// - Cannot apply twice to same campaign

// API: POST /v1/tenders
```

**Layout (Step 2)**:
```
┌───────────────────────────────────────┐
│ Apply to Campaign: CAMP-A-2025-11-01 │
├───────────────────────────────────────┤
│ Step 2 of 3: Your Application         │
│ ○────●────○                            │
│                                        │
│ Why do you want to participate?       │
│ ┌───────────────────────────────────┐ │
│ │ [Textarea - 500 chars max]        │ │
│ └───────────────────────────────────┘ │
│                                        │
│ Skills & Experience                   │
│ ┌───────────────────────────────────┐ │
│ │ [Textarea - 500 chars max]        │ │
│ └───────────────────────────────────┘ │
│                                        │
│         [Back]        [Next: Review]  │
└───────────────────────────────────────┘
```

---

### MyTenders.tsx (new)
**Purpose**: User's tender application history

```tsx
// Display:
// - List of all tenders (past and current)
// - Status badges
// - Action buttons: View, Withdraw (if eligible), Pay Deposit

// API: GET /v1/tenders/me
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ My Tender Applications                  │
├─────────────────────────────────────────┤
│ CAMP-A-2025-11-01                       │
│ Status: Selected ✅                      │
│ Submitted: Nov 5, 2025                  │
│ [View Details]                          │
├─────────────────────────────────────────┤
│ CAMP-B-2025-10-15                       │
│ Status: Rejected ❌                      │
│ Refund: Processed ($300)                │
│ [View Details]                          │
└─────────────────────────────────────────┘
```

---

## 4. KYC Components

### KYCVerificationWidget.tsx (new)
**Purpose**: Initiate KYC verification flow

```tsx
interface KYCVerificationWidgetProps {
  level: 'soft_kyc' | 'full_kyc';
}

// Features:
// - Show current KYC status
// - "Start Verification" button
// - Opens modal with KYCProviderFrame (Sumsub iframe)
// - Show verification checklist:
//   - ✅ Passport/ID uploaded
//   - ✅ Liveness check passed
//   - ⏳ Sanctions screening pending

// API: POST /v1/users/kyc/initiate
```

---

### KYCStatusBadge.tsx (new)
**Purpose**: Small badge showing KYC status

```tsx
interface KYCStatusBadgeProps {
  status: KYCStatus;
}

// Display:
// - not_started: ⚠️ "KYC Not Started"
// - soft_kyc_approved: ✅ "Soft KYC Verified"
// - full_kyc_approved: ✅ "Full KYC Verified"
// - rejected: ❌ "KYC Rejected"

// Color coding for quick visual reference
```

---

### KYCProviderFrame.tsx (new)
**Purpose**: Embed KYC provider (Sumsub/Onfido) iframe

```tsx
interface KYCProviderFrameProps {
  provider: 'sumsub' | 'onfido';
  sessionToken: string;
  onComplete: () => void;
}

// Features:
// - Load provider SDK
// - Handle completion callback
// - Show loading state
// - Error handling
```

---

## 5. Payment Components

### DepositWidget.tsx (new)
**Purpose**: Payment widget for commitment fee

```tsx
interface DepositWidgetProps {
  tenderId: string;
  amount: number;
  currency: string;
}

// Features:
// - Display amount prominently
// - Show escrow allocation breakdown:
//   - 30% Escrow Pool (refundable)
//   - 40% Operations Pool
//   - 30% R&D Reserve
// - Stripe Payment Element integration
// - Payment confirmation modal
// - Receipt download

// API: POST /v1/payments/deposit
```

**Layout**:
```
┌───────────────────────────────────────┐
│ Pay Commitment Fee                    │
├───────────────────────────────────────┤
│ Campaign: CAMP-A-2025-11-01           │
│ Tier A Commitment Fee: $500.00 USD    │
│                                        │
│ Fund Allocation:                      │
│ • 30% ($150) → Escrow (refundable)    │
│ • 40% ($200) → Operations             │
│ • 30% ($150) → R&D Reserve            │
│                                        │
│ Payment Method                        │
│ ┌───────────────────────────────────┐ │
│ │ [Stripe Payment Element]          │ │
│ └───────────────────────────────────┘ │
│                                        │
│       [Cancel]     [Pay $500.00]      │
└───────────────────────────────────────┘
```

---

### PaymentReceipt.tsx (new)
**Purpose**: Display payment receipt with hash

```tsx
interface PaymentReceiptProps {
  escrowTransactionId: string;
}

// Display:
// - Transaction ID
// - Date & time
// - Amount
// - Fund allocation breakdown
// - Payment method (last 4 digits)
// - Blockchain hash (if anchored)
// - Download PDF button

// API: GET /v1/audit/receipt/:id
```

---

## 6. Dashboard Components

### PublicDashboard.tsx (new)
**Purpose**: Public transparency metrics (accessible without login)

```tsx
// Sections:
// 1. Hero: "GentleΩ Transparency Dashboard"
// 2. Fund Pools Chart (pie/donut chart)
// 3. KPI Grid:
//    - Active Campaigns
//    - Total Escrow Coverage Ratio
//    - Refunds Issued (count & $)
//    - Refund SLA Adherence %
//    - Payout SLA Adherence %
//    - KYC Pass Rate %
// 4. Recent Activity Timeline (anonymized)
// 5. Weekly Statistics Chart

// API: GET /v1/dashboard/public
// Update: Every 1 hour (cached)
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ GentleΩ Transparency Dashboard          │
│ Live view of platform operations        │
├─────────────────────────────────────────┤
│ Fund Pools                              │
│ ┌─────────┐  Escrow:    $15,000 (30%)  │
│ │  Donut  │  Ops:       $28,000 (40%)  │
│ │  Chart  │  R&D:       $12,000 (30%)  │
│ └─────────┘  Total:     $55,000         │
├─────────────────────────────────────────┤
│ Key Performance Indicators              │
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │Active  │ │Escrow  │ │Refund  │       │
│ │Camps: 3│ │Cov:1.15│ │SLA:98.5│       │
│ └────────┘ └────────┘ └────────┘       │
└─────────────────────────────────────────┘
```

---

### UserDashboard.tsx (new)
**Purpose**: Personalized dashboard for authenticated users

```tsx
// Sections:
// 1. Welcome: "Welcome back, John Doe"
// 2. Quick Stats:
//    - My Tier & Shares
//    - Total Earnings
//    - Active Tenders
//    - Pending Tasks
// 3. Recent Activity:
//    - Latest tender updates
//    - Task assignments
//    - Refund/payout notifications
// 4. Action Cards:
//    - "Browse Campaigns"
//    - "Complete KYC" (if not done)
//    - "Submit Deliverable" (if task pending)

// API: GET /v1/dashboard/user
```

---

### AdminDashboard.tsx (new)
**Purpose**: Admin overview with critical metrics

```tsx
// Sections:
// 1. SLA Violations Alert (if any)
// 2. Pending Approvals:
//    - Tenders awaiting review
//    - Deliverables awaiting verification
//    - Refunds awaiting approval
// 3. Fund Reconciliation Status
// 4. User Statistics:
//    - New registrations this week
//    - KYC completion rate
//    - Active participants
// 5. Quick Actions:
//    - Create Campaign
//    - Announce Selection
//    - Trigger Reconciliation

// API: Multiple endpoints
```

---

### KPICard.tsx (new)
**Purpose**: Reusable KPI metric card

```tsx
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'cyan' | 'blue' | 'green' | 'red' | 'yellow';
}

// Example:
// <KPICard 
//   title="Refund SLA" 
//   value="98.5%" 
//   subtitle="On-time refunds"
//   icon={<CheckIcon />}
//   trend="up"
//   trendValue="+2.3%"
//   color="green"
// />
```

---

## 7. Task Components

### TaskList.tsx (new)
**Purpose**: List of assigned tasks

```tsx
interface TaskListProps {
  userId?: string; // If undefined, show current user's tasks
}

// Display:
// - Task title
// - Status badge
// - Deadline (with urgency indicator)
// - Payout amount
// - Completion percentage progress bar
// - Action: "View Details" or "Submit Deliverable"

// API: GET /v1/tasks/me
```

---

### TaskDetails.tsx (new)
**Purpose**: Full task information and deliverable submission

```tsx
interface TaskDetailsProps {
  taskId: string;
}

// Sections:
// 1. Task Info: Title, description, requirements
// 2. Timeline: Assigned date, deadline
// 3. Payout: Amount upon completion
// 4. Progress: Update completion %
// 5. Deliverables: Upload files section
// 6. History: Previous submissions & verifications

// API: GET /v1/tasks/:id
// API: POST /v1/tasks/:id/deliverables
```

---

### DeliverableUpload.tsx (new)
**Purpose**: File upload widget for task deliverables

```tsx
interface DeliverableUploadProps {
  taskId: string;
  onUploadComplete: (deliverableId: string) => void;
}

// Features:
// - Drag & drop file upload
// - Multiple files support
// - File type validation (PDF, DOCX, images)
// - Progress indicator
// - SHA-256 hash generation (client-side for preview)
// - Description/notes textarea

// Storage: Firebase Storage
// API: POST /v1/tasks/:id/deliverables
```

---

## 8. Refund & Payout Components

### RefundRequest.tsx (new)
**Purpose**: Request refund form

```tsx
interface RefundRequestProps {
  tenderId: string;
}

// Fields:
// - Reason (textarea)
// - Refund Type (dropdown: voluntary_withdrawal, partial_completion, etc.)
// - Expected refund amount (auto-calculated, read-only)
// - SLA deadline display

// API: POST /v1/refunds/request
```

---

### RefundHistory.tsx (new)
**Purpose**: List of user's refund requests

```tsx
// Display:
// - Refund ID
// - Campaign
// - Amount
// - Status badge (Requested, Processing, Completed)
// - SLA deadline countdown (if pending)
// - Date completed

// API: GET /v1/refunds/me
```

---

### WithdrawalRequest.tsx (new)
**Purpose**: Request payout withdrawal

```tsx
interface WithdrawalRequestProps {
  availableBalance: number;
}

// Fields:
// - Amount (with validation: ≥ minimum threshold)
// - Payout method selection (Stripe, Bank Transfer, Crypto)
// - Account details form (based on method)
// - SLA: "Will be processed within 15 business days"

// API: POST /v1/payouts/withdraw
```

---

## 9. Admin Components

### TenderReview.tsx (new)
**Purpose**: Admin interface to review and select/reject tenders

```tsx
interface TenderReviewProps {
  campaignId: string;
}

// Features:
// - List of all tenders for campaign
// - Filter by status (submitted, under_review, etc.)
// - View tender details in modal/sidebar
// - Batch actions: Select multiple, Reject multiple
// - Reviewer notes textarea
// - Individual actions: Select, Reject, Request more info

// API: GET /v1/campaigns/:id (with tenders)
// API: POST /v1/tenders/:id/select
// API: POST /v1/tenders/:id/reject
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ Tender Review: CAMP-A-2025-11-01        │
├─────────────────────────────────────────┤
│ Showing 45 applications                 │
│ [Filter: All] [Sort: Submitted Date]    │
├─────────────────────────────────────────┤
│ □ John Doe                              │
│   Submitted: Nov 5, 2025                │
│   KYC: ✅  Deposit: ✅                   │
│   [View] [Select] [Reject]              │
├─────────────────────────────────────────┤
│ □ Jane Smith                            │
│   Submitted: Nov 6, 2025                │
│   KYC: ✅  Deposit: ✅                   │
│   [View] [Select] [Reject]              │
└─────────────────────────────────────────┘
```

---

### SelectionAnnouncement.tsx (new)
**Purpose**: Announce campaign selection results

```tsx
interface SelectionAnnouncementProps {
  campaignId: string;
}

// Features:
// - Preview selected vs rejected count
// - Refund initiation confirmation
// - Mass notification preview
// - "Announce Results" button (with confirmation modal)

// API: POST /v1/admin/campaigns/:id/announce-selection
```

---

## 10. Common/Reusable Components

### Button.tsx (new)
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Tailwind variants for consistent styling
```

---

### Modal.tsx (new)
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Features:
// - Overlay with backdrop blur
// - ESC key to close
// - Click outside to close (optional)
// - Framer Motion animations
```

---

### Toast.tsx (new)
```tsx
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // auto-dismiss
}

// Global toast container using React Context
// Usage: useToast().show({ type: 'success', message: 'Deposit successful!' })
```

---

## State Management Strategy

### React Context (Global State)
- **AuthContext** ✅ (existing - for user auth)
- **ToastContext** (new - for notifications)
- **ModalContext** (new - for modals)

### TanStack Query (Server State)
```tsx
// Example: Campaigns query
const { data: campaigns, isLoading, error } = useQuery({
  queryKey: ['campaigns', { tier, status, page }],
  queryFn: () => api.campaigns.list({ tier, status, page }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutations with optimistic updates
const selectTenderMutation = useMutation({
  mutationFn: (tenderId: string) => api.tenders.select(tenderId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tenders'] });
    toast.show({ type: 'success', message: 'Tender selected!' });
  },
});
```

---

## Routing Structure (Updated)

```tsx
// App.tsx routing
<Routes>
  {/* Public routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/campaigns" element={<CampaignBrowser />} />
  <Route path="/campaigns/:id" element={<CampaignDetails />} />
  <Route path="/dashboard/public" element={<PublicDashboard />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/tenders" element={<MyTenders />} />
    <Route path="/tenders/apply/:campaignId" element={<TenderApplicationForm />} />
    <Route path="/tasks" element={<TaskList />} />
    <Route path="/tasks/:id" element={<TaskDetails />} />
    <Route path="/payouts" element={<PayoutHistory />} />
    <Route path="/refunds" element={<RefundHistory />} />
  </Route>

  {/* Admin routes */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/campaigns/:id/review" element={<TenderReview />} />
    <Route path="/admin/sla-violations" element={<SLAViolations />} />
    <Route path="/admin/audit" element={<AuditLogViewer />} />
  </Route>
</Routes>
```

---

## Design System

### Color Palette (from existing branding)
```tsx
const colors = {
  primary: {
    cyan: '#06B6D4',    // Primary brand color
    blue: '#2563EB',    // Secondary brand color
  },
  tier: {
    A: '#F59E0B',       // Gold/Amber for Tier A
    B: '#3B82F6',       // Blue for Tier B
    C: '#8B5CF6',       // Purple for Tier C
  },
  status: {
    success: '#10B981', // Green
    error: '#EF4444',   // Red
    warning: '#F59E0B', // Amber
    info: '#3B82F6',    // Blue
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    // ... Tailwind gray scale
  }
};
```

### Typography
```tsx
// Existing fonts from constants.tsx
font-family: 'Poppins', sans-serif; // Headings
font-family: 'Inter', sans-serif;   // Body text
```

### Spacing & Layout
```tsx
// Container max-widths
const containerWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Consistent padding
const spacing = {
  sectionPadding: 'py-16 px-4',
  cardPadding: 'p-6',
};
```

---

## Next Steps for Implementation

1. **Create base component library** (Button, Card, Modal, Toast)
2. **Set up TanStack Query** for API integration
3. **Build campaign browsing flow**: CampaignBrowser → CampaignDetails → TenderApplicationForm
4. **Implement KYC widget** with Sumsub/Onfido integration
5. **Build deposit payment flow** with Stripe Elements
6. **Create user dashboard** with real-time Firestore notifications
7. **Build public transparency dashboard** with chart libraries (recharts/chart.js)
8. **Implement task management** for selected participants
9. **Build admin interfaces** for campaign management and tender review
10. **Add comprehensive error handling** and loading states

---

**Frontend Architecture Version**: 0.1.0  
**Last Updated**: November 6, 2025  
**Status**: Ready for component development
