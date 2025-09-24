import SideBar from "../components/SideBar";
import AIRequestForm from "../components/AIRequestForm";
import Results from "../components/Results";
import { useState } from "react";

function MainPage({ credits, setCredits }) {
  const [results, setResults] = useState([]);

  const addResult = (newResult) => {
    setResults((prev) => [newResult, ...prev]); // newest first
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar credits={credits} setCredits={setCredits} />

      <main className="flex-1 flex flex-col">
        {/* Top half: results */}
        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="border border-gray-300 rounded-lg bg-white p-6 shadow-sm">
            <Results results={results} />
          </div>
        </div>

        {/* Bottom half: input */}
        <div className="p-6 border-t bg-white shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Prompt</h2>
          <AIRequestForm setCredits={setCredits} addResult={addResult} />
        </div>
      </main>
    </div>
  );
}

export default MainPage;
