# DevDocs Backend

AI-powered backend API for DevDocs - semantic search for coding solutions.

## Tech Stack

- **Framework:** FastAPI (Python 3.9+)
- **Database:** PostgreSQL + pgvector
- **AI/ML:** sentence-transformers (all-MiniLM-L6-v2)
- **ORM:** SQLAlchemy 2.0 (async)

## Quick Start

### 1. Setup Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/devdocs
```

### 4. Setup Database

Ensure PostgreSQL is running with pgvector extension:

```sql
CREATE DATABASE devdocs;
\c devdocs
CREATE EXTENSION vector;
```

### 5. Run Development Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Visit:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
devdocs-backend/
├── main.py              # FastAPI application entry point
├── models.py            # SQLAlchemy database models
├── schemas.py           # Pydantic validation schemas
├── database.py          # Database connection and session
├── embeddings.py        # Sentence-transformers integration
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (git-ignored)
└── .env.example         # Example environment configuration
```

## API Endpoints

### Health Check
- `GET /health` - API health status

### Solutions
- `POST /api/solutions` - Save new solution
- `GET /api/solutions` - List all solutions
- `GET /api/solutions/{id}` - Get solution by ID
- `DELETE /api/solutions/{id}` - Delete solution

### Search
- `GET /api/search?q=query&limit=5` - Semantic search

### Dashboard
- `GET /api/dashboard/stats` - User statistics

## Development

### Run Tests

```bash
pytest
```

### Format Code

```bash
black .
```

### Database Migrations (Alembic)

```bash
# Generate migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

## Deployment

See deployment guide for:
- Render deployment
- Supabase database setup
- Environment configuration
- CORS settings

## Performance

- Embedding generation: ~50ms per solution
- Search response: <500ms (target)
- Model size: 22MB (all-MiniLM-L6-v2)

## License

MIT
