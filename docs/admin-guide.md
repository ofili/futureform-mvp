# Admin Guide

## Admin Panel Overview

The admin panel provides comprehensive platform management capabilities accessible at `/admin`.

## Access Requirements

- User role must be `ADMIN`
- Login at `/auth/login` with admin credentials
- Navigate to `/admin` after authentication

## Creating an Admin User

### Method 1: Using Script

```bash
ts-node create-admin.ts
```

Follow the prompts to create an admin account.

### Method 2: Database Direct

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

## Dashboard

The admin dashboard provides:

- **System Health**: Application status and metrics
- **User Statistics**: Total users, active users, new registrations
- **Organization Statistics**: Total organizations, active subscriptions
- **Assessment Statistics**: Total assessments, completion rates
- **Revenue Metrics**: Total revenue, monthly recurring revenue
- **Recent Activity**: Latest system events

## User Management

### Viewing Users

**Path:** `/admin/users`

**Features:**
- Search by name or email
- Filter by role (USER, ADMIN, PARTNER)
- Filter by verification status
- Sort by registration date, last login
- Pagination (50 users per page)

### User Actions

**View User Details:**
- Click on user row
- View profile information
- See organization memberships
- Check activity history

**Edit User:**
- Update user information
- Change role
- Reset password
- Verify email manually

**Suspend User:**
- Temporarily disable account
- User cannot login
- Data preserved

**Delete User:**
- Permanently remove user
- Cascade delete related data
- Cannot be undone

## Organization Management

### Viewing Organizations

**Path:** `/admin/organizations`

**Features:**
- Search by organization name
- Filter by type, region, relationship stage
- View member count
- See subscription tier
- Sort by creation date

### Organization Actions

**View Details:**
- Organization profile
- Member list with roles
- Active projects
- Credit balance
- Subscription status

**Edit Organization:**
- Update organization information
- Change subscription tier
- Adjust credit balance
- Modify relationship stage

**Manage Members:**
- View all members
- Change member roles
- Remove members
- Send invitations

## Project Oversight

### Viewing Projects

**Path:** `/admin/projects`

**Features:**
- Search by project name
- Filter by type, status, sector
- View organization
- See assessment count
- Sort by creation date

### Project Details

**Path:** `/admin/projects/[id]`

**Information:**
- Project details
- Organization information
- Team members
- Assessments list
- Activity timeline
- Documents

## Assessment Oversight

### Viewing Assessments

**Path:** `/admin/assessments`

**Features:**
- Search by partner name
- Filter by status, type
- View project and organization
- See completion progress
- Sort by creation date

### Assessment Details

**Path:** `/admin/assessments/[id]`

**Information:**
- Assessment configuration
- Partner information
- Questions and responses
- Evidence uploads
- Scores and red flags
- Invitation status

### Assessment Actions

**Review Responses:**
- View all responses
- Check evidence quality
- Request clarifications
- Approve/reject responses

**Cancel Assessment:**
- Stop assessment process
- Refund credits (optional)
- Notify stakeholders

**Archive Assessment:**
- Move to archive
- Preserve data
- Remove from active list

## Platform Configuration

### System Settings

**Path:** `/admin/settings`

**Categories:**

**General Settings:**
- Platform name and description
- Default language and timezone
- Maintenance mode
- Feature flags

**Billing Settings:**
- Default credit allocation
- Credit pricing
- Subscription tiers
- Payment gateway configuration

**Email Settings:**
- SMTP configuration
- Email templates
- Sender information
- Notification preferences

**Assessment Settings:**
- Default question sets
- Scoring algorithms
- Evidence requirements
- Deadline policies

### Managing Settings

1. Navigate to Settings tab
2. Select category
3. Edit value
4. Changes auto-save
5. Some settings require restart

### Initializing Defaults

Click "Initialize Defaults" to seed default configuration values.

## Question Management

### Viewing Questions

**Path:** `/admin/questions`

**Features:**
- Browse all assessment questions
- Filter by domain, category
- Search by text
- View usage statistics

### Question Actions

**Add Question:**
```
Domain: Governance
Category: Leadership
Text: Does the organization have a documented succession plan?
Help Text: Provide details about leadership transition planning
Weight: 1.0
Sector Tags: All sectors
```

**Edit Question:**
- Update text and help text
- Adjust weight
- Modify sector tags
- Change evidence types

**Deactivate Question:**
- Remove from active pool
- Preserve historical data
- Can be reactivated

## Form Options Management

### Managing Dropdown Options

**Path:** `/admin/form-options`

**Categories:**
- Sectors
- Regions
- Countries
- Departments
- Relationship Stages
- Sources

### Adding Options

1. Select category
2. Click "Add Option"
3. Enter value and display name
4. Set order (optional)
5. Save

### Editing Options

- Update display name
- Change order
- Mark as deprecated
- Cannot delete if in use

## Subscription Tiers

### Viewing Tiers

**Path:** `/admin/tiers`

**Default Tiers:**
- Free: 10 credits/month
- Professional: 100 credits/month, $99/month
- Enterprise: Unlimited credits, custom pricing

### Managing Tiers

**Edit Tier:**
- Name and description
- Credit allocation
- Price
- Features list
- Visibility

**Create Custom Tier:**
- For enterprise clients
- Custom credit limits
- Special pricing
- Unique features

## Credit Pricing

### Credit Packages

**Path:** `/admin/credit-pricing`

**Default Packages:**
- Small: 50 credits, $49
- Medium: 100 credits, $89
- Large: 250 credits, $199

### Managing Packages

**Edit Package:**
- Credit amount
- Price
- Discount percentage
- Availability

**Create Package:**
- Define credit amount
- Set price
- Add description
- Set active status

## Support Ticket Management

### Viewing Tickets

**Path:** `/admin/support`

**Features:**
- Filter by status, priority, category
- Search by ticket number or user
- Sort by creation date
- Assign to team members

### Ticket Details

**Information:**
- Ticket number and status
- User information
- Category and priority
- Description and attachments
- Message thread
- Resolution notes

### Ticket Actions

**Assign Ticket:**
- Select team member
- Send notification
- Update status

**Respond to Ticket:**
- Add message
- Attach files
- Mark as internal note
- Notify user

**Resolve Ticket:**
- Add resolution notes
- Close ticket
- Request feedback

**Escalate Ticket:**
- Increase priority
- Assign to senior support
- Add escalation notes

## Billing Management

### Revenue Dashboard

**Metrics:**
- Total revenue
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Churn rate
- Conversion rate

### Transaction History

**View:**
- All transactions
- Filter by type, status, date
- Export to CSV
- Refund transactions

### Subscription Management

**Actions:**
- View active subscriptions
- Cancel subscriptions
- Issue refunds
- Adjust billing dates

## HubSpot Integration

### Sync Status

**Path:** `/admin/settings` → HubSpot Integration

**Metrics:**
- Total leads
- Successfully synced
- Failed syncs
- Pending syncs
- Last sync timestamp

### Managing Syncs

**Retry Failed Sync:**
- Click "Retry" on individual lead
- View error message
- Verify contact created in HubSpot

**Bulk Retry:**
- Click "Retry All Failed"
- Processes up to 50 leads
- Shows success/failure count

**Configuration:**
- Verify access token
- Check sync status
- View HubSpot contacts

## Analytics & Reporting

### User Analytics

- Registration trends
- Active user metrics
- User retention rates
- Feature usage statistics

### Assessment Analytics

- Assessment completion rates
- Average scores by sector
- Common red flags
- Response times

### Financial Analytics

- Revenue trends
- Credit consumption
- Subscription conversions
- Payment success rates

### Export Reports

- CSV export
- PDF reports
- Custom date ranges
- Scheduled reports (coming soon)

## Audit Logs

### Viewing Audit Logs

**Events Tracked:**
- User logins
- Role changes
- Data modifications
- Assessment actions
- Billing events
- System configuration changes

### Audit Log Details

**Information:**
- Timestamp
- User who performed action
- Action type
- Resource affected
- Before/after values
- IP address

## System Maintenance

### Maintenance Mode

**Enable:**
1. Go to Settings → General
2. Toggle "Maintenance Mode"
3. Set maintenance message
4. Admins can still access

**Disable:**
1. Toggle off maintenance mode
2. System immediately available

### Database Maintenance

**Backup Database:**
```bash
pg_dump futureform > backup_$(date +%Y%m%d).sql
```

**Run Migrations:**
```bash
npx prisma migrate deploy
```

**Seed Data:**
```bash
npx prisma db seed
```

### Cache Management

**Clear Application Cache:**
```bash
npm run cache:clear
```

**Clear Build Cache:**
```bash
rm -rf .next
npm run build
```

## Security Management

### Password Policies

**Configure:**
- Minimum length
- Complexity requirements
- Expiration period
- Reuse restrictions

### Session Management

**Settings:**
- Session timeout
- Concurrent sessions
- Remember me duration
- Force logout

### Access Control

**IP Whitelisting:**
- Restrict admin access by IP
- Configure allowed IP ranges
- Emergency bypass

**Two-Factor Authentication:**
- Require for admin accounts
- Backup codes
- Recovery options

## Monitoring & Alerts

### System Health

**Monitor:**
- Application uptime
- Response times
- Error rates
- Database performance

### Alerts

**Configure:**
- Email notifications
- Slack integration
- Alert thresholds
- Escalation rules

### Error Tracking

**View:**
- Recent errors
- Error frequency
- Stack traces
- User impact

## Best Practices

### Daily Tasks

- Review new support tickets
- Check system health dashboard
- Monitor failed HubSpot syncs
- Review new user registrations

### Weekly Tasks

- Analyze user growth trends
- Review assessment completion rates
- Check revenue metrics
- Update documentation

### Monthly Tasks

- Generate monthly reports
- Review and update pricing
- Audit user permissions
- Database backup verification

### Security Checklist

- Review audit logs
- Check for suspicious activity
- Update admin passwords
- Verify backup integrity
- Test disaster recovery

## Troubleshooting

### Common Issues

**Users Can't Login:**
1. Check user verification status
2. Verify email is correct
3. Reset password if needed
4. Check for account suspension

**Assessments Not Creating:**
1. Verify credit balance
2. Check Prisma connection
3. Review error logs
4. Test database connectivity

**Emails Not Sending:**
1. Verify Mailgun configuration
2. Check email logs
3. Verify domain verification
4. Test SMTP connection

**Payments Failing:**
1. Check Flutterwave credentials
2. Verify webhook configuration
3. Review transaction logs
4. Test payment gateway

## Support & Resources

- **Documentation**: `/docs`
- **API Reference**: `/docs/api-reference.md`
- **System Logs**: `/var/log/futureform`
- **Database**: PostgreSQL admin tools
- **Support**: admin-support@futureform.com
