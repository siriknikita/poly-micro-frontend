import React from 'react';
import { AppRouter } from '@/components/shared/AppRouter';
import { ProjectProvider } from '@/context/ProjectContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from 'react-toastify';
import { GuidanceProvider } from '@/context/GuidanceContext';
import { User } from '@/db/db';

// Interface for providers props
interface ProvidersProps {
  children: React.ReactNode;
}

// Add any providers that components need to the wrapper
function AllProviders({ children }: ProvidersProps): JSX.Element {
  // Mock user for GuidanceProvider
  const mockUser: User = {
    id: 'test-user',
    username: 'testuser',
    email: 'test@example.com',
    businessName: 'Test Business',
    password: 'password123',
    hasCompletedOnboarding: true,
  };

  return (
    <AppRouter>
      <ProjectProvider>
        <ToastProvider>
          <GuidanceProvider currentUser={mockUser}>
            {children}
            <ToastContainer />
          </GuidanceProvider>
        </ToastProvider>
      </ProjectProvider>
    </AppRouter>
  );
}

export default AllProviders;
