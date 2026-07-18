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
                "Your job is to read unstructured emergency input and return a strict UI mutation schema.\n\n"
                "Rules:\n"
                "1. Detect the user's language. Populate 'detected_language' and provide an 'english_translation' for the dispatcher.\n"
                "2. Determine the Actor Role (VICTIM or PROXY).\n"
                "3. If VICTIM: Set render_mode to 'CRITICAL_SUBTRACTIVE'. The 'action_directive' MUST be translated back into the user's native language.\n"
                "4. If PROXY: Set render_mode to 'ADDITIVE_DASHBOARD'."
            ),
            response_mime_type="application/json",
            response_schema=TriageResponse,
            temperature=0.1, # Low temp for deterministic UI mapping
        ),
    )
    
    # The SDK automatically parses the JSON into our Pydantic object!
    # I use model_dump() to convert it back to a standard dictionary for FastAPI
    return response.parsed.model_dump()