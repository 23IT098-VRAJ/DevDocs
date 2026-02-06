"""
DevDocs Backend - Dashboard Schemas
"""
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class DashboardStats(BaseModel):
    """Dashboard statistics overview"""
    total_solutions: int
    total_languages: int
    unique_tags: int
    most_recent_solution: Optional[datetime]
    language_breakdown: List[Dict[str, Any]]
    
    model_config = {
        "from_attributes": True
    }
