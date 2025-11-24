/**
 * HubSpot CRM API Client
 * 
 * Handles integration with HubSpot CRM for lead management.
 * Uses HubSpot Private App authentication with access token.
 */

const HUBSPOT_API_BASE = 'https://api.hubapi.com';
const HUBSPOT_API_VERSION = 'v3';

export interface HubSpotContactProperties {
    email: string;
    firstname: string;
    lastname: string;
    company: string;
    industry?: string;
    country?: string;
    lead_source?: string;
    hs_lead_status?: string;
}

export interface HubSpotContact {
    id: string;
    properties: HubSpotContactProperties;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactResponse {
    success: boolean;
    contactId?: string;
    error?: string;
    isUpdate?: boolean;
}

interface MarketingLeadData {
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    sector?: string;
    country?: string;
    source?: string;
}

/**
 * Maps MarketingLead data to HubSpot contact properties
 */
function mapLeadToHubSpotContact(lead: MarketingLeadData): HubSpotContactProperties {
    return {
        email: lead.email,
        firstname: lead.firstName,
        lastname: lead.lastName,
        company: lead.organization,
        industry: lead.sector || undefined,
        country: lead.country || undefined,
        lead_source: lead.source || 'framework_download',
        hs_lead_status: 'NEW', // HubSpot's lead status property
    };
}

/**
 * Sleep utility for retry logic
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates or updates a contact in HubSpot CRM
 * 
 * @param leadData - Marketing lead data to sync
 * @param retryCount - Current retry attempt (for internal use)
 * @returns CreateContactResponse with success status and contact ID
 */
export async function createHubSpotContact(
    leadData: MarketingLeadData,
    retryCount = 0
): Promise<CreateContactResponse> {
    const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
    const enabled = process.env.HUBSPOT_ENABLED === 'true';

    // Check if HubSpot integration is enabled
    if (!enabled) {
        console.log('HubSpot integration is disabled');
        return {
            success: false,
            error: 'HubSpot integration is disabled',
        };
    }

    // Validate access token
    if (!accessToken) {
        console.error('HubSpot access token is not configured');
        return {
            success: false,
            error: 'HubSpot access token is not configured',
        };
    }

    const contactProperties = mapLeadToHubSpotContact(leadData);
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    try {
        // Create contact using HubSpot CRM API v3
        const response = await fetch(
            `${HUBSPOT_API_BASE}/crm/${HUBSPOT_API_VERSION}/objects/contacts`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    properties: contactProperties,
                }),
            }
        );

        const data = await response.json();

        // Handle successful creation
        if (response.ok) {
            console.log('HubSpot contact created successfully:', {
                contactId: data.id,
                email: leadData.email,
            });

            return {
                success: true,
                contactId: data.id,
                isUpdate: false,
            };
        }

        // Handle duplicate contact (409 Conflict)
        // HubSpot returns 409 when a contact with the same email already exists
        if (response.status === 409) {
            console.log('Contact already exists in HubSpot, attempting update:', leadData.email);

            // Try to update the existing contact
            const updateResponse = await updateHubSpotContactByEmail(leadData, accessToken);
            return updateResponse;
        }

        // Handle rate limiting (429 Too Many Requests)
        if (response.status === 429 && retryCount < maxRetries) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter
                ? parseInt(retryAfter) * 1000
                : baseDelay * Math.pow(2, retryCount); // Exponential backoff

            console.log(`Rate limited by HubSpot, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            await sleep(delay);
            return createHubSpotContact(leadData, retryCount + 1);
        }

        // Handle server errors with retry
        if (response.status >= 500 && retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(2, retryCount);
            console.log(`HubSpot server error, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            await sleep(delay);
            return createHubSpotContact(leadData, retryCount + 1);
        }

        // Handle other errors
        console.error('HubSpot API error:', {
            status: response.status,
            error: data,
        });

        return {
            success: false,
            error: data.message || `HubSpot API error: ${response.status}`,
        };

    } catch (error) {
        console.error('Error creating HubSpot contact:', error);

        // Retry on network errors
        if (retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(2, retryCount);
            console.log(`Network error, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
            await sleep(delay);
            return createHubSpotContact(leadData, retryCount + 1);
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Updates an existing HubSpot contact by email
 */
async function updateHubSpotContactByEmail(
    leadData: MarketingLeadData,
    accessToken: string
): Promise<CreateContactResponse> {
    try {
        // First, search for the contact by email
        const searchResponse = await fetch(
            `${HUBSPOT_API_BASE}/crm/${HUBSPOT_API_VERSION}/objects/contacts/search`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filterGroups: [{
                        filters: [{
                            propertyName: 'email',
                            operator: 'EQ',
                            value: leadData.email,
                        }],
                    }],
                    properties: ['email', 'firstname', 'lastname'],
                    limit: 1,
                }),
            }
        );

        const searchData = await searchResponse.json();

        if (!searchResponse.ok || !searchData.results || searchData.results.length === 0) {
            return {
                success: false,
                error: 'Contact not found for update',
            };
        }

        const contactId = searchData.results[0].id;
        const contactProperties = mapLeadToHubSpotContact(leadData);

        // Update the contact
        const updateResponse = await fetch(
            `${HUBSPOT_API_BASE}/crm/${HUBSPOT_API_VERSION}/objects/contacts/${contactId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    properties: contactProperties,
                }),
            }
        );

        const updateData = await updateResponse.json();

        if (updateResponse.ok) {
            console.log('HubSpot contact updated successfully:', {
                contactId: updateData.id,
                email: leadData.email,
            });

            return {
                success: true,
                contactId: updateData.id,
                isUpdate: true,
            };
        }

        return {
            success: false,
            error: updateData.message || 'Failed to update contact',
        };

    } catch (error) {
        console.error('Error updating HubSpot contact:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Validates HubSpot configuration
 */
export function isHubSpotConfigured(): boolean {
    return !!(
        process.env.HUBSPOT_ACCESS_TOKEN &&
        process.env.HUBSPOT_ENABLED === 'true'
    );
}
