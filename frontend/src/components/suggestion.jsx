import React from 'react';
import '../components/suggestions.css';

const Suggestions = ({ enhanced }) => {
  return (
    <div className="suggestions">
      <h3>Enhanced Output</h3>
      <pre>{enhanced}</pre>
    </div>
  );
};

export default Suggestions;
