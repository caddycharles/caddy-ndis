# Screen Specifications

## 1. Daily Huddle Dashboard

### Layout
```
┌─────────────────────────────────────────────┐
│ HEADER: Logo | Navigation | User Menu       │
├─────────────────────────────────────────────┤
│ GREETING: Good morning, Sarah! 📅 Aug 9     │
├─────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────┐│
│ │Today's Stats│ │ Alerts (3)  │ │Quick Act││
│ │ 8 Services  │ │ ⚠️ Budget   │ │+Service ││
│ │ 5 Workers   │ │ 📄 Missing  │ │+Note    ││
│ │ $2,340      │ │ 🎂 Birthday │ │+Claim   ││
│ └─────────────┘ └─────────────┘ └─────────┘│
├─────────────────────────────────────────────┤
│ TODAY'S SCHEDULE                            │
│ ┌─────────────────────────────────────────┐│
│ │ 9:00 │ John D. │ Personal Care │ Sarah  ││
│ │ 11:00│ Mary S. │ Transport    │ Mike   ││
│ │ 2:00 │ Peter L.│ Social       │ Sarah  ││
│ └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│ TEAM MESSAGES                               │
│ ┌─────────────────────────────────────────┐│
│ │📌 Policy Update - All must read by 5pm   ││
│ │ℹ️ New participant starting Monday        ││
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### Key Elements
- **Greeting Bar**: Personalized with date and weather
- **Stats Cards**: Real-time metrics with icons
- **Alert Panel**: Color-coded priority alerts
- **Quick Actions**: One-click common tasks
- **Schedule Timeline**: Visual timeline with participant photos
- **Message Board Preview**: Pinned and recent messages

## 2. Participant List

### Layout
```
┌─────────────────────────────────────────────┐
│ HEADER                                      │
├─────────────────────────────────────────────┤
│ Participants (127 active)                   │
│ [Search...] [Filter▼] [+ Add] [⬆Import CSV] │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐│
│ │ □ │Name     │NDIS #    │Budget│Team    ││
│ ├───┼─────────┼──────────┼──────┼────────┤│
│ │ □ │John Doe │430043674 │🟢 68%│Sarah   ││
│ │ □ │Mary S.  │430045671 │🟡 35%│Mike    ││
│ │ □ │Peter L. │430425780 │🔴 12%│Sarah   ││
│ └─────────────────────────────────────────┘│
│ [Previous] Page 1 of 7 [Next]               │
└─────────────────────────────────────────────┘
```

### Features
- **Search**: Real-time filtering by name/NDIS number
- **Filters**: Status, coordinator, budget status
- **Bulk Actions**: Select multiple for assignment
- **Traffic Lights**: Visual budget indicators
- **Quick Actions**: Row-level edit/view/archive
- **Pagination**: 20 per page with jump-to

## 3. Service Logging Form

### Layout (Mobile Optimized)
```
┌──────────────────────────┐
│ Log Service             X│
├──────────────────────────┤
│ PARTICIPANT              │
│ [John Doe ▼]            │
├──────────────────────────┤
│ DATE & TIME              │
│ [Today ▼] [9:00-11:00]  │
├──────────────────────────┤
│ SERVICE TYPE             │
│ ┌──────────────────────┐│
│ │ ✓ Personal Care      ││
│ │ ○ Transport          ││
│ │ ○ Social Support     ││
│ └──────────────────────┘│
├──────────────────────────┤
│ QUICK NOTE               │
│ [Assisted with morning..│
│  routines, medication...]│
│ Templates: [Morning][Med]│
├──────────────────────────┤
│ [Same as Yesterday] 🔄   │
├──────────────────────────┤
│ [Cancel] [Save & Next]   │
└──────────────────────────┘
```

### Smart Features
- **Auto-fill**: Based on time and history
- **Templates**: Common note templates
- **Same as Yesterday**: One-click repeat
- **Save & Next**: Continue to next participant
- **Offline Queue**: Works without connection

## 4. Budget Tracking Dashboard

### Layout
```
┌─────────────────────────────────────────────┐
│ Budget Overview - John Doe (430043674)      │
├─────────────────────────────────────────────┤
│ Plan Period: Jan 1 - Dec 31, 2024 (145 days)│
├─────────────────────────────────────────────┤
│ TOTAL BUDGET                                │
│ ┌─────────────────────────────────────────┐│
│ │ $50,000 allocated                       ││
│ │ ████████████░░░░░░░ 68% ($34,000)      ││
│ │ Remaining: $16,000 | Burn: $234/day     ││
│ └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│ BY CATEGORY                                 │
│ ┌─────────────────────────────────────────┐│
│ │ Core Supports      🟢 $12,000 (75%)     ││
│ │ Capacity Building  🟡 $3,000 (30%)      ││
│ │ Capital            🔴 $500 (10%)        ││
│ └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│ SPENDING TREND (Last 3 Months)             │
│ [====Graph showing monthly spending====]    │
└─────────────────────────────────────────────┘
```

## 5. Message Board

### Layout
```
┌─────────────────────────────────────────────┐
│ Team Messages                               │
├─────────────────────────────────────────────┤
│ [All] [Urgent] [Policy] [FYI] [+ New Post]  │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐│
│ │📌 PINNED: Compliance Training Due        ││
│ │ By: Admin | Posted: 2 days ago          ││
│ │ All staff must complete training by...  ││
│ │ ✓ Read by 12/15 staff [View all]       ││
│ └─────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────┐│
│ │🚨 URGENT: System Maintenance Tonight    ││
│ │ By: Admin | Posted: 1 hour ago          ││
│ │ The system will be unavailable from...  ││
│ │ ✓ Read by 8/15 staff [Mark as read]    ││
│ └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

---
