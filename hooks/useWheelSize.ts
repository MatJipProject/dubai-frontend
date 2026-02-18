"use client";

import { useState, useEffect } from "react";

export function useWheelSize() {
  const [size, setSize] = useState(400);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 360) setSize(220);
      else if (w < 640) setSize(Math.min(260, w - 80));
      else if (w < 768) setSize(320);
      else setSize(400);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
