# 📐 Typography

## Font Stack
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
```

## Type Scale
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

## Text Hierarchy Examples

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
