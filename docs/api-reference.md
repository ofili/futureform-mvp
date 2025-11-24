# API Reference

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most API endpoints require authentication. Include the session cookie in requests.

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "jobTitle": "Project Manager",
  "department": "Operations"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "userId": "clx123abc..."
}
```

#### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "clx123abc...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Organization Management

### GET /api/v1/organizations
Get all organizations for the current user.

**Response:** `200 OK`
```json
[
  {
    "id": "org_123",
    "name": "Acme Corporation",
    "type": "Private Sector",
    "region": "Africa",
    "country": "Nigeria",
    "memberCount": 5,
    "role": "OWNER"
  }
]
```

### POST /api/v1/organizations
Create a new organization.

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "type": "Private Sector",
  "sectorFocus": "Technology",
  "region": "Africa",
  "country": "Nigeria",
  "relationshipStage": "Discovery",
  "source": "Website"
}
```

**Response:** `201 Created`

---

## Project Management

### GET /api/v1/projects
Get all projects for the current user's organization.

**Query Parameters:**
- `organizationId` (optional): Filter by organization
- `status` (optional): Filter by status (PLANNING, ACTIVE, COMPLETED, ARCHIVED)

**Response:** `200 OK`
```json
[
  {
    "id": "proj_123",
    "name": "Digital Transformation Initiative",
    "type": "PRE_INVESTMENT_DUE_DILIGENCE",
    "status": "ACTIVE",
    "sector": "Technology",
    "region": "Africa",
    "createdAt": "2025-11-01T10:00:00Z",
    "assessmentCount": 3
  }
]
```

### POST /api/v1/projects
Create a new project.

**Request Body:**
```json
{
  "name": "Digital Transformation Initiative",
  "description": "Evaluating technology partners for digital transformation",
  "type": "PRE_INVESTMENT_DUE_DILIGENCE",
  "sector": "Technology",
  "region": "Africa",
  "country": "Nigeria",
  "objectives": "Assess vendor capabilities and risks",
  "organizationId": "org_123"
}
```

**Response:** `201 Created`

### GET /api/v1/projects/[id]
Get project details by ID.

**Response:** `200 OK`
```json
{
  "id": "proj_123",
  "name": "Digital Transformation Initiative",
  "description": "...",
  "type": "PRE_INVESTMENT_DUE_DILIGENCE",
  "status": "ACTIVE",
  "assessments": [...],
  "teamMembers": [...],
  "createdBy": {...}
}
```

---

## Assessment Management

### POST /api/v1/assessments
Create a new assessment.

**Request Body:**
```json
{
  "projectId": "proj_123",
  "partnerName": "Tech Solutions Ltd",
  "partnerType": "Technology Vendor",
  "partnerAdminEmail": "admin@techsolutions.com",
  "type": "due_diligence",
  "depth": "standard",
  "deadline": "2025-12-31T23:59:59Z"
}
```

**Response:** `201 Created`
```json
{
  "id": "assess_123",
  "token": "abc123def456",
  "status": "PENDING",
  "invitedAt": "2025-11-23T10:00:00Z"
}
```

### GET /api/v1/assessments/[id]
Get assessment details.

**Response:** `200 OK`
```json
{
  "id": "assess_123",
  "project": {...},
  "partner": {...},
  "status": "IN_PROGRESS",
  "questions": [...],
  "responses": [...],
  "overallScore": 75,
  "confidenceLevel": 85
}
```

### POST /api/v1/assessments/[id]/responses
Submit assessment responses.

**Request Body:**
```json
{
  "questionId": "q_123",
  "response": "Yes",
  "evidenceFiles": [
    {
      "name": "certificate.pdf",
      "url": "https://...",
      "size": 102400
    }
  ]
}
```

**Response:** `201 Created`

---

## Partner Management

### GET /api/v1/partners
Search for partners in the global registry.

**Query Parameters:**
- `search` (optional): Search by name
- `sector` (optional): Filter by sector
- `country` (optional): Filter by country

**Response:** `200 OK`
```json
[
  {
    "id": "partner_123",
    "legalName": "Tech Solutions Ltd",
    "tradeName": "TechSol",
    "website": "https://techsolutions.com",
    "sector": "Technology",
    "country": "Nigeria",
    "verification": "SELF_VERIFIED"
  }
]
```

### POST /api/v1/partners
Create a new partner in the global registry.

**Request Body:**
```json
{
  "legalName": "Tech Solutions Ltd",
  "tradeName": "TechSol",
  "website": "https://techsolutions.com",
  "sector": "Technology",
  "country": "Nigeria",
  "headquarters": "Lagos"
}
```

**Response:** `201 Created`

---

## Admin Endpoints

All admin endpoints require `ADMIN` role.

### GET /api/v1/admin/users
Get all users (admin only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `role` (optional): Filter by role

**Response:** `200 OK`
```json
{
  "users": [...],
  "total": 150,
  "page": 1,
  "totalPages": 3
}
```

### GET /api/v1/admin/settings
Get platform configuration settings.

**Response:** `200 OK`
```json
{
  "general": [...],
  "billing": [...],
  "email": [...]
}
```

### PATCH /api/v1/admin/settings
Update a configuration setting.

**Request Body:**
```json
{
  "key": "billing.default_credits",
  "value": 100
}
```

**Response:** `200 OK`

---

## Billing & Credits

### GET /api/v1/billing/tiers
Get subscription tiers.

**Response:** `200 OK`
```json
[
  {
    "id": "tier_free",
    "name": "Free",
    "price": 0,
    "credits": 10,
    "features": [...]
  },
  {
    "id": "tier_pro",
    "name": "Professional",
    "price": 99,
    "credits": 100,
    "features": [...]
  }
]
```

### GET /api/v1/billing/packages
Get credit packages.

**Response:** `200 OK`
```json
[
  {
    "id": "pkg_small",
    "name": "Small Pack",
    "credits": 50,
    "price": 49
  }
]
```

### POST /api/v1/billing/purchase
Purchase credits or subscription.

**Request Body:**
```json
{
  "packageId": "pkg_small",
  "paymentMethod": "flutterwave"
}
```

**Response:** `200 OK`
```json
{
  "paymentUrl": "https://checkout.flutterwave.com/...",
  "transactionId": "txn_123"
}
```

---

## Marketing & Leads

### POST /api/marketing/pql
Capture product-qualified lead (framework download).

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "organization": "Example Corp",
  "sector": "Technology",
  "country": "Nigeria",
  "source": "framework_download"
}
```

**Response:** `200 OK`
```json
{
  "message": "PQL received",
  "downloadToken": "abc123...",
  "leadId": "lead_123"
}
```

### GET /api/framework/download
Download framework PDF using token.

**Query Parameters:**
- `token`: Download token from PQL endpoint

**Response:** `200 OK` (PDF file)

---

## HubSpot Integration (Admin)

### GET /api/admin/hubspot/sync-status
Get HubSpot sync statistics.

**Response:** `200 OK`
```json
{
  "stats": {
    "totalLeads": 150,
    "syncedLeads": 145,
    "failedLeads": 5,
    "pendingLeads": 0,
    "lastSyncedAt": "2025-11-23T10:00:00Z"
  },
  "failedLeads": [...]
}
```

### POST /api/admin/hubspot/retry-sync
Retry HubSpot sync for a specific lead.

**Request Body:**
```json
{
  "leadId": "lead_123"
}
```

**Response:** `200 OK`

### POST /api/admin/hubspot/bulk-retry
Retry all failed HubSpot syncs.

**Response:** `200 OK`
```json
{
  "results": {
    "total": 5,
    "succeeded": 4,
    "failed": 1
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": {...}
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour
- **Admin endpoints**: 5000 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1638360000
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

**Response Headers:**
```
X-Total-Count: 150
X-Page: 1
X-Per-Page: 50
X-Total-Pages: 3
```

---

## Webhooks

Coming soon...

---

## SDK & Client Libraries

Coming soon...
