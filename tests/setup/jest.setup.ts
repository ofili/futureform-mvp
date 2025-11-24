import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/futureform_test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only';
process.env.MAILGUN_API_KEY = 'test-mailgun-key';
process.env.MAILGUN_DOMAIN = 'test.mailgun.org';
process.env.MAILGUN_FROM_EMAIL = 'test@test.com';
process.env.HUBSPOT_ACCESS_TOKEN = 'test-hubspot-token';
process.env.HUBSPOT_ENABLED = 'false'; // Disable HubSpot in tests

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '/';
    },
}));

// Mock NextAuth
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(() => ({
        data: null,
        status: 'unauthenticated',
    })),
    signIn: jest.fn(),
    signOut: jest.fn(),
}));

// Suppress console errors in tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};
