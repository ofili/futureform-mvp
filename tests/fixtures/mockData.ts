/**
 * Test Fixtures and Mock Data
 */

export const mockUser = {
    id: 'user_123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER' as const,
    verified: true,
    emailVerified: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockAdminUser = {
    ...mockUser,
    id: 'admin_123',
    email: 'admin@example.com',
    role: 'ADMIN' as const,
};

export const mockOrganization = {
    id: 'org_123',
    name: 'Test Organization',
    type: 'Private Sector',
    sectorFocus: 'Technology',
    region: 'Africa',
    country: 'Nigeria',
    relationshipStage: 'Discovery',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockProject = {
    id: 'proj_123',
    name: 'Test Project',
    description: 'A test project for assessment',
    type: 'PRE_INVESTMENT_DUE_DILIGENCE' as const,
    sector: 'Technology',
    region: 'Africa',
    country: 'Nigeria',
    status: 'ACTIVE' as const,
    objectives: 'Test objectives',
    createdById: mockUser.id,
    organizationId: mockOrganization.id,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockPartner = {
    id: 'partner_123',
    legalName: 'Tech Solutions Ltd',
    tradeName: 'TechSol',
    website: 'https://techsol.com',
    country: 'Nigeria',
    sector: 'Technology',
    verification: 'SELF_VERIFIED' as const,
    aggregateScore: 75.5,
    usageCount: 5,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockAssessment = {
    id: 'assess_123',
    projectId: mockProject.id,
    partnerGlobalId: mockPartner.id,
    status: 'PENDING' as const,
    token: 'unique-assessment-token',
    type: 'due_diligence',
    depth: 'standard',
    deadline: new Date('2025-12-31'),
    overallScore: null,
    confidenceLevel: null,
    invitedAt: new Date('2025-01-01'),
    completedAt: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockQuestion = {
    id: 'q_123',
    domain: 'Governance',
    text: 'Does the organization have a documented governance structure?',
    helpText: 'Provide details about the governance framework',
    category: 'Leadership',
    weight: 1.0,
    order: 1,
    subDomain: 'Corporate Governance',
    sectorTags: ['Technology', 'Finance'],
    evidenceTypes: ['Document', 'Policy'],
    baseScore: 1.0,
};

export const mockAssessmentResponse = {
    id: 'response_123',
    assessmentId: mockAssessment.id,
    questionId: mockQuestion.id,
    userId: mockUser.id,
    response: 'Yes',
    evidenceFiles: [
        {
            name: 'governance-policy.pdf',
            url: 'https://example.com/file.pdf',
            size: 102400,
        },
    ],
    validated: false,
    validationStatus: 'PENDING',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockMarketingLead = {
    id: 'lead_123',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    organization: 'Example Corp',
    sector: 'Technology',
    country: 'Nigeria',
    source: 'framework_download',
    downloadToken: 'download-token-123',
    tokenUsed: false,
    converted: false,
    status: 'NEW',
    hubspotSynced: false,
    hubspotContactId: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

export const mockCreditTransaction = {
    id: 'txn_123',
    userId: mockUser.id,
    creditId: 'credit_123',
    amount: -10,
    type: 'USAGE',
    description: 'Assessment creation',
    assessmentId: mockAssessment.id,
    createdAt: new Date('2025-01-01'),
};

export const mockSupportTicket = {
    id: 'ticket_123',
    ticketNumber: 'TICKET-001',
    userId: mockUser.id,
    category: 'TECHNICAL' as const,
    subject: 'Test ticket',
    description: 'This is a test support ticket',
    status: 'OPEN' as const,
    priority: 'MEDIUM' as const,
    assignedTo: null,
    resolvedAt: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
};

/**
 * Mock API Responses
 */
export const mockApiResponses = {
    success: {
        message: 'Success',
        data: {},
    },
    error: {
        error: 'An error occurred',
    },
    unauthorized: {
        error: 'Unauthorized',
    },
    notFound: {
        error: 'Resource not found',
    },
    validationError: {
        error: 'Validation failed',
        details: {
            email: 'Invalid email format',
        },
    },
};

/**
 * Mock Session Data
 */
export const mockSession = {
    user: {
        id: mockUser.id,
        email: mockUser.email,
        name: `${mockUser.firstName} ${mockUser.lastName}`,
        role: mockUser.role,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockAdminSession = {
    user: {
        id: mockAdminUser.id,
        email: mockAdminUser.email,
        name: `${mockAdminUser.firstName} ${mockAdminUser.lastName}`,
        role: mockAdminUser.role,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};
