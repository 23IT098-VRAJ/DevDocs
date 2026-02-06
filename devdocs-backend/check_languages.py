import asyncio
from app.database import get_db
from sqlalchemy import text

async def check_languages():
    async for db in get_db():
        # Check languages for the most recent user
        result = await db.execute(text("""
            SELECT language, COUNT(*) as count 
            FROM solutions 
            WHERE is_archived = FALSE 
            AND user_id = (SELECT id FROM users ORDER BY created_at DESC LIMIT 1)
            GROUP BY language 
            ORDER BY count DESC
        """))
        
        rows = result.fetchall()
        print('\n=== Languages in database ===')
        for row in rows:
            print(f'  {row.language}: {row.count} solutions')
        
        print(f'\nTotal unique languages: {len(rows)}')
        
        # Also check the dashboard stats query
        stats_result = await db.execute(text("""
            SELECT 
                COUNT(*) as total_solutions,
                COUNT(DISTINCT language) as total_languages
            FROM solutions
            WHERE is_archived = FALSE 
            AND user_id = (SELECT id FROM users ORDER BY created_at DESC LIMIT 1)
        """))
        
        stats = stats_result.fetchone()
        print(f'\n=== Dashboard Stats Query ===')
        print(f'  Total solutions: {stats.total_solutions}')
        print(f'  Total languages (DISTINCT): {stats.total_languages}')
        break

if __name__ == "__main__":
    asyncio.run(check_languages())
