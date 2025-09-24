import React, { useState, useRef, useEffect } from "react";

export default function Lightbox({ src, onClose }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imgOffsetStart = useRef({ x: 0, y: 0 });
  const lastDistance = useRef(null);

  // Drag events
  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY,
    };
    imgOffsetStart.current = { ...offset };
  };

  const duringDrag = (e) => {
    if (!dragging) return;
    if (e.touches && e.touches.length === 2) return; // pinch handled separately
    const x = (e.clientX || e.touches[0].clientX) - dragStart.current.x;
    const y = (e.clientY || e.touches[0].clientY) - dragStart.current.y;
    setOffset({
      x: imgOffsetStart.current.x + x,
      y: imgOffsetStart.current.y + y,
    });
  };

  const endDrag = () => setDragging(false);

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  // Pinch-to-zoom for mobile
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const [touch1, touch2] = e.touches;
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      if (lastDistance.current) {
        const delta = (distance - lastDistance.current) / 200; // scale sensitivity
        setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 5));
      }
      lastDistance.current = distance;
    } else {
      duringDrag(e);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) lastDistance.current = null;
    endDrag();
  };

  // Reset zoom/pan when closed
  useEffect(() => {
    if (!src) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [src]);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 overflow-hidden"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Preview"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          cursor: dragging ? "grabbing" : "grab",
          transition: dragging ? "none" : "transform 0.1s ease-out",
          maxWidth: "90%",
          maxHeight: "90%",
        }}
        onMouseDown={startDrag}
        onMouseMove={duringDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={startDrag}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        ✖
      </button>
    </div>
  );
}
