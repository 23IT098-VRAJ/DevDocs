"""
DevDocs Backend - Solution SQLAlchemy Model
"""
from sqlalchemy import Column, String, Text, ARRAY, Boolean, TIMESTAMP, CheckConstraint, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
import uuid

from app.database import Base


class Solution(Base):
    """
    Solution model - stores code solutions with semantic search capability
    
    Matches the database schema created in 01_create_tables.sql
    """
    __tablename__ = "solutions"
    
    # Primary key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid()
    )
    
    # Solution content
    title = Column(
        String(200),
        nullable=False,
        index=True
    )
    
    description = Column(
        Text,
        nullable=False
    )
    
    code = Column(
        Text,
        nullable=False
    )
    
    language = Column(
        String(50),
        nullable=False,
        index=True
    )
    
    tags = Column(
        ARRAY(Text),
        nullable=False,
        default=list,
        server_default='{}'
    )
    
    # Vector embedding for semantic search (768 dimensions)
    embedding = Column(
        Vector(768),
        nullable=True
    )
    
    # User relationship (owner of the solution)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )
    
    # Timestamps
    created_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now()
    )
    
    updated_at = Column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )
    
    # Soft delete flag
    is_archived = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default='false'
    )
    
    # Constraints (defined in database, but documented here)
    __table_args__ = (
        CheckConstraint(
            'char_length(title) >= 5 AND char_length(title) <= 200',
            name='solutions_title_length'
        ),
        CheckConstraint(
            'char_length(description) >= 20 AND char_length(description) <= 2000',
            name='solutions_description_length'
        ),
        CheckConstraint(
            'char_length(code) >= 10 AND char_length(code) <= 5000',
            name='solutions_code_length'
        ),
        CheckConstraint(
            'array_length(tags, 1) >= 1',
            name='solutions_tags_not_empty'
        ),
    )
    
    def __repr__(self):
        return f"<Solution(id={self.id}, title='{self.title}', language='{self.language}')>"
