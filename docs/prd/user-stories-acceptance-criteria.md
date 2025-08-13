# User Stories & Acceptance Criteria

## Epic 1: Participant Onboarding

### User Story 1.1: CSV Import
**As an** Organization Admin  
**I want to** import participants from a CSV file  
**So that** I can quickly onboard multiple participants without manual entry

**Acceptance Criteria:**
- Support Xero contact CSV format
- Map fields to participant profile
- Validate NDIS numbers
- Show import progress
- Report errors with line numbers
- Allow partial imports
- Support up to 1000 records

### User Story 1.2: Manual Participant Creation
**As a** Support Coordinator  
**I want to** manually create participant profiles  
**So that** I can add new participants immediately

**Acceptance Criteria:**
- Required fields: Name, NDIS number, plan dates
- Optional fields: Contact, address, notes
- NDIS number validation
- Duplicate detection
- Save as draft option
- Confirmation on creation

## Epic 2: Service Delivery

### User Story 2.1: Quick Shift Logging
**As a** Support Worker  
**I want to** log my shift in under 3 minutes  
**So that** I can focus on participant care

**Acceptance Criteria:**
- Pre-filled defaults from previous shifts
- One-click "same as yesterday"
- Auto-calculate duration
- Template notes selection
- Mobile responsive
- Offline queue capability

### User Story 2.2: Budget Visibility
**As a** Support Coordinator  
**I want to** see budget status at a glance  
**So that** I can prevent overspending

**Acceptance Criteria:**
- Traffic light indicators
- Real-time updates
- Category breakdown
- Remaining amounts
- Days until plan end
- Export functionality

## Epic 3: Financial Management

### User Story 3.1: Claims Processing
**As a** Finance Officer  
**I want to** generate claims with confidence  
**So that** we don't miss revenue

**Acceptance Criteria:**
- Select date range
- Preview claim value
- Validation checks
- NDIS format export
- Claim history
- Resubmission capability

### User Story 3.2: Revenue Prediction
**As an** Organization Admin  
**I want to** see predicted claim values  
**So that** I can manage cash flow

**Acceptance Criteria:**
- Running total as services logged
- "Unclaimed value" alerts
- Monthly projections
- Category breakdown
- Export to Excel

## Epic 4: Team Communication

### User Story 4.1: Team Announcements
**As an** Organization Admin  
**I want to** post messages to all staff  
**So that** everyone stays informed

**Acceptance Criteria:**
- Rich text editor
- Category tags
- Pin important messages
- Schedule posts
- Read receipt tracking
- Search functionality

### User Story 4.2: Message Acknowledgment
**As a** Support Worker  
**I want to** confirm I've read important messages  
**So that** management knows I'm informed

**Acceptance Criteria:**
- One-click acknowledgment
- Unread indicator
- Push notifications (optional)
- Message history
- Filter by category

---
