"""
Setup script for bookmarks feature
Runs the database migration to create the bookmarks table
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy import text
from app.database import engine


async def setup_bookmarks():
    """Create bookmarks table and indexes"""
    
    # Read SQL file
    sql_file = Path(__file__).parent / "database" / "08_create_bookmarks.sql"
    
    if not sql_file.exists():
        print(f"❌ SQL file not found: {sql_file}")
        return False
    
    with open(sql_file, 'r') as f:
        sql_content = f.read()
    
    print("🚀 Setting up bookmarks feature...")
    
    try:
        async with engine.begin() as conn:
            # Split by semicolons and execute each statement
            statements = [s.strip() for s in sql_content.split(';') if s.strip()]
            
            for statement in statements:
                # Skip comments and empty lines
                if statement.startswith('--') or not statement:
                    continue
                
                # Execute the statement
                await conn.execute(text(statement))
                print(f"✅ Executed: {statement[:50]}...")
        
        print("\n✅ Bookmarks feature setup completed successfully!")
        print("\n📋 Next steps:")
        print("   1. Restart your backend server")
        print("   2. Test the bookmark endpoints")
        print("   3. Use the search page to bookmark solutions")
        return True
        
    except Exception as e:
        print(f"\n❌ Error setting up bookmarks: {str(e)}")
        return False
    finally:
        await engine.dispose()


if __name__ == "__main__":
    print("=" * 60)
    print("DevDocs - Bookmarks Feature Setup")
    print("=" * 60)
    print()
    
    success = asyncio.run(setup_bookmarks())
    
    if not success:
        sys.exit(1)
