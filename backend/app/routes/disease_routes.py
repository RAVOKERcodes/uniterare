from fastapi import APIRouter, HTTPException, Query
from models.disease import (
    DiseaseRequest, 
    DiseaseResponse, 
    DiseaseSuggestionsResponse,
    ErrorResponse
)
from controllers.disease_controller import (
    get_disease_suggestions,
    fetch_or_generate_description
)

router = APIRouter(tags=["diseases"])

@router.get("/disease-description", response_model=DiseaseSuggestionsResponse)
async def get_disease_suggestions_endpoint(q: str = Query(..., description="Query parameter for disease suggestions")):
    """Get disease suggestions based on query"""
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query parameter 'q' cannot be empty")
    
    suggestions = get_disease_suggestions(q.strip())
    
    if "error" in suggestions:
        raise HTTPException(status_code=500, detail=suggestions["error"])
    
    return DiseaseSuggestionsResponse(**suggestions)

@router.post("/disease-description", response_model=DiseaseResponse)
async def get_disease_description(request: DiseaseRequest):
    """Get or generate disease description"""
    if not request.disease_name.strip():
        raise HTTPException(status_code=400, detail="Disease name cannot be empty")
    
    result, status_code = fetch_or_generate_description(request.disease_name.strip())
    
    if status_code != 200:
        raise HTTPException(status_code=status_code, detail=result)
    
    return DiseaseResponse(**result)