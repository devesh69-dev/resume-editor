from pydantic import BaseModel
from typing import Dict

class SectionEnhanceRequest(BaseModel):
    section: str
    content: str

class ResumeData(BaseModel):
    data: Dict
