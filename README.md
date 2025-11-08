# Holistic Health Buddy

A comprehensive health and wellness application built with Next.js, featuring BMI calculator, BMR calculator, nutrition tracking, mental health resources, and yoga poses integration.

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
