# API Specifications

## RESTful API Design

### Base URL
```
Production: https://api.caddy.team/v1
Staging: https://staging-api.caddy.team/v1
```

### Authentication
All API requests require Bearer token authentication via Clerk:
```
Authorization: Bearer <clerk_token>
```

## Core Endpoints

### Participants

```typescript
// List participants
GET /participants
Query params:
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)
  - search: string
  - active: boolean
  - planExpiring: boolean (within 60 days)

Response: {
  data: Participant[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Get single participant
GET /participants/:id
Response: Participant

// Create participant
POST /participants
Body: {
  ndisNumber: string
  firstName: string
  lastName: string
  planStartDate: string
  planEndDate: string
  planCategories: object
  totalBudget: number
}
Response: Participant

// Update participant
PATCH /participants/:id
Body: Partial<Participant>
Response: Participant

// Archive participant
POST /participants/:id/archive
Response: { success: boolean }

// Import participants CSV
POST /participants/import
Body: FormData with CSV file
Response: {
  imported: number
  failed: number
  errors: Array<{row: number, error: string}>
}
```

### Services

```typescript
// List services
GET /services
Query params:
  - participantId: string
  - userId: string
  - dateFrom: string
  - dateTo: string
  - status: ServiceStatus
  - unclaimed: boolean

// Create service
POST /services
Body: {
  participantId: string
  serviceDate: string
  startTime: string
  endTime: string
  supportCategory: string
  supportItem: string
  notes?: string
}

// Bulk create services
POST /services/bulk
Body: {
  services: Service[]
}

// Update service
PATCH /services/:id

// Delete service (soft)
DELETE /services/:id
```

### Claims

```typescript
// Generate claim preview
POST /claims/preview
Body: {
  startDate: string
  endDate: string
  participantIds?: string[]
}
Response: {
  services: Service[]
  totalAmount: number
  byCategory: Record<string, number>
}

// Create claim
POST /claims
Body: {
  startDate: string
  endDate: string
  serviceIds: string[]
}

// Export claim
GET /claims/:id/export
Query params:
  - format: 'csv' | 'pdf'
Response: File download

// Submit claim
POST /claims/:id/submit
```

### Budgets

```typescript
// Get participant budgets
GET /participants/:id/budgets
Response: {
  categories: Budget[]
  total: {
    allocated: number
    spent: number
    remaining: number
  }
  trafficLight: 'green' | 'amber' | 'red'
}

// Update budget tracking
POST /budgets/recalculate
Body: {
  participantId: string
}
```

### Messages

```typescript
// List messages
GET /messages
Query params:
  - category: MessageCategory
  - pinned: boolean
  - unread: boolean

// Create message
POST /messages
Body: {
  title: string
  content: string
  category: MessageCategory
  isPinned?: boolean
  publishAt?: string
}

// Mark as read
POST /messages/:id/read

// Get read receipts
GET /messages/:id/reads
```

### Dashboard

```typescript
// Get daily huddle data
GET /dashboard/huddle
Response: {
  todayShifts: Array<{
    participant: string
    worker: string
    time: string
    status: string
  }>
  alerts: Array<{
    type: 'budget' | 'compliance' | 'document'
    message: string
    priority: 'high' | 'medium' | 'low'
  }>
  complianceScore: number
  recentMessages: Message[]
  quickStats: {
    activeParticipants: number
    todayServices: number
    pendingClaims: number
  }
}
```

---
