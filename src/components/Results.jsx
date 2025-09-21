// src/components/Results.jsx
import React from "react";
import axios from "axios";

export default function Results({ results }) {
  if (!results.length) {
    return <p className="text-gray-500">No results yet...</p>;
  }

  const downloadImage = async (url, filename) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/ai/download?url=${encodeURIComponent(url)}`,
        { responseType: "blob" }
      );
      const blobUrl = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {results.map((item, index) => (
        <div
          key={index}
          className="relative rounded-lg shadow-sm bg-white overflow-hidden"
        >
          <img
            src={item.url}
            alt={`Result ${index + 1}`}
            className="w-full object-contain"
            style={{ maxHeight: "400px" }}
          />
          {/* Floating transparent download button */}
          <button
            onClick={() =>
              downloadImage(item.url, `ai-result-${index + 1}.png`)
            }
            className="absolute top-2 right-2 bg-transparent hover:bg-white/70 text-gray-800 p-1 rounded-full shadow z-10"
          >
            ⬇️
          </button>
        </div>
      ))}
    </div>
  );
}
