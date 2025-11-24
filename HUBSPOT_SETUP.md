# HubSpot Integration Configuration

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# HubSpot Integration
HUBSPOT_ACCESS_TOKEN=your_private_app_access_token_here
HUBSPOT_ENABLED=true
```

## Setup Instructions

### 1. Create a HubSpot Private App

1. Log into your HubSpot account
2. Navigate to **Settings** (gear icon) → **Integrations** → **Private Apps**
3. Click **"Create a private app"**
4. Name it "FutureForm Lead Sync" (or similar)
5. Add an optional description

### 2. Configure Scopes

1. Go to the **Scopes** tab
2. Enable the following permissions:
   - `crm.objects.contacts.write` - To create and update contacts
   - `crm.objects.contacts.read` - To read contact information

### 3. Get Your Access Token

1. Click **"Create app"**
2. Go to the **Auth** tab
3. Click **"Show token"** to reveal your access token
4. Copy the token

### 4. Configure Environment Variables

1. Open your `.env.local` file (or create it if it doesn't exist)
2. Add the following:

```bash
HUBSPOT_ACCESS_TOKEN=your_copied_access_token_here
HUBSPOT_ENABLED=true
```

3. Save the file
4. Restart your development server

## Testing the Integration

### 1. Test Lead Creation

1. Navigate to your framework download page
2. Fill out the form with test data
3. Submit the form
4. Check your HubSpot account to verify the contact was created

### 2. Monitor Sync Status

1. Log in as an admin user
2. Navigate to **Admin** → **Settings**
3. Click the **"HubSpot Integration"** tab
4. View sync statistics and any failed syncs

### 3. Retry Failed Syncs

If any syncs fail:
1. View the failed syncs in the HubSpot Integration tab
2. Click **"Retry"** on individual leads
3. Or click **"Retry All Failed"** to bulk retry

## Troubleshooting

### Contacts Not Syncing

- Verify `HUBSPOT_ENABLED=true` in your environment variables
- Check that your access token is correct
- Ensure the token has the required scopes
- Check the server logs for error messages

### Duplicate Contacts

HubSpot automatically deduplicates contacts by email address. If a contact with the same email already exists, HubSpot will update the existing contact instead of creating a duplicate.

### Rate Limiting

If you're experiencing rate limiting:
- The integration includes automatic retry logic with exponential backoff
- Failed syncs are tracked and can be retried manually
- Bulk retry includes a 100ms delay between requests to avoid overwhelming the API

## Security Notes

- **Never commit your access token to version control**
- Add `.env.local` to your `.gitignore` file
- Treat the access token like a password
- HubSpot monitors for publicly exposed tokens and will deactivate them

## Monitoring

The admin interface provides:
- Total leads count
- Successfully synced leads
- Failed syncs with error messages
- Pending syncs (not yet attempted)
- Last sync timestamp
- Manual retry capabilities
