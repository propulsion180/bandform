import React from "react";
import { BrowserRouter as Router, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Desktop from "./pages/Desktop";
import MobileApp from "./pages/MobileApp";
import { useAuth } from "./auth/AuthContext";
import { WindowManagerProvider } from "./windows/WindowManagerContext";
import { useIsDesktopViewport } from "./windows/useIsDesktopViewport";

const RootSwitch: React.FC = () => {
  const { user, loading } = useAuth();
  const isDesktop = useIsDesktopViewport();
  const location = useLocation();

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (location.pathname === "/login") return <Login />;
  if (location.pathname === "/signup") return <Signup />;

  if (!user) {
    if (location.pathname === "/") {
      return (
        <>
          <Header />
          <Landing />
        </>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return isDesktop ? <Desktop /> : <MobileApp />;
};

const App: React.FC = () => (
  <Router>
    <WindowManagerProvider>
      <RootSwitch />
    </WindowManagerProvider>
  </Router>
);

export default App;
