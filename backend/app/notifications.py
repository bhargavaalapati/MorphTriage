import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM = os.getenv("TWILIO_PHONE_NUMBER")
DISPATCH_TO = os.getenv("YOUR_VERIFIED_PHONE")

def send_dispatch_sms(data_payload: dict):
    print("\n================ [TWILIO DISPATCH THREAD] ================")
    if not TWILIO_SID or not TWILIO_TOKEN:
        print("⚠️ Twilio credentials missing. SMS skipped.")
        return

    try:
        client = Client(TWILIO_SID, TWILIO_TOKEN)
        is_intel = "lat" in data_payload
        
        if is_intel:
            lat = data_payload.get('lat')
            lng = data_payload.get('lng')
            casualties = data_payload.get('casualty_estimate', 0)
            
            # Cloudinary URLs can be massive. Truncate aggressively for SMS.
            img = data_payload.get('image_url', 'N/A')
            if len(img) > 40:
                img = img[:37] + "..."
            
            message_body = (
                f"🚨 INTEL\n"
                f"Cas: {casualties}\n"
                f"Loc: https://www.google.com/maps?q={lat},{lng}\n"
                f"Img: {img}"
            )
        else:
            # Slice strings to guarantee we stay under the 3-segment UCS-2 limit
            category = data_payload.get('emergency_category', 'Unknown')[:20]
            location = data_payload.get('extracted_location', 'Unknown')[:20]
            details = data_payload.get('english_translation', 'No details.')
            
            if len(details) > 65:
                details = details[:62] + "..."
            
            message_body = (
                f"🚨 AI ALERT\n"
                f"Type: {category}\n"
                f"Loc: {location}\n"
                f"Det: {details}"
            )

        # Final absolute failsafe: hard cap the entire string at 200 characters
        message_body = message_body[:200]

        message = client.messages.create(
            body=message_body,
            from_=TWILIO_FROM,
            to=DISPATCH_TO
        )
        print(f"✅📱 SUCCESS! SMS dispatched (Segments protected). SID: {message.sid}")
        
    except Exception as e:
        print(f"❌ TWILIO TRANSACTION CRASHED! Error: {str(e)}")
    print("=========================================================\n")