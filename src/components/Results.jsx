import React, { useState } from "react";
import axios from "axios";
import Lightbox from "./LightBox";

export default function Results({ results }) {
  const [preview, setPreview] = useState(null);

  if (!results.length) {
    return <p className="text-gray-500">No results yet...</p>;
  }

  const downloadImage = async (url, filename) => {
    try {
      const res = await axios.get(
        `https://natvidai.com/api/ai/download?url=${encodeURIComponent(url)}`,
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg shadow-sm bg-white overflow-hidden flex flex-col p-2"
            style={{ height: "400px" }}
          >

            {/* Top bar */}
            <div className="w-full flex items-center justify-between mb-1 px-1">

              {/* Filename (extension removed) */}
              <div
                className="text-xs font-medium text-gray-700 truncate max-w-[75%] cursor-pointer hover:text-gray-900 transition"
                onClick={() => console.log("Future rename:", item.filename)}
              >
                {item.filename.replace(/\.[^/.]+$/, "")}
              </div>

              {/* Download button */}
              <button
                onClick={() => downloadImage(item.url, item.filename)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded transition"
              >
                ⬇️
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={item.url}
                alt={item.filename}
                className="max-h-full max-w-full object-contain cursor-pointer"
                onClick={() => setPreview(item.url)}
              />
            </div>

          </div>
        ))}
      </div>

      {preview && <Lightbox src={preview} onClose={() => setPreview(null)} />}
    </>
  );
}
