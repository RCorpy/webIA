// src/pages/Success.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

export default function Success({ setCredits }) {
  const [loading, setLoading] = useState(true);
  const [addedCredits, setAddedCredits] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    if (!session_id) return navigate("/app", { replace: true });

    const updateCredits = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const res = await axios.get(
          `https://natvidai.com/api/payments/verify?session_id=${session_id}`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        setAddedCredits(res.data.credits_added);
        setCredits((prev) => prev + res.data.credits_added);
      } catch (err) {
        console.error("Payment verification failed", err);
      } finally {
        setLoading(false);
      }
    };

    updateCredits();
  }, [searchParams, navigate, setCredits]);

  if (loading) return <p>Verifying payment...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-6">You received {addedCredits} AI credits.</p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigate("/app")}
      >
        Back to App
      </button>
    </div>
  );
}
