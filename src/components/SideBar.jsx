// src/components/SideBar.jsx
import { useState } from "react";
import CreditDisplay from "./CreditDisplay";
import AuthButton from "./AuthButton";

export default function SideBar({ credits, setCredits }) {
  const [selectedOption, setSelectedOption] = useState("text-to-image");

  const menuItems = [
    { key: "text-to-image", label: "Text → Image" },
    { key: "image-to-image", label: "Text + Image → Image" },
    { key: "text-to-video", label: "Text + Image → Video" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Options</h2>
      </div>

      <ul className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`cursor-pointer p-2 rounded-lg transition ${
              selectedOption === item.key ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => setSelectedOption(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <div className="p-4 border-t border-gray-700 flex flex-col gap-4">
        <CreditDisplay credits={credits} setCredits={setCredits} />
        <AuthButton />
      </div>
    </aside>
  );
}
