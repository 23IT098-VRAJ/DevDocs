"""
Gemini AI Service — uses the current google-genai SDK (v1.x)

Provides two features:
  1. suggest_tags()           — Auto-tag a solution with 3-6 relevant tags
  2. generate_answer_stream() — Stream an AI answer synthesised from search results
"""
import json
import re
from typing import AsyncIterator, List

from app.config import settings
from app.logger import get_logger

logger = get_logger(__name__)

_client = None  # google.genai.Client


def init_gemini() -> None:
    """Configure Gemini client. Called once at startup."""
    global _client
    if not settings.GEMINI_API_KEY:
        logger.warning("⚠️  GEMINI_API_KEY not set — AI tagging and answer features disabled")
        return
    try:
        from google import genai  # type: ignore
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
        logger.info("✅ Gemini 2.0 Flash ready (google-genai SDK)")
    except Exception as e:
        logger.error(f"❌ Gemini init failed: {e}")
        _client = None


def is_available() -> bool:
    return _client is not None


_MODEL = "gemini-2.0-flash"


# ─────────────────────────────────────────────────────────────────────────────
# Feature 1 — Smart Tag Suggestions
# ─────────────────────────────────────────────────────────────────────────────

async def suggest_tags(
    title: str,
    description: str,
    code: str,
    existing_user_tags: List[str],
) -> List[str]:
    """
    Ask Gemini to suggest 3-6 relevant tags for a code solution.

    existing_user_tags — tags already used in the user's library, so suggestions
    are consistent with their existing taxonomy.
    """
    if _client is None:
        return []

    code_preview = code[:800] if code else ""
    existing = ", ".join(existing_user_tags[:40]) if existing_user_tags else "none"

    prompt = f"""You are a code tagging assistant for a developer's personal knowledge base.
Suggest 3-6 concise, lowercase tags for the solution below.

Rules:
- Tags must be short (1-3 words), lowercase, hyphenated if multi-word
- Prefer specific over generic (e.g. "react-hooks" not "react")
- Reuse existing tags from the user's library when relevant
- Cover: language/framework, concept, pattern, and use-case where possible

Title: {title}
Description: {description}
Code (first 800 chars):
{code_preview}

User's existing tags (prefer these when relevant): {existing}

Reply with ONLY a valid JSON array of strings, nothing else.
Example: ["async-await", "error-handling", "python", "decorator"]"""

    try:
        response = await _client.aio.models.generate_content(  # type: ignore
            model=_MODEL,
            contents=prompt,
        )
        raw = response.text.strip()
        # Strip markdown code fences if present
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
        tags = json.loads(raw.strip())
        return [str(t).lower().strip() for t in tags if t][:8]
    except Exception as e:
        logger.error(f"Tag suggestion failed: {e}")
        return []


# ─────────────────────────────────────────────────────────────────────────────
# Feature 2 — AI Answer (Streaming)
# ─────────────────────────────────────────────────────────────────────────────

async def generate_answer_stream(
    query: str,
    results: List[dict],
) -> AsyncIterator[str]:
    """
    Stream a synthesised AI answer from the top semantic search results.
    Each yielded string is a text chunk — send directly as SSE / plain stream.
    """
    if _client is None:
        yield "_AI answers are unavailable (GEMINI_API_KEY not configured)._"
        return

    if not results:
        yield "_No relevant solutions found in your library to answer this query._"
        return

    # Build context from top 5 results
    context_parts: List[str] = []
    for i, r in enumerate(results[:5], 1):
        sol = r.get("solution", r)
        tags_str = ", ".join(sol.get("tags", [])) or "—"
        code_preview = (sol.get("code") or "")[:600]
        context_parts.append(
            f"### [{i}] {sol.get('title', 'Untitled')}\n"
            f"**Language:** {sol.get('language', '?')}  |  **Tags:** {tags_str}\n"
            f"**Description:** {sol.get('description', '')}\n"
            f"```{sol.get('language', '')}\n{code_preview}\n```"
        )

    context = "\n\n---\n\n".join(context_parts)

    prompt = f"""You are DevDocs AI — a helpful assistant that answers developer questions \
using their own personal code library.

**Developer's query:** {query}

**Relevant solutions from their library:**

{context}

---

Answer the query concisely and technically:
1. Directly address what they searched for
2. Reference the numbered solutions above when relevant (e.g. "Solution [2] shows…")
3. Highlight key patterns, gotchas, or techniques
4. Keep it scannable with markdown (bold, inline code, short bullets)
5. If multiple solutions are relevant, compare or combine them

Do not hallucinate code — only reference what is shown above."""

    try:
        async for chunk in await _client.aio.models.generate_content_stream(  # type: ignore
            model=_MODEL,
            contents=prompt,
        ):
            if chunk.text:
                yield chunk.text
    except Exception as e:
        logger.error(f"Gemini answer stream failed: {e}")
        yield f"\n\n_AI answer unavailable: {e}_"
