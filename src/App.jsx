import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import { NotifProvider } from './context/NotifContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import CeoDashboard from './pages/CeoDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TicketDetail from './pages/TicketDetail';
import { bootstrap } from './utils/storage';
import { useAuth } from './context/AuthContext';

// Bootstrap seed data once on first load
bootstrap();

// Layout wraps every protected page with Navbar
function AppLayout({ children, onToggleDark, isDark }) {
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-950">
        <Navbar onToggleDark={onToggleDark} isDark={isDark} />
        <main>{children}</main>
      </div>
    </div>
  );
}

// Root redirect: send logged-in users to their dashboard
function RootRedirect() {
  const { user } = useAuth();
  if (user) return <Navigate to={`/${user.role}-dashboard`} replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const toggleDark = () => setIsDark(d => !d);

  // Apply dark class to html element
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else        document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <NotifProvider>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RootRedirect />} />

              {/* Protected */}
              <Route path="/ceo-dashboard" element={
                <ProtectedRoute roles={['ceo']}>
                  <AppLayout onToggleDark={toggleDark} isDark={isDark}>
                    <CeoDashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/manager-dashboard" element={
                <ProtectedRoute roles={['manager']}>
                  <AppLayout onToggleDark={toggleDark} isDark={isDark}>
                    <ManagerDashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/employee-dashboard" element={
                <ProtectedRoute roles={['employee']}>
                  <AppLayout onToggleDark={toggleDark} isDark={isDark}>
                    <EmployeeDashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/ticket/:id" element={
                <ProtectedRoute>
                  <AppLayout onToggleDark={toggleDark} isDark={isDark}>
                    <TicketDetail />
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </NotifProvider>
        </TicketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
