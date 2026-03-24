# Fitnest — Holistic Health Buddy

A full-featured health & wellness web app built with Next.js + Supabase. Features include authentication, BMI/BMR calculators, meal planning, meditations, yoga poses, and more.

**Live:** https://fitnest-fullstack.vercel.app/

---

## Tech Stack

- **Framework:** Next.js (Pages Router), TypeScript
- **UI:** Tailwind CSS, Radix UI, shadcn/ui
- **Auth & DB:** Supabase
- **Data fetching:** @tanstack/react-query
- **Animations:** Framer Motion, Lottie

---

## Quick Start (Local)

```bash
git clone https://github.com/sanskar1309/fitnest-fullstack.git
cd fitnest-fullstack
cp .env.example .env.local   # fill in Supabase keys
npm install
npm run dev                  # runs at http://localhost:3009
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...      # public, safe for client
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # SECRET — server-side only, never expose
OPENROUTER_API_KEY=your-key               # optional, for AI meal planning
```

> `SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `NEXT_PUBLIC_` and should only be set in the Production environment on Vercel.

---

## Supabase Auth Setup

### 1. Enable Email Provider
- Supabase Dashboard → Authentication → Providers → Email
- Toggle ON: **Confirm email** and **Secure email change**

### 2. Configure Redirect URLs
- Supabase Dashboard → Authentication → URL Configuration
- Add:
  ```
  http://localhost:3009/auth/callback
  https://fitnest-fullstack.vercel.app/auth/callback
  ```

### 3. (Optional) Custom SMTP
- Supabase Dashboard → Authentication → Email Templates → SMTP Settings
- Recommended providers: SendGrid, Mailgun, Postmark, AWS SES

---

## Vercel Deployment

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add all three Supabase variables
3. `NEXT_PUBLIC_*` keys → all environments (Production, Preview, Development)
4. `SUPABASE_SERVICE_ROLE_KEY` → **Production only**
5. Trigger a redeploy after adding env vars

---

## Auth Flows

| Flow | Steps |
|------|-------|
| **Signup** | Enter email/password → confirmation email sent → click link → account active |
| **Login** | Enter confirmed email/password → redirected to home |
| **Forgot password** | Enter email → reset link sent → enter new password → done |
| **Protected routes** | Unauthenticated users are redirected to login |

---

## Testing Checklist

- [ ] Signup with new email → receive confirmation email
- [ ] Click confirmation link → account activated
- [ ] Signup with existing email → error shown
- [ ] Login with confirmed account → works
- [ ] Logout → works
- [ ] Forgot password → reset email received
- [ ] Password reset link → works
- [ ] Login with new password → works
- [ ] Verify redirect URLs configured in Supabase

Test endpoint:
```bash
curl -sS http://localhost:3009/api/check-user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# Expected: {"exists":false}
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/categories` | List yoga categories |
| `GET /api/v1/categories?id=1` | Category by ID |
| `GET /api/v1/poses` | List yoga poses |
| `GET /api/v1/poses?level=beginner` | Poses by difficulty |
| `POST /api/check-user` | Check if email is registered |

See `pages/api/` for all server routes.

---

## Commands

```bash
npm run dev      # Start dev server (localhost:3009)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Lint
npm run migrate  # Seed Supabase from local JSON (also runs postbuild)
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Email not arriving | Check spam, wait 2 min, check Supabase → Logs → Email |
| Confirmation link broken | Verify redirect URL includes your domain in Supabase |
| "Invalid API key" | Redeploy Vercel after setting env vars |
| Env vars not loading | Ensure `NEXT_PUBLIC_*` are in all environments, trigger redeploy |
| Auth callback fails | Check `/auth/callback` route, verify no typos in redirect URL |

**Debug in browser console:**
```js
supabase.auth.getSession().then(data => console.log(data))
```

**Monitoring:**
- Auth logs: Supabase → Logs → Auth
- Email logs: Supabase → Logs → Email
- Function logs: Vercel → Project → Functions

---

## Project Structure

```
fitnest-fullstack/
├── pages/               # Next.js pages and API routes
│   ├── auth.tsx         # Login/Signup UI
│   ├── auth/callback.tsx
│   ├── auth/reset-password.tsx
│   └── api/check-user.ts
├── src/
│   ├── components/      # UI components
│   ├── contexts/        # AuthContext
│   └── hooks/
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── migrate.ts       # Data migration script
└── .env.example         # Environment variable template
```
