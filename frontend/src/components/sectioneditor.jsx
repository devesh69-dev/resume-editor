import React, { useState } from 'react';
import './SectionEditor.css';

const SectionEditor = ({ section, content, setContent, setEnhanced }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enhanceContent = async () => {
    if (!content.trim()) {
      setError('Please enter some content to enhance');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/ai-enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: section,
          content: content
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEnhanced(data.enhanced_content);
    } catch (error) {
      console.error("Enhance failed:", error);
      setError('Failed to enhance content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section-editor">
      <div className="editor-header">
        <h3>{section.charAt(0).toUpperCase() + section.slice(1)} Section</h3>
        <div className="character-count">
          {content.length} {content.length === 1 ? 'character' : 'characters'}
        </div>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError(null);
        }}
        placeholder={`Enter your ${section} content here...`}
        className="editor-textarea"
      />
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={enhanceContent} 
        className="enhance-button"
        disabled={isLoading || !content.trim()}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Enhancing...
          </>
        ) : (
          <>
            <svg className="magic-icon" viewBox="0 0 24 24">
              <path d="M7.5 4.5L4 8l3.5 3.5L8 12l-3.5-3.5L1 12V0l3.5 3.5L8 0l-.5.5L4 4l3.5 3.5L8 8l-.5-.5zm9 0L20 8l-3.5 3.5L16 12l3.5-3.5L23 12V0l-3.5 3.5L16 0l.5.5L20 4l-3.5 3.5L16 8l.5-.5zM9 16l-2 6-2-6-6-2 6-2 2-6 2 6 6 2-6 2z"/>
            </svg>
            Enhance
          </>
        )}
      </button>
    </div>
  );
};

export default SectionEditor;