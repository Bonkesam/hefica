# Production-Level Authentication Setup

This document outlines the production-level authentication system implemented for Hefica.

## Features Implemented

### 🔐 Core Security Features

1. **Email Verification**
   - Users must verify their email before accessing the app
   - Verification tokens expire after 24 hours
   - Resend verification email functionality

2. **Password Reset Flow**
   - Secure "forgot password" functionality
   - Reset tokens expire after 1 hour
   - Password reset via email link

3. **Account Security**
   - Account lockout after 5 failed login attempts (15-minute lockout)
   - Failed login attempt tracking
   - Account status management (ACTIVE, SUSPENDED, DELETED)
   - Last login timestamp tracking

4. **Password Validation**
   - Minimum 8 characters required
   - Must contain uppercase letter
   - Must contain lowercase letter
   - Must contain number
   - Blocks common weak passwords
   - Password strength indicator

5. **Rate Limiting**
   - Signup: 5 attempts per hour per IP
   - Password reset: 3 attempts per hour per IP/email
   - Verification resend: 3 attempts per hour per IP/email
   - Password reset submission: 5 attempts per hour per IP

6. **Email Notifications**
   - Welcome email after verification
   - Email verification link
   - Password reset link
   - Professional HTML email templates

### 📁 Files Structure

```
lib/
  ├── auth.ts                  # Auth helper functions
  ├── authOptions.ts           # NextAuth configuration with security checks
  ├── email.ts                 # Email service (Resend)
  ├── password.ts              # Password validation utilities
  ├── rate-limit.ts            # Rate limiting implementation
  └── tokens.ts                # Secure token generation

app/api/auth/
  ├── signup/route.ts          # User registration with email verification
  ├── verify-email/route.ts    # Email verification endpoint
  ├── resend-verification/route.ts  # Resend verification email
  ├── forgot-password/route.ts # Request password reset
  └── reset-password/route.ts  # Reset password with token

app/auth/
  ├── verify-email/page.tsx    # Email verification page
  ├── resend-verification/page.tsx  # Resend verification page
  ├── forgot-password/page.tsx # Forgot password page
  └── reset-password/page.tsx  # Reset password page

app/page.tsx                   # Updated auth page with proper linking
```

### 🗄️ Database Schema Changes

New fields added to User model:
```prisma
// Email verification
emailVerified          Boolean   @default(false)
verificationToken      String?   @unique
verificationTokenExpiry DateTime?

// Password reset
resetToken       String?   @unique
resetTokenExpiry DateTime?

// Security
failedLoginAttempts Int       @default(0)
lockoutUntil        DateTime?
accountStatus       AccountStatus @default(ACTIVE)
lastLoginAt         DateTime?

// Made required
firstName String  // was optional
lastName  String  // was optional
```

New enum:
```prisma
enum AccountStatus {
  ACTIVE
  SUSPENDED
  DELETED
}
```

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hefica"
DIRECT_URL="postgresql://user:password@localhost:5432/hefica"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Service (Resend)
RESEND_API_KEY="re_your_api_key_here"
FROM_EMAIL="noreply@yourdomain.com"
```

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create an API key in the dashboard
3. Verify your domain (or use their test domain for development)
4. Add the API key to your `.env` file

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add the output to `NEXTAUTH_SECRET` in your `.env` file.

### 4. Run Database Migration

```bash
npx prisma migrate dev
```

Or apply the migration manually:
```bash
npx prisma db push
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

## Authentication Flow

### Sign Up Flow

1. User fills signup form
2. Backend validates:
   - Email format
   - Password strength (8+ chars, uppercase, lowercase, number)
   - Not a common password
   - Email not already registered
3. User created with `emailVerified: false`
4. Verification email sent with 24-hour token
5. User must click link in email to verify
6. Welcome email sent after verification
7. User can now sign in

### Sign In Flow

1. User enters credentials
2. Backend checks:
   - User exists
   - Account not suspended/deleted
   - Account not locked (after 5 failed attempts)
   - Password correct
   - **Email verified** ← Blocks unverified users
3. On success:
   - Reset failed login attempts
   - Update last login timestamp
   - Create session
4. On failure:
   - Increment failed login attempts
   - Lock account after 5 failures (15 min)

### Password Reset Flow

1. User clicks "Forgot password?"
2. Enters email address
3. If account exists, reset email sent (1-hour token)
4. User clicks link in email
5. Enters new password (validated for strength)
6. Password updated, failed login attempts reset
7. User can sign in with new password

## Security Considerations

### ✅ Implemented

- Email verification prevents spam accounts
- Password hashing with bcryptjs (12 salt rounds)
- Secure token generation using crypto.randomBytes
- Rate limiting on sensitive endpoints
- Account lockout prevents brute force attacks
- JWT-based sessions (stateless)
- Token expiry (verification: 24h, reset: 1h)
- No user enumeration (same message for existing/non-existing users)
- Failed login tracking
- Account status management

### 🔄 Future Improvements

Consider adding:
- Two-factor authentication (2FA)
- Session management (view active sessions, revoke)
- Password history (prevent reusing old passwords)
- Email notifications for security events (new login, password change)
- Redis-based rate limiting for better scalability
- Login attempt geolocation tracking
- CAPTCHA for repeated failed attempts
- Social login (Google, GitHub, etc.)

## Testing the Auth System

### Test Signup Flow

1. Go to `http://localhost:3000`
2. Click "Sign up"
3. Fill in details with a strong password (Test123!)
4. Submit form
5. Check email for verification link
6. Click verification link
7. Should redirect to login with success message

### Test Password Reset

1. Click "Forgot your password?"
2. Enter your email
3. Check email for reset link
4. Click reset link
5. Enter new password (must meet requirements)
6. Should redirect to login
7. Sign in with new password

### Test Account Lockout

1. Try to sign in with wrong password 5 times
2. On 6th attempt, should see lockout message
3. Wait 15 minutes or reset in database:
   ```sql
   UPDATE users SET "failedLoginAttempts" = 0, "lockoutUntil" = NULL WHERE email = 'test@example.com';
   ```

### Test Rate Limiting

1. Try to signup 6 times in a row (will block on 6th)
2. Try to reset password 4 times in a row (will block on 4th)

## Email Templates

All emails include:
- Professional HTML templates
- Branded header with app name
- Clear call-to-action buttons
- Alternative text links (for email clients that block buttons)
- Responsive design
- Footer with copyright

Templates can be customized in `/lib/email.ts`

## Monitoring & Logs

All auth operations log to console:
- Signup attempts
- Email send failures
- Failed login attempts
- Password reset requests
- Token verification

For production, consider:
- Structured logging (Winston, Pino)
- Error tracking (Sentry)
- Analytics (PostHog, Mixpanel)
- Security monitoring (failed login alerts)

## API Endpoints

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/api/auth/signup` | POST | Create new account | 5/hour per IP |
| `/api/auth/verify-email` | POST | Verify email with token | None |
| `/api/auth/resend-verification` | POST | Resend verification email | 3/hour per IP+email |
| `/api/auth/forgot-password` | POST | Request password reset | 3/hour per IP+email |
| `/api/auth/reset-password` | POST | Reset password with token | 5/hour per IP |
| `/api/auth/[...nextauth]` | * | NextAuth handlers | None (handled by lockout) |

## Troubleshooting

### "Failed to send verification email"
- Check RESEND_API_KEY is set
- Verify domain in Resend dashboard
- Check Resend logs for delivery issues

### "Account lockout not working"
- Verify database schema updated
- Check `failedLoginAttempts` and `lockoutUntil` columns exist

### "Email not sending in development"
- Use Resend test domain: `onboarding@resend.dev`
- Or verify your custom domain

### "User can't sign in after signup"
- They must verify email first
- Check spam folder for verification email
- Use resend verification page

## Production Checklist

Before deploying:

- [ ] Set strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Use production Resend API key
- [ ] Verify custom domain in Resend
- [ ] Set proper `NEXTAUTH_URL` (your production URL)
- [ ] Update `FROM_EMAIL` to your domain
- [ ] Run database migrations
- [ ] Test all auth flows end-to-end
- [ ] Set up error monitoring (Sentry)
- [ ] Configure SMTP for transactional emails (if not using Resend)
- [ ] Add HTTPS redirect middleware
- [ ] Set secure cookie flags in production
- [ ] Test rate limiting
- [ ] Test account lockout
- [ ] Review email templates branding

## Migration Notes

If you have existing users in the database:

```sql
-- Set all existing users as verified (if you trust them)
UPDATE users SET "emailVerified" = true WHERE "emailVerified" = false;

-- Or require all to verify
UPDATE users SET "emailVerified" = false;
-- Then send verification emails to all users
```

## Support

For issues or questions:
1. Check this documentation first
2. Review the code comments in auth files
3. Check Resend dashboard for email delivery issues
4. Review application logs for errors
