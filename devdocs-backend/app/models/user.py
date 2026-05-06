"""
DevDocs Backend - User Model
SQLAlchemy model for users table
"""

from sqlalchemy import Column, String, Text, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.database import Base

class User(Base):
    """User model"""
    __tablename__ = "users"

    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Authentication
    email = Column(String(255), unique=True, nullable=False, index=True)
    auth_id = Column(UUID(as_uuid=True), unique=True, nullable=False, index=True)
    
    # Profile
    full_name = Column(String(255))
    avatar_url = Column(Text)
    bio = Column(Text)
    
    # Social links
    github_username = Column(String(255))
    twitter_username = Column(String(255))
    website_url = Column(Text)
    
    # Preferences
    theme = Column(String(20), default='dark')
    language = Column(String(10), default='en')
    
    # Timestamps
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_login_at = Column(TIMESTAMP(timezone=True))
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"
