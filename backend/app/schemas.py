from pydantic import BaseModel, Field
from typing import List

class UIState(BaseModel):
    render_mode: str = Field(description="Must be 'CRITICAL_SUBTRACTIVE' for high-panic victims, or 'ADDITIVE_DASHBOARD' for safe proxy observers.")
    primary_color: str = Field(description="Tailwind color class. e.g., 'bg-red-700' for extreme danger, 'bg-slate-900' for proxy dashboard.")
    text_size: str = Field(description="Tailwind text size class. e.g., 'text-7xl' for high panic, 'text-base' for safe proxies.")
    visible_elements: List[str] = Field(description="Choose from: 'SOS_BUTTON', 'DIRECTIVE_TEXT', 'MAP_PIN', 'CASUALTY_SLIDER', 'PHOTO_UPLOAD'")
    hidden_elements: List[str] = Field(description="Choose from: 'NAV_BAR', 'HISTORY_LOG', 'SETTINGS_MENU', 'FOOTER'")
    action_directive: str = Field(description="If high panic, a massive 3-4 word survival directive (e.g., 'MOVE TO ROOF'). If proxy, a calm instruction (e.g., 'Log casualty count below').The survival directive-MUST BE IN THE SAME LANGUAGE AS THE RAW INPUT.")

class TriageResponse(BaseModel):
    panic_index: int = Field(description="Scale 1-10 based on linguistic urgency, typos, lack of punctuation, and threat immediacy.")
    actor_role: str = Field(description="Must be 'VICTIM' if the user is in immediate danger, or 'PROXY' if they are safely observing/reporting.")
    emergency_category: str = Field(description="e.g., Flash Flood, Structural Fire, Medical Emergency, General Inquiry.")
    extracted_location: str = Field(description="The physical location mentioned, or 'UNKNOWN'.")
    detected_language: str = Field(description="The language of the raw input (e.g., English, Telugu, Hindi).")
    english_translation: str = Field(description="A clean, English translation of the emergency for dispatchers.")
    ui_state: UIState