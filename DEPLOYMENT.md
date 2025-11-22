# Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `DATABASE_URL` to production database
- [ ] Set `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Configure email service (Resend API key) - optional
- [ ] Set any payment gateway keys (Stripe/Flutterwave) - optional

### 2. Database Setup
```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# (Optional) Seed initial data
npx prisma db seed
```

### 3. Build Verification
```bash
# Install dependencies
npm install

# Type check
npx tsc --noEmit

# Build application
npm run build

# Test production build locally
npm run start
```

### 4. Known Issues to Resolve

**TypeScript Import Paths**
Some files use `@/lib/*` imports. Ensure `tsconfig.json` has proper path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Missing Prisma Import**
If you see "Cannot find module '@/lib/db'", ensure:
1. Prisma client is generated: `npx prisma generate`
2. `src/lib/db.ts` exists and exports prisma client

### 5. Testing
- [ ] Test authentication flow (login/logout)
- [ ] Test project creation
- [ ] Test assessment creation
- [ ] Verify API endpoints respond correctly
- [ ] Check database connections
- [ ] Test role-based access control

---

## Deployment

### Option 1: Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables in Vercel:**
- Add all `.env` variables in Vercel dashboard
- Ensure `DATABASE_URL` points to production database

### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Option 3: Traditional Server
```bash
# On server
git clone <repository>
cd frontend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 start npm --name "frontend" -- start
```

---

## Post-Deployment

### 1. Verification
- [ ] Visit production URL
- [ ] Test login functionality
- [ ] Create a test project
- [ ] Check database for new records
- [ ] Monitor error logs

### 2. Monitoring Setup
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up database backups
- [ ] Enable application logging

### 3. Performance
- [ ] Run Lighthouse audit
- [ ] Check API response times
- [ ] Monitor database query performance
- [ ] Set up CDN for static assets

---

## Migration Summary

### ✅ Completed
- Database schema with 10 new models
- Authentication system (NextAuth v4)
- 10 API routes with 20+ endpoints
- 4 core services (Credit, Email, Notification, JWT)
- Role-based access control
- Middleware for route protection

### 📋 Optional Enhancements
- [ ] Install Resend for email: `npm install resend`
- [ ] Set up payment gateway (Stripe/Flutterwave)
- [ ] Configure file upload (AWS S3, Cloudinary)
- [ ] Add real-time features (Socket.io, Pusher)
- [ ] Implement caching (Redis)

### 🔧 Quick Fixes Needed
1. **Resolve TypeScript import errors** - Ensure tsconfig paths are correct
2. **Install missing dependencies** - Run `npm install` if needed
3. **Generate Prisma client** - Run `npx prisma generate`

---

## Support

### Common Issues

**Issue: "Cannot find module '@/lib/db'"**
```bash
npx prisma generate
```

**Issue: "Invalid `prisma.user.findUnique()` invocation"**
- Check DATABASE_URL is correct
- Run `npx prisma migrate deploy`

**Issue: "NextAuth session not working"**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

**Issue: "Unauthorized" on all API calls**
- Ensure middleware.ts is in src/ directory
- Check NextAuth configuration

---

## Success Criteria

✅ Application builds without errors  
✅ Database migrations applied successfully  
✅ Authentication works (login/logout)  
✅ API endpoints return expected data  
✅ Middleware protects routes correctly  
✅ No console errors in browser  
✅ Production environment variables set  

**Status: Ready for Production Deployment**

---

## Next Steps

1. Resolve TypeScript import path issues
2. Run full build: `npm run build`
3. Test locally: `npm run start`
4. Deploy to production
5. Monitor and iterate

For detailed testing procedures, see [TESTING.md](./TESTING.md)
