# Epic 3: Participant Management
**Goal:** Complete participant management with CSV import  
**Duration:** Week 3  
**Dependencies:** Epic 2  

## Story 3.1: Participant List Interface
**As a** Support Coordinator  
**I want to** view and search all participants  
**So that** I can quickly find who I need  

**Acceptance Criteria:**
- Participant list with TanStack Table
- Real-time search working
- Virtual scrolling for performance
- Filter and sort options
- Responsive on mobile

**Technical Tasks:**
- Create `/participants` route
- Implement TanStack Table
- Add TanStack Virtual
- Create search/filter UI
- Implement real-time updates

## Story 3.2: Participant CRUD Operations
**As a** Support Coordinator  
**I want to** create and edit participant profiles  
**So that** I can maintain accurate records  

**Acceptance Criteria:**
- Create participant form with validation
- Edit with inline updates
- NDIS number validation
- Duplicate detection
- Activity timeline visible

**Technical Tasks:**
- Create participant form with TanStack Form
- Implement NDIS validation
- Add duplicate checking
- Create activity tracking
- Test optimistic updates

## Story 3.3: CSV Import System
**As an** Organization Admin  
**I want to** import participants from CSV  
**So that** I can quickly onboard many participants  

**Acceptance Criteria:**
- CSV file upload working
- Field mapping interface
- Validation with error reporting
- Progress indicator
- Import history tracked

**Technical Tasks:**
- Create CSV parser
- Build mapping interface
- Implement validation rules
- Add progress tracking
- Store import history

---
