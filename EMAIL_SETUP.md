# Email Service Setup Guide

This guide will help you set up email sending for password reset functionality in your Next.js application.

## Current Status
- ✅ Email service infrastructure is set up
- ✅ Password reset emails work in development mode (console logging)
- ⏳ Real email service needs to be configured for production

## Quick Test (Development Mode)
1. Go to http://localhost:3001/test-reset
2. Enter any email address
3. Click "Send Reset Link"
4. The reset link will appear on the page and in the console
5. Click the link to test the reset functionality

## Email Service Options

### Option 1: Resend (Recommended - Easy Setup)
1. Sign up at https://resend.com
2. Get your API key from the dashboard
3. Add to your `.env.local`:
   ```
   EMAIL_SERVICE=resend
   EMAIL_API_KEY=re_xxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```
4. Install the package: `npm install resend`

### Option 2: SendGrid (Popular Choice)
1. Sign up at https://sendgrid.com
2. Create an API key with Mail Send permissions
3. Add to your `.env.local`:
   ```
   EMAIL_SERVICE=sendgrid
   EMAIL_API_KEY=SG.xxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```
4. Install the package: `npm install @sendgrid/mail`

### Option 3: Gmail SMTP (Free Option)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Add to your `.env.local`:
   ```
   EMAIL_SERVICE=nodemailer
   EMAIL_FROM=your-email@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```
4. Install the package: `npm install nodemailer`

### Option 4: Keep Console Logging (Development)
For development and testing, you can keep using console logging:
```
EMAIL_SERVICE=console
```

## Installation Commands

Choose the package for your selected email service:

```bash
# For Resend
npm install resend

# For SendGrid
npm install @sendgrid/mail

# For SMTP (Gmail, Outlook, etc.)
npm install nodemailer

# Install all (if unsure)
npm install resend @sendgrid/mail nodemailer
```

## Domain Setup (For Production)

Most email services require domain verification:

1. **Resend**: Add DNS records to verify your domain
2. **SendGrid**: Verify your domain and set up authentication
3. **Gmail SMTP**: Use your Gmail address directly

## Testing Email Functionality

1. Configure your chosen email service in `.env.local`
2. Restart your development server
3. Go to http://localhost:3001/test-reset
4. Enter a real email address
5. Check your inbox for the password reset email

## Troubleshooting

### Emails Not Sending
- Check your API keys are correct
- Verify your domain is set up (for production)
- Check the server console for error messages
- Ensure environment variables are loaded (restart server)

### Emails Going to Spam
- Set up SPF, DKIM, and DMARC records for your domain
- Use a verified domain (not localhost)
- Include proper from/reply-to addresses

### Development vs Production
- Development: Uses console logging by default
- Production: Configure a real email service
- Environment variables are automatically detected

## Security Notes
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor email sending quotas and usage

## Next Steps
1. Choose an email service from the options above
2. Follow the setup instructions
3. Add the configuration to `.env.local`
4. Install the required package
5. Restart your server and test!
