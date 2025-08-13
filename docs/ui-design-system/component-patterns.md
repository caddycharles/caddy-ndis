# 📦 Component Patterns

## Cards

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

## Buttons

### Primary Button
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

### Secondary Button
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

## Form Inputs

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

## Labels
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
