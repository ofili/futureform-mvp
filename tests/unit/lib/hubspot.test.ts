import { createHubSpotContact, isHubSpotConfigured } from '@/lib/hubspot';

// Mock fetch globally
global.fetch = jest.fn();

describe('HubSpot Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.HUBSPOT_ENABLED = 'true';
        process.env.HUBSPOT_ACCESS_TOKEN = 'test-token';
    });

    afterEach(() => {
        process.env.HUBSPOT_ENABLED = 'false';
        process.env.HUBSPOT_ACCESS_TOKEN = '';
    });

    describe('isHubSpotConfigured', () => {
        it('should return true when properly configured', () => {
            expect(isHubSpotConfigured()).toBe(true);
        });

        it('should return false when disabled', () => {
            process.env.HUBSPOT_ENABLED = 'false';
            expect(isHubSpotConfigured()).toBe(false);
        });

        it('should return false when token is missing', () => {
            process.env.HUBSPOT_ACCESS_TOKEN = '';
            expect(isHubSpotConfigured()).toBe(false);
        });
    });

    describe('createHubSpotContact', () => {
        const mockLeadData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            organization: 'Test Corp',
            sector: 'Technology',
            country: 'Nigeria',
            source: 'framework_download',
        };

        it('should create contact successfully', async () => {
            const mockResponse = {
                ok: true,
                json: async () => ({ id: 'contact_123' }),
                headers: new Headers(),
            };
            (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

            const result = await createHubSpotContact(mockLeadData);

            expect(result.success).toBe(true);
            expect(result.contactId).toBe('contact_123');
            expect(result.isUpdate).toBe(false);
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.hubapi.com/crm/v3/objects/contacts',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Authorization': 'Bearer test-token',
                    }),
                })
            );
        });

        it('should handle duplicate contact (409)', async () => {
            // First call returns 409
            const conflictResponse = {
                ok: false,
                status: 409,
                json: async () => ({ message: 'Contact exists' }),
                headers: new Headers(),
            };

            // Search call
            const searchResponse = {
                ok: true,
                json: async () => ({
                    results: [{ id: 'existing_contact_123' }],
                }),
                headers: new Headers(),
            };

            // Update call
            const updateResponse = {
                ok: true,
                json: async () => ({ id: 'existing_contact_123' }),
                headers: new Headers(),
            };

            (global.fetch as jest.Mock)
                .mockResolvedValueOnce(conflictResponse)
                .mockResolvedValueOnce(searchResponse)
                .mockResolvedValueOnce(updateResponse);

            const result = await createHubSpotContact(mockLeadData);

            expect(result.success).toBe(true);
            expect(result.contactId).toBe('existing_contact_123');
            expect(result.isUpdate).toBe(true);
        });

        it('should retry on rate limiting (429)', async () => {
            const rateLimitResponse = {
                ok: false,
                status: 429,
                json: async () => ({ message: 'Rate limited' }),
                headers: new Headers({ 'Retry-After': '1' }),
            };

            const successResponse = {
                ok: true,
                json: async () => ({ id: 'contact_123' }),
                headers: new Headers(),
            };

            (global.fetch as jest.Mock)
                .mockResolvedValueOnce(rateLimitResponse)
                .mockResolvedValueOnce(successResponse);

            const result = await createHubSpotContact(mockLeadData);

            expect(result.success).toBe(true);
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should retry on server error (500)', async () => {
            const serverErrorResponse = {
                ok: false,
                status: 500,
                json: async () => ({ message: 'Server error' }),
                headers: new Headers(),
            };

            const successResponse = {
                ok: true,
                json: async () => ({ id: 'contact_123' }),
                headers: new Headers(),
            };

            (global.fetch as jest.Mock)
                .mockResolvedValueOnce(serverErrorResponse)
                .mockResolvedValueOnce(successResponse);

            const result = await createHubSpotContact(mockLeadData);

            expect(result.success).toBe(true);
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should return error when token is missing', async () => {
            process.env.HUBSPOT_ACCESS_TOKEN = '';

            const result = await createHubSpotContact(mockLeadData);

            expect(result.success).toBe(false);
            expect(result.error).toBe('HubSpot access token is not configured');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should handle network errors', async () => {
            jest.useFakeTimers();
            try {
                (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

                const promise = createHubSpotContact(mockLeadData);

                // Fast-forward time for all retries
                // Initial (0s) -> Retry 1 (1s) -> Retry 2 (2s) -> Retry 3 (4s)
                await jest.advanceTimersByTimeAsync(10000);

                const result = await promise;

                expect(result.success).toBe(false);
                expect(result.error).toBeDefined();
                expect(result.error).toContain('Network error');
            } finally {
                jest.useRealTimers();
            }
        });
    });
});
