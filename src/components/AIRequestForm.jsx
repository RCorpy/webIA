

// src/components/AIRequestForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

function AIRequestForm({ setCredits }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

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
        setCredits(res.data.credits_left); // 🔑 update lifted state
      }
    } catch (err) {
      setError('Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter AI request"
          style={{ width: '300px', padding: '8px', marginRight: '8px' }}
        />
        <button type="submit">Submit</button>
      </form>
      {response && <p>Response: {response}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AIRequestForm;