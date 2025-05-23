import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';

interface AppRouterProps {
  children: ReactNode;
}

/**
 * AppRouter component that wraps BrowserRouter
 * In a real implementation, we would add the future flags to prevent warnings,
 * but the current version of react-router-dom in the project doesn't support them yet.
 */
export const AppRouter = ({ children }: AppRouterProps) => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {children}
    </BrowserRouter>
  );
};

export default AppRouter;
