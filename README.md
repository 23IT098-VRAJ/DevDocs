# 📚 DevDocs — AI-Powered Personal Code Library

> **Store, organize, and retrieve your code snippets instantly with AI-powered semantic search.**

DevDocs is a full-stack web application that helps developers build a personal library of code solutions. Instead of searching through bookmarks, notes, or Stack Overflow history, DevDocs lets you save your own solutions and find them instantly using natural language queries powered by AI vector embeddings.

---

## 🌟 Key Features

### 🔍 AI Semantic Search
- **Natural language queries** — search by describing what you need, not exact keywords
- **Vector similarity** powered by `sentence-transformers` (all-mpnet-base-v2) and PostgreSQL `pgvector`
- Ranked results with **similarity scores** and highlighting

### 🤖 AI Answer Synthesis
- **Gemini 2.0 Flash** generates contextual answers from your personal code library
- **Streaming responses** — answers appear token-by-token in real time
- References your actual saved solutions — no hallucinated code

### 📝 Solution Management (CRUD)
- Create, read, update, and delete code solutions
- **28+ programming languages** supported (Python, JavaScript, TypeScript, Java, Go, Rust, etc.)
- Rich code editor with **syntax highlighting** (Prism.js)
- Tags for flexible categorization

### 🔖 Bookmarks
- Bookmark/unbookmark solutions with one click
- Dedicated bookmarks page for quick access to favorites

### 📊 Dashboard & Analytics
- Personal dashboard with stats at a glance
- **Total solutions**, **languages used**, **unique tags**
- Language distribution breakdown chart
- Recent solutions feed

### 🔐 Authentication & Security
- **Supabase Auth** — email/password sign-up & sign-in
- JWT-based API authentication with automatic token refresh
- Per-user data isolation — each user sees only their own library
- Rate limiting, security headers, CORS protection

### 🎨 Modern UI/UX
- **Dark-themed** glassmorphic design with cyan accent palette
- Responsive layout — works on desktop and mobile
- Page transitions and scroll animations
- Confetti celebrations on actions
- Error boundaries for graceful failure handling

---

## 🏗️ Architecture Overview

```
┌────────────────────────┐       ┌────────────────────────┐
│   DevDocs Frontend     │       │   DevDocs Backend      │
│   (Next.js 16 + React) │◄─────►│   (FastAPI + Python)   │
│   Port: 3000           │  API  │   Port: 8000           │
└────────┬───────────────┘       └────────┬───────────────┘
         │                                │
         │  Supabase Auth (JWT)           │  SQLAlchemy (Async)
         │                                │
         ▼                                ▼
┌────────────────────────┐       ┌────────────────────────┐
│   Supabase             │       │   PostgreSQL + pgvector│
│   (Authentication)     │       │   (Supabase Hosted)    │
└────────────────────────┘       └────────────────────────┘
                                          │
                                          │  Vector Embeddings
                                          ▼
                                 ┌────────────────────────┐
                                 │  sentence-transformers │
                                 │  (all-mpnet-base-v2)   │
                                 └────────────────────────┘
                                          │
                                          ▼
                                 ┌────────────────────────┐
                                 │  Gemini 2.0 Flash API  │
                                 │  (AI Answer Synthesis) │
                                 └────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer           | Technology                                                    |
|-----------------|---------------------------------------------------------------|
| **Frontend**    | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4           |
| **UI**          | Lucide Icons, React Icons, Prism.js, Canvas Confetti          |
| **State**       | TanStack React Query v5, React Context API                    |
| **Auth**        | Supabase Auth (JWT), `@supabase/supabase-js`                 |
| **Backend**     | FastAPI 0.109, Python 3.9+, Pydantic v2, Uvicorn             |
| **Database**    | PostgreSQL + pgvector (Supabase hosted)                       |
| **ORM**         | SQLAlchemy 2.0 (async) + asyncpg                             |
| **AI/ML**       | sentence-transformers (all-mpnet-base-v2), PyTorch            |
| **AI Answers**  | Google Gemini 2.0 Flash (`google-genai` SDK)                  |
| **Security**    | SlowAPI rate limiting, CORS, security headers, JWT validation |
| **Logging**     | Structured JSON logging                                       |

---

## 📁 Project Structure

```
DevDocs/
├── README.md                          # ← You are here
│
├── database/                          # SQL setup scripts (run in Supabase SQL Editor)
│   ├── 01_create_tables.sql           # Solutions + Users tables
│   ├── 02_create_indexes.sql          # Performance indexes (8 total)
│   ├── 03_create_triggers.sql         # Auto-update timestamps
│   ├── 04_insert_sample_data.sql      # 5 sample solutions for testing
│   ├── 05_test_queries.sql            # Verification queries
│   ├── 06_authentication.sql          # Auth-related SQL
│   ├── 07_auto_create_user_trigger.sql# Auto-create user on first login
│   ├── 08_create_bookmarks.sql        # Bookmarks table
│   ├── SETUP_GUIDE.md                 # Step-by-step DB setup
│   └── VERIFICATION.sql              # Post-setup verification
│
├── devdocs-backend/                   # FastAPI backend
│   ├── run.py                         # Quick-start script
│   ├── requirements.txt               # Python dependencies
│   ├── app/
│   │   ├── main.py                    # FastAPI app, middleware, lifespan
│   │   ├── config.py                  # Pydantic settings (.env)
│   │   ├── database.py                # Async SQLAlchemy engine & session
│   │   ├── auth.py                    # JWT validation, user extraction
│   │   ├── models/                    # SQLAlchemy models
│   │   │   ├── solution.py            # Solution model (+ pgvector)
│   │   │   ├── user.py                # User model
│   │   │   ├── bookmark.py            # Bookmark model
│   │   │   └── embedding.py           # EmbeddingService singleton
│   │   ├── routers/                   # API route handlers
│   │   │   ├── solutions.py           # CRUD for solutions
│   │   │   ├── search.py              # Semantic search + AI answers
│   │   │   ├── dashboard.py           # User stats & recent solutions
│   │   │   ├── auth.py                # User profile & registration
│   │   │   ├── bookmarks.py           # Bookmark toggle & listing
│   │   │   └── health.py              # Health check
│   │   ├── schemas/                   # Pydantic request/response models
│   │   ├── services/                  # Business logic
│   │   │   ├── gemini.py              # Gemini 2.0 Flash streaming
│   │   │   ├── search.py              # Search algorithm
│   │   │   └── embedding.py           # Embedding generation
│   │   └── utils/                     # Validators, logger, exceptions
│   └── models/                        # Cached sentence-transformer model
│
└── devdocs-frontend/                  # Next.js frontend
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── src/
    │   ├── app/                        # Next.js App Router pages
    │   │   ├── page.tsx                # Landing / Authenticated home
    │   │   ├── layout.tsx              # Root layout + providers
    │   │   ├── auth/                   # Sign in, Sign up, Callback
    │   │   ├── dashboard/              # Dashboard page
    │   │   ├── search/                 # Semantic search page
    │   │   ├── solution/               # Solution CRUD pages
    │   │   │   ├── create/             # Create new solution
    │   │   │   └── [id]/               # View/Edit solution
    │   │   ├── bookmarks/              # Bookmarks page
    │   │   └── profile/                # User profile page
    │   ├── components/                 # Reusable UI components
    │   │   ├── dashboard/              # Stats, charts, recent solutions
    │   │   ├── search/                 # Search results, result cards
    │   │   ├── solution/               # Solution cards, detail, list
    │   │   ├── home/                   # Landing page, authenticated home
    │   │   ├── layout/                 # Navbar, sidebar, footer, transitions
    │   │   ├── form/                   # Form components
    │   │   ├── error/                  # Error boundary
    │   │   └── ui/                     # Shared UI primitives
    │   ├── contexts/                   # React Context (AuthContext)
    │   ├── hooks/                      # Custom hooks (useSearch, useSolutions, etc.)
    │   ├── lib/                        # Utilities, API client, types, constants
    │   └── providers/                  # Query, Theme, Auth providers
    └── public/                         # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

| Tool             | Version   | Purpose                          |
|------------------|-----------|----------------------------------|
| **Node.js**      | 18+       | Frontend runtime                 |
| **Python**       | 3.9+      | Backend runtime                  |
| **PostgreSQL**   | 15+ (pgvector) | Database (or use Supabase)  |
| **Supabase**     | —         | Authentication + Database hosting|
| **Git**          | —         | Version control                  |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/devdocs.git
cd devdocs
```

### 2. Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the scripts in order:
   - `database/01_create_tables.sql`
   - `database/02_create_indexes.sql`
   - `database/03_create_triggers.sql`
   - `database/04_insert_sample_data.sql` *(optional — adds 5 test solutions)*
   - `database/06_authentication.sql`
   - `database/07_auto_create_user_trigger.sql`
   - `database/08_create_bookmarks.sql`
3. Run `database/VERIFICATION.sql` to confirm everything is set up
4. See [database/SETUP_GUIDE.md](database/SETUP_GUIDE.md) for detailed instructions

### 3. Backend Setup

```bash
cd devdocs-backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env         # Windows
# cp .env.example .env         # Linux/Mac
```

Configure `devdocs-backend/.env`:

```env
# Database (from Supabase → Settings → Database)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# Supabase (from Supabase → Settings → API)
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
SUPABASE_KEY=your-anon-key

# Security
JWT_SECRET_KEY=your-secure-random-key

# Gemini AI (optional — for AI answer feature)
GEMINI_API_KEY=your-gemini-api-key

# Environment
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:3000"]
```

Start the backend:

```bash
python run.py
```

> The server starts at **http://localhost:8000**
> API Docs available at **http://localhost:8000/api/docs**
> First run downloads the embedding model (~90 MB) — may take 1–2 minutes.

### 4. Frontend Setup

```bash
cd devdocs-frontend

# Install dependencies
npm install

# Create .env.local
```

Configure `devdocs-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://[ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Start the frontend:

```bash
npm run dev
```

> The app starts at **http://localhost:3000**

---

## 📡 API Reference

Base URL: `http://localhost:8000`

### Health
| Method | Endpoint         | Description            | Auth |
|--------|------------------|------------------------|------|
| GET    | `/`              | Root health check      | No   |
| GET    | `/api/health`    | Detailed health status | No   |

### Authentication
| Method | Endpoint              | Description                   | Auth |
|--------|-----------------------|-------------------------------|------|
| GET    | `/api/auth/status`    | Auth configuration status     | No   |
| GET    | `/api/auth/me`        | Get current user profile      | Yes  |
| PUT    | `/api/auth/me`        | Update user profile           | Yes  |
| POST   | `/api/auth/register`  | Register user (Supabase hook) | No   |
| GET    | `/api/auth/users/:id` | Get public user profile       | No   |

### Solutions
| Method | Endpoint               | Description                        | Auth |
|--------|------------------------|------------------------------------|------|
| POST   | `/api/solutions`       | Create solution (auto-embeds)      | Yes  |
| GET    | `/api/solutions`       | List solutions (paginated/filtered)| Yes  |
| GET    | `/api/solutions/:id`   | Get solution by ID                 | Yes  |
| PUT    | `/api/solutions/:id`   | Update solution                    | Yes  |
| DELETE | `/api/solutions/:id`   | Delete solution                    | Yes  |

### Search
| Method | Endpoint              | Description                            | Auth |
|--------|-----------------------|----------------------------------------|------|
| POST   | `/api/search`         | Semantic vector search                 | Yes  |
| POST   | `/api/search/answer`  | AI-generated answer (streaming)        | Yes  |

### Dashboard
| Method | Endpoint                  | Description               | Auth |
|--------|---------------------------|---------------------------|------|
| GET    | `/api/dashboard/stats`    | User statistics & charts  | Yes  |
| GET    | `/api/dashboard/recent`   | Recent solutions          | Yes  |

### Bookmarks
| Method | Endpoint                           | Description         | Auth |
|--------|------------------------------------|---------------------|------|
| POST   | `/api/bookmarks/toggle/:solution_id` | Toggle bookmark  | Yes  |
| GET    | `/api/bookmarks`                   | List user bookmarks | Yes  |

> Full interactive API docs: **http://localhost:8000/api/docs** (Swagger UI)

---

## ⚙️ Environment Variables

### Backend (`devdocs-backend/.env`)

| Variable                | Required | Default        | Description                          |
|-------------------------|----------|----------------|--------------------------------------|
| `DATABASE_URL`          | Yes      | —              | PostgreSQL connection string         |
| `SUPABASE_URL`          | Yes      | —              | Supabase project URL                 |
| `SUPABASE_JWT_SECRET`   | Yes      | —              | JWT secret for token validation      |
| `JWT_SECRET_KEY`        | Yes      | —              | Secret key for JWT signing           |
| `SUPABASE_KEY`          | No       | `""`           | Supabase anon API key                |
| `GEMINI_API_KEY`        | No       | `""`           | Google Gemini API key (AI answers)   |
| `ENVIRONMENT`           | No       | `development`  | `development`, `staging`, `production` |
| `API_PORT`              | No       | `8000`         | Server port                          |
| `CORS_ORIGINS`          | No       | `["*"]`        | Allowed CORS origins                 |
| `EMBEDDING_MODEL`       | No       | `all-mpnet-base-v2` | Sentence-transformer model name |
| `LOG_LEVEL`             | No       | `INFO`         | Logging level                        |
| `RATE_LIMIT_PER_MINUTE` | No       | `60`           | API rate limit per minute            |

### Frontend (`devdocs-frontend/.env.local`)

| Variable                        | Required | Description                |
|---------------------------------|----------|----------------------------|
| `NEXT_PUBLIC_API_URL`           | Yes      | Backend API base URL       |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous API key |

---

## 🔧 Development

### Running Both Services

Open two terminals:

```bash
# Terminal 1 — Backend
cd devdocs-backend
venv\Scripts\activate
python run.py

# Terminal 2 — Frontend
cd devdocs-frontend
npm run dev
```

### Backend Development

```bash
# Run with hot reload (default via run.py)
python run.py

# Or directly with uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Format code
black .
```

### Frontend Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Start production server
npm start
```

---

## 🗄️ Database Schema

### `solutions` Table
| Column       | Type                | Description                            |
|-------------|---------------------|----------------------------------------|
| `id`        | UUID (PK)           | Auto-generated unique identifier       |
| `title`     | TEXT (5–200 chars)   | Solution title                         |
| `description`| TEXT (20–2000 chars)| Detailed explanation                   |
| `code`      | TEXT (10–5000 chars) | Code snippet                           |
| `language`  | VARCHAR(50)         | Programming language                   |
| `tags`      | TEXT[]              | Array of tags                          |
| `embedding` | vector(768)         | AI-generated semantic embedding        |
| `user_id`   | UUID (FK → users)   | Owner of the solution                  |
| `is_archived`| BOOLEAN            | Soft delete flag                       |
| `created_at`| TIMESTAMP           | Creation timestamp                     |
| `updated_at`| TIMESTAMP           | Last update timestamp (auto-trigger)   |

### `users` Table
| Column          | Type           | Description                 |
|-----------------|----------------|-----------------------------|
| `id`            | UUID (PK)      | Unique identifier           |
| `email`         | VARCHAR(255)   | Email (unique)              |
| `auth_id`       | UUID           | Supabase auth user ID       |
| `full_name`     | VARCHAR(255)   | Display name                |
| `avatar_url`    | TEXT           | Profile picture URL         |
| `bio`           | TEXT           | User bio                    |
| `github_username`| VARCHAR(255)  | GitHub profile              |
| `is_active`     | BOOLEAN        | Account status              |
| `created_at`    | TIMESTAMP      | Registration date           |

### `bookmarks` Table
| Column        | Type          | Description             |
|---------------|---------------|-------------------------|
| `id`          | UUID (PK)     | Unique identifier       |
| `user_id`     | UUID (FK)     | User who bookmarked     |
| `solution_id` | UUID (FK)     | Bookmarked solution     |
| `created_at`  | TIMESTAMP     | When bookmark was added |

### Indexes (8 total)
- `idx_solutions_language` — Fast language filtering
- `idx_solutions_created_at` — Timeline queries
- `idx_solutions_updated_at` — Recent updates
- `idx_solutions_archived` — Archive filtering
- `idx_solutions_tags` — GIN index for tag search
- `idx_solutions_search` — Full-text search (pg_trgm)
- `solutions_embedding_idx` — **IVFFLAT** vector similarity index
- `solutions_pkey` — Primary key

---

## 🧠 How Semantic Search Works

1. **Indexing**: When a solution is saved, its title + description + code are concatenated and passed through the `all-mpnet-base-v2` sentence-transformer model, producing a **768-dimensional vector embedding**
2. **Storage**: The embedding is stored in a PostgreSQL `vector(768)` column using the `pgvector` extension
3. **Search**: When a user types a natural language query, it's embedded using the same model
4. **Ranking**: PostgreSQL computes **cosine similarity** (`1 - cosine distance`) between the query embedding and all stored embeddings
5. **Results**: Solutions are returned ranked by similarity score (0.0–1.0), filtered by a minimum threshold (default: 0.3)
6. **AI Answer** *(optional)*: The top 5 results are fed to **Gemini 2.0 Flash** which synthesizes a contextual answer, streamed in real time

---

## 🔒 Security Features

- **JWT Authentication** — Supabase-issued tokens validated on every protected request
- **Per-User Data Isolation** — Users can only access their own solutions
- **Rate Limiting** — 60 requests/minute, 1000 requests/hour per IP (SlowAPI)
- **Security Headers** — `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `CSP`, `X-XSS-Protection`
- **CORS Protection** — Configurable allowed origins (wildcard blocked in production)
- **GZip Compression** — Responses > 1KB are compressed
- **Input Validation** — Pydantic models enforce field constraints (lengths, types)
- **SQL Injection Prevention** — SQLAlchemy parameterized queries
- **Error Handling** — Centralized exception handlers prevent stack trace leaks

---

## 🚀 Future Enhancements

- **Collaborative Libraries** — Share solutions with teams or make them public
- **OAuth Social Login** — GitHub, Google, Discord authentication
- **Code Execution Sandbox** — Run code snippets directly in the browser
- **VS Code Extension** — Save and search solutions without leaving the editor
- **Export/Import** — Backup library as JSON/Markdown, import from Gists
- **Solution Versioning** — Track changes and diffs over time
- **Multi-language AI Answers** — Answer synthesis in user's preferred language
- **Advanced Filtering** — Filter by date range, similarity threshold, multiple tags
- **Mobile App** — React Native companion app
- **Self-Hosting Support** — Docker Compose for full local deployment

---

## 👥 Contributors

| Name          | Role              |
|---------------|-------------------|
| **23IT098**   | Full-Stack Developer |

---

## 📄 License

This project is developed as a **Semester Group Project (SGP)** for the 6th Semester of B.Tech IT.

---

<div align="center">

**Built with ❤️ using FastAPI, Next.js, PostgreSQL, and AI**

[Live Demo](#) · [API Docs](http://localhost:8000/api/docs) · [Report Bug](#) · [Request Feature](#)

</div>
