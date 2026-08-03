import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Header from "../components/Header";
import ProtectedRoute from "../auth/ProtectedRoute";
import Home from "./Home";
import Discover from "./Discover";
import BandDetail from "./BandDetail";
import BandCreator from "./BandCreator";
import Requests from "./Requests";
import Profile from "./Profile";
import Admin from "./Admin";

function BandDetailRoute() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <BandDetail bandId={id} />;
}

// Mobile-width fallback (< 768px): a normal one-page-at-a-time router, the
// same shape the app had before the windowed desktop existed. Desktop.tsx
// replaces this entirely at desktop widths.
export default function MobileApp() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/band/:id" element={<BandDetailRoute />} />
          <Route path="/create-band" element={<BandCreator />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}
