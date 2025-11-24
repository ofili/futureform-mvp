/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'futureform-files.s3.amazonaws.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
}

// Sentry configuration - only apply if package is installed
try {
  const { withSentryConfig } = require('@sentry/nextjs');

  const sentryWebpackPluginOptions = {
    // Suppresses source map uploading logs during build
    silent: true,

    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Auth token for uploading source maps
    authToken: process.env.SENTRY_AUTH_TOKEN,

    // Only upload source maps in production
    dryRun: process.env.NODE_ENV !== 'production',
  };

  module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
} catch (error) {
  // Sentry not installed, export config without it
  console.log('Sentry not installed - skipping Sentry configuration');
  module.exports = nextConfig;
}