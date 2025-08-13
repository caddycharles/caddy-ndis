# Information Architecture

## Navigation Structure

```
├── Dashboard (Daily Huddle)
├── Participants
│   ├── List View
│   ├── Detail View
│   ├── Add New
│   └── Import CSV
├── Services
│   ├── Today's Services
│   ├── Log Service
│   └── Service History
├── Finances
│   ├── Budget Tracking
│   ├── Generate Claims
│   └── Reports
├── Team
│   ├── Message Board
│   ├── User Management
│   └── Assignments
└── Settings
    ├── Organization
    ├── My Profile
    └── Preferences
```

## URL Structure
```
/                           → Dashboard
/participants              → Participant list
/participants/[id]         → Participant detail
/participants/import       → CSV import
/services/log             → Service logging
/services/today           → Today's schedule
/finances/budgets         → Budget tracking
/finances/claims          → Claims generation
/team/messages            → Message board
/settings                 → Settings
```

---
