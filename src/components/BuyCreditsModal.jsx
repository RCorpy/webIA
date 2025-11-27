import { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe with your publishable key (put your real key in .env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function BuyCreditsModal({ setShowBuyCredits }) {
  const [selected, setSelected] = useState("pack_small");

  const handleCheckout = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    const idToken = await user.getIdToken();

    const res = await axios.post(
      "https://natvidai.com/api/payments/create",
      { pack_id: selected },
      { headers: { Authorization: `Bearer ${idToken}` } }
    );

    // safer redirect
    window.location.assign(res.data.checkout_url);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded shadow-md min-w-[300px]">
        <h2 className="text-lg font-semibold mb-3">Buy Credits</h2>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="pack_small">250 credits – €5.00</option>
          <option value="pack_medium">525 credits – €10.00</option>
          <option value="pack_large">1100 credits – €20.00</option>
        </select>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={() => setShowBuyCredits(false)} className="px-3 py-2">
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}
