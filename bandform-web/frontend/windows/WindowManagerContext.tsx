import React, { createContext, useCallback, useContext, useState } from "react";

// Keep these in sync with --z-window-base / --z-window-nav in styles/tokens.scss.
export const Z_BASE = 100;
export const Z_NAV = 300;

export type WindowKind = "discover" | "requests" | "profile" | "create-band" | "admin" | "band-detail";

export interface OpenWindow {
  id: string;
  kind: WindowKind;
  bandId?: string;
}

interface WindowManagerContextValue {
  zIndexOf: (id: string, base?: number) => number;
  focus: (id: string) => void;
  isFocused: (id: string) => boolean;
  isMinimized: (id: string) => boolean;
  toggleMinimize: (id: string) => void;
  openWindows: OpenWindow[];
  openWindow: (win: OpenWindow) => void;
  closeWindow: (id: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  // Order in which windows were last focused, oldest first -- last entry is on top.
  const [order, setOrder] = useState<string[]>([]);
  const [minimized, setMinimized] = useState<Record<string, boolean>>({});
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  const focus = useCallback((id: string) => {
    setOrder((current) => (current[current.length - 1] === id ? current : [...current.filter((existing) => existing !== id), id]));
  }, []);

  const zIndexOf = useCallback(
    (id: string, base: number = Z_BASE) => {
      const index = order.indexOf(id);
      return base + (index === -1 ? 0 : index + 1);
    },
    [order]
  );

  const isFocused = useCallback((id: string) => order.length > 0 && order[order.length - 1] === id, [order]);

  const isMinimized = useCallback((id: string) => minimized[id] ?? false, [minimized]);

  const toggleMinimize = useCallback((id: string) => {
    setMinimized((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const openWindow = useCallback(
    (win: OpenWindow) => {
      setOpenWindows((current) => (current.some((existing) => existing.id === win.id) ? current : [...current, win]));
      setMinimized((current) => (current[win.id] ? { ...current, [win.id]: false } : current));
      focus(win.id);
    },
    [focus]
  );

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((current) => current.filter((existing) => existing.id !== id));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{ zIndexOf, focus, isFocused, isMinimized, toggleMinimize, openWindows, openWindow, closeWindow }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager(): WindowManagerContextValue {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error("useWindowManager must be used within a WindowManagerProvider");
  }
  return ctx;
}

// Shared by every place that links to a band (Discover, dashboard widgets,
// etc.) so clicking always opens/focuses that band's window immediately,
// rather than relying solely on the location-change effect in Desktop.tsx.
export function useOpenBandWindow(): (bandId: string) => void {
  const { openWindow } = useWindowManager();
  return useCallback((bandId: string) => openWindow({ id: `band-detail:${bandId}`, kind: "band-detail", bandId }), [openWindow]);
}
