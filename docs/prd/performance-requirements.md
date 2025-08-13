# Performance Requirements

## Response Times
- Page load: < 2 seconds (3G connection)
- API response: < 500ms (p95)
- Search results: < 300ms
- Dashboard refresh: < 1 second
- CSV import: < 60 seconds (1000 records)

## Scalability
- Support 100 concurrent users per org
- Handle 10,000 API requests/minute
- Process 1,000 services in batch
- Store 1TB documents per org
- Queue 10,000 background jobs

## Availability
- 99.9% uptime SLA (Business hours)
- Planned maintenance windows
- Zero-downtime deployments
- Automatic failover
- Health check monitoring

## Data Limits
- 10MB max file upload
- 1000 records per CSV import
- 100 results per API page
- 90 days audit log retention
- 1GB document storage (Starter)

---
