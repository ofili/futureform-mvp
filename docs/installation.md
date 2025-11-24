# Installation Guide

## Prerequisites

Before installing FutureForm, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v14 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- **npm** or **yarn** package manager

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ofili/futureform-mvp.git
cd futureform-mvp/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/futureform"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email Service (Mailgun)
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-mailgun-domain"
MAILGUN_FROM_EMAIL="noreply@yourdomain.com"

# Payment (Flutterwave)
FLUTTERWAVE_PUBLIC_KEY="your-flutterwave-public-key"
FLUTTERWAVE_SECRET_KEY="your-flutterwave-secret-key"
FLUTTERWAVE_ENCRYPTION_KEY="your-flutterwave-encryption-key"

# HubSpot Integration (Optional)
HUBSPOT_ACCESS_TOKEN="your-hubspot-access-token"
HUBSPOT_ENABLED="true"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

See [Environment Configuration](./environment.md) for detailed explanations of each variable.

### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with initial data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Production Installation

### 1. Build the Application

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

## Docker Installation (Optional)

Coming soon...

## Verification

After installation, verify everything is working:

1. **Access the application**: Navigate to `http://localhost:3000`
2. **Create admin user**: Run `ts-node create-admin.ts`
3. **Login**: Use admin credentials to access `/admin`
4. **Check database**: Verify tables are created in PostgreSQL

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull
```

If connection fails:
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env.local`
- Ensure database exists

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Port Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

## Next Steps

- [Environment Configuration](./environment.md) - Configure all environment variables
- [Database Schema](./database.md) - Understand the data model
- [Development Workflow](./development.md) - Set up your development environment
- [Testing Guide](../TESTING.md) - Run tests and verify functionality
