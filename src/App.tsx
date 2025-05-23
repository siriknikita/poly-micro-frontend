import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { RegisterForm, LoginForm } from './components/auth';
import { ProjectProvider } from './context/ProjectContext';
import { ToastProvider } from './context/ToastContext';
import { ReleaseProvider } from './context/ReleaseContext';
import { GuidanceProvider } from './context/GuidanceContext';
import { ReleaseModal, ReleaseNotification, ReleaseDebug } from './components/releases';
import { WelcomeGuidance, CompletionGuidance } from './components/guidance';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import autoSyncReleases from './utils/releaseSync';
import { useAuth } from './components/auth/hooks/useAuth';
import { AppLayout } from './components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  // Auto-sync releases when the app starts
  useEffect(() => {
    autoSyncReleases();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Handle navigation after logout
  useEffect(() => {
    if (
      !isAuthenticated &&
      !window.location.pathname.includes('/login') &&
      !window.location.pathname.includes('/register')
    ) {
      // Use navigate instead of direct window.location modification
      // to preserve React context and state
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <ProjectProvider>
      <ToastProvider>
        <ReleaseProvider>
          <GuidanceProvider currentUser={user}>
            <Routes>
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/dashboard" element={<AppLayout />} />
              <Route path="/monitoring" element={<AppLayout />} />
              <Route path="/cicd" element={<AppLayout />} />
              <Route path="/testing" element={<AppLayout />} />
              <Route path="/help" element={<AppLayout />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
            <ToastContainer />
            <ReleaseModal />
            <ReleaseNotification />
            <ReleaseDebug />
            <WelcomeGuidance />
            <CompletionGuidance />
          </GuidanceProvider>
        </ReleaseProvider>
      </ToastProvider>
    </ProjectProvider>
  );
}

export default App;
