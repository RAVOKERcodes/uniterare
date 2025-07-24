from pydantic import BaseModel
from typing import List, Optional

class DrugQuery(BaseModel):
    q: Optional[str] = None

class DrugRequest(BaseModel):
    drug_name: str

class DrugResponse(BaseModel):
    success: bool
    drug_name: Optional[str] = None
    manufacturers: Optional[List[str]] = None
    description: Optional[str] = None
    message: Optional[str] = None

class DrugSuggestionsResponse(BaseModel):
    suggestions: List[str]

class DrugErrorResponse(BaseModel):
    success: bool
    message: str
    error: Optional[str] = None