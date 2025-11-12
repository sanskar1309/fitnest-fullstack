# Production Authentication Checklist

## Step 1: Local Development Setup ✅

- [ ] Copy `.env.example` to `.env.local`
- [ ] Get Supabase keys from: Supabase Dashboard > Project Settings > API
- [ ] Fill in: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Fill in: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Fill in: `SUPABASE_SERVICE_ROLE_KEY` (never commit)
- [ ] Run: `npm run dev` (or restart dev server)
- [ ] Verify: `curl -sS http://localhost:3009/api/check-user -H "Content-Type: application/json" -d '{"email":"test@example.com"}'` returns `{"exists":false}`

## Step 2: Supabase Email Configuration ✅

- [ ] Go to: Supabase Dashboard > Authentication > Providers
- [ ] Enable: **Email** provider
- [ ] Toggle ON: **Confirm email** (required for signup flow)
- [ ] Toggle ON: **Secure email change**

## Step 3: Configure Redirect URLs ✅

- [ ] Go to: Supabase Dashboard > Authentication > URL Configuration
- [ ] Add for **Development:**
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3009/auth/callback`
  - `http://localhost:*/auth/callback`
- [ ] Add for **Production:**
  - `https://fitnest-fullstack.vercel.app/auth/callback`

## Step 4: Test Local Authentication ✅

- [ ] Open: http://localhost:3009/signup
- [ ] Sign up with a **new email address**
  - Expected: "Please check your email..." message
  - Check: Email inbox (or spam folder) for confirmation email
- [ ] Click confirmation link in email
  - Expected: Redirects to auth callback and logs in
- [ ] Sign up with **existing email**
  - Expected: "An account with this email already exists" error
- [ ] Test forgot password: http://localhost:3009/login
  - Click "Forgot password?"
  - Enter email
  - Check email for reset link
  - Click reset link
  - Set new password
  - Expected: "Password reset successful" message

## Step 5: Vercel Environment Variables ✅

- [ ] Go to: Vercel Dashboard > Your Project > Settings > Environment Variables
- [ ] Add: `NEXT_PUBLIC_SUPABASE_URL` (all environments: Production, Preview, Development)
- [ ] Add: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (all environments)
- [ ] Add: `SUPABASE_SERVICE_ROLE_KEY` (Production ONLY - for security)

**Don't forget to:**
- [ ] Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set for all environments (not just Production)
- [ ] Make sure `SUPABASE_SERVICE_ROLE_KEY` is only in Production environment

## Step 6: Deploy to Vercel ✅

- [ ] Commit and push your changes to git
- [ ] Vercel auto-deploys on push to main/feat branch
- [ ] Go to: Vercel Dashboard > Deployments
- [ ] Wait for deployment to complete
- [ ] Check: Deployment is marked as "Ready"

**After deploying:**
- [ ] Trigger redeployment: Vercel Dashboard > Your Project > Deployments > (latest) > Redeploy
- [ ] OR: Push an empty commit: `git commit --allow-empty -m "trigger deployment"`

## Step 7: Test Production Authentication ✅

- [ ] Open: https://fitnest-fullstack.vercel.app/signup
- [ ] Sign up with a **new email address**
  - Expected: "Please check your email..." message
  - Check: Email should arrive (allow 1-2 minutes)
- [ ] Click confirmation link in email
  - Expected: Opens email confirmation and logs you in
  - Expected: Redirects to home page
- [ ] Test login: https://fitnest-fullstack.vercel.app/login
  - Use the email you just confirmed
  - Expected: Login works, redirects to home
- [ ] Test with **existing email**
  - Try signing up with email from step above
  - Expected: "An account with this email already exists" error
- [ ] Test password reset
  - Click "Forgot password?"
  - Enter email
  - Check email for reset link (allow 1-2 minutes)
  - Complete password reset flow

## Step 8: Monitor & Verify ✅

### Check Supabase Logs
- [ ] Supabase Dashboard > Logs > Auth
  - See all signup/login attempts
  - Look for any errors

### Check Supabase Users
- [ ] Supabase Dashboard > Authentication > Users
  - See newly created users
  - Verify email confirmation status

### Check Vercel Logs
- [ ] Vercel Dashboard > Your Project > Logs
  - Check for any errors in `/api/check-user`
  - Look for deployment issues

## Troubleshooting

### Emails Not Sending
- [ ] Check Supabase > Logs > Email for errors
- [ ] Verify email provider is enabled
- [ ] Check spam/junk folder
- [ ] Verify email address is valid format
- [ ] Wait 1-2 minutes (emails can be slow)

### Confirmation Link Not Working
- [ ] Verify redirect URL in Supabase includes your domain
- [ ] Check browser console for errors (F12 > Console)
- [ ] Try in different browser (clear cookies)
- [ ] Verify `/auth/callback` route exists (it does)

### Environment Variables Not Loading
- [ ] Trigger redeploy on Vercel after adding env vars
- [ ] Check Vercel > Settings > Environment Variables (see they're set)
- [ ] Verify `NEXT_PUBLIC_*` keys are in all environments
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is in Production only

### 404 Errors on Auth Pages
- [ ] Check Vercel deployment completed successfully
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Check Vercel Logs for build errors

## Quick Reference Commands

```bash
# Local development
npm run dev

# Test check-user endpoint
curl -sS http://localhost:3009/api/check-user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected response for non-existent email:
# {"exists":false}

# Expected response for existing email:
# {"exists":true}
```

## Important URLs

- **Local Dev:** http://localhost:3009
- **Production:** https://fitnest-fullstack.vercel.app/
- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard

## Need Help?

Refer to these documents:
- **Full Setup Guide:** `PRODUCTION_AUTH_SETUP.md`
- **Auth Optimization:** `AUTH_OPTIMIZATION_SUMMARY.md`
- **Environment Template:** `.env.example`

---

✅ Once all items are checked, your production authentication is ready!
