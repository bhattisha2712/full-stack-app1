# 📧 Gmail SMTP Setup Guide

I've installed nodemailer and configured your app for Gmail SMTP. Now you need to set up your Gmail account to allow app access.

## 🔧 Required Steps

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the prompts to enable 2FA (required for app passwords)

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other (custom name)" as the device
4. Enter "Full Stack App" as the name
5. Click "Generate"
6. **Copy the 16-character password** (it will look like: abcd efgh ijkl mnop)

### Step 3: Update Your .env.local File
Replace these placeholders in your `.env.local` file:

```env
EMAIL_FROM=your-actual-email@gmail.com
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

**Example:**
```env
EMAIL_FROM=john.doe@gmail.com
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

### Step 4: Restart Your Server
After updating the environment variables:

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart it
npx next dev -p 3001
```

## 🧪 Testing

Once configured:
1. Go to http://localhost:3001/test-reset
2. Enter a **real email address** (yours or someone you can access)
3. Click "Send Reset Link"
4. Check your inbox for the password reset email!

## 🔒 Security Notes

- **Never share your app password**
- The app password is different from your regular Gmail password
- You can revoke app passwords anytime from your Google Account settings
- This method is secure and recommended by Google for apps

## ❗ Current Status

✅ Nodemailer installed
✅ Gmail SMTP configuration added to .env.local
⏳ **You need to:** Update .env.local with your actual Gmail credentials
⏳ **You need to:** Restart the server after updating credentials

## 🚨 If You Get Errors

**"Invalid login"**: Check your email and app password are correct
**"Less secure app access"**: Make sure you're using an app password, not your regular password
**"Authentication failed"**: Verify 2FA is enabled and you generated a new app password

Let me know when you've updated your credentials and I'll help you test it!
