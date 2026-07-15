import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
from .schemas import TriageResponse

# Load environment variables
load_dotenv()

# The SDK automatically detects the GEMINI_API_KEY environment variable
client = genai.Client()

def evaluate_emergency_input(user_input: str) -> dict:
    """Sends the unstructured text to Gemini 2.5 Flash and forces a TriageResponse JSON return."""
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=user_input,
        config=types.GenerateContentConfig(
            system_instruction=(
                "You are MorphTriage, an invisible, hyper-fast psychological triage engine and UI architect. "
                "Your job is to read unstructured, often panicked emergency input and return a strict UI mutation schema.\n\n"
                "Rules:\n"
                "1. Evaluate the Panic Index (1-10) based on typos, fragmentation, and physical threat.\n"
                "2. Determine the Actor Role. If they are in immediate danger, they are a VICTIM. If they are safe but reporting, they are a PROXY.\n"
                "3. If VICTIM: Strip the UI. Set render_mode to 'CRITICAL_SUBTRACTIVE'. Hide all menus. Provide a massive action_directive.\n"
                "4. If PROXY: Enhance the UI. Set render_mode to 'ADDITIVE_DASHBOARD'. Show map pins and upload buttons."
            ),
            response_mime_type="application/json",
            response_schema=TriageResponse,
            temperature=0.1, # Low temp for deterministic UI mapping
        ),
    )
    
    # The SDK automatically parses the JSON into our Pydantic object!
    # I use model_dump() to convert it back to a standard dictionary for FastAPI
    return response.parsed.model_dump()