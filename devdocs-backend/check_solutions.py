import asyncio
import asyncpg
import sys

async def check_solutions():
    try:
        conn = await asyncpg.connect('postgresql://postgres:DevDocs4all@db.kqfehrmqjfzrfufpbhaw.supabase.co:5432/postgres')
        
        # Check total solutions
        total = await conn.fetchval('SELECT COUNT(*) FROM solutions')
        print(f"\n📊 Total Solutions in Database: {total}")
        
        # Check solutions with details
        rows = await conn.fetch('''
            SELECT id, title, user_id, is_archived, created_at 
            FROM solutions 
            ORDER BY created_at DESC 
            LIMIT 10
        ''')
        
        print(f"\n📝 Last 10 Solutions:")
        print("-" * 100)
        for row in rows:
            archived = "❌ ARCHIVED" if row['is_archived'] else "✅ Active"
            user_id = str(row['user_id']) if row['user_id'] else "NULL"
            user_display = user_id[:8] + "..." if user_id != "NULL" else "NULL"
            print(f"{archived} | User: {user_display} | Title: {row['title'][:50]}")
        
        # Check current logged-in user (get from users table)
        users = await conn.fetch('SELECT id, email FROM users LIMIT 5')
        print(f"\n👥 Users in Database:")
        print("-" * 100)
        for user in users:
            user_solution_count = await conn.fetchval(
                'SELECT COUNT(*) FROM solutions WHERE user_id = $1 AND is_archived = FALSE',
                user['id']
            )
            print(f"User: {user['id']} | Email: {user['email']} | Solutions: {user_solution_count}")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(check_solutions())
