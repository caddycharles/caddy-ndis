import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ============================================
// CADDY - NDIS Support Coordination Platform
// Database Schema Definition
// ============================================
// This schema defines all tables for the Caddy platform,
// organized by feature area for maintainability.
//
// Total Tables: 21 (across stories 2.1a-2.1d)
// - Core Entities: 6 tables (Story 2.1a)
// - NDIS-Specific: 4 tables (Story 2.1b)
// - Operational: 8 tables (Story 2.1c)
// - Compliance: 3 tables (Story 2.1d)
//
// Automatic Fields (added by Convex):
// - _id: v.id() - Unique document identifier
// - _creationTime: number - Unix timestamp of creation
// ============================================

// ============================================
// STORY 2.1a: Core Entities & Relationships
// ============================================

const schema = defineSchema({
  // Organizations - Core tenant/organization management
  organizations: defineTable({
    // Basic Information
    name: v.string(),
    abn: v.optional(v.string()), // Australian Business Number

    // Subscription & Settings
    subscriptionPlan: v.union(
      v.literal("trial"),
      v.literal("starter"),
      v.literal("professional"),
      v.literal("enterprise")
    ),
    subscriptionStatus: v.union(
      v.literal("active"),
      v.literal("suspended"),
      v.literal("cancelled")
    ),
    subscriptionValidUntil: v.string(), // ISO date string

    // Configuration
    timezone: v.string(), // e.g., "Australia/Sydney"
    currency: v.string(), // e.g., "AUD"

    // Settings
    settings: v.object({
      requireTwoFactorAuth: v.optional(v.boolean()),
      sessionTimeout: v.optional(v.number()), // minutes
      allowedEmailDomains: v.optional(v.array(v.string())),
    }),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  }).index("by_created", ["createdAt"]),

  // Users - Staff members with Clerk authentication
  users: defineTable({
    // Clerk Integration
    clerkId: v.string(), // Clerk user ID for authentication
    organizationId: v.id("organizations"),

    // Profile Information
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),

    // Role & Permissions
    role: v.union(
      v.literal("admin"),
      v.literal("coordinator"),
      v.literal("support_worker"),
      v.literal("finance"),
      v.literal("viewer")
    ),

    // Qualifications & Clearances
    qualifications: v.object({
      workingWithChildrenCheck: v.optional(
        v.object({
          number: v.string(),
          expiryDate: v.string(), // ISO date
          verified: v.boolean(),
        })
      ),
      policeCheck: v.optional(
        v.object({
          date: v.string(), // ISO date
          expiryDate: v.string(), // ISO date
          verified: v.boolean(),
        })
      ),
      firstAidCertificate: v.optional(
        v.object({
          type: v.string(), // e.g., "CPR", "First Aid Level 2"
          expiryDate: v.string(), // ISO date
          verified: v.boolean(),
        })
      ),
      ndisWorkerScreening: v.optional(
        v.object({
          number: v.string(),
          expiryDate: v.string(), // ISO date
          verified: v.boolean(),
        })
      ),
      driverLicense: v.optional(
        v.object({
          number: v.string(),
          class: v.string(),
          expiryDate: v.string(), // ISO date
          verified: v.boolean(),
        })
      ),
    }),

    // Availability Preferences
    availabilityPreferences: v.object({
      maxHoursPerWeek: v.optional(v.number()),
      maxConsecutiveDays: v.optional(v.number()),
      preferredShiftTypes: v.optional(v.array(v.string())), // ["morning", "afternoon", "overnight"]
      travelRadius: v.optional(v.number()), // kilometers
      unavailableWeekdays: v.optional(v.array(v.number())), // 0=Sunday, 6=Saturday
    }),

    // Status
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("on_leave"),
      v.literal("terminated")
    ),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
    lastLoginAt: v.optional(v.string()), // ISO date string
  })
    .index("by_clerk", ["clerkId"])
    .index("by_org", ["organizationId"])
    .index("by_org_role", ["organizationId", "role"]),

  // Participants - NDIS participants receiving support
  participants: defineTable({
    organizationId: v.id("organizations"),

    // NDIS Information
    ndisNumber: v.string(), // 9-10 digit NDIS number

    // Personal Information
    firstName: v.string(),
    lastName: v.string(),
    preferredName: v.optional(v.string()),
    dateOfBirth: v.string(), // ISO date string
    gender: v.optional(
      v.union(
        v.literal("male"),
        v.literal("female"),
        v.literal("other"),
        v.literal("prefer_not_to_say")
      )
    ),

    // Contact Information
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    mobile: v.optional(v.string()),
    preferredContactMethod: v.optional(
      v.union(
        v.literal("email"),
        v.literal("phone"),
        v.literal("mobile"),
        v.literal("mail"),
        v.literal("in_person")
      )
    ),

    // Disability & Support Needs
    primaryDisability: v.optional(v.string()),
    secondaryDisabilities: v.optional(v.array(v.string())),
    supportNeeds: v.optional(
      v.object({
        mobility: v.optional(v.string()),
        communication: v.optional(v.string()),
        personalCare: v.optional(v.string()),
        behavioral: v.optional(v.string()),
        medical: v.optional(v.string()),
      })
    ),

    // Cultural & Language
    culturalBackground: v.optional(v.string()),
    primaryLanguage: v.optional(v.string()),
    interpreterRequired: v.boolean(),
    culturalConsiderations: v.optional(v.string()),

    // Important Flags
    hasGuardian: v.boolean(),
    guardianName: v.optional(v.string()),
    guardianRelationship: v.optional(v.string()),
    guardianPhone: v.optional(v.string()),
    requiresTwoPersonAssist: v.boolean(),
    hasRestrictiveOrder: v.boolean(),
    restrictiveOrderDetails: v.optional(v.string()),

    // Preferences & Notes
    preferences: v.optional(
      v.object({
        preferredWorkerGender: v.optional(v.string()),
        dietaryRequirements: v.optional(v.string()),
        interests: v.optional(v.array(v.string())),
        goals: v.optional(v.array(v.string())),
      })
    ),

    // Medical Information
    medicalConditions: v.optional(v.array(v.string())),
    medications: v.optional(
      v.array(
        v.object({
          name: v.string(),
          dosage: v.string(),
          frequency: v.string(),
          prescribedBy: v.optional(v.string()),
        })
      )
    ),
    allergies: v.optional(v.array(v.string())),

    // Status
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending"),
      v.literal("archived")
    ),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_org", ["organizationId"])
    .index("by_ndis", ["ndisNumber"])
    .index("by_org_status", ["organizationId", "status"])
    .searchIndex("search_participants", {
      searchField: "firstName",
      filterFields: ["organizationId", "status"],
    }),

  // Addresses - Normalized addresses for all entities
  addresses: defineTable({
    organizationId: v.id("organizations"),

    // Entity linking (polymorphic relationship)
    entityType: v.union(
      v.literal("participant"),
      v.literal("user"),
      v.literal("organization"),
      v.literal("service")
    ),
    entityId: v.string(), // ID of the linked entity

    // Address Type
    addressType: v.union(
      v.literal("home"),
      v.literal("postal"),
      v.literal("service"),
      v.literal("billing"),
      v.literal("other")
    ),

    // Address Fields
    streetAddress1: v.string(),
    streetAddress2: v.optional(v.string()),
    suburb: v.string(),
    state: v.union(
      v.literal("ACT"),
      v.literal("NSW"),
      v.literal("NT"),
      v.literal("QLD"),
      v.literal("SA"),
      v.literal("TAS"),
      v.literal("VIC"),
      v.literal("WA")
    ),
    postcode: v.string(), // 4 digits
    country: v.optional(v.string()), // Default: "Australia"

    // Service Delivery
    coordinates: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      })
    ),

    // Flags
    isPrimary: v.boolean(), // Primary address of this type
    isActive: v.boolean(),

    // Notes
    deliveryInstructions: v.optional(v.string()),
    accessNotes: v.optional(v.string()),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_org", ["organizationId"]),

  // Emergency Contacts - Priority-ordered contacts for participants
  emergencyContacts: defineTable({
    organizationId: v.id("organizations"),

    // Entity linking
    entityType: v.union(v.literal("participant"), v.literal("user")),
    entityId: v.string(), // ID of the participant or user

    // Contact Information
    name: v.string(),
    relationship: v.string(), // e.g., "Mother", "Spouse", "Friend"
    phone: v.string(),
    alternatePhone: v.optional(v.string()),
    email: v.optional(v.string()),

    // Priority & Type
    priority: v.number(), // 1 = primary, 2 = secondary, etc.
    contactType: v.union(
      v.literal("family"),
      v.literal("friend"),
      v.literal("medical"),
      v.literal("guardian"),
      v.literal("advocate"),
      v.literal("other")
    ),

    // Authority & Preferences
    hasDecisionMakingAuthority: v.boolean(),
    authorityScope: v.optional(v.string()), // What decisions they can make

    // Contact Preferences
    preferredContactTimes: v.optional(v.string()),
    doNotContactReasons: v.optional(v.array(v.string())),

    // Notes
    notes: v.optional(v.string()),

    // Status
    isActive: v.boolean(),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_org_priority", ["organizationId", "priority"]),

  // Participant Assignments - Many-to-many relationships between workers and participants
  participantAssignments: defineTable({
    organizationId: v.id("organizations"),
    participantId: v.id("participants"),
    userId: v.id("users"), // Support worker or coordinator

    // Assignment Details
    role: v.union(
      v.literal("primary_coordinator"),
      v.literal("support_coordinator"),
      v.literal("support_worker"),
      v.literal("key_worker"),
      v.literal("specialist"),
      v.literal("backup_worker")
    ),

    // Period
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()), // ISO date string, null if ongoing

    // Availability & Preferences
    availabilityNotes: v.optional(v.string()), // e.g., "Weekdays only", "No overnight shifts"
    participantPreferences: v.optional(v.string()), // e.g., "Prefers morning shifts"

    // Restrictions
    restrictions: v.optional(v.array(v.string())), // e.g., ["No personal care", "No driving"]

    // Status
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("pending"),
      v.literal("ended")
    ),

    // Notes
    notes: v.optional(v.string()),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_participant", ["participantId"])
    .index("by_user", ["userId"])
    .index("by_org_active", ["organizationId", "status"]),

  // ============================================
  // STORY 2.1b: NDIS-Specific Tables
  // ============================================

  // NDIS Plans - Participant funding plans and goals
  ndisPlans: defineTable({
    organizationId: v.id("organizations"),
    participantId: v.id("participants"),

    // Plan Identification
    planNumber: v.string(), // NDIS plan number

    // Plan Dates
    startDate: v.string(), // ISO date string
    endDate: v.string(), // ISO date string
    reviewDate: v.optional(v.string()), // ISO date string

    // Plan Management
    planManagementType: v.union(
      v.literal("self_managed"),
      v.literal("plan_managed"),
      v.literal("ndia_managed"),
      v.literal("combination")
    ),

    // Support Coordination
    supportCoordinationLevel: v.optional(
      v.union(
        v.literal("none"),
        v.literal("support_connection"),
        v.literal("coordination_of_supports"),
        v.literal("specialist_support_coordination")
      )
    ),

    // Plan Goals
    goals: v.array(
      v.object({
        category: v.string(), // e.g., "Daily Living", "Social Participation"
        description: v.string(),
        targetDate: v.optional(v.string()), // ISO date string
        status: v.union(
          v.literal("not_started"),
          v.literal("in_progress"),
          v.literal("achieved"),
          v.literal("revised")
        ),
      })
    ),

    // Plan Status
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("expiring_soon"), // Within 90 days of end
      v.literal("expired"),
      v.literal("replaced")
    ),

    // Funding
    totalFunding: v.number(), // Total plan value in cents
    fundingType: v.union(
      v.literal("standard"),
      v.literal("stated_supports"),
      v.literal("early_childhood")
    ),

    // Notes
    internalNotes: v.optional(v.string()),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_participant", ["participantId"])
    .index("by_org_status", ["organizationId", "status"])
    .index("by_expiry", ["endDate"]),

  // NDIS Budgets - Budget allocations by support category
  ndisBudgets: defineTable({
    organizationId: v.id("organizations"),
    planId: v.id("ndisPlans"),
    participantId: v.id("participants"),

    // Support Category
    supportCategory: v.union(
      // Core Supports
      v.literal("core_daily_activities"),
      v.literal("core_social_community"),
      v.literal("core_consumables"),
      v.literal("core_transport"),
      // Capacity Building
      v.literal("cb_support_coordination"),
      v.literal("cb_improved_living"),
      v.literal("cb_improved_relationships"),
      v.literal("cb_improved_health"),
      v.literal("cb_improved_learning"),
      v.literal("cb_improved_work"),
      v.literal("cb_improved_daily_living"),
      // Capital
      v.literal("capital_assistive_technology"),
      v.literal("capital_home_modifications")
    ),

    // Budget Amounts (all in cents)
    allocated: v.number(), // Total allocated for this category
    spent: v.number(), // Amount already spent
    committed: v.number(), // Amount committed but not yet spent
    available: v.number(), // allocated - spent - committed

    // Utilization
    utilizationPercentage: v.number(), // (spent + committed) / allocated * 100

    // Flexibility
    isFlexible: v.boolean(), // Can funds be moved between categories
    flexibilityGroup: v.optional(
      v.union(
        v.literal("core"),
        v.literal("capacity_building"),
        v.literal("capital")
      )
    ),

    // Alerts
    alertThreshold: v.optional(v.number()), // Percentage threshold for alerts (e.g., 80)
    hasAlert: v.boolean(), // True if utilization exceeds threshold
    alertMessage: v.optional(v.string()),

    // Period
    startDate: v.string(), // ISO date string
    endDate: v.string(), // ISO date string

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
    lastCalculated: v.string(), // When amounts were last recalculated
  })
    .index("by_plan", ["planId"])
    .index("by_participant", ["participantId"])
    .index("by_category", ["supportCategory"])
    .index("by_alerts", ["organizationId", "hasAlert"]),

  // Services - Service delivery records
  services: defineTable({
    organizationId: v.id("organizations"),
    participantId: v.id("participants"),
    budgetId: v.optional(v.id("ndisBudgets")), // Link to budget category
    workerId: v.optional(v.id("users")), // Support worker who delivered service

    // Service Details
    serviceDate: v.string(), // ISO date string
    startTime: v.string(), // ISO time string (HH:mm)
    endTime: v.string(), // ISO time string (HH:mm)
    duration: v.number(), // Minutes

    // NDIS Support Item
    supportItemCode: v.string(), // NDIS item number (e.g., "01_011_0107_1_1")
    supportItemName: v.string(), // Item description
    supportCategory: v.string(), // Maps to budget category
    unitRate: v.number(), // Rate per unit in cents
    units: v.number(), // Number of units (e.g., hours)
    totalCost: v.number(), // Total cost in cents

    // Service Type
    serviceType: v.union(
      v.literal("face_to_face"),
      v.literal("telehealth"),
      v.literal("travel"),
      v.literal("non_face_to_face"),
      v.literal("group")
    ),

    // Location
    locationId: v.optional(v.id("addresses")), // Reference to addresses table
    locationType: v.union(
      v.literal("participant_home"),
      v.literal("community"),
      v.literal("centre_based"),
      v.literal("telehealth"),
      v.literal("other")
    ),
    coordinates: v.optional(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      })
    ),

    // Status
    status: v.union(
      v.literal("scheduled"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("no_show"),
      v.literal("billed"),
      v.literal("paid")
    ),

    // Cancellation
    cancellationReason: v.optional(v.string()),
    cancellationNotice: v.optional(v.number()), // Hours of notice given
    isChargeable: v.optional(v.boolean()), // Can be charged despite cancellation

    // Notes & Attachments
    serviceNotes: v.optional(v.string()),
    incidentOccurred: v.boolean(),
    incidentId: v.optional(v.id("incidents")), // Reference to incident if one occurred
    attachmentIds: v.optional(v.array(v.string())), // File storage references

    // Billing
    claimId: v.optional(v.id("claims")), // Link to claim
    invoiceNumber: v.optional(v.string()),

    // Verification
    participantSignature: v.optional(v.string()), // Base64 or file reference
    workerSignature: v.optional(v.string()),
    verifiedAt: v.optional(v.string()), // ISO date string

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_org_date", ["organizationId", "serviceDate"])
    .index("by_participant_date", ["participantId", "serviceDate"])
    .index("by_worker_date", ["workerId", "serviceDate"])
    .index("by_status", ["organizationId", "status"]),

  // ============================================
  // STORY 2.1c: Operational Tables
  // ============================================

  // Notes - Comprehensive note system with access control
  notes: defineTable({
    organizationId: v.id("organizations"),

    // Entity linking (polymorphic)
    entityType: v.union(
      v.literal("participant"),
      v.literal("service"),
      v.literal("incident"),
      v.literal("user")
    ),
    entityId: v.string(), // ID of the linked entity

    // Note Type
    noteType: v.union(
      v.literal("shift"),
      v.literal("coordination"),
      v.literal("medical"),
      v.literal("behavioral"),
      v.literal("progress"),
      v.literal("general"),
      v.literal("alert")
    ),

    // Visibility & Access Control
    visibility: v.union(
      v.literal("all_staff"), // Any logged-in user
      v.literal("coordinators"), // Coordinators and above
      v.literal("management"), // Admin/management only
      v.literal("assigned_only") // Only staff assigned to participant
    ),

    // Content
    subject: v.string(),
    content: v.string(),

    // Importance & Actions
    isImportant: v.boolean(),
    requiresAction: v.boolean(),
    actionAssignedTo: v.optional(v.id("users")),
    actionDueDate: v.optional(v.string()), // ISO date string
    actionCompleted: v.optional(v.boolean()),

    // Shift-specific fields (when noteType is "shift")
    shiftDetails: v.optional(
      v.object({
        activities: v.array(v.string()),
        mood: v.optional(v.string()),
        meals: v.optional(v.array(v.string())),
        medication: v.optional(
          v.object({
            administered: v.boolean(),
            time: v.optional(v.string()),
            notes: v.optional(v.string()),
          })
        ),
        behaviors: v.optional(v.array(v.string())),
        incidents: v.optional(v.array(v.id("incidents"))),
      })
    ),

    // Metadata
    createdBy: v.id("users"),
    participantId: v.optional(v.id("participants")), // Quick reference for participant notes
    attachmentIds: v.optional(v.array(v.string())), // File references

    // Follow-up
    followUpDate: v.optional(v.string()), // ISO date string
    followUpNotes: v.optional(v.string()),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_participant_type", ["participantId", "noteType"])
    .index("by_important", ["organizationId", "isImportant"]),

  // Incidents - NDIS Quality & Safeguards compliant incident reporting
  incidents: defineTable({
    organizationId: v.id("organizations"),

    // Incident Identification
    incidentNumber: v.string(), // Internal reference number

    // People Involved
    participantId: v.optional(v.id("participants")),
    reportedBy: v.id("users"),
    involvedStaff: v.array(v.id("users")),

    // Incident Details
    incidentType: v.union(
      v.literal("injury"),
      v.literal("illness"),
      v.literal("behavioral"),
      v.literal("medication_error"),
      v.literal("missing_person"),
      v.literal("property_damage"),
      v.literal("abuse_neglect"),
      v.literal("privacy_breach"),
      v.literal("complaint"),
      v.literal("near_miss"),
      v.literal("other")
    ),

    // Severity
    severity: v.union(
      v.literal("minor"),
      v.literal("moderate"),
      v.literal("major"),
      v.literal("critical")
    ),

    // When & Where
    dateTime: v.string(), // ISO datetime string
    location: v.string(),
    locationDetails: v.optional(v.string()),

    // Description
    description: v.string(),
    immediateActions: v.string(),

    // Injury Details (if applicable)
    injuryDetails: v.optional(
      v.object({
        bodyParts: v.array(v.string()),
        injuryType: v.string(),
        treatmentProvided: v.string(),
        medicalAttentionRequired: v.boolean(),
        hospitalAttendance: v.optional(v.boolean()),
        timeOffWork: v.optional(v.number()), // Days
      })
    ),

    // Property Damage (if applicable)
    propertyDamage: v.optional(
      v.object({
        itemsDamaged: v.array(v.string()),
        estimatedCost: v.optional(v.number()), // Cents
        ownerNotified: v.boolean(),
        policeReportNumber: v.optional(v.string()),
      })
    ),

    // Witnesses
    witnesses: v.array(
      v.object({
        name: v.string(),
        contactNumber: v.string(),
        statement: v.optional(v.string()),
        isStaff: v.boolean(),
        staffId: v.optional(v.id("users")),
      })
    ),

    // Investigation
    investigationRequired: v.boolean(),
    investigationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("completed")
      )
    ),
    investigatedBy: v.optional(v.id("users")),
    investigationFindings: v.optional(v.string()),
    rootCause: v.optional(v.string()),

    // External Reporting
    externalReporting: v.object({
      ndisRequired: v.boolean(),
      ndisReported: v.optional(v.boolean()),
      ndisReference: v.optional(v.string()),
      workSafeRequired: v.boolean(),
      workSafeReported: v.optional(v.boolean()),
      workSafeReference: v.optional(v.string()),
      policeRequired: v.boolean(),
      policeReported: v.optional(v.boolean()),
      policeReference: v.optional(v.string()),
      otherRequired: v.optional(v.string()),
    }),

    // Corrective Actions
    correctiveActions: v.array(
      v.object({
        action: v.string(),
        responsiblePerson: v.id("users"),
        dueDate: v.string(), // ISO date string
        completedDate: v.optional(v.string()),
        status: v.union(
          v.literal("pending"),
          v.literal("in_progress"),
          v.literal("completed"),
          v.literal("overdue")
        ),
      })
    ),

    // Family Notification
    familyNotified: v.boolean(),
    familyNotifiedBy: v.optional(v.id("users")),
    familyNotifiedDate: v.optional(v.string()), // ISO datetime string
    familyResponse: v.optional(v.string()),

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("under_investigation"),
      v.literal("closed"),
      v.literal("reopened")
    ),

    // Attachments
    attachmentIds: v.optional(v.array(v.string())), // Photos, documents, etc.

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
    closedAt: v.optional(v.string()), // ISO date string
  })
    .index("by_org_date", ["organizationId", "dateTime"])
    .index("by_severity", ["organizationId", "severity"])
    .index("by_status", ["organizationId", "status"])
    .index("by_external", ["organizationId", "externalReporting.ndisRequired"]),

  // Leave Requests - Staff leave management
  leaveRequests: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),

    // Leave Type
    leaveType: v.union(
      v.literal("annual"),
      v.literal("sick"),
      v.literal("personal"),
      v.literal("compassionate"),
      v.literal("parental"),
      v.literal("long_service"),
      v.literal("unpaid"),
      v.literal("other")
    ),

    // Period
    startDate: v.string(), // ISO date string
    endDate: v.string(), // ISO date string
    isPartialDay: v.boolean(),
    partialDayHours: v.optional(v.number()),
    totalDays: v.number(), // Calculated days

    // Reason & Notes
    reason: v.optional(v.string()),
    isEmergency: v.boolean(),

    // Coverage
    coverageArranged: v.boolean(),
    coverageNotes: v.optional(v.string()),
    coveringStaffId: v.optional(v.id("users")),

    // Approval Workflow
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("cancelled")
    ),

    // Approval Details
    submittedAt: v.optional(v.string()), // ISO datetime string
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.string()), // ISO datetime string
    rejectionReason: v.optional(v.string()),

    // Supporting Documents
    hasMedicalCertificate: v.optional(v.boolean()),
    documentIds: v.optional(v.array(v.string())), // File references

    // Impact
    affectedShifts: v.optional(v.array(v.string())), // Shift IDs or descriptions

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_user", ["userId"])
    .index("by_org_status", ["organizationId", "status"])
    .index("by_dates", ["startDate", "endDate"])
    .index("by_pending", ["organizationId", "status", "submittedAt"]),

  // Leave Balances - Current leave entitlements
  leaveBalances: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    leaveType: v.string(), // Same as leaveRequests types

    // Employment Details for Pro-rata
    employmentType: v.union(
      v.literal("full_time"),
      v.literal("part_time"),
      v.literal("casual")
    ),
    weeklyHours: v.number(),
    fte: v.number(), // Full-time equivalent (0.0 to 1.0)

    // Accrual Configuration
    accrualMethod: v.union(
      v.literal("monthly"),
      v.literal("fortnightly"),
      v.literal("anniversary"),
      v.literal("progressive"),
      v.literal("none")
    ),
    accrualRate: v.number(), // Days per period
    accrualFrequency: v.optional(v.string()), // e.g., "monthly", "per year"

    // Balances (in days or hours)
    entitled: v.number(), // Total yearly entitlement
    accrued: v.number(), // Total accrued to date
    taken: v.number(), // Total taken
    pending: v.number(), // Pending approval
    available: v.number(), // accrued - taken - pending

    // Carry Over
    carryOverLimit: v.optional(v.number()),
    carriedOver: v.optional(v.number()),

    // Maximum Accumulation
    maxAccumulation: v.optional(v.number()),

    // Service Details (for long service leave)
    serviceStartDate: v.optional(v.string()), // ISO date string
    yearsOfService: v.optional(v.number()),

    // Next Accrual
    nextAccrualDate: v.optional(v.string()), // ISO date string
    nextAccrualAmount: v.optional(v.number()),

    // Adjustments
    lastAdjustment: v.optional(
      v.object({
        date: v.string(),
        amount: v.number(),
        reason: v.string(),
        adjustedBy: v.id("users"),
      })
    ),

    // Period
    balanceAsAt: v.string(), // ISO date string
    financialYearStart: v.string(), // ISO date string

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_user", ["userId"])
    .index("by_org", ["organizationId"]),

  // Leave Accruals - Transaction history
  leaveAccruals: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    balanceId: v.id("leaveBalances"),

    // Transaction Type
    transactionType: v.union(
      v.literal("accrual"), // Regular accrual
      v.literal("usage"), // Leave taken
      v.literal("adjustment"), // Manual adjustment
      v.literal("carryover"), // Year-end carryover
      v.literal("forfeiture"), // Lost leave
      v.literal("payout") // Leave paid out
    ),

    // Transaction Details
    leaveType: v.string(),
    amount: v.number(), // Positive for credit, negative for debit

    // Reference
    leaveRequestId: v.optional(v.id("leaveRequests")), // If usage

    // Calculation Details
    calculationDetails: v.optional(
      v.object({
        period: v.string(), // e.g., "January 2024"
        rate: v.number(),
        fte: v.number(),
        proRataFactor: v.optional(v.number()),
      })
    ),

    // Balances
    previousBalance: v.number(),
    newBalance: v.number(),

    // Notes
    notes: v.optional(v.string()),
    processedBy: v.optional(v.union(v.literal("system"), v.literal("manual"))),
    approvedBy: v.optional(v.id("users")),

    // Date
    effectiveDate: v.string(), // ISO date string

    // Timestamps
    createdAt: v.string(), // ISO date string
  })
    .index("by_user_date", ["userId", "effectiveDate"])
    .index("by_balance", ["balanceId"]),

  // Staff Availability - Complex availability patterns
  staffAvailability: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),

    // Pattern Type
    patternType: v.union(
      v.literal("recurring_weekly"), // Same every week
      v.literal("fortnightly"), // Alternating weeks
      v.literal("monthly"), // Specific days each month
      v.literal("custom") // Irregular pattern
    ),

    // Effective Period
    effectiveFrom: v.string(), // ISO date string
    effectiveTo: v.optional(v.string()), // ISO date string

    // Weekly Pattern (for recurring_weekly and fortnightly)
    weeklyPattern: v.optional(
      v.object({
        monday: v.optional(
          v.array(
            v.object({
              startTime: v.string(), // HH:mm
              endTime: v.string(), // HH:mm
              isAvailable: v.boolean(),
            })
          )
        ),
        tuesday: v.optional(
          v.array(
            v.object({
              startTime: v.string(),
              endTime: v.string(),
              isAvailable: v.boolean(),
            })
          )
        ),
        wednesday: v.optional(
          v.array(
            v.object({
              startTime: v.string(),
              endTime: v.string(),
              isAvailable: v.boolean(),
            })
          )
        ),
        thursday: v.optional(
          v.array(
            v.object({
              startTime: v.string(),
              endTime: v.string(),
              isAvailable: v.boolean(),
            })
          )
        ),
        friday: v.optional(
          v.array(
            v.object({
              startTime: v.string(),
              endTime: v.string(),
              isAvailable: v.boolean(),
            })
          )
        ),
        saturday: v.optional(
          v.array(
            v.object({
              startTime: v.string(),
              endTime: v.string(),
              isAvailable: v.boolean(),
            })
          )
        ),
        sunday: v.optional(
          v.array(
            v.object({
              startTime: v.string(),
              endTime: v.string(),
              isAvailable: v.boolean(),
            })
          )
        ),
      })
    ),

    // Fortnightly Pattern (week A and week B)
    fortnightlyPattern: v.optional(
      v.object({
        referenceWeekStart: v.string(), // ISO date to determine which week is A
        // Note: weekA and weekB patterns would be stored separately
        // or referenced from weeklyPattern based on the week
      })
    ),

    // Monthly Pattern
    monthlyPattern: v.optional(
      v.array(
        v.object({
          dayOfMonth: v.number(), // 1-31
          startTime: v.string(),
          endTime: v.string(),
          isAvailable: v.boolean(),
        })
      )
    ),

    // Preferences
    preferences: v.object({
      maxHoursPerWeek: v.optional(v.number()),
      maxHoursPerDay: v.optional(v.number()),
      maxConsecutiveDays: v.optional(v.number()),
      minHoursBetweenShifts: v.optional(v.number()),
      preferredShiftLength: v.optional(v.number()), // Hours
      travelRadius: v.optional(v.number()), // Kilometers
      willWorkPublicHolidays: v.optional(v.boolean()),
      willWorkWeekends: v.optional(v.boolean()),
      willWorkNights: v.optional(v.boolean()),
    }),

    // Skill-based Restrictions
    skillRestrictions: v.optional(v.array(v.string())), // Types of work they can't do
    preferredParticipants: v.optional(v.array(v.id("participants"))),

    // Blackout Dates
    blackoutDates: v.optional(
      v.array(
        v.object({
          startDate: v.string(), // ISO date
          endDate: v.string(), // ISO date
          reason: v.optional(v.string()),
        })
      )
    ),

    // Status
    isActive: v.boolean(),

    // Notes
    notes: v.optional(v.string()),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_user", ["userId"])
    .index("by_org", ["organizationId"])
    .index("by_effective", ["effectiveFrom"]),

  // Availability Exceptions - One-off changes to regular availability
  availabilityExceptions: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    availabilityId: v.optional(v.id("staffAvailability")), // Base availability being modified

    // Exception Type
    exceptionType: v.union(
      v.literal("additional"), // Extra availability
      v.literal("unavailable"), // Not available when normally would be
      v.literal("modified") // Different hours than normal
    ),

    // Date Range
    startDate: v.string(), // ISO date string
    endDate: v.string(), // ISO date string

    // Time Slots (if additional or modified)
    timeSlots: v.optional(
      v.array(
        v.object({
          date: v.string(), // ISO date
          startTime: v.string(), // HH:mm
          endTime: v.string(), // HH:mm
        })
      )
    ),

    // Reason
    reason: v.optional(v.string()),
    leaveRequestId: v.optional(v.id("leaveRequests")), // If linked to leave

    // Approval
    requiresApproval: v.boolean(),
    approvalStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
    approvedBy: v.optional(v.id("users")),
    approvalDate: v.optional(v.string()), // ISO date string

    // Notes
    notes: v.optional(v.string()),

    // Status
    isActive: v.boolean(),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_user_date", ["userId", "startDate", "endDate"])
    .index("by_leave", ["leaveRequestId"]),

  // ============================================
  // STORY 2.1d: Compliance & Automation
  // ============================================

  // Audit Logs - Complete audit trail for all changes
  auditLogs: defineTable({
    organizationId: v.id("organizations"),

    // User & Action
    userId: v.optional(v.id("users")), // Optional for system actions
    action: v.union(
      v.literal("create"),
      v.literal("read"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("login"),
      v.literal("logout"),
      v.literal("export"),
      v.literal("import")
    ),

    // Entity Reference
    entityType: v.string(), // Table name (e.g., "participants", "services")
    entityId: v.string(), // Document ID

    // Changes
    changes: v.optional(
      v.object({
        before: v.optional(v.any()), // Previous values
        after: v.optional(v.any()), // New values
        fields: v.optional(v.array(v.string())), // Changed fields
      })
    ),

    // Metadata
    metadata: v.object({
      ipAddress: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      source: v.optional(
        v.union(
          v.literal("web"),
          v.literal("mobile"),
          v.literal("api"),
          v.literal("system"),
          v.literal("import")
        )
      ),
      sessionId: v.optional(v.string()),
      requestId: v.optional(v.string()),
    }),

    // Compliance
    retentionRequired: v.boolean(), // True for 7-year retention
    retentionUntil: v.optional(v.string()), // ISO date string

    // Security
    riskLevel: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
    alertTriggered: v.optional(v.boolean()),

    // Performance
    duration: v.optional(v.number()), // Milliseconds

    // Timestamps
    timestamp: v.string(), // ISO datetime string
  })
    .index("by_org_time", ["organizationId", "timestamp"])
    .index("by_user", ["userId"])
    .index("by_entity", ["entityType", "entityId"]),

  // Documents - Compliance document management
  documents: defineTable({
    organizationId: v.id("organizations"),

    // Document Identification
    documentNumber: v.string(), // Internal reference
    title: v.string(),

    // Document Type
    documentType: v.union(
      v.literal("policy"),
      v.literal("procedure"),
      v.literal("agreement"),
      v.literal("contract"),
      v.literal("report"),
      v.literal("assessment"),
      v.literal("plan"),
      v.literal("certificate"),
      v.literal("invoice"),
      v.literal("receipt"),
      v.literal("correspondence"),
      v.literal("other")
    ),

    // Category
    category: v.optional(v.string()), // e.g., "NDIS", "Employment", "Safety"

    // Entity Linking
    entityType: v.optional(
      v.union(
        v.literal("participant"),
        v.literal("user"),
        v.literal("organization"),
        v.literal("incident"),
        v.literal("service")
      )
    ),
    entityId: v.optional(v.string()),

    // File Information
    fileId: v.string(), // Convex _storage reference
    fileName: v.string(),
    fileSize: v.number(), // Bytes
    mimeType: v.string(),

    // Version Control
    version: v.number(),
    isLatestVersion: v.boolean(),
    previousVersionId: v.optional(v.id("documents")),

    // Metadata
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),

    // Validity
    effectiveDate: v.optional(v.string()), // ISO date string
    expiryDate: v.optional(v.string()), // ISO date string
    reviewDate: v.optional(v.string()), // ISO date string

    // Compliance
    isConfidential: v.boolean(),
    retentionPeriod: v.optional(v.number()), // Years
    retentionUntil: v.optional(v.string()), // ISO date string

    // Approval
    requiresApproval: v.boolean(),
    approvalStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
    approvedBy: v.optional(v.id("users")),
    approvalDate: v.optional(v.string()), // ISO datetime string
    approvalNotes: v.optional(v.string()),

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("archived"),
      v.literal("expired"),
      v.literal("superseded")
    ),

    // Audit
    uploadedBy: v.id("users"),
    lastAccessedBy: v.optional(v.id("users")),
    lastAccessedAt: v.optional(v.string()), // ISO datetime string
    accessCount: v.optional(v.number()),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_org", ["organizationId"])
    .index("by_participant", ["entityType", "entityId"])
    .index("by_type", ["documentType"])
    .index("by_expiry", ["expiryDate"]),

  // Announcements - Organization-wide messaging
  announcements: defineTable({
    organizationId: v.id("organizations"),

    // Content
    title: v.string(),
    content: v.string(),

    // Category
    category: v.union(
      v.literal("general"),
      v.literal("urgent"),
      v.literal("policy"),
      v.literal("training"),
      v.literal("roster"),
      v.literal("event"),
      v.literal("system")
    ),

    // Targeting
    targetAudience: v.union(
      v.literal("all"),
      v.literal("staff"),
      v.literal("management"),
      v.literal("specific_roles")
    ),
    targetRoles: v.optional(v.array(v.string())), // If specific_roles
    targetUsers: v.optional(v.array(v.id("users"))), // Specific users

    // Priority
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("critical")
    ),
    isPinned: v.boolean(),

    // Visibility Period
    publishDate: v.string(), // ISO datetime string
    expiryDate: v.optional(v.string()), // ISO datetime string

    // Read Tracking
    requiresAcknowledgment: v.boolean(),
    viewedBy: v.array(
      v.object({
        userId: v.id("users"),
        viewedAt: v.string(), // ISO datetime string
        acknowledged: v.optional(v.boolean()),
        acknowledgedAt: v.optional(v.string()),
      })
    ),

    // Author
    createdBy: v.id("users"),

    // Attachments
    attachmentIds: v.optional(v.array(v.string())), // File references

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("published"),
      v.literal("expired"),
      v.literal("archived")
    ),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_org_active", ["organizationId", "status", "publishDate"])
    .index("by_category", ["organizationId", "category"])
    .index("by_expiry", ["expiryDate"]),

  // Claims - NDIS billing claims
  claims: defineTable({
    organizationId: v.id("organizations"),

    // Claim Identification
    claimNumber: v.string(), // Internal claim number
    ndisClaimNumber: v.optional(v.string()), // NDIS assigned reference

    // Claim Period
    periodStart: v.string(), // ISO date string
    periodEnd: v.string(), // ISO date string

    // Services
    serviceIds: v.array(v.id("services")), // Services included in claim
    serviceCount: v.number(),

    // Amounts (in cents)
    totalAmount: v.number(), // Total claim amount
    gstAmount: v.optional(v.number()), // GST if applicable

    // Claim Type
    claimType: v.union(
      v.literal("standard"),
      v.literal("cancellation"),
      v.literal("travel"),
      v.literal("adjustment")
    ),

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("ready"),
      v.literal("submitted"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("partially_paid"),
      v.literal("paid"),
      v.literal("cancelled")
    ),

    // Submission Details
    submittedAt: v.optional(v.string()), // ISO date string
    submittedBy: v.optional(v.id("users")),
    submissionMethod: v.optional(
      v.union(
        v.literal("portal"),
        v.literal("api"),
        v.literal("bulk_upload"),
        v.literal("manual")
      )
    ),

    // NDIS Response
    ndisResponse: v.optional(
      v.object({
        reference: v.string(),
        receivedAt: v.string(), // ISO date string
        errors: v.optional(
          v.array(
            v.object({
              code: v.string(),
              message: v.string(),
              serviceId: v.optional(v.id("services")),
            })
          )
        ),
        warnings: v.optional(
          v.array(
            v.object({
              code: v.string(),
              message: v.string(),
            })
          )
        ),
      })
    ),

    // Payment Details
    paymentReference: v.optional(v.string()),
    paymentDate: v.optional(v.string()), // ISO date string
    paymentAmount: v.optional(v.number()), // Amount actually paid (cents)

    // Notes
    internalNotes: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),

    // Timestamps
    createdAt: v.string(), // ISO date string
    updatedAt: v.string(), // ISO date string
  })
    .index("by_org_period", ["organizationId", "periodStart", "periodEnd"])
    .index("by_status", ["organizationId", "status"])
    .index("by_number", ["claimNumber"]),
});

export default schema;
