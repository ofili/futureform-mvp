# Phase 7: Testing & Validation Guide

## Overview
This guide provides comprehensive testing procedures for the migrated features from platform to frontend.

---

## 1. Build Verification

### Check TypeScript Compilation
```bash
cd frontend
npm run build
```

**Expected:** No TypeScript errors, successful build

### Check Development Server
```bash
npm run dev
```

**Expected:** Server starts on port 3000 without errors

---

## 2. Database Testing

### Verify Prisma Schema
```bash
npx prisma validate
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Check Database Connection
```bash
npx prisma db push --preview-feature
```

**Expected:** All models sync successfully

---

## 3. API Endpoint Testing

### Authentication APIs

**Test Login**
```bash
POST /api/auth/callback/credentials
Body: { email: "test@example.com", password: "password" }
Expected: 200, session token
```

### Organization APIs

**List Invitations**
```bash
GET /api/organization/invitations
Headers: { Authorization: "Bearer <token>" }
Expected: 200, array of invitations
```

**Create Invitation**
```bash
POST /api/organization/invitations
Headers: { Authorization: "Bearer <token>" }
Body: { email: "new@example.com", role: "MEMBER" }
Expected: 201, invitation object
```

### Project APIs

**List Projects**
```bash
GET /api/projects
Headers: { Authorization: "Bearer <token>" }
Expected: 200, array of projects
```

**Create Project**
```bash
POST /api/projects
Headers: { Authorization: "Bearer <token>" }
Body: {
  name: "Test Project",
  type: "PRE_INVESTMENT_DUE_DILIGENCE",
  sector: "Technology",
  region: "Africa"
}
Expected: 201, project object
```

**Get Project Details**
```bash
GET /api/projects/{id}
Headers: { Authorization: "Bearer <token>" }
Expected: 200, project with team and assessments
```

**Update Project**
```bash
PUT /api/projects/{id}
Headers: { Authorization: "Bearer <token>" }
Body: { name: "Updated Project Name" }
Expected: 200, updated project
```

**Delete Project**
```bash
DELETE /api/projects/{id}
Headers: { Authorization: "Bearer <token>" }
Expected: 200, success message
```

### Assessment APIs

**List Assessments**
```bash
GET /api/assessments
Headers: { Authorization: "Bearer <token>" }
Expected: 200, array of assessments
```

**Create Assessment**
```bash
POST /api/assessments
Headers: { Authorization: "Bearer <token>" }
Body: {
  projectId: "project_id",
  partnerName: "Partner Name",
  partnerType: "NGO"
}
Expected: 201, assessment object
```

**Get Assessment Details**
```bash
GET /api/assessments/{id}
Headers: { Authorization: "Bearer <token>" }
Expected: 200, assessment with responses and scores
```

### Analytics APIs

**Dashboard Stats**
```bash
GET /api/dashboard?timeframe=30d
Headers: { Authorization: "Bearer <token>" }
Expected: 200, analytics data with overview, domain scores
```

### Notification APIs

**List Notifications**
```bash
GET /api/notifications
Headers: { Authorization: "Bearer <token>" }
Expected: 200, array of notifications
```

**Mark as Read**
```bash
PUT /api/notifications
Headers: { Authorization: "Bearer <token>" }
Body: { notificationId: "notif_id", read: true }
Expected: 200, updated notification
```

### Credit APIs

**Get Credit Balance**
```bash
GET /api/users/me/credits
Headers: { Authorization: "Bearer <token>" }
Expected: 200, credit balance and transactions
```

**Purchase Credits**
```bash
POST /api/credits/purchase
Headers: { Authorization: "Bearer <token>" }
Body: { credits: 15, currency: "USD" }
Expected: 200, payment URL and transaction ref
```

### Admin APIs

**List Users (Admin Only)**
```bash
GET /api/admin/users?page=1&limit=20
Headers: { Authorization: "Bearer <admin_token>" }
Expected: 200, paginated user list
```

---

## 4. Service Testing

### Credit Service
```typescript
import { CreditService } from '@/lib/services/creditService'

// Test credit check
const check = await CreditService.hasSufficientCredits(userId)
// Expected: { hasCredits: boolean, remaining: number }

// Test credit usage
await CreditService.useCreditForAssessment(userId, assessmentId)
// Expected: Credit deducted, transaction created

// Test refund
await CreditService.refundCredit(assessmentId)
// Expected: Credit refunded, transaction created
```

### Notification Service
```typescript
import { sendNotification } from '@/lib/notifications'

// Test notification
await sendNotification(userId, 'credit_low', {
  remainingCredits: 2,
  message: 'Low credits'
})
// Expected: Notification created in database
```

### Email Service
```typescript
import { sendAssessmentInvitation } from '@/lib/email'

// Test email (requires Resend setup)
await sendAssessmentInvitation({
  to: 'partner@example.com',
  partnerName: 'Partner Name',
  projectName: 'Test Project',
  assessmentToken: 'token',
  inviterUserId: userId,
  inviterName: 'Inviter Name'
})
// Expected: Email sent (or logged if Resend not configured)
```

---

## 5. Middleware Testing

### Route Protection
**Test:** Navigate to `/dashboard` without authentication
**Expected:** Redirect to `/auth/login?callbackUrl=/dashboard`

**Test:** Navigate to `/admin` as non-admin user
**Expected:** Redirect to `/dashboard`

### Role-Based Access
```typescript
import { requireAdmin } from '@/lib/auth-helpers'

// Test admin requirement
const { session, error, response } = await requireAdmin()
// Expected: error if not admin, session if admin
```

---

## 6. Integration Testing

### User Registration → Login → Create Project Flow
1. Register new user via `/auth/register`
2. Verify email (if enabled)
3. Login via `/auth/login`
4. Create organization (if required)
5. Create project via `/api/projects`
6. Verify project appears in `/api/projects` list

### Assessment Creation → Invitation → Completion Flow
1. Create assessment via `/api/assessments`
2. Verify credit deduction
3. Check invitation email sent
4. Partner accesses assessment via token
5. Partner submits responses
6. Verify assessment status updated to COMPLETED

### Credit Purchase Flow
1. Check current balance via `/api/users/me/credits`
2. Initiate purchase via `/api/credits/purchase`
3. Complete payment (mock or real)
4. Verify credits added
5. Check transaction history

---

## 7. Performance Testing

### Database Query Performance
- Monitor query execution time for project list
- Check N+1 query issues
- Verify proper use of `include` and `select`

### API Response Times
- Dashboard API: < 500ms
- Project list: < 300ms
- Assessment list: < 300ms
- Single resource fetch: < 200ms

---

## 8. Security Testing

### Authentication
- [ ] Verify JWT tokens expire correctly
- [ ] Test invalid credentials rejection
- [ ] Check session persistence

### Authorization
- [ ] Verify users can only access their own resources
- [ ] Test admin-only routes reject non-admins
- [ ] Check project team member access control

### Input Validation
- [ ] Test SQL injection prevention
- [ ] Verify XSS protection
- [ ] Check CSRF token validation

---

## 9. Error Handling

### Test Error Scenarios
- [ ] Invalid authentication token → 401
- [ ] Insufficient permissions → 403
- [ ] Resource not found → 404
- [ ] Invalid input → 400
- [ ] Server error → 500

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

---

## 10. Checklist

### Pre-Deployment
- [ ] All TypeScript errors resolved
- [ ] Build completes successfully
- [ ] All API endpoints tested
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Error handling verified
- [ ] Security measures in place

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Verify database connections
- [ ] Test critical user flows
- [ ] Monitor credit transactions
- [ ] Check email delivery

---

## Common Issues & Solutions

### Issue: Prisma Client Not Generated
**Solution:** Run `npx prisma generate`

### Issue: Database Connection Error
**Solution:** Verify `DATABASE_URL` in `.env`

### Issue: NextAuth Session Not Persisting
**Solution:** Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in `.env`

### Issue: Middleware Not Protecting Routes
**Solution:** Verify `middleware.ts` matcher configuration

### Issue: API Returns 401 for Valid Token
**Solution:** Check JWT secret matches between auth and middleware

---

## Testing Tools

### Recommended Tools
- **API Testing:** Postman, Insomnia, or Thunder Client
- **Database:** Prisma Studio (`npx prisma studio`)
- **Monitoring:** Sentry, LogRocket
- **Performance:** Lighthouse, WebPageTest

### Environment Setup
```env
# .env.test
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="test-secret"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Success Criteria

✅ Build completes without errors  
✅ All API endpoints return expected responses  
✅ Authentication and authorization work correctly  
✅ Database operations execute successfully  
✅ Services function as expected  
✅ Middleware protects routes properly  
✅ Error handling is comprehensive  
✅ Performance meets targets  

**Migration Status: Ready for Production Testing**
