# 🎨 Implementation Examples

## Onboarding Page Pattern
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

## Form Card Pattern
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
