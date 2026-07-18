from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
import redis
import json
import hashlib
import os

from .services import evaluate_emergency_input
from .database import connect_to_mongo, close_mongo_connection, log_triage_report
from .notifications import send_dispatch_sms

# Standard FastAPI lifespan manager for robust startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(title="MorphTriage API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis setup remains unchanged
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
try:
    redis_client = redis.Redis(host=REDIS_HOST, port=6379, db=0, decode_responses=True)
    redis_client.ping()
    print("✅ Connected to Redis cache.")
except redis.ConnectionError:
    redis_client = None
    print("⚠️ Redis not found. Running without cache.")

class EmergencyPayload(BaseModel):
    raw_input: str

class IntelPayload(BaseModel):
    original_triage_id: str = "N/A" # Would link to the original triage session
    lat: float
    lng: float
    casualty_estimate: int
    image_url: str

@app.post("/api/triage")
async def run_triage(payload: EmergencyPayload, background_tasks: BackgroundTasks):
    try:
        normalized_text = payload.raw_input.strip().lower()
        
        # 1. Check Redis Cache
        if redis_client:
            cache_key = hashlib.md5(normalized_text.encode()).hexdigest()
            cached_result = redis_client.get(cache_key)
            if cached_result:
                print("⚡ Serving from Redis Cache")
                data = json.loads(cached_result)
                # Still log the incident to MongoDB in the background!
                background_tasks.add_task(log_triage_report, data)
                background_tasks.add_task(send_dispatch_sms, data)
                
                return {"success": True, "data": data}

        # 2. Hit Gemini API
        print("🧠 Hitting Gemini API")
        result = evaluate_emergency_input(payload.raw_input)
        
        # 3. Cache the new result
        if redis_client:
            redis_client.setex(cache_key, 3600, json.dumps(result))
            
        # 4. Asynchronously save to MongoDB (Zero latency hit for the user)
        background_tasks.add_task(log_triage_report, result)
        background_tasks.add_task(send_dispatch_sms, result)
            
        return {"success": True, "data": result}
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/intel")
async def submit_intel(payload: IntelPayload, background_tasks: BackgroundTasks):
    try:
        intel_data = payload.model_dump()
        intel_data["type"] = "PROXY_ENRICHED_INTEL"
        
        # Log to MongoDB asynchronously
        background_tasks.add_task(log_triage_report, intel_data)
        background_tasks.add_task(send_dispatch_sms, intel_data)
        
        return {"success": True, "message": "Intel securely logged to Command Center."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test-sms")
async def test_twilio_sms(background_tasks: BackgroundTasks):
    """0-Token Endpoint to test Twilio without hitting Gemini"""
    mock_data = {
        "emergency_category": "SYSTEM TEST",
        "actor_role": "ADMIN",
        "extracted_location": "Twilio Server Validation",
        "english_translation": "This is a free test. No Gemini API tokens were used."
    }
    
    # THIS is the line that actually fires the SMS!
    background_tasks.add_task(send_dispatch_sms, mock_data)
    
    return {"status": "SMS dispatched to background thread. Check your terminal logs!"}