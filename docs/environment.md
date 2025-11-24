# Environment Configuration

## Environment Variables

FutureForm uses environment variables for configuration. Create a `.env.local` file in the project root.

## Required Variables

### Database Configuration

```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/futureform"
```

**Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

**Example:**
```bash
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/futureform_dev"
```

### Authentication

```bash
# NextAuth.js configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters-long"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Email Service (Mailgun)

```bash
# Mailgun API credentials
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="mg.yourdomain.com"
MAILGUN_FROM_EMAIL="noreply@yourdomain.com"
MAILGUN_FROM_NAME="FutureForm"
```

**Setup:**
1. Create account at [Mailgun](https://www.mailgun.com/)
2. Verify your domain
3. Get API key from Settings → API Keys
4. Use sandbox domain for testing

## Optional Variables

### Payment Integration (Flutterwave)

```bash
# Flutterwave payment gateway
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK-xxxxx"
FLUTTERWAVE_SECRET_KEY="FLWSECK-xxxxx"
FLUTTERWAVE_ENCRYPTION_KEY="FLWSECK_TESTxxxxx"
FLUTTERWAVE_WEBHOOK_HASH="your-webhook-hash"
```

**Setup:**
1. Create account at [Flutterwave](https://www.flutterwave.com/)
2. Get keys from Settings → API
3. Use test keys for development
4. Switch to live keys in production

### HubSpot CRM Integration

```bash
# HubSpot lead management
HUBSPOT_ACCESS_TOKEN="your-private-app-access-token"
HUBSPOT_ENABLED="true"
```

**Setup:**
See [HubSpot Setup Guide](../HUBSPOT_SETUP.md) for detailed instructions.

### Application Settings

```bash
# Application URL (used for emails and redirects)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Environment
NODE_ENV="development"  # or "production"

# Feature flags
ENABLE_ANALYTICS="false"
ENABLE_CHAT_SUPPORT="false"
```

## Environment-Specific Configuration

### Development (.env.local)

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/futureform_dev"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-in-production"

# Email (use Mailgun sandbox)
MAILGUN_API_KEY="your-sandbox-api-key"
MAILGUN_DOMAIN="sandbox123.mailgun.org"
MAILGUN_FROM_EMAIL="test@sandbox123.mailgun.org"

# Payment (use test keys)
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-xxxxx"
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-xxxxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Production (.env.production)

```bash
# Database (use managed PostgreSQL)
DATABASE_URL="postgresql://user:pass@prod-db.example.com:5432/futureform_prod"

# Auth
NEXTAUTH_URL="https://app.futureform.com"
NEXTAUTH_SECRET="production-secret-key-very-long-and-random"

# Email (verified domain)
MAILGUN_API_KEY="your-production-api-key"
MAILGUN_DOMAIN="mg.futureform.com"
MAILGUN_FROM_EMAIL="noreply@futureform.com"

# Payment (live keys)
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK-xxxxx"
FLUTTERWAVE_SECRET_KEY="FLWSECK-xxxxx"

# App
NEXT_PUBLIC_APP_URL="https://app.futureform.com"
NODE_ENV="production"

# Features
ENABLE_ANALYTICS="true"
ENABLE_CHAT_SUPPORT="true"
```

## Security Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### 2. Use Strong Secrets

```bash
# Generate secure random strings
openssl rand -base64 32
```

### 3. Rotate Secrets Regularly

- Change NEXTAUTH_SECRET every 90 days
- Rotate API keys quarterly
- Update database passwords annually

### 4. Environment-Specific Secrets

- Use different secrets for dev/staging/production
- Never use production secrets in development
- Store production secrets in secure vault

### 5. Access Control

- Limit who can access production secrets
- Use role-based access for secret management
- Audit secret access logs

## Validation

### Check Required Variables

```bash
# Run validation script
npm run validate:env
```

### Manual Validation

```typescript
// scripts/validate-env.ts
const required = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'MAILGUN_API_KEY',
];

required.forEach(key => {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
});
```

## Troubleshooting

### Database Connection Fails

**Error:** `Can't reach database server`

**Solutions:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL format
3. Ensure database exists
4. Verify network connectivity
5. Check firewall rules

### Email Not Sending

**Error:** `Mailgun authentication failed`

**Solutions:**
1. Verify MAILGUN_API_KEY is correct
2. Check domain is verified in Mailgun
3. Ensure FROM_EMAIL matches verified domain
4. Check Mailgun logs for errors

### Payment Integration Issues

**Error:** `Invalid Flutterwave credentials`

**Solutions:**
1. Verify you're using correct environment keys (test vs live)
2. Check keys haven't expired
3. Ensure webhook hash matches
4. Verify account is active

### HubSpot Sync Failing

**Error:** `HubSpot authentication failed`

**Solutions:**
1. Verify HUBSPOT_ACCESS_TOKEN is valid
2. Check token hasn't been revoked
3. Ensure required scopes are enabled
4. Verify HUBSPOT_ENABLED is "true"

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | - | Application base URL |
| `NEXTAUTH_SECRET` | Yes | - | JWT signing secret |
| `MAILGUN_API_KEY` | Yes | - | Mailgun API key |
| `MAILGUN_DOMAIN` | Yes | - | Mailgun sending domain |
| `MAILGUN_FROM_EMAIL` | Yes | - | Default sender email |
| `MAILGUN_FROM_NAME` | No | "FutureForm" | Default sender name |
| `FLUTTERWAVE_PUBLIC_KEY` | No | - | Flutterwave public key |
| `FLUTTERWAVE_SECRET_KEY` | No | - | Flutterwave secret key |
| `FLUTTERWAVE_ENCRYPTION_KEY` | No | - | Flutterwave encryption key |
| `HUBSPOT_ACCESS_TOKEN` | No | - | HubSpot private app token |
| `HUBSPOT_ENABLED` | No | "false" | Enable HubSpot integration |
| `NEXT_PUBLIC_APP_URL` | Yes | - | Public application URL |
| `NODE_ENV` | No | "development" | Environment mode |
| `ENABLE_ANALYTICS` | No | "false" | Enable analytics tracking |
| `ENABLE_CHAT_SUPPORT` | No | "false" | Enable live chat support |

## Loading Environment Variables

### In Next.js

Environment variables are automatically loaded from `.env.local`.

**Access in Server Components:**
```typescript
const dbUrl = process.env.DATABASE_URL;
```

**Access in Client Components (must be prefixed with NEXT_PUBLIC_):**
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
```

### In Scripts

```typescript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
```

## Testing Configuration

### Test Environment (.env.test)

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/futureform_test"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret-key"
```

### Load Test Environment

```bash
NODE_ENV=test npm test
```

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    env_file:
      - .env.local
```

## Cloud Platform Configuration

### Vercel

1. Go to Project Settings → Environment Variables
2. Add variables for each environment (Production, Preview, Development)
3. Sensitive variables are encrypted at rest

### Railway

1. Go to Project → Variables
2. Add environment variables
3. Variables are automatically injected

### AWS/Azure/GCP

Use secret management services:
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
