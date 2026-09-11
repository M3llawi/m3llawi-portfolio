"use client";

import { useCallback, useRef, useState } from "react";

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
}: {
  beforeUrl: string;
  afterUrl: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
  };

  return (
    <div
      className="before-after"
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="before-after-layer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterUrl} alt={afterAlt} />
        <span className="before-after-tag before-after-tag-right">{afterLabel}</span>
      </div>
      <div className="before-after-layer" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeUrl} alt={beforeAlt} />
        <span className="before-after-tag before-after-tag-left">{beforeLabel}</span>
      </div>
      <div className="before-after-handle" style={{ left: `${position}%` }}>
        <div
          className="before-after-grip"
          role="slider"
          tabIndex={0}
          aria-label="Before/after comparison position"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          onPointerDown={onPointerDown}
          onKeyDown={onKeyDown}
        >
          <span>◂</span>
          <span>▸</span>
        </div>
      </div>
    </div>
  );
}
