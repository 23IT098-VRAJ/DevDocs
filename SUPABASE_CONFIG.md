# Supabase Configuration for DevDocs

## Project Information

**Project URL:** https://kqfehrmqjfzrfufpbhaw.supabase.co  
**Project Reference:** kqfehrmqjfzrfufpbhaw

---

## Next Steps to Get Database Connection String

### 1. Go to Database Settings

```
https://supabase.com/dashboard/project/kqfehrmqjfzrfufpbhaw/settings/database
```

### 2. Find Connection String

Look for section: **Connection string**

You'll see options:
- URI (Use this one)
- Session mode
- Transaction mode

**Your Connection String:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.kqfehrmqjfzrfufpbhaw.supabase.co:5432/postgres
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password

### 3. Enable pgvector Extension

Go to SQL Editor:
```
https://supabase.com/dashboard/project/kqfehrmqjfzrfufpbhaw/sql/new
```

Run this SQL command:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Click **Run** button ✅

### 4. Create .env File

Once you have the connection string, create `.env` in `devdocs-backend/`:

```bash
cd devdocs-backend
notepad .env
```

Paste this content (replace YOUR-PASSWORD):
```env
# Database Configuration (Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.kqfehrmqjfzrfufpbhaw.supabase.co:5432/postgres

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# AI/ML Model
SENTENCE_TRANSFORMER_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### 5. Verify Connection

Test the connection:
```powershell
cd devdocs-backend
.\venv\Scripts\activate
python -c "from sqlalchemy import create_engine; import os; from dotenv import load_dotenv; load_dotenv(); engine = create_engine(os.getenv('DATABASE_URL').replace('postgresql://', 'postgresql+psycopg2://')); conn = engine.connect(); print('✅ Connected to Supabase!'); conn.close()"
```

---

## Quick Reference

**Supabase Dashboard:** https://supabase.com/dashboard/project/kqfehrmqjfzrfufpbhaw  
**SQL Editor:** https://supabase.com/dashboard/project/kqfehrmqjfzrfufpbhaw/sql  
**Table Editor:** https://supabase.com/dashboard/project/kqfehrmqjfzrfufpbhaw/editor  
**Database Settings:** https://supabase.com/dashboard/project/kqfehrmqjfzrfufpbhaw/settings/database

---

## Status Checklist

- [ ] Get database connection string from Supabase dashboard
- [ ] Enable pgvector extension (run CREATE EXTENSION vector)
- [ ] Create .env file with DATABASE_URL
- [ ] Test connection
- [ ] Ready to start implementing database layer

---

**Saved for later use!** When you're ready to work on the database, come back here.
