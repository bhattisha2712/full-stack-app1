# Admin Notification System

## Overview
The admin notification system provides real-time alerts for high-risk administrative actions in your application. It integrates with both email (SMTP) and Slack to ensure administrators are immediately notified of critical security events.

## Features

### High-Risk Actions Monitored
- **User Deletion**: Alerts when any user account is deleted
- **Admin Demotion**: Alerts when an admin is demoted to regular user
- **Role Changes**: Notifications for all role modifications
- **Account Lockouts**: Alerts for security-related account actions

### Notification Channels
- **Email**: SMTP-based email notifications
- **Slack**: Webhook-based Slack channel notifications
- **Database Logging**: All actions are logged to audit trail

## Configuration

### Environment Variables
Copy `.env.local.example` to `.env.local` and configure:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Slack Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK

# Admin Settings
ADMIN_EMAIL=admin@yourcompany.com
NOTIFY_HIGH_RISK_ACTIONS=true
```

### Email Setup (Gmail Example)
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security > App passwords
   - Generate password for "Mail"
3. Use the app password in `SMTP_PASS`

### Slack Setup
1. Create a Slack webhook:
   - Go to your Slack workspace settings
   - Apps > Incoming Webhooks
   - Add to Slack and configure channel
2. Copy webhook URL to `SLACK_WEBHOOK_URL`

## Usage

### Automatic Notifications
The system automatically sends notifications when:
- An admin deletes any user account
- An admin is demoted to regular user
- High-privilege actions are performed

### Manual Testing
You can test notifications by:
1. Creating a test user
2. Deleting the test user as an admin
3. Checking email and Slack for notifications

## Notification Format

### Email Notifications
- **Subject**: High-Risk Admin Action Alert
- **Content**: Detailed action information including:
  - Action type and timestamp
  - Administrator who performed the action
  - Target user affected
  - Additional context and details

### Slack Notifications
- **Channel**: Configured webhook channel
- **Format**: Rich message with:
  - Action type with emoji indicators
  - Actor and target information
  - Timestamp and severity indicators

## Security Features

### Data Protection
- No sensitive data (passwords, tokens) in notifications
- User emails are included for identification only
- All notifications are logged for audit purposes

### Access Control
- Only administrators can trigger notifications
- Notification system respects existing role-based access
- Self-actions are clearly identified

## Monitoring

### Audit Trail
All notification events are logged in the audit system:
- View logs at `/admin/audit`
- Filter by action type
- Track notification delivery status

### Error Handling
- Failed notifications are logged but don't block actions
- Retry logic for temporary failures
- Graceful degradation if services are unavailable

## Troubleshooting

### Common Issues

**Email not sending:**
- Check SMTP credentials and app password
- Verify firewall allows SMTP traffic
- Test with different email provider

**Slack not receiving:**
- Verify webhook URL is correct
- Check Slack channel permissions
- Test webhook manually with curl

**Missing notifications:**
- Check environment variables are set
- Verify `NOTIFY_HIGH_RISK_ACTIONS=true`
- Review audit logs for notification attempts

### Debug Mode
Enable debug logging by setting:
```env
DEBUG_NOTIFICATIONS=true
```

## API Integration

### NotificationService Class
```typescript
import { NotificationService } from '@/lib/notifications';

const notificationService = new NotificationService();
await notificationService.sendHighRiskAlert({
  action: 'USER_DELETED',
  actorName: 'Admin User',
  actorEmail: 'admin@example.com',
  targetName: 'Deleted User',
  targetEmail: 'user@example.com',
  details: {
    // Additional context
  }
});
```

### Custom Notifications
You can extend the system for custom notifications:
```typescript
await notificationService.sendCustomAlert({
  subject: 'Custom Alert',
  message: 'Custom message content',
  severity: 'high'
});
```

## Best Practices

1. **Regular Testing**: Test notification delivery monthly
2. **Contact Lists**: Maintain updated admin contact information
3. **Response Procedures**: Define clear response procedures for alerts
4. **Documentation**: Keep notification channels documented
5. **Backup Channels**: Use multiple notification methods

## Integration with Existing Systems

The notification system integrates seamlessly with:
- **Audit Logging**: All notifications are logged
- **User Management**: Hooks into existing user operations
- **Session Management**: Respects current authentication
- **Role-Based Access**: Uses existing permission system
