"""
Gemini AI Service - uses the current google-genai SDK (v1.x)

Provides:
  generate_answer_stream() - Stream an AI answer synthesised from search results
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
        logger.warning("GEMINI_API_KEY not set - AI answer feature disabled")
        return
    try:
        from google import genai  # type: ignore
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
        logger.info(f"✅ Gemini ready (google-genai SDK, model={settings.GEMINI_MODEL})")
    except Exception as e:
        logger.error(f"❌ Gemini init failed: {e}")
        _client = None


def is_available() -> bool:
    return _client is not None


_FALLBACK_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
]


def _candidate_models() -> List[str]:
    """Return configured model followed by known fallbacks (deduplicated)."""
    preferred = (settings.GEMINI_MODEL or "").strip()
    ordered = [preferred, *_FALLBACK_MODELS]
    seen = set()
    models: List[str] = []
    for model in ordered:
        if model and model not in seen:
            models.append(model)
            seen.add(model)
    return models


# ─────────────────────────────────────────────────────────────────────────────
# AI Answer (Streaming)
# ─────────────────────────────────────────────────────────────────────────────

async def generate_answer_stream(
    query: str,
    results: List[dict],
) -> AsyncIterator[str]:
    """
    Stream a synthesised AI answer from the top semantic search results.
    Each yielded string is a text chunk - send directly as SSE / plain stream.
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

    last_error: Exception | None = None

    for model_name in _candidate_models():
        try:
            async for chunk in await _client.aio.models.generate_content_stream(  # type: ignore
                model=model_name,
                contents=prompt,
            ):
                if chunk.text:
                    yield chunk.text

            # Stream completed successfully, stop trying fallbacks.
            return
        except Exception as e:
            last_error = e
            msg = str(e)
            if "404" in msg or "NOT_FOUND" in msg:
                logger.warning(f"Gemini model unavailable ({model_name}); trying fallback")
                continue
            logger.error(f"Gemini answer stream failed with model {model_name}: {e}")
            continue

    if last_error is not None:
        logger.error(f"Gemini answer stream failed after all model attempts: {last_error}")
        yield f"\n\n_AI answer unavailable: {last_error}_"


# ─────────────────────────────────────────────────────────────────────────────
# Solution Explanation (Streaming)
# ─────────────────────────────────────────────────────────────────────────────

async def explain_solution_stream(
    solution: dict,
) -> AsyncIterator[str]:
    """
    Stream a simple, concise explanation of how a specific solution works.
    Focuses on: what problem it solves, how the code works, and key techniques.
    """
    if _client is None:
        yield "_Explanations are unavailable (GEMINI_API_KEY not configured)._"
        return

    title = solution.get("title", "Untitled")
    description = solution.get("description", "")
    code = solution.get("code", "")
    language = solution.get("language", "")
    tags = solution.get("tags", [])

    tags_str = ", ".join(tags) or "—"
    
    prompt = f"""You are DevDocs Explainer — a code explanation assistant.

**Solution:** {title}
**Language:** {language}
**Tags:** {tags_str}

**Problem Description:**
{description}

**Code Implementation:**
```{language}
{code}
```

---

Provide a **simple and concise** explanation (2-3 short paragraphs):
1. What problem does this solution solve?
2. How does the code solve it? (explain key steps/techniques)
3. What are the main patterns or gotchas to remember?

Use markdown for clarity (bold for key terms, inline code for variables/functions).
Keep language simple and avoid unnecessary jargon."""

    last_error: Exception | None = None

    for model_name in _candidate_models():
        try:
            async for chunk in await _client.aio.models.generate_content_stream(  # type: ignore
                model=model_name,
                contents=prompt,
            ):
                if chunk.text:
                    yield chunk.text

            # Stream completed successfully, stop trying fallbacks.
            return
        except Exception as e:
            last_error = e
            msg = str(e)
            if "404" in msg or "NOT_FOUND" in msg:
                logger.warning(f"Gemini model unavailable ({model_name}); trying fallback")
                continue
            logger.error(f"Gemini explanation stream failed with model {model_name}: {e}")
            continue

    if last_error is not None:
        logger.error(f"Gemini explanation stream failed after all model attempts: {last_error}")
        yield f"\n\n_Explanation unavailable: {last_error}_"
