# Animation & Transitions

## Principles
- **Purposeful**: Animations guide attention
- **Fast**: 200-300ms for most transitions
- **Smooth**: 60fps minimum
- **Consistent**: Same easing curves throughout

## Standard Transitions
```css
/* Micro-interactions */
--transition-fast: 150ms ease-in-out;

/* Page transitions */
--transition-base: 200ms ease-in-out;

/* Complex animations */
--transition-slow: 300ms ease-in-out;

/* Easing curves */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

## Animation Library
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Scale */
@keyframes scale {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
```

## Interaction Feedback
- **Hover**: Subtle shadow elevation
- **Click**: Scale down slightly (0.98)
- **Loading**: Skeleton screens, not spinners
- **Success**: Green check animation
- **Error**: Shake animation

---
