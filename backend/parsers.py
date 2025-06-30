from pdfminer.high_level import extract_text
from docx import Document
import io

# ✅ Extract text from PDF
def parse_pdf(file_bytes: bytes):
    try:
        text = extract_text(io.BytesIO(file_bytes))
        sections = auto_detect_sections(text)
        return {
            "text": text.strip(),
            "sections": sections
        }
    except Exception as e:
        return {"error": f"PDF parsing failed: {str(e)}"}

# ✅ Extract text from DOCX
def parse_docx(file_bytes: bytes):
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text.strip() for para in doc.paragraphs if para.text.strip()])
        sections = auto_detect_sections(text)
        return {
            "text": text.strip(),
            "sections": sections
        }
    except Exception as e:
        return {"error": f"DOCX parsing failed: {str(e)}"}

# ✅ Section Detection (Basic logic – can upgrade to NLP later)
def auto_detect_sections(text: str):
    section_keywords = ['experience', 'education', 'skills', 'summary', 'projects', 'certifications']
    sections = {}
    current_section = 'Other'

    for line in text.split('\n'):
        clean_line = line.strip()
        if not clean_line:
            continue

        # Check if line is a section heading
        if clean_line.lower() in section_keywords:
            current_section = clean_line.capitalize()
            sections[current_section] = []
        else:
            sections.setdefault(current_section, []).append(clean_line)

    return sections
