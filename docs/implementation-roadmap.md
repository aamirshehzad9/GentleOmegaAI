# GentleΩ Platform - Implementation Roadmap & Migration Strategy
**Version**: 0.1.0  
**Date**: November 6, 2025  
**Estimated Timeline**: 12-16 weeks (phased rollout)

---

## Executive Summary

This document outlines the strategic plan to evolve the current GentleΩ platform (gentleomegaai.space) from a marketing-focused career center website into a fully operational **public-private cooperative platform** with tender-based onboarding, escrow management, and transparent governance.

**Key Principles**:
1. **No full replacement** - Evolve existing platform incrementally
2. **Zero-downtime migration** - Feature flags and phased rollout
3. **Data preservation** - Migrate existing Firebase users to new schema
4. **Backward compatibility** - Marketing pages remain accessible during transition

---

## Current State Analysis

### Existing Infrastructure ✅
- **Domain**: gentleomegaai.space (Firebase Hosting)
- **Frontend**: React 19.2.0 + TypeScript + Tailwind CSS
- **Authentication**: Firebase Auth (Email, Google, GitHub, Microsoft OAuth)
- **Database**: Firestore (user profiles only)
- **Storage**: Firebase Storage (configured but minimal usage)
- **Repository**: GitHub - aamirshehzad9/GentleOmegaAI

### Existing Pages (Current "Career Center" UI)
- Home page with hero, services, events, testimonials
- Menu page (service marketplace preview)
- Dashboard placeholder
- Login & Signup with OAuth
- Profile page (basic user management)
- Payment checkout placeholder

### Gap Analysis

| Feature Required | Current State | Gap |
|-----------------|---------------|-----|
| Campaign Management | ❌ None | Need full campaign lifecycle engine |
| Tender Applications | ❌ None | Need application forms + review system |
| KYC/AML Verification | ❌ None | Need integration with Sumsub/Onfido |
| Escrow Deposits | ❌ None | Need payment gateway + ledger tracking |
| Refund Automation | ❌ None | Need SLA monitoring + processing queue |
| Task Assignment | ❌ None | Need task management + verification |
| Payout System | ❌ None | Need earnings tracking + withdrawal |
| Public Dashboard | ❌ None | Need transparency metrics visualization |
| Audit Trail | ❌ None | Need immutable logging + blockchain anchoring |
| Database | Firestore only | Need PostgreSQL for financial ledger |

**Critical**: Current website content is **fundamentally misaligned** with actual business model. Must be addressed in Phase 1.

---

## Migration Strategy

### Approach: Hybrid Dual-Mode Platform

**Phase 0 (Immediate)**: Content Update  
**Phase 1-2**: Backend Infrastructure  
**Phase 3-4**: Core Platform Features  
**Phase 5-6**: Advanced Features & Public Launch  

### Feature Flag System

Implement feature flags to control rollout:

```typescript
// Feature flags stored in Firestore (admin-controllable)
interface FeatureFlags {
  showCampaigns: boolean;           // Show campaigns page
  enableTenderApplications: boolean; // Allow tender submissions
  enableDeposits: boolean;          // Enable payment processing
  enableRefunds: boolean;           // Enable refund requests
  enableTasks: boolean;             // Enable task management
  showPublicDashboard: boolean;     // Show transparency dashboard
  maintenanceMode: boolean;         // Platform-wide maintenance
}

// Usage in components:
const { flags } = useFeatureFlags();
if (flags.showCampaigns) {
  return <CampaignBrowser />;
}
return <ComingSoonPage />;
```

### Database Migration: Firebase → PostgreSQL Hybrid

**Strategy**: Additive, not destructive

1. **Keep Firebase Auth** (already working well)
2. **Add PostgreSQL** for financial ledger (escrow, payouts, refunds)
3. **Keep Firestore** for real-time features (notifications, chat, dashboard cache)
4. **Sync user data** between Firebase Auth → PostgreSQL users table

```typescript
// Sync function (Cloud Function or backend service)
async function syncFirebaseUserToPostgres(firebaseUser: User) {
  const existingUser = await db.users.findByFirebaseUid(firebaseUser.uid);
  
  if (!existingUser) {
    await db.users.create({
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email,
      email_verified: firebaseUser.emailVerified,
      display_name: firebaseUser.displayName,
      profile_photo_url: firebaseUser.photoURL,
      kyc_status: 'not_started',
      role: 'applicant',
    });
  } else {
    await db.users.update(firebaseUser.uid, {
      email_verified: firebaseUser.emailVerified,
      last_login_at: new Date(),
      last_login_ip: /* from request */,
    });
  }
}
```

---

## Phase-by-Phase Implementation Plan

## Phase 0: Content Realignment (Week 1)
**Goal**: Update marketing content to reflect actual platform purpose

### Tasks:
1. **Update HomePage.tsx**:
   - Change hero from "Career Center" to "Public-Private Cooperative Platform"
   - Update value propositions to reflect tender-based model
   - Add transparency promise (public dashboard link)
   - Update testimonials to cooperation-focused (or remove temporarily)

2. **Update Header.tsx**:
   - Replace "Services" with "Campaigns"
   - Add "Transparency" link to public dashboard

3. **Create interim pages**:
   - `/about` - Explain cooperative model
   - `/how-it-works` - Tender process flow diagram
   - `/transparency` - Link to public dashboard (placeholder initially)

4. **Update metadata.json** and SEO:
   - Title: "GentleΩ - AI-Driven Public-Private Cooperative"
   - Description: "Transparent tender-based platform for AI governance and ethical work distribution"

**Deliverables**:
- Updated marketing pages ✅
- No breaking changes to existing functionality
- Aligned messaging with business model

**Status**: Can deploy immediately without backend changes

---

## Phase 1: Backend Infrastructure (Weeks 2-3)
**Goal**: Set up core backend services and database

### Tasks:

#### 1.1 Database Setup
- [ ] Provision PostgreSQL database (AWS RDS, Google Cloud SQL, or Supabase)
- [ ] Run schema migrations (from `database-schema.md`)
- [ ] Set up connection pooling and read replicas
- [ ] Configure daily backups and point-in-time recovery

#### 1.2 Backend API Setup
- [ ] Initialize Node.js/TypeScript backend (NestJS recommended)
- [ ] Set up project structure:
  ```
  backend/
  ├── src/
  │   ├── modules/
  │   │   ├── users/
  │   │   ├── campaigns/
  │   │   ├── tenders/
  │   │   ├── payments/
  │   │   ├── kyc/
  │   │   ├── tasks/
  │   │   ├── audit/
  │   │   └── admin/
  │   ├── common/
  │   │   ├── guards/      (auth, RBAC)
  │   │   ├── interceptors/ (logging, transforms)
  │   │   ├── middleware/   (rate limiting)
  │   │   └── utils/
  │   └── main.ts
  ├── prisma/
  │   └── schema.prisma    (or TypeORM entities)
  └── package.json
  ```

#### 1.3 Authentication Integration
- [ ] Firebase Admin SDK integration
- [ ] JWT token verification middleware
- [ ] RBAC guard (role-based access control)
- [ ] User sync function (Firebase Auth → PostgreSQL)

#### 1.4 Core API Endpoints (Phase 1)
- [ ] `GET /v1/users/me`
- [ ] `PATCH /v1/users/me`
- [ ] `GET /v1/campaigns` (read-only initially)
- [ ] Health check & metrics endpoints

**Deliverables**:
- Backend API running on staging
- PostgreSQL schema deployed
- Basic auth working (Firebase token → API access)

**Testing**: Postman/Insomnia collection with all endpoints

---

## Phase 2: KYC & Payment Integration (Weeks 4-5)
**Goal**: Enable user verification and payment processing

### Tasks:

#### 2.1 KYC Integration
- [ ] Sign up for Sumsub (recommended) or Onfido
- [ ] Implement KYC API endpoints:
  - `POST /v1/users/kyc/initiate`
  - `GET /v1/users/kyc/status`
  - `POST /v1/users/kyc/webhook` (provider callback)
- [ ] Create KYC verification widget (React component)
- [ ] Set up secure PII storage (off-chain, encrypted)

#### 2.2 Payment Gateway Integration (Stripe Connect)
- [ ] Create Stripe Connect account
- [ ] Set up platform account with escrow capabilities
- [ ] Implement payment endpoints:
  - `POST /v1/payments/deposit`
  - `GET /v1/payments/deposit/:tender_id`
- [ ] Integrate Stripe Elements in frontend (DepositWidget.tsx)
- [ ] Test deposit → escrow ledger → fund allocation flow

#### 2.3 Escrow Ledger
- [ ] Implement escrow transaction logging
- [ ] Auto-calculate fund allocations (30/40/30%)
- [ ] Set up fund pools tracking table
- [ ] Daily reconciliation cron job

**Deliverables**:
- KYC verification working end-to-end
- Deposit payment processing operational
- Escrow ledger tracking accurate

**Testing**:
- Test KYC approval/rejection flows
- Test deposit with test cards
- Verify fund allocation calculations

---

## Phase 3: Campaign & Tender System (Weeks 6-8)
**Goal**: Core platform functionality - campaigns and applications

### Tasks:

#### 3.1 Campaign Management
- [ ] Implement campaign CRUD endpoints
- [ ] Build campaign lifecycle state machine:
  ```
  draft → open → closed → selection_in_progress → active → completed
  ```
- [ ] Create admin campaign creation UI
- [ ] Build CampaignBrowser.tsx (public)
- [ ] Build CampaignDetails.tsx

#### 3.2 Tender Application System
- [ ] Implement tender application endpoints
- [ ] Build TenderApplicationForm.tsx (multi-step)
- [ ] Implement KYC gating (no apply without soft_kyc)
- [ ] Build MyTenders.tsx (user history)
- [ ] Implement tender withdrawal flow

#### 3.3 Selection & Notification
- [ ] Build admin TenderReview.tsx interface
- [ ] Implement selection/rejection endpoints
- [ ] Build SelectionAnnouncement.tsx
- [ ] Set up notification system (email + Firestore real-time)
- [ ] Implement refund initiation for non-selected

#### 3.4 Enable Feature Flags
- [ ] `showCampaigns: true`
- [ ] `enableTenderApplications: true`
- [ ] `enableDeposits: true`

**Deliverables**:
- First test campaign created
- Users can browse and apply
- Selection process working
- Notifications sent

**Testing**:
- Create Tier A test campaign
- Submit 10 test applications
- Select 5, reject 5
- Verify refunds initiated for rejected

---

## Phase 4: Refunds & SLA Automation (Weeks 9-10)
**Goal**: Automated refund processing and SLA monitoring

### Tasks:

#### 4.1 Refund System
- [ ] Implement refund request endpoints
- [ ] Build RefundRequest.tsx component
- [ ] Build RefundHistory.tsx
- [ ] Implement refund processing (Stripe refund API)
- [ ] Auto-calculate refund amounts per policy

#### 4.2 SLA Monitoring
- [ ] Background job: Check refund SLA deadlines daily
- [ ] Send reminders at D-3, D-1, D-0
- [ ] Auto-escalate violations to admin dashboard
- [ ] Generate SLA adherence reports

#### 4.3 Admin Tools
- [ ] Build SLAViolations.tsx dashboard
- [ ] Implement bulk refund processing
- [ ] Add manual refund override (with approval workflow)

#### 4.4 Enable Feature Flag
- [ ] `enableRefunds: true`

**Deliverables**:
- Refund requests processed within 21-day SLA
- Automated notifications working
- SLA violations tracked

**Testing**:
- Request voluntary withdrawal refund
- Process within SLA
- Test SLA violation alert (mock overdue refund)

---

## Phase 5: Task Management & Payouts (Weeks 11-12)
**Goal**: Enable task assignment and earnings for selected participants

### Tasks:

#### 5.1 Task System
- [ ] Implement task CRUD endpoints
- [ ] Build TaskList.tsx and TaskDetails.tsx
- [ ] Implement deliverable upload (Firebase Storage)
- [ ] Build DeliverableUpload.tsx component
- [ ] SHA-256 hash generation for files

#### 5.2 Verification & Validation
- [ ] Build TaskVerification.tsx (validator UI)
- [ ] Implement verification endpoints
- [ ] Auto-trigger payout on verification
- [ ] Audit trail logging

#### 5.3 Payout System
- [ ] Implement payout endpoints
- [ ] Build PayoutHistory.tsx
- [ ] Build WithdrawalRequest.tsx
- [ ] Integrate Stripe payouts (or bank transfer)
- [ ] SLA monitoring for payouts (15 days)

#### 5.4 Enable Feature Flags
- [ ] `enableTasks: true`

**Deliverables**:
- Task assignment working
- Deliverable verification functional
- Payouts processed within 15-day SLA

**Testing**:
- Assign test task to user
- Submit deliverable
- Verify and approve
- Process payout

---

## Phase 6: Dashboards & Transparency (Weeks 13-14)
**Goal**: Public transparency and user dashboards

### Tasks:

#### 6.1 Public Dashboard
- [ ] Build PublicDashboard.tsx
- [ ] Implement `/v1/dashboard/public` endpoint
- [ ] Integrate chart library (recharts or chart.js)
- [ ] Display fund pools, KPIs, SLA metrics
- [ ] Set up hourly cache refresh

#### 6.2 User Dashboard
- [ ] Build UserDashboard.tsx
- [ ] Implement `/v1/dashboard/user` endpoint
- [ ] Show deposits, tenders, tasks, earnings
- [ ] Real-time notifications (Firestore listener)

#### 6.3 Admin Dashboard
- [ ] Build AdminDashboard.tsx
- [ ] Show pending approvals, SLA violations
- [ ] Quick action buttons
- [ ] Fund reconciliation status

#### 6.4 Enable Feature Flag
- [ ] `showPublicDashboard: true`

**Deliverables**:
- Public dashboard live at `/transparency`
- User dashboard personalized
- Admin dashboard operational

**Testing**:
- Verify KPI accuracy against database
- Test real-time notification updates
- Validate fund pool calculations

---

## Phase 7: Audit Trail & Blockchain Anchoring (Weeks 15-16)
**Goal**: Complete transparency with immutable audit trail

### Tasks:

#### 7.1 Audit Logging
- [ ] Implement audit_logs table triggers
- [ ] Hash generation for all critical events
- [ ] Build AuditLogViewer.tsx (admin)
- [ ] Implement audit receipt download

#### 7.2 Blockchain Anchoring (Optional)
- [ ] Set up Ethereum/Polygon node (or use Infura)
- [ ] Implement hash anchoring function
- [ ] Batch daily hashes to reduce gas costs
- [ ] Add blockchain verification endpoint
- [ ] Build HashVerification.tsx component

#### 7.3 Compliance Reporting
- [ ] Generate weekly transparency reports
- [ ] Auto-publish to public dashboard
- [ ] Export functionality (CSV, PDF)

**Deliverables**:
- All financial events logged immutably
- Blockchain anchoring operational
- Downloadable audit receipts

**Testing**:
- Verify hash integrity
- Test blockchain verification
- Validate audit trail completeness

---

## Phase 8: Production Hardening & Launch (Week 16+)
**Goal**: Production readiness and public launch

### Tasks:

#### 8.1 Security Audit
- [ ] Third-party penetration testing
- [ ] OWASP Top 10 compliance check
- [ ] Rate limiting validation
- [ ] SQL injection prevention
- [ ] XSS/CSRF protection

#### 8.2 Performance Optimization
- [ ] Database query optimization
- [ ] API response time < 500ms (p95)
- [ ] Frontend bundle size optimization
- [ ] CDN setup for static assets
- [ ] Image optimization

#### 8.3 Monitoring & Logging
- [ ] Set up Sentry (error tracking)
- [ ] Set up DataDog/New Relic (APM)
- [ ] Configure alerts for SLA violations
- [ ] Set up uptime monitoring (Pingdom/UptimeRobot)

#### 8.4 Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] User guide (how to apply, KYC, deposits)
- [ ] Admin manual (campaign management, selections)
- [ ] Troubleshooting guide

#### 8.5 Launch Checklist
- [ ] Backup strategy tested
- [ ] Disaster recovery plan documented
- [ ] Support email/chat operational
- [ ] Legal pages (Terms, Privacy, Refund Policy)
- [ ] Press release draft
- [ ] Social media announcement

**Deliverables**:
- Production platform fully operational
- Security hardened
- Monitoring active
- Public announcement ready

---

## Data Migration Plan

### Existing Firebase Users → PostgreSQL

```typescript
// One-time migration script
async function migrateExistingUsers() {
  const auth = admin.auth();
  let nextPageToken: string | undefined;
  
  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    
    for (const userRecord of listUsersResult.users) {
      await db.users.upsert({
        firebase_uid: userRecord.uid,
        email: userRecord.email,
        email_verified: userRecord.emailVerified,
        display_name: userRecord.displayName,
        profile_photo_url: userRecord.photoURL,
        kyc_status: 'not_started',
        role: 'applicant',
        created_at: new Date(userRecord.metadata.creationTime),
      });
    }
    
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  
  console.log('Migration complete!');
}
```

**Execution**: Run once before Phase 3 launch

---

## Feature Flag Rollout Schedule

| Phase | Week | Feature Flags Enabled |
|-------|------|----------------------|
| 0 | 1 | (Content update only) |
| 1-2 | 2-5 | (Backend infrastructure) |
| 3 | 6-8 | `showCampaigns`, `enableTenderApplications`, `enableDeposits` |
| 4 | 9-10 | `enableRefunds` |
| 5 | 11-12 | `enableTasks` |
| 6 | 13-14 | `showPublicDashboard` |
| 7-8 | 15-16 | All features enabled, public launch |

---

## Risk Mitigation

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Database migration failure | High | Test on staging, rollback plan, incremental migration |
| Payment gateway issues | High | Stripe test mode first, phased rollout, fallback provider |
| KYC provider downtime | Medium | Queue verification requests, manual fallback |
| SLA violations at scale | Medium | Auto-scaling, background job monitoring, alerts |
| Security breach | High | Penetration testing, bug bounty, insurance |

### Business Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Low campaign participation | Medium | Phased rollout with test campaigns first |
| Refund liquidity crisis | High | Escrow coverage ratio monitoring ≥ 1.0 always |
| Regulatory compliance | High | Legal counsel review, KYC/AML provider SLA |
| User confusion (UI change) | Low | Gradual rollout, user guides, support chat |

---

## Success Metrics

### Phase 3 (MVP Launch)
- ✅ First campaign created and launched
- ✅ ≥10 tender applications submitted
- ✅ KYC pass rate ≥80%
- ✅ Payment success rate ≥95%
- ✅ Selection process completed within 7-day SLA

### Phase 6 (Public Dashboard)
- ✅ Public dashboard live and accessible
- ✅ Weekly update cadence maintained
- ✅ Refund SLA adherence ≥95%
- ✅ Payout SLA adherence ≥95%
- ✅ Escrow coverage ratio ≥1.0

### Phase 8 (Full Production)
- ✅ ≥3 active campaigns simultaneously
- ✅ ≥50 total participants onboarded
- ✅ KYC pass rate ≥95%
- ✅ Zero SLA violations for 30 days
- ✅ Public trust score ≥4.5/5 (if implementing feedback system)

---

## Deployment Strategy

### Environments

1. **Development**: `dev.gentleomegaai.space` (Firebase Hosting preview channels)
2. **Staging**: `staging.gentleomegaai.space` (Separate Firebase project)
3. **Production**: `gentleomegaai.space` (Current live site)

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build frontend
        run: |
          npm ci
          npm run build
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

### Rollback Plan

If critical issues arise post-deployment:

1. **Immediate**: Disable feature flags via Firestore admin console
2. **Frontend**: Revert Firebase Hosting to previous version (1-click)
3. **Backend**: Rollback API deployment via cloud provider console
4. **Database**: Restore from point-in-time backup (if data corruption)

**Recovery Time Objective (RTO)**: < 30 minutes

---

## Budget & Resource Estimates

### Infrastructure Costs (Monthly)

| Service | Provider | Estimated Cost |
|---------|----------|----------------|
| PostgreSQL Database | Supabase/AWS RDS | $25-100 (depending on scale) |
| Backend Hosting | Firebase Cloud Functions / Cloud Run | $20-50 |
| Frontend Hosting | Firebase Hosting | $0 (free tier sufficient) |
| KYC Provider | Sumsub | $1-3 per verification |
| Payment Gateway | Stripe | 2.9% + $0.30 per transaction |
| Blockchain Anchoring | Infura/Alchemy | $0-50 (depending on volume) |
| Monitoring | Sentry + DataDog | $29-99 |
| **Total** | | **~$100-300/month** |

### Development Effort

| Phase | Estimated Hours | If Full-time (40h/week) |
|-------|-----------------|-------------------------|
| Phase 0 | 16h | 0.5 weeks |
| Phase 1 | 80h | 2 weeks |
| Phase 2 | 80h | 2 weeks |
| Phase 3 | 120h | 3 weeks |
| Phase 4 | 80h | 2 weeks |
| Phase 5 | 80h | 2 weeks |
| Phase 6 | 80h | 2 weeks |
| Phase 7 | 80h | 2 weeks |
| Phase 8 | 40h | 1 week |
| **Total** | **656h** | **16.4 weeks** |

**Note**: AI Agent (GitHub Copilot) can accelerate significantly. Estimate assumes solo developer. With AI assistance, could compress to 10-12 weeks.

---

## Next Immediate Steps (Pending Approval)

1. **Review this roadmap** with founder
2. **Approve Phase 0** content updates (can deploy today)
3. **Provision PostgreSQL database** (Phase 1 prep)
4. **Sign up for Stripe** and **Sumsub** accounts (Phase 2 prep)
5. **Create backend repository** structure (Phase 1 start)
6. **Update current website content** to reflect cooperative model (Phase 0)

---

**Roadmap Version**: 0.1.0  
**Last Updated**: November 6, 2025  
**Status**: Awaiting founder approval to proceed with Phase 0
