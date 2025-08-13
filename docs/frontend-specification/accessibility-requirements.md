# Accessibility Requirements

## WCAG 2.1 AA Compliance

### Visual
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible outline on all interactive elements
- **Color Independence**: Information not conveyed by color alone
- **Text Resize**: Up to 200% without horizontal scroll

### Interaction
- **Keyboard Navigation**: All features accessible via keyboard
- **Skip Links**: Jump to main content
- **Tab Order**: Logical flow through interface
- **Focus Traps**: Modals contain focus until closed

### Screen Readers
- **ARIA Labels**: All interactive elements labeled
- **Landmark Regions**: Proper HTML5 semantic structure
- **Live Regions**: Announce dynamic updates
- **Alt Text**: All images have descriptions

### Forms
- **Label Association**: All inputs have labels
- **Error Messages**: Clear, specific error text
- **Required Fields**: Clearly marked
- **Instructions**: Help text for complex fields

## Accessibility Features
```html
<!-- Skip Link -->
<a href="#main" class="sr-only focus:not-sr-only">
  Skip to main content
</a>

<!-- ARIA Live Region -->
<div role="status" aria-live="polite" aria-atomic="true">
  <span class="sr-only">3 new messages</span>
</div>

<!-- Accessible Form -->
<label for="participant">
  Participant <span aria-label="required">*</span>
</label>
<select id="participant" required aria-describedby="participant-help">
  <option>Select participant...</option>
</select>
<span id="participant-help">Choose the participant for this service</span>
```

---
