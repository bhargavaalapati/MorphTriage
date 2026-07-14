from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#Allow React to talk to the fastAPI

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get("/")
def read_root():
    return {"status":"MorphTriage API is alive and ready for the integration."}