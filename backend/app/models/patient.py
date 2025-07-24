from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class RareDisease(BaseModel):
    disease_name: str
    score: int
    description: str
    overview: str
    signs_symptoms: List[str]
    clinical_significance: str
    causes: str
    related_disorders: List[str]
    diagnosis: str
    treatment: str
    clinical_trials: List[str]
    key_aspects: List[str]

class DiagnosisResult(BaseModel):
    patient_details: Dict[str, Any]
    top_rare_diseases: List[RareDisease]

class DiagnosisResponse(BaseModel):
    success: bool
    data: Optional[DiagnosisResult] = None
    message: Optional[str] = None
    error: Optional[str] = None

class PatientData(BaseModel):
    name: Optional[str] = None
    # Add other patient fields as needed based on your frontend
    class Config:
        extra = "allow"  # Allow additional fields