# Fitnest - Holistic Health Buddy

A comprehensive health and wellness application built with Next.js, featuring user authentication, BMI calculator, BMR calculator, nutrition tracking, mental health resources, and yoga poses integration.

**Production:** https://fitnest-fullstack.vercel.app/

## Authentication Setup

User authentication is fully configured with Supabase. For detailed setup instructions, see:

- **[📋 Production Auth Checklist](./PRODUCTION_AUTH_CHECKLIST.md)** - Quick step-by-step setup
- **[📖 Production Auth Setup Guide](./PRODUCTION_AUTH_SETUP.md)** - Comprehensive guide with email configuration
- **[🚀 Deployment Info](./DEPLOYMENT_INFO.md)** - Production URLs and testing guide
- **[✨ Auth Optimization Summary](./AUTH_OPTIMIZATION_SUMMARY.md)** - Technical improvements made

### Quick Start for Authentication

1. **Local Development:**
   ```bash
   # Fitnest — Holistic Health Buddy 🧘‍♀️💪

   A full-featured health & wellness web app built with Next.js + Supabase. Fitnest provides tools and content to support physical and mental well-being — features include authentication, BMI/BMR calculators, meal-planning, meditations, yoga poses, and more.

   Live demo: https://fitnest-fullstack.vercel.app/  
   (Production deployment info and auth setup are in the repository docs.)

   ---

   ## Table of contents
   - [Features](#features)
   - [Tech stack](#tech-stack)
   - [Quick start (local)](#quick-start-local)
   - [Commands](#commands)
   - [Environment variables](#environment-variables)
   - [Supabase & Data migration](#supabase--data-migration)
   - [API endpoints](#api-endpoints)
   - [Project structure](#project-structure)
   - [Contributing](#contributing)
   - [Deployment](#deployment)
   - [License](#license)
   - [Contact / acknowledgements](#contact--acknowledgements)

   ---

   ## Features ✅
   - User authentication (Supabase) with production-ready guides.
   - BMI & BMR calculators.
   - Meal planner powered by internal API + optional AI integration.
   - Meditation library and guided sessions.
   - Yoga categories & poses with migration tooling for Supabase.
   - Mental health resources and trackers.
   - Responsive modern UI with accessibility focus.

   ---

   ## Tech stack 🧰
   - Framework: Next.js (App / Pages)
   - Language: TypeScript
   - UI: Tailwind CSS, Radix UI
   - Authentication & DB: Supabase
   - Client data fetching: @tanstack/react-query
   - Animations: Framer Motion, Lottie
   - Storage / Migration: Notebook/JSON exports and migration scripts (lib/migrate.ts)
   - Dev tooling: ESLint, TypeScript, Vite (dev dependencies)

   ---

   ## Quick start (local) 🚀

   1. Clone the repo:
      ```bash
      git clone https://github.com/sanskar1309/fitnest-fullstack.git
      cd fitnest-fullstack
      ```

   2. Create an .env.local from the template:
      ```bash
      cp .env.example .env.local
      # Fill in your Supabase URL / keys and any optional API keys
      ```

   3. Install dependencies:
      ```bash
      npm install
      ```

   4. Run locally:
      ```bash
      npm run dev
      # App runs at http://localhost:3009 (configured in scripts)
      ```

   ---

   ## Commands 📦
   - Start dev server: npm run dev
   - Build for production: npm run build
   - Export a static build: npm run export
   - Start production server: npm run start
   - Lint: npm run lint
   - Run migrations (seed Supabase from local JSON): npm run migrate
     - Note: `postbuild` runs migrate automatically after build.

   ---

   ## Environment variables 🔐
   Copy `.env.example` to `.env.local` and set these at minimum:
   - NEXT_PUBLIC_SUPABASE_URL — Public Supabase project URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY — Public anon key (client)
   - SUPABASE_SERVICE_ROLE_KEY — Service role key (server-side only — DO NOT expose)
   Optional:
   - OPENROUTER_API_KEY — for AI-powered meal planning or other features
   - NEXT_PUBLIC_GA_ID — Google Analytics id (if used)

   Security note: only set `SUPABASE_SERVICE_ROLE_KEY` on server/production and NEVER prefix with NEXT_PUBLIC.

   ---

   ## Supabase & Data migration 🛠️
   This repo includes JSON dumps and a migration tool to seed yoga categories & poses into Supabase:
   - Data files: categories.json, poses.json, difficulty.json, etc.
   - Migration script: lib/migrate.ts
   - Example flow:
     1. Ensure .env.local has SUPABASE_SERVICE_ROLE_KEY.
     2. Place JSON files in the repo root (if not already).
     3. Run: `npm run migrate` (or `node lib/migrate.ts`)

   See `PRODUCTION_AUTH_SETUP.md`, `PRODUCTION_AUTH_CHECKLIST.md`, and `DEPLOYMENT_INFO.md` for full auth & production setup.

   ---

   ## API endpoints 📡
   The project exposes the following internal endpoints (serverless / Next.js api routes):
   - GET /api/v1 — API index
   - GET /api/v1/categories — list categories (yoga)
   - GET /api/v1/categories?id=1 — category by ID
   - GET /api/v1/categories?name=yoga — by name
   - GET /api/v1/poses — list poses
   - GET /api/v1/poses?id=1 — pose by ID
   - GET /api/v1/poses?level=beginner — by difficulty

   There are additional endpoints for meal planning, auth checks, etc. See pages/api/ for full server routes.

   ---

   ## Project structure 🗂️
   Top-level highlights:
   - pages/ — Next.js pages and API routes
   - src/ — UI components, contexts, hooks
   - lib/ — utilities, migration scripts, supabase client
   - public/ — static assets & JSON content exports
   - Documentation: PRODUCTION_AUTH_SETUP.md, DEPLOYMENT_INFO.md, AUTH_IMPLEMENTATION_GUIDE.md, 00_START_HERE.md

   ---

   ## Contributing 🤝
   Thanks for your interest! A few suggestions to get started:
   - Open an issue if you find a bug or want a feature.
   - Fork and open a pull request with a clear description and tests where applicable.
   - Follow existing TypeScript + lint rules.

   If you'd like, I can create contributing guidelines and templates for issues/PRs.

   ---

   ## Deployment ☁️
   This app is production-ready and currently deployed on Vercel. For production:
   - Add all NEXT_PUBLIC_* variables to Vercel in the Project > Settings > Environment Variables.
   - Set SUPABASE_SERVICE_ROLE_KEY only in the Production environment (do not expose it).
   - Deploy from the main branch and ensure migrations run as part of the build step if needed.

   ---

   ## License 📄
   This project uses the MIT license (please add a LICENSE file at repo root if you'd like it explicit).

   ---

   ## Contact / Acknowledgements 💬
   - Maintainer: sanskar1309
   - Live: https://fitnest-fullstack.vercel.app/
   - Thank you to all open-source projects & packages used in this repo!

   ---

   If you'd like, I can:
   - Add this as the repo README.md and open a PR, or
   - Create a shorter README or a README tailored for end users vs developers.

   Would you like me to add this README to the repository now?
