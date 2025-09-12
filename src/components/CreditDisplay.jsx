// src/components/CreditDisplay.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { onIdTokenChanged } from 'firebase/auth';

// Dedicated Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // Firebase token, no cookies
});

// Token handling
let currentToken = null;
api.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function CreditDisplay({ credits, setCredits }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch current credits from backend
  const fetchCredits = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/credits');
      setCredits(response.data.credits);
      return response;
    } catch (err) {
      setError('Failed to fetch credits: ' + (err.response?.data?.detail || err.message));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add credits manually (for testing)
  const addCredits = async (amount = 5) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/credits/add?amount=${amount}`);
      if (res.data.credits_left !== undefined) {
        setCredits(res.data.credits_left);
      }
    } catch (err) {
      setError('Failed to add credits: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Listen to token changes
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          currentToken = token;
          await fetchCredits();
        } catch (err) {
          console.error('Token fetch error:', err);
          setError('Failed to authenticate: ' + err.message);
          setLoading(false);
        }
      } else {
        currentToken = null;
        setCredits(0);
        setError('Not logged in');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading credits...</p>;

  return (
    <div>
      <h2>Credits: {credits}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={fetchCredits} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Credits'}
      </button>
      <button onClick={() => addCredits(5)} disabled={loading} style={{ marginLeft: '10px' }}>
        +5 Credits
      </button>
    </div>
  );
}

export default CreditDisplay;
