import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

function AIRequestForm({ setCredits }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const MAX_HEIGHT = 250; // max height in px (about 10rem)

  // Auto-grow logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset
      textarea.style.height = Math.min(textarea.scrollHeight, MAX_HEIGHT) + 'px';
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai`,
        { input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResponse(res.data.output || 'Success');

      if (res.data.credits_left !== undefined) {
        setCredits(res.data.credits_left);
      }
    } catch (err) {
      setError('Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-2 border rounded resize-none overflow-y-auto"
          rows={2}
          style={{ maxHeight: `${MAX_HEIGHT}px` }}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {response && <p className="mt-2">Response: {response}</p>}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}

export default AIRequestForm;
