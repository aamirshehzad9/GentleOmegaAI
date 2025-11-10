# GentleΩ Platform API Contract
**Version**: 0.1.0  
**Date**: November 6, 2025  
**Architecture**: RESTful API with optional GraphQL for complex queries  
**Base URL**: `https://api.gentleomegaai.space` (production)  
**Authentication**: Firebase Auth tokens (Bearer)

---

## API Design Principles

1. **RESTful conventions**: Resources, HTTP methods, status codes
2. **Idempotency**: POST operations with idempotency keys for financial transactions
3. **Rate limiting**: Per-user and per-endpoint limits
4. **Versioning**: URL-based (`/v1/...`)
5. **Audit trail**: Every state-changing operation logged to `audit_logs`
6. **SLA enforcement**: Background jobs monitor and enforce refund/payout SLAs

---

## Authentication & Authorization

### Headers Required
```http
Authorization: Bearer <firebase_id_token>
X-Request-ID: <uuid> (for idempotency)
Content-Type: application/json
```

### Role-Based Access Control (RBAC)
- `applicant`: Can browse campaigns, submit tenders, view own dashboard
- `committee_member`: Can validate deliverables, view team dashboards
- `director`: Can create campaigns, approve selections
- `admin`: Full access to all endpoints
- `validator`: Can verify tasks and deliverables

---

## API Endpoints

## 1. User Management

### GET /v1/users/me
Get current authenticated user profile.

**Authorization**: Any authenticated user  
**Response**: `200 OK`
```json
{
  "id": "uuid",
  "firebase_uid": "string",
  "email": "user@example.com",
  "display_name": "John Doe",
  "profile_photo_url": "https://...",
  "kyc_status": "soft_kyc_approved",
  "role": "applicant",
  "tier": null,
  "shares": 0,
  "is_active": true,
  "created_at": "2025-11-06T10:00:00Z",
  "last_login_at": "2025-11-06T15:30:00Z"
}
```

### PATCH /v1/users/me
Update current user profile (non-KYC fields only).

**Request Body**:
```json
{
  "display_name": "Jane Doe",
  "phone_number": "+1234567890"
}
```

**Response**: `200 OK` (updated user object)

---

### POST /v1/users/kyc/initiate
Initiate KYC verification process.

**Authorization**: Authenticated user  
**Request Body**:
```json
{
  "provider": "sumsub", // 'sumsub', 'onfido', 'stripe_identity'
  "level": "soft_kyc" // 'soft_kyc' or 'full_kyc'
}
```

**Response**: `200 OK`
```json
{
  "verification_url": "https://sumsub.com/verify/...",
  "session_token": "string",
  "expires_at": "2025-11-06T16:00:00Z"
}
```

---

### GET /v1/users/kyc/status
Check KYC verification status.

**Response**: `200 OK`
```json
{
  "kyc_status": "soft_kyc_approved",
  "kyc_provider": "sumsub",
  "soft_kyc_verified_at": "2025-11-06T11:00:00Z",
  "full_kyc_verified_at": null,
  "rejection_reason": null,
  "sanctions_check_passed": true
}
```

---

### POST /v1/users/kyc/webhook
KYC provider webhook endpoint (Sumsub, Onfido, etc.).

**Authorization**: Provider API key (not user token)  
**Request Body**: Provider-specific payload  
**Response**: `200 OK`

**Internal Logic**:
- Parse provider webhook
- Update user `kyc_status`
- Log to `audit_logs`
- Send notification to user via Firestore

---

## 2. Campaigns

### GET /v1/campaigns
List all active campaigns (public endpoint).

**Query Parameters**:
- `tier`: Filter by tier (A, B, C)
- `status`: Filter by status (open, active, completed)
- `page`: Pagination (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response**: `200 OK`
```json
{
  "campaigns": [
    {
      "id": "uuid",
      "campaign_code": "CAMP-A-2025-11-01",
      "title": "Committee Member Onboarding - Campaign 01",
      "tier": "A",
      "commitment_fee": 500,
      "currency": "USD",
      "start_date": "2025-11-01T00:00:00Z",
      "end_date": "2025-11-16T23:59:59Z",
      "selection_announcement_deadline": "2025-11-08T23:59:59Z",
      "total_seats": 10,
      "seats_filled": 3,
      "status": "open"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
```

---

### GET /v1/campaigns/:id
Get single campaign details.

**Response**: `200 OK` (campaign object with full details)

---

### POST /v1/campaigns
Create new campaign (admin/director only).

**Authorization**: `admin` or `director`  
**Request Body**:
```json
{
  "title": "Committee Member Onboarding - Campaign 02",
  "description": "15-day tender cycle for governance board selection",
  "tier": "A",
  "commitment_fee": 500,
  "start_date": "2025-11-16T00:00:00Z",
  "total_seats": 12
}
```

**Response**: `201 Created` (created campaign object)

---

### PATCH /v1/campaigns/:id
Update campaign (admin/director only).

**Request Body**: Partial campaign object  
**Response**: `200 OK` (updated campaign)

---

### POST /v1/campaigns/:id/close
Close campaign and trigger selection process.

**Authorization**: `admin` or `director`  
**Response**: `200 OK`
```json
{
  "message": "Campaign closed. Selection process initiated.",
  "campaign_id": "uuid",
  "total_applicants": 45,
  "status": "selection_in_progress"
}
```

**Internal Logic**:
- Change status to `closed`
- Trigger selection algorithm or manual review queue
- Log to `audit_logs`

---

## 3. Tenders (Applications)

### POST /v1/tenders
Submit tender application.

**Authorization**: Authenticated user with `soft_kyc_approved`  
**Request Body**:
```json
{
  "campaign_id": "uuid",
  "motivation": "I want to contribute to AI-driven governance...",
  "skills_summary": "10 years in blockchain development, smart contracts...",
  "relevant_experience": "Previously led DAO governance initiatives..."
}
```

**Response**: `201 Created`
```json
{
  "id": "uuid",
  "campaign_id": "uuid",
  "user_id": "uuid",
  "status": "submitted",
  "submitted_at": "2025-11-06T12:00:00Z",
  "next_steps": "Await deposit payment request"
}
```

**Validation**:
- User must have `soft_kyc_approved`
- Cannot apply to same campaign twice
- Campaign must be `open`

---

### GET /v1/tenders/me
Get current user's tender applications.

**Response**: `200 OK` (array of tender objects with campaign details)

---

### GET /v1/tenders/:id
Get specific tender details.

**Authorization**: Owner or admin/validator  
**Response**: `200 OK` (tender object)

---

### PATCH /v1/tenders/:id
Update tender (only if status is 'draft').

**Request Body**: Partial tender object  
**Response**: `200 OK` (updated tender)

---

### DELETE /v1/tenders/:id
Withdraw tender application.

**Authorization**: Owner  
**Response**: `200 OK`
```json
{
  "message": "Tender withdrawn successfully",
  "refund_initiated": true,
  "refund_id": "uuid"
}
```

**Internal Logic**:
- Change tender status to `withdrawn`
- If deposit was paid, initiate refund (minus admin charges per policy)
- Log to `audit_logs`

---

### POST /v1/tenders/:id/select
Mark tender as selected (admin/director only).

**Authorization**: `admin` or `director`  
**Request Body**:
```json
{
  "reviewer_notes": "Strong background in AI governance. Approved."
}
```

**Response**: `200 OK`
```json
{
  "message": "Tender selected",
  "tender_id": "uuid",
  "selection_announced_at": "2025-11-08T10:00:00Z",
  "notification_sent": true
}
```

**Internal Logic**:
- Update tender status to `selected`
- Move deposit from escrow to ops (if policy requires)
- Send notification to user
- Log to `audit_logs`

---

### POST /v1/tenders/:id/reject
Reject tender application (admin/director only).

**Request Body**:
```json
{
  "reviewer_notes": "Insufficient experience for this tier."
}
```

**Response**: `200 OK`
```json
{
  "message": "Tender rejected",
  "refund_initiated": true,
  "refund_id": "uuid",
  "refund_sla_deadline": "2025-11-27T23:59:59Z"
}
```

**Internal Logic**:
- Update tender status to `rejected`
- Initiate full refund (if deposit was paid)
- Send notification to user
- Log to `audit_logs`

---

## 4. Payments & Deposits

### POST /v1/payments/deposit
Pay commitment fee for tender application.

**Authorization**: Authenticated user  
**Request Body**:
```json
{
  "tender_id": "uuid",
  "amount": 500,
  "currency": "USD",
  "payment_method_id": "pm_stripe_id" // Stripe PaymentMethod ID
}
```

**Response**: `200 OK`
```json
{
  "payment_intent_id": "pi_stripe_id",
  "status": "succeeded",
  "escrow_transaction_id": "uuid",
  "receipt_url": "https://...",
  "next_steps": "Deposit held in escrow until campaign selection"
}
```

**Internal Logic**:
- Verify user KYC status (`soft_kyc_approved`)
- Create Stripe PaymentIntent (or other provider)
- On success, insert to `escrow_ledger` with status `held`
- Update tender status to `deposit_pending` → `under_review`
- Allocate 30% to Escrow Pool, 40% to Ops, 30% to R&D
- Log to `audit_logs`

**Idempotency**: Use `X-Request-ID` header to prevent duplicate charges

---

### GET /v1/payments/deposit/:tender_id
Get deposit status for a tender.

**Response**: `200 OK`
```json
{
  "tender_id": "uuid",
  "deposit_paid": true,
  "amount": 500,
  "currency": "USD",
  "payment_date": "2025-11-06T12:30:00Z",
  "status": "held",
  "refund_eligible": true
}
```

---

## 5. Refunds

### POST /v1/refunds/request
Request refund (voluntary withdrawal or non-selection).

**Authorization**: Authenticated user  
**Request Body**:
```json
{
  "tender_id": "uuid",
  "reason": "Personal circumstances changed, need to withdraw",
  "refund_type": "voluntary_withdrawal"
}
```

**Response**: `201 Created`
```json
{
  "refund_id": "uuid",
  "status": "requested",
  "amount": 475, // Full fee minus 5% admin charge
  "sla_deadline": "2025-11-27T23:59:59Z",
  "message": "Refund will be processed within 21 business days"
}
```

**Internal Logic**:
- Validate refund eligibility from policy
- Calculate refund amount (full/partial/admin fees)
- Insert to `refunds` table
- Queue for processing (background job)
- Send notification to user
- Log to `audit_logs`

---

### GET /v1/refunds/me
Get current user's refund requests.

**Response**: `200 OK` (array of refund objects)

---

### GET /v1/refunds/:id
Get specific refund details.

**Authorization**: Owner or admin  
**Response**: `200 OK` (refund object with timeline)

---

### POST /v1/refunds/:id/approve
Approve refund (admin only).

**Authorization**: `admin`  
**Response**: `200 OK`
```json
{
  "message": "Refund approved",
  "refund_id": "uuid",
  "status": "approved",
  "processing_initiated": true
}
```

---

### POST /v1/refunds/:id/process
Process refund payment (admin/system only).

**Authorization**: `admin`  
**Request Body**:
```json
{
  "refund_method": "stripe_refund",
  "refund_transaction_id": "re_stripe_id"
}
```

**Response**: `200 OK`
```json
{
  "message": "Refund processed successfully",
  "completed_at": "2025-11-10T14:00:00Z",
  "sla_met": true
}
```

**Internal Logic**:
- Execute refund via payment gateway
- Update refund status to `completed`
- Update escrow ledger to `released`
- Check SLA adherence
- Log to `audit_logs`

---

## 6. Tasks & Deliverables

### GET /v1/tasks/me
Get tasks assigned to current user.

**Response**: `200 OK`
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Develop AI governance framework draft",
      "description": "...",
      "status": "assigned",
      "payout_amount": 70,
      "deadline": "2025-11-20T23:59:59Z",
      "completion_percentage": 0
    }
  ]
}
```

---

### GET /v1/tasks/:id
Get specific task details.

**Response**: `200 OK` (task object with deliverables)

---

### PATCH /v1/tasks/:id
Update task progress (assignee only).

**Request Body**:
```json
{
  "completion_percentage": 50,
  "notes": "Completed initial research phase"
}
```

**Response**: `200 OK` (updated task)

---

### POST /v1/tasks/:id/deliverables
Submit deliverable for task.

**Authorization**: Task assignee  
**Request Body** (multipart/form-data):
```json
{
  "description": "Final governance framework document",
  "notes": "Incorporated feedback from committee review",
  "files": ["file1.pdf", "file2.docx"] // File uploads
}
```

**Response**: `201 Created`
```json
{
  "deliverable_id": "uuid",
  "task_id": "uuid",
  "file_urls": [
    "https://storage.gentleomegaai.space/deliverables/uuid/file1.pdf",
    "https://storage.gentleomegaai.space/deliverables/uuid/file2.docx"
  ],
  "file_hashes": [
    "sha256_hash1",
    "sha256_hash2"
  ],
  "submitted_at": "2025-11-20T10:00:00Z",
  "status": "submitted"
}
```

**Internal Logic**:
- Upload files to Firebase Storage
- Generate SHA-256 hashes for integrity
- Insert to `deliverables` table
- Update task status to `submitted`
- Notify validators
- Log to `audit_logs`

---

### POST /v1/deliverables/:id/verify
Verify submitted deliverable (validator only).

**Authorization**: `validator` or `admin`  
**Request Body**:
```json
{
  "verified": true,
  "verification_notes": "Excellent work, meets all requirements"
}
```

**Response**: `200 OK`
```json
{
  "message": "Deliverable verified",
  "deliverable_id": "uuid",
  "verified_at": "2025-11-21T09:00:00Z",
  "verification_hash": "sha256_verification_hash",
  "payout_initiated": true,
  "payout_id": "uuid"
}
```

**Internal Logic**:
- Update deliverable with verification status
- Generate verification hash for audit trail
- If verified=true, initiate payout
- Update task status to `completed`
- Send notification to user
- Log to `audit_logs`

---

## 7. Payouts

### GET /v1/payouts/me
Get current user's payout history.

**Response**: `200 OK`
```json
{
  "payouts": [
    {
      "id": "uuid",
      "task_id": "uuid",
      "amount": 70,
      "currency": "USD",
      "status": "completed",
      "payout_method": "stripe",
      "requested_at": "2025-11-21T09:00:00Z",
      "processed_at": "2025-11-22T14:00:00Z",
      "sla_met": true
    }
  ],
  "total_earnings": 140,
  "available_balance": 70,
  "minimum_withdrawal": 50
}
```

---

### POST /v1/payouts/withdraw
Request payout withdrawal (user-initiated).

**Authorization**: Authenticated user  
**Request Body**:
```json
{
  "amount": 70,
  "payout_method": "stripe", // 'stripe', 'bank_transfer', 'crypto'
  "payout_details": {
    "bank_account_id": "ba_stripe_id" // Or other provider ID
  }
}
```

**Response**: `201 Created`
```json
{
  "payout_id": "uuid",
  "status": "pending",
  "amount": 70,
  "sla_deadline": "2025-12-06T23:59:59Z",
  "message": "Payout will be processed within 15 business days"
}
```

**Validation**:
- Amount must be ≥ minimum withdrawal threshold
- User must have sufficient available balance
- KYC must be `full_kyc_approved` for payouts

---

### GET /v1/payouts/:id
Get specific payout details.

**Authorization**: Owner or admin  
**Response**: `200 OK` (payout object)

---

## 8. Dashboards & Transparency

### GET /v1/dashboard/public
Get public transparency dashboard metrics.

**Authorization**: None (public endpoint)  
**Response**: `200 OK`
```json
{
  "kpis": {
    "active_campaigns": 3,
    "total_escrow": 15000,
    "total_ops": 28000,
    "total_rd_reserve": 12000,
    "escrow_coverage_ratio": 1.15,
    "refunds_issued_count": 45,
    "refunds_issued_amount": 22500,
    "refund_sla_adherence": 98.5,
    "payout_sla_adherence": 100,
    "kyc_pass_rate": 96.2,
    "applicants_this_week": 67,
    "conversion_rate": 18.5,
    "task_completion_rate": 92.3
  },
  "last_updated": "2025-11-06T16:00:00Z"
}
```

**Caching**: Cache for 1 hour, update via background job

---

### GET /v1/dashboard/user
Get user-specific dashboard.

**Authorization**: Authenticated user  
**Response**: `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "display_name": "John Doe",
    "role": "committee_member",
    "tier": "A",
    "shares": 4
  },
  "deposits": [
    {
      "campaign": "CAMP-A-2025-11-01",
      "amount": 500,
      "status": "held",
      "date": "2025-11-06T12:30:00Z"
    }
  ],
  "tenders": [
    {
      "campaign": "CAMP-A-2025-11-01",
      "status": "selected",
      "submitted_at": "2025-11-05T10:00:00Z"
    }
  ],
  "tasks": [
    {
      "title": "Develop governance framework",
      "status": "completed",
      "payout": 70,
      "completion_date": "2025-11-20T10:00:00Z"
    }
  ],
  "earnings": {
    "total": 140,
    "available": 70,
    "pending": 0
  },
  "refunds": []
}
```

---

## 9. Audit & Compliance

### GET /v1/audit/logs
Get audit logs (admin only).

**Authorization**: `admin`  
**Query Parameters**:
- `event_type`: Filter by event type
- `actor_id`: Filter by actor
- `start_date`: Filter from date
- `end_date`: Filter to date
- `page`: Pagination
- `limit`: Items per page

**Response**: `200 OK`
```json
{
  "logs": [
    {
      "id": "uuid",
      "event_type": "deposit_received",
      "event_timestamp": "2025-11-06T12:30:00Z",
      "actor_id": "uuid",
      "subject_id": "uuid",
      "event_data": {
        "amount": 500,
        "tender_id": "uuid"
      },
      "event_hash": "sha256_hash",
      "blockchain_hash": "0x..."
    }
  ],
  "pagination": {...}
}
```

---

### GET /v1/audit/receipt/:id
Get downloadable audit receipt for specific event.

**Authorization**: Owner or admin  
**Response**: `200 OK` (PDF or JSON receipt with hash verification)

---

### POST /v1/audit/verify-hash
Verify audit trail integrity.

**Request Body**:
```json
{
  "event_id": "uuid",
  "claimed_hash": "sha256_hash"
}
```

**Response**: `200 OK`
```json
{
  "verified": true,
  "message": "Hash matches stored value",
  "blockchain_anchored": true,
  "blockchain_tx": "0x..."
}
```

---

## 10. Admin & Governance

### POST /v1/admin/campaigns/:id/announce-selection
Announce campaign selection results.

**Authorization**: `admin` or `director`  
**Response**: `200 OK`
```json
{
  "message": "Selection announced",
  "selected_count": 10,
  "rejected_count": 35,
  "refunds_initiated": 35,
  "notifications_sent": true
}
```

**Internal Logic**:
- Update all tenders with selection results
- Initiate refunds for non-selected
- Send mass notifications
- Log to `audit_logs`

---

### GET /v1/admin/sla/violations
Get SLA violations (refunds/payouts past deadline).

**Authorization**: `admin`  
**Response**: `200 OK`
```json
{
  "refund_violations": [
    {
      "refund_id": "uuid",
      "user_id": "uuid",
      "amount": 500,
      "requested_at": "2025-10-01T10:00:00Z",
      "sla_deadline": "2025-10-22T23:59:59Z",
      "days_overdue": 3
    }
  ],
  "payout_violations": []
}
```

---

### POST /v1/admin/fund-pools/reconcile
Trigger manual fund pool reconciliation.

**Authorization**: `admin`  
**Response**: `200 OK`
```json
{
  "escrow_pool": 15000,
  "ops_pool": 28000,
  "rd_reserve": 12000,
  "total": 55000,
  "escrow_coverage_ratio": 1.15,
  "reconciled_at": "2025-11-06T17:00:00Z"
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "INSUFFICIENT_KYC",
    "message": "You must complete soft KYC before submitting a tender",
    "details": {
      "required_kyc_level": "soft_kyc_approved",
      "current_kyc_status": "not_started"
    }
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Invalid or missing auth token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `INSUFFICIENT_KYC` (403): KYC not completed
- `DUPLICATE_APPLICATION` (409): Already applied to this campaign
- `CAMPAIGN_CLOSED` (400): Campaign no longer accepting applications
- `INSUFFICIENT_BALANCE` (400): Not enough funds for withdrawal
- `REFUND_NOT_ELIGIBLE` (400): Refund not allowed per policy
- `SLA_VIOLATION` (500): Internal SLA deadline exceeded
- `PAYMENT_FAILED` (402): Payment processing failed

---

## Webhooks (Outbound)

Platform can send webhooks to external systems for:

### Payment Events
- `deposit.received`
- `refund.processed`
- `payout.completed`

### Campaign Events
- `campaign.opened`
- `campaign.closed`
- `selection.announced`

### User Events
- `kyc.approved`
- `kyc.rejected`
- `task.completed`

**Webhook Payload Format**:
```json
{
  "event_type": "deposit.received",
  "timestamp": "2025-11-06T12:30:00Z",
  "data": {
    "user_id": "uuid",
    "tender_id": "uuid",
    "amount": 500,
    "currency": "USD"
  },
  "signature": "hmac_sha256_signature"
}
```

---

## Rate Limiting

### Per User Limits
- **General endpoints**: 100 requests/minute
- **Payment endpoints**: 10 requests/minute
- **Admin endpoints**: 500 requests/minute

### Response Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699283400
```

### Exceeded Limit Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please retry after 60 seconds.",
    "retry_after": 60
  }
}
```

---

## Next Steps for Implementation

1. **Set up Express/NestJS backend** with TypeScript
2. **Implement middleware**: Auth (Firebase), RBAC, rate limiting, logging
3. **Create controllers** for each resource (users, campaigns, tenders, etc.)
4. **Integrate PostgreSQL** using Prisma or TypeORM
5. **Integrate Stripe Connect** for payment processing
6. **Set up background jobs** (Bull/BullMQ) for SLA monitoring
7. **Implement webhook handlers** for KYC providers and payment gateways
8. **Add API documentation** (Swagger/OpenAPI)
9. **Write integration tests** for critical flows (deposit → escrow → refund)
10. **Deploy to production** with proper monitoring (Sentry, DataDog)

---

**API Contract Version**: 0.1.0  
**Last Updated**: November 6, 2025  
**Status**: Ready for backend implementation
