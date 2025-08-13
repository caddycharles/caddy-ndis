# Data Architecture

## Convex Schema Design

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Organizations
  organizations: defineTable({
    name: v.string(),
    abn: v.optional(v.string()),
    settings: v.object({
      timezone: v.string(),
      currency: v.string(),
      ndisRegistration: v.optional(v.string()),
    }),
    subscription: v.object({
      plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
      status: v.string(),
      validUntil: v.number(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_abn", ["abn"])
    .index("by_created", ["createdAt"]),

  // Users with Clerk integration
  users: defineTable({
    clerkId: v.string(),
    organizationId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("coordinator"), v.literal("support_worker")),
    profile: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      avatar: v.optional(v.id("_storage")),
    }),
    permissions: v.array(v.string()),
    isActive: v.boolean(),
    lastActive: v.number(),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_org", ["organizationId"])
    .index("by_org_role", ["organizationId", "role"]),

  // Participants
  participants: defineTable({
    organizationId: v.id("organizations"),
    ndisNumber: v.string(),
    profile: v.object({
      firstName: v.string(),
      lastName: v.string(),
      dateOfBirth: v.string(),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      address: v.optional(v.object({
        street: v.string(),
        suburb: v.string(),
        state: v.string(),
        postcode: v.string(),
      })),
    }),
    plan: v.object({
      startDate: v.string(),
      endDate: v.string(),
      totalBudget: v.number(),
      planManagerId: v.optional(v.string()),
      supportCoordinatorId: v.optional(v.id("users")),
    }),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("archived")),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["organizationId"])
    .index("by_ndis", ["ndisNumber"])
    .index("by_org_status", ["organizationId", "status"])
    .searchIndex("search_participants", {
      searchField: "profile",
      filterFields: ["organizationId", "status"],
    }),

  // Budget Categories
  budgets: defineTable({
    participantId: v.id("participants"),
    category: v.string(),
    supportCategory: v.string(),
    allocated: v.number(),
    spent: v.number(),
    committed: v.number(),
    remaining: v.number(),
    period: v.object({
      startDate: v.string(),
      endDate: v.string(),
    }),
    alerts: v.array(v.object({
      type: v.string(),
      threshold: v.number(),
      triggered: v.boolean(),
    })),
    updatedAt: v.number(),
  })
    .index("by_participant", ["participantId"])
    .index("by_participant_category", ["participantId", "category"]),

  // Service Delivery
  services: defineTable({
    organizationId: v.id("organizations"),
    participantId: v.id("participants"),
    budgetId: v.id("budgets"),
    supportWorkerId: v.id("users"),
    serviceDate: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    duration: v.number(),
    supportItem: v.object({
      code: v.string(),
      description: v.string(),
      rate: v.number(),
    }),
    notes: v.string(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
      v.literal("billed")
    ),
    claimId: v.optional(v.id("claims")),
    attachments: v.array(v.id("_storage")),
    location: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
      address: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org_date", ["organizationId", "serviceDate"])
    .index("by_participant_date", ["participantId", "serviceDate"])
    .index("by_worker_date", ["supportWorkerId", "serviceDate"])
    .index("by_status", ["status"])
    .index("by_claim", ["claimId"]),

  // Claims
  claims: defineTable({
    organizationId: v.id("organizations"),
    claimNumber: v.string(),
    periodStart: v.string(),
    periodEnd: v.string(),
    services: v.array(v.id("services")),
    totalAmount: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("paid")
    ),
    submittedAt: v.optional(v.number()),
    processedAt: v.optional(v.number()),
    ndisResponse: v.optional(v.object({
      referenceNumber: v.string(),
      errors: v.array(v.string()),
      warnings: v.array(v.string()),
    })),
    createdAt: v.number(),
  })
    .index("by_org_period", ["organizationId", "periodStart"])
    .index("by_status", ["status"])
    .index("by_number", ["claimNumber"]),

  // Compliance Documents
  documents: defineTable({
    organizationId: v.id("organizations"),
    participantId: v.optional(v.id("participants")),
    type: v.string(),
    title: v.string(),
    fileId: v.id("_storage"),
    metadata: v.object({
      size: v.number(),
      mimeType: v.string(),
      uploadedBy: v.id("users"),
      version: v.number(),
    }),
    tags: v.array(v.string()),
    expiryDate: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_org", ["organizationId"])
    .index("by_participant", ["participantId"])
    .index("by_type", ["type"])
    .index("by_expiry", ["expiryDate"]),

  // Audit Logs (automatic with Convex)
  auditLogs: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    changes: v.any(),
    metadata: v.object({
      ip: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      source: v.string(),
    }),
    timestamp: v.number(),
  })
    .index("by_org_time", ["organizationId", "timestamp"])
    .index("by_user", ["userId"])
    .index("by_entity", ["entityType", "entityId"]),
});
```

## Data Access Patterns

```typescript
// convex/participants.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Real-time participant list with search
export const list = query({
  args: {
    organizationId: v.id("organizations"),
    search: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Automatic real-time subscription
    let participants = await ctx.db
      .query("participants")
      .withIndex("by_org_status", (q) =>
        q.eq("organizationId", args.organizationId)
          .eq("status", args.status ?? "active")
      )
      .collect();

    // Search filtering
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      participants = participants.filter(
        (p) =>
          p.profile.firstName.toLowerCase().includes(searchLower) ||
          p.profile.lastName.toLowerCase().includes(searchLower) ||
          p.ndisNumber.includes(args.search!)
      );
    }

    // Include related data
    return Promise.all(
      participants.map(async (p) => ({
        ...p,
        budgets: await ctx.db
          .query("budgets")
          .withIndex("by_participant", (q) => q.eq("participantId", p._id))
          .collect(),
        recentServices: await ctx.db
          .query("services")
          .withIndex("by_participant_date", (q) => q.eq("participantId", p._id))
          .order("desc")
          .take(5),
      }))
    );
  },
});

// Update with optimistic updates
export const update = mutation({
  args: {
    id: v.id("participants"),
    updates: v.object({
      profile: v.optional(v.any()),
      plan: v.optional(v.any()),
      status: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db.get(args.id);
    if (!participant) throw new Error("Participant not found");

    // Update with automatic conflict resolution
    await ctx.db.patch(args.id, {
      ...args.updates,
      updatedAt: Date.now(),
    });

    // Audit log automatically created
    await ctx.db.insert("auditLogs", {
      organizationId: participant.organizationId,
      userId: ctx.auth.userId,
      action: "update",
      entityType: "participant",
      entityId: args.id,
      changes: args.updates,
      metadata: { source: "web" },
      timestamp: Date.now(),
    });

    return args.id;
  },
});
```

## Real-time Subscriptions

```typescript
// convex/budgets.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// Real-time budget tracking
export const trackBudget = query({
  args: {
    participantId: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_participant", (q) => q.eq("participantId", args.participantId))
      .collect();

    // Calculate real-time spending
    const services = await ctx.db
      .query("services")
      .withIndex("by_participant_date", (q) => q.eq("participantId", args.participantId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    return budgets.map((budget) => {
      const spent = services
        .filter((s) => s.budgetId === budget._id)
        .reduce((sum, s) => sum + s.duration * s.supportItem.rate, 0);

      const remaining = budget.allocated - spent;
      const percentUsed = (spent / budget.allocated) * 100;

      return {
        ...budget,
        spent,
        remaining,
        percentUsed,
        status: percentUsed > 80 ? "critical" : percentUsed > 60 ? "warning" : "healthy",
      };
    });
  },
});
```

## Offline Support & Sync

```typescript
// Frontend usage with automatic offline support
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function ServiceLogger() {
  // Automatic offline queue
  const createService = useMutation(api.services.create);
  
  const handleSubmit = async (data: ServiceData) => {
    // Works offline - queued and synced when online
    await createService({
      ...data,
      // Optimistic ID generated client-side
      tempId: crypto.randomUUID(),
    });
  };

  // Real-time updates when back online
  const services = useQuery(api.services.list);
  
  return (
    <div>
      {/* UI automatically updates when sync completes */}
      {services?.map(s => <ServiceCard key={s._id} {...s} />)}
    </div>
  );
}
```

## Data Migration Strategy

```typescript
// convex/migrations/importFromCSV.ts
import { action } from "../_generated/server";
import { v } from "convex/values";

export const importParticipants = action({
  args: {
    csvData: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const rows = parseCSV(args.csvData);
    const results = { success: 0, failed: 0, errors: [] };

    for (const row of rows) {
      try {
        // Validate and transform data
        const participant = {
          organizationId: args.organizationId,
          ndisNumber: row["NDIS Number"],
          profile: {
            firstName: row["First Name"],
            lastName: row["Last Name"],
            dateOfBirth: row["Date of Birth"],
            email: row["Email"] || undefined,
            phone: row["Phone"] || undefined,
          },
          plan: {
            startDate: row["Plan Start"],
            endDate: row["Plan End"],
            totalBudget: parseFloat(row["Total Budget"]),
          },
          status: "active" as const,
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Insert with automatic deduplication
        await ctx.runMutation(api.participants.createOrUpdate, participant);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ row: row["NDIS Number"], error: error.message });
      }
    }

    return results;
  },
});
```

## Performance & Scaling

```typescript
// Automatic with Convex - no manual optimization needed

// Convex handles:
// - Connection pooling automatically
// - Query optimization and indexing
// - Caching and invalidation
// - Horizontal scaling
// - Global edge distribution

// Example of built-in performance features:
export const dashboardData = query({
  handler: async (ctx) => {
    // Parallel queries automatically optimized
    const [participants, services, claims] = await Promise.all([
      ctx.db.query("participants").take(100),
      ctx.db.query("services")
        .withIndex("by_org_date")
        .order("desc")
        .take(50),
      ctx.db.query("claims")
        .withIndex("by_status", (q) => q.eq("status", "draft"))
        .collect(),
    ]);

    // Automatic caching and real-time updates
    return {
      participantCount: participants.length,
      todayServices: services.filter(s => isToday(s.serviceDate)),
      pendingClaims: claims.length,
      // Updates automatically when any data changes
    };
  },
});
```

---