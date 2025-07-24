from fastapi import APIRouter, HTTPException, Query
from models.drug import (
    DrugRequest,
    DrugResponse,
    DrugSuggestionsResponse,
    DrugErrorResponse
)
from controllers.drug_controller import (
    get_drug_suggestions,
    get_drug_info
)

router = APIRouter(tags=["drugs"])

@router.get("/drug-info", response_model=DrugSuggestionsResponse)
async def get_drug_suggestions_endpoint(q: str = Query(..., description="Query parameter for drug suggestions")):
    """Get drug suggestions based on query"""
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query parameter 'q' cannot be empty")
    
    suggestions = get_drug_suggestions(q.strip().upper())
    
    if "error" in suggestions:
        raise HTTPException(status_code=500, detail=suggestions["error"])
    
    return DrugSuggestionsResponse(**suggestions)

@router.post("/drug-info", response_model=DrugResponse)
async def get_drug_information(request: DrugRequest):
    """Get drug information from database or OpenFDA"""
    if not request.drug_name.strip():
        raise HTTPException(status_code=400, detail="Drug name cannot be empty")
    
    result = get_drug_info(request.drug_name.strip().upper())
    
    if not result["success"]:
        if "not found in local database" in result.get("message", ""):
            raise HTTPException(status_code=404, detail=result["message"])
        else:
            raise HTTPException(status_code=500, detail=result.get("message", "Server error"))
    
    return DrugResponse(**result)