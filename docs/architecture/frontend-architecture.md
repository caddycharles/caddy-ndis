# Frontend Architecture

## Overview

The frontend is built with TanStack Start, a modern full-stack React framework that provides file-based routing, server-side rendering, and seamless integration with Convex for real-time data synchronization.

## Project Structure

```
src/
├── routes/                 # TanStack Start file-based routing
│   ├── __root.tsx         # Root layout with providers
│   ├── index.tsx          # Home page (Daily Huddle)
│   ├── auth/              # Authentication routes
│   │   ├── sign-in.tsx    # Sign in page
│   │   └── sign-up.tsx    # Sign up page
│   ├── participants/      # Participant management
│   │   ├── index.tsx      # List view
│   │   ├── $participantId.tsx  # Detail view
│   │   ├── new.tsx        # Create participant
│   │   └── import.tsx     # CSV import
│   ├── services/          # Service delivery
│   │   ├── index.tsx      # Service list
│   │   ├── new.tsx        # Log new service
│   │   └── $serviceId.tsx # Service detail
│   ├── finances/          # Financial management
│   │   ├── index.tsx      # Financial overview
│   │   ├── claims.tsx     # Claims management
│   │   └── budgets.tsx    # Budget tracking
│   ├── team/              # Team management
│   │   ├── index.tsx      # Team directory
│   │   ├── messages.tsx   # Message board
│   │   └── schedule.tsx   # Team schedules
│   └── settings/          # Settings
│       ├── index.tsx      # Settings overview
│       ├── organization.tsx # Org settings
│       └── profile.tsx    # User profile
├── components/
│   ├── ui/                # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── features/          # Feature-specific components
│   │   ├── participants/
│   │   │   ├── participant-card.tsx
│   │   │   ├── participant-form.tsx
│   │   │   └── participant-table.tsx
│   │   ├── services/
│   │   │   ├── service-form.tsx
│   │   │   ├── service-history.tsx
│   │   │   └── smart-defaults.tsx
│   │   ├── budgets/
│   │   │   ├── budget-indicator.tsx
│   │   │   ├── budget-chart.tsx
│   │   │   └── budget-alerts.tsx
│   │   └── dashboard/
│   │       ├── kpi-widget.tsx
│   │       ├── activity-feed.tsx
│   │       └── quick-actions.tsx
│   └── layouts/           # Layout components
│       ├── app-layout.tsx # Main app layout
│       ├── sidebar.tsx    # Navigation sidebar
│       └── header.tsx     # App header
├── convex/                # Convex backend
│   ├── _generated/        # Auto-generated files
│   ├── schema.ts          # Database schema
│   ├── auth.config.ts     # Auth configuration
│   ├── participants.ts    # Participant functions
│   ├── services.ts        # Service functions
│   ├── budgets.ts         # Budget functions
│   ├── claims.ts          # Claims functions
│   ├── messages.ts        # Message functions
│   └── files.ts           # File storage
├── lib/
│   ├── hooks/             # Custom React hooks
│   │   ├── use-auth.ts    # Auth hook
│   │   ├── use-realtime.ts # Real-time data hook
│   │   └── use-offline.ts # Offline support
│   ├── utils/             # Utility functions
│   │   ├── format.ts      # Formatting helpers
│   │   ├── validation.ts  # Validation helpers
│   │   └── ndis.ts        # NDIS-specific utils
│   └── validators/        # Zod schemas
│       ├── participant.ts # Participant schemas
│       ├── service.ts     # Service schemas
│       └── common.ts      # Common schemas
├── stores/                # Zustand stores (UI state only)
│   ├── ui-store.ts        # Global UI state
│   └── preferences.ts     # User preferences
└── styles/
    ├── globals.css        # Global styles
    └── tailwind.css       # Tailwind imports
```

## Routing Strategy

### File-based Routing with TanStack Start

```typescript
// routes/participants/$participantId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export const Route = createFileRoute('/participants/$participantId')({
  component: ParticipantDetail,
  loader: async ({ params }) => {
    // Optional: Preload data for SSR
    return { participantId: params.participantId }
  },
})

function ParticipantDetail() {
  const { participantId } = Route.useParams()
  const participant = useQuery(api.participants.get, { 
    id: participantId 
  })
  
  // Real-time subscription automatically updates UI
  return <ParticipantProfile participant={participant} />
}
```

### Route Organization

- **Public Routes**: `/auth/*` - Sign in, sign up
- **Protected Routes**: All other routes require authentication
- **Nested Layouts**: Shared layouts for route groups
- **Dynamic Routes**: `$param` syntax for parameters
- **Catch-all Routes**: `$.tsx` for 404 handling

## State Management Architecture

### Three-Layer State Strategy

#### 1. Server State (Convex)
```typescript
// Real-time subscriptions for server data
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

function ParticipantList() {
  // Automatically subscribes to real-time updates
  const participants = useQuery(api.participants.list, {
    organizationId: orgId
  })
  
  // Optimistic updates built-in
  const updateParticipant = useMutation(api.participants.update)
  
  return participants?.map(p => (
    <ParticipantCard 
      key={p._id} 
      participant={p}
      onUpdate={(data) => updateParticipant({ id: p._id, ...data })}
    />
  ))
}
```

#### 2. UI State (Zustand)
```typescript
// stores/ui-store.ts
import { create } from 'zustand'

interface UIStore {
  // UI-only state
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  selectedFilters: FilterState
  
  // Actions
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  updateFilters: (filters: Partial<FilterState>) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  theme: 'light',
  selectedFilters: {},
  
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  setTheme: (theme) => set({ theme }),
  updateFilters: (filters) => set((state) => ({ 
    selectedFilters: { ...state.selectedFilters, ...filters }
  })),
}))
```

#### 3. Form State (TanStack Form)
```typescript
// components/features/services/service-form.tsx
import { useForm } from '@tanstack/react-form'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

function ServiceForm({ participantId }: Props) {
  const createService = useMutation(api.services.create)
  
  const form = useForm({
    defaultValues: async () => {
      // Load smart defaults
      const defaults = await convexQuery(api.services.getSmartDefaults, {
        participantId
      })
      return defaults
    },
    onSubmit: async (values) => {
      await createService(values)
    },
    validators: {
      onChange: serviceSchema,
    },
  })
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      {/* Form fields */}
    </form>
  )
}
```

## Component Architecture

### Component Categories

#### 1. UI Components (Shadcn)
- Pure presentation components
- Installed via CLI: `npx shadcn-ui@latest add button`
- Fully customizable
- Accessible by default

#### 2. Feature Components
```typescript
// components/features/participants/participant-card.tsx
interface ParticipantCardProps {
  participant: Doc<"participants">
  onEdit: () => void
  onDelete: () => void
}

export function ParticipantCard({ 
  participant, 
  onEdit, 
  onDelete 
}: ParticipantCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{participant.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <BudgetIndicator budget={participant.budget} />
      </CardContent>
      <CardFooter>
        <Button onClick={onEdit}>Edit</Button>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
```

#### 3. Layout Components
```typescript
// components/layouts/app-layout.tsx
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { sidebarOpen } = useUIStore()
  
  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

## Real-time Features

### Live Subscriptions
```typescript
// All queries are live subscriptions by default
const participants = useQuery(api.participants.list)
// Updates automatically when any client modifies data
```

### Optimistic Updates
```typescript
const updateParticipant = useMutation(api.participants.update)
  .withOptimisticUpdate((localStore, args) => {
    // Update local state immediately
    const current = localStore.getQuery(api.participants.get, { 
      id: args.id 
    })
    if (current) {
      localStore.setQuery(
        api.participants.get,
        { id: args.id },
        { ...current, ...args.updates }
      )
    }
  })
```

### Presence & Collaboration
```typescript
// Show who's viewing/editing
const presence = useQuery(api.presence.getViewers, { 
  documentId 
})

// Live cursor positions
const cursors = useQuery(api.presence.getCursors, { 
  documentId 
})
```

## Performance Optimizations

### 1. Code Splitting
```typescript
// Automatic per-route code splitting with TanStack Start
// Each route is a separate bundle
```

### 2. Virtual Scrolling
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

function LargeList({ items }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  })
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ItemComponent item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 3. Image Optimization
```typescript
// Use Convex file storage with automatic CDN
const imageUrl = useQuery(api.files.getUrl, { 
  storageId: participant.avatarId 
})

// Responsive images
<img 
  src={imageUrl} 
  srcSet={`${imageUrl}?w=400 400w, ${imageUrl}?w=800 800w`}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

### 4. Bundle Optimization
- Tree shaking with Vite
- Dynamic imports for heavy components
- Lazy loading non-critical features
- CSS purging with Tailwind

## Offline Support

### PWA Configuration
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Caddy NDIS',
        short_name: 'Caddy',
        theme_color: '#ffffff',
        icons: [/* ... */],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
}
```

### Offline Data Access
```typescript
// Convex handles offline queue automatically
const createService = useMutation(api.services.create)

// Will queue if offline, sync when reconnected
await createService(data)
```

## Accessibility

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### Implementation
```typescript
// All Shadcn components are accessible by default
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Accessible by default</DialogTitle>
      <DialogDescription>
        Proper ARIA attributes and keyboard handling
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Testing Strategy

### Unit Tests
```typescript
// components/features/participants/participant-card.test.tsx
import { render, screen } from '@testing-library/react'
import { ParticipantCard } from './participant-card'

test('displays participant name', () => {
  const participant = { 
    name: 'John Doe',
    ndisNumber: '1234567890'
  }
  
  render(<ParticipantCard participant={participant} />)
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})
```

### Integration Tests
```typescript
// Test with Convex
import { ConvexTestingHelper } from 'convex-test'

test('creates participant', async () => {
  const t = new ConvexTestingHelper()
  const result = await t.mutation(api.participants.create, {
    name: 'John Doe',
    ndisNumber: '1234567890'
  })
  expect(result).toHaveProperty('_id')
})
```

## Security Best Practices

### Input Sanitization
- Zod validation on all forms
- XSS protection via React
- SQL injection impossible (no SQL)

### Authentication
- Clerk handles auth securely
- JWT validation in Convex
- Role-based access control

### Data Protection
- HTTPS everywhere
- Encrypted at rest
- Row-level security

---