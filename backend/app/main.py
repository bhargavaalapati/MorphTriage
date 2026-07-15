from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .services import evaluate_emergency_input

app = FastAPI(title="MorphTriage API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmergencyPayload(BaseModel):
    raw_input: str

@app.post("/api/triage")
def run_triage(payload: EmergencyPayload):
    try:
        # Pass the raw text directly into the Gemini engine
        result = evaluate_emergency_input(payload.raw_input)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {"status": "MorphTriage API is online and waiting for input."}