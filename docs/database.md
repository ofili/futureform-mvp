# Database Schema

## Overview

FutureForm uses PostgreSQL as its primary database, managed through Prisma ORM. The schema is designed for multi-tenancy with organization-level data isolation.

## Core Models

### User

User accounts and authentication.

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String
  firstName         String
  lastName          String
  jobTitle          String?
  department        String?
  role              UserRole  @default(USER)
  verified          Boolean   @default(false)
  emailVerified     Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

enum UserRole {
  USER
  ADMIN
  PARTNER
}
```

**Key Fields:**
- `role`: Platform-level role (USER, ADMIN, PARTNER)
- `verified`: Account verification status
- `emailVerified`: Email verification status

**Indexes:**
- `email` (unique)

### Organization

Multi-tenant organizations.

```prisma
model Organization {
  id                   String   @id @default(cuid())
  name                 String
  type                 String
  sectorFocus          String?
  region               String
  country              String?
  relationshipStage    String   @default("Discovery")
  source               String?
  pilotAgreementSigned Boolean  @default(false)
  caseStudyApproval    Boolean  @default(false)
  tierId               String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

**Key Fields:**
- `type`: Organization type (Government, Private Sector, NGO, etc.)
- `relationshipStage`: Current relationship stage
- `tierId`: Subscription tier reference

**Relationships:**
- Has many `OrganizationMember`
- Has many `Project`
- Has many `Credit`
- Belongs to `SubscriptionTier`

### OrganizationMember

User membership in organizations with roles.

```prisma
model OrganizationMember {
  id             String           @id @default(cuid())
  userId         String
  organizationId String
  role           OrganizationRole @default(MEMBER)
  joinedAt       DateTime         @default(now())
}

enum OrganizationRole {
  OWNER
  ORG_ADMIN
  ADMIN
  MEMBER
  REVIEWER
  DOMAIN_EXPERT
  OBSERVER
  CREDIT_MANAGER
  PROJECT_ADMIN
}
```

**Key Fields:**
- `role`: Organization-level role with specific permissions

**Indexes:**
- `[userId, organizationId]` (unique composite)

## Project & Assessment Models

### Project

Assessment projects.

```prisma
model Project {
  id             String        @id @default(cuid())
  name           String
  description    String?
  type           ProjectType
  sector         String
  region         String
  country        String?
  status         ProjectStatus @default(PLANNING)
  objectives     String?
  createdById    String
  organizationId String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

enum ProjectType {
  PRE_INVESTMENT_DUE_DILIGENCE
  VENDOR_SELECTION_PROCUREMENT
  PORTFOLIO_MONITORING
  GOVERNANCE_AUDIT
  MULTI_STAKEHOLDER_ALIGNMENT
}

enum ProjectStatus {
  PLANNING
  ACTIVE
  COMPLETED
  ARCHIVED
}
```

**Relationships:**
- Belongs to `User` (creator)
- Belongs to `Organization`
- Has many `Assessment`
- Has many `ProjectTeamMember`

### Assessment

Trust assessments of partners.

```prisma
model Assessment {
  id              String           @id @default(cuid())
  projectId       String
  partnerGlobalId String?
  partnerAliasId  String?
  status          AssessmentStatus @default(PENDING)
  token           String           @unique
  type            String?
  depth           String?
  deadline        DateTime?
  overallScore    Int?
  confidenceLevel Int?
  invitedAt       DateTime         @default(now())
  completedAt     DateTime?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

enum AssessmentStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  EXPIRED
}
```

**Key Fields:**
- `token`: Unique invitation token
- `depth`: Assessment depth (quick, standard, deep)
- `overallScore`: Calculated trust score (0-100)
- `confidenceLevel`: Confidence in assessment (0-100)

**Relationships:**
- Belongs to `Project`
- Belongs to `Partner` (global)
- Belongs to `PartnerAlias` (org-scoped)
- Has many `AssessmentResponse`
- Has many `AssessmentQuestion`

### Question

Assessment questions.

```prisma
model Question {
  id            String   @id @default(cuid())
  domain        String
  text          String
  helpText      String?
  category      String
  weight        Float    @default(1.0)
  order         Int
  subDomain     String?
  sectorTags    String[] @default([])
  evidenceTypes Json     @default("[]")
  baseScore     Float    @default(1.0)
}
```

**Domains:**
- Governance
- Financial
- Operational
- Technical
- Social
- Environmental

**Indexes:**
- `[domain, category]`

### AssessmentResponse

User responses to assessment questions.

```prisma
model AssessmentResponse {
  id               String   @id @default(cuid())
  assessmentId     String
  questionId       String
  userId           String
  response         String
  evidenceFiles    Json     @default("[]")
  validated        Boolean  @default(false)
  validationStatus String   @default("PENDING")
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

**Key Fields:**
- `evidenceFiles`: JSON array of uploaded evidence
- `validated`: Whether response has been validated
- `validationStatus`: PENDING, APPROVED, REJECTED

**Indexes:**
- `[assessmentId, questionId]` (unique composite)

## Partner Registry Models

### Partner

Global canonical partner records.

```prisma
model Partner {
  id             String              @id @default(cuid())
  legalName      String
  tradeName      String?
  website        String?
  country        String?
  sector         String?
  verification   PartnerVerification @default(UNVERIFIED)
  aggregateScore Float?
  usageCount     Int                 @default(0)
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
}

enum PartnerVerification {
  UNVERIFIED
  SELF_VERIFIED
  FUTUREFORM_VERIFIED
}
```

**Key Fields:**
- `verification`: Verification status
- `aggregateScore`: Computed trust score across all assessments
- `usageCount`: Number of organizations using this partner

**Indexes:**
- `legalName`
- `[sector, country]`

### PartnerAlias

Organization-scoped view of partners.

```prisma
model PartnerAlias {
  id                 String   @id @default(cuid())
  partnerId          String
  organizationId     String
  displayName        String
  internalNotes      String?
  relationshipStatus String?
  visibility         Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

**Purpose:**
- Organizations can customize partner names
- Add internal notes
- Track relationship status
- Control visibility

**Indexes:**
- `[partnerId, organizationId]` (unique composite)
- `organizationId`

## Billing Models

### SubscriptionTier

Subscription plans.

```prisma
model SubscriptionTier {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  credits     Int
  features    Json
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### CreditPricing

Credit packages for purchase.

```prisma
model CreditPricing {
  id          String   @id @default(cuid())
  name        String
  description String?
  credits     Int
  price       Float
  discount    Float?
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Credit

Organization credit balance.

```prisma
model Credit {
  id             String     @id @default(cuid())
  organizationId String
  amount         Int
  type           CreditType
  description    String?
  createdAt      DateTime   @default(now())
}

enum CreditType {
  PURCHASE
  USAGE
  REFUND
  EXPIRE
}
```

### CreditTransaction

Credit usage history.

```prisma
model CreditTransaction {
  id           String   @id @default(cuid())
  userId       String
  creditId     String
  amount       Int
  type         String
  description  String?
  assessmentId String?
  createdAt    DateTime @default(now())
}
```

## Marketing Models

### MarketingLead

Product-qualified leads from framework downloads.

```prisma
model MarketingLead {
  id                String    @id @default(cuid())
  firstName         String
  lastName          String
  email             String
  organization      String
  sector            String?
  country           String?
  source            String
  downloadToken     String?   @unique
  tokenUsed         Boolean   @default(false)
  converted         Boolean   @default(false)
  status            String    @default("NEW")
  hubspotSynced     Boolean   @default(false)
  hubspotContactId  String?
  hubspotSyncedAt   DateTime?
  hubspotSyncError  String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

**Key Fields:**
- `downloadToken`: Unique token for framework download
- `hubspotSynced`: Whether synced to HubSpot CRM
- `converted`: Whether lead converted to user

**Indexes:**
- `email`
- `source`
- `status`
- `converted`
- `hubspotSynced`

## Support Models

### SupportTicket

Customer support tickets.

```prisma
model SupportTicket {
  id           String         @id @default(cuid())
  ticketNumber String         @unique
  userId       String
  category     TicketCategory
  subject      String
  description  String
  status       TicketStatus   @default(OPEN)
  priority     TicketPriority @default(MEDIUM)
  assignedTo   String?
  resolvedAt   DateTime?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

enum TicketCategory {
  TECHNICAL
  BILLING
  ASSESSMENT_HELP
  ACCOUNT
  FEATURE_REQUEST
  OTHER
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

## Relationships Diagram

```
User ──┬── OrganizationMember ── Organization
       │
       ├── Project ──── Assessment ──┬── AssessmentResponse ── Question
       │                             │
       │                             └── AssessmentQuestion
       │
       └── CreditTransaction ── Credit

Partner ──── PartnerAlias ── Organization
       │
       └── Assessment

Organization ──┬── Project
               ├── Credit
               ├── PartnerAlias
               └── SubscriptionTier
```

## Migrations

### Running Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Migration History

Migrations are stored in `prisma/migrations/` directory.

Recent migrations:
- `add_hubspot_fields_to_marketing_leads` - Added HubSpot sync tracking
- `add_partner_registry` - Implemented global partner registry
- `add_subscription_tiers` - Added billing and subscriptions

## Seeding

### Seed Script

```bash
npx prisma db seed
```

**Seeds:**
- Default subscription tiers
- Credit pricing packages
- Sample questions
- Form options (sectors, regions, etc.)
- Admin user (if configured)

### Seed File

Located at `prisma/seed.ts`

## Indexes

### Performance Indexes

**User:**
- `email` (unique)

**Organization:**
- `name`

**Project:**
- `organizationId`
- `status`

**Assessment:**
- `projectId`
- `token` (unique)
- `status`
- `partnerGlobalId`
- `partnerAliasId`

**Question:**
- `domain`
- `[domain, category]`

**MarketingLead:**
- `email`
- `source`
- `status`
- `converted`
- `hubspotSynced`

## Database Maintenance

### Backup

```bash
# Create backup
pg_dump futureform > backup_$(date +%Y%m%d).sql

# Restore backup
psql futureform < backup_20251123.sql
```

### Vacuum

```sql
-- Reclaim storage
VACUUM FULL;

-- Update statistics
ANALYZE;
```

### Monitor Performance

```sql
-- Slow queries
SELECT * FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Best Practices

### Data Integrity

- Use transactions for multi-table operations
- Validate data before insertion
- Use foreign key constraints
- Implement soft deletes where appropriate

### Performance

- Add indexes on frequently queried fields
- Use connection pooling
- Implement pagination for large datasets
- Cache frequently accessed data

### Security

- Never store plain text passwords
- Use parameterized queries (Prisma handles this)
- Implement row-level security where needed
- Audit sensitive data access

## Schema Evolution

### Adding New Fields

1. Update `schema.prisma`
2. Create migration: `npx prisma migrate dev`
3. Update TypeScript types
4. Update API endpoints
5. Update UI components

### Removing Fields

1. Mark as deprecated first
2. Remove from UI
3. Remove from API
4. Create migration to drop column
5. Update documentation

### Renaming Fields

1. Add new field
2. Migrate data
3. Update code to use new field
4. Remove old field
5. Create migration

## Troubleshooting

### Migration Conflicts

```bash
# Reset migrations
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset
```

### Connection Issues

```bash
# Test connection
npx prisma db pull

# Check connection string
echo $DATABASE_URL
```

### Prisma Client Issues

```bash
# Regenerate client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npx prisma generate
```
