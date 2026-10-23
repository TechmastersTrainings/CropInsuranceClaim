import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";

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

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content-wrapper">
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Homepage */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/working-procedure" element={<WorkingProcedurePage />} />
              
              {/* Authentication */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Farmer Module */}
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/farms" element={<FarmRegistryPage />} />
              <Route path="/farms/:farmId" element={<FarmDetailsPage />} />
              <Route path="/crops" element={<CropRegistrationPage />} />
              
              {/* Policies */}
              <Route path="/policies" element={<PolicyListingPage />} />
              <Route path="/policies/:policyId" element={<PolicyDetailsPage />} />
              
              {/* Claims Workflow */}
              <Route path="/claim-wizard" element={<ClaimSubmissionWizard />} />
              <Route path="/claims" element={<ClaimTrackingPage />} />
              <Route path="/claims/:claimId" element={<ClaimDetailPage />} />
              <Route path="/evidence" element={<EvidenceUploadPage />} />
              
              {/* AI & IoT */}
              <Route path="/ai-assessment" element={<AIAssessmentPage />} />
              <Route path="/iot" element={<IoTMonitoringPage />} />
              <Route path="/devices" element={<DeviceManagementPage />} />
              
              {/* Blockchain */}
              <Route path="/blockchain" element={<BlockchainLedgerPage />} />
              
              {/* Insurer Module */}
              <Route path="/insurer-dashboard" element={<InsurerDashboard />} />
              <Route path="/claim-reviews" element={<ClaimReviewPage />} />
              
              {/* Admin Module */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/crop-config" element={<CropConfigPage />} />
              <Route path="/policy-config" element={<PolicyConfigPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              
              {/* System & Support */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/system-states" element={<SystemStatesPage />} />
              
              {/* Catch-all */}
              <Route path="*" element={<SystemStatesPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}
