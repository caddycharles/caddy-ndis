# Caddy UI Design System

> **Version:** 1.0.0  
> **Last Updated:** January 2025  
> **Status:** Active

## 🎨 Design Philosophy

Caddy's design system balances **professionalism** with **approachability**, creating an interface that healthcare workers trust while ensuring it remains delightful to use. We prioritize clarity, accessibility, and efficiency - remembering our users are often on mobile devices, in the field, with limited time.

### Core Principles

1. **Trust Through Consistency** - Every interaction should feel familiar and reliable
2. **Progressive Disclosure** - Show only what's needed, when it's needed
3. **Delightful Micro-interactions** - Small animations and feedback that make the app feel alive
4. **Mobile-First, Always** - Design for thumbs on phones first, then scale up
5. **Accessibility is Non-negotiable** - WCAG 2.1 AA compliance minimum

---

## 🎨 Color Palette

### Primary Brand Colors

```css
/* Primary Gradient - Our signature look */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Individual brand colors */
--color-primary-light: #667eea;  /* Lighter purple */
--color-primary-dark: #764ba2;   /* Darker purple */
```

### Semantic Colors

```css
/* Success States */
--color-success: #10b981;        /* Green for validation/success */
--color-success-light: #d1fae5;  /* Light green background */

/* Error States */
--color-error: #ef4444;          /* Red for errors */
--color-error-light: #fee2e2;    /* Light red background */

/* Warning States */
--color-warning: #f59e0b;        /* Amber for warnings */
--color-warning-light: #fef3c7;  /* Light amber background */

/* Neutral Grays */
--color-gray-900: #111827;       /* Darkest text */
--color-gray-700: #374151;       /* Primary text */
--color-gray-600: #4b5563;       /* Secondary text */
--color-gray-500: #6b7280;       /* Muted text */
--color-gray-400: #9ca3af;       /* Disabled text */
--color-gray-300: #d1d5db;       /* Borders */
--color-gray-200: #e5e7eb;       /* Light borders */
--color-gray-100: #f3f4f6;       /* Light backgrounds */
--color-gray-50: #f9fafb;        /* Lightest backgrounds */
```

### Background Patterns

```css
/* Gradient Backgrounds */
--bg-gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--bg-gradient-light: linear-gradient(to bottom, #f9fafb, #f3f4f6);

/* Pattern Overlay (subtle geometric) */
--bg-pattern: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
```

---

## 📐 Typography

### Font Stack
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
```

### Type Scale
```css
/* Headings */
--text-4xl: 40px;   /* Page titles */
--text-3xl: 36px;   /* Major headings */
--text-2xl: 30px;   /* Section headings */
--text-xl: 24px;    /* Card titles */
--text-lg: 20px;    /* Subtitles */

/* Body */
--text-base: 16px;  /* Default body text */
--text-sm: 14px;    /* Secondary text */
--text-xs: 12px;    /* Captions/labels */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Text Hierarchy Examples

```css
/* Page Title */
h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: white; /* On gradient backgrounds */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Card Title */
.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-gray-900);
}

/* Body Text */
.body-text {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  color: var(--color-gray-700);
  line-height: 1.5;
}
```

---

## 📦 Component Patterns

### Cards

```css
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: none;
  overflow: visible;
  padding: 32px;
}

.card-header {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-gray-200);
}
```

### Buttons

#### Primary Button
```css
.btn-primary {
  height: 52px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  height: 48px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 500;
  background: white;
  color: var(--color-primary-light);
  border: 2px solid var(--color-primary-light);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-primary-light);
  color: white;
}
```

### Form Inputs

```css
.input {
  height: 52px;
  padding: 0 16px;
  font-size: 16px;
  border: 2px solid var(--color-gray-200);
  border-radius: 10px;
  transition: all 0.2s ease;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-light);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Validation States */
.input.valid {
  border-color: var(--color-success);
}

.input.invalid {
  border-color: var(--color-error);
}
```

### Labels
```css
.label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 8px;
  display: block;
}
```

---

## 🎭 Logo Treatment

### Standard Logo
```css
.logo {
  width: 88px;
  height: 88px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.9);
  transform: rotate(-3deg);
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: rotate(0deg) scale(1.05);
}

.logo-text {
  font-size: 36px;
  font-weight: bold;
  color: white;
  transform: rotate(3deg);
}
```

### Small Logo (for headers)
```css
.logo-small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  /* Other properties same as standard */
}
```

---

## 🎯 Interactive Elements

### Trust Indicators / Badges
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gray-700);
}

.badge-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary-light);
}
```

### Progress Indicators
```css
.progress-bar {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.progress-step {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  transition: background 0.3s ease;
}

.progress-step.active {
  background: rgba(255, 255, 255, 0.9);
}
```

### Loading States
```css
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */

/* Container Max Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

---

## ✨ Micro-interactions

### Hover Effects
- **Buttons**: Lift up 2px with shadow
- **Cards**: Subtle shadow increase
- **Links**: Underline with color transition
- **Logo**: Rotate to 0° and scale to 1.05

### Focus States
- **Inputs**: Purple border with soft shadow
- **Buttons**: Outline with 3px offset
- **Links**: Visible outline for keyboard navigation

### Transitions
```css
/* Standard transition timing */
--transition-fast: 0.15s ease;
--transition-normal: 0.2s ease;
--transition-slow: 0.3s ease;
```

---

## 🔒 Accessibility Guidelines

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 against background

### Touch Targets
- **Minimum size**: 44x44px
- **Recommended**: 48x48px
- **Optimal**: 52x52px (current standard)

### Focus Indicators
- Always visible for keyboard navigation
- High contrast outline
- Never remove outline without alternative

### Form Validation
- Don't rely on color alone
- Include icons (✓ for valid, ! for invalid)
- Provide clear error messages
- Announce changes to screen readers

---

## 📏 Spacing System

```css
/* Base unit: 4px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### Common Spacing Patterns
- **Card padding**: 32px
- **Section spacing**: 40px
- **Input spacing**: 24px between fields
- **Button padding**: 24px horizontal
- **Icon gaps**: 8px from text

---

## 🎨 Implementation Examples

### Onboarding Page Pattern
```jsx
// Full-screen gradient background with pattern
<div style={{
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative'
}}>
  {/* Pattern overlay */}
  <div style={{
    position: 'absolute',
    inset: 0,
    backgroundImage: 'var(--bg-pattern)',
  }} />
  
  {/* Content container */}
  <div style={{
    maxWidth: '672px',
    margin: '0 auto',
    padding: '48px 16px'
  }}>
    {/* Your content */}
  </div>
</div>
```

### Form Card Pattern
```jsx
<Card style={{
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  borderRadius: '16px'
}}>
  <CardHeader>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div className="logo-small">
        <Icon />
      </div>
      <div>
        <h2>Title</h2>
        <p>Description</p>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {/* Form content */}
  </CardContent>
</Card>
```

---

## 🚀 Quick Reference Checklist

When creating new UI components, ensure:

- [ ] Uses the gradient color scheme where appropriate
- [ ] Maintains 52px height for primary interactive elements
- [ ] Includes hover/focus states with transitions
- [ ] Has proper spacing using the 4px base unit
- [ ] Includes loading states where applicable
- [ ] Uses consistent border radius (10px for inputs/buttons, 16px for cards)
- [ ] Provides visual feedback for all interactions
- [ ] Maintains WCAG 2.1 AA accessibility standards
- [ ] Works on mobile devices (test at 375px width minimum)
- [ ] Uses professional icons instead of emojis for UI elements
- [ ] References Australian compliance standards (NDIS, APP) not US standards (HIPAA)

---

## 📝 Version History

- **v1.0.0** - Initial design system based on redesigned onboarding page
- Created by: Sally (UX Expert)
- Inspired by: Healthcare sector trust requirements and modern SaaS design patterns

---

## 🔗 Related Documents

- [CLAUDE.md](../CLAUDE.md) - Development guidelines
- [Layout Patterns](./LAYOUT-PATTERNS.md) - Layout component guidelines
- [Story 0.3 Onboarding](./stories/0.3.onboarding.story.md) - Onboarding implementation details