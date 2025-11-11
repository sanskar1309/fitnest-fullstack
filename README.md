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
   cp .env.example .env.local
   # Fill in Supabase keys (get from Supabase Dashboard > Settings > API)
   npm run dev
   ```

2. **Production (Vercel):**
   - Add environment variables in Vercel Dashboard > Settings > Environment Variables
   - See `PRODUCTION_AUTH_SETUP.md` for detailed instructions

3. **Email Configuration:**
   - Enable Email provider in Supabase Authentication
   - Set redirect URLs to include: `https://fitnest-fullstack.vercel.app/auth/callback`
   - See `PRODUCTION_AUTH_SETUP.md` for SMTP setup (recommended for production)

## Yoga API Integration

The app includes a full yoga API with categories and poses, migrated from SQLite to Supabase.

### API Endpoints

- `GET /api/v1` - Base URLs for all endpoints
- `GET /api/v1/categories` - Get all yoga categories with poses
- `GET /api/v1/categories?id=1` - Get category by ID
- `GET /api/v1/categories?name=yoga` - Get category by name
- `GET /api/v1/categories?id=1&level=beginner` - Get category with poses filtered by level
- `GET /api/v1/poses` - Get all yoga poses
- `GET /api/v1/poses?id=1` - Get pose by ID
- `GET /api/v1/poses?name=pose` - Get pose by name
- `GET /api/v1/poses?level=beginner` - Get poses by difficulty level

### Database Migration

To populate the Supabase database with yoga data:

1. Export data from the original SQLite database (in yoga-api-main project):
   ```bash
   cd /path/to/yoga-api-main
   node export-data.js
   ```

2. Copy the generated JSON files (categories.json, poses.json, difficulty.json, transitive_poses.json) to this project's root directory.

3. Set the SUPABASE_SERVICE_ROLE_KEY environment variable (get it from Supabase dashboard > Settings > API).

4. Run the migration script:
   ```bash
   node lib/migrate.js
   ```

The data will be inserted into your Supabase tables in the correct order to maintain foreign key relationships.
