// src/components/CreditDisplay.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onIdTokenChanged } from "firebase/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

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

function CreditDisplay({ credits, setCredits, setShowBuyCredits }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchCredits = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/credits");
      setCredits(response.data.credits);
    } catch (err) {
      setError(
        "Failed to fetch credits: " +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);
          currentToken = token;
          await fetchCredits();
        } catch (err) {
          console.error("Token fetch error:", err);
          setError("Failed to authenticate: " + err.message);
          setLoading(false);
        }
      } else {
        currentToken = null;
        setCredits(0);
        setError("Not logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-gray-500">Loading credits...</p>;

  return (
    <div className="mt-6 p-4 border rounded-lg shadow bg-white">
      <h2 className="text-lg font-semibold mb-2 text-black">Credits: {credits}</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={fetchCredits}
          disabled={loading}
          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition disabled:opacity-50"
        >
          Refresh Credits
        </button>
        <button
          onClick={() => setShowBuyCredits(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Buy Credits
        </button>

      </div>
    </div>
  );
}

export default CreditDisplay;
