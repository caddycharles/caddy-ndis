# 🎯 Interactive Elements

## Trust Indicators / Badges
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

## Progress Indicators
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

## Loading States
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
