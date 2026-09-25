import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import CompaniesPage from './pages/CompaniesPage';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import JobDetailModal from './components/JobDetailModal';
import ApplyModal from './components/ApplyModal';
import AuthModal from './components/AuthModal';
import NotificationModal from './components/NotificationModal';

function MainApp() {
  const { user, role, isLoggedIn, applications } = useAuth();
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'jobs', 'companies', 'student-dashboard', 'company-dashboard', 'admin-dashboard', 'profile'

  // Modal states
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null); // 'login', 'register', or null
  const [showNotifModal, setShowNotifModal] = useState(false);

  const appliedJobIds = new Set(
    applications
      .filter((a) => a.studentUserId === user?.id)
      .map((a) => a.jobId)
  );

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
  };

  const handleSelectJob = (job) => {
    setSelectedJobForDetail(job);
  };

  const handleApplyJob = (job) => {
    if (!isLoggedIn) {
      setAuthModalMode('login');
      return;
    }
    setSelectedJobForApply(job);
  };

  const handleCompanySelectJobs = (companyName) => {
    setActiveTab('jobs');
  };

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenNotifs={() => setShowNotifModal(true)}
      />

      <main className="main-content-body">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={setActiveTab}
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsPage
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
          />
        )}

        {activeTab === 'companies' && (
          <CompaniesPage
            onSelectCompanyJobs={handleCompanySelectJobs}
          />
        )}

        {activeTab === 'student-dashboard' && (
          <StudentDashboard
            onSelectJob={handleSelectJob}
            onApplyJob={handleApplyJob}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'company-dashboard' && (
          <CompanyDashboard />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {activeTab === 'profile' && (
          <ProfilePage />
        )}
      </main>

      <Footer />

      {/* MODALS */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
          onApply={handleApplyJob}
          isApplied={appliedJobIds.has(selectedJobForDetail.id)}
          isStudent={role === 'ROLE_STUDENT'}
        />
      )}

      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            setSelectedJobForApply(null);
            setActiveTab('student-dashboard');
          }}
        />
      )}

      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {showNotifModal && (
        <NotificationModal
          onClose={() => setShowNotifModal(false)}
          onNavigate={(tab) => {
            setShowNotifModal(false);
            setActiveTab(tab);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
