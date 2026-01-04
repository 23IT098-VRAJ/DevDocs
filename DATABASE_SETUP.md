# PostgreSQL + pgvector Setup Guide

## Installation Progress

✅ **PostgreSQL 15.15-2** - Installing via winget (344 MB download)

---

## Post-Installation Steps

### 1. Verify PostgreSQL Installation

After installation completes, verify in a **new terminal**:

```powershell
psql --version
# Expected: psql (PostgreSQL) 15.15
```

### 2. Start PostgreSQL Service

```powershell
# Check service status
Get-Service -Name postgresql*

# Start service if not running
Start-Service -Name "postgresql-x64-15"
```

### 3. Set PostgreSQL Password

During installation, you'll set a password for the `postgres` superuser.
**Remember this password!** You'll need it for database connections.

Default settings:
- **Port:** 5432
- **Username:** postgres
- **Password:** [what you set during installation]

### 4. Install pgvector Extension

After PostgreSQL is installed:

```powershell
# Option 1: Using pre-built binaries (easiest)
# Download from: https://github.com/pgvector/pgvector/releases
# Get: pgvector-v0.8.0-pg15-windows-x64.zip
# Extract and follow instructions

# Option 2: Connect to database and enable (if available)
psql -U postgres -d postgres
CREATE EXTENSION vector;
\q
```

### 5. Create DevDocs Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql prompt:
CREATE DATABASE devdocs;
\c devdocs
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

### 6. Test Connection

```powershell
# Test connection
psql -U postgres -d devdocs -c "SELECT version();"

# Test pgvector
psql -U postgres -d devdocs -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';"
```

### 7. Update Backend .env

Create `.env` in `devdocs-backend/`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/devdocs

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# AI/ML Model
SENTENCE_TRANSFORMER_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

---

## Alternative: Use Supabase (Cloud)

If pgvector installation is problematic on Windows:

### Supabase Setup (5 minutes)

1. **Sign up:** https://supabase.com
2. **Create project:** Choose free tier
3. **Get connection string:**
   - Go to Settings → Database
   - Copy connection string
   - Replace in `.env`:
     ```env
     DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
     ```

4. **Enable pgvector:**
   - Go to SQL Editor
   - Run: `CREATE EXTENSION vector;`

**Advantages:**
- ✅ pgvector pre-installed
- ✅ Automatic backups
- ✅ Free 500MB storage
- ✅ No local setup needed

---

## Verification Checklist

After setup, verify:

```powershell
# 1. PostgreSQL running
Get-Service postgresql-x64-15

# 2. Can connect
psql -U postgres -c "SELECT 1;"

# 3. Database exists
psql -U postgres -c "\l" | Select-String devdocs

# 4. pgvector extension enabled
psql -U postgres -d devdocs -c "SELECT * FROM pg_extension WHERE extname='vector';"

# 5. Can create vector column
psql -U postgres -d devdocs -c "CREATE TABLE test (id serial, vec vector(3)); DROP TABLE test;"
```

All checks pass? ✅ **Database ready!**

---

## Troubleshooting

### PostgreSQL service won't start

```powershell
# Check Windows Event Viewer
Get-EventLog -LogName Application -Source PostgreSQL -Newest 10

# Try manual start
& "C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe" -D "C:\Program Files\PostgreSQL\15\data" start
```

### Can't connect to PostgreSQL

```powershell
# Check if listening on port 5432
netstat -an | Select-String "5432"

# Check pg_hba.conf authentication
notepad "C:\Program Files\PostgreSQL\15\data\pg_hba.conf"
# Ensure line exists: host all all 127.0.0.1/32 scram-sha-256
```

### pgvector not available

Use Supabase instead (see above) - it's actually easier and recommended for this project!

---

## Recommended: Use Supabase for Development

**Why Supabase > Local PostgreSQL for DevDocs:**

✅ **Zero installation issues**
✅ **pgvector pre-installed**
✅ **Automatic backups**
✅ **Free tier sufficient (500MB)**
✅ **Same setup for dev and production**
✅ **Web UI for database management**

Local PostgreSQL is fine, but Supabase removes friction.

---

**Next:** Once database is ready, we'll implement the backend database layer!
