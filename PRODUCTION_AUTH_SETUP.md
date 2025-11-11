# Production Authentication Setup Guide

This guide ensures your Fitnest app has working authentication with email confirmations across local development and production (Vercel).

## 1. Local Development Setup (.env.local)

Create `.env.local` in your project root with the following values from your Supabase project:

```bash
# Supabase Project URL
# Find at: Supabase Dashboard > Project Settings > API > Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon Key (public, safe for client-side)
# Find at: Supabase Dashboard > Project Settings > API > anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role Key (SECRET - server-side only)
# Find at: Supabase Dashboard > Project Settings > API > service_role key
# NEVER commit this to git or expose to frontend
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter API Key (optional, if using AI features)
OPENROUTER_API_KEY=your-key-here
```

**Important:** Never commit `.env.local` to git. Add it to `.gitignore` if not already there.

## 2. Vercel Environment Variables (Production)

Set these environment variables in Vercel:

1. Go to: **Vercel Dashboard > Your Project > Settings > Environment Variables**

2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENROUTER_API_KEY=your-key-here
```

3. Make sure the `NEXT_PUBLIC_` variables are available in all environments (Production, Preview, Development)

4. Make sure `SUPABASE_SERVICE_ROLE_KEY` is available **only in Production** (for security)

5. **Redeploy after adding env vars** for changes to take effect

## 3. Supabase Email Configuration (Critical for Production)

### Enable Email Authentication

1. Go to: **Supabase Dashboard > Authentication > Providers > Email**

2. Enable the Email provider and configure:
   - **Confirm email** - Toggle ON (users must confirm email to complete signup)
   - **Secure email change** - Toggle ON (require confirmation for email changes)

### Configure Email Redirect URLs

1. Go to: **Supabase Dashboard > Authentication > URL Configuration**

2. Set these Redirect URLs:

   **For Development:**
   ```
   http://localhost:3000/auth/callback
   http://localhost:3009/auth/callback
   http://localhost:*/auth/callback
   ```

   **For Production:**
   ```
   https://fitnest-fullstack.vercel.app/auth/callback
   ```

3. Add all URLs your app uses (test, staging, production)

### Configure SMTP Email (Optional but Recommended for Production)

By default, Supabase uses a limited free email sender. For production, configure SMTP:

1. Go to: **Supabase Dashboard > Authentication > Email Templates**

2. Click **SMTP Settings** and configure:
   - **SMTP Host**: your-email-provider.com
   - **SMTP Port**: 587 or 465
   - **SMTP User**: your-email@example.com
   - **SMTP Password**: your-password
   - **SMTP From Email**: noreply@yourdomain.com
   - **SMTP From Name**: Fitnest

**Recommended Email Providers:**
- SendGrid
- Mailgun
- Postmark
- AWS SES

**Or use your own SMTP server** if you have one.

## 4. Email Template Customization (Optional)

Customize the appearance of authentication emails:

1. Go to: **Supabase Dashboard > Authentication > Email Templates**

2. For each template (Confirm Signup, Reset Password, etc.), edit the HTML/text

3. Example customization:
   - Add your logo/branding
   - Customize button text and colors
   - Add company footer/contact info

## 5. Authentication Flow in Your App

### How it works:

1. **User Signs Up**
   ```
   User enters email & password
   ↓
   App checks if email exists (check-user API)
   ↓
   If new: Supabase creates account and sends confirmation email
   ↓
   User sees: "Check your email to confirm your account"
   ```

2. **User Confirms Email**
   ```
   User clicks link in email
   ↓
   Redirects to /auth/callback
   ↓
   App verifies token and completes signup
   ↓
   User can now login
   ```

3. **Password Reset**
   ```
   User enters email on forgot password
   ↓
   Supabase sends reset link to email
   ↓
   User clicks link → redirects to /auth/reset-password
   ↓
   User enters new password
   ↓
   Password updated
   ```

## 6. Testing Authentication Emails Locally

### Option A: Use Supabase's Built-in Email Preview (Free)

1. Go to: **Supabase Dashboard > Authentication > Email Templates**
2. Click "Send Test Email" to see preview
3. Check email receives confirmation link

### Option B: Use MailHog or Similar (Advanced)

1. Install MailHog: `brew install mailhog`
2. Run: `mailhog` (opens mail UI at http://localhost:1025)
3. Configure Supabase SMTP to localhost:1025
4. Emails will appear in MailHog interface

## 7. Troubleshooting

### Issue: "Email not sending"

**Checklist:**
- ✅ Email provider enabled in Supabase
- ✅ Redirect URLs configured correctly
- ✅ SMTP configured (if not using Supabase default)
- ✅ Check spam/junk folder
- ✅ Verify email address in signup form is valid

### Issue: "Confirmation link not working"

**Checklist:**
- ✅ Redirect URL matches your domain (localhost vs Vercel)
- ✅ Service role key is correct in `.env.local` and Vercel
- ✅ Not in private/incognito mode (session cookies issue)

### Issue: "Auth callback fails"

**Checklist:**
- ✅ `/auth/callback` route exists (it does)
- ✅ URL configuration includes your domain
- ✅ No typos in redirect URL

### Debug Commands (in browser console)

```javascript
// Check if Supabase client is initialized
console.log(supabase)

// Get current session
supabase.auth.getSession().then(data => console.log(data))

// Check auth state
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  console.log('Session:', session)
})
```

## 8. Security Best Practices

1. **Never commit `.env.local`**
   - Add to `.gitignore`
   - Git should already ignore it

2. **Rotate service role key periodically**
   - Do in Supabase > Settings > API
   - Update in all environments

3. **Use HTTPS in production**
   - Vercel provides this automatically
   - Email links won't work over HTTP

4. **Limit email send rate**
   - Supabase has built-in rate limiting
   - Consider adding your own limits for `/api/check-user`

5. **Monitor failed signups**
   - Check Supabase logs for email failures
   - Monitor Vercel function logs

## 9. Monitoring & Debugging

### Supabase Dashboard

1. **View Auth Logs:**
   - Supabase > Logs > Auth
   - See all signup/login/reset attempts

2. **Check User List:**
   - Supabase > Authentication > Users
   - Verify users are being created

3. **Email Logs:**
   - Supabase > Logs > Email
   - See which emails were sent/failed

### Vercel Dashboard

1. **Check Function Logs:**
   - Vercel > Your Project > Functions
   - See `/api/check-user` logs

2. **Monitor Errors:**
   - Vercel > Analytics
   - See failed requests

## 10. Quick Verification Checklist

Before considering production ready:

- [ ] `.env.local` created with all Supabase keys
- [ ] Vercel env vars set (Settings > Environment Variables)
- [ ] Email provider enabled in Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] SMTP configured (optional but recommended)
- [ ] Test signup locally → receive confirmation email
- [ ] Test signup on Vercel → receive confirmation email
- [ ] Test confirmation link → account activated
- [ ] Test login with new account → works
- [ ] Test password reset → email received
- [ ] Test forgot password flow end-to-end

## Contact Information

If emails aren't working:

1. **Check Supabase Support:** https://supabase.com/support
2. **Check Vercel Docs:** https://vercel.com/docs/environment-variables
3. **Common Solutions:**
   - Restart Vercel deployment after adding env vars
   - Check `.env.example` matches your actual keys
   - Verify email is valid format (no typos)

---

**Last Updated:** November 11, 2025
**App:** Fitnest Fullstack
**Production URL:** https://fitnest-fullstack.vercel.app/
