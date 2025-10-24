// src/components/SideBar.jsx
import { useState } from "react";
import CreditDisplay from "./CreditDisplay";
import AuthButton from "./AuthButton";

export default function SideBar({ credits, setCredits, selectedOption, setSelectedOption, model, setModel, aspectRatio, setAspectRatio, dimensions, setDimensions,inputImage, setInputImage, isRaw, setIsRaw }) {

  const menuItems = [
    { key: "text-to-image", label: "Text → Image" },
    { key: "image-to-image", label: "Text + Image → Image" },
    { key: "text-to-video", label: "Text + Image → Video" },
  ];

  return (
    <aside className="h-full w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">Options</h2>
      </div>

      <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`cursor-pointer p-2 rounded-lg transition ${
              selectedOption === item.key ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
            onClick={() => {
              setSelectedOption(item.key);
              // Reset model when menu changes
              if (item.key === "text-to-image") {
                setModel("kontext-model");
              } else if (item.key === "image-to-image") {
                setModel("kontext-model");
              } else if (item.key === "text-to-video") {
                setModel("video-model"); // placeholder until we know the API
              }
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>

      <div className="p-4 border-t border-gray-700 text-white flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Model</h3>
          <select
            value={model}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 rounded text-white"
          >
            {selectedOption === "text-to-image" && (
              <>
                <option className="text-black" value="kontext-model">Kontext Model</option>
                <option className="text-black" value="flux-pro-1.1-model">Flux-pro-1.1 model</option>
                <option className="text-black" value="flux-pro-1.1-ultra-model">Flux-pro-1.1 ULTRA model</option>
              </>
            )}
            {selectedOption === "image-to-image" && (
              <>
                <option className="text-black" value="kontext-model">Kontext</option>
                <option  className="text-black" value="flux-pro-1.1-ultra-model">Ultra</option>
                <option  className="text-black" value="flux-pro-1.0-fill-model">Fill</option>
              </>
            )}
          </select>
        </div>

        <div>

        {selectedOption === "text-to-image" && (<>
          {model === "flux-pro-1.1-model" ? (<>
            <h3 className="text-sm font-semibold mb-2">
              {model === "flux-pro-1.1-model" ? "Dimensions" : "Aspect Ratio"}
            </h3>
            <div className="flex flex-col gap-2">
              <div className="relative w-full">
                <label className="block text-xs mb-1 text-white">Width</label>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || "";
                    setDimensions((prev) => ({ ...prev, width: value }));
                  }}
                  onBlur={() => {
                    let value = dimensions.width || 64;
                    if (value > 1440) value = 1440;
                    if (value < 64) value = 64;
                    value = Math.round(value / 32) * 32;
                    setDimensions((prev) => ({ ...prev, width: value }));
                  }}
                  className="w-full p-2 rounded text-white pr-10"
                  placeholder="Width"
                  min={64}
                  step={32}
                />
                <span className="absolute right-2 top-[38px] -translate-y-1/2 text-white text-sm">
                  px
                </span>
              </div>

              <div className="relative w-full">
                <label className="block text-xs mb-1 text-white">Height</label>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || "";
                    setDimensions((prev) => ({ ...prev, height: value }));
                  }}
                  onBlur={() => {
                    let value = dimensions.height || 64;
                    if (value > 1440) value = 1440;
                    if (value < 64) value = 64;
                    value = Math.round(value / 32) * 32;
                    setDimensions((prev) => ({ ...prev, height: value }));
                  }}
                  className="w-full p-2 rounded text-white pr-10"
                  placeholder="Height"
                  min={64}
                  step={32}
                />
                <span className="absolute right-2 top-[38px] -translate-y-1/2 text-white text-sm">
                  px
                </span>
              </div>
            </div></>
                    ) : (
                      <select 
                        value={aspectRatio}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full p-2 rounded text-white"
                      >
                        <option className="text-black" value="1:1">Square (1:1)</option>
                        <option className="text-black" value="16:9">Landscape (16:9)</option>
                        <option className="text-black" value="9:16">Portrait (9:16)</option>
                      </select>
                    )}
                    {model === "flux-pro-1.1-ultra-model" && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">
                          Raw
                        </h3>
                        <select 
                          value={isRaw}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setIsRaw(e.target.value)}
                          className="w-full p-2 rounded text-white"
                        >
                          <option className="text-black" value={false}>Normal</option>
                          <option className="text-black" value={true}>Raw</option>
                        </select>
                      </div>
                    )}
                  </>)}

{selectedOption === "image-to-image" && (
  <>
    {/* Clickable Image Preview */}
    <div
      className="flex justify-center mb-3 cursor-pointer"
      onClick={() => document.getElementById("image-upload-input").click()}
    >
      {inputImage ? (
        <img
          src={`data:image/png;base64,${inputImage}`}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md hover:opacity-80 transition"
        />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-600 text-sm text-gray-400 hover:bg-gray-800 transition">
          Click to upload
        </div>
      )}
    </div>

    {/* Hidden File Input */}
    <input
      id="image-upload-input"
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(",")[1];
            setInputImage(base64);
          };
          reader.readAsDataURL(file);
        }
      }}
      className="hidden"
    />

    {/* Aspect Ratio Selector */}
    <select
      value={aspectRatio}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setAspectRatio(e.target.value)}
      className="w-full p-2 rounded text-white bg-gray-800 border border-gray-600"
    >
      <option className="text-black" value="1:1">Square (1:1)</option>
      <option className="text-black" value="16:9">Landscape (16:9)</option>
      <option className="text-black" value="9:16">Portrait (9:16)</option>
    </select>
  </>
)}


        </div>

        <CreditDisplay credits={credits} setCredits={setCredits} />
        <AuthButton />
      </div>
    </aside>
  );
}