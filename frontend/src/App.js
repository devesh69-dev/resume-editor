import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { generatePDF } from '../src/utils/pdfGenerator';

function App() {
  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    summary: 'Experienced developer...',
    experience: [
      { id: 1, title: 'Software Engineer', company: 'Tech Inc', duration: '2020-2022', description: 'Developed web applications' }
    ],
    education: [
      { id: 1, degree: 'B.S. Computer Science', university: 'State University', year: '2020' }
    ],
    skills: ['JavaScript', 'React', 'Python']
  });
  const [savedId, setSavedId] = useState(null);
  const [token] = useState(null); // Token state kept but not using setToken

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResume({ ...resume, [name]: value });
  };

  const handleSectionChange = (section, index, field, value) => {
    const updatedSection = [...resume[section]];
    updatedSection[index][field] = value;
    setResume({ ...resume, [section]: updatedSection });
  };

  const handleAddEntry = (section) => {
    const newEntry = section === 'skills' ? '' : 
      section === 'experience' ? { id: Date.now(), title: '', company: '', duration: '', description: '' } :
      { id: Date.now(), degree: '', university: '', year: '' };
    
    setResume({ 
      ...resume, 
      [section]: [...resume[section], newEntry] 
    });
  };

  const handleRemoveEntry = (section, index) => {
    const updatedSection = [...resume[section]];
    updatedSection.splice(index, 1);
    setResume({ ...resume, [section]: updatedSection });
  };

  const processParsedData = (parsedData) => {
    setResume(prev => ({
      ...prev,
      name: parsedData.name || prev.name,
      summary: parsedData.summary || prev.summary,
      experience: parsedData.experience || prev.experience,
      education: parsedData.education || prev.education,
      skills: parsedData.skills || prev.skills
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8000/parse-resume', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
      processParsedData(response.data);
    } catch (error) {
      console.error('Parsing failed:', error);
    }
  };

  const enhanceSection = async (section, content) => {
    try {
      const response = await axios.post('http://localhost:8000/ai-enhance', {
        section,
        content: typeof content === 'string' ? content : JSON.stringify(content)
      });
      
      if (section === 'summary') {
        setResume({ ...resume, [section]: response.data.enhanced_content });
      } else {
        alert('Enhanced content: ' + response.data.enhanced_content);
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
    }
  };

  // Add auth header to requests
  axios.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const saveResume = async () => {
    try {
      const response = await axios.post('http://localhost:8000/save-resume', resume);
      setSavedId(response.data.resume_id);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const downloadResume = () => {
    const dataStr = JSON.stringify(resume, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'resume.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
  try {
    generatePDF(resume);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
  
  return (
    <div className="app">
      <h1>Resume Editor</h1>
      
      <div className="section">
        <h2>Upload Resume</h2>
        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      </div>

      <div className="section">
        <h2>Basic Information</h2>
        <input name="name" value={resume.name} onChange={handleInputChange} placeholder="Name" />
        <input name="email" value={resume.email} onChange={handleInputChange} placeholder="Email" />
        <input name="phone" value={resume.phone} onChange={handleInputChange} placeholder="Phone" />
      </div>

      <div className="section">
        <h2>Summary <button onClick={() => enhanceSection('summary', resume.summary)}>Enhance with AI</button></h2>
        <textarea name="summary" value={resume.summary} onChange={handleInputChange} rows={4} />
      </div>

      <div className="section">
        <h2>Experience <button onClick={() => handleAddEntry('experience')}>+ Add</button></h2>
        {resume.experience.map((exp, index) => (
          <div key={exp.id} className="entry">
            <input value={exp.title} onChange={(e) => handleSectionChange('experience', index, 'title', e.target.value)} placeholder="Title" />
            <input value={exp.company} onChange={(e) => handleSectionChange('experience', index, 'company', e.target.value)} placeholder="Company" />
            <input value={exp.duration} onChange={(e) => handleSectionChange('experience', index, 'duration', e.target.value)} placeholder="Duration" />
            <textarea value={exp.description} onChange={(e) => handleSectionChange('experience', index, 'description', e.target.value)} placeholder="Description" rows={2} />
            <button onClick={() => enhanceSection('experience', exp.description)}>Enhance Description</button>
            <button onClick={() => handleRemoveEntry('experience', index)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Education <button onClick={() => handleAddEntry('education')}>+ Add</button></h2>
        {resume.education.map((edu, index) => (
          <div key={edu.id} className="entry">
            <input value={edu.degree} onChange={(e) => handleSectionChange('education', index, 'degree', e.target.value)} placeholder="Degree" />
            <input value={edu.university} onChange={(e) => handleSectionChange('education', index, 'university', e.target.value)} placeholder="University" />
            <input value={edu.year} onChange={(e) => handleSectionChange('education', index, 'year', e.target.value)} placeholder="Year" />
            <button onClick={() => handleRemoveEntry('education', index)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Skills <button onClick={() => handleAddEntry('skills')}>+ Add</button></h2>
        <div className="skills">
          {resume.skills.map((skill, index) => (
            <div key={index} className="skill-entry">
              <input value={skill} onChange={(e) => handleSectionChange('skills', index, '', e.target.value)} />
              <button onClick={() => handleRemoveEntry('skills', index)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button onClick={saveResume}>Save Resume</button>
        <button onClick={downloadResume}>Download as JSON</button>
        <button onClick={handleDownloadPDF}>Download as PDF</button>
        {savedId && <p>Resume ID: {savedId}</p>}
      </div>
    </div>
  );
}

export default App;