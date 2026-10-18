import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import IncidentsPage from './pages/IncidentsPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import DashboardPage from './pages/DashboardPage';
import TrafficPage from './pages/TrafficPage';
import RulesPage from './pages/RulesPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { PostmanQuickTestModal } from './components/dashboard/PostmanQuickTestModal';
import { AuthProvider, useAuth } from './context/AuthContext';

const LoginRouteWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <LoginPage
      onLoginSuccess={() => navigate('/overview')}
      onNavigateHome={() => navigate('/overview')}
    />
  );
};

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
};

const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/overview" replace />;
  }
  return <>{children}</>;
};

function AppRoutes() {
  const [isPostmanModalOpen, setIsPostmanModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-300">
      {/* Background Architectural Mesh & Diffuse White Light Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/40 dark:bg-white/[0.03] rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/[0.08] rounded-full blur-[130px]" />
      </div>

      <Routes>
        <Route path="/login" element={<LoginRouteWrapper />} />

        {/* Protected Application Routes */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<DashboardPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="incidents/:id" element={<IncidentDetailsPage />} />
          <Route path="traffic" element={<TrafficPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route
            path="users"
            element={
              <AdminOnlyRoute>
                <UsersPage />
              </AdminOnlyRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Postman Modal */}
      <PostmanQuickTestModal
        isOpen={isPostmanModalOpen}
        onClose={() => setIsPostmanModalOpen(false)}
        onSimulateAttack={() => setIsPostmanModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
