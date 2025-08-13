# 🎭 Logo Treatment

## Standard Logo
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

## Small Logo (for headers)
```css
.logo-small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  /* Other properties same as standard */
}
```

---
