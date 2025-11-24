import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_NAME = 'Hefica';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(email: string, token: string, firstName: string) {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #000000; padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${APP_NAME}</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600;">Hi ${firstName}! 👋</h2>
                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Welcome to ${APP_NAME}! We're excited to have you on your wellness journey.
                    </p>
                    <p style="margin: 0 0 32px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      To get started, please verify your email address by clicking the button below:
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${verificationUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      If you didn't create an account with ${APP_NAME}, you can safely ignore this email.
                    </p>
                    <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      This verification link will expire in 24 hours.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
              <!-- Alternative link -->
              <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td style="padding: 0 20px; text-align: center;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${verificationUrl}" style="color: #000000; text-decoration: underline; word-break: break-all;">${verificationUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to ${APP_NAME} - Verify your email`,
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, firstName: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #000000; padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${APP_NAME}</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600;">Hi ${firstName},</h2>
                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      We received a request to reset your password for your ${APP_NAME} account.
                    </p>
                    <p style="margin: 0 0 32px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Click the button below to reset your password:
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 32px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                    </p>
                    <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      This password reset link will expire in 1 hour for security reasons.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
              <!-- Alternative link -->
              <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr>
                  <td style="padding: 0 20px; text-align: center;">
                    <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
                      If the button doesn't work, copy and paste this link into your browser:<br>
                      <a href="${resetUrl}" style="color: #000000; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `${APP_NAME} - Reset your password`,
    html,
  });
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  const dashboardUrl = `${APP_URL}/dashboard`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${APP_NAME}!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="background-color: #000000; padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${APP_NAME}</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600;">Welcome, ${firstName}! 🎉</h2>
                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      Your email has been verified and your account is now active!
                    </p>
                    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      You're all set to begin your wellness journey with ${APP_NAME}. Here's what you can do:
                    </p>
                    <ul style="margin: 0 0 32px 0; padding-left: 24px; color: #4b5563; font-size: 16px; line-height: 1.8;">
                      <li>Track your workouts and exercises</li>
                      <li>Plan and log your meals</li>
                      <li>Monitor your progress over time</li>
                      <li>Set and achieve your fitness goals</li>
                    </ul>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${dashboardUrl}" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            Go to Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to ${APP_NAME}! 🎉`,
    html,
  });
}
