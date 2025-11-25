# FutureForm Database Setup Guide

## Overview

This guide explains how to switch between **local PostgreSQL** (for development) and **Supabase** (for production/main branch).

---

## Quick Reference

| Environment | Branch | Database | Config File |
|------------|--------|----------|-------------|
| **Development** | `dev` | Local PostgreSQL | `.env.local` |
| **Production** | `main` | Supabase | `.env.local` (with Supabase URL) |

---

## 🚀 Initial Setup

### Option 1: Local PostgreSQL (Recommended for Dev)

#### A. Install PostgreSQL Locally

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer (PostgreSQL 15 or later recommended)
3. Remember your postgres user password
4. Default port: 5432

**Verify Installation:**
```powershell
psql --version
```

#### B. Create Development Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE futureform_dev;

# Exit psql
\q
```

#### C. Configure Environment

1. **Copy the example file:**
   ```powershell
   cp .env.development.example .env.local
   ```

2. **Update `.env.local` with your PostgreSQL credentials:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/futureform_dev"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   ```

3. **Generate NextAuth Secret:**
   ```powershell
   # Using OpenSSL
   openssl rand -base64 32

   # OR using Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

#### D. Run Migrations and Seed

```powershell
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed

# Verify with Prisma Studio
npm run db:studio
```

---

### Option 2: Docker PostgreSQL (Alternative)

If you prefer Docker:

```powershell
# Pull and run PostgreSQL container
docker run --name futureform-postgres `
  -e POSTGRES_PASSWORD=docker `
  -e POSTGRES_DB=futureform_dev `
  -p 5432:5432 `
  -d postgres:15

# Verify container is running
docker ps

# Update .env.local
DATABASE_URL="postgresql://postgres:docker@localhost:5432/futureform_dev"
```

**Docker Management:**
```powershell
# Start container
docker start futureform-postgres

# Stop container
docker stop futureform-postgres

# View logs
docker logs futureform-postgres

# Remove container (WARNING: deletes data)
docker rm futureform-postgres
```

---

## 🔄 Switching Between Environments

### Switching to Local PostgreSQL (Dev Branch)

1. **Checkout dev branch:**
   ```powershell
   git checkout dev
   ```

2. **Update `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/futureform_dev"
   ```

3. **Run database setup:**
   ```powershell
   npm run db:setup
   ```

4. **Start development server:**
   ```powershell
   npm run dev
   ```

---

### Switching to Supabase (Main Branch)

1. **Checkout main branch:**
   ```powershell
   git checkout main
   ```

2. **Update `.env.local` with Supabase credentials:**
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   ```

   **Where to find Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to **Settings** → **Database**
   - Copy the **Connection String** (URI format)
   - Replace `[YOUR-PASSWORD]` with your actual database password

3. **Run migrations (if needed):**
   ```powershell
   npm run db:migrate:deploy
   ```

4. **Start server:**
   ```powershell
   npm run dev
   ```

---

## 📝 Available NPM Scripts

### Database Management

| Script | Description | When to Use |
|--------|-------------|-------------|
| `npm run db:migrate` | Create and apply new migration | After schema changes in dev |
| `npm run db:migrate:deploy` | Apply migrations (production) | Deploying to production |
| `npm run db:push` | Push schema without migration | Quick prototyping in dev |
| `npm run db:seed` | Seed database with initial data | After fresh database setup |
| `npm run db:studio` | Open Prisma Studio | Visual database management |
| `npm run db:reset` | Reset database (WARNING: deletes data) | Starting fresh in dev |
| `npm run db:setup` | Full setup (generate + push + seed) | Initial setup or reset |

### Development Workflows

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run dev:local` | Setup database + start dev server |
| `npm run prisma:generate` | Generate Prisma Client |

---

## 🔧 Common Tasks

### Creating a New Migration

```powershell
# 1. Make changes to prisma/schema.prisma

# 2. Create migration
npm run db:migrate

# 3. Enter migration name when prompted
# Example: "add_partner_type_field"

# 4. Migration files created in prisma/migrations/
```

### Resetting Local Database

```powershell
# WARNING: This deletes all data
npm run db:reset

# Then re-seed
npm run db:seed
```

### Syncing Schema Without Migration (Dev Only)

```powershell
# Push schema changes directly (no migration file)
npm run db:push

# Use this for rapid prototyping
# NOT recommended for production
```

### Viewing Database

```powershell
# Open Prisma Studio (GUI)
npm run db:studio

# OR connect with psql
psql -U postgres -d futureform_dev
```

---

## 🐛 Troubleshooting

### Issue: "Can't reach database server"

**Solution:**
1. Check if PostgreSQL is running:
   ```powershell
   # Windows Services
   Get-Service -Name postgresql*

   # OR for Docker
   docker ps
   ```

2. Verify connection string in `.env.local`
3. Check firewall settings (port 5432)

---

### Issue: "Migration failed"

**Solution:**
```powershell
# Reset migrations (dev only)
npm run db:reset

# Re-apply migrations
npm run db:migrate

# Re-seed
npm run db:seed
```

---

### Issue: "Prisma Client not generated"

**Solution:**
```powershell
npm run prisma:generate
```

---

### Issue: "Database already exists" error

**Solution:**
```powershell
# Drop and recreate database
psql -U postgres

DROP DATABASE futureform_dev;
CREATE DATABASE futureform_dev;
\q

# Re-run setup
npm run db:setup
```

---

### Issue: Supabase connection timeout

**Solution:**
1. Check if your IP is allowed in Supabase dashboard
2. Verify connection pooler settings
3. Use connection pooler URL (not direct connection)
4. Check if database is paused (free tier)

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already configured)
- Use different passwords for dev and production
- Rotate Supabase passwords regularly
- Use connection pooling for Supabase
- Backup production database regularly

### ❌ DON'T:
- Commit `.env.local` or `.env.production` to Git
- Share database credentials in Slack/email
- Use production credentials in development
- Run `db:reset` on production database
- Expose database ports publicly

---

## 📊 Database Backup & Restore

### Backup Local Database

```powershell
# Create backup
pg_dump -U postgres futureform_dev > backup_$(date +%Y%m%d).sql

# OR with Docker
docker exec futureform-postgres pg_dump -U postgres futureform_dev > backup.sql
```

### Restore Local Database

```powershell
# Restore from backup
psql -U postgres futureform_dev < backup_20250125.sql

# OR with Docker
docker exec -i futureform-postgres psql -U postgres futureform_dev < backup.sql
```

### Backup Supabase Database

Use Supabase dashboard:
1. Go to **Database** → **Backups**
2. Click **Create Backup**
3. Download backup file

---

## 🚢 Deployment Checklist

### Before Deploying to Production:

- [ ] All migrations tested in dev
- [ ] Database schema matches production
- [ ] Seed data reviewed and updated
- [ ] Environment variables configured in Vercel/hosting
- [ ] Supabase connection pooler enabled
- [ ] Database backup created
- [ ] Migration rollback plan ready

### Deployment Steps:

```powershell
# 1. Ensure you're on main branch
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Run migrations on production (Supabase)
npm run db:migrate:prod

# 4. Deploy to Vercel (or your hosting)
git push origin main
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review Prisma logs: `npx prisma --help`
3. Check database logs:
   - Local: Check PostgreSQL logs
   - Supabase: Check Supabase dashboard logs
4. Contact the team in #dev-help Slack channel

---

## 🔄 Quick Command Reference

```powershell
# SETUP
npm run db:setup              # Full database setup

# DEVELOPMENT
npm run dev                   # Start dev server
npm run dev:local             # Setup DB + start server
npm run db:studio             # Open Prisma Studio

# MIGRATIONS
npm run db:migrate            # Create & apply migration
npm run db:push               # Push schema (no migration)
npm run db:seed               # Seed database

# PRODUCTION
npm run db:migrate:deploy     # Apply migrations (prod)

# UTILITIES
npm run db:reset              # Reset database (dev only)
npm run prisma:generate       # Generate Prisma Client
```

---

**Last Updated:** 2025-11-25  
**Maintained By:** FutureForm Development Team
