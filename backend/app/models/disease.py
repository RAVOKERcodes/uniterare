from pydantic import BaseModel
from typing import List, Optional

class DiseaseQuery(BaseModel):
    q: Optional[str] = None

class DiseaseRequest(BaseModel):
    disease_name: str

class DiseaseResponse(BaseModel):
    success: bool
    message: str
    disease: Optional[str] = None
    description: Optional[str] = None

class DiseaseSuggestionsResponse(BaseModel):
    suggestions: List[str]

class ErrorResponse(BaseModel):
    success: bool
    message: str
    error: Optional[str] = None