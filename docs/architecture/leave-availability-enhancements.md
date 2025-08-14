# Schema Enhancements: Leave & Availability Management

## 1. Leave Accrual System

### Enhanced Leave Balances Table
```typescript
leaveBalances: defineTable({
  organizationId: v.id("organizations"),
  userId: v.id("users"),
  
  // Leave year
  leaveYear: v.string(), // "2024-2025"
  yearStart: v.string(),
  yearEnd: v.string(),
  
  // Employment details for calculations
  employmentType: v.union(
    v.literal("full_time"),
    v.literal("part_time"),
    v.literal("casual")
  ),
  weeklyHours: v.number(), // For pro-rata calculations
  
  // Accrual configuration
  accrualRules: v.object({
    annual: v.object({
      yearlyEntitlement: v.number(),  // Base entitlement (e.g., 20 days)
      accrualMethod: v.union(
        v.literal("monthly"),          // 1.67 days per month
        v.literal("fortnightly"),       // 0.77 days per fortnight
        v.literal("anniversary"),      // Full amount on anniversary
        v.literal("progressive")       // Based on service length
      ),
      accrualRate: v.number(),        // Days per period
      maxCarryOver: v.number(),       // Max days to carry forward
      maxAccumulation: v.number(),    // Cap on total balance
    }),
    sick: v.object({
      yearlyEntitlement: v.number(),  // e.g., 10 days
      accrualRate: v.number(),
      maxAccumulation: v.optional(v.number()),
      doesCarryOver: v.boolean(),
    }),
    longService: v.object({
      accrualRate: v.number(),        // Days per year of service
      eligibleAfterYears: v.number(), // e.g., 7 years
      maxAccumulation: v.number(),
    }),
  }),
  
  // Current balances (in hours for precision)
  balances: v.object({
    annual: v.object({
      openingBalance: v.number(),     // Start of year
      accrued: v.number(),            // Accrued this year
      taken: v.number(),              // Used this year
      pending: v.number(),            // Awaiting approval
      adjusted: v.number(),           // Manual adjustments
      available: v.number(),          // Current available
      projected: v.number(),          // End of year projection
    }),
    // Similar for other leave types...
  }),
  
  // Service calculation
  serviceDetails: v.object({
    startDate: v.string(),            // Employment start
    continuousServiceYears: v.number(),
    probationComplete: v.boolean(),
    probationEndDate: v.optional(v.string()),
  }),
  
  lastAccrualDate: v.number(),
  nextAccrualDate: v.number(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

### Leave Accrual Transactions Table (New)
```typescript
leaveAccruals: defineTable({
  organizationId: v.id("organizations"),
  userId: v.id("users"),
  balanceId: v.id("leaveBalances"),
  
  // Transaction details
  transactionType: v.union(
    v.literal("accrual"),           // Regular accrual
    v.literal("usage"),             // Leave taken
    v.literal("adjustment"),        // Manual adjustment
    v.literal("carryover"),         // Year-end carry
    v.literal("forfeiture"),        // Lost leave
    v.literal("payout")             // Leave paid out
  ),
  
  leaveType: v.string(),             // "annual", "sick", etc.
  
  // Amount (in hours for precision)
  amount: v.number(),                // Positive for credit, negative for debit
  
  // Calculation details
  calculationDetails: v.optional(v.object({
    periodStart: v.string(),
    periodEnd: v.string(),
    daysInPeriod: v.number(),
    accrualRate: v.number(),
    proRataFactor: v.optional(v.number()), // For part-time
  })),
  
  // Reference
  referenceId: v.optional(v.string()), // leaveRequestId if usage
  notes: v.optional(v.string()),
  
  // Approval
  processedBy: v.union(
    v.literal("system"),             // Automatic accrual
    v.id("users")                    // Manual adjustment
  ),
  
  // Running balance after transaction
  runningBalance: v.number(),
  
  createdAt: v.number(),
})
  .index("by_user_date", ["userId", "createdAt"])
  .index("by_balance", ["balanceId"])
```

### Scheduled Function for Accruals
```typescript
// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run daily at 2 AM
crons.daily(
  "processLeaveAccruals",
  { hourUTC: 2, minuteUTC: 0 },
  internal.leave.processAccruals
);

// convex/leave.ts
export const processAccruals = internalMutation({
  handler: async (ctx) => {
    const today = new Date();
    
    // Get all active employees
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    
    for (const user of users) {
      const balance = await ctx.db
        .query("leaveBalances")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();
      
      if (!balance) continue;
      
      // Check if accrual is due
      if (balance.nextAccrualDate <= today.getTime()) {
        // Calculate accrual based on rules
        const accrualAmount = calculateAccrual(balance);
        
        // Create accrual transaction
        await ctx.db.insert("leaveAccruals", {
          organizationId: user.organizationId,
          userId: user._id,
          balanceId: balance._id,
          transactionType: "accrual",
          leaveType: "annual",
          amount: accrualAmount,
          processedBy: "system",
          runningBalance: balance.balances.annual.available + accrualAmount,
          createdAt: Date.now(),
        });
        
        // Update balance
        await ctx.db.patch(balance._id, {
          "balances.annual.accrued": balance.balances.annual.accrued + accrualAmount,
          "balances.annual.available": balance.balances.annual.available + accrualAmount,
          lastAccrualDate: today.getTime(),
          nextAccrualDate: calculateNextAccrualDate(balance),
        });
      }
    }
  },
});
```

## 2. Employee ID Considerations

### Modern Approach - Remove Employee ID
```typescript
users: defineTable({
  // Primary identifiers
  clerkId: v.string(),              // External auth ID
  // Remove employeeId - not necessary
  
  // Use auto-generated display ID if needed
  displayId: v.string(),             // Auto: "SW-001", "CO-002"
  
  // Or use email as unique identifier
  email: v.string(),                // Already unique
  
  // Rest of fields...
})
```

**Recommendation**: 
- **DON'T use manual employee IDs** - they're outdated
- Use Convex's `_id` for internal references
- Use `clerkId` for auth
- Generate a display ID if needed for human readability (e.g., "SW-001" for Support Worker #1)
- Email is already a unique identifier users remember

## 3. Advanced Staff Availability

### Enhanced Availability Table (New)
```typescript
staffAvailability: defineTable({
  organizationId: v.id("organizations"),
  userId: v.id("users"),
  
  // Availability pattern
  patternType: v.union(
    v.literal("recurring"),          // Weekly pattern
    v.literal("fortnightly"),        // Alternating weeks
    v.literal("monthly"),            // Specific days of month
    v.literal("custom"),             // One-off availability
    v.literal("unavailable")         // Block out period
  ),
  
  // Recurring weekly pattern
  weeklyPattern: v.optional(v.object({
    monday: v.array(v.object({
      startTime: v.string(),         // "09:00"
      endTime: v.string(),           // "17:00"
      available: v.boolean(),
    })),
    tuesday: v.array(v.object({
      startTime: v.string(),
      endTime: v.string(),
      available: v.boolean(),
    })),
    // ... other days
  })),
  
  // Fortnightly pattern
  fortnightlyPattern: v.optional(v.object({
    weekA: v.object({
      // Same structure as weeklyPattern
    }),
    weekB: v.object({
      // Same structure as weeklyPattern
    }),
    startDate: v.string(),           // Which week is week A
  })),
  
  // Monthly pattern
  monthlyPattern: v.optional(v.object({
    daysOfMonth: v.array(v.number()), // [1, 15] for 1st and 15th
    timeSlots: v.array(v.object({
      startTime: v.string(),
      endTime: v.string(),
    })),
  })),
  
  // Date range validity
  effectiveFrom: v.string(),
  effectiveTo: v.optional(v.string()),
  
  // Preferences
  preferences: v.object({
    maxHoursPerDay: v.optional(v.number()),
    maxHoursPerWeek: v.optional(v.number()),
    maxConsecutiveDays: v.optional(v.number()),
    preferredShiftLength: v.optional(v.number()),
    canWorkNights: v.boolean(),
    canWorkWeekends: v.boolean(),
    canWorkPublicHolidays: v.boolean(),
    travelRadius: v.optional(v.number()), // km from home
  }),
  
  // Specific unavailability
  blackoutDates: v.array(v.object({
    startDate: v.string(),
    endDate: v.string(),
    reason: v.optional(v.string()),   // "Annual leave", "Training"
  })),
  
  // Skills/qualifications affecting availability
  restrictions: v.optional(v.object({
    noMedicationAssist: v.boolean(),
    noManualHandling: v.boolean(),
    noPersonalCare: v.boolean(),
    noDriving: v.boolean(),
  })),
  
  // Notes
  notes: v.optional(v.string()),     // "Only available school hours"
  
  isActive: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId", "isActive"])
  .index("by_org", ["organizationId"])
  .index("by_effective", ["effectiveFrom", "effectiveTo"])
```

### Availability Exceptions Table (New)
```typescript
availabilityExceptions: defineTable({
  organizationId: v.id("organizations"),
  userId: v.id("users"),
  availabilityId: v.id("staffAvailability"),
  
  // Exception details
  exceptionType: v.union(
    v.literal("additional"),         // Extra availability
    v.literal("unavailable"),        // Not available
    v.literal("modified")            // Different hours
  ),
  
  date: v.string(),
  
  // Time slots (if available/modified)
  timeSlots: v.optional(v.array(v.object({
    startTime: v.string(),
    endTime: v.string(),
  }))),
  
  reason: v.optional(v.string()),
  
  // Linked to leave request if applicable
  leaveRequestId: v.optional(v.id("leaveRequests")),
  
  createdAt: v.number(),
})
  .index("by_user_date", ["userId", "date"])
  .index("by_leave", ["leaveRequestId"])
```

### Usage Examples

#### Example 1: Fortnightly Thursday Availability
```typescript
// Staff only available every second Thursday
{
  patternType: "fortnightly",
  fortnightlyPattern: {
    weekA: {
      thursday: [{
        startTime: "09:00",
        endTime: "17:00",
        available: true
      }],
      // Other days false
    },
    weekB: {
      // All days false
    },
    startDate: "2024-01-04" // First Thursday of pattern
  },
  effectiveFrom: "2024-01-04",
}
```

#### Example 2: School Hours Only
```typescript
{
  patternType: "recurring",
  weeklyPattern: {
    monday: [{
      startTime: "09:00",
      endTime: "15:00",
      available: true
    }],
    // Similar for Tue-Fri
  },
  blackoutDates: [
    { startDate: "2024-12-20", endDate: "2025-01-28", reason: "School holidays" }
  ],
  notes: "Only available during school terms",
}
```

#### Example 3: Complex Availability
```typescript
{
  patternType: "recurring",
  weeklyPattern: {
    monday: [
      { startTime: "06:00", endTime: "10:00", available: true },
      { startTime: "18:00", endTime: "22:00", available: true }
    ],
    tuesday: [
      { startTime: "06:00", endTime: "22:00", available: true }
    ],
    // ... other days
  },
  preferences: {
    maxHoursPerDay: 8,
    maxHoursPerWeek: 38,
    preferredShiftLength: 4,
  }
}
```

## Implementation Benefits

1. **Leave Management**:
   - Automatic accrual calculations
   - Pro-rata for part-time staff
   - Full audit trail of all transactions
   - Handles complex Australian leave rules

2. **No Employee ID**:
   - Simpler onboarding
   - No duplicate ID management
   - Use email/name for human identification
   - System IDs for technical references

3. **Flexible Availability**:
   - Handles any pattern (weekly, fortnightly, monthly)
   - Multiple time slots per day
   - Blackout dates for leave/training
   - Preferences for rostering algorithms
   - Links to leave requests automatically

## Next Steps

1. Update Story 2.1 with these enhancements
2. Create scheduled functions for leave accruals
3. Build availability checking functions
4. Create UI for complex availability patterns