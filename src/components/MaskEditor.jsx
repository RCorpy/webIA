import { useRef, useState, useEffect } from "react";

export default function MaskEditor({ imageBase64, existingMaskBase64, onClose, onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [brushSize, setBrushSize] = useState(20);
  const [mode, setMode] = useState("draw"); // "draw" or "erase"
  const [showMaskOnly, setShowMaskOnly] = useState(false);

  // Initialize drawing context
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "white";
    ctx.lineWidth = brushSize;

    // Draw existing mask
    if (existingMaskBase64) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = `data:image/png;base64,${existingMaskBase64}`;
    }
  }, [existingMaskBase64]);

  // Update brush size dynamically
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = brushSize;
  }, [brushSize]);

  const getCanvasCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    setIsDrawing(true);
    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const { x, y } = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 🧠 Set mode properly
    if (mode === "draw") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "white";
    } else {
      ctx.globalCompositeOperation = "destination-out";
    }

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPos({ x, y });
  };

  const handleSave = () => {
    const maskBase64 = canvasRef.current.toDataURL("image/png").split(",")[1];
    onSave(maskBase64);
    onClose();
  };

  const togglePreview = () => setShowMaskOnly((prev) => !prev);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-gray-900 rounded-lg shadow-lg p-4">
        <div className="relative">
          {!showMaskOnly && (
            <img
              src={`data:image/png;base64,${imageBase64}`}
              alt="Reference"
              className="w-[512px] h-[512px] object-contain rounded-lg"
            />
          )}
          <canvas
            ref={canvasRef}
            width={512}
            height={512}
            className={`absolute top-0 left-0 cursor-crosshair rounded-lg ${
              showMaskOnly ? "relative" : "absolute"
            }`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              backgroundColor: showMaskOnly ? "black" : "transparent",
              touchAction: "none",
            }}
          />
        </div>

        {/* 🧩 Toolbar */}
        <div className="flex items-center justify-between gap-4 mt-4">
          {/* Brush size */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Brush:</label>
            <input
              type="range"
              min="5"
              max="80"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-400 w-6 text-right">{brushSize}</span>
          </div>

          {/* Draw / Erase toggle */}
          <button
            onClick={() => setMode(mode === "draw" ? "erase" : "draw")}
            className={`px-3 py-1 rounded-lg text-white ${
              mode === "draw" ? "bg-blue-600" : "bg-red-600"
            }`}
          >
            {mode === "draw" ? "🖌️ Draw" : "🧽 Erase"}
          </button>

          {/* Preview toggle */}
          <button
            onClick={togglePreview}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg"
          >
            {showMaskOnly ? "👁️ Show Image" : "👁️ Show Mask"}
          </button>
        </div>

        {/* 🧭 Bottom buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg"
          >
            Save Mask
          </button>
        </div>
      </div>
    </div>
  );
}
