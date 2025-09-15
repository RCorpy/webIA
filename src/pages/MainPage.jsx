// src/pages/MainPage.jsx
import CreditDisplay from "../components/CreditDisplay";
import AIRequestForm from "../components/AIRequestForm";
import { useState } from "react";

function MainPage({ credits, setCredits }) {
  const [selectedOption, setSelectedOption] = useState("text-to-image");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Options</h2>
        <ul>
          <li
            className={`cursor-pointer p-2 rounded ${selectedOption === "text-to-image" ? "bg-gray-600" : ""}`}
            onClick={() => setSelectedOption("text-to-image")}
          >
            Text → Image
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${selectedOption === "image-to-image" ? "bg-gray-600" : ""}`}
            onClick={() => setSelectedOption("image-to-image")}
          >
            Text + Image → Image
          </li>
          <li
            className={`cursor-pointer p-2 rounded ${selectedOption === "text-to-video" ? "bg-gray-600" : ""}`}
            onClick={() => setSelectedOption("text-to-video")}
          >
            Text + Image → Video
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top half: results */}
        <div className="flex-1 p-4 overflow-auto bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <div className="border border-gray-300 rounded p-4 h-full">
            {/* Placeholder */}
            <p>No results yet...</p>
          </div>
        </div>

        {/* Bottom half: input */}
        <div className="p-4 border-t bg-white">
          <h2 className="text-lg font-semibold mb-2">Your Prompt</h2>
          <AIRequestForm setCredits={setCredits} />
          <CreditDisplay credits={credits} setCredits={setCredits} />
        </div>
      </main>
    </div>
  );
}

export default MainPage;
