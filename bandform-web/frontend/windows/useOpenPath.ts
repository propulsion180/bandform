import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useWindowManager, WindowKind } from "./WindowManagerContext";

// Singleton page windows reachable by a fixed nav path. Kept in one place so
// Header's nav buttons and any other "go to X" link behave identically.
const PATH_KIND: Record<string, WindowKind> = {
  "/discover": "discover",
  "/requests": "requests",
  "/profile": "profile",
  "/create-band": "create-band",
  "/admin": "admin",
};

// Navigates (so the URL/back-button stay meaningful) and opens/focuses the
// matching window directly -- doesn't rely solely on Desktop.tsx's
// location-change effect, which won't refire if the path hasn't changed
// (e.g. the window was closed while already "on" that path).
export function useOpenPath(): (path: string) => void {
  const navigate = useNavigate();
  const { openWindow } = useWindowManager();

  return useCallback(
    (path: string) => {
      navigate(path);
      const kind = PATH_KIND[path];
      if (kind) {
        openWindow({ id: kind, kind });
      }
    },
    [navigate, openWindow]
  );
}
