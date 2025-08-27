import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import AppWrapper from "@/components/AppWrapper";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CpDetail from "@/pages/CpDetail.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import Reports from "./pages/Reports";
import DiagnoseList from "@/pages/DiagnoseList.jsx";
import DiagnoseDetail from "@/pages/DiagnoseDetail.jsx";
import NormalUserApp from "./user/NormalUserApp";
import { Protected, RequireRole } from "@/lib/roles";
// import AdminApp from "@/admin/AdminApp";
import AdminApp from "@/pages/Dashboard";
import WelcomeScreen from "./pages/WelcomeScreen";

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
}

function AuthRedirect() {
  const { isAuth, user } = useAuth();

  if (isAuth) {
    if (user.role === "user") {
      return <Navigate to="/app" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <WelcomeScreen />;
}

export default function App() {
  return (
    <AppWrapper>
      <Routes>
        {/* Initial route - redirects to splash */}
        <Route path="/" element={<Navigate to="/splash" replace />} />
        {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Public routes that don't require authentication */}
        <Route path="/home" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:uid/:token"
          element={<ResetPasswordConfirm />}
        />

        {/* Protected routes that require authentication */}
        <Route
          path="/cp/:id"
          element={
            <ProtectedRoute>
              <CpDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnose"
          element={
            <ProtectedRoute>
              <DiagnoseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnose/:id"
          element={
            <ProtectedRoute>
              <DiagnoseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Main app routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin area (super_admin only) */}
        <Route
          path="/admin/*"
          element={
            <Protected>
              <RequireRole allow={["super_admin"]} redirect="/app">
                <AdminApp />
              </RequireRole>
            </Protected>
          }
        />

        {/* Normal user area */}
        <Route
          path="/app/*"
          element={
            <Protected>
              <RequireRole allow={["user"]} redirect="/">
                <NormalUserApp />
              </RequireRole>
            </Protected>
          }
        />

        {/* Fallback - redirect to appropriate screen */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppWrapper>
  );
}
