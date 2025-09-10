import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

function CreditDisplay() {
  const [credits, setCredits] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Not authenticated');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/credits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCredits(response.data.credits);
        setError('');
      } catch (err) {
        setError('Failed to fetch credits: ' + err.message);
      }
    };

    if (auth.currentUser) fetchCredits();
  }, [auth.currentUser]);

  return (
    <div>
      <h2>Credits: {credits}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CreditDisplay;