# RC/EC Credit System - Testing Plan

## Test Environment Setup

### Prerequisites
- ✅ Database schema updated (Prisma db push completed)
- ✅ Service layer implemented
- ✅ API endpoints created
- ✅ Frontend components built
- ⚠️ Seed data loaded (manual via Prisma Studio)

### Test Data Requirements
- At least 1 organization with credits initialized
- 7 credit packages seeded
- 9 EC pricing rules seeded
- Test user with organization membership

## Test Scenarios

### 1. Credit Balance Display

**Test: View RC Balance**
- Navigate to `/dashboard/credits`
- Click "Respondent Credits (RC)" tab
- Verify balance displays correctly
- Check "Available Credits", "Total Used", "Total Purchased" cards

**Test: View EC Balance**
- Navigate to `/dashboard/credits`
- Click "Evidence Credits (EC)" tab
- Verify balance displays correctly (with decimals)
- Check auto-reload status

**Expected Results:**
- ✅ Balances match database records
- ✅ UI displays without errors
- ✅ Decimal values formatted correctly for EC

### 2. Package Display

**Test: View Pricing Page**
- Navigate to `/pricing`
- Switch between "Respondent Packs (RC)" and "Evidence Packs (EC)" tabs
- Verify all 7 packages display
- Check pricing and features

**Expected Results:**
- ✅ 4 RC packages visible
- ✅ 3 EC packages visible
- ✅ Prices match seed data
- ✅ Features list displays correctly

**Test: View EC Pricing Table**
- Scroll to "Transparent Evidence Pricing" section
- Verify all 9 pricing rules display
- Check AE, VE, DSE sections

**Expected Results:**
- ✅ All pricing rules visible
- ✅ Costs display correctly (including decimals)
- ✅ Descriptions are clear

### 3. RC Consumption (Assessment Invitations)

**Test: Invite Respondents with Sufficient Credits**
1. Ensure organization has RC balance > 0
2. Navigate to an assessment
3. Click "Invite Respondents" or similar
4. Enter 2-3 respondent emails
5. Submit invitations

**Expected Results:**
- ✅ Invitations sent successfully
- ✅ RC balance decreases by number of invitations
- ✅ RC transaction created (type: USAGE)
- ✅ Transaction visible in `/dashboard/credits` RC tab

**Test: Invite Respondents with Insufficient Credits**
1. Ensure organization has RC balance = 0
2. Navigate to an assessment
3. Try to invite respondents
4. Submit invitations

**Expected Results:**
- ✅ Error message: "Insufficient respondent credits"
- ✅ HTTP 402 Payment Required status
- ✅ No invitations sent
- ✅ Balance unchanged

### 4. EC Consumption (Evidence Submission)

**Test: Submit Evidence with Sufficient Credits**
1. Ensure organization has EC balance > 1
2. Navigate to evidence submission
3. Submit a document (should cost 1 EC)
4. Check balance

**Expected Results:**
- ✅ Evidence submitted successfully
- ✅ EC balance decreases by cost amount
- ✅ EC transaction created (type: USAGE)
- ✅ Evidence appears in `/dashboard/evidence`

**Test: Submit Evidence with Insufficient Credits**
1. Ensure organization has EC balance < required cost
2. Try to submit evidence
3. Check error handling

**Expected Results:**
- ✅ Error message: "Insufficient evidence credits"
- ✅ HTTP 402 Payment Required status
- ✅ Evidence not created
- ✅ Balance unchanged

### 5. Evidence Library

**Test: View Evidence List**
- Navigate to `/dashboard/evidence`
- Verify evidence table displays
- Check filters (Layer, Status)

**Expected Results:**
- ✅ Evidence items display in table
- ✅ Layer badges (AE/VE/DSE) show correctly
- ✅ Status badges (Pending/Verified/Rejected) show correctly
- ✅ EC cost displays per item
- ✅ Filters work correctly

**Test: View Evidence Details**
- Click "View" on an evidence item
- Navigate to evidence detail page

**Expected Results:**
- ✅ Evidence details display
- ✅ Uploader information visible
- ✅ Verification status shown
- ✅ EC cost tracked

### 6. EC Auto-Reload

**Test: Configure Auto-Reload**
1. Navigate to `/dashboard/credits` EC tab
2. Click "Configure Auto-Reload"
3. Set threshold: 100
4. Set reload amount: 500
5. Save

**Expected Results:**
- ✅ Settings saved successfully
- ✅ Auto-reload toggle shows "Enabled"
- ✅ Threshold and amount display correctly

**Test: Disable Auto-Reload**
1. Toggle auto-reload switch to OFF
2. Confirm

**Expected Results:**
- ✅ Auto-reload disabled
- ✅ Toggle shows "Disabled"
- ✅ Settings cleared

### 7. Transaction History

**Test: View RC Transactions**
- Navigate to `/dashboard/credits` RC tab
- Scroll to "Recent Transactions"
- Verify transactions display

**Expected Results:**
- ✅ Transactions sorted by date (newest first)
- ✅ Transaction types labeled correctly (Purchase/Usage/Refund)
- ✅ Amounts show with +/- signs
- ✅ Notes/descriptions visible

**Test: View EC Transactions**
- Navigate to `/dashboard/credits` EC tab
- Scroll to "Recent Transactions"
- Check evidence type in usage transactions

**Expected Results:**
- ✅ Transactions display with decimal amounts
- ✅ Evidence type shown for USAGE transactions
- ✅ Auto-reload transactions identified

### 8. API Endpoint Testing

**Test: RC Balance API**
```bash
GET /api/v1/credits/rc/balance?organizationId={orgId}
```
**Expected:** JSON with totalAvailable, totalUsed, totalPurchased

**Test: EC Balance API**
```bash
GET /api/v1/credits/ec/balance?organizationId={orgId}
```
**Expected:** JSON with totalAvailable (Decimal), autoReloadEnabled, etc.

**Test: Packages API**
```bash
GET /api/v1/credits/packages
GET /api/v1/credits/packages?type=RC
GET /api/v1/credits/packages?type=EC
```
**Expected:** Array of packages, filtered by type

**Test: EC Pricing API**
```bash
GET /api/v1/credits/ec/pricing
```
**Expected:** Array of 9 pricing rules

**Test: Evidence List API**
```bash
GET /api/v1/evidence?organizationId={orgId}
GET /api/v1/evidence?organizationId={orgId}&layer=AE
GET /api/v1/evidence?organizationId={orgId}&status=VERIFIED
```
**Expected:** Array of evidence, filtered correctly

## Manual Test Checklist

### UI/UX Tests
- [ ] All pages load without console errors
- [ ] Navigation between credit tabs works smoothly
- [ ] Responsive design works on mobile/tablet
- [ ] Loading states display during API calls
- [ ] Error messages are user-friendly
- [ ] Success toasts appear for actions
- [ ] Decimal values display with 2 decimal places

### Data Integrity Tests
- [ ] Credit balances match transaction sums
- [ ] No negative balances allowed
- [ ] Transactions have correct timestamps
- [ ] Evidence linked to correct EC transactions
- [ ] Auto-reload triggers at correct threshold

### Security Tests
- [ ] Unauthenticated requests return 401
- [ ] Users can only access their org's data
- [ ] API endpoints validate organization ownership
- [ ] No SQL injection vulnerabilities
- [ ] Rate limiting works (if implemented)

### Performance Tests
- [ ] Dashboard loads in < 2 seconds
- [ ] Transaction history pagination works
- [ ] Large evidence lists load efficiently
- [ ] API responses < 500ms for simple queries

## Known Issues / Limitations

1. **Payment Integration**: Purchase endpoints are placeholders - no actual payment processing
2. **Rate Limiting**: Not yet implemented on API endpoints
3. **Comprehensive Tests**: Unit/integration tests not written
4. **Auto-Reload Trigger**: Logic exists but needs payment gateway integration
5. **Evidence Submission**: Frontend forms are generic - need specific forms for AE/VE/DSE

## Next Steps After Testing

1. **Fix Critical Bugs**: Address any issues found during testing
2. **Add Unit Tests**: Write tests for services
3. **Add Integration Tests**: Test API endpoints
4. **Add E2E Tests**: Test complete user flows
5. **Performance Optimization**: Add caching, optimize queries
6. **Security Audit**: Review authentication, authorization, data validation
7. **Documentation**: API docs, user guides
8. **Staging Deployment**: Deploy to staging environment
9. **User Acceptance Testing**: Get feedback from real users
10. **Production Rollout**: Gradual rollout (10% → 50% → 100%)

## Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: Development / Staging / Production

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| View RC Balance | ⬜ Pass / ⬜ Fail | |
| View EC Balance | ⬜ Pass / ⬜ Fail | |
| View Pricing Page | ⬜ Pass / ⬜ Fail | |
| Invite with Sufficient RC | ⬜ Pass / ⬜ Fail | |
| Invite with Insufficient RC | ⬜ Pass / ⬜ Fail | |
| Submit Evidence | ⬜ Pass / ⬜ Fail | |
| View Evidence List | ⬜ Pass / ⬜ Fail | |
| Configure Auto-Reload | ⬜ Pass / ⬜ Fail | |
| View Transactions | ⬜ Pass / ⬜ Fail | |

Critical Issues Found: ___________
Minor Issues Found: ___________
Overall Status: ⬜ Ready for Next Phase / ⬜ Needs Fixes
```
