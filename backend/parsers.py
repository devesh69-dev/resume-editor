from pdfminer.high_level import extract_text
from docx import Document
import io

def parse_pdf(file):
    """Extract text from PDF file"""
    text = extract_text(io.BytesIO(file))
    return {'text': text, 'sections': auto_detect_sections(text)}

def parse_docx(file):
    """Extract text from DOCX file"""
    doc = Document(io.BytesIO(file))
    text = "\n".join([para.text for para in doc.paragraphs])
    return {'text': text, 'sections': auto_detect_sections(text)}

def auto_detect_sections(text):
    """Simple section detection (improve with regex/NLP)"""
    sections = {}
    current_section = 'Unknown'
    
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        if line.lower() in ['experience', 'education', 'skills', 'summary']:
            current_section = line
            sections[current_section] = []
        else:
            sections.setdefault(current_section, []).append(line)
    
    return sections