# Service Migration Guide

## ✅ Services Created

All services have been created following the credit system pattern:

### Directory Structure
```
src/services/
├── assessments/
│   └── assessment.service.ts     ✅ Created
├── projects/
│   └── project.service.ts        ✅ Created
├── organizations/
│   └── organization.service.ts   ✅ Created
├── users/
│   └── user.service.ts           ✅ Created
├── notifications/
│   └── notification.service.ts   ✅ Created
├── admin/
│   └── admin.service.ts          ✅ Created
├── credits/                      ✅ Already existed
│   ├── rc.service.ts
│   ├── ec.service.ts
│   └── package.service.ts
├── billing/                      ✅ Already existed
│   └── billing.service.ts
├── evidence/                     ✅ Already existed
│   └── evidence.service.ts
└── index.ts                      ✅ Updated with all exports
```

## How to Use the New Services

### In Server Components (Pages)

**Before (❌ Bad):**
```typescript
// src/app/assessments/[id]/page.tsx
import prisma from '@/lib/prisma';

export default async function AssessmentPage({ params }) {
  const { id } = await params;
  
  // Direct Prisma query - bad!
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: { /* complex includes */ }
  });
  
  return <AssessmentDetail assessment={assessment} />;
}
```

**After (✅ Good):**
```typescript
// src/app/assessments/[id]/page.tsx
import { assessmentService } from '@/services';
import { auth } from '@/lib/auth';

export default async function AssessmentPage({ params }) {
  const session = await auth();
  const { id } = await params;
  
  // Service handles everything!
  const assessment = await assessmentService.getById(id, session.user.id);
  
  return <AssessmentDetail assessment={assessment} />;
}
```

### In API Routes

**Before (❌ Bad):**
```typescript
// src/app/api/v1/assessments/route.ts
export async function GET(req) {
  const session = await auth();
  
  // Business logic in API route - bad!
  const userOrgs = await prisma.organizationMember.findMany({
    where: { userId: session.user.id }
  });
  
  const assessments = await prisma.assessment.findMany({
    where: { /* complex query */ }
  });
  
  return NextResponse.json(assessments);
}
```

**After (✅ Good):**
```typescript
// src/app/api/v1/assessments/route.ts
import { assessmentService } from '@/services';

export async function GET(req) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  
  const filters = {
    projectId: searchParams.get('projectId'),
    status: searchParams.get('status'),
  };
  
  // Service handles everything!
  const assessments = await assessmentService.list(session.user.id, filters);
  
  return NextResponse.json(assessments);
}
```

## Migration Checklist

### Phase 1: Update Pages (Week 1)

**Assessments:**
- [ ] `src/app/assessments/[id]/page.tsx` → Use `assessmentService.getById()`
- [ ] `src/app/assessments/page.tsx` → Use `assessmentService.list()`
- [ ] `src/app/assessments/new/page.tsx` → Use `assessmentService.create()`

**Projects:**
- [ ] `src/app/projects/[id]/page.tsx` → Use `projectService.getById()`
- [ ] `src/app/projects/page.tsx` → Use `projectService.list()`
- [ ] `src/app/projects/new/page.tsx` → Use `projectService.create()`

**Dashboard:**
- [ ] `src/app/dashboard/page.tsx` → Use `userService.getDashboardStats()`

### Phase 2: Update API Routes (Week 2)

**Assessment APIs:**
- [ ] `src/app/api/v1/assessments/route.ts`
- [ ] `src/app/api/v1/assessments/[id]/route.ts`

**Project APIs:**
- [ ] `src/app/api/projects/route.ts`
- [ ] `src/app/api/projects/[id]/route.ts`

**Organization APIs:**
- [ ] `src/app/api/organization/*` → Use `organizationService`

**User APIs:**
- [ ] `src/app/api/users/*` → Use `userService`

**Admin APIs:**
- [ ] `src/app/api/v1/admin/*` → Use `adminService`

### Phase 3: Cleanup (Week 3)

- [ ] Remove direct Prisma imports from pages
- [ ] Delete old service files in `src/lib/services/`
- [ ] Add unit tests for new services
- [ ] Update documentation

## Example Migrations

### Example 1: Assessment Detail Page

**File:** `src/app/assessments/[id]/page.tsx`

**Before:**
```typescript
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import AssessmentDetailClient from './AssessmentDetailClient';

export default async function AssessmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true } },
      scores: true,
      redFlags: true,
      responses: {
        include: {
          question: { select: { text: true, domain: true } }
        }
      }
    }
  });

  if (!assessment) {
    notFound();
  }

  // Manual transformation
  const transformedAssessment = {
    id: assessment.id,
    partnerName: assessment.partnerName || 'Unknown Partner',
    status: assessment.status,
    project: assessment.project,
    domainScores: assessment.scores.map(s => ({
      domain: s.domain,
      score: s.score,
      confidence: s.confidence
    })),
    // ... more transformation
  };

  return <AssessmentDetailClient assessment={transformedAssessment} />;
}
```

**After:**
```typescript
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { assessmentService } from '@/services';
import AssessmentDetailClient from './AssessmentDetailClient';

export default async function AssessmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  try {
    // Service handles: fetching, authorization, transformation
    const assessment = await assessmentService.getById(id, session.user.id);
    return <AssessmentDetailClient assessment={assessment} />;
  } catch (error) {
    notFound();
  }
}
```

**Benefits:**
- ✅ 60% less code
- ✅ Authorization built-in
- ✅ Consistent transformation
- ✅ Reusable in API routes
- ✅ Testable

### Example 2: Projects List Page

**File:** `src/app/projects/page.tsx`

**After:**
```typescript
import { auth } from '@/lib/auth';
import { projectService } from '@/services';
import { redirect } from 'next/navigation';
import ProjectList from '@/components/projects/ProjectList';

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/login');
  }

  const projects = await projectService.list(session.user.id);
  
  return <ProjectList projects={projects} />;
}
```

### Example 3: API Route

**File:** `src/app/api/v1/projects/route.ts`

**After:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { projectService } from '@/services';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  
  const filters = {
    organizationId: searchParams.get('organizationId') || undefined,
    status: searchParams.get('status') as any,
    search: searchParams.get('search') || undefined,
  };

  const projects = await projectService.list(session.user.id, filters);
  
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  
  try {
    const project = await projectService.create(body, session.user.id);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

## Testing Services

### Unit Test Example

```typescript
// src/services/assessments/__tests__/assessment.service.test.ts
import { assessmentService } from '../assessment.service';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma');

describe('AssessmentService', () => {
  describe('getById', () => {
    it('should return assessment when user has access', async () => {
      const mockAssessment = {
        id: '123',
        project: {
          organization: {
            members: [{ userId: 'user-1', deletedAt: null }]
          }
        }
      };

      (prisma.assessment.findUnique as jest.Mock).mockResolvedValue(mockAssessment);

      const result = await assessmentService.getById('123', 'user-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('123');
    });

    it('should throw error when user has no access', async () => {
      const mockAssessment = {
        id: '123',
        project: {
          organization: {
            members: [{ userId: 'user-1', deletedAt: null }]
          }
        }
      };

      (prisma.assessment.findUnique as jest.Mock).mockResolvedValue(mockAssessment);

      await expect(
        assessmentService.getById('123', 'user-2')
      ).rejects.toThrow('Unauthorized');
    });
  });
});
```

## Benefits Summary

### Code Quality
- ✅ **DRY**: No code duplication between pages and API routes
- ✅ **Testable**: Services can be unit tested
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Consistent**: Same patterns everywhere

### Security
- ✅ **Authorization**: Built into every service method
- ✅ **Validation**: Centralized input validation
- ✅ **Audit**: Logging in one place

### Maintainability
- ✅ **Single source of truth**: Business logic in one place
- ✅ **Easy to change**: Update service, not 10 files
- ✅ **Clear separation**: Services, routes, pages have clear roles

### Future-Proofing
- ✅ **Backend extraction**: Easy to move to separate backend
- ✅ **Caching**: Add caching at service layer
- ✅ **Performance**: Optimize queries in one place

## Next Steps

1. **Start with one page** - Migrate `assessments/[id]/page.tsx` first
2. **Test thoroughly** - Ensure it works before continuing
3. **Migrate incrementally** - One page/route at a time
4. **Add tests** - Write tests as you migrate
5. **Document** - Update docs as you go

## Need Help?

- Check the credit services (`src/services/credits/`) for examples
- All services follow the same pattern
- Services are already exported from `@/services`
- Just import and use!

```typescript
import { 
  assessmentService,
  projectService,
  organizationService,
  userService,
  notificationService,
  adminService
} from '@/services';
```
