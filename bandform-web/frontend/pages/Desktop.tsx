import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../auth/AuthContext";
import { YourBandsWidget, RequestsWidget, RecommendedBandsWidget } from "./DashboardWidgets";
import WindowFrame from "../windows/WindowFrame";
import { useWindowManager, WindowKind } from "../windows/WindowManagerContext";
import { centeredRow, cascadeFromCenter } from "../windows/layout";
import Discover from "./Discover";
import Requests from "./Requests";
import Profile from "./Profile";
import BandCreator from "./BandCreator";
import Admin from "./Admin";
import Monitoring from "./Monitoring";
import BandDetail from "./BandDetail";

const DASHBOARD_WIDGET_Y = 96;
const DASHBOARD_WIDGET_GAP = 24;
const DASHBOARD_WIDGETS: { id: string; title: string; size: { width: number; height: number } }[] = [
  { id: "home:your-bands", title: "Your bands", size: { width: 340, height: 320 } },
  { id: "home:quick-actions", title: "Quick actions", size: { width: 300, height: 220 } },
  { id: "home:recommended", title: "Recommended for you", size: { width: 360, height: 400 } },
];

const WINDOW_SIZES: Record<WindowKind, { width: number; height: number }> = {
  discover: { width: 560, height: 520 },
  requests: { width: 520, height: 480 },
  profile: { width: 480, height: 560 },
  "create-band": { width: 480, height: 560 },
  admin: { width: 640, height: 520 },
  monitoring: { width: 720, height: 620 },
  "band-detail": { width: 600, height: 640 },
};

const WINDOW_TITLES: Record<WindowKind, string> = {
  discover: "Discover bands",
  requests: "Requests",
  profile: "Your profile",
  "create-band": "Create a band",
  admin: "Admin",
  monitoring: "Monitoring",
  "band-detail": "Band",
};

const PATH_TO_WINDOW: { pattern: RegExp; toWindow: (match: RegExpMatchArray) => { id: string; kind: WindowKind; bandId?: string } }[] = [
  { pattern: /^\/discover$/, toWindow: () => ({ id: "discover", kind: "discover" }) },
  { pattern: /^\/requests$/, toWindow: () => ({ id: "requests", kind: "requests" }) },
  { pattern: /^\/profile$/, toWindow: () => ({ id: "profile", kind: "profile" }) },
  { pattern: /^\/create-band$/, toWindow: () => ({ id: "create-band", kind: "create-band" }) },
  { pattern: /^\/admin$/, toWindow: () => ({ id: "admin", kind: "admin" }) },
  { pattern: /^\/monitoring$/, toWindow: () => ({ id: "monitoring", kind: "monitoring" }) },
  {
    pattern: /^\/band\/([^/]+)$/,
    toWindow: (match) => ({ id: `band-detail:${match[1]}`, kind: "band-detail", bandId: match[1] }),
  },
];

export default function Desktop() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { openWindows, openWindow, closeWindow } = useWindowManager();

  // Covers direct URL loads and browser back/forward -- click-driven opens
  // (nav buttons, band links) call openWindow directly and don't rely on this.
  useEffect(() => {
    for (const { pattern, toWindow } of PATH_TO_WINDOW) {
      const match = location.pathname.match(pattern);
      if (!match) continue;
      const win = toWindow(match);
      if ((win.kind === "admin" || win.kind === "monitoring") && !isAdmin) {
        navigate("/", { replace: true });
        return;
      }
      openWindow(win);
      return;
    }
  }, [location.pathname]);

  const widgetPositions = centeredRow(
    DASHBOARD_WIDGETS.map((w) => w.size),
    DASHBOARD_WIDGET_Y,
    DASHBOARD_WIDGET_GAP
  );

  return (
    <div className="app-shell">
      <Header />
      <div className="window-canvas">
        <WindowFrame
          id={DASHBOARD_WIDGETS[0].id}
          title={DASHBOARD_WIDGETS[0].title}
          defaultPosition={widgetPositions[0]}
          defaultSize={DASHBOARD_WIDGETS[0].size}
        >
          <YourBandsWidget />
        </WindowFrame>
        <WindowFrame
          id={DASHBOARD_WIDGETS[1].id}
          title={DASHBOARD_WIDGETS[1].title}
          defaultPosition={widgetPositions[1]}
          defaultSize={DASHBOARD_WIDGETS[1].size}
        >
          <RequestsWidget />
        </WindowFrame>
        <WindowFrame
          id={DASHBOARD_WIDGETS[2].id}
          title={DASHBOARD_WIDGETS[2].title}
          defaultPosition={widgetPositions[2]}
          defaultSize={DASHBOARD_WIDGETS[2].size}
        >
          <RecommendedBandsWidget />
        </WindowFrame>

        {openWindows.map((win, index) => {
          const size = WINDOW_SIZES[win.kind];
          return (
            <WindowFrame
              key={win.id}
              id={win.id}
              title={WINDOW_TITLES[win.kind]}
              defaultPosition={cascadeFromCenter(index, size)}
              defaultSize={size}
              onClose={() => closeWindow(win.id)}
            >
              {win.kind === "discover" && <Discover />}
              {win.kind === "requests" && <Requests />}
              {win.kind === "profile" && <Profile />}
              {win.kind === "create-band" && <BandCreator />}
              {win.kind === "admin" && <Admin />}
              {win.kind === "monitoring" && <Monitoring />}
              {win.kind === "band-detail" && win.bandId && <BandDetail bandId={win.bandId} />}
            </WindowFrame>
          );
        })}
      </div>
    </div>
  );
}
