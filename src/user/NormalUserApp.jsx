import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import MapPage from "./pages/MapPage";
import NearbyPage from "./pages/NearbyPage";
import ProfilePage from "./pages/ProfilePage";
import TimelinePage from "./pages/TimelinePage";
import CPDetailPage from "./pages/CPDetailPage";

export default function NormalUserApp() {
  return (
    <UserDashboardLayout>
      <Routes>
        <Route index element={<Navigate to="map" />} />
        <Route path="map" element={<MapPage />} />
        <Route path="map/:cpId" element={<CPDetailPage />} />
        <Route path="map/by-code/:code" element={<CPDetailPage byCode />} />
        <Route path="nearby" element={<NearbyPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="*" element={<h1 className="p-4">Not found</h1>} />
      </Routes>
    </UserDashboardLayout>
  );
}
