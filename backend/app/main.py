import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.disease_routes import router as disease_router
from routes.drug_routes import router as drug_router
from routes.diagnosis_routes import router as diagnosis_router

# Create patient_data directory
os.makedirs("patient_data", exist_ok=True)

app = FastAPI(
    title="Medical API",
    description="API for disease descriptions, drug information, and diagnosis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(disease_router, prefix="/api")
app.include_router(drug_router, prefix="/api")
app.include_router(diagnosis_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Medical API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)