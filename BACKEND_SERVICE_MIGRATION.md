# Backend Service Migration Analysis

## Current Architecture Issues

Your current Next.js app has a **hybrid architecture** with business logic scattered across:
1. **Server Components** (pages) - Direct Prisma queries
2. **API Routes** - Some business logic
3. **Services** (`src/services/`) - New credit system services
4. **Legacy Services** (`src/lib/services/`) - Old services

This creates several problems:
- ❌ Code duplication
- ❌ Inconsistent patterns
- ❌ Hard to test
- ❌ Difficult to extract to separate backend later
- ❌ Security concerns (Prisma in server components)

## What Should Move to Backend Services

### ✅ Already Properly Abstracted (Good Examples)

**Credit System Services** (`src/services/`)
- ✅ `RCService` - Respondent credit operations
- ✅ `ECService` - Evidence credit operations
- ✅ `PackageService` - Package management
- ✅ `BillingService` - Payment orchestration
- ✅ `EvidenceService` - Evidence submission

**Why these are good:**
- Single responsibility
- Testable
- Reusable
- Can be extracted to separate backend

### ❌ Needs Migration to Services

#### 1. **Assessment Operations** (HIGH PRIORITY)

**Current State:**
```typescript
// ❌ BAD: Direct Prisma in page component
// src/app/assessments/[id]/page.tsx
const assessment = await prisma.assessment.findUnique({
  where: { id },
  include: { project: true, scores: true, responses: true }
});
```

**Should Be:**
```typescript
// ✅ GOOD: Service abstraction
// src/services/assessments/assessment.service.ts
class AssessmentService {
  async getAssessmentById(id: string, userId: string) {
    // Authorization check
    // Data fetching
    // Business logic
    return transformedAssessment;
  }
}

// In page component
const assessment = await assessmentService.getAssessmentById(id, session.user.id);
```

**Files to migrate:**
- `src/app/assessments/[id]/page.tsx` → `AssessmentService.getById()`
- `src/app/assessments/page.tsx` → `AssessmentService.list()`
- `src/app/assessments/new/page.tsx` → `AssessmentService.create()`

#### 2. **Project Operations** (HIGH PRIORITY)

**Current State:**
```typescript
// ❌ BAD: Business logic in API routes
// src/app/api/projects/route.ts
const project = await prisma.project.create({
  data: { /* complex nested data */ }
});
```

**Should Be:**
```typescript
// ✅ GOOD: Service layer
class ProjectService {
  async createProject(data: CreateProjectInput, userId: string) {
    // Validation
    // Authorization
    // Complex business logic
    // Transaction handling
    return project;
  }
}
```

**Files to migrate:**
- `src/app/projects/[id]/page.tsx` → `ProjectService.getById()`
- `src/app/projects/page.tsx` → `ProjectService.list()`
- `src/app/projects/new/page.tsx` → `ProjectService.create()`
- `src/app/api/projects/route.ts` → Use `ProjectService`

#### 3. **Organization Operations** (MEDIUM PRIORITY)

**Should Create:**
```typescript
class OrganizationService {
  async getOrganization(id: string)
  async updateOrganization(id: string, data: UpdateOrgInput)
  async inviteMember(orgId: string, email: string, role: string)
  async removeMember(orgId: string, userId: string)
  async getMembers(orgId: string)
}
```

**Files to migrate:**
- Organization management pages
- Team invitation logic
- Member management

#### 4. **User Operations** (MEDIUM PRIORITY)

**Should Create:**
```typescript
class UserService {
  async getUserProfile(userId: string)
  async updateProfile(userId: string, data: UpdateProfileInput)
  async getUserOrganizations(userId: string)
  async getUserProjects(userId: string)
}
```

#### 5. **Notification System** (LOW PRIORITY)

**Current:** `src/lib/notifications.ts` has some logic
**Should:** Expand into full `NotificationService`

```typescript
class NotificationService {
  async createNotification(userId: string, type: string, data: any)
  async markAsRead(notificationId: string)
  async getUserNotifications(userId: string, filters: NotificationFilters)
  async deleteNotification(notificationId: string)
}
```

#### 6. **Admin Operations** (MEDIUM PRIORITY)

**Should Create:**
```typescript
class AdminService {
  async getSystemStats()
  async getMonthlyReport(month: number, year: number)
  async manageUsers(action: AdminAction)
  async manageTiers(action: TierAction)
  async viewLogs(filters: LogFilters)
}
```

**Files to migrate:**
- `src/app/api/v1/admin/reports/monthly/route.ts` → `AdminService.getMonthlyReport()`
- All admin API routes

## Recommended Service Structure

```
src/services/
├── assessments/
│   ├── assessment.service.ts      # Main assessment operations
│   ├── response.service.ts        # Response handling
│   └── scoring.service.ts         # Scoring logic
├── projects/
│   ├── project.service.ts         # Project CRUD
│   └── team.service.ts            # Team management
├── organizations/
│   ├── organization.service.ts    # Org CRUD
│   └── member.service.ts          # Member management
├── users/
│   └── user.service.ts            # User operations
├── credits/                       # ✅ Already done
│   ├── rc.service.ts
│   ├── ec.service.ts
│   └── package.service.ts
├── billing/                       # ✅ Already done
│   └── billing.service.ts
├── evidence/                      # ✅ Already done
│   └── evidence.service.ts
├── notifications/
│   └── notification.service.ts
├── admin/
│   └── admin.service.ts
└── index.ts                       # Central exports
```

## Migration Priority

### Phase 1: Critical Business Logic (Week 1)
1. ✅ **AssessmentService** - Most complex, highest value
2. ✅ **ProjectService** - Core functionality
3. ✅ **OrganizationService** - User management

### Phase 2: Supporting Services (Week 2)
4. ✅ **UserService** - Profile management
5. ✅ **NotificationService** - User engagement
6. ✅ **AdminService** - Admin operations

### Phase 3: Cleanup (Week 3)
7. ✅ Remove direct Prisma calls from pages
8. ✅ Update API routes to use services
9. ✅ Add comprehensive tests
10. ✅ Documentation

## Benefits of Migration

### Immediate Benefits
- ✅ **Testability** - Services can be unit tested
- ✅ **Reusability** - Same logic in API routes and server components
- ✅ **Security** - Centralized authorization checks
- ✅ **Consistency** - Single source of truth for business logic

### Long-term Benefits
- ✅ **Scalability** - Easy to extract to separate backend
- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Performance** - Can add caching at service layer
- ✅ **Type Safety** - Better TypeScript inference

## Example: AssessmentService Implementation

```typescript
// src/services/assessments/assessment.service.ts
import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { UnauthorizedError, NotFoundError } from '@/lib/errors';

export interface AssessmentFilters {
  projectId?: string;
  status?: string;
  partnerId?: string;
}

export class AssessmentService {
  /**
   * Get assessment by ID with authorization
   */
  async getById(id: string, userId: string) {
    logger.info('Fetching assessment', { assessmentId: id, userId });

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            organization: {
              include: { members: true }
            }
          }
        },
        scores: true,
        redFlags: true,
        responses: {
          include: {
            question: {
              select: { text: true, domain: true }
            }
          }
        }
      }
    });

    if (!assessment) {
      throw new NotFoundError('Assessment not found');
    }

    // Authorization check
    const hasAccess = assessment.project.organization.members.some(
      m => m.userId === userId
    );

    if (!hasAccess) {
      throw new UnauthorizedError('No access to this assessment');
    }

    return this.transformAssessment(assessment);
  }

  /**
   * List assessments with filters
   */
  async list(userId: string, filters: AssessmentFilters) {
    // Get user's organizations
    const userOrgs = await prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true }
    });

    const orgIds = userOrgs.map(o => o.organizationId);

    const assessments = await prisma.assessment.findMany({
      where: {
        project: {
          organizationId: { in: orgIds }
        },
        ...(filters.projectId && { projectId: filters.projectId }),
        ...(filters.status && { status: filters.status }),
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        scores: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return assessments.map(a => this.transformAssessment(a));
  }

  /**
   * Create new assessment
   */
  async create(data: CreateAssessmentInput, userId: string) {
    // Validation
    // Authorization check
    // RC credit consumption (already integrated!)
    
    return await prisma.assessment.create({
      data: {
        ...data,
        createdBy: userId
      }
    });
  }

  /**
   * Transform assessment for client
   */
  private transformAssessment(assessment: any) {
    return {
      id: assessment.id,
      partnerName: assessment.partnerName || 'Unknown Partner',
      status: assessment.status,
      project: assessment.project,
      domainScores: assessment.scores?.map(s => ({
        domain: s.domain,
        score: s.score,
        confidence: s.confidence
      })) || [],
      responses: assessment.responses?.map(r => ({
        question: r.question,
        response: r.response
      })) || [],
      redFlags: assessment.redFlags?.map(f => ({
        description: f.description,
        severity: f.severity
      })) || [],
      completedAt: assessment.completedAt?.toISOString(),
    };
  }
}

export const assessmentService = new AssessmentService();
```

## How to Use in Pages

```typescript
// ✅ GOOD: Server Component using service
// src/app/assessments/[id]/page.tsx
import { assessmentService } from '@/services';
import { auth } from '@/lib/auth';

export default async function AssessmentDetail({ params }) {
  const session = await auth();
  const { id } = await params;
  
  // Service handles authorization, data fetching, transformation
  const assessment = await assessmentService.getById(id, session.user.id);
  
  return <AssessmentDetailClient assessment={assessment} />;
}
```

```typescript
// ✅ GOOD: API Route using service
// src/app/api/v1/assessments/[id]/route.ts
import { assessmentService } from '@/services';

export async function GET(req, { params }) {
  const session = await auth();
  const { id } = await params;
  
  const assessment = await assessmentService.getById(id, session.user.id);
  
  return NextResponse.json(assessment);
}
```

## Next Steps

1. **Start with AssessmentService** - Highest impact
2. **Create service template** - Copy credit service pattern
3. **Migrate one page at a time** - Incremental approach
4. **Add tests** - Ensure correctness
5. **Update API routes** - Use new services
6. **Remove old code** - Clean up

Would you like me to:
1. Create the AssessmentService implementation?
2. Create ProjectService implementation?
3. Set up the full service structure?
4. Create migration guide for your team?
