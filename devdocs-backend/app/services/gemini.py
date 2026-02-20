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
        logger.info("✅ Gemini 2.0 Flash ready (google-genai SDK)")
    except Exception as e:
        logger.error(f"❌ Gemini init failed: {e}")
        _client = None


def is_available() -> bool:
    return _client is not None


_MODEL = "gemini-2.0-flash"


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
