# User Roles & Permissions

## Authentication Provider
**Clerk** will be used for authentication with the following implementation:

## Platform Roles

### Platform Admin (Super Admin)
- **Scope:** Cross-organization management
- **Permissions:**
  - Manage organization accounts
  - Access platform analytics
  - Configure platform-wide settings
  - Manage billing and subscriptions
  - Support ticket access

## Organization Roles (Hierarchical)

### 1. Organization Admin (Highest)
**Inherits:** All lower role permissions  
**Unique Permissions:**
- User management (create, update, archive users)
- Organization settings configuration
- Billing and subscription management
- Access all participant data
- Configure role permissions
- Export all data
- Archive/restore participants and employees
- Message board administration

### 2. Finance Officer
**Inherits:** Support Coordinator + Support Worker permissions  
**Unique Permissions:**
- Approve/reject timesheets
- Generate and submit claims
- Access financial reports
- View all participant budgets
- Process invoices
- Export financial data
- Bulk claim operations

### 3. Support Coordinator
**Inherits:** Support Worker permissions  
**Unique Permissions:**
- Manage participant profiles
- Assign support workers to participants
- View all assigned participant data
- Create and modify service bookings
- Access compliance reports
- Team coordination features
- Delegate access during leave

### 4. Support Worker (Lowest)
**Base Permissions:**
- View assigned participants only
- Log service delivery
- Create shift notes
- View participant budgets (assigned only)
- Upload incident reports
- View message board
- Update own profile

## Clerk Implementation Details

```typescript
// User metadata structure in Clerk
interface ClerkUserMetadata {
  organizationId: string;
  role: 'platform_admin' | 'org_admin' | 'finance' | 'coordinator' | 'support_worker';
  permissions: string[];
  delegatedAccess?: {
    from: string;
    until: Date;
    participants: string[];
  };
}
```

## Permission Matrix

| Feature | Platform Admin | Org Admin | Finance | Coordinator | Support Worker |
|---------|---------------|-----------|---------|-------------|----------------|
| Platform Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Financial Operations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Participant Management | ✅ | ✅ | ✅ | ✅ | ❌ |
| Service Delivery | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Assigned Only | ❌ | ❌ | ❌ | ❌ | ✅ |

---
