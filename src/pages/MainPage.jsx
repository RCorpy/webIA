// src/pages/MainPage.jsx
import CreditDisplay from "../components/CreditDisplay";
import AIRequestForm from "../components/AIRequestForm";
import { useState } from "react";
import AuthButton from "../components/AuthButton";

function MainPage({ credits, setCredits }) {
  const [selectedOption, setSelectedOption] = useState("text-to-image");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Options</h2>
        </div>
        <ul className="flex-1 p-4 space-y-2">
          <li
            className={`cursor-pointer p-2 rounded-lg transition ${
              selectedOption === "text-to-image"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setSelectedOption("text-to-image")}
          >
            Text → Image
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg transition ${
              selectedOption === "image-to-image"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setSelectedOption("image-to-image")}
          >
            Text + Image → Image
          </li>
          <li
            className={`cursor-pointer p-2 rounded-lg transition ${
              selectedOption === "text-to-video"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
            onClick={() => setSelectedOption("text-to-video")}
          >
            Text + Image → Video
          </li>
        </ul>
        <div className="p-4 border-t border-gray-700">
          <AuthButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top half: results */}
        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="border border-gray-300 rounded-lg bg-white p-6 h-full shadow-sm">
            {/* Placeholder */}
            <p className="text-gray-500">No results yet...</p>
          </div>
        </div>

        {/* Bottom half: input */}
        <div className="p-6 border-t bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Prompt</h2>
          <AIRequestForm setCredits={setCredits} />
          <CreditDisplay credits={credits} setCredits={setCredits} />
        </div>
      </main>
    </div>
  );
}

export default MainPage;
