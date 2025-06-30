from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Absolute imports (assuming structure is correct and you're running from root)
from backend.routes import resume
from backend.auth.auth import router as auth_router
from backend.routes import ai as ai_enhancer


app = FastAPI()

# ✅ CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Route includes
app.include_router(auth_router)
app.include_router(resume.router)
app.include_router(ai_enhancer.router)

# ✅ Main entry point (only needed if you run `python main.py` directly, not via uvicorn CLI)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
