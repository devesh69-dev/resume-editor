import React from "react";

const ParsedOutput = ({ data }) => {
  if (!data) return null;

  return (
    <div className="parsed-output">
      <h2>Parsed Resume Text</h2>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "10px" }}>
        {data.text}
      </pre>

      <h2>Auto-detected Sections</h2>
      {Object.entries(data.sections).map(([section, content]) => (
        <div key={section}>
          <h3>{section}</h3>
          <ul>
            {content.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ParsedOutput;
