# Data Model

## Core Entities

```prisma
model Organization {
  id                String   @id @default(cuid())
  name              String
  abn               String?
  contactEmail      String
  contactPhone      String?
  address           Json?
  settings          Json     @default("{}")
  subscriptionTier  String   @default("free_beta")
  subscriptionEnd   DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
  
  users             User[]
  participants      Participant[]
  services          Service[]
  claims            Claim[]
  messages          Message[]
  auditLogs         AuditLog[]
}

model User {
  id                String   @id @default(cuid())
  clerkId           String   @unique
  email             String
  firstName         String
  lastName          String
  role              Role
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  isActive          Boolean  @default(true)
  lastLogin         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
  
  assignedParticipants ParticipantAssignment[]
  services          Service[]
  auditLogs         AuditLog[]
  messageReads      MessageRead[]
}

model Participant {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  ndisNumber        String
  firstName         String
  lastName          String
  dateOfBirth       DateTime?
  email             String?
  phone             String?
  address           Json?
  planStartDate     DateTime
  planEndDate       DateTime
  planCategories    Json     // NDIS funding categories
  totalBudget       Decimal
  contactPerson     Json?
  externalProviders Json?    // Track external providers
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  archivedAt        DateTime?
  deletedAt         DateTime? // Auto-delete after 7 years from archivedAt
  
  assignments       ParticipantAssignment[]
  services          Service[]
  budgets           Budget[]
  documents         Document[]
  notes             Note[]
  
  @@unique([organizationId, ndisNumber])
  @@index([organizationId])
  @@index([ndisNumber])
}

model ParticipantAssignment {
  id                String   @id @default(cuid())
  participantId     String
  participant       Participant @relation(fields: [participantId], references: [id])
  userId            String
  user              User @relation(fields: [userId], references: [id])
  role              String   // coordinator, support_worker
  startDate         DateTime @default(now())
  endDate           DateTime?
  createdAt         DateTime @default(now())
  
  @@unique([participantId, userId, role])
  @@index([userId])
  @@index([participantId])
}

model Service {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  participantId     String
  participant       Participant @relation(fields: [participantId], references: [id])
  userId            String
  user              User @relation(fields: [userId], references: [id])
  serviceDate       DateTime
  startTime         DateTime
  endTime           DateTime
  duration          Int      // minutes
  supportCategory   String   // NDIS support category
  supportItem       String   // NDIS support item code
  rate              Decimal
  totalCost         Decimal
  notes             String?
  attachments       Json?
  status            ServiceStatus @default(DRAFT)
  claimId           String?
  claim             Claim? @relation(fields: [claimId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
  
  @@index([organizationId, serviceDate])
  @@index([participantId])
  @@index([userId])
  @@index([claimId])
}

model Claim {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  claimNumber       String
  startDate         DateTime
  endDate           DateTime
  totalAmount       Decimal
  status            ClaimStatus @default(DRAFT)
  submittedAt       DateTime?
  submittedBy       String?
  ndisResponse      Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  services          Service[]
  
  @@unique([organizationId, claimNumber])
  @@index([organizationId, status])
}

model Budget {
  id                String   @id @default(cuid())
  participantId     String
  participant       Participant @relation(fields: [participantId], references: [id])
  category          String   // NDIS category
  allocated         Decimal
  spent             Decimal  @default(0)
  remaining         Decimal
  startDate         DateTime
  endDate           DateTime
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([participantId, category, startDate])
  @@index([participantId])
}

model Message {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  authorId          String
  title             String
  content           String   @db.Text
  category          MessageCategory
  isPinned          Boolean  @default(false)
  publishAt         DateTime @default(now())
  expiresAt         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
  
  reads             MessageRead[]
  
  @@index([organizationId, isPinned])
  @@index([organizationId, publishAt])
}

model MessageRead {
  id                String   @id @default(cuid())
  messageId         String
  message           Message @relation(fields: [messageId], references: [id])
  userId            String
  user              User @relation(fields: [userId], references: [id])
  readAt            DateTime @default(now())
  
  @@unique([messageId, userId])
  @@index([userId])
}

model Document {
  id                String   @id @default(cuid())
  participantId     String
  participant       Participant @relation(fields: [participantId], references: [id])
  type              DocumentType
  name              String
  url               String
  expiryDate        DateTime?
  uploadedBy        String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
  
  @@index([participantId])
  @@index([type])
}

model Note {
  id                String   @id @default(cuid())
  participantId     String
  participant       Participant @relation(fields: [participantId], references: [id])
  content           String   @db.Text
  type              NoteType
  authorId          String
  version           Int      @default(1)
  previousVersion   String?  // Reference to previous note ID
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
  
  @@index([participantId])
  @@index([type])
}

model AuditLog {
  id                String   @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  userId            String?
  user              User? @relation(fields: [userId], references: [id])
  action            String
  entity            String
  entityId          String
  oldValue          Json?
  newValue          Json?
  ipAddress         String?
  userAgent         String?
  createdAt         DateTime @default(now())
  
  @@index([organizationId])
  @@index([entity, entityId])
  @@index([userId])
  @@index([createdAt])
}

// Enums
enum Role {
  PLATFORM_ADMIN
  ORG_ADMIN
  FINANCE
  COORDINATOR
  SUPPORT_WORKER
}

enum ServiceStatus {
  DRAFT
  SUBMITTED
  CLAIMED
  REJECTED
}

enum ClaimStatus {
  DRAFT
  SUBMITTED
  ACCEPTED
  REJECTED
  PAID
}

enum MessageCategory {
  URGENT
  POLICY
  FYI
  GENERAL
}

enum DocumentType {
  SERVICE_AGREEMENT
  NDIS_PLAN
  INCIDENT_REPORT
  ASSESSMENT
  OTHER
}

enum NoteType {
  SHIFT_NOTE
  INCIDENT
  PROGRESS
  GENERAL
}
```

---
