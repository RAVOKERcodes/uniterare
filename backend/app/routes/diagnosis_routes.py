from fastapi import APIRouter, HTTPException
from models.patient import PatientData, DiagnosisResponse
from controllers.diagnosis_controller import process_diagnosis

router = APIRouter(tags=["diagnosis"])

@router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose_patient(patient_data: PatientData):
    """Analyze patient data and provide diagnosis"""
    if not patient_data:
        raise HTTPException(status_code=400, detail="No patient data provided")
    
    # Convert Pydantic model to dict
    patient_dict = patient_data.dict()
    
    result = process_diagnosis(patient_dict)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("message", "Diagnosis failed"))
    
    return DiagnosisResponse(**result)