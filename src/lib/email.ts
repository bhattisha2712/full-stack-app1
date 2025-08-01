import sgMail from '@sendgrid/mail';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
    // ...existing code...
// Email service configuration for production
// This file contains email service integrations for sending real emails

interface EmailConfig {
  service: 'console' | 'sendgrid' | 'resend' | 'nodemailer';
  apiKey?: string;
  from?: string;
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

// Email configuration - add your preferred service
const emailConfig: EmailConfig = {
  service: (process.env.EMAIL_SERVICE as 'console' | 'sendgrid' | 'resend' | 'nodemailer') || 'console',
  apiKey: process.env.EMAIL_API_KEY,
  from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
  smtpConfig: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
};

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    switch (emailConfig.service) {
      case 'console':
        // Development mode - just log the email
        console.log('\n=== EMAIL (Development Mode) ===');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${text || html}`);
        console.log('================================\n');
        return true;

      case 'sendgrid':
        return await sendWithSendGrid({ to, subject, html, text });

      case 'resend':
        return await sendWithResend({ to, subject, html, text });

      case 'nodemailer':
        return await sendWithNodemailer({ to, subject, html, text });

      default:
        console.error('Unknown email service:', emailConfig.service);
        return false;
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

// SendGrid implementation
async function sendWithSendGrid(options: EmailOptions): Promise<boolean> {
  try {
    sgMail.setApiKey(emailConfig.apiKey);

    const msg = {
      to: options.to,
      from: emailConfig.from,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid');
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
}

// Resend implementation
async function sendWithResend(options: EmailOptions): Promise<boolean> {
  try {
    const resend = new Resend(emailConfig.apiKey);

    await resend.emails.send({
      from: emailConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('Resend error:', error);
    return false;
  }
}

// Nodemailer implementation (SMTP)
async function sendWithNodemailer(options: EmailOptions): Promise<boolean> {
  try {

    const transporter = nodemailer.createTransport(emailConfig.smtpConfig);

    await transporter.sendMail({
      from: emailConfig.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent successfully via Nodemailer');
    return true;
  } catch (error) {
    console.error('Nodemailer error:', error);
    return false;
  }
}

// Email templates
export function createPasswordResetEmail(resetLink: string, userEmail: string): EmailOptions {
  const subject = 'Reset Your Password';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #dee2e6; }
        .button { 
          display: inline-block; 
          background: #007bff; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0; 
        }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You requested a password reset for your account associated with <strong>${userEmail}</strong>.</p>
          <p>Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
            ${resetLink}
          </p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 MERN Full-Stack App. All rights reserved.</p>
          <p>This is an automated email. Please do not reply to this address.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Password Reset Request

Hello,

You requested a password reset for your account associated with ${userEmail}.

Please click the following link to reset your password:
${resetLink}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

---
MERN Full-Stack App
This is an automated email. Please do not reply to this address.
  `;

  return {
    to: userEmail,
    subject,
    html,
    text,
  };
}
