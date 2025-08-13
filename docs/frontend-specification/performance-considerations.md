# Performance Considerations

## Critical Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Optimization Strategies

### Real-time Performance with Convex
- **Automatic Subscriptions**: No polling or manual refetching
- **Optimistic Updates**: Instant UI feedback
- **Edge Caching**: Global distribution via Convex edge
- **Reactive Queries**: Only fetches what changed
- **Offline Queue**: Actions sync when reconnected

### Images with Convex Storage
```typescript
// Convex file storage with CDN
const uploadAvatar = useMutation(api.files.uploadAvatar);
const avatarUrl = useQuery(api.files.getUrl, { 
  storageId: participant.avatarId 
});

// Automatic optimization and CDN delivery
<img src={avatarUrl} loading="lazy" />
```

### Code Splitting with TanStack Start
```typescript
// Automatic route-based splitting
// routes/participants/$id.tsx automatically split

// Manual splitting for heavy components
const BudgetChart = lazy(() => import('./BudgetChart'));

// TanStack Virtual for large lists
import { useVirtualizer } from '@tanstack/react-virtual';
```

### Convex Performance Features
- **No N+1 Queries**: Batch fetching automatic
- **Real-time Without Overhead**: WebSocket multiplexing
- **Automatic Caching**: Reactive invalidation
- **Built-in Rate Limiting**: DDoS protection included
- **Zero Cold Starts**: Always warm edge functions

### Bundle Size with Vite
- **Initial Bundle**: < 50KB with TanStack Start
- **Route Bundles**: Automatic per-route splitting
- **Tree Shaking**: Vite removes unused code
- **Module Federation**: Shared dependencies

### Offline Support
```typescript
// Convex handles offline automatically
const convex = new ConvexReactClient(CONVEX_URL, {
  // Queues mutations when offline
  unsavedChangesWarning: true,
});

// Service worker for static assets
registerSW({
  immediate: true,
  onOfflineReady() {
    // App works offline
  },
});
```

---
