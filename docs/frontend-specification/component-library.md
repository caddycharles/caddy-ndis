# Component Library

## Core Components

### 1. Button with Optimistic Updates
```tsx
<Button 
  variant="primary|secondary|danger|ghost"
  size="sm|md|lg"
  loading={isPending}
  disabled={boolean}
  fullWidth={boolean}
  icon={IconComponent}
  onClick={async () => {
    // Convex mutation with optimistic update
    await updateParticipant(data);
  }}
>
  Save Changes
</Button>
```

### 2. Real-time Card
```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.LiveIndicator status={connectionStatus} />
    <Card.Actions>...</Card.Actions>
  </Card.Header>
  <Card.Body>{/* Real-time content */}</Card.Body>
  <Card.Footer>Last synced: {syncTime}</Card.Footer>
</Card>
```

### 3. Live Traffic Light Indicator
```tsx
<TrafficLight 
  value={budget.remaining} // Real-time from Convex
  max={budget.allocated}
  thresholds={{ green: 40, amber: 20 }}
  showLabel={true}
  pulseOnUpdate={true}
/>
```

### 4. Live Quick Stat
```tsx
<QuickStat
  icon={UsersIcon}
  label="Active Participants"
  value={participants.length} // Real-time subscription
  trend={calculateTrend(participants)}
  status="success"
  liveUpdate={true}
/>
```

### 5. Smart Service Field with Convex
```tsx
<ServiceField
  participantId={participantId}
  defaultValue={smartDefaults} // From Convex query
  onQuickFill={() => fillFromHistory()}
  templates={templates} // From Convex
  onSubmit={createService} // Convex mutation
/>
```

### 6. Real-time Message Card
```tsx
<MessageCard
  category="urgent"
  title="System Maintenance"
  content="..."
  author={author} // Real-time user presence
  timestamp={date}
  readBy={readByUsers} // Live updates
  isPinned={true}
  isTyping={typingUsers.length > 0}
/>
```

### 7. Live Budget Bar
```tsx
<BudgetBar
  allocated={budget.allocated}
  spent={budget.spent} // Real-time calculation
  committed={budget.committed}
  category="Core Supports"
  showBurnRate={true}
  animateChanges={true}
/>
```

### 8. TanStack Table with Convex
```tsx
<DataTable
  // TanStack Table with Convex real-time data
  data={useQuery(api.participants.list)}
  columns={columns}
  sorting={sorting}
  filtering={filtering}
  virtualizer={true} // TanStack Virtual for large lists
  onRowClick={handleClick}
  emptyState={<EmptyParticipants />}
/>
```

## Real-time Components

### 9. Connection Status
```tsx
<ConnectionStatus
  status={convexConnectionStatus}
  showOfflineQueue={true}
  pendingMutations={pendingCount}
/>
```

### 10. Live User Avatar Stack
```tsx
<UserPresence
  users={activeUsers} // Real-time from Convex
  maxDisplay={3}
  showActivity={true}
  showCursors={true}
/>
```

### 11. Optimistic Form
```tsx
<OptimisticForm
  mutation={api.services.create}
  onOptimisticUpdate={(store, values) => {
    // Update local state immediately
  }}
  onSuccess={() => toast.success('Saved!')}
  onError={(error) => toast.error(error.message)}
>
  {/* Form fields */}
</OptimisticForm>
```

### 12. Real-time Search
```tsx
<LiveSearch
  query={api.participants.search}
  debounce={300}
  placeholder="Search participants..."
  onResults={(results) => setResults(results)}
  showCount={true}
/>
```

### 13. Activity Feed
```tsx
<ActivityFeed
  activities={useQuery(api.audit.recent)}
  groupByDate={true}
  showUserAvatars={true}
  autoScroll={true}
  maxItems={50}
/>
```

### 14. Sync Indicator
```tsx
<SyncIndicator
  isSyncing={isSyncing}
  lastSync={lastSyncTime}
  pendingChanges={pendingChanges}
  onRetry={() => convex.sync()}
/>
```

---
