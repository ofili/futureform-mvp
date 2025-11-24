/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/marketing/pql/route';
// import { mockMarketingLead } from '../../fixtures/mockData';

const mockMarketingLead = {
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

// Mock Prisma
const mockPrismaClient = {
    marketingLead: {
        create: jest.fn(),
        update: jest.fn(),
    },
};

jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: mockPrismaClient,
}));



// Mock HubSpot
jest.mock('@/lib/hubspot', () => ({
    createHubSpotContact: jest.fn(),
}));

// Mock crypto
jest.mock('crypto', () => ({
    randomBytes: jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue('mocked-token'),
    }),
}));

// Mock next/server
jest.mock('next/server', () => ({
    NextRequest: jest.fn().mockImplementation((url, init) => ({
        json: async () => JSON.parse(init.body),
        headers: init.headers,
    })),
    NextResponse: {
        json: jest.fn().mockImplementation((body, init) => ({
            json: async () => body,
            status: init?.status || 200,
        })),
    },
}));

import prisma from '@/lib/prisma';
import { createHubSpotContact } from '@/lib/hubspot';

describe('POST /api/marketing/pql', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create marketing lead successfully', async () => {
        const mockCreatedLead = {
            ...mockMarketingLead,
            downloadToken: 'generated-token',
        };

        (prisma.marketingLead.create as jest.Mock).mockResolvedValue(mockCreatedLead);
        (createHubSpotContact as jest.Mock).mockResolvedValue({
            success: true,
            contactId: 'hubspot_123',
        });

        const request = {
            json: async () => ({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                organization: 'Example Corp',
                sector: 'Technology',
                country: 'Nigeria',
                source: 'framework_download',
            }),
            headers: new Headers({
                'user-agent': 'test-agent',
            }),
        } as unknown as NextRequest;

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe('PQL received');
        expect(data.downloadToken).toBeDefined();
        expect(data.leadId).toBe(mockCreatedLead.id);
        expect(prisma.marketingLead.create).toHaveBeenCalled();
    });

    it('should sync to HubSpot after creating lead', async () => {
        const mockCreatedLead = { ...mockMarketingLead };

        (prisma.marketingLead.create as jest.Mock).mockResolvedValue(mockCreatedLead);
        (prisma.marketingLead.update as jest.Mock).mockResolvedValue(mockCreatedLead);
        (createHubSpotContact as jest.Mock).mockResolvedValue({
            success: true,
            contactId: 'hubspot_123',
        });

        const request = {
            json: async () => ({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                organization: 'Example Corp',
            }),
            headers: new Headers(),
        } as unknown as NextRequest;

        await POST(request);

        expect(createHubSpotContact).toHaveBeenCalledWith(
            expect.objectContaining({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                organization: 'Example Corp',
            })
        );

        expect(prisma.marketingLead.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: mockCreatedLead.id },
                data: expect.objectContaining({
                    hubspotSynced: true,
                    hubspotContactId: 'hubspot_123',
                }),
            })
        );
    });

    it('should handle HubSpot sync failure gracefully', async () => {
        const mockCreatedLead = { ...mockMarketingLead };

        (prisma.marketingLead.create as jest.Mock).mockResolvedValue(mockCreatedLead);
        (prisma.marketingLead.update as jest.Mock).mockResolvedValue(mockCreatedLead);
        (createHubSpotContact as jest.Mock).mockResolvedValue({
            success: false,
            error: 'HubSpot API error',
        });

        const request = {
            json: async () => ({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                organization: 'Example Corp',
            }),
            headers: new Headers(),
        } as unknown as NextRequest;

        const response = await POST(request);

        expect(response.status).toBe(200); // Should still succeed
        expect(prisma.marketingLead.update).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    hubspotSynced: false,
                    hubspotSyncError: 'HubSpot API error',
                }),
            })
        );
    });

    it('should return 400 for missing required fields', async () => {
        const request = {
            json: async () => ({
                firstName: 'Jane',
                // Missing lastName, email, organization
            }),
            headers: new Headers(),
        } as unknown as NextRequest;

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Missing required fields');
    });

    it('should handle database errors', async () => {
        (prisma.marketingLead.create as jest.Mock).mockRejectedValue(
            new Error('Database error')
        );

        const request = {
            json: async () => ({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                organization: 'Example Corp',
            }),
            headers: new Headers(),
        } as unknown as NextRequest;

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to process request');
    });
});
