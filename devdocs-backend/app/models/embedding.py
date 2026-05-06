"""
DevDocs Backend - Embedding Service using Sentence Transformers
"""
from sentence_transformers import SentenceTransformer  # type: ignore
from typing import List, Optional, Any
import asyncio
import concurrent.futures

from app.config import settings

# Pre-allocated thread pool — avoids spawning a new thread on every encode call.
# max_workers=4 matches typical 4-core dev machines; tune up for production.
_executor = concurrent.futures.ThreadPoolExecutor(max_workers=4, thread_name_prefix="embed")


class EmbeddingService:
    """
    Singleton service for generating text embeddings using Sentence Transformers
    
    Model: sentence-transformers/all-mpnet-base-v2 (768 dimensions)
    - High-quality general-purpose embeddings
    - Better performance than MiniLM with same speed as code models
    - Excellent for semantic search across natural language and code
    """
    
    _instance: Optional["EmbeddingService"] = None
    _model: Optional[Any] = None
    _model_loaded: bool = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._model is None:
            try:
                print(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
                self._model = SentenceTransformer(
                    settings.EMBEDDING_MODEL,
                    cache_folder=settings.MODEL_CACHE_DIR
                )
                self._model_loaded = True
                print(f"✅ Model loaded! Dimensions: {self._model.get_sentence_embedding_dimension()}")  # type: ignore
            except Exception as e:
                print(f"⚠️ Warning: Failed to load embedding model: {e}")
                print("⚠️ Semantic search will fall back to keyword-based search")
                self._model_loaded = False
    
    @classmethod
    def get_instance(cls) -> "EmbeddingService":
        """Get or create singleton instance"""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    @classmethod
    def is_available(cls) -> bool:
        """Check if embedding model is loaded and available"""
        instance = cls.get_instance()
        return instance._model_loaded
    
    def generate_embedding(self, text: str) -> List[float] | None:
        """
        Generate embedding vector for a single text
        
        Args:
            text: Input text (title + description + code snippet)
        
        Returns:
            List of floats (768 dimensions) or None if model not loaded
        """
        if not self._model_loaded or self._model is None:
            return None
        
        if not text or not text.strip():
            # Return zero vector for empty text
            return [0.0] * settings.EMBEDDING_DIMENSION
        
        # Generate embedding
        embedding = self._model.encode(text, convert_to_numpy=True)  # type: ignore
        
        # Convert to list of floats
        return embedding.tolist()  # type: ignore

    async def generate_embedding_async(self, text: str) -> List[float] | None:
        """
        Non-blocking wrapper for generate_embedding().
        Runs model.encode() in the pre-allocated thread pool so the
        FastAPI async event loop is never blocked by CPU-bound inference.
        """
        if not self._model_loaded or self._model is None:
            return None

        if not text or not text.strip():
            return [0.0] * settings.EMBEDDING_DIMENSION

        loop = asyncio.get_running_loop()
        embedding = await loop.run_in_executor(
            _executor,
            lambda: self._model.encode(  # type: ignore
                text,
                convert_to_numpy=True,
                normalize_embeddings=True,
            )
        )
        return embedding.tolist()  # type: ignore

    async def generate_embeddings_batch_async(self, texts: List[str]) -> List[List[float]]:
        """Non-blocking batch embedding — offloads to thread pool."""
        if not texts:
            return []
        texts = [t if t and t.strip() else " " for t in texts]
        loop = asyncio.get_running_loop()
        embeddings = await loop.run_in_executor(
            _executor,
            lambda: self._model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)  # type: ignore
        )
        return embeddings.tolist()  # type: ignore

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (batch processing for efficiency)
        
        Args:
            texts: List of input texts
        
        Returns:
            List of embedding vectors
        """
        if not texts:
            return []
        
        # Handle empty texts
        texts = [t if t and t.strip() else " " for t in texts]
        
        # Generate embeddings in batch (more efficient)
        embeddings = self._model.encode(texts, convert_to_numpy=True)  # type: ignore
        
        # Convert to list of lists
        return embeddings.tolist()  # type: ignore
    
    def create_solution_text(self, title: str, description: str, code: str, tags: list[str] = []) -> str:
        """
        Combine solution fields into a single text for embedding generation
        
        Args:
            title: Solution title
            description: Solution description
            code: Code snippet (truncated to first 1500 chars for better context)
            tags: List of tags
        
        Returns:
            Combined text for embedding
        """
        # Truncate code to avoid very long embeddings (increased from 500 to 1500)
        code_preview = code[:1500] if code else ""
        tags_str = ", ".join(tags) if tags else ""
        
        # Combine with clear separators
        combined = f"Title: {title}\n\nTags: {tags_str}\n\nDescription: {description}\n\nCode:\n{code_preview}"
        
        return combined


# Global instance
embedding_service = EmbeddingService.get_instance()
