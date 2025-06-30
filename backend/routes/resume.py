from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from backend.schemas.model import ResumeData
from backend.auth.dependencies import get_current_user
from backend.db.memory import resumes_db
from backend.parsers import parse_pdf, parse_docx

router = APIRouter()

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    content = await file.read()

    if file.filename.endswith(".pdf"):
        parsed = parse_pdf(content)
    elif file.filename.endswith(".docx"):
        parsed = parse_docx(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Use .pdf or .docx")

    if "error" in parsed:
        raise HTTPException(status_code=500, detail=parsed["error"])

    return {
        "parsed_text": parsed["text"],
        "sections": parsed["sections"]
    }

@router.post("/save-resume")
async def save_resume(data: ResumeData, current_user: dict = Depends(get_current_user)):
    resume_id = data.data.get("id", str(len(resumes_db) + 1))
    data.data["id"] = resume_id
    data.data["owner"] = current_user["username"]
    resumes_db[resume_id] = data.data
    return {"status": "success", "resume_id": resume_id}

@router.get("/get-resume/{resume_id}")
async def get_resume(resume_id: str, current_user: dict = Depends(get_current_user)):
    resume = resumes_db.get(resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if resume.get("owner") != current_user["username"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return resume
