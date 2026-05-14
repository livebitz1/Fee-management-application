# Database Setup Guide - Neon + Prisma

This guide will help you set up the Prisma ORM with Neon database for the Fee Management application.

## Prerequisites

- Node.js 18+ installed
- npm package manager
- Neon account (free tier available at https://neon.tech)

## Step 1: Create a Neon Database

1. Visit [https://console.neon.tech](https://console.neon.tech)
2. Sign up for a free account
3. Create a new project
4. Create a new database (or use the default `neondb`)
5. Copy the connection string (it will look like: `postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`)

## Step 2: Configure Environment Variables

1. Open `.env.local` in the project root
2. Replace the placeholder `DATABASE_URL` with your actual Neon connection string:

```
DATABASE_URL="postgresql://your_user:your_password@ep-xxxxx.us-east-1.aws.neon.tech/feemanagement?sslmode=require"
```

## Step 3: Set Up Prisma

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Create Database Tables
```bash
npm run prisma:migrate
```

This will prompt you to name the migration (e.g., "init"). After the migration completes, your database tables will be created.

## Step 4: Seed the Database (Optional)

To populate the database with sample data for testing:

```bash
npm run prisma:seed
```

This will create:
- 8 sample students
- 5 sample payments
- 4 sample receipts
- 2 pending fee records
- 6 months of revenue data
- Dashboard statistics
- 4 recent activity records

## Step 5: Start the Application

```bash
npm run dev
```

The application will start at `http://localhost:3001`

## Database Schema Overview

### Models Created

1. **Student** - Student information with fee details
2. **Payment** - Payment transaction records
3. **Receipt** - Payment receipts
4. **PendingFee** - Outstanding fees by student
5. **DashboardStat** - Dashboard metrics
6. **RevenueData** - Monthly revenue tracking
7. **RecentActivity** - Activity feed entries

## API Endpoints

All API routes are automatically created:

- `GET/POST /api/students` - Manage students
- `GET/PUT/DELETE /api/students/[id]` - Individual student operations
- `GET/POST /api/payments` - Manage payments
- `GET/POST /api/receipts` - Manage receipts
- `GET /api/pending-fees` - View pending fees
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/revenue` - Revenue data
- `GET /api/dashboard/activities` - Recent activities

## Features Implemented

✅ Prisma ORM integration
✅ Neon PostgreSQL database
✅ RESTful API routes
✅ Type-safe database operations
✅ Automatic schema migrations
✅ Database seeding with sample data
✅ Dynamic data fetching across all pages
✅ Error handling and retry logic

## Troubleshooting

### Connection Error
- Verify your Neon connection string in `.env.local`
- Ensure your IP is whitelisted in Neon (should be automatic)
- Check if the database is running

### Migration Failed
- Delete the prisma/migrations folder (if it exists)
- Run `npm run prisma:migrate` again
- Check error messages for specific issues

### Build Errors
- Run `npm run typecheck` to find TypeScript errors
- Ensure all environment variables are set
- Clear `.next` folder and rebuild

## Useful Prisma Commands

```bash
# View database GUI
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Generate Prisma Client
npm run prisma:generate
```

## Next Steps

1. Add authentication for the API routes
2. Implement input validation with Zod
3. Add pagination to API endpoints
4. Implement data filtering and sorting
5. Add more comprehensive error handling
6. Set up database backups

## Support

For Neon support: https://neon.tech/docs
For Prisma support: https://www.prisma.io/docs
