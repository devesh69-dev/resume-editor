# app/routers/ai_enhancer.py

from fastapi import APIRouter, HTTPException
from ..schemas.model import SectionEnhanceRequest

router = APIRouter()

def dummy_enhance(section: str, content: str) -> str:
    """
    Fake AI enhancement logic – improve language, add impact words.
    This simulates what an AI might do.
    """
    if not content:
        return ""

    enhanced = (
        f"✨ Improved {section.capitalize()} Section ✨\n\n"
        f"🔹 {content.strip().capitalize()}.\n"
        f"🔹 Demonstrated excellence in {section.lower()} with clear results.\n"
        f"🔹 Proven ability to deliver impact-driven outcomes.\n"
        f"🔹 Strong communication, collaboration, and initiative.\n"
    )
    return enhanced

@router.post("/ai-enhance")
async def enhance_section(request: SectionEnhanceRequest):
    """
    Simulates AI enhancement for a resume section.
    """
    try:
        result = dummy_enhance(request.section, request.content)

        if not result:
            raise HTTPException(status_code=400, detail="Empty content received")

        return {"enhanced_content": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")
