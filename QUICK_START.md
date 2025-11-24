# Quick Start Guide - Production Authentication

## ✅ What Was Fixed

Your authentication system has been upgraded from basic to **production-level** with enterprise security features.

### Before (What You Had)
- ❌ No email verification
- ❌ Weak password requirements (just 8+ chars)
- ❌ No password reset
- ❌ No rate limiting (vulnerable to attacks)
- ❌ No account lockout
- ❌ Users could sign up but system wasn't secure

### After (What You Have Now)
- ✅ **Email verification** - Users must verify email before accessing app
- ✅ **Strong passwords** - Uppercase, lowercase, number required + strength indicator
- ✅ **Password reset** - Full forgot password flow with email
- ✅ **Rate limiting** - Protection against brute force attacks
- ✅ **Account lockout** - Locks account after 5 failed login attempts
- ✅ **Professional emails** - Branded HTML emails for verification, reset, welcome
- ✅ **Security logging** - Track failed attempts, last login, account status
- ✅ **Production-ready** - Following industry best practices

## 🚀 Get Started in 3 Steps

### Step 1: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add:

```bash
# 1. Your PostgreSQL database URL
DATABASE_URL="postgresql://user:password@localhost:5432/hefica"

# 2. Generate a secret key
# Run this command and paste the output:
openssl rand -base64 32
NEXTAUTH_SECRET="paste-output-here"

# 3. Get Resend API key (free tier available)
# Sign up at https://resend.com and get your API key
RESEND_API_KEY="re_your_api_key_here"

# 4. Email sender (use test email for development)
FROM_EMAIL="onboarding@resend.dev"  # For testing
# FROM_EMAIL="noreply@yourdomain.com"  # For production

# 5. Your app URL
NEXTAUTH_URL="http://localhost:3000"
```

### Step 2: Run Setup Script

```bash
chmod +x scripts/setup-auth.sh
./scripts/setup-auth.sh
```

Or manually:
```bash
npm install
npx prisma generate
npx prisma migrate dev
```

### Step 3: Start the App

```bash
npm run dev
```

Visit http://localhost:3000 and try signing up!

## 📧 Getting a Resend API Key (2 minutes)

1. Go to https://resend.com
2. Sign up for free account
3. Go to API Keys in dashboard
4. Click "Create API Key"
5. Copy the key (starts with `re_`)
6. Paste into your `.env` file

**For Development:** Use `onboarding@resend.dev` as FROM_EMAIL (no domain verification needed)

**For Production:** Verify your domain in Resend dashboard, then use `noreply@yourdomain.com`

## 🧪 Testing the New Auth System

### Test 1: Sign Up with Email Verification

1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter:
   - First name: John
   - Last name: Doe
   - Email: your-email@example.com
   - Password: Test123! (watch the strength indicator)
4. Click "Create account"
5. Check your email for verification link
6. Click the link to verify
7. Sign in!

### Test 2: Password Strength

Try different passwords and watch the strength indicator:
- `test` → Weak (too short)
- `testtest` → Weak (no uppercase/numbers)
- `TestTest` → Fair (no numbers)
- `Test123!` → Strong ✅

### Test 3: Forgot Password

1. Click "Forgot your password?"
2. Enter your email
3. Check email for reset link
4. Click link and set new password
5. Sign in with new password

### Test 4: Account Lockout

1. Try signing in with wrong password 5 times
2. On 6th attempt → Account locked for 15 minutes
3. Wait or reset in database:
   ```sql
   UPDATE users SET "failedLoginAttempts" = 0, "lockoutUntil" = NULL
   WHERE email = 'your-email@example.com';
   ```

## 📊 New Pages Created

| URL | Purpose |
|-----|---------|
| `/` | Sign in / Sign up (enhanced with strength indicator) |
| `/auth/verify-email?token=...` | Verify email after signup |
| `/auth/resend-verification` | Resend verification email |
| `/auth/forgot-password` | Request password reset |
| `/auth/reset-password?token=...` | Reset password with token |
| `/dashboard` | Protected dashboard (requires verified email) |

## 🔒 Security Features Active

✅ **Email Verification** - Blocks unverified users from signing in
✅ **Password Requirements** - 8+ chars, uppercase, lowercase, number
✅ **Rate Limiting** - Prevents spam/abuse:
  - 5 signups/hour per IP
  - 3 password resets/hour per email
  - 5 failed logins before lockout
✅ **Account Lockout** - 15-min lockout after 5 failed attempts
✅ **Token Expiry** - Verification: 24h, Reset: 1h
✅ **Secure Tokens** - Cryptographically secure random tokens
✅ **Password Hashing** - bcrypt with 12 rounds
✅ **No User Enumeration** - Same messages for existing/non-existing users

## 🐛 Common Issues & Solutions

### "Email not sending"
**Solution:**
1. Check `RESEND_API_KEY` is set in `.env`
2. Use `onboarding@resend.dev` for development
3. Check Resend dashboard for delivery logs

### "Can't sign in after signup"
**Solution:** You need to verify your email first!
1. Check your email inbox (and spam folder)
2. Click verification link
3. Then try signing in

### "Verification link expired"
**Solution:**
1. Go to http://localhost:3000/auth/resend-verification
2. Enter your email
3. Get a new verification link

### "Account locked"
**Solution:** Wait 15 minutes or reset in database:
```sql
UPDATE users SET "failedLoginAttempts" = 0, "lockoutUntil" = NULL
WHERE email = 'your-email@example.com';
```

### "Migration failed"
**Solution:**
```bash
# Try pushing schema instead
npx prisma db push

# Or reset database (WARNING: deletes data)
npx prisma migrate reset
```

## 📚 More Information

- **Full Documentation:** See `AUTH_SETUP.md`
- **Email Templates:** Check `lib/email.ts` to customize
- **Password Rules:** Modify in `lib/password.ts`
- **Rate Limits:** Adjust in each API route

## 🎯 Next Steps

Now that authentication is production-ready, you can:

1. ✅ **Test all flows thoroughly**
2. ✅ **Customize email templates** with your branding
3. ✅ **Add user profile page** (change password, update info)
4. ✅ **Build the dashboard features** (workouts, meals, progress)
5. ✅ **Deploy to production** (see production checklist in AUTH_SETUP.md)

## 🆘 Need Help?

1. Check `AUTH_SETUP.md` for detailed documentation
2. Review the code comments in auth files
3. Check Resend dashboard for email delivery issues
4. Review browser console for frontend errors
5. Check server logs for backend errors

---

**You now have enterprise-grade authentication! 🎉**

The system is secure, user-friendly, and ready for production use.
