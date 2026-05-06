"""
DevDocs Backend - Bookmark Model
SQLAlchemy model for bookmarks table
"""

from sqlalchemy import Column, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Bookmark(Base):
    """
    Bookmark model - stores user bookmarks for solutions
    
    Matches the database schema created in 08_create_bookmarks.sql
    """
    __tablename__ = "bookmarks"
    
    # Primary key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid()
    )
    
    # Foreign keys
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    
    solution_id = Column(
        UUID(as_uuid=True),
        ForeignKey('solutions.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    
    # Timestamps
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )
    
    # Unique constraint to prevent duplicate bookmarks
    __table_args__ = (
        UniqueConstraint('user_id', 'solution_id', name='unique_user_solution'),
    )
    
    def __repr__(self):
        return f"<Bookmark(id={self.id}, user_id={self.user_id}, solution_id={self.solution_id})>"
