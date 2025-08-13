# Security Architecture

## Authentication & Authorization

```typescript
// auth/rbac.ts
export const permissions = {
  PLATFORM_ADMIN: ['*'],
  ORG_ADMIN: [
    'organization:*',
    'user:*',
    'participant:*',
    'service:*',
    'claim:*',
    'message:*',
  ],
  FINANCE: [
    'participant:read',
    'service:*',
    'claim:*',
    'budget:read',
  ],
  COORDINATOR: [
    'participant:*',
    'service:*',
    'budget:read',
    'message:read',
  ],
  SUPPORT_WORKER: [
    'participant:read:assigned',
    'service:create:own',
    'service:read:own',
    'message:read',
  ],
};

export const checkPermission = (
  user: User,
  permission: string,
  resource?: any
): boolean => {
  const userPermissions = permissions[user.role];
  
  // Check wildcard permissions
  if (userPermissions.includes('*')) return true;
  
  // Check specific permission
  if (userPermissions.includes(permission)) {
    // Additional resource-based checks
    if (permission.includes(':assigned') && resource) {
      return user.assignedParticipants.includes(resource.id);
    }
    if (permission.includes(':own') && resource) {
      return resource.userId === user.id;
    }
    return true;
  }
  
  // Check wildcard within category
  const [category] = permission.split(':');
  return userPermissions.includes(`${category}:*`);
};
```

## Encryption Strategy

```typescript
// encryption/data.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;
  
  constructor() {
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  }
  
  encrypt(text: string): EncryptedData {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }
  
  decrypt(data: EncryptedData): string {
    const decipher = createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(data.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));
    
    let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Database field encryption
export const encryptedFields = {
  participant: ['medicare_number', 'bank_account'],
  user: ['phone', 'emergency_contact'],
  document: ['content'],
};
```

## API Security

```typescript
// security/api.ts
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.clerk.com https://api.caddy.team",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// Rate limiting per endpoint
export const rateLimits = {
  '/api/auth/login': { requests: 5, window: 300 }, // 5 per 5 mins
  '/api/auth/register': { requests: 3, window: 3600 }, // 3 per hour
  '/api/participants': { requests: 100, window: 60 }, // 100 per minute
  '/api/services': { requests: 200, window: 60 }, // 200 per minute
  '/api/claims/generate': { requests: 10, window: 300 }, // 10 per 5 mins
  '/api/import': { requests: 5, window: 3600 }, // 5 per hour
};

// Input validation
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        sanitizeInput(value),
      ])
    );
  }
  return input;
};
```

---
