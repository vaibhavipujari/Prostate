from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import prediction

load_dotenv()
app = FastAPI(
    title="Image Prediction API",
    description="API to predict masks using a pre-trained model.",
    version="1.0.0"
)

origins = [
    "*",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

app.include_router(prediction.router)

# Home route (optional)
@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI prediction service!"}
