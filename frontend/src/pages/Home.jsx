
import React, { useState } from 'react';
import FileUpload from '../components/fileupload';
import SectionEditor from '../components/sectioneditor';
import Suggestions from '../components/Suggestions';
import DownloadButton from '../components/downloadbutton';
import './Home.css';

function Home() {
  const [section, setSection] = useState('summary');
  const [content, setContent] = useState('');
  const [enhanced, setEnhanced] = useState('');

  return (
    <div className="home-container">
      <h1 className="title">AI Resume Enhancer</h1>

      <div className="form-group">
        <label>Upload Resume:</label>
        <FileUpload setContent={setContent} />
      </div>

      <div className="form-group">
        <label>Select Section:</label>
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="summary">Summary</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      <SectionEditor
        section={section}
        content={content}
        setContent={setContent}
        setEnhanced={setEnhanced}
      />

      <Suggestions enhanced={enhanced} />

      <DownloadButton content={enhanced} />
    </div>
  );
}

export default Home;
