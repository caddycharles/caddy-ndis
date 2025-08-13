import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

// ============================================
// STORY 2.1d: Scheduled Functions Configuration
// ============================================
// This file defines all automated processes that run on schedules
// to maintain data integrity and automate routine tasks.
//
// Scheduling Strategy:
// - Critical operations run hourly (budget alerts)
// - Daily operations run in early morning hours (2-4 AM local time)
// - Resource-intensive operations are staggered to avoid overlap
// ============================================

const crons = cronJobs();

// ============================================
// LEAVE MANAGEMENT AUTOMATION
// ============================================

// Process leave accruals daily at 2 AM UTC
// This function:
// - Calculates accruals based on employment type
// - Handles pro-rata for part-time staff
// - Updates balances and creates transaction records
// - Sets next accrual dates
crons.daily(
  "processLeaveAccruals",
  { hourUTC: 2, minuteUTC: 0 },
  internal.automation.processLeaveAccruals
);

// ============================================
// NDIS PLAN MONITORING
// ============================================

// Check for expiring plans daily at 3 AM UTC
// This function:
// - Identifies plans expiring within 90 days
// - Updates plan status to "expiring_soon"
// - Flags for coordinator review
// - Generates notifications (future story)
crons.daily(
  "checkPlanExpiry",
  { hourUTC: 3, minuteUTC: 0 },
  internal.automation.checkPlanExpiry
);

// ============================================
// BUDGET MONITORING
// ============================================

// Check budget utilization hourly (critical for overspend prevention)
// This function:
// - Calculates current utilization percentages
// - Flags budgets exceeding alert thresholds (typically 80%)
// - Projects potential overspend based on current rate
// - Updates hasAlert flags in ndisBudgets table
crons.hourly(
  "checkBudgetAlerts",
  { minuteUTC: 0 },
  internal.automation.checkBudgetAlerts
);

// ============================================
// INCIDENT MANAGEMENT
// ============================================

// Check for overdue incident items daily at 4 AM UTC
// This function:
// - Identifies overdue corrective actions
// - Flags incomplete investigations
// - Monitors external reporting deadlines
// - Updates incident statuses
crons.daily(
  "checkIncidentReminders",
  { hourUTC: 4, minuteUTC: 0 },
  internal.automation.checkIncidentReminders
);

// ============================================
// DATA RETENTION & COMPLIANCE
// ============================================

// Process data retention monthly on the 1st at 1 AM UTC
// This function:
// - Archives documents past retention period
// - Ensures 7-year retention for audit logs
// - Cleans up expired sessions and temporary data
// - Generates compliance reports
crons.monthly(
  "processDataRetention",
  { day: 1, hourUTC: 1, minuteUTC: 0 },
  internal.automation.processDataRetention
);

// ============================================
// AVAILABILITY UPDATES
// ============================================

// Update staff availability patterns weekly on Sunday at 11 PM UTC
// This function:
// - Activates new availability patterns
// - Expires old patterns
// - Processes recurring exceptions
// - Syncs with leave requests
crons.weekly(
  "updateAvailabilityPatterns",
  { dayOfWeek: "sunday", hourUTC: 23, minuteUTC: 0 },
  internal.automation.updateAvailabilityPatterns
);

// ============================================
// ANNOUNCEMENT MANAGEMENT
// ============================================

// Process announcements daily at midnight UTC
// This function:
// - Publishes scheduled announcements
// - Archives expired announcements
// - Sends reminder notifications for unread critical announcements
crons.daily(
  "processAnnouncements",
  { hourUTC: 0, minuteUTC: 0 },
  internal.automation.processAnnouncements
);

// ============================================
// DOCUMENT EXPIRY
// ============================================

// Check document expiry daily at 5 AM UTC
// This function:
// - Identifies expiring documents (certificates, agreements, etc.)
// - Updates document status
// - Flags for review/renewal
// - Notifies relevant parties
crons.daily(
  "checkDocumentExpiry",
  { hourUTC: 5, minuteUTC: 0 },
  internal.automation.checkDocumentExpiry
);

export default crons;
