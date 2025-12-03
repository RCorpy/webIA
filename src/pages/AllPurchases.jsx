// src/pages/AllPurchases.jsx
import { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function AllPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailFilter, setEmailFilter] = useState("");

  useEffect(() => {
    loadAllPurchases();
  }, []);

  async function loadAllPurchases(filterEmail = "") {
    const user = auth.currentUser;
    if (!user) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();
      let url = "https://natvidai.com/api/purchases/all";
      if (filterEmail) {
        url += `?email=${encodeURIComponent(filterEmail)}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        setError("You are not an admin!");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(`Failed to load purchases: ${res.status}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPurchases(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Error fetching purchases");
    } finally {
      setLoading(false);
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadAllPurchases(emailFilter);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">All Purchases (Admin)</h1>

      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit} className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Filter by user email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button type="submit" className="p-2 bg-blue-600 text-white rounded">
          Filter
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : purchases.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">User ID</th>
                <th className="p-2 border-b">Credits</th>
                <th className="p-2 border-b">Amount (€)</th>
                <th className="p-2 border-b">Session ID</th>
                <th className="p-2 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{p.user_id}</td>
                  <td className="p-2 border-b">{p.credits}</td>
                  <td className="p-2 border-b">{p.amount_eur}</td>
                  <td className="p-2 border-b break-words">{p.stripe_session_id}</td>
                  <td className="p-2 border-b">{new Date(p.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
