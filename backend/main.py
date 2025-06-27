from fastapi import FastAPI, UploadFile, HTTPException, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Dict, Optional
import json
import os
import random
from parsers import parse_pdf, parse_docx
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

# Create FastAPI app first
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Config
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user database
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": pwd_context.hash("testpass"),
    }
}

# In-memory storage for resumes
resumes_db: Dict[str, dict] = {}

class SectionEnhanceRequest(BaseModel):
    section: str
    content: str

AI_ENHANCEMENTS = {
    'summary': [
        "Consider adding quantifiable achievements",
        "Include more industry-specific keywords",
        "Highlight your unique value proposition"
    ],
    'experience': [
        "Start bullet points with strong action verbs",
        "Add metrics to show impact (e.g., 'Increased X by Y%')",
        "Focus on achievements rather than responsibilities"
    ],
}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": form_data.username, "exp": datetime.utcnow() + access_token_expires},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = fake_users_db.get(username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/ai-enhance")
async def enhance_section(request: SectionEnhanceRequest):
    """Improved mock AI enhancement"""
    enhancements = AI_ENHANCEMENTS.get(request.section, [])
    selected = random.sample(enhancements, min(2, len(enhancements)))
    
    enhanced = f"{request.content}\n\nAI Suggestions:\n"
    enhanced += "\n".join(f"- {suggestion}" for suggestion in selected)
    
    if request.section == 'experience':
        enhanced += "\n\nExample enhanced version:\n"
        enhanced += "- " + request.content.replace("Developed", "Designed and implemented")
        if "improved" not in request.content.lower():
            enhanced += ", resulting in 30% performance improvement"
    
    return {"enhanced_content": enhanced}

@app.post("/save-resume")
async def save_resume(resume_data: dict, current_user: dict = Depends(get_current_user)):
    """Save resume data to memory"""
    if not resume_data.get("id"):
        resume_data["id"] = str(len(resumes_db) + 1)
    resume_data["owner"] = current_user["username"]
    resumes_db[resume_data["id"]] = resume_data
    return {"status": "success", "resume_id": resume_data["id"]}

@app.get("/get-resume/{resume_id}")
async def get_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve a saved resume"""
    if resume_id not in resumes_db:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resumes_db[resume_id].get("owner") != current_user["username"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this resume")
    return resumes_db[resume_id]

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if file.filename.endswith('.pdf'):
        content = await file.read()
        return parse_pdf(content)
    elif file.filename.endswith('.docx'):
        content = await file.read()
        return parse_docx(content)
    else:
        raise HTTPException(400, "Unsupported file format")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)