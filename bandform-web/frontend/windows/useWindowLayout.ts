import { useCallback, useState } from "react";

export interface WindowLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

function storageKey(id: string): string {
  return `bandform-window:${id}`;
}

// Keeps a persisted layout inside the current viewport -- guards against a
// position/size saved on a bigger screen being unreachable on a smaller one.
function clampToViewport(layout: WindowLayout): WindowLayout {
  if (typeof window === "undefined") return layout;
  const maxWidth = Math.max(window.innerWidth - 16, 220);
  const maxHeight = Math.max(window.innerHeight - 16, 120);
  const width = Math.min(layout.width, maxWidth);
  const height = Math.min(layout.height, maxHeight);
  const x = Math.min(Math.max(layout.x, 0), Math.max(window.innerWidth - width, 0));
  const y = Math.min(Math.max(layout.y, 0), Math.max(window.innerHeight - height, 0));
  return { x, y, width, height };
}

function readStoredLayout(id: string): WindowLayout | null {
  try {
    const raw = localStorage.getItem(storageKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.x === "number" &&
      typeof parsed?.y === "number" &&
      typeof parsed?.width === "number" &&
      typeof parsed?.height === "number"
    ) {
      return parsed;
    }
  } catch {
    // malformed/unavailable storage -- fall back to defaults
  }
  return null;
}

export function useWindowLayout(
  id: string,
  defaultPosition: { x: number; y: number },
  defaultSize: { width: number; height: number }
): [WindowLayout, (next: WindowLayout) => void] {
  const [layout, setLayoutState] = useState<WindowLayout>(() =>
    clampToViewport(readStoredLayout(id) ?? { ...defaultPosition, ...defaultSize })
  );

  const setLayout = useCallback(
    (next: WindowLayout) => {
      const clamped = clampToViewport(next);
      setLayoutState(clamped);
      try {
        localStorage.setItem(storageKey(id), JSON.stringify(clamped));
      } catch {
        // storage unavailable (e.g. private browsing) -- layout just won't persist
      }
    },
    [id]
  );

  return [layout, setLayout];
}
