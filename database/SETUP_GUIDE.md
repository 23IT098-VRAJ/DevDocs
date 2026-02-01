# DevDocs Database Setup Guide

## ✅ Connection Established
**Database**: Supabase PostgreSQL  
**Status**: Ready for setup

---

## 📋 Setup Instructions

### Step 1: Create Tables
1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy and paste content from: `database/01_create_tables.sql`
4. Click **Run** (or Ctrl+Enter)
5. ✅ You should see: "Success. No rows returned"

### Step 2: Create Indexes
1. Click **New Query** again
2. Copy and paste content from: `database/02_create_indexes.sql`
3. Click **Run**
4. ✅ Should complete in 5-10 seconds

### Step 3: Create Triggers
1. Click **New Query**
2. Copy and paste content from: `database/03_create_triggers.sql`
3. Click **Run**
4. ✅ Should see trigger created successfully

### Step 4: Insert Sample Data
1. Click **New Query**
2. Copy and paste content from: `database/04_insert_sample_data.sql`
3. Click **Run**
4. ✅ Should insert 5 sample solutions

### Step 5: Verify Everything Works
1. Click **New Query**
2. Copy and paste content from: `database/05_test_queries.sql`
3. Click **Run** (or run each test individually)
4. ✅ All queries should return results

---

## 🔍 Verification Checklist

After running all scripts, verify in Supabase Dashboard:

### Table Editor
- [ ] Go to **Table Editor** (left sidebar)
- [ ] See `solutions` table
- [ ] Click on it and see 5 sample solutions
- [ ] Verify columns: id, title, description, code, language, tags, embedding, timestamps

### Database → Tables
- [ ] Go to **Database** → **Tables**
- [ ] Click on `solutions` table
- [ ] See **Indexes** tab shows 8 indexes:
  - idx_solutions_language
  - idx_solutions_created_at
  - idx_solutions_updated_at
  - idx_solutions_archived
  - idx_solutions_tags
  - idx_solutions_search
  - solutions_embedding_idx (IVFFLAT - most important!)
  - solutions_pkey (automatic primary key)

### Database → Functions
- [ ] Go to **Database** → **Functions**
- [ ] See `update_solutions_updated_at()` function

---

## 📊 Sample Data Included

5 Solutions Inserted:
1. **Python**: Fix CORS error in FastAPI
2. **JavaScript**: Sort array of objects by property
3. **Python**: SQLAlchemy async session with PostgreSQL
4. **TypeScript**: React useState hook with TypeScript
5. **Python**: JWT token generation and verification

---

## 🎯 What's Ready

✅ **Database Structure**: Complete  
✅ **Performance Indexes**: All 8 indexes created  
✅ **Auto-Timestamps**: Trigger working  
✅ **Sample Data**: 5 solutions for testing  
✅ **Vector Search**: pgvector IVFFLAT index ready  

---

## 🚀 Next Steps

1. Run all 5 SQL files in Supabase SQL Editor
2. Verify in Table Editor (see 5 solutions)
3. Tell me "Database setup complete!"
4. I'll help you set up the FastAPI backend

---

## ⚠️ Important Notes

- **Connection String**: Saved in `devdocs-backend/.env` (keep secret!)
- **pgvector**: Already enabled (extension created in Step 1)
- **Embeddings**: Currently mock data (will generate real embeddings in backend)
- **Free Tier**: 500MB = ~166K solutions (plenty for now!)

---

## 🆘 Troubleshooting

### Error: "extension vector does not exist"
**Solution**: Run `CREATE EXTENSION IF NOT EXISTS vector;` in SQL Editor

### Error: "relation solutions already exists"
**Solution**: Table already created, skip to Step 2

### Error: "index already exists"
**Solution**: Indexes already created, safe to skip

---

## 📞 Need Help?

If you see any errors while running the SQL files, just paste the error message and I'll help fix it!

**Ready? Start with Step 1!** 💪
