# DevDocs - Coding Standards & Guidelines

## Executive Summary

This document defines code quality standards for DevDocs development. All contributions should follow these conventions for consistency, maintainability, and collaboration.

---

## Part 1: General Principles

### Code Quality Goals

1. **Readability** - Clear, self-documenting code
2. **Maintainability** - Easy to modify and extend
3. **Performance** - Optimized without sacrificing clarity
4. **Security** - Proper input validation and error handling
5. **Testing** - Comprehensive test coverage
6. **Consistency** - Uniform style across codebase

### File Organization

```
Clear naming
├─ Files: kebab-case (my-component.tsx)
├─ Directories: kebab-case (components/)
├─ Classes: PascalCase (MyClass)
├─ Functions: camelCase (myFunction)
└─ Constants: UPPER_SNAKE_CASE (MAX_RETRIES)
```

---

## Part 2: Backend Code Standards (Python/FastAPI)

### File Organization

```python
# 1. Imports (organized by type)
from typing import List, Optional
from datetime import datetime

from sqlalchemy import Column, String
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.config import settings
from app.database import get_db
from app.schemas import Solution

# 2. Constants
DEFAULT_LIMIT = 10
MAX_LIMIT = 100

# 3. Models/Classes
class SolutionCreate(BaseModel):
    pass

# 4. Functions/Routes
@router.get("/")
async def list_solutions():
    pass
```

### Naming Conventions

**Python/Backend:**

```python
# Functions and methods: snake_case
def calculate_embedding_dimension():
    pass

# Classes: PascalCase
class SolutionRepository:
    pass

# Constants: UPPER_SNAKE_CASE
MAX_EMBEDDING_DIMENSION = 384
DEFAULT_SEARCH_LIMIT = 5

# Private methods: _leading_underscore
def _validate_input(data):
    pass

# Database query helper: query_* for selection, get_* for single items
def query_solutions_by_language(db, language):
    return db.query(Solution).filter(Solution.language == language)

def get_solution_by_id(db, id):
    return db.query(Solution).filter(Solution.id == id).first()
```

### Type Hints (Always Use)

```python
# ✅ GOOD: Type hints everywhere
def create_solution(
    solution_data: SolutionCreate,
    db: Session = Depends(get_db)
) -> SolutionResponse:
    """Create a new solution and return response."""
    # implementation
    pass

# ❌ BAD: No type hints
def create_solution(solution_data, db):
    # implementation
    pass

# Complex types
from typing import List, Dict, Optional, Tuple

def search_solutions(
    query: str,
    filters: Dict[str, str],
    limit: int = 10
) -> List[SearchResult]:
    """Search with filters."""
    pass

def get_or_create(
    db: Session,
    id: str
) -> Tuple[Solution, bool]:
    """Returns (solution, is_new)."""
    pass
```

### Docstrings

```python
# ✅ GOOD: Clear docstring with parameters and return type
def generate_embedding(text: str) -> List[float]:
    """Generate vector embedding for text using sentence-transformers.
    
    Args:
        text: Input text to embed (max 10,000 characters)
    
    Returns:
        List of 384 float values representing the embedding
        
    Raises:
        ValueError: If text is empty or exceeds length limit
        
    Example:
        >>> embedding = generate_embedding("How to fix CORS")
        >>> len(embedding)
        384
    """
    if not text.strip():
        raise ValueError("Text cannot be empty")
    if len(text) > 10000:
        text = text[:10000]
    
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()

# Endpoint docstrings (shorter is OK)
@router.post("/solutions", status_code=201)
async def create_solution(
    solution: SolutionCreate,
    db: Session = Depends(get_db)
) -> SolutionResponse:
    """Create a new solution with automatic embedding generation."""
    # implementation
    pass
```

### Error Handling

```python
# ✅ GOOD: Specific exceptions with clear messages
@router.get("/solutions/{id}")
async def get_solution(id: str, db: Session = Depends(get_db)):
    """Get solution by ID."""
    solution = db.query(Solution).filter(Solution.id == id).first()
    
    if not solution:
        raise HTTPException(
            status_code=404,
            detail=f"Solution with id={id} not found"
        )
    
    if solution.is_archived:
        raise HTTPException(
            status_code=410,  # Gone
            detail="This solution has been archived"
        )
    
    return solution

# ❌ BAD: Vague error messages
@router.get("/solutions/{id}")
async def get_solution(id: str, db: Session = Depends(get_db)):
    solution = db.query(Solution).filter(Solution.id == id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Not found")
    return solution

# ✅ GOOD: Database error handling
try:
    db.commit()
except IntegrityError as e:
    db.rollback()
    raise HTTPException(
        status_code=409,
        detail="Solution with this title already exists"
    )
except OperationalError as e:
    db.rollback()
    raise HTTPException(
        status_code=503,
        detail="Database connection failed"
    )
```

### Validation

```python
# Use Pydantic for all inputs
from pydantic import BaseModel, Field, field_validator

class SolutionCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20, max_length=2000)
    code: str = Field(..., min_length=10, max_length=5000)
    language: str = Field(..., min_length=2, max_length=50)
    tags: List[str] = Field(default=[], max_length=10)
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        """Ensure all tags are lowercase and unique."""
        tags = [tag.strip().lower() for tag in v if tag.strip()]
        return list(dict.fromkeys(tags))  # Remove duplicates
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        """Ensure title doesn't contain only whitespace."""
        if not v.strip():
            raise ValueError("Title cannot be empty or whitespace only")
        return v.strip()

# Database validation happens at both layers
```

### Logging

```python
import logging

logger = logging.getLogger(__name__)

# ✅ GOOD: Structured logging
logger.info(f"Created solution: id={solution.id}, title={solution.title}")
logger.warning(f"Large query detected: {query_size} results")
logger.error(f"Database error: {error}", exc_info=True)

# ❌ BAD: Vague logging
logger.info("Something happened")
logger.error("Error occurred")
```

### Performance Considerations

```python
# ✅ GOOD: Efficient database queries
# Use select() to specify columns needed
solutions = db.query(Solution.id, Solution.title).filter(
    Solution.is_archived == False
).limit(10).all()

# ✅ GOOD: Batch operations
embeddings = batch_generate_embeddings(texts)  # More efficient

# ❌ BAD: N+1 queries (loading entire objects)
solutions = db.query(Solution).filter(
    Solution.is_archived == False
).limit(10).all()

# ❌ BAD: Loop-based embedding generation
for text in texts:
    embedding = generate_embedding(text)  # Slow
```

### Testing

```python
# Test file naming: test_*.py or *_test.py
# tests/test_solutions.py

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# ✅ GOOD: Clear test names and structure
def test_create_solution_success():
    """Test successful solution creation."""
    response = client.post("/api/solutions", json={
        "title": "Fix CORS",
        "description": "How to enable CORS in FastAPI",
        "code": "app.add_middleware(...)",
        "language": "Python",
        "tags": ["cors"]
    })
    
    assert response.status_code == 201
    assert response.json()["title"] == "Fix CORS"
    assert "id" in response.json()

def test_create_solution_validation_error():
    """Test validation error for short title."""
    response = client.post("/api/solutions", json={
        "title": "Fix",  # Too short
        "description": "How to enable CORS in FastAPI",
        "code": "app.add_middleware(...)",
        "language": "Python"
    })
    
    assert response.status_code == 422
    assert "title" in response.json()["detail"][0]["loc"]

# ❌ BAD: Vague test names
def test_1():
    pass

def test_post():
    pass
```

---

## Part 3: Frontend Code Standards (TypeScript/React)

### File Organization

```typescript
// 1. Imports (organized)
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import type { Solution } from '@/lib/types';

// 2. Type definitions
interface ComponentProps {
  solution: Solution;
  onSelect?: (id: string) => void;
}

// 3. Component
export function SolutionCard({ solution, onSelect }: ComponentProps) {
  // implementation
}
```

### Naming Conventions

**TypeScript/Frontend:**

```typescript
// Components: PascalCase
function MyComponent() {}
const MyComponent = () => {}

// Files: kebab-case
// components/solution-card.tsx
// hooks/use-solutions.ts

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;

// Functions: camelCase
function handleSubmit() {}
const processData = () => {}

// Boolean variables/getters: is*, has*, should*
const isLoading = true;
const hasError = false;
const shouldRender = true;

// Event handlers: on + PascalCase action
const handleClick = () => {}
const handleSearchChange = () => {}
const onSubmit = () => {}
```

### Type Safety

```typescript
// ✅ GOOD: Strict types everywhere
interface Solution {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  created_at: string;
}

type SolutionResponse = Solution & {
  similarity?: number;
};

function displaySolution(solution: Solution): JSX.Element {
  return <div>{solution.title}</div>;
}

// ❌ BAD: Using 'any'
function displaySolution(solution: any) {
  return <div>{solution.title}</div>;
}

// ✅ GOOD: Optional and union types
interface Props {
  title: string;
  subtitle?: string;
  variant: 'primary' | 'secondary' | 'danger';
}

// ✅ GOOD: Generic types
function useApi<T>(url: string): { data?: T; isLoading: boolean } {
  // implementation
}
```

### React Component Standards

```typescript
// ✅ GOOD: Functional component with TypeScript
'use client';

import { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const MyButton: FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// ✅ GOOD: Custom hook pattern
function useMyFeature() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);
  
  return { state };
}

// ❌ BAD: Inline logic (moves to custom hook if repeated)
function MyComponent() {
  const [state, setState] = useState(null);
  useEffect(() => {
    // Complex logic here
  }, []);
  // ... more complex code
}
```

### CSS/Tailwind Standards

```typescript
// ✅ GOOD: Organized class names
<div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <Button variant="primary">Action</Button>
</div>

// ✅ GOOD: Conditional classes with clsx
import clsx from 'clsx';

function Card({ highlight }: { highlight?: boolean }) {
  return (
    <div className={clsx(
      'p-4 rounded-lg',
      highlight ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'
    )}>
      Content
    </div>
  );
}

// ✅ GOOD: Component-level styling
const cardStyles = {
  container: 'flex items-center gap-4 p-4',
  title: 'text-lg font-semibold',
  button: 'px-4 py-2 bg-blue-600 text-white rounded'
};

// ❌ BAD: Inline style objects (use Tailwind)
<div style={{ display: 'flex', padding: '16px' }}>
```

### Error Handling (Frontend)

```typescript
// ✅ GOOD: Proper error handling with types
async function fetchSolutions() {
  try {
    const response = await fetch('/api/solutions');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      console.error('Network error:', error.message);
    } else if (error instanceof Error) {
      // Other error
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// ✅ GOOD: React Query error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['solutions'],
  queryFn: fetchSolutions,
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (error instanceof Error) {
  return <div className="text-red-600">Error: {error.message}</div>;
}

// ❌ BAD: Silent error swallowing
const response = await fetch('/api/solutions');
const data = await response.json();  // Could fail if response not ok
```

### Testing Frontend

```typescript
// Use Vitest + React Testing Library
// __tests__/solution-card.test.tsx

import { render, screen } from '@testing-library/react';
import { SolutionCard } from '@/components/solution-card';

describe('SolutionCard', () => {
  // ✅ GOOD: Clear test names
  it('displays solution title', () => {
    const solution = {
      id: '1',
      title: 'Test Solution',
      code: 'const x = 1;',
      language: 'JavaScript',
      tags: [],
      created_at: '2024-01-01',
    };

    render(<SolutionCard solution={solution} />);
    
    expect(screen.getByText('Test Solution')).toBeInTheDocument();
  });

  // ✅ GOOD: User-focused testing
  it('calls onSelect when clicked', async () => {
    const handleSelect = vi.fn();
    const solution = { /* ... */ };

    const { user } = render(
      <SolutionCard solution={solution} onSelect={handleSelect} />
    );
    
    await user.click(screen.getByRole('button'));
    expect(handleSelect).toHaveBeenCalledWith('1');
  });
});
```

---

## Part 4: Database Standards (SQL/PostgreSQL)

### Query Standards

```sql
-- ✅ GOOD: Clear, readable queries
SELECT 
    id,
    title,
    language,
    created_at
FROM solutions
WHERE is_archived = FALSE
  AND language = $1
ORDER BY created_at DESC
LIMIT $2;

-- ✅ GOOD: Use prepared statements (prevent SQL injection)
-- In code: db.query(query, [language, limit])

-- ❌ BAD: String concatenation (SQL injection risk)
query = f"SELECT * FROM solutions WHERE language = '{language}'"

-- ❌ BAD: SELECT * (fetch only needed columns)
SELECT * FROM solutions;
```

### Migration Standards

```sql
-- Use descriptive names: YYYY-MM-DD_description.sql
-- 2024-01-15_create_solutions_table.sql

-- Always include rollback comments
-- UP
CREATE TABLE solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    -- ...
);

-- DOWN
DROP TABLE IF EXISTS solutions;

-- Include index creation
CREATE INDEX idx_solutions_language ON solutions(language);

-- Document complex migrations
-- Migration reason: Improve search performance for popular languages
```

---

## Part 5: Git & Commit Standards

### Commit Messages

```bash
# ✅ GOOD: Clear, descriptive
git commit -m "feat: Add semantic search with vector embeddings"
git commit -m "fix: Handle CORS errors in FastAPI middleware"
git commit -m "refactor: Move embedding logic to service layer"
git commit -m "docs: Add API documentation for search endpoint"

# ❌ BAD: Vague
git commit -m "Update stuff"
git commit -m "Fix bug"
git commit -m "WIP"

# Format: <type>: <description>
# Types: feat, fix, refactor, docs, test, style, perf, chore
```

### Pull Request Standards

```markdown
# Example PR description

## Description
Added semantic search functionality using sentence-transformers embeddings

## Changes
- Generated vector embeddings for all solutions
- Created `/api/search` endpoint with cosine similarity search
- Added IVFFLAT index for fast vector search
- Implemented 300ms debouncing on frontend

## Testing
- Added 5 new backend tests
- Tested with 1000+ solutions
- Verified search performance <200ms

## Related Issues
Closes #42

## Checklist
- [x] Code follows style guide
- [x] Tests pass
- [x] Documentation updated
- [x] No breaking changes
```

---

## Part 6: Code Review Checklist

**For Pull Request Authors:**

- [ ] Code follows standards in this document
- [ ] Meaningful commit messages
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No console warnings/errors
- [ ] No secrets in code (.env values)

**For Code Reviewers:**

- [ ] Follows coding standards
- [ ] Logic is correct and efficient
- [ ] Error handling is appropriate
- [ ] Tests are comprehensive
- [ ] Documentation is clear
- [ ] No performance regressions
- [ ] Security best practices followed

---

## Part 7: Common Anti-Patterns to Avoid

### Backend

```python
# ❌ Anti-pattern 1: No error handling
def search(query):
    results = db.query(Solution).all()
    return results

# ✅ Better:
def search(query: str) -> List[Solution]:
    """Search solutions by query."""
    if not query.strip():
        raise ValueError("Query cannot be empty")
    
    try:
        embedding = generate_embedding(query)
        results = db.query(Solution).filter(...).all()
        return results
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

# ❌ Anti-pattern 2: Circular imports
# In models.py
from schemas import Solution  # Which imports from models.py

# ✅ Better: Use TYPE_CHECKING
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from schemas import Solution
```

### Frontend

```typescript
// ❌ Anti-pattern 1: useEffect without cleanup
useEffect(() => {
  fetch('/api/solutions').then(r => r.json()).then(setData);
}, []);  // No cleanup, multiple requests on re-mount

// ✅ Better: With cleanup
useEffect(() => {
  let isMounted = true;
  
  fetch('/api/solutions')
    .then(r => r.json())
    .then(data => {
      if (isMounted) setData(data);
    });
  
  return () => {
    isMounted = false;
  };
}, []);

// ❌ Anti-pattern 2: Prop drilling
function App() {
  const [data, setData] = useState();
  return <Level1 data={data} />;  // Passed through multiple levels
}

// ✅ Better: Use Context or state management
const DataContext = createContext();

function App() {
  const [data, setData] = useState();
  return (
    <DataContext.Provider value={data}>
      <Level1 />
    </DataContext.Provider>
  );
}
```

---

## Document Version & Status

- **Version:** 1.0
- **Last Updated:** December 2024
- **Status:** Ready to Use

---

**Follow these standards to keep DevDocs clean, maintainable, and professional! 🎯**