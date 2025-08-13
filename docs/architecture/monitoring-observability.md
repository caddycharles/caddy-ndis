# Monitoring & Observability

## Monitoring Stack

```typescript
// monitoring/setup.ts
import * as Sentry from '@sentry/nextjs';
import { PostHog } from 'posthog-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

// Error Tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma({ client: prisma }),
  ],
  beforeSend(event) {
    // Scrub sensitive data
    delete event.user?.email;
    delete event.extra?.ndisNumber;
    return event;
  },
});

// Analytics
export const posthog = new PostHog(process.env.POSTHOG_KEY, {
  host: 'https://app.posthog.com',
});

// Metrics
const metricsExporter = new PrometheusExporter({
  port: 9090,
  endpoint: '/metrics',
});

// Custom metrics
export const metrics = {
  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.5, 1, 2, 5],
  }),
  
  activeUsers: new Gauge({
    name: 'active_users_total',
    help: 'Number of active users',
    labelNames: ['organization'],
  }),
  
  claimsProcessed: new Counter({
    name: 'claims_processed_total',
    help: 'Total number of claims processed',
    labelNames: ['status', 'organization'],
  }),
};
```

## Logging Architecture

```typescript
// logging/logger.ts
import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const loggingWinston = new LoggingWinston({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'caddy-api',
    version: process.env.npm_package_version,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    loggingWinston,
  ],
});

// Structured logging
export const logRequest = (req: Request, res: Response) => {
  logger.info('API Request', {
    method: req.method,
    path: req.url,
    statusCode: res.status,
    duration: res.duration,
    userId: req.auth?.userId,
    organizationId: req.auth?.organizationId,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
};
```

---
