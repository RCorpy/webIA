// src/components/CreditDisplay.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { onIdTokenChanged } from 'firebase/auth';

// Configure a dedicated axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://95.217.233.118:8000/api
  withCredentials: false, // we only use Firebase token, not cookies
});

function CreditDisplay() {
  const [credits, setCredits] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      unsubscribe = onIdTokenChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken(true);

            // Attach token to all requests automatically
            api.interceptors.request.use((config) => {
              config.headers.Authorization = `Bearer ${token}`;
              return config;
            });

            console.log('Fetching credits...');
            const response = await api.get('/credits');

            setCredits(response.data.credits);
            setError('');
          } catch (err) {
            console.error(err);
            setError('Failed to fetch credits: ' + err.message);
          } finally {
            setLoading(false);
          }
        } else {
          setCredits(0);
          setError('Not logged in');
          setLoading(false);
        }
      });
    };

    init();
    return () => unsubscribe && unsubscribe();
  }, []);

  if (loading) return <p>Loading credits...</p>;

  return (
    <div>
      <h2>Credits: {credits}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreditDisplay;
