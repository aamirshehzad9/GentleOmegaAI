# GentleΩ Platform Database Schema Design
**Version**: 0.1.0  
**Date**: November 6, 2025  
**Architecture**: Hybrid PostgreSQL (transactional ledger) + Firestore (real-time UI state)

---

## Architecture Decision

### PostgreSQL (Primary - Financial Ledger)
**Purpose**: Transactional integrity for all financial operations  
**Why**: ACID compliance, foreign keys, complex queries, audit trail immutability

**Tables**:
- `users` (enhanced with KYC/AML fields)
- `campaigns`
- `tenders` (applications)
- `escrow_ledger`
- `payouts`
- `refunds`
- `audit_logs`
- `tasks`
- `deliverables`
- `validators`

### Firestore (Secondary - Real-time State)
**Purpose**: Real-time UI updates, notifications, chat  
**Why**: Fast reads, real-time listeners, good for non-critical state

**Collections**:
- `notifications`
- `dashboard_cache` (public transparency metrics)
- `user_sessions`
- `chat_messages` (optional for support)

---

## PostgreSQL Schema

### 1. Users Table (Enhanced)
```sql
CREATE TYPE user_role AS ENUM (
  'applicant',
  'committee_member',
  'director',
  'investor',
  'public_participant',
  'admin',
  'validator'
);

CREATE TYPE kyc_status AS ENUM (
  'not_started',
  'soft_kyc_pending',
  'soft_kyc_approved',
  'soft_kyc_rejected',
  'full_kyc_pending',
  'full_kyc_approved',
  'full_kyc_rejected'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Firebase Auth sync
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- Basic profile
  display_name VARCHAR(255),
  profile_photo_url TEXT,
  phone_number VARCHAR(50),
  
  -- KYC/AML fields
  kyc_status kyc_status DEFAULT 'not_started',
  kyc_provider VARCHAR(100), -- 'sumsub', 'onfido', etc.
  kyc_provider_id VARCHAR(255), -- External KYC provider user ID
  kyc_soft_verified_at TIMESTAMPTZ,
  kyc_full_verified_at TIMESTAMPTZ,
  kyc_rejection_reason TEXT,
  
  -- PII references (stored off-chain)
  passport_hash VARCHAR(64), -- SHA-256 hash of passport/ID
  proof_of_address_hash VARCHAR(64),
  sanctions_check_passed BOOLEAN DEFAULT FALSE,
  sanctions_check_date TIMESTAMPTZ,
  
  -- Role & permissions
  role user_role DEFAULT 'applicant',
  tier CHAR(1), -- 'A', 'B', 'C', NULL for non-tier users
  shares DECIMAL(10, 4) DEFAULT 0, -- Allocated shares (for governance)
  
  -- Account status
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  
  -- Constraints
  CONSTRAINT valid_tier CHECK (tier IN ('A', 'B', 'C') OR tier IS NULL)
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);
CREATE INDEX idx_users_role ON users(role);
```

---

### 2. Campaigns Table
```sql
CREATE TYPE campaign_status AS ENUM (
  'draft',
  'open',
  'closed',
  'selection_in_progress',
  'active',
  'completed',
  'cancelled'
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Campaign identification
  campaign_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'CAMP-A-2025-11-01'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Tier and financial
  tier CHAR(1) NOT NULL CHECK (tier IN ('A', 'B', 'C')),
  commitment_fee DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Timeline
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL, -- 15 days from start
  selection_announcement_deadline TIMESTAMPTZ NOT NULL, -- start + 7 days
  
  -- Capacity
  total_seats INTEGER NOT NULL,
  seats_filled INTEGER DEFAULT 0,
  
  -- Status
  status campaign_status DEFAULT 'draft',
  
  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_seats CHECK (seats_filled <= total_seats)
);

CREATE INDEX idx_campaigns_tier ON campaigns(tier);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);
```

---

### 3. Tenders Table (Applications)
```sql
CREATE TYPE tender_status AS ENUM (
  'draft',
  'submitted',
  'kyc_pending',
  'deposit_pending',
  'under_review',
  'shortlisted',
  'selected',
  'rejected',
  'withdrawn'
);

CREATE TABLE tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Application data
  motivation TEXT, -- Why they want to participate
  skills_summary TEXT,
  relevant_experience TEXT,
  
  -- Status tracking
  status tender_status DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  reviewer_notes TEXT,
  
  -- Selection
  selection_announced_at TIMESTAMPTZ,
  selection_notification_sent BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(campaign_id, user_id) -- One application per campaign per user
);

CREATE INDEX idx_tenders_campaign_id ON tenders(campaign_id);
CREATE INDEX idx_tenders_user_id ON tenders(user_id);
CREATE INDEX idx_tenders_status ON tenders(status);
```

---

### 4. Escrow Ledger Table
```sql
CREATE TYPE escrow_transaction_type AS ENUM (
  'deposit',
  'refund',
  'forfeiture',
  'release_to_ops'
);

CREATE TYPE escrow_status AS ENUM (
  'held',
  'released',
  'forfeited'
);

CREATE TABLE escrow_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES users(id),
  tender_id UUID REFERENCES tenders(id), -- NULL for non-tender deposits
  campaign_id UUID REFERENCES campaigns(id),
  
  -- Transaction details
  transaction_type escrow_transaction_type NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Status
  status escrow_status DEFAULT 'held',
  
  -- Payment gateway integration
  payment_intent_id VARCHAR(255), -- Stripe PaymentIntent ID
  payment_method VARCHAR(50), -- 'stripe', 'payoneer', etc.
  payment_metadata JSONB, -- Raw payment provider data
  
  -- Refund tracking
  refund_eligible BOOLEAN DEFAULT TRUE,
  refund_requested_at TIMESTAMPTZ,
  refund_processed_at TIMESTAMPTZ,
  refund_sla_deadline TIMESTAMPTZ, -- Auto-calculated: requested_at + 21 days
  refund_sla_met BOOLEAN,
  
  -- Forfeiture tracking
  forfeiture_reason TEXT,
  forfeited_at TIMESTAMPTZ,
  forfeiture_approved_by UUID REFERENCES users(id),
  
  -- Audit trail
  blockchain_hash VARCHAR(66), -- Optional: Ethereum tx hash for transparency
  audit_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_escrow_user_id ON escrow_ledger(user_id);
CREATE INDEX idx_escrow_tender_id ON escrow_ledger(tender_id);
CREATE INDEX idx_escrow_status ON escrow_ledger(status);
CREATE INDEX idx_escrow_refund_sla ON escrow_ledger(refund_sla_deadline) WHERE status = 'held';
```

---

### 5. Tasks Table
```sql
CREATE TYPE task_status AS ENUM (
  'assigned',
  'in_progress',
  'submitted',
  'under_verification',
  'approved',
  'rejected',
  'completed'
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  assigned_to UUID NOT NULL REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  
  -- Task details
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  
  -- Payout
  payout_amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Timeline
  deadline TIMESTAMPTZ,
  
  -- Status
  status task_status DEFAULT 'assigned',
  
  -- Completion tracking
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  submitted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_campaign_id ON tasks(campaign_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

---

### 6. Deliverables Table
```sql
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES users(id),
  
  -- Evidence
  file_urls TEXT[], -- Array of file URLs (stored in Firebase Storage)
  file_hashes TEXT[], -- SHA-256 hashes for integrity
  description TEXT,
  notes TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  verification_hash VARCHAR(64), -- Hash of verification event for audit
  verification_notes TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deliverables_task_id ON deliverables(task_id);
CREATE INDEX idx_deliverables_submitted_by ON deliverables(submitted_by);
```

---

### 7. Payouts Table
```sql
CREATE TYPE payout_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
);

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES users(id),
  task_id UUID REFERENCES tasks(id), -- NULL for non-task payouts
  
  -- Amount
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Fund source
  source_pool VARCHAR(50) DEFAULT 'ops', -- 'ops', 'rd_reserve'
  
  -- Status
  status payout_status DEFAULT 'pending',
  
  -- Payment processing
  payout_method VARCHAR(50), -- 'stripe', 'bank_transfer', 'crypto'
  payout_transaction_id VARCHAR(255),
  payout_metadata JSONB,
  
  -- SLA tracking
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  sla_deadline TIMESTAMPTZ, -- Auto-calculated: requested_at + 15 days
  processed_at TIMESTAMPTZ,
  sla_met BOOLEAN,
  
  -- Audit
  blockchain_hash VARCHAR(66),
  audit_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_sla_deadline ON payouts(sla_deadline) WHERE status = 'pending';
```

---

### 8. Refunds Table
```sql
CREATE TYPE refund_status AS ENUM (
  'requested',
  'approved',
  'processing',
  'completed',
  'rejected',
  'cancelled'
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES users(id),
  escrow_transaction_id UUID REFERENCES escrow_ledger(id),
  tender_id UUID REFERENCES tenders(id),
  
  -- Amount
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Refund reason
  reason TEXT,
  refund_type VARCHAR(50), -- 'not_selected', 'voluntary_withdrawal', 'company_termination', 'partial_completion'
  
  -- Status
  status refund_status DEFAULT 'requested',
  
  -- Processing
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  refund_method VARCHAR(50), -- 'stripe_refund', 'bank_transfer'
  refund_transaction_id VARCHAR(255),
  refund_metadata JSONB,
  
  -- SLA tracking
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  sla_deadline TIMESTAMPTZ, -- Auto-calculated: requested_at + 21 days
  completed_at TIMESTAMPTZ,
  sla_met BOOLEAN,
  
  -- Audit
  blockchain_hash VARCHAR(66),
  audit_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refunds_user_id ON refunds(user_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_refunds_sla_deadline ON refunds(sla_deadline) WHERE status IN ('requested', 'approved', 'processing');
```

---

### 9. Audit Logs Table (Immutable)
```sql
CREATE TYPE audit_event_type AS ENUM (
  'user_registered',
  'kyc_submitted',
  'kyc_approved',
  'kyc_rejected',
  'tender_submitted',
  'deposit_received',
  'campaign_opened',
  'campaign_closed',
  'selection_announced',
  'task_assigned',
  'deliverable_submitted',
  'deliverable_verified',
  'payout_initiated',
  'payout_completed',
  'refund_requested',
  'refund_completed',
  'forfeiture_applied',
  'user_suspended',
  'policy_changed'
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event details
  event_type audit_event_type NOT NULL,
  event_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Actor
  actor_id UUID REFERENCES users(id), -- Who performed the action
  actor_ip INET,
  
  -- Subject
  subject_id UUID, -- User/entity affected by the action
  
  -- Related entities
  campaign_id UUID REFERENCES campaigns(id),
  tender_id UUID REFERENCES tenders(id),
  task_id UUID REFERENCES tasks(id),
  
  -- Event data
  event_data JSONB, -- Full context of the event
  event_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for immutability verification
  
  -- Blockchain anchoring (optional)
  blockchain_hash VARCHAR(66),
  blockchain_network VARCHAR(50), -- 'ethereum', 'polygon', etc.
  
  -- Metadata
  user_agent TEXT,
  metadata JSONB,
  
  -- No updates allowed (immutable)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_subject_id ON audit_logs(subject_id);
CREATE INDEX idx_audit_logs_event_timestamp ON audit_logs(event_timestamp DESC);
CREATE INDEX idx_audit_logs_campaign_id ON audit_logs(campaign_id);
```

---

### 10. Fund Pools Table (Aggregate Tracking)
```sql
CREATE TABLE fund_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pool identification
  pool_name VARCHAR(50) UNIQUE NOT NULL, -- 'escrow', 'ops', 'rd_reserve'
  
  -- Balances
  balance DECIMAL(12, 2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Allocation rules (from policy)
  target_percentage INTEGER, -- 30 for escrow, 40 for ops, 30 for rd_reserve
  
  -- Coverage ratio (for escrow pool)
  total_obligations DECIMAL(12, 2) DEFAULT 0, -- Sum of all refundable deposits
  coverage_ratio DECIMAL(5, 4), -- balance / total_obligations (must be ≥ 1.0)
  
  -- Timestamps
  last_reconciled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_percentage CHECK (target_percentage >= 0 AND target_percentage <= 100)
);

-- Insert initial pools
INSERT INTO fund_pools (pool_name, target_percentage) VALUES
  ('escrow', 30),
  ('ops', 40),
  ('rd_reserve', 30);

CREATE INDEX idx_fund_pools_name ON fund_pools(pool_name);
```

---

## Firestore Collections (Real-time State)

### 1. notifications
```javascript
{
  userId: string,
  type: 'tender_update' | 'kyc_status' | 'deposit_received' | 'refund_processed' | 'task_assigned' | 'payout_complete',
  title: string,
  message: string,
  read: boolean,
  actionUrl: string, // Deep link to relevant page
  timestamp: Timestamp,
  metadata: object
}
```

### 2. dashboard_cache
```javascript
{
  metricType: 'public_transparency' | 'user_stats',
  data: {
    activeCampaigns: number,
    totalEscrow: number,
    totalOps: number,
    totalRD: number,
    refundsIssued: number,
    refundSLAAdherence: number,
    kycPassRate: number,
    // ... other KPIs
  },
  lastUpdated: Timestamp,
  validUntil: Timestamp // Cache expiry
}
```

### 3. user_sessions
```javascript
{
  userId: string,
  sessionId: string,
  deviceInfo: string,
  ipAddress: string,
  lastActivity: Timestamp,
  expiresAt: Timestamp
}
```

---

## Database Triggers & Functions

### Auto-update `updated_at` timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... repeat for all tables
```

### Auto-calculate refund SLA deadline
```sql
CREATE OR REPLACE FUNCTION set_refund_sla_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.refund_requested_at IS NOT NULL AND NEW.refund_sla_deadline IS NULL THEN
    NEW.refund_sla_deadline := NEW.refund_requested_at + INTERVAL '21 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_escrow_refund_sla BEFORE INSERT OR UPDATE ON escrow_ledger
  FOR EACH ROW EXECUTE FUNCTION set_refund_sla_deadline();

CREATE TRIGGER set_refunds_sla BEFORE INSERT OR UPDATE ON refunds
  FOR EACH ROW EXECUTE FUNCTION set_refund_sla_deadline();
```

### Auto-calculate payout SLA deadline
```sql
CREATE OR REPLACE FUNCTION set_payout_sla_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.requested_at IS NOT NULL AND NEW.sla_deadline IS NULL THEN
    NEW.sla_deadline := NEW.requested_at + INTERVAL '15 days';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_payouts_sla BEFORE INSERT OR UPDATE ON payouts
  FOR EACH ROW EXECUTE FUNCTION set_payout_sla_deadline();
```

### Update fund pools on escrow transactions
```sql
CREATE OR REPLACE FUNCTION update_escrow_pool_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type = 'deposit' THEN
    UPDATE fund_pools 
    SET balance = balance + NEW.amount,
        total_obligations = total_obligations + NEW.amount
    WHERE pool_name = 'escrow';
  ELSIF NEW.transaction_type = 'refund' THEN
    UPDATE fund_pools 
    SET balance = balance - NEW.amount,
        total_obligations = total_obligations - NEW.amount
    WHERE pool_name = 'escrow';
  ELSIF NEW.transaction_type = 'forfeiture' OR NEW.transaction_type = 'release_to_ops' THEN
    UPDATE fund_pools 
    SET balance = balance - NEW.amount,
        total_obligations = total_obligations - NEW.amount
    WHERE pool_name = 'escrow';
    
    UPDATE fund_pools 
    SET balance = balance + NEW.amount
    WHERE pool_name = 'ops';
  END IF;
  
  -- Recalculate coverage ratio
  UPDATE fund_pools
  SET coverage_ratio = CASE 
    WHEN total_obligations > 0 THEN balance / total_obligations
    ELSE NULL
  END
  WHERE pool_name = 'escrow';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_escrow_on_transaction AFTER INSERT ON escrow_ledger
  FOR EACH ROW EXECUTE FUNCTION update_escrow_pool_balance();
```

---

## Next Steps for Implementation

1. **Create PostgreSQL database** in cloud provider (AWS RDS, Google Cloud SQL, or Supabase)
2. **Run schema migrations** using a tool like Prisma, TypeORM, or raw SQL
3. **Set up Firestore** collections with security rules
4. **Create API layer** (Node.js/TypeScript with Express or NestJS)
5. **Implement background jobs** for:
   - SLA monitoring (refunds/payouts)
   - Daily fund reconciliation
   - KYC status polling
   - Automated notifications
6. **Build dashboard queries** for public transparency and user-specific views
7. **Integrate payment gateways** (Stripe Connect for escrow segregation)
8. **Add blockchain anchoring** (optional) for audit trail transparency

---

**Database Schema Version**: 0.1.0  
**Last Updated**: November 6, 2025  
**Status**: Ready for review and implementation
