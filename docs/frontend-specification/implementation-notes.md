# Implementation Notes

## Technology Recommendations

### Frontend Framework
- **TanStack Start**: File-based routing with end-to-end type safety
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Accessible component primitives
- **Convex**: Real-time backend and database

### Component Architecture
```typescript
// Example component structure with Convex
interface ServiceFormProps {
  participantId: Id<"participants">;
  defaultValues?: Partial<Service>;
}

export const ServiceForm: FC<ServiceFormProps> = ({
  participantId,
  defaultValues
}) => {
  // Real-time participant data
  const participant = useQuery(api.participants.get, { id: participantId });
  
  // Smart defaults from Convex
  const defaults = useQuery(api.services.getSmartDefaults, {
    participantId,
    ...defaultValues
  });
  
  // Mutation with optimistic updates
  const createService = useMutation(api.services.create);
  
  // TanStack Form
  const form = useForm({
    defaultValues: defaults,
    onSubmit: async (values) => {
      await createService({ ...values, participantId });
    }
  });
  
  return (
    <form.Provider>
      <form onSubmit={form.handleSubmit}>
        {/* Form fields with real-time validation */}
      </form>
    </form.Provider>
  );
};
```

### State Management
```typescript
// UI-only state with Zustand
interface UIStore {
  // UI State only
  sidebarOpen: boolean;
  selectedFilters: FilterState;
  viewMode: 'grid' | 'list';
  
  // Actions
  toggleSidebar: () => void;
  setFilters: (filters: FilterState) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

// Server state via Convex subscriptions
const participants = useQuery(api.participants.list);
// Automatically updates when data changes
```

### Real-time Data Integration
```typescript
// Convex real-time subscriptions
function ParticipantDashboard() {
  // Real-time participant list
  const participants = useQuery(api.participants.list, {
    organizationId: orgId,
    status: "active"
  });
  
  // Real-time budget tracking
  const budgets = useQuery(api.budgets.trackAll, {
    participantIds: participants?.map(p => p._id) ?? []
  });
  
  // Optimistic updates
  const updateParticipant = useMutation(api.participants.update)
    .withOptimisticUpdate((localStore, args) => {
      // Update local state immediately
    });
  
  return (
    <Dashboard 
      participants={participants}
      budgets={budgets}
      onUpdate={updateParticipant}
    />
  );
}
```

## CSS Architecture
```scss
// Design tokens
:root {
  // Colors
  --color-primary: #2563EB;
  
  // Spacing
  --space-unit: 0.25rem;
  
  // Typography
  --font-base: 16px;
}

// Component styles
.button {
  @apply px-4 py-2 rounded-md font-medium;
  
  &--primary {
    @apply bg-primary text-white hover:bg-primary-dark;
  }
}
```

## Performance Checklist
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Fonts subset and preloaded
- [ ] Critical CSS inlined
- [ ] Service worker for offline
- [ ] API responses cached
- [ ] Virtual scrolling for long lists
- [ ] Debounced search inputs

## Accessibility Checklist
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA/JAWS)
- [ ] Color contrast verified
- [ ] Focus indicators visible
- [ ] ARIA labels complete
- [ ] Error messages clear
- [ ] Alternative text provided
- [ ] Reduced motion respected

---
