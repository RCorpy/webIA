import { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    const res = await fetch("http://localhost:8000/api/purchases", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to load purchases:", res.status);
      return;
    }

    const data = await res.json();
    setPurchases(data.items || []);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">My Purchases</h1>

      {purchases.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Session ID</th>
                <th className="py-2 px-4 border-b">Credits</th>
                <th className="py-2 px-4 border-b">Amount (€)</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p._id} className="text-center">
                  <td className="py-2 px-4 border-b">{p.stripe_session_id}</td>
                  <td className="py-2 px-4 border-b">{p.credits}</td>
                  <td className="py-2 px-4 border-b">{p.amount_eur.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(p.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
