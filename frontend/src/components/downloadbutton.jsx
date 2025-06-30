// DownloadButton.jsx
import React from 'react';
import './DownloadButton.css';

const DownloadButton = ({ content, fileName = 'enhanced_resume.txt' }) => {
  const download = () => {
    if (!content) {
      alert('No content to download!');
      return;
    }

    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const href = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = href;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(href);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <button 
      onClick={download} 
      className="download-btn"
      aria-label="Download enhanced resume"
    >
      <svg className="download-icon" viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
      </svg>
      Download Enhanced Resume
    </button>
  );
};

export default DownloadButton;