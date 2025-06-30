export const enhanceResume = async (section, content) => {
  const res = await fetch('http://localhost:8000/ai-enhance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section, content }),
  });

  return await res.json();
};
