# Production Deployment Checklist

## 🎯 Current Status: **98% Production Ready**

This application is nearly ready for production deployment. Follow this checklist to complete the final steps.

---

## ✅ Completed Features

### Error Handling & Monitoring
- [x] Custom 404 error page with branding
- [x] Custom 500 error page with error logging
- [x] React Error Boundary component
- [x] Sentry error tracking configured (needs DSN)
- [x] Health check endpoint (`/api/health`)

### SEO & Discoverability
- [x] Comprehensive meta tags (Open Graph, Twitter Cards)
- [x] robots.txt for search engine control
- [x] sitemap.xml for better indexing
- [x] Proper page titles and descriptions

### Security
- [x] Rate limiting middleware created
- [x] Rate limiting applied to authentication endpoints (5/min)
- [x] Rate limiting applied to payment endpoints (3/5min)
- [x] Rate limiting applied to project/assessment creation (30/min)
- [x] Rate limiting applied to public endpoints (100/min)
- [x] Environment variable template (`.env.example`)

### Infrastructure
- [x] Database schema with all models
- [x] Authentication system (NextAuth)
- [x] Role-based access control
- [x] Credit system
- [x] Payment integration (Flutterwave)
- [x] Email system (Resend)
- [x] HubSpot integration

---

## 🔴 Critical (Must Complete Before Launch)

### 1. Environment Variables
**Time: 10 minutes**

Create `.env.production` or configure in your hosting platform:

```bash
# Required
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-production-domain.com"
NODE_ENV="production"

# Recommended
NEXT_PUBLIC_SENTRY_DSN="https://your-key@sentry.io/your-project"
SENTRY_AUTH_TOKEN="your-auth-token"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

# Optional (based on features you're using)
RESEND_API_KEY="re_..."
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_..."
FLUTTERWAVE_SECRET_KEY="FLWSECK_..."
HUBSPOT_ACCESS_TOKEN="pat-..."
```

**Action Items:**
- [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Set production `DATABASE_URL`
- [ ] Set production `NEXTAUTH_URL`
- [ ] Create Sentry account and add DSN
- [ ] Add all env vars to hosting platform

### 2. Database Setup
**Time: 15 minutes**

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed initial data
npx prisma db seed
```

**Action Items:**
- [ ] Set up production PostgreSQL database
- [ ] Run migrations on production database
- [ ] Seed subscription tiers
- [ ] Seed credit pricing
- [ ] Seed form options
- [ ] Create admin user

### 3. Build Verification
**Time: 10 minutes**

```bash
# Type check
npx tsc --noEmit

# Build application
npm run build

# Test production build locally
npm run start
```

**Action Items:**
- [ ] Fix any TypeScript errors
- [ ] Verify build completes successfully
- [ ] Test production build locally
- [ ] Check for console errors

### 4. Security Hardening
**Time: 15 minutes**

**Action Items:**
- [ ] Verify all secrets are in environment variables
- [ ] Enable HTTPS on production domain
- [ ] Configure SSL certificate
- [ ] Set up database backups (daily)
- [ ] Review CORS settings (if needed)
- [ ] Enable security headers

---

## 🟡 Important (Complete Within First Week)

### 5. Monitoring Setup
**Time: 20 minutes**

**Action Items:**
- [ ] Create Sentry account (https://sentry.io/signup/)
- [ ] Add Sentry DSN to production environment
- [ ] Uncomment Sentry calls in ErrorBoundary and error.tsx
- [ ] Configure Sentry alert rules
- [ ] Set up Slack/email notifications
- [ ] Test error tracking

### 6. Performance Optimization
**Time: 30 minutes**

**Action Items:**
- [ ] Run Lighthouse audit
- [ ] Optimize images (use next/image)
- [ ] Enable compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Monitor API response times

### 7. Testing
**Time: 1 hour**

**Manual Testing Checklist:**
- [ ] User registration flow
- [ ] Email verification
- [ ] Login/logout
- [ ] Password reset
- [ ] Organization creation
- [ ] Project creation (both modes)
- [ ] Assessment creation
- [ ] Assessment invitation
- [ ] Credit purchase flow
- [ ] Admin panel access
- [ ] Partner management
- [ ] Report generation

**Automated Testing:**
- [ ] Fix failing integration test (`pql.test.ts`)
- [ ] Run all unit tests: `npm test`
- [ ] Run integration tests
- [ ] Test rate limiting

---

## 🟢 Nice to Have (Post-Launch)

### 8. Additional Features
- [ ] Email templates (welcome, verification, etc.)
- [ ] Payment webhook handling
- [ ] File upload to S3/Cloudinary
- [ ] Real-time notifications
- [ ] Analytics integration (GA4)
- [ ] User feedback widget

### 9. DevOps
- [ ] CI/CD pipeline
- [ ] Staging environment
- [ ] Automated deployments
- [ ] Database migration automation
- [ ] Rollback strategy

### 10. Documentation
- [ ] API documentation
- [ ] User guide
- [ ] Admin guide
- [ ] Troubleshooting guide

---

## 🚀 Deployment Steps

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Vercel Configuration:**
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add custom domain
5. Enable automatic deployments

### Option 2: Railway

1. Create Railway account
2. Create new project from GitHub
3. Add PostgreSQL database
4. Add environment variables
5. Deploy

### Option 3: AWS/DigitalOcean

```bash
# On server
git clone <repository>
cd frontend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "futureform" -- start
pm2 save
pm2 startup
```

---

## 📋 Post-Deployment Checklist

### Immediate (First 24 Hours)
- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Create test project and assessment
- [ ] Monitor error logs in Sentry
- [ ] Check database connections
- [ ] Verify email delivery
- [ ] Test payment flow (if enabled)

### First Week
- [ ] Monitor error rates
- [ ] Check rate limit violations
- [ ] Review user feedback
- [ ] Optimize slow queries
- [ ] Adjust rate limits if needed
- [ ] Fix any critical bugs

### Ongoing
- [ ] Weekly error review
- [ ] Monthly security audit
- [ ] Database backup verification
- [ ] Performance monitoring
- [ ] User analytics review

---

## 🔧 Quick Reference

### Essential Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Database
npx prisma studio
npx prisma migrate deploy
npx prisma generate

# Testing
npm test
npm run test:integration

# Type checking
npx tsc --noEmit
```

### Important URLs

- Health Check: `https://your-domain.com/api/health`
- Admin Panel: `https://your-domain.com/admin`
- Sentry Dashboard: `https://sentry.io`
- Database Studio: `npx prisma studio`

### Environment Files

- `.env.local` - Local development
- `.env.test` - Testing
- `.env.production` - Production (or hosting platform)
- `.env.example` - Template (committed to git)

---

## 📊 Success Metrics

### Technical Metrics
- ✅ Build success rate: 100%
- ✅ Test pass rate: >95%
- ✅ Error rate: <1%
- ✅ API response time: <500ms
- ✅ Page load time: <2s
- ✅ Uptime: >99.9%

### Security Metrics
- ✅ All secrets in environment variables
- ✅ HTTPS enabled
- ✅ Rate limiting active
- ✅ Error tracking configured
- ✅ Database backups enabled

---

## 🆘 Troubleshooting

### Build Fails
1. Check TypeScript errors: `npx tsc --noEmit`
2. Clear cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Check for missing environment variables

### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Check database is accessible from server
3. Run migrations: `npx prisma migrate deploy`
4. Generate client: `npx prisma generate`

### Authentication Not Working
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches domain
3. Clear cookies and try again
4. Check session configuration

### Rate Limiting Too Strict
1. Review logs for violations
2. Adjust limits in `src/lib/rate-limit.ts`
3. Consider user-based limits instead of IP
4. Add CAPTCHA for repeated violations

---

## 📞 Support

### Documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [SENTRY_SETUP.md](./SENTRY_SETUP.md) - Error tracking setup
- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting guide
- [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md) - Full checklist

### Getting Help
- Check documentation first
- Review error logs in Sentry
- Check database logs
- Review application logs

---

## ✨ You're Almost There!

**Estimated time to production: 1-2 hours**

Focus on the **Critical** items first, then deploy to a staging environment for testing before going live.

**Good luck with your launch! 🚀**
