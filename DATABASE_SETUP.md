# Database Setup Guide

This project has been migrated from Prisma to PostgreSQL with native SQL queries for better performance and control.

## Prerequisites

- PostgreSQL 12+ installed locally or access to a PostgreSQL cloud service
- Node.js 18+ installed

## Quick Setup

### 1. Install PostgreSQL

**Local Installation:**
- **Windows:** Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS:** `brew install postgresql` or download from postgresql.org
- **Linux:** `sudo apt-get install postgresql postgresql-contrib`

**Cloud Options:**
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Railway](https://railway.app/) - Simple cloud deployment
- [Heroku Postgres](https://www.heroku.com/postgres) - Managed PostgreSQL

### 2. Create Database

**Local Setup:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE zoolyum_db;

# Create user (optional)
CREATE USER zoolyum_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE zoolyum_db TO zoolyum_user;

# Exit
\q
```

### 3. Configure Environment

Update your `.env` file with your database connection string:

```env
# Local PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/zoolyum_db

# Or cloud service (example with Neon)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Setup Database Tables

```bash
npm run setup-db
```

This will:
- Create all necessary tables (contacts, contact_settings, testimonials)
- Add indexes for performance
- Insert default contact settings
- Insert sample testimonials

## Database Schema

### Contacts Table
```sql
contacts (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'NEW',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### Contact Settings Table
```sql
contact_settings (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  working_hours VARCHAR(255) NOT NULL,
  twitter_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  instagram_url VARCHAR(255),
  behance_url VARCHAR(255),
  enable_phone_field BOOLEAN DEFAULT true,
  require_phone_field BOOLEAN DEFAULT false,
  auto_reply_enabled BOOLEAN DEFAULT false,
  auto_reply_message TEXT,
  notification_email VARCHAR(255),
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### Testimonials Table
```sql
testimonials (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

## API Endpoints

### Contacts
- `GET /api/contacts` - List all contacts (Admin only)
- `POST /api/contacts` - Submit new contact form
- `GET /api/contacts/[id]` - Get specific contact (Admin only)
- `PUT /api/contacts/[id]` - Update contact (Admin only)
- `DELETE /api/contacts/[id]` - Delete contact (Admin only)
- `GET /api/contacts/settings` - Get contact settings
- `PUT /api/contacts/settings` - Update contact settings (Admin only)
- `GET /api/contacts/stats` - Get contact statistics (Admin only)

### Testimonials
- `GET /api/testimonials` - List testimonials (public: approved only, admin: all)
- `POST /api/testimonials` - Submit new testimonial
- `GET /api/testimonials/[id]` - Get specific testimonial
- `PUT /api/testimonials/[id]` - Update testimonial (Admin only)
- `DELETE /api/testimonials/[id]` - Delete testimonial (Admin only)

## Development

### Running Migrations

To add new migrations, create SQL files in the `migrations/` directory with the naming convention:
`XXX_description.sql` (e.g., `003_add_user_table.sql`)

Then run:
```bash
npm run setup-db
```

### Database Operations

The project uses custom database operations located in:
- `lib/postgres.ts` - Database connection and query utilities
- `lib/contact-operations.ts` - Contact-related database operations
- `lib/testimonial-operations.ts` - Testimonial-related database operations

### Performance Considerations

- All tables use UUID primary keys for better distribution
- Indexes are created on frequently queried columns
- Connection pooling is handled by the `pg` library
- Prepared statements are used to prevent SQL injection

## Troubleshooting

### Connection Issues
1. Verify PostgreSQL is running: `pg_isready`
2. Check connection string format
3. Ensure database exists
4. Verify user permissions

### Migration Errors
1. Check PostgreSQL logs
2. Verify SQL syntax in migration files
3. Ensure proper permissions for creating tables

### Performance Issues
1. Check query execution plans: `EXPLAIN ANALYZE`
2. Monitor connection pool usage
3. Consider adding additional indexes for specific queries

## Production Deployment

1. Use environment variables for sensitive data
2. Enable SSL connections (`sslmode=require`)
3. Set up connection pooling (PgBouncer recommended)
4. Configure backup strategy
5. Monitor database performance and logs

## Migration from Prisma

This project was successfully migrated from Prisma to native PostgreSQL. Key changes:

- Removed `@prisma/client` dependency
- Replaced Prisma schema with SQL migrations
- Updated all database operations to use native SQL
- Maintained the same API interface for seamless transition
- Improved performance with optimized queries and indexes