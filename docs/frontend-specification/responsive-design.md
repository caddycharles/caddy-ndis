# Responsive Design

## Breakpoints
```css
--mobile: 320px - 639px     /* Single column */
--tablet: 640px - 1023px    /* Two columns */
--desktop: 1024px - 1279px  /* Full layout */
--wide: 1280px+             /* Extra margins */
```

## Mobile-First Approach

### Mobile (320-639px)
- Single column layout
- Bottom navigation bar
- Full-width buttons
- Collapsible sections
- Swipe gestures
- Large touch targets (44x44px minimum)

### Tablet (640-1023px)
- Two-column layouts where appropriate
- Side navigation drawer
- Floating action buttons
- Modal dialogs for forms
- Landscape optimization

### Desktop (1024px+)
- Multi-column layouts
- Persistent sidebar
- Hover states
- Keyboard shortcuts
- Dense information display
- Multiple panels

## Critical Mobile Optimizations
```css
/* Large touch targets */
.button-mobile {
  min-height: 44px;
  min-width: 44px;
}

/* Thumb-reachable actions */
.mobile-actions {
  position: fixed;
  bottom: 0;
}

/* Readable text */
.body-text {
  font-size: 16px; /* Prevents zoom on iOS */
  line-height: 1.5;
}
```

---
