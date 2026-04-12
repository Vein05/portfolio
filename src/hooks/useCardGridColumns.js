import { useState, useEffect } from "react";

/** Tailwind sm (640px) / lg (1024px); column count is capped at maxCols (e.g. Papers: 2, Projects: 3). */
export function computeCardGridColumns(maxCols, windowWidth) {
  const w =
    windowWidth ??
    (typeof window !== "undefined" ? window.innerWidth : 1024);
  if (w >= 1024) return Math.min(3, maxCols);
  if (w >= 640) return Math.min(2, maxCols);
  return 1;
}

export function useCardGridColumns(maxCols = 3) {
  const [cols, setCols] = useState(() =>
    typeof window !== "undefined"
      ? computeCardGridColumns(maxCols, window.innerWidth)
      : Math.min(3, maxCols)
  );

  useEffect(() => {
    const onChange = () =>
      setCols(computeCardGridColumns(maxCols, window.innerWidth));
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    mqLg.addEventListener("change", onChange);
    mqSm.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    onChange();
    return () => {
      mqLg.removeEventListener("change", onChange);
      mqSm.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [maxCols]);

  return cols;
}

export function rowIndexForItem(itemIndex, cols) {
  return Math.floor(itemIndex / cols);
}

export function rowStartIndices(length, cols) {
  const rows = [];
  for (let i = 0; i < length; i += cols) {
    rows.push(i);
  }
  return rows;
}
