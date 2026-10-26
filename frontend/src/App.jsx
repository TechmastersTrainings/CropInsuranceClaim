import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useApp } from "./context/AppContext";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { WorkingProcedurePage } from "./pages/WorkingProcedurePage";
import { AuthPage } from "./pages/AuthPage";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { FarmRegistryPage } from "./pages/FarmRegistryPage";
import { FarmDetailsPage } from "./pages/FarmDetailsPage";
import { CropRegistrationPage } from "./pages/CropRegistrationPage";
import { PolicyListingPage } from "./pages/PolicyListingPage";
import { PolicyDetailsPage } from "./pages/PolicyDetailsPage";
import { ClaimSubmissionWizard } from "./pages/ClaimSubmissionWizard";
import { EvidenceUploadPage } from "./pages/EvidenceUploadPage";
import { ClaimTrackingPage } from "./pages/ClaimTrackingPage";
import { ClaimDetailPage } from "./pages/ClaimDetailPage";
import { AIAssessmentPage } from "./pages/AIAssessmentPage";
import { IoTMonitoringPage } from "./pages/IoTMonitoringPage";
import { DeviceManagementPage } from "./pages/DeviceManagementPage";
import { BlockchainLedgerPage } from "./pages/BlockchainLedgerPage";
import { InsurerDashboard } from "./pages/InsurerDashboard";
import { ClaimReviewPage } from "./pages/ClaimReviewPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CropConfigPage } from "./pages/CropConfigPage";
import { PolicyConfigPage } from "./pages/PolicyConfigPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AuditLogsPage } from "./pages/AuditLogsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SystemStatesPage } from "./pages/SystemStatesPage";

function AppShell() {
  const { user } = useApp();
  const location = useLocation();

  // Public routes do not display the left sidebar workspace panel
  const isPublicPage =
    location.pathname === "/" ||
    location.pathname === "/working-procedure" ||
    location.pathname.startsWith("/auth");

  // Show left sidebar ONLY when a user is authenticated AND inside their workspace
  const showSidebar = Boolean(user) && !isPublicPage;

  const content = (
    <>
      <Header />
      <main style={{ flex: 1, minHeight: "calc(100vh - 140px)" }}>
        <Routes>
          {/* Public Homepage & Operational Guides */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/working-procedure" element={<WorkingProcedurePage />} />

          {/* Dedicated Persona Authentication & Registration */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/:targetRole" element={<AuthPage />} />

          {/* Public Policy Directory */}
          <Route path="/policies" element={<PolicyListingPage />} />
          <Route path="/policies/:policyId" element={<PolicyDetailsPage />} />

          {/* Farmer Protected Modules */}
          <Route
            path="/farmer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "ADMIN"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farms"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "ADMIN"]}>
                <FarmRegistryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farms/:farmId"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "ADMIN"]}>
                <FarmDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crops"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "ADMIN"]}>
                <CropRegistrationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claim-wizard"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "ADMIN"]}>
                <ClaimSubmissionWizard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN", "AUDITOR"]}>
                <ClaimTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claims/:claimId"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN", "AUDITOR"]}>
                <ClaimDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evidence"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN"]}>
                <EvidenceUploadPage />
              </ProtectedRoute>
            }
          />

          {/* Insurer / Underwriter Protected Modules */}
          <Route
            path="/insurer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["INSURER", "ADMIN", "AUDITOR"]}>
                <InsurerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claim-reviews"
            element={
              <ProtectedRoute allowedRoles={["INSURER", "ADMIN", "AUDITOR"]}>
                <ClaimReviewPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Modules */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-config"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CropConfigPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/policy-config"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <PolicyConfigPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DeviceManagementPage />
              </ProtectedRoute>
            }
          />

          {/* AI, IoT & Blockchain Deep Inspection (Authenticated) */}
          <Route
            path="/ai-assessment"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN", "AUDITOR"]}>
                <AIAssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/iot"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN", "AUDITOR"]}>
                <IoTMonitoringPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blockchain"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN", "AUDITOR"]}>
                <BlockchainLedgerPage />
              </ProtectedRoute>
            }
          />

          {/* System & Support (Authenticated) */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN", "AUDITOR"]}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute allowedRoles={["INSURER", "ADMIN", "AUDITOR"]}>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["FARMER", "INSURER", "ADMIN", "AUDITOR"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/system-states"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "AUDITOR"]}>
                <SystemStatesPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );

  if (showSidebar) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content-wrapper">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="main-content-wrapper" style={{ minHeight: "100vh" }}>
      {content}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
