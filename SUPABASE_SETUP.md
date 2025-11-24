# Supabase PostgreSQL Setup Guide

## 🎯 Complete Setup in 15 Minutes

This guide will walk you through setting up Supabase as your production PostgreSQL database.

---

## Step 1: Create Supabase Account (2 minutes)

1. **Visit Supabase**
   - Go to: https://supabase.com
   - Click "Start your project"

2. **Sign Up**
   - Use GitHub (recommended) or email
   - Verify your email if using email signup

3. **You're in!**
   - You'll see the Supabase dashboard

---

## Step 2: Create New Project (3 minutes)

1. **Click "New Project"**
   - In the dashboard, click the green "New project" button

2. **Fill in Project Details:**
   ```
   Name: futureform-production
   Database Password: [Click "Generate a password" - SAVE THIS!]
   Region: Choose closest to your users:
     - Africa: South Africa (Cape Town)
     - Europe: Frankfurt, London, Paris
     - US: East US (N. Virginia) or West US (Oregon)
   Pricing Plan: Free
   ```

3. **Important: Save Your Password!**
   - Copy the generated password immediately
   - Store it in a password manager
   - You'll need this for the connection string

4. **Click "Create new project"**
   - Wait 2-3 minutes for provisioning
   - You'll see a progress indicator

---

## Step 3: Get Connection String (2 minutes)

1. **Navigate to Database Settings**
   - In your project dashboard
   - Click "Settings" (gear icon) in the left sidebar
   - Click "Database"

2. **Find Connection String**
   - Scroll to "Connection string" section
   - You'll see several options:
     - URI (use this one)
     - Pooler (for serverless)
     - Direct connection

3. **Copy the URI Connection String**
   - Click on "URI" tab
   - Copy the connection string
   - It looks like:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

4. **Replace `[YOUR-PASSWORD]`**
   - Replace `[YOUR-PASSWORD]` with the password you saved earlier
   - Final string should look like:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:MySecurePassword123@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

---

## Step 4: Configure Your Application (3 minutes)

### For Local Development

1. **Update `.env.local`**
   ```bash
   # Open .env.local in your project
   # Replace the DATABASE_URL with your Supabase connection string
   
   DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:YourPassword@aws-0-region.pooler.supabase.com:6543/postgres"
   ```

2. **Test the Connection**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Test connection by opening Prisma Studio
   npx prisma studio
   ```
   
   If Prisma Studio opens successfully, your connection works! ✅

### For Production (Vercel/Railway/etc.)

1. **Add Environment Variable**
   - In your hosting platform dashboard
   - Go to Environment Variables
   - Add:
     ```
     Name: DATABASE_URL
     Value: postgresql://postgres.xxxxxxxxxxxxx:YourPassword@aws-0-region.pooler.supabase.com:6543/postgres
     ```

---

## Step 5: Run Database Migrations (3 minutes)

1. **Run Migrations**
   ```bash
   # This creates all your tables in Supabase
   npx prisma migrate deploy
   ```

2. **Verify Tables Were Created**
   - In Supabase dashboard
   - Click "Table Editor" in left sidebar
   - You should see all your tables:
     - User
     - Organization
     - Project
     - Assessment
     - Credit
     - etc.

3. **Seed Initial Data**
   ```bash
   # Add subscription tiers, credit pricing, etc.
   npx prisma db seed
   ```

---

## Step 6: Create Admin User (2 minutes)

1. **Run Admin Creation Script**
   ```bash
   # If you have create-admin.ts
   npx tsx create-admin.ts
   
   # Or use Prisma Studio
   npx prisma studio
   ```

2. **Manually Create Admin (Alternative)**
   - Open Prisma Studio: `npx prisma studio`
   - Go to "User" table
   - Click "Add record"
   - Fill in:
     ```
     email: admin@futureform.com
     password: [hashed password - use bcrypt]
     firstName: Admin
     lastName: User
     role: ADMIN
     emailVerified: true
     ```

---

## Step 7: Configure Connection Pooling (Optional but Recommended)

Supabase provides two connection modes:

### Session Mode (Default - Port 5432)
- Direct connection to database
- Good for: Long-running connections, migrations
- Connection string:
  ```
  postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres
  ```

### Transaction Mode (Pooler - Port 6543) ⭐ Recommended
- Connection pooling for serverless
- Good for: Vercel, serverless functions, API routes
- Connection string (already using this):
  ```
  postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  ```

**For your Next.js app, use the Pooler (port 6543)** - it's already in your connection string!

---

## Step 8: Enable Backups (1 minute)

1. **Automatic Backups (Free Tier)**
   - Supabase automatically backs up your database daily
   - Retained for 7 days on free tier
   - No configuration needed! ✅

2. **Point-in-Time Recovery (Paid Plans)**
   - Available on Pro plan ($25/month)
   - Restore to any point in last 7 days

---

## Step 9: Monitor Your Database

### In Supabase Dashboard

1. **Database Health**
   - Click "Database" in sidebar
   - View:
     - Database size
     - Active connections
     - Query performance

2. **Logs**
   - Click "Logs" in sidebar
   - View database queries and errors

3. **API Logs**
   - See all API requests
   - Monitor performance

---

## 🔒 Security Best Practices

### 1. Connection String Security
```bash
# ❌ NEVER commit this to Git
DATABASE_URL="postgresql://..."

# ✅ Always use environment variables
# Add to .gitignore:
.env
.env.local
.env.production
```

### 2. Enable Row Level Security (RLS)
In Supabase dashboard:
- Go to "Authentication" → "Policies"
- Enable RLS on sensitive tables
- (Optional for now, but good for future)

### 3. Restrict Database Access
- Only allow connections from your app's IP
- Settings → Database → Network Restrictions
- (Free tier has some limitations)

---

## 📊 Monitoring & Limits

### Free Tier Limits
- **Database Size**: 500 MB
- **Bandwidth**: 2 GB/month
- **Concurrent Connections**: 60
- **Backups**: Daily (7 days retention)

### Monitor Usage
1. Go to Settings → Usage
2. Track:
   - Database size
   - Bandwidth
   - API requests
   - Storage

### When to Upgrade
Upgrade to Pro ($25/month) when you:
- Exceed 500 MB database size
- Need more than 2 GB bandwidth
- Need point-in-time recovery
- Need more than 60 concurrent connections

---

## 🧪 Testing Your Setup

### 1. Test Connection
```bash
# Should connect successfully
npx prisma studio
```

### 2. Test Migrations
```bash
# Should show all tables
npx prisma migrate status
```

### 3. Test Queries
```bash
# Open Prisma Studio and try:
# - Creating a user
# - Creating an organization
# - Querying data
npx prisma studio
```

### 4. Test from Your App
```bash
# Start your app
npm run dev

# Try:
# - Registering a user
# - Logging in
# - Creating a project
```

---

## 🚨 Troubleshooting

### Connection Timeout
**Problem**: Can't connect to database

**Solutions**:
1. Check your connection string is correct
2. Verify password has no special characters that need escaping
3. Try the direct connection (port 5432) instead of pooler
4. Check Supabase status: https://status.supabase.com

### "Too Many Connections"
**Problem**: Exceeded connection limit

**Solutions**:
1. Use the pooler connection (port 6543) - you already are!
2. Close unused connections
3. Upgrade to Pro plan for more connections

### Slow Queries
**Problem**: Database queries are slow

**Solutions**:
1. Add indexes to frequently queried columns
2. Check query performance in Supabase dashboard
3. Optimize your Prisma queries
4. Consider upgrading for better performance

### Migration Fails
**Problem**: `prisma migrate deploy` fails

**Solutions**:
1. Check your schema is valid: `npx prisma validate`
2. Try resetting: `npx prisma migrate reset` (⚠️ deletes all data)
3. Check Supabase logs for errors
4. Ensure you're using the correct connection string

---

## 🎯 Quick Reference

### Essential Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Open database browser
npx prisma studio

# Check migration status
npx prisma migrate status

# Seed database
npx prisma db seed

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Connection Strings
```bash
# Pooler (Recommended for Next.js/Vercel)
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Direct (For migrations, long-running tasks)
postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres
```

### Important URLs
- Dashboard: https://supabase.com/dashboard
- Documentation: https://supabase.com/docs
- Status: https://status.supabase.com
- Community: https://github.com/supabase/supabase/discussions

---

## ✅ Checklist

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Saved database password
- [ ] Copied connection string
- [ ] Updated .env.local with DATABASE_URL
- [ ] Tested connection with `npx prisma studio`
- [ ] Ran migrations with `npx prisma migrate deploy`
- [ ] Verified tables in Supabase Table Editor
- [ ] Seeded initial data
- [ ] Created admin user
- [ ] Added DATABASE_URL to production environment
- [ ] Tested app with Supabase database

---

## 🎉 You're Done!

Your Supabase PostgreSQL database is now set up and ready for production!

**Next Steps:**
1. Deploy your app to Vercel/Railway
2. Add DATABASE_URL to production environment
3. Run migrations on production
4. Test your production deployment
5. Monitor usage in Supabase dashboard

**Need Help?**
- Supabase Docs: https://supabase.com/docs/guides/database
- Prisma + Supabase: https://supabase.com/docs/guides/integrations/prisma
- Community: https://github.com/supabase/supabase/discussions
