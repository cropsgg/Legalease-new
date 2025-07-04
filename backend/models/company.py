from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional
from bson import ObjectId

class Company(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "name": "Example Company",
                "owner_id": "507f1f77bcf86cd799439011"
            }
        }
    )
    
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None 