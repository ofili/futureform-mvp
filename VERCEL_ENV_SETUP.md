# Vercel Environment Variables Setup

## 🚀 Complete Guide for Production Deployment

This guide shows you exactly which environment variables to add to Vercel for your production deployment.

---

## 📋 Required Environment Variables

### 1. Database (Supabase)

```bash
# Connection Pooler (for serverless functions)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (for migrations)
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres"
```

**How to get these:**
1. Go to Supabase Dashboard → Settings → Database
2. Under "Connection string":
   - **DATABASE_URL**: Use "Transaction" mode (port 6543)
   - **DIRECT_URL**: Use "Session" mode (port 5432)

---

### 2. Authentication (NextAuth)

```bash
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Your production domain
NEXTAUTH_URL="https://your-domain.vercel.app"
```

**Generate NEXTAUTH_SECRET:**
```bash
# Run this in your terminal:
openssl rand -base64 32

# Copy the output and use it as NEXTAUTH_SECRET
```

---

### 3. Node Environment

```bash
NODE_ENV="production"
```

---

### 4. Error Tracking (Sentry) - Optional but Recommended

```bash
# Get from https://sentry.io
NEXT_PUBLIC_SENTRY_DSN="https://[key]@o[org-id].ingest.sentry.io/[project-id]"

# For source map upload (optional)
SENTRY_AUTH_TOKEN="your-auth-token"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="your-project-name"
```

---

### 5. Email Service (Resend) - Optional

```bash
# Get from https://resend.com/api-keys
RESEND_API_KEY="re_..."
```

---

### 6. Payment (Flutterwave) - Optional

```bash
# Get from Flutterwave Dashboard
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-..."
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-..."
FLUTTERWAVE_ENCRYPTION_KEY="FLWSECK_TEST..."
```

---

### 7. HubSpot Integration - Optional

```bash
HUBSPOT_ENABLED="true"
HUBSPOT_ACCESS_TOKEN="pat-..."
```

---

## 🎯 How to Add to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Your Project**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings**
   - Click "Settings" tab
   - Click "Environment Variables" in sidebar

3. **Add Each Variable**
   - Click "Add New"
   - For each variable:
     - **Key**: Variable name (e.g., `DATABASE_URL`)
     - **Value**: Variable value
     - **Environments**: Select all (Production, Preview, Development)
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add NODE_ENV production

# Optional: Add Sentry
vercel env add NEXT_PUBLIC_SENTRY_DSN production

# Deploy
vercel --prod
```

---

### Method 3: Import from .env file

1. **Create `.env.production` file** (locally, don't commit!)
   ```bash
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NODE_ENV="production"
   ```

2. **Use Vercel CLI to import**
   ```bash
   vercel env pull .env.production
   ```

---

## 📝 Complete Environment Variables Checklist

Copy this template and fill in your values:

```bash
# ============================================
# REQUIRED - Must be set for app to work
# ============================================

# Database (Supabase)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres"

# Authentication
NEXTAUTH_SECRET="[run: openssl rand -base64 32]"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Environment
NODE_ENV="production"

# ============================================
# RECOMMENDED - For production features
# ============================================

# Error Tracking (Sentry)
NEXT_PUBLIC_SENTRY_DSN="https://[key]@o[org].ingest.sentry.io/[project]"
SENTRY_AUTH_TOKEN="[optional - for source maps]"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"

# ============================================
# OPTIONAL - Based on features you're using
# ============================================

# Email Service (Resend)
RESEND_API_KEY="re_..."

# Payment Processing (Flutterwave)
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-..."
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-..."
FLUTTERWAVE_ENCRYPTION_KEY="FLWSECK_TEST..."

# HubSpot Integration
HUBSPOT_ENABLED="true"
HUBSPOT_ACCESS_TOKEN="pat-..."
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets
```bash
# Add to .gitignore (should already be there)
.env
.env.local
.env.production
.env.*.local
```

### 2. Use Different Values for Each Environment
- **Development**: Use test/development credentials
- **Preview**: Use staging credentials
- **Production**: Use production credentials

### 3. Rotate Secrets Regularly
- Change `NEXTAUTH_SECRET` every 6 months
- Rotate API keys if compromised
- Update database passwords periodically

### 4. Limit Access
- Only give team members access to necessary secrets
- Use Vercel's team permissions

---

## 🧪 Testing Your Setup

### 1. Check Environment Variables
```bash
# In Vercel dashboard
Settings → Environment Variables

# Verify all required variables are set
```

### 2. Test Build
```bash
# Trigger a new deployment
# Check build logs for errors
```

### 3. Test Database Connection
```bash
# After deployment, check:
https://your-domain.vercel.app/api/health

# Should return:
{
  "status": "ok",
  "database": {
    "status": "connected",
    "latency": "50ms"
  }
}
```

### 4. Test Authentication
- Try logging in
- Try registering a new user
- Check if sessions work

---

## 🚨 Troubleshooting

### "Database connection failed"
**Problem**: Can't connect to Supabase

**Solutions**:
1. Verify `DATABASE_URL` is correct
2. Check password has no special characters that need escaping
3. Ensure you're using the pooler connection (port 6543)
4. Check Supabase is accessible from Vercel's IPs

### "NEXTAUTH_SECRET is not set"
**Problem**: Authentication not working

**Solutions**:
1. Verify `NEXTAUTH_SECRET` is set in Vercel
2. Generate a new secret: `openssl rand -base64 32`
3. Redeploy after adding the variable

### "Invalid redirect URI"
**Problem**: NextAuth redirect errors

**Solutions**:
1. Set `NEXTAUTH_URL` to your exact domain
2. Include `https://` in the URL
3. Don't include trailing slash
4. Example: `https://futureform.vercel.app`

### Environment variables not updating
**Problem**: Changes not taking effect

**Solutions**:
1. Redeploy after changing variables
2. Clear Vercel's cache: Settings → General → Clear Cache
3. Wait a few minutes for propagation

---

## 📊 Environment-Specific Variables

### Production
```bash
DATABASE_URL="postgresql://...production..."
NEXTAUTH_URL="https://futureform.com"
NODE_ENV="production"
```

### Preview (Staging)
```bash
DATABASE_URL="postgresql://...staging..."
NEXTAUTH_URL="https://preview.futureform.com"
NODE_ENV="production"
```

### Development
```bash
DATABASE_URL="postgresql://localhost:5432/futureform"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## ✅ Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] All required environment variables are set
- [ ] `NEXTAUTH_SECRET` is generated and unique
- [ ] `NEXTAUTH_URL` matches your domain
- [ ] Database connection strings are correct
- [ ] Sentry DSN is added (if using)
- [ ] All secrets are different from development
- [ ] `.env` files are in `.gitignore`
- [ ] Tested locally with production-like env vars

---

## 🎯 Quick Copy-Paste for Vercel

**Minimum Required Variables:**
```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres
NEXTAUTH_SECRET=[generate-with-openssl-rand-base64-32]
NEXTAUTH_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**With Sentry (Recommended):**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://[key]@o[org].ingest.sentry.io/[project]
```

---

## 🚀 You're Ready!

Once all environment variables are set:

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel will auto-deploy**
   - Watch the deployment in Vercel dashboard
   - Check build logs for errors

3. **Test your production app**
   - Visit your domain
   - Test authentication
   - Test database operations
   - Check `/api/health` endpoint

4. **Monitor**
   - Check Sentry for errors
   - Monitor Supabase usage
   - Watch Vercel analytics

**Congratulations! Your app is live! 🎉**
