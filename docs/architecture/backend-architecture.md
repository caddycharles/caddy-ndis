# Backend Architecture - Convex Platform

**Version:** 2.0  
**Date:** 2025-01-13  
**Author:** Winston (System Architect)  
**Status:** Active

---

## Executive Summary

The Caddy backend is built entirely on Convex, a reactive backend platform that provides database, real-time subscriptions, file storage, and serverless functions in a single integrated solution. This eliminates the need for traditional backend infrastructure, enabling focus on business logic rather than infrastructure management.

---

## Core Architecture Principles

### 1. Reactive by Default
Every query automatically creates a real-time subscription. When data changes, all connected clients update instantly without polling or manual cache invalidation.

### 2. Serverless Functions
All backend logic runs as serverless functions with automatic scaling, no cold starts, and built-in error handling.

### 3. ACID Transactions
Database operations are fully transactional with automatic conflict resolution and consistency guarantees.

### 4. Zero Infrastructure
No servers to manage, no databases to configure, no caches to maintain. Everything is handled by Convex.

---

## Convex Function Architecture

### Function Types

#### Queries - Read Operations with Subscriptions
```typescript
// convex/participants.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("archived")
    )),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Automatic real-time subscription
    let q = ctx.db
      .query("participants")
      .withIndex("by_org_status", (q) =>
        q.eq("organizationId", args.organizationId)
          .eq("status", args.status ?? "active")
      );

    if (args.search) {
      // Full-text search
      q = q.withSearchIndex("search", (q) =>
        q.search("profile", args.search!)
      );
    }

    const participants = await q.take(100);

    // Enrich with related data
    return Promise.all(
      participants.map(async (p) => ({
        ...p,
        currentBudget: await getCurrentBudget(ctx, p._id),
        recentServices: await getRecentServices(ctx, p._id, 5),
        complianceScore: calculateComplianceScore(p),
      }))
    );
  },
});
```

#### Mutations - Write Operations
```typescript
// convex/services.ts
export const create = mutation({
  args: {
    participantId: v.id("participants"),
    serviceDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    supportItem: v.object({
      code: v.string(),
      description: v.string(),
      rate: v.number(),
    }),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    // Authentication check
    const user = await requireAuth(ctx);
    
    // Authorization check
    await requirePermission(ctx, user, "services.create");
    
    // Business logic validation
    const participant = await ctx.db.get(args.participantId);
    if (!participant) {
      throw new Error("Participant not found");
    }
    
    // Calculate duration
    const duration = calculateDuration(args.startTime, args.endTime);
    const totalCost = duration * args.supportItem.rate;
    
    // Find appropriate budget
    const budget = await findBudgetForService(ctx, args);
    if (!budget) {
      throw new Error("No budget available for this service");
    }
    
    // Check budget availability
    if (budget.remaining < totalCost) {
      throw new Error("Insufficient budget");
    }
    
    // Create service record (transaction)
    const serviceId = await ctx.db.insert("services", {
      ...args,
      organizationId: participant.organizationId,
      supportWorkerId: user._id,
      duration,
      totalCost,
      budgetId: budget._id,
      status: "completed",
      createdAt: Date.now(),
      createdBy: user._id,
    });
    
    // Update budget spent amount
    await ctx.db.patch(budget._id, {
      spent: budget.spent + totalCost,
      remaining: budget.remaining - totalCost,
      updatedAt: Date.now(),
    });
    
    // Create audit log
    await createAuditLog(ctx, {
      action: "service.created",
      entityType: "services",
      entityId: serviceId,
      userId: user._id,
      metadata: { totalCost, duration },
    });
    
    // Check for alerts
    await checkBudgetAlerts(ctx, budget._id);
    
    return serviceId;
  },
});
```

#### Actions - External Integrations
```typescript
// convex/imports.ts
export const importNDISPlan = action({
  args: {
    csvFile: v.string(), // Base64 encoded
    organizationId: v.id("organizations"),
    mappingRules: v.optional(v.object({
      ndisNumberColumn: v.string(),
      firstNameColumn: v.string(),
      lastNameColumn: v.string(),
      // ... other mappings
    })),
  },
  handler: async (ctx, args) => {
    // Parse CSV
    const csvData = Buffer.from(args.csvFile, 'base64').toString();
    const rows = parseCSV(csvData);
    
    // Validate structure
    const validation = validateNDISFormat(rows, args.mappingRules);
    if (!validation.valid) {
      return { 
        success: false, 
        errors: validation.errors 
      };
    }
    
    // Process in batches
    const batchSize = 10;
    const results = {
      created: 0,
      updated: 0,
      failed: [],
      warnings: [],
    };
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (row) => {
          try {
            // Transform NDIS data to our schema
            const participantData = transformNDISRow(row, args.mappingRules);
            
            // Check if participant exists
            const existing = await ctx.runQuery(
              api.participants.getByNDIS,
              { ndisNumber: participantData.ndisNumber }
            );
            
            if (existing) {
              // Update existing
              await ctx.runMutation(api.participants.update, {
                id: existing._id,
                updates: participantData,
              });
              results.updated++;
            } else {
              // Create new
              await ctx.runMutation(api.participants.create, {
                ...participantData,
                organizationId: args.organizationId,
              });
              results.created++;
            }
          } catch (error) {
            results.failed.push({
              row: i + 1,
              ndisNumber: row["NDIS Number"],
              error: error.message,
            });
          }
        })
      );
      
      // Update progress (could emit real-time updates here)
      const progress = ((i + batch.length) / rows.length) * 100;
      await ctx.runMutation(api.imports.updateProgress, {
        organizationId: args.organizationId,
        progress,
      });
    }
    
    return results;
  },
});
```

#### Scheduled Functions - Cron Jobs
```typescript
// convex/crons.ts
import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Daily budget alerts
crons.daily(
  "check budget alerts",
  { hourUTC: 22, minuteUTC: 0 }, // 8am AEST
  api.budgets.checkDailyAlerts
);

// Weekly compliance check
crons.weekly(
  "compliance check",
  { dayOfWeek: "monday", hourUTC: 23, minuteUTC: 0 },
  api.compliance.weeklyCheck
);

// Monthly plan expiry notifications
crons.monthly(
  "plan expiry check",
  { day: 1, hourUTC: 22, minuteUTC: 0 },
  api.participants.checkPlanExpiry
);

export default crons;

// Implementation
export const checkDailyAlerts = mutation({
  args: {},
  handler: async (ctx) => {
    const organizations = await ctx.db.query("organizations").collect();
    
    for (const org of organizations) {
      const budgets = await ctx.db
        .query("budgets")
        .withIndex("by_org", (q) => q.eq("organizationId", org._id))
        .collect();
      
      for (const budget of budgets) {
        const percentUsed = (budget.spent / budget.allocated) * 100;
        
        // Check thresholds
        if (percentUsed > 90 && !budget.alert90Sent) {
          await sendBudgetAlert(ctx, budget, "critical", percentUsed);
          await ctx.db.patch(budget._id, { alert90Sent: true });
        } else if (percentUsed > 75 && !budget.alert75Sent) {
          await sendBudgetAlert(ctx, budget, "warning", percentUsed);
          await ctx.db.patch(budget._id, { alert75Sent: true });
        }
      }
    }
  },
});
```

---

## Database Schema Design

### Core Tables

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organizations - Multi-tenant root
  organizations: defineTable({
    name: v.string(),
    abn: v.optional(v.string()),
    ndisRegistration: v.optional(v.string()),
    
    settings: v.object({
      timezone: v.string(),
      currency: v.string(),
      dateFormat: v.string(),
      businessHours: v.object({
        start: v.string(),
        end: v.string(),
        workDays: v.array(v.number()),
      }),
    }),
    
    subscription: v.object({
      plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
      status: v.union(v.literal("active"), v.literal("past_due"), v.literal("cancelled")),
      currentPeriodEnd: v.number(),
      participantLimit: v.number(),
      features: v.array(v.string()),
    }),
    
    contacts: v.array(v.object({
      name: v.string(),
      role: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      isPrimary: v.boolean(),
    })),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_abn", ["abn"])
    .index("by_subscription_status", ["subscription.status"]),

  // Users - Staff members
  users: defineTable({
    clerkId: v.string(), // External auth ID
    organizationId: v.id("organizations"),
    
    profile: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      avatar: v.optional(v.id("_storage")),
    }),
    
    role: v.union(
      v.literal("admin"),
      v.literal("coordinator"),
      v.literal("support_worker"),
      v.literal("finance"),
      v.literal("viewer")
    ),
    
    permissions: v.array(v.string()), // Granular permissions
    
    preferences: v.object({
      notifications: v.object({
        email: v.boolean(),
        inApp: v.boolean(),
        sms: v.boolean(),
      }),
      defaultView: v.string(),
      shortcuts: v.array(v.string()),
    }),
    
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended")),
    lastActive: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_org", ["organizationId"])
    .index("by_org_role", ["organizationId", "role"])
    .index("by_email", ["profile.email"]),

  // Participants - NDIS participants
  participants: defineTable({
    organizationId: v.id("organizations"),
    ndisNumber: v.string(),
    
    profile: v.object({
      firstName: v.string(),
      lastName: v.string(),
      preferredName: v.optional(v.string()),
      dateOfBirth: v.string(),
      gender: v.optional(v.string()),
      
      contact: v.object({
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        mobile: v.optional(v.string()),
        preferredMethod: v.optional(v.string()),
      }),
      
      address: v.optional(v.object({
        street: v.string(),
        suburb: v.string(),
        state: v.string(),
        postcode: v.string(),
        country: v.string(),
      })),
      
      emergency: v.optional(v.array(v.object({
        name: v.string(),
        relationship: v.string(),
        phone: v.string(),
        isPrimary: v.boolean(),
      }))),
    }),
    
    plan: v.object({
      planNumber: v.optional(v.string()),
      startDate: v.string(),
      endDate: v.string(),
      reviewDate: v.optional(v.string()),
      planManager: v.optional(v.string()),
      supportCoordinator: v.optional(v.id("users")),
      goals: v.array(v.string()),
    }),
    
    funding: v.object({
      totalBudget: v.number(),
      managementType: v.union(
        v.literal("self_managed"),
        v.literal("plan_managed"),
        v.literal("ndia_managed")
      ),
      categories: v.array(v.object({
        name: v.string(),
        code: v.string(),
        allocated: v.number(),
      })),
    }),
    
    medical: v.optional(v.object({
      disabilities: v.array(v.string()),
      medications: v.array(v.object({
        name: v.string(),
        dosage: v.string(),
        frequency: v.string(),
      })),
      allergies: v.array(v.string()),
      dietaryRequirements: v.array(v.string()),
    })),
    
    preferences: v.object({
      communicationNeeds: v.optional(v.string()),
      culturalConsiderations: v.optional(v.string()),
      interests: v.array(v.string()),
      routines: v.optional(v.string()),
    }),
    
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("archived")
    ),
    
    tags: v.array(v.string()),
    customFields: v.optional(v.any()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
    archivedAt: v.optional(v.number()),
  })
    .index("by_org", ["organizationId"])
    .index("by_ndis", ["ndisNumber"])
    .index("by_org_status", ["organizationId", "status"])
    .index("by_plan_end", ["plan.endDate"])
    .searchIndex("search", {
      searchField: "profile",
      filterFields: ["organizationId", "status"],
    }),

  // Additional tables...
  budgets: defineTable({...}),
  services: defineTable({...}),
  claims: defineTable({...}),
  documents: defineTable({...}),
  messages: defineTable({...}),
  auditLogs: defineTable({...}),
});
```

---

## Authentication & Authorization

### Clerk Integration
```typescript
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN,
      applicationID: process.env.CLERK_APP_ID,
    },
  ],
};

// convex/auth.ts
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    return await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => 
        q.eq("clerkId", identity.subject)
      )
      .unique();
  },
});
```

### Role-Based Access Control
```typescript
// convex/lib/rbac.ts
export async function requirePermission(
  ctx: QueryCtx | MutationCtx,
  user: Doc<"users">,
  permission: string
) {
  // Admin has all permissions
  if (user.role === "admin") return true;
  
  // Check specific permissions
  if (user.permissions.includes(permission)) return true;
  
  // Check role-based permissions
  const rolePermissions = {
    coordinator: [
      "participants.read",
      "participants.write",
      "services.read",
      "services.write",
      "budgets.read",
    ],
    support_worker: [
      "participants.read",
      "services.read",
      "services.write",
    ],
    finance: [
      "budgets.read",
      "claims.read",
      "claims.write",
    ],
    viewer: [
      "participants.read",
      "services.read",
      "budgets.read",
    ],
  };
  
  const allowed = rolePermissions[user.role] || [];
  if (allowed.includes(permission)) return true;
  
  throw new Error(`Permission denied: ${permission}`);
}
```

---

## Real-time Features

### Live Budget Tracking
```typescript
export const trackBudget = query({
  args: { participantId: v.id("participants") },
  handler: async (ctx, args) => {
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_participant", (q) => 
        q.eq("participantId", args.participantId)
      )
      .collect();
    
    // Calculate real-time spending
    const services = await ctx.db
      .query("services")
      .withIndex("by_participant", (q) => 
        q.eq("participantId", args.participantId)
      )
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();
    
    return budgets.map((budget) => {
      const spent = services
        .filter((s) => s.budgetId === budget._id)
        .reduce((sum, s) => sum + s.totalCost, 0);
      
      const percentUsed = (spent / budget.allocated) * 100;
      
      return {
        ...budget,
        spent,
        remaining: budget.allocated - spent,
        percentUsed,
        status: getTrafficLightStatus(percentUsed),
        daysRemaining: getDaysUntil(budget.endDate),
        burnRate: spent / getDaysSince(budget.startDate),
      };
    });
  },
});
```

### User Presence
```typescript
export const updatePresence = mutation({
  args: {
    status: v.union(v.literal("online"), v.literal("away"), v.literal("offline")),
    currentPage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    await ctx.db.patch(user._id, {
      presence: {
        status: args.status,
        currentPage: args.currentPage,
        lastSeen: Date.now(),
      },
    });
  },
});

export const getActiveUsers = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    
    return await ctx.db
      .query("users")
      .withIndex("by_org", (q) => 
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => 
        q.gt(q.field("presence.lastSeen"), fiveMinutesAgo)
      )
      .collect();
  },
});
```

---

## Email Service Integration

### Resend Configuration
```typescript
// convex/lib/email.ts
import { Resend } from 'resend';
import { action } from "../_generated/server";
import { v } from "convex/values";

const resend = new Resend(process.env.RESEND_API_KEY);

// Send transactional email
export const sendEmail = action({
  args: {
    to: v.array(v.string()),
    subject: v.string(),
    template: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const { data, error } = await resend.emails.send({
      from: 'Caddy <noreply@notifications.caddy.team>',
      to: args.to,
      subject: args.subject,
      react: getEmailTemplate(args.template, args.data),
      tags: [
        { name: 'environment', value: process.env.NODE_ENV },
        { name: 'template', value: args.template },
      ],
    });
    
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    // Log email send
    await ctx.runMutation(api.emailLogs.create, {
      resendId: data.id,
      to: args.to,
      subject: args.subject,
      template: args.template,
      status: 'sent',
      sentAt: Date.now(),
    });
    
    return { success: true, id: data.id };
  },
});
```

### Email Templates
```typescript
// Budget Alert Email
export const sendBudgetAlert = action({
  args: {
    participantId: v.id("participants"),
    budgetId: v.id("budgets"),
    threshold: v.number(),
  },
  handler: async (ctx, args) => {
    const [participant, budget, coordinators] = await Promise.all([
      ctx.runQuery(api.participants.get, { id: args.participantId }),
      ctx.runQuery(api.budgets.get, { id: args.budgetId }),
      ctx.runQuery(api.users.getCoordinators, { 
        participantId: args.participantId 
      }),
    ]);
    
    const emails = coordinators.map(c => c.profile.email);
    
    await sendEmail({
      to: emails,
      subject: `Budget Alert: ${participant.profile.firstName} at ${args.threshold}%`,
      template: 'budget-alert',
      data: {
        participant,
        budget,
        threshold: args.threshold,
        dashboardUrl: `${process.env.APP_URL}/participants/${args.participantId}`,
      },
    });
  },
});
```

---

## File Storage

### Document Management
```typescript
export const uploadDocument = mutation({
  args: {
    participantId: v.id("participants"),
    type: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Generate upload URL
    const uploadUrl = await ctx.storage.generateUploadUrl();
    
    // Create document record
    const docId = await ctx.db.insert("documents", {
      participantId: args.participantId,
      organizationId: user.organizationId,
      type: args.type,
      title: args.title,
      status: "pending_upload",
      uploadedBy: user._id,
      createdAt: Date.now(),
    });
    
    return { uploadUrl, documentId: docId };
  },
});

export const confirmUpload = mutation({
  args: {
    documentId: v.id("documents"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get file metadata
    const metadata = await ctx.storage.getMetadata(args.storageId);
    
    // Update document record
    await ctx.db.patch(args.documentId, {
      storageId: args.storageId,
      status: "uploaded",
      metadata: {
        size: metadata.size,
        contentType: metadata.contentType,
      },
      updatedAt: Date.now(),
    });
  },
});
```

---

## Performance Optimization

### Query Optimization
```typescript
// Use indexes effectively
const participants = await ctx.db
  .query("participants")
  .withIndex("by_org_status", (q) =>
    q.eq("organizationId", orgId)
     .eq("status", "active")
  )
  .take(20); // Pagination

// Batch related data fetches
const enrichedParticipants = await Promise.all(
  participants.map(async (p) => ({
    ...p,
    budgets: await ctx.db
      .query("budgets")
      .withIndex("by_participant", (q) => 
        q.eq("participantId", p._id)
      )
      .take(5),
  }))
);
```

### Caching Patterns
```typescript
// Convex handles caching automatically via reactive queries
// But we can implement computed properties for expensive calculations

export const getDashboardStats = query({
  handler: async (ctx) => {
    // These queries are automatically cached and reactive
    const [participants, services, claims] = await Promise.all([
      ctx.db.query("participants")
        .withIndex("by_org_status")
        .collect(),
      ctx.db.query("services")
        .withIndex("by_date")
        .take(100),
      ctx.db.query("claims")
        .withIndex("by_status")
        .collect(),
    ]);
    
    // Computed values
    return {
      totalParticipants: participants.length,
      activeParticipants: participants.filter(p => p.status === "active").length,
      servicesThisWeek: services.filter(s => isThisWeek(s.serviceDate)).length,
      pendingClaims: claims.filter(c => c.status === "draft").length,
      // These update automatically when underlying data changes
    };
  },
});
```

---

## Error Handling

### Structured Error Responses
```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
  }
}

// Usage in mutations
export const createService = mutation({
  handler: async (ctx, args) => {
    try {
      // Validation
      if (!isValidDate(args.serviceDate)) {
        throw new AppError(
          "INVALID_DATE",
          "Service date must be in the past",
          400,
          { field: "serviceDate", value: args.serviceDate }
        );
      }
      
      // Business logic
      const budget = await findBudget(ctx, args);
      if (!budget) {
        throw new AppError(
          "NO_BUDGET",
          "No budget available for this service category",
          404
        );
      }
      
      if (budget.remaining < args.totalCost) {
        throw new AppError(
          "INSUFFICIENT_BUDGET",
          "Insufficient budget remaining",
          400,
          { 
            required: args.totalCost, 
            available: budget.remaining 
          }
        );
      }
      
      // Success path
      return await ctx.db.insert("services", {...});
      
    } catch (error) {
      // Log error for monitoring
      await logError(ctx, error);
      throw error;
    }
  },
});
```

---

## Monitoring & Observability

### Audit Logging
```typescript
export async function createAuditLog(
  ctx: MutationCtx,
  data: {
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    metadata?: any;
  }
) {
  await ctx.db.insert("auditLogs", {
    ...data,
    organizationId: ctx.auth.organizationId,
    timestamp: Date.now(),
    ip: ctx.request?.ip,
    userAgent: ctx.request?.userAgent,
  });
}

// Use in mutations
export const deleteParticipant = mutation({
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Soft delete
    await ctx.db.patch(args.id, {
      status: "archived",
      archivedAt: Date.now(),
      archivedBy: user._id,
    });
    
    // Audit log
    await createAuditLog(ctx, {
      action: "participant.archived",
      entityType: "participants",
      entityId: args.id,
      userId: user._id,
      metadata: { reason: args.reason },
    });
  },
});
```

### Performance Metrics
```typescript
// Convex Dashboard provides:
// - Function execution times
// - Database query performance
// - Real-time connection stats
// - Error rates
// - Bandwidth usage

// Custom metrics
export const trackMetric = mutation({
  args: {
    metric: v.string(),
    value: v.number(),
    tags: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("metrics", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
```

---

## Testing Strategy

### Unit Testing Convex Functions
```typescript
// convex/tests/participants.test.ts
import { convexTest } from "convex-test";
import { api } from "./_generated/api";

describe("participants", () => {
  let t: ConvexTest;
  
  beforeEach(() => {
    t = convexTest();
  });
  
  test("create participant", async () => {
    const result = await t.mutation(api.participants.create, {
      ndisNumber: "1234567890",
      profile: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
      },
    });
    
    expect(result).toBeDefined();
    
    const participant = await t.query(api.participants.get, {
      id: result,
    });
    
    expect(participant.ndisNumber).toBe("1234567890");
  });
  
  test("budget tracking", async () => {
    // Create participant with budget
    const participantId = await setupParticipantWithBudget(t);
    
    // Log service
    await t.mutation(api.services.create, {
      participantId,
      totalCost: 100,
      // ...
    });
    
    // Check budget updated
    const budget = await t.query(api.budgets.getByParticipant, {
      participantId,
    });
    
    expect(budget.spent).toBe(100);
    expect(budget.remaining).toBe(900);
  });
});
```

---

## Migration Strategy

### Schema Evolution
```typescript
// convex/migrations/addParticipantTags.ts
export const addParticipantTags = migration({
  handler: async (ctx) => {
    const participants = await ctx.db
      .query("participants")
      .collect();
    
    for (const participant of participants) {
      if (!participant.tags) {
        await ctx.db.patch(participant._id, {
          tags: [],
        });
      }
    }
  },
});
```

---

## Security Considerations

### Data Privacy
- All data encrypted at rest and in transit
- Row-level security via organization isolation
- PII handling compliance with Privacy Act
- Data retention policies enforced

### Rate Limiting
- Built into Convex platform
- Custom rate limiting for sensitive operations
- DDoS protection at edge

### Input Validation
- Convex validators on all function arguments
- Additional business logic validation
- Sanitization of user inputs

---

## Disaster Recovery

### Backup Strategy
- Continuous backups by Convex
- Point-in-time recovery available
- Export functionality for data portability

### High Availability
- Multi-region deployment
- Automatic failover
- Zero-downtime deployments

---

**This architecture leverages Convex's strengths to deliver a robust, scalable, and maintainable backend with minimal operational overhead.**