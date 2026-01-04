# DevDocs - Project Structure

## Complete Directory Tree

```
devdocs/
├── README.md
├── .gitignore
└── docs/
    ├── PROJECT_OVERVIEW.md
    ├── TECH_STACK.md
    ├── ARCHITECTURE.md
    ├── API_SPECIFICATION.md
    ├── DATABASE_SCHEMA.md
    ├── COPILOT_CONTEXT.md
    ├── DEVELOPMENT_SETUP.md
    ├── CODING_STANDARDS.md
    ├── PROJECT_STRUCTURE.md
    └── DEPLOYMENT_GUIDE.md

devdocs-backend/
├── main.py                         # FastAPI app entry point
├── config.py                       # Configuration management
├── requirements.txt                # Python dependencies
├── .env.example                    # Example env file
├── .env                            # Environment variables (git ignored)
├── .gitignore                      # Git ignore file
│
├── app/
│   ├── __init__.py                 # Package marker
│   ├── models.py                   # Pydantic request/response models
│   ├── database.py                 # Database connection & session
│   ├── schemas.py                  # SQLAlchemy ORM models
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py               # GET /health - Health check
│   │   ├── solutions.py            # CRUD endpoints for solutions
│   │   └── search.py               # GET /api/search - Semantic search
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── embedding.py            # Embedding generation service
│   │   ├── solution.py             # Solution business logic
│   │   └── search.py               # Search algorithm implementation
│   │
│   └── utils/
│       ├── __init__.py
│       ├── validators.py           # Input validation helpers
│       ├── logger.py               # Logging configuration
│       └── exceptions.py           # Custom exception classes
│
└── tests/
    ├── __init__.py
    ├── test_health.py              # Health check tests
    ├── test_solutions.py           # CRUD endpoint tests
    ├── test_search.py              # Search endpoint tests
    ├── test_embedding.py           # Embedding service tests
    ├── fixtures.py                 # Pytest fixtures
    └── conftest.py                 # Test configuration

devdocs-frontend/
├── next.config.js                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── package.json                    # NPM dependencies & scripts
├── package-lock.json               # Locked dependencies
├── .env.example                    # Example env file
├── .env.local                      # Environment variables (git ignored)
├── .gitignore                      # Git ignore file
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home page (landing)
│   │   ├── globals.css             # Global styles
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Dashboard page
│   │   │
│   │   ├── search/
│   │   │   └── page.tsx            # Search results page
│   │   │
│   │   ├── solution/
│   │   │   ├── page.tsx            # Solutions list page
│   │   │   ├── create/
│   │   │   │   └── page.tsx        # Create solution page
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx        # Solution detail page
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx    # Edit solution page
│   │   │   └── layout.tsx          # Solutions layout
│   │   │
│   │   └── api/
│   │       └── (optional NextJS routes)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top navigation header
│   │   │   ├── Navbar.tsx          # Mobile navbar
│   │   │   └── Footer.tsx          # Footer component
│   │   │
│   │   ├── form/
│   │   │   ├── SolutionForm.tsx    # Create/edit solution form
│   │   │   └── SearchBar.tsx       # Search input component
│   │   │
│   │   ├── solution/
│   │   │   ├── SolutionCard.tsx    # Solution display card
│   │   │   ├── SolutionDetail.tsx  # Full solution view
│   │   │   └── SolutionList.tsx    # List of solutions
│   │   │
│   │   ├── search/
│   │   │   ├── SearchResults.tsx   # Search results display
│   │   │   └── ResultCard.tsx      # Individual result card
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.tsx  # Statistics widget
│   │   │   ├── RecentSolutions.tsx # Recent solutions timeline
│   │   │   └── LanguageChart.tsx   # Language breakdown chart
│   │   │
│   │   └── ui/
│   │       ├── button.tsx          # shadcn button
│   │       ├── input.tsx           # shadcn input
│   │       ├── textarea.tsx        # shadcn textarea
│   │       ├── card.tsx            # shadcn card
│   │       ├── dialog.tsx          # shadcn dialog
│   │       ├── select.tsx          # shadcn select
│   │       ├── badge.tsx           # shadcn badge
│   │       ├── spinner.tsx         # Loading spinner
│   │       └── ...                 # Other shadcn components
│   │
│   ├── lib/
│   │   ├── types.ts                # TypeScript interfaces
│   │   ├── api.ts                  # API client functions
│   │   ├── validators.ts           # Zod validation schemas
│   │   ├── utils.ts                # Utility functions
│   │   ├── constants.ts            # App constants
│   │   └── errors.ts               # Error handling utilities
│   │
│   ├── hooks/
│   │   ├── useSolutions.ts         # Solutions data hooks
│   │   ├── useSearch.ts            # Search functionality hook
│   │   ├── usePagination.ts        # Pagination hook
│   │   ├── useDashboard.ts         # Dashboard data hook
│   │   └── useAsync.ts             # Generic async hook
│   │
│   ├── styles/
│   │   ├── globals.css             # Global styles
│   │   ├── variables.css           # CSS variables
│   │   └── animations.css          # Reusable animations
│   │
│   ├── context/
│   │   └── AppContext.tsx          # Global app context
│   │
│   └── providers/
│       └── Providers.tsx           # App providers (TanStack Query, etc)
│
├── public/
│   ├── favicon.ico                 # Favicon
│   ├── logo.svg                    # Logo
│   └── ...                         # Other static assets
│
└── __tests__/
    ├── components/
    │   ├── SolutionCard.test.tsx
    │   └── SearchBar.test.tsx
    ├── hooks/
    │   ├── useSolutions.test.ts
    │   └── useSearch.test.ts
    ├── lib/
    │   ├── api.test.ts
    │   └── validators.test.ts
    └── fixtures/
        └── mockData.ts             # Mock data for tests
```

---

## Part 2: File Responsibilities

### Backend Structure

#### Root Files
- **main.py** - FastAPI application initialization, middleware setup, router registration
- **config.py** - Environment variables, settings management, configuration
- **requirements.txt** - Python package dependencies and versions

#### app/models.py (Pydantic)
- `SolutionCreate` - Request model for creating solutions
- `SolutionUpdate` - Request model for updating solutions
- `SolutionResponse` - Response model for solutions
- `SearchResult` - Individual search result with similarity
- `SearchResponse` - Search endpoint response
- `DashboardStats` - Dashboard statistics model

#### app/database.py
- `engine` - SQLAlchemy database engine
- `SessionLocal` - Session factory
- `init_db()` - Database initialization function
- `get_db()` - Dependency injection for database session

#### app/schemas.py (SQLAlchemy)
- `Base` - Declarative base for ORM models
- `Solution` - Solutions table ORM model with all columns and constraints

#### app/routers/health.py
- `GET /health` - Health check endpoint, database connectivity check

#### app/routers/solutions.py
- `POST /api/solutions` - Create new solution
- `GET /api/solutions` - List all solutions with filters/pagination
- `GET /api/solutions/{id}` - Get single solution
- `PUT /api/solutions/{id}` - Update solution
- `DELETE /api/solutions/{id}` - Archive/soft-delete solution

#### app/routers/search.py
- `GET /api/search` - Semantic search with vector similarity

#### app/services/embedding.py
- `generate_embedding()` - Single text embedding generation
- `batch_generate_embeddings()` - Batch embedding generation

#### app/services/solution.py
- Repository/service methods for solution operations (optional, if added)

#### app/services/search.py
- Search algorithm implementation (optional, if added)

#### tests/
- Pytest test files for all endpoints and services
- Fixtures for test data and database setup

### Frontend Structure

#### app/ (Next.js Pages)
- **layout.tsx** - Root layout with metadata, providers setup
- **page.tsx** - Home/landing page
- **dashboard/page.tsx** - Statistics and recent solutions
- **search/page.tsx** - Search results display
- **solution/page.tsx** - Solutions list/browse
- **solution/create/page.tsx** - Create new solution form
- **solution/[id]/page.tsx** - Solution detail view
- **solution/[id]/edit/page.tsx** - Edit solution form

#### components/layout/
- **Header.tsx** - Top navigation, logo, links
- **Navbar.tsx** - Mobile responsive navbar
- **Footer.tsx** - Footer with links and info

#### components/form/
- **SolutionForm.tsx** - Reusable form for create/edit
- **SearchBar.tsx** - Search input with debouncing

#### components/solution/
- **SolutionCard.tsx** - Compact solution preview
- **SolutionDetail.tsx** - Full solution view with code
- **SolutionList.tsx** - List of solutions

#### components/search/
- **SearchResults.tsx** - Search results container
- **ResultCard.tsx** - Individual result item

#### components/dashboard/
- **DashboardStats.tsx** - Statistics cards
- **RecentSolutions.tsx** - Recent solutions timeline
- **LanguageChart.tsx** - Language breakdown visualization

#### components/ui/
- Shadcn/ui component library components
- Each component handles its own styling and logic

#### lib/
- **types.ts** - All TypeScript interfaces (Solution, SearchResult, etc)
- **api.ts** - API client with solutionsApi, searchApi, dashboardApi objects
- **validators.ts** - Zod schemas for form validation
- **utils.ts** - Utility functions (formatDate, truncate, etc)
- **constants.ts** - App-wide constants (URLs, limits, etc)
- **errors.ts** - Error handling utilities

#### hooks/
- **useSolutions.ts** - useQuery hooks for solutions CRUD
- **useSearch.ts** - Search with debouncing logic
- **usePagination.ts** - Pagination state management
- **useDashboard.ts** - Dashboard data fetching
- **useAsync.ts** - Generic async operation hook

#### __tests__/
- Jest/Vitest tests with React Testing Library
- Component tests, hook tests, utility tests
- Mock data and fixtures for testing

---

## Part 3: Import Patterns

### Backend Imports

```python
# app/routers/solutions.py

# Standard library (first)
from typing import List, Optional
from datetime import datetime

# Third-party packages (second)
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

# Local imports (third)
from app.config import settings
from app.database import get_db
from app.schemas import Solution
from app.models import SolutionCreate, SolutionResponse
from app.services.embedding import generate_embedding
```

### Frontend Imports

```typescript
// app/page.tsx

// React & Next.js (first)
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// External libraries (second)
import { useQuery } from '@tanstack/react-query';

// Components (third)
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/form/search-bar';

// Utilities & hooks (fourth)
import { solutionsApi } from '@/lib/api';
import type { Solution } from '@/lib/types';
import { useSolutions } from '@/hooks/use-solutions';
```

---

## Part 4: Module Responsibilities

### Core Modules (Shouldn't Mix)

```
✅ GOOD separation:
├─ Data Layer (database.py, schemas.py)
├─ Business Logic (services/*, routers/*)
└─ Presentation (API responses, validation models)

❌ BAD: Mixing
├─ Database logic in routers
├─ Business logic in schemas
└─ API responses in database models
```

### Frontend Module Responsibilities

```
✅ Clear responsibility:
├─ lib/api.ts: Only API calls (fetch, error handling)
├─ hooks/use*.ts: Data fetching and state (useQuery)
├─ components/*.tsx: UI rendering only
└─ pages/*.tsx: Page layout and composition

❌ Bad pattern:
├─ Components doing API calls directly
├─ Hooks with complex UI logic
├─ Pages with business logic
└─ api.ts with state management
```

---

## Part 5: Asset Organization

### Images & Static Files

```
public/
├── images/
│   ├── logo.svg              # Main logo
│   ├── hero.jpg              # Hero image
│   ├── icons/                # Icon set
│   │   ├── search.svg
│   │   ├── settings.svg
│   │   └── ...
│   └── backgrounds/
│       ├── gradient.svg
│       └── pattern.svg
│
├── docs/
│   ├── API.md
│   └── FAQ.md
│
└── favicon.ico               # Favicon
```

### Font Files (if needed)

```
public/fonts/
├── inter-regular.woff2
├── inter-bold.woff2
└── mono-regular.woff2
```

---

## Part 6: Environment File Organization

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://...
DATABASE_POOL_SIZE=20

# API Server
ENVIRONMENT=development|production
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true|false

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://devdocs.vercel.app

# Embedding
EMBEDDING_MODEL=all-MiniLM-L6-v2
EMBEDDING_DIMENSION=384

# Logging (optional)
LOG_LEVEL=INFO
```

### Frontend (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=

# Feature flags (optional)
NEXT_PUBLIC_ENABLE_ADVANCED_SEARCH=true
```

---

## Part 7: Git Directory Structure

```
devdocs-backend/ (separate repo)
└── .git/
    └── (version history)

devdocs-frontend/ (separate repo)
└── .git/
    └── (version history)

devdocs/ (main documentation repo)
└── .git/
    └── (version history)
```

**Repository Organization:**

```
GitHub Organization: devdocs-project

Repositories:
├── devdocs-docs (this documentation)
├── devdocs-backend (Python/FastAPI backend)
├── devdocs-frontend (Next.js frontend)
└── devdocs-infra (Infrastructure as Code - terraform, docker, etc)
```

---

## Part 8: Deployment Folder Structure

### After Deployment

```
Vercel (Frontend)
├── Production: https://devdocs.vercel.app
├── Staging: https://staging-devdocs.vercel.app
└── Preview: PR-specific previews

Render (Backend)
├── Production: https://devdocs-api.render.com
└── Staging: https://staging-devdocs-api.render.com

Supabase (Database)
├── Production Database
└── Staging Database (optional)
```

---

## Part 9: Best Practices

### DO:

✅ Keep modules focused and single-purpose
✅ Organize by feature/domain (solutions/, search/)
✅ Use clear, descriptive names
✅ Group related functionality together
✅ Keep tests alongside code
✅ Use consistent folder depth

### DON'T:

❌ Create overly nested folder structures (max 4 levels)
❌ Mix different concerns in one module
❌ Use abbreviations for folder names
❌ Create "utils" folder with everything (be specific)
❌ Separate tests in distant folder
❌ Use plural/singular inconsistently

---

## Document Version & Status

- **Version:** 1.0
- **Last Updated:** December 2024
- **Status:** Ready to Use

---

**This structure ensures scalability, maintainability, and clear separation of concerns! 📁**