# Architecture Overview

## System Architecture

FutureForm is built as a modern full-stack web application using the following architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js 16 (React 18)                               │   │
│  │  - Server Components                                 │   │
│  │  - Client Components                                 │   │
│  │  - API Routes                                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth Layer  │  │  API Layer   │  │  UI Layer    │      │
│  │  NextAuth.js │  │  REST APIs   │  │  Radix UI    │      │
│  └──────────────┘  └──────────────┘  │  Tailwind    │      │
│                                       └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Prisma ORM │  │  PostgreSQL  │  │  File Storage│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 External Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   HubSpot    │  │  Flutterwave │  │   Mailgun    │      │
│  │     CRM      │  │   Payments   │  │    Email     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Component Library**: Radix UI
- **State Management**: Zustand, React Query
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes (REST)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **File Uploads**: React Dropzone

### External Integrations
- **CRM**: HubSpot API v3
- **Payments**: Flutterwave
- **Email**: Mailgun
- **PDF Generation**: @react-pdf/renderer

## Design Patterns

### 1. Server-Side Rendering (SSR)
- Pages are rendered on the server for better SEO and initial load performance
- Dynamic data fetching with React Server Components
- Streaming and Suspense for progressive rendering

### 2. API Route Handlers
- RESTful API endpoints using Next.js Route Handlers
- Centralized error handling
- Authentication middleware
- Role-based access control (RBAC)

### 3. Database Access Layer
- Prisma ORM for type-safe database queries
- Database migrations for schema versioning
- Seeding scripts for initial data
- Connection pooling for performance

### 4. Component Architecture
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── admin/            # Admin-specific components
│   └── assessments/      # Assessment components
├── lib/                   # Utilities and helpers
│   ├── auth.ts           # Authentication config
│   ├── prisma.ts         # Prisma client
│   └── hubspot.ts        # HubSpot integration
└── hooks/                 # Custom React hooks
```

## Data Flow

### 1. User Request Flow
```
User → Next.js Page → Server Component → API Route → Prisma → PostgreSQL
                                                          ↓
                                                     Response
```

### 2. Authentication Flow
```
Login → NextAuth.js → Credentials Provider → Database Lookup → JWT Token
                                                                    ↓
                                                            Session Cookie
```

### 3. Assessment Creation Flow
```
User Input → Form Validation → API Route → Database Transaction
                                              ├── Create Assessment
                                              ├── Generate Questions (AI)
                                              ├── Send Invitations
                                              └── Deduct Credits
```

## Security Architecture

### Authentication & Authorization
- **Session Management**: JWT-based sessions with NextAuth.js
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access Control (RBAC)**:
  - User roles: `USER`, `ADMIN`, `PARTNER`
  - Organization roles: `OWNER`, `ORG_ADMIN`, `MEMBER`, `REVIEWER`, etc.

### API Security
- **Authentication**: Required for all protected routes
- **Authorization**: Role-based endpoint access
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **XSS Protection**: React's built-in escaping
- **CSRF Protection**: SameSite cookies

### Data Protection
- **Environment Variables**: Sensitive data in `.env.local`
- **Encryption**: Passwords hashed, tokens encrypted
- **HTTPS**: Required in production
- **Database**: Connection string encryption

## Scalability Considerations

### Performance Optimization
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Caching**: React Query for client-side caching
- **Database Indexing**: Strategic indexes on frequently queried fields

### Horizontal Scaling
- **Stateless API**: Can run multiple instances
- **Database Connection Pooling**: Prisma connection pool
- **CDN**: Static assets served via CDN
- **Load Balancing**: Ready for load balancer deployment

## Monitoring & Logging

### Application Logging
- **Console Logging**: Development environment
- **Structured Logging**: Production-ready format
- **Error Tracking**: Centralized error logging
- **Performance Monitoring**: API response times

### Database Monitoring
- **Query Performance**: Prisma query logging
- **Connection Pool**: Monitor active connections
- **Slow Query Log**: Identify bottlenecks

## Deployment Architecture

### Development
```
Local Machine → PostgreSQL (local) → Next.js Dev Server (port 3000)
```

### Production
```
Vercel/Cloud Platform → PostgreSQL (managed) → Next.js Production Build
                                                        ↓
                                                Load Balancer
                                                        ↓
                                                Multiple Instances
```

## Module Breakdown

### Core Modules
1. **Authentication Module**: User registration, login, password reset
2. **Organization Module**: Multi-tenant organization management
3. **Project Module**: Project creation and management
4. **Assessment Module**: Trust assessment workflow
5. **Partner Module**: Partner registry and evaluation
6. **Admin Module**: Platform administration
7. **Billing Module**: Credits and subscription management

### Supporting Modules
1. **Notification Module**: Email and in-app notifications
2. **Document Module**: File upload and management
3. **Support Module**: Ticketing system
4. **Analytics Module**: Dashboard and reporting

## API Architecture

### RESTful Endpoints
```
/api/v1/
├── auth/              # Authentication endpoints
├── users/             # User management
├── organizations/     # Organization CRUD
├── projects/          # Project management
├── assessments/       # Assessment workflow
├── partners/          # Partner registry
├── admin/             # Admin operations
├── billing/           # Payment and credits
└── marketing/         # Lead capture
```

See [API Reference](./api-reference.md) for detailed endpoint documentation.

## Database Architecture

### Key Models
- **User**: User accounts and authentication
- **Organization**: Multi-tenant organizations
- **Project**: Assessment projects
- **Assessment**: Trust assessments
- **Partner**: Global partner registry
- **PartnerAlias**: Organization-scoped partner views
- **Question**: Assessment questions
- **AssessmentResponse**: User responses
- **MarketingLead**: Lead capture and CRM sync

See [Database Schema](./database.md) for complete schema documentation.

## Future Architecture Considerations

### Planned Enhancements
- **Microservices**: Break out assessment engine
- **Message Queue**: Async processing for emails and notifications
- **Caching Layer**: Redis for session and data caching
- **Search Engine**: Elasticsearch for advanced search
- **Real-time Features**: WebSocket support for live updates
- **Mobile App**: React Native mobile application
