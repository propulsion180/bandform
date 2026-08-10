import React from "react";
import { useAuth } from "../auth/AuthContext";
import { YourBandsWidget, RequestsWidget, RecommendedBandsWidget } from "./DashboardWidgets";

// Mobile-width fallback only -- the desktop dashboard (Desktop.tsx) renders
// these same widgets as draggable windows instead.
export default function Home() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="page">
      <div className="section-title">Your bands</div>
      <YourBandsWidget />
      <RequestsWidget />
      <div className="section-title">Recommended for you</div>
      <RecommendedBandsWidget />
    </div>
  );
}
