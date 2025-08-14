# Refined Convex Schema Proposal for NDIS Application

## Executive Summary
This document addresses the critical schema design questions and proposes a normalized, NDIS-compliant database structure.

## Key Design Decisions

### 1. Address Management
**Decision: YES - Normalize addresses into separate table**

```typescript
addresses: defineTable({
  organizationId: v.id("organizations"),
  entityType: v.union(
    v.literal("participant"),
    v.literal("user"),
    v.literal("service_location"),
    v.literal("organization")
  ),
  entityId: v.string(), // ID of the related entity
  addressType: v.union(
    v.literal("home"),
    v.literal("postal"),
    v.literal("service"),
    v.literal("billing")
  ),
  isPrimary: v.boolean(),
  
  // Address fields
  unit: v.optional(v.string()),
  streetNumber: v.string(),
  streetName: v.string(),
  suburb: v.string(),
  state: v.union(
    v.literal("NSW"),
    v.literal("VIC"),
    v.literal("QLD"),
    v.literal("WA"),
    v.literal("SA"),
    v.literal("TAS"),
    v.literal("ACT"),
    v.literal("NT")
  ),
  postcode: v.string(),
  
  // Optional fields
  instructions: v.optional(v.string()), // Access instructions
  coordinates: v.optional(v.object({
    lat: v.number(),
    lng: v.number(),
  })),
  
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_entity", ["entityType", "entityId"])
  .index("by_org", ["organizationId"])
```

**Rationale:**
- Services can be delivered at different locations
- Participants may have multiple addresses (home, postal)
- Normalized structure allows easy updates
- Can track service delivery locations for compliance

### 2. Emergency Contacts
**Decision: Separate normalized table for all emergency contacts**

```typescript
emergencyContacts: defineTable({
  organizationId: v.id("organizations"),
  entityType: v.union(v.literal("participant"), v.literal("user")),
  entityId: v.string(),
  
  // Contact details
  firstName: v.string(),
  lastName: v.string(),
  relationship: v.string(), // "Mother", "Doctor", "Guardian"
  
  // Contact methods
  phone: v.string(),
  alternatePhone: v.optional(v.string()),
  email: v.optional(v.string()),
  
  // Priority and type
  priority: v.number(), // 1 = primary, 2 = secondary, etc.
  contactType: v.union(
    v.literal("family"),
    v.literal("medical"),
    v.literal("legal_guardian"),
    v.literal("advocate"),
    v.literal("other")
  ),
  
  // Special instructions
  notes: v.optional(v.string()), // "Call between 9am-5pm only"
  canMakeDecisions: v.boolean(), // Legal authority
  
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_entity", ["entityType", "entityId"])
  .index("by_org_priority", ["organizationId", "priority"])
```

### 3. Participant-Worker Relationships
**Decision: Junction table with role and period tracking**

```typescript
participantAssignments: defineTable({
  organizationId: v.id("organizations"),
  participantId: v.id("participants"),
  userId: v.id("users"), // The support worker/coordinator
  
  // Assignment details
  role: v.union(
    v.literal("primary_coordinator"),
    v.literal("support_coordinator"),
    v.literal("support_worker"),
    v.literal("backup_worker"),
    v.literal("specialist") // OT, physio, etc.
  ),
  
  // Period tracking
  startDate: v.string(),
  endDate: v.optional(v.string()),
  isActive: v.boolean(),
  
  // Scheduling preferences
  availability: v.optional(v.object({
    preferredDays: v.array(v.string()), // ["Monday", "Wednesday"]
    preferredTimes: v.array(v.string()), // ["morning", "afternoon"]
    maxHoursPerWeek: v.optional(v.number()),
  })),
  
  // Notes about this specific relationship
  notes: v.optional(v.string()),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_participant", ["participantId", "isActive"])
  .index("by_user", ["userId", "isActive"])
  .index("by_org_active", ["organizationId", "isActive"])
```

### 4. Notes Management System
**Decision: Unified notes table with type and access control**

```typescript
notes: defineTable({
  organizationId: v.id("organizations"),
  
  // What this note is about
  entityType: v.union(
    v.literal("participant"),
    v.literal("service"),
    v.literal("incident")
  ),
  entityId: v.string(),
  
  // Note classification
  noteType: v.union(
    v.literal("shift_note"),      // Daily service notes
    v.literal("coordination"),    // Support coordination notes
    v.literal("general"),         // General participant info
    v.literal("medical"),         // Medical/health notes
    v.literal("behavioral"),      // Behavioral observations
    v.literal("goal_progress"),   // Progress toward NDIS goals
    v.literal("incident"),        // Incident reports
    v.literal("handover")        // Shift handover notes
  ),
  
  // Content
  subject: v.string(),
  content: v.string(),
  
  // Access control
  visibility: v.union(
    v.literal("all_staff"),      // All employees can see
    v.literal("coordinators"),   // Only coordinators and above
    v.literal("management"),     // Management only
    v.literal("assigned_only")   // Only assigned workers
  ),
  
  // Metadata
  authorId: v.id("users"),
  isImportant: v.boolean(),     // Flag for critical notes
  requiresAction: v.boolean(),  // Needs follow-up
  actionCompletedAt: v.optional(v.number()),
  
  // For shift notes specifically
  shiftDetails: v.optional(v.object({
    serviceId: v.optional(v.id("services")),
    startTime: v.string(),
    endTime: v.string(),
    activitiesCompleted: v.array(v.string()),
    moodObservation: v.optional(v.string()),
    medicationGiven: v.boolean(),
  })),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_entity", ["entityType", "entityId", "createdAt"])
  .index("by_participant_type", ["entityId", "noteType"])
  .index("by_author", ["authorId"])
  .index("by_important", ["organizationId", "isImportant"])
```

### 5. Message Board / Announcements
**Decision: Simple announcements table for org-wide messages**

```typescript
announcements: defineTable({
  organizationId: v.id("organizations"),
  
  // Message details
  title: v.string(),
  content: v.string(),
  
  // Categorization
  category: v.union(
    v.literal("general"),
    v.literal("urgent"),
    v.literal("policy"),
    v.literal("training"),
    v.literal("roster"),
    v.literal("compliance")
  ),
  
  // Targeting (optional)
  targetRoles: v.optional(v.array(v.string())), // null = all roles
  
  // Metadata
  authorId: v.id("users"),
  isPinned: v.boolean(),        // Stays at top
  expiresAt: v.optional(v.number()), // Auto-hide after date
  
  // Tracking
  viewedBy: v.array(v.id("users")), // Track who has seen it
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_org_active", ["organizationId", "isPinned", "createdAt"])
  .index("by_category", ["organizationId", "category"])
  .index("by_expiry", ["expiresAt"])
```

### 6. Incident Reporting System
**Decision: Comprehensive incident tracking for compliance and safety**

```typescript
incidents: defineTable({
  organizationId: v.id("organizations"),
  
  // Incident identification
  incidentNumber: v.string(), // Auto-generated: INC-2024-001
  
  // Type and severity
  incidentType: v.union(
    v.literal("participant_injury"),
    v.literal("participant_behavioral"),
    v.literal("medication_error"),
    v.literal("property_damage"),
    v.literal("staff_injury"),
    v.literal("near_miss"),
    v.literal("complaint"),
    v.literal("abuse_neglect"), // Mandatory reporting
    v.literal("privacy_breach"),
    v.literal("other")
  ),
  
  severity: v.union(
    v.literal("minor"),      // No medical treatment needed
    v.literal("moderate"),   // First aid or GP visit
    v.literal("major"),      // Hospital/emergency treatment
    v.literal("critical")    // Life threatening or death
  ),
  
  // When and where
  incidentDate: v.string(),
  incidentTime: v.string(),
  locationDescription: v.string(),
  addressId: v.optional(v.id("addresses")),
  
  // People involved
  reportedBy: v.id("users"),
  involvedParticipants: v.array(v.id("participants")),
  involvedStaff: v.array(v.id("users")),
  witnesses: v.array(v.object({
    name: v.string(),
    contactNumber: v.string(),
    isStaff: v.boolean(),
    statement: v.optional(v.string()),
  })),
  
  // Description
  description: v.string(),        // What happened
  immediateAction: v.string(),    // What was done immediately
  
  // Injuries/damages
  injuries: v.optional(v.array(v.object({
    personId: v.string(),
    personType: v.union(v.literal("participant"), v.literal("staff")),
    injuryDescription: v.string(),
    bodyPart: v.string(),
    treatmentProvided: v.string(),
    medicalAttentionRequired: v.boolean(),
  }))),
  
  propertyDamage: v.optional(v.object({
    itemDescription: v.string(),
    estimatedCost: v.number(),
    photos: v.array(v.id("_storage")),
  })),
  
  // Root cause analysis
  contributingFactors: v.array(v.string()),
  rootCause: v.optional(v.string()),
  
  // Follow up actions
  correctiveActions: v.array(v.object({
    action: v.string(),
    responsiblePerson: v.id("users"),
    dueDate: v.string(),
    completedDate: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("overdue")
    ),
  })),
  
  // External reporting
  notificationRequired: v.object({
    ndis: v.boolean(),           // NDIS Quality & Safeguards Commission
    worksafe: v.boolean(),        // WorkSafe/WorkCover
    police: v.boolean(),
    health: v.boolean(),          // Health Department
    childProtection: v.boolean(), // If involves a minor
  }),
  
  externalReferences: v.optional(v.object({
    ndisReference: v.optional(v.string()),
    policeReportNumber: v.optional(v.string()),
    worksafeClaimNumber: v.optional(v.string()),
  })),
  
  // Investigation
  investigationRequired: v.boolean(),
  investigatedBy: v.optional(v.id("users")),
  investigationDate: v.optional(v.string()),
  investigationFindings: v.optional(v.string()),
  
  // Status tracking
  status: v.union(
    v.literal("draft"),
    v.literal("submitted"),
    v.literal("under_investigation"),
    v.literal("awaiting_external"),  // Waiting for external body
    v.literal("closed"),
    v.literal("reopened")
  ),
  
  // Review and approval
  reviewedBy: v.optional(v.id("users")),
  reviewedAt: v.optional(v.number()),
  approvedBy: v.optional(v.id("users")),
  approvedAt: v.optional(v.number()),
  
  // Attachments
  attachments: v.array(v.id("_storage")), // Photos, documents
  
  // Prevention
  preventativeMeasures: v.optional(v.string()),
  policyChangesRequired: v.boolean(),
  trainingRequired: v.boolean(),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_org_date", ["organizationId", "incidentDate"])
  .index("by_severity", ["organizationId", "severity"])
  .index("by_status", ["organizationId", "status"])
  .index("by_participant", ["involvedParticipants"])
  .index("by_external", ["notificationRequired.ndis"])
```

### 7. Leave Management System
**Decision: Complete leave request and approval workflow**

```typescript
leaveRequests: defineTable({
  organizationId: v.id("organizations"),
  userId: v.id("users"), // Employee requesting leave
  
  // Leave details
  leaveType: v.union(
    v.literal("annual"),          // Paid vacation
    v.literal("sick"),            // Sick leave
    v.literal("personal"),        // Personal/carer's leave
    v.literal("compassionate"),   // Bereavement
    v.literal("long_service"),    
    v.literal("maternity"),
    v.literal("paternity"),
    v.literal("unpaid"),
    v.literal("study"),
    v.literal("jury_duty"),
    v.literal("other")
  ),
  
  // Dates
  startDate: v.string(),
  endDate: v.string(),
  totalDays: v.number(),        // Calculated, excluding weekends
  
  // Partial days
  isPartialDay: v.boolean(),
  partialDayDetails: v.optional(v.object({
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    hours: v.number(),
  })),
  
  // Reason and documentation
  reason: v.string(),
  medicalCertificate: v.optional(v.id("_storage")),
  supportingDocuments: v.array(v.id("_storage")),
  
  // Coverage arrangements
  requiresCoverage: v.boolean(),
  coverageArrangements: v.optional(v.object({
    suggestedCover: v.optional(v.id("users")),
    assignedParticipants: v.array(v.id("participants")),
    handoverNotes: v.optional(v.string()),
    criticalTasks: v.array(v.string()),
  })),
  
  // Approval workflow
  status: v.union(
    v.literal("draft"),
    v.literal("pending"),         // Submitted, awaiting approval
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("cancelled"),       // Cancelled by employee
    v.literal("withdrawn")        // Withdrawn before approval
  ),
  
  // Approval chain
  approvalLevel: v.union(
    v.literal("coordinator"),    // First level
    v.literal("manager"),        // Second level
    v.literal("admin")           // Final level
  ),
  
  approvedBy: v.optional(v.id("users")),
  approvedAt: v.optional(v.number()),
  approvalComments: v.optional(v.string()),
  
  rejectedBy: v.optional(v.id("users")),
  rejectedAt: v.optional(v.number()),
  rejectionReason: v.optional(v.string()),
  
  // Emergency leave flag
  isEmergency: v.boolean(),      // Submitted after leave started
  emergencyContactNumber: v.optional(v.string()),
  
  // Impact assessment
  impactOnServices: v.optional(v.object({
    affectedShifts: v.number(),
    affectedParticipants: v.array(v.id("participants")),
    reschedulingRequired: v.boolean(),
  })),
  
  // Notifications
  notifiedStaff: v.array(v.id("users")), // Who needs to know
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId", "status"])
  .index("by_org_status", ["organizationId", "status"])
  .index("by_dates", ["startDate", "endDate"])
  .index("by_pending", ["organizationId", "status", "startDate"])
```

### 8. Leave Balances (New)
**Decision: Track leave entitlements and balances**

```typescript
leaveBalances: defineTable({
  organizationId: v.id("organizations"),
  userId: v.id("users"),
  
  // Leave year
  yearStart: v.string(),
  yearEnd: v.string(),
  
  // Balances by type (in days)
  balances: v.object({
    annual: v.object({
      entitled: v.number(),      // Yearly entitlement
      accrued: v.number(),       // Accrued to date
      taken: v.number(),         // Used this year
      pending: v.number(),       // Pending approval
      available: v.number(),     // Available to use
      carriedOver: v.number(),   // From previous year
    }),
    sick: v.object({
      entitled: v.number(),
      taken: v.number(),
      pending: v.number(),
      available: v.number(),
    }),
    personal: v.object({
      entitled: v.number(),
      taken: v.number(),
      pending: v.number(),
      available: v.number(),
    }),
    longService: v.object({
      accrued: v.number(),       // Based on years of service
      taken: v.number(),
      available: v.number(),
    }),
  }),
  
  // Accrual rules
  accrualRate: v.number(),       // Days per month
  probationComplete: v.boolean(),
  
  // Adjustments
  adjustments: v.array(v.object({
    date: v.string(),
    leaveType: v.string(),
    amount: v.number(),          // Positive or negative
    reason: v.string(),
    approvedBy: v.id("users"),
  })),
  
  // Forecast
  projectedYearEndBalance: v.number(),
  
  lastCalculated: v.number(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_org", ["organizationId"])
```

## Updated Core Tables

### Enhanced Participants Table
```typescript
participants: defineTable({
  organizationId: v.id("organizations"),
  
  // NDIS Identification
  ndisNumber: v.string(),
  crnNumber: v.optional(v.string()), // Client Reference Number
  
  // Basic Information
  firstName: v.string(),
  lastName: v.string(),
  preferredName: v.optional(v.string()),
  dateOfBirth: v.string(),
  gender: v.optional(v.union(
    v.literal("male"),
    v.literal("female"),
    v.literal("other"),
    v.literal("prefer_not_to_say")
  )),
  
  // Contact
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  preferredContactMethod: v.optional(v.union(
    v.literal("phone"),
    v.literal("email"),
    v.literal("sms"),
    v.literal("guardian")
  )),
  
  // Disability & Support Needs
  primaryDisability: v.optional(v.string()),
  disabilityType: v.optional(v.array(v.string())), // Multiple disabilities
  communicationNeeds: v.optional(v.string()),
  mobilityNeeds: v.optional(v.string()),
  
  // Cultural & Language
  culturalBackground: v.optional(v.string()),
  primaryLanguage: v.optional(v.string()),
  interpreterRequired: v.boolean(),
  
  // Status
  status: v.union(
    v.literal("active"),
    v.literal("inactive"),
    v.literal("pending"),
    v.literal("archived")
  ),
  
  // Important flags
  hasGuardian: v.boolean(),
  requiresTwoPersonAssist: v.boolean(),
  hasRestrictiveOrders: v.boolean(),
  
  // Photo
  avatarId: v.optional(v.id("_storage")),
  
  tags: v.array(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_org", ["organizationId"])
  .index("by_ndis", ["ndisNumber"])
  .index("by_org_status", ["organizationId", "status"])
  .searchIndex("search_participants", {
    searchField: "firstName",
    filterFields: ["organizationId", "status"],
  })
```

### NDIS Plans Table (New)
```typescript
ndisPlans: defineTable({
  organizationId: v.id("organizations"),
  participantId: v.id("participants"),
  
  // Plan details
  planNumber: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  reviewDate: v.optional(v.string()),
  
  // Plan management
  planManagementType: v.union(
    v.literal("self_managed"),
    v.literal("plan_managed"),
    v.literal("ndia_managed"),
    v.literal("combination")
  ),
  planManagerName: v.optional(v.string()),
  planManagerEmail: v.optional(v.string()),
  
  // Support Coordination
  hasSupportCoordination: v.boolean(),
  supportCoordinationLevel: v.optional(v.union(
    v.literal("support_connection"),
    v.literal("coordination_of_supports"),
    v.literal("specialist_support_coordination")
  )),
  
  // Goals (simplified for MVP)
  goals: v.array(v.object({
    category: v.string(),
    description: v.string(),
    targetDate: v.optional(v.string()),
  })),
  
  // Status
  isCurrentPlan: v.boolean(),
  status: v.union(
    v.literal("active"),
    v.literal("expiring_soon"), // Within 90 days
    v.literal("expired"),
    v.literal("under_review")
  ),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_participant", ["participantId", "isCurrentPlan"])
  .index("by_org_status", ["organizationId", "status"])
  .index("by_expiry", ["endDate"])
```

### NDIS Budgets Table (Enhanced)
```typescript
ndisBudgets: defineTable({
  organizationId: v.id("organizations"),
  planId: v.id("ndisPlans"),
  participantId: v.id("participants"),
  
  // NDIS Support Categories
  supportCategory: v.union(
    // Core
    v.literal("core_daily_activities"),
    v.literal("core_social_community"),
    v.literal("core_consumables"),
    v.literal("core_transport"),
    
    // Capacity Building
    v.literal("cb_daily_activity"),
    v.literal("cb_social_community"),
    v.literal("cb_relationships"),
    v.literal("cb_health_wellbeing"),
    v.literal("cb_learning"),
    v.literal("cb_employment"),
    v.literal("cb_coordination"),
    
    // Capital
    v.literal("capital_assistive_technology"),
    v.literal("capital_home_modifications")
  ),
  
  // Budget details
  itemNumber: v.optional(v.string()), // NDIS support item number
  itemName: v.string(),
  
  // Amounts (stored in cents to avoid float issues)
  allocatedAmount: v.number(),
  spentAmount: v.number(),
  committedAmount: v.number(), // Future scheduled services
  remainingAmount: v.number(),
  
  // Utilization
  utilizationPercentage: v.number(),
  projectedUtilization: v.number(), // Based on current spending rate
  
  // Period
  startDate: v.string(),
  endDate: v.string(),
  
  // Alerts
  alertThreshold: v.number(), // e.g., 80 for 80%
  isOverBudget: v.boolean(),
  alertSentAt: v.optional(v.number()),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_plan", ["planId"])
  .index("by_participant", ["participantId"])
  .index("by_category", ["supportCategory"])
  .index("by_alerts", ["organizationId", "isOverBudget"])
```

### Enhanced Users Table
```typescript
users: defineTable({
  clerkId: v.string(),
  organizationId: v.id("organizations"),
  
  // Role and permissions
  role: v.union(
    v.literal("admin"),
    v.literal("coordinator"),
    v.literal("support_worker"),
    v.literal("finance"),
    v.literal("viewer")
  ),
  permissions: v.array(v.string()),
  
  // Profile
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  avatarId: v.optional(v.id("_storage")),
  
  // Employment details
  employeeId: v.optional(v.string()),
  position: v.optional(v.string()),
  department: v.optional(v.string()),
  startDate: v.optional(v.string()),
  
  // Qualifications & Clearances (important for NDIS)
  hasWWCC: v.boolean(), // Working With Children Check
  wwccNumber: v.optional(v.string()),
  wwccExpiry: v.optional(v.string()),
  hasPoliceCheck: v.boolean(),
  policeCheckExpiry: v.optional(v.string()),
  hasFirstAid: v.boolean(),
  firstAidExpiry: v.optional(v.string()),
  qualifications: v.array(v.string()), // ["Cert IV Disability", "Medication Training"]
  
  // Availability
  availability: v.optional(v.object({
    monday: v.boolean(),
    tuesday: v.boolean(),
    wednesday: v.boolean(),
    thursday: v.boolean(),
    friday: v.boolean(),
    saturday: v.boolean(),
    sunday: v.boolean(),
    overnight: v.boolean(),
  })),
  
  // Status
  isActive: v.boolean(),
  lastActive: v.number(),
  
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_clerk", ["clerkId"])
  .index("by_org", ["organizationId"])
  .index("by_org_role", ["organizationId", "role"])
  .index("by_clearances", ["wwccExpiry", "policeCheckExpiry"])
```

## Data Integrity Rules

1. **Participant Plans**: Only one active plan per participant
2. **Budget Tracking**: Sum of category budgets must equal plan total
3. **Worker Assignments**: Check qualifications before assignment
4. **Emergency Contacts**: At least one per participant
5. **Address Management**: At least one primary address per participant
6. **Notes Access**: Enforce visibility rules based on user role

## Migration Considerations

1. **Import existing data**: Build CSV import for participants
2. **Address parsing**: Tool to split existing address strings
3. **Historical data**: Keep audit trail of all changes
4. **Data validation**: Validate NDIS numbers, ABNs, dates
5. **Deduplication**: Check for existing participants by NDIS number

## Privacy & Compliance

1. **PII Protection**: Encrypt sensitive fields
2. **Audit logging**: Track all data access and changes
3. **Data retention**: Follow NDIS 7-year retention policy
4. **Access control**: Role-based access to participant data
5. **Consent tracking**: Record consent for data sharing

## Performance Optimizations

1. **Indexes**: On all foreign keys and common queries
2. **Denormalization**: Consider read-only views for reports
3. **Pagination**: Limit query results, use cursor-based pagination
4. **Caching**: Cache frequently accessed reference data
5. **Archives**: Move inactive participants to archive table

## Next Steps

1. Review and approve schema design
2. Create migration scripts for existing data
3. Build data validation functions
4. Implement access control rules
5. Create backup and recovery procedures