import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Establish async connection to MongoDB."""
    if not MONGO_URI:
        print("⚠️ MONGODB_URI not found. Database logging is disabled.")
        return
        
    try:
        db_instance.client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db_instance.db = db_instance.client["morphtriage_db"]
        # Ping to verify connection
        await db_instance.client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas.")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")

async def close_mongo_connection():
    """Gracefully close the database connection."""
    if db_instance.client:
        db_instance.client.close()
        print("🛑 Closed MongoDB connection.")

async def log_triage_report(report_data: dict):
    """Fire-and-forget function to save the report to the database."""
    if db_instance.db is not None:
        try:
            # We insert the data into a 'crisis_reports' collection
            await db_instance.db["crisis_reports"].insert_one(report_data)
        except Exception as e:
            print(f"Database insertion error: {e}")