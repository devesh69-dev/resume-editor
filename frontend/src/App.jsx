import React, { useState } from 'react';
import FileUpload from './components/fileupload';
import SectionEditor from './components/sectioneditor';
import Suggestions from './components/suggestion';
import DownloadButton from './components/downloadbutton';
import ParsedOutput from './components/parsedoutput';
import './App.css';

const App = () => {
  const [section, setSection] = useState('summary');
  const [content, setContent] = useState('');
  const [enhanced, setEnhanced] = useState('');
  const [parsedData, setParsedData] = useState(null); // For full resume parsing

  return (
    <div className="container">
      <h1>AI Resume Enhancer</h1>

      {/* Resume Upload & Parse */}
      <FileUpload setParsedData={setParsedData} setContent={setContent} />

      {/* Show parsed content below */}
      {parsedData && <ParsedOutput data={parsedData} />}

      {/* Section Select Dropdown */}
      <label htmlFor="section">Select Section:</label>
      <select
        id="section"
        value={section}
        onChange={(e) => {
          setSection(e.target.value);
          setContent(parsedData?.sections?.[e.target.value]?.join('\n') || '');
          setEnhanced('');
        }}
      >
        <option value="summary">Summary</option>
        <option value="experience">Experience</option>
        <option value="education">Education</option>
        <option value="skills">Skills</option>
      </select>

      {/* Section Editor */}
      <SectionEditor
        section={section}
        content={content}
        setContent={setContent}
        setEnhanced={setEnhanced}
      />

      {/* Enhanced Suggestions + Download */}
      {enhanced && (
        <>
          <Suggestions enhanced={enhanced} />
          <DownloadButton content={enhanced} />
        </>
      )}
    </div>
  );
};

export default App;
