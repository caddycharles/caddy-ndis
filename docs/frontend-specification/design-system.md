# Design System

## Color Palette

### Primary Colors
```css
--primary-blue: #2563EB      /* Primary actions, links */
--primary-dark: #1E40AF      /* Hover states */
--primary-light: #DBEAFE     /* Backgrounds */
```

### Status Colors (Traffic Light System)
```css
--status-green: #10B981      /* Good/Safe (>40% budget) */
--status-amber: #F59E0B      /* Warning (20-40% budget) */
--status-red: #EF4444        /* Critical (<20% budget) */
```

### Neutral Colors
```css
--gray-900: #111827          /* Primary text */
--gray-700: #374151          /* Secondary text */
--gray-500: #6B7280          /* Disabled text */
--gray-300: #D1D5DB          /* Borders */
--gray-100: #F3F4F6          /* Backgrounds */
--white: #FFFFFF             /* Cards, modals */
```

### Semantic Colors
```css
--success: #10B981           /* Success messages */
--warning: #F59E0B           /* Warnings */
--error: #EF4444            /* Errors */
--info: #3B82F6             /* Information */
```

## Typography

### Font Stack
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale
```css
--text-xs: 0.75rem;    /* 12px - Captions */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Lead */
--text-xl: 1.25rem;    /* 20px - H3 */
--text-2xl: 1.5rem;    /* 24px - H2 */
--text-3xl: 1.875rem;  /* 30px - H1 */
```

## Spacing System
```css
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-12: 3rem;      /* 48px */
```

## Border Radius
```css
--radius-sm: 0.25rem;  /* Small elements */
--radius-md: 0.375rem; /* Default */
--radius-lg: 0.5rem;   /* Cards */
--radius-xl: 0.75rem;  /* Modals */
--radius-full: 9999px; /* Pills, avatars */
```

## Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
```

## Real-time Indicators

### Connection States
```css
--indicator-online: #10B981;    /* Connected */
--indicator-syncing: #F59E0B;   /* Syncing changes */
--indicator-offline: #6B7280;   /* Offline mode */
--indicator-error: #EF4444;     /* Connection error */
```

### Live Update Animations
```css
@keyframes pulse-update {
  0% { background-color: var(--primary-light); }
  50% { background-color: var(--primary-blue); opacity: 0.3; }
  100% { background-color: transparent; }
}

.live-update {
  animation: pulse-update 1s ease-out;
}
```

### Real-time Badges
```css
.badge-live {
  background: var(--status-green);
  animation: pulse 2s infinite;
}

.badge-syncing {
  background: var(--status-amber);
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## Optimistic UI Patterns

### Pending States
```css
.optimistic-pending {
  opacity: 0.7;
  position: relative;
}

.optimistic-pending::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Success Confirmations
```css
.confirm-success {
  animation: checkmark 0.5s ease-out;
}

@keyframes checkmark {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
```

## Collaborative Features

### User Presence
```css
.user-cursor {
  --user-color: var(--primary-blue);
  border: 2px solid var(--user-color);
  background: var(--user-color);
  border-radius: var(--radius-full);
  width: 8px;
  height: 8px;
}

.user-selection {
  background: var(--user-color);
  opacity: 0.2;
  border: 1px solid var(--user-color);
}
```

### Activity Indicators
```css
.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: var(--gray-500);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
```

---
