import { useState } from "react";
import SideBar from "../components/SideBar";
import AIRequestForm from "../components/AIRequestForm";
import Results from "../components/Results";

function MainPage({ credits, setCredits }) {
  const [results, setResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("text-to-image"); // text-to-image, image-to-image, text-to-video
  const [model, setModel] = useState("default-model"); // placeholder
  const [aspectRatio, setAspectRatio] = useState("1:1"); // default ratio

  const addResult = (newResult) => {
    setResults((prev) => [newResult, ...prev]); // newest first
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 h-full`}
      >
        <SideBar
          credits={credits}
          setCredits={setCredits}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          model={model}
          setModel={setModel}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
        />
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Toggle button for mobile */}
        <button
          className="absolute top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "←" : "→"}
        </button>

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
            <AIRequestForm
              credit={credits}
              setCredits={setCredits}
              addResult={addResult}
              selectedOption={selectedOption}
              model={model}
              aspectRatio={aspectRatio}
            />
        </div>
      </main>
    </div>
  );
}

export default MainPage;
