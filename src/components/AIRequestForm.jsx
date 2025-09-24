import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function AIRequestForm({ setCredits, addResult }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollTaskStatus = async (taskId, retries = 20, interval = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const statusRes = await axios.get(
          `http://localhost:8000/api/ai/status/${taskId}`
        );

        // Always update credits from the backend
        if (statusRes.data.credits_left !== undefined) {
          setCredits(statusRes.data.credits_left);
        }

        const status = statusRes.data.status;

        if (status === "Ready") {
          return statusRes.data.output;
        } else if (status === "Failed") {
          // Show detailed reason if available
          const detail = statusRes.data.detail || "BFL task failed.";
          throw new Error(detail);
        }
      } catch (err) {
        console.error("Polling error:", err);
        throw err;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error("BFL polling timed out.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in");

      const idToken = await user.getIdToken();

      // 1️⃣ Create AI task
      const res = await axios.post(
        "http://localhost:8000/api/ai",
        { input: prompt },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      const { task_id, credits_left } = res.data;

      // Update credits after task creation (might still be the same)
      if (credits_left !== undefined) setCredits(credits_left);

      // 2️⃣ Poll until image is ready
      const outputUrl = await pollTaskStatus(task_id);

      // 3️⃣ Add result to the UI
      addResult({ url: outputUrl, prompt });
      setPrompt("");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Unknown error";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt here..."
        className="w-full border rounded p-2"
        rows={3}
      />
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
}
