import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Discover from "./pages/Discover";
import BandDetail from "./pages/BandDetail";
import BandCreator from "./pages/BandCreator";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { useAuth } from "./auth/AuthContext";

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/band/:id" element={<BandDetail />} />
          <Route path="/create-band" element={<BandCreator />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
