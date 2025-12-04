import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function AIRequestForm({ setCredits, addResult, selectedOption, model, aspectRatio, dimensions, isRaw, inputImage, maskImage }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pollTaskStatus = async (taskId, retries = 20, interval = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const statusRes = await axios.get(
          `https://natvidai.com/api/ai/status/${taskId}`
        );

        if (statusRes.data.credits_left !== undefined) {
          setCredits(statusRes.data.credits_left);
        }

        const status = statusRes.data.status;
        if (status === "Ready") {
          return statusRes.data.output;
        } else if (status === "Failed") {
          throw new Error(statusRes.data.detail || "BFL task failed.");
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
    if (selectedOption==="image-to-image" && !inputImage) {
      setError("Please select an image first.");
      return;
    };

    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in");

      const idToken = await user.getIdToken();

      // Build parameters (future-proof)
      const parameters = {};
      parameters.sidebar_option = selectedOption;
      // TEXT-TO-IMAGE
      if(selectedOption==="text-to-image") {
        if (model === "flux-pro-1.1-model") {
          parameters.width = dimensions.width;
          parameters.height = dimensions.height;
        } 
        if (model === "kontext-model") {
          parameters.aspect_ratio = aspectRatio;
        }
        if (model ==="flux-pro-1.1-ultra-model") {
          parameters.raw = isRaw;
          parameters.aspect_ratio = aspectRatio;
        }
      }
      // IMAGE-TO-IMAGE
      if(selectedOption==="image-to-image") {
        if (model === "kontext-model"){
          parameters.aspect_ratio = aspectRatio;
          parameters.input_image = inputImage;
        }
        else if (model ==="flux-pro-1.1-ultra-model") {
          parameters.aspect_ratio = aspectRatio;
          parameters.input_image = inputImage;
        }
        else if (model === "flux-pro-1.0-fill-model") {
          parameters.input_image = inputImage;
          parameters.mask = maskImage
        }
        else{
          console.log("ERROR: model not supported", model)
        }
      }
      //// TESTING /////  
      console.log("[AIRequestForm] Sending AI request", {
        input: prompt,
        model,
        parameters
      });
      console.log("[AIRequestForm] aspectRatio var:", aspectRatio, "type:", typeof aspectRatio);
      //// TESTING /////  


      // 1️⃣ Create AI task
      const res = await axios.post(
        "https://natvidai.com/api/ai",
        {
          input: prompt,
          model: model,          // ✅ Explicit model
          parameters: parameters // ✅ Flexible parameters
        },
        {
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      const { task_id, credits_left } = res.data;
      if (credits_left !== undefined) setCredits(credits_left);

      // 2️⃣ Poll until ready
      const outputUrl = await pollTaskStatus(task_id);

      // 3️⃣ Add result
      addResult({ url: outputUrl, prompt });
      //setPrompt("");
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
