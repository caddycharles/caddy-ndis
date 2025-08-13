# Epic 2: Real-time Data Foundation
**Goal:** Establish core entities with real-time synchronization  
**Duration:** Week 2  
**Dependencies:** Epic 1  

## Story 2.1: Convex Schema Definition
**As a** Developer  
**I want to** define the data schema in Convex  
**So that** we have type-safe database operations  

**Acceptance Criteria:**
- Organizations table defined with validation
- Users table with Clerk integration
- Participants table with NDIS validation
- Audit log schema created
- File storage schema defined

**Technical Tasks:**
- Create `convex/schema.ts` with tables
- Define validation rules with Convex validators
- Set up indexes for queries
- Create type exports
- Implement audit log helpers

## Story 2.2: Real-time CRUD Operations
**As a** User  
**I want to** see data updates instantly  
**So that** I'm always working with current information  

**Acceptance Criteria:**
- Real-time subscriptions working
- Optimistic updates implemented
- CRUD mutations created
- Role-based filtering active
- Pagination implemented

**Technical Tasks:**
- Create query functions with subscriptions
- Implement mutations with optimistic updates
- Add role-based query filters
- Create pagination helpers
- Test multi-client sync

## Story 2.3: File Storage Setup
**As a** User  
**I want to** upload and manage documents  
**So that** I can store participant records  

**Acceptance Criteria:**
- File upload working
- CDN URLs generated
- Access control implemented
- File metadata stored
- Download functionality working

**Technical Tasks:**
- Configure Convex file storage
- Create upload mutation
- Implement access control
- Generate secure URLs
- Test file operations

---
