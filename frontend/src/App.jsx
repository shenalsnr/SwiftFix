import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Home Component
import Home from "./components/home/home";
import AuthPage from "./pages/auth/AuthPage";
import OAuthCallback from "./pages/auth/OAuthCallback";

// Booking Components
import CreateBooking from "./components/booking/CreateBooking";
import MyBookings from "./components/booking/MyBookings";
import AdminDashboard from "./components/booking/AdminDashboard";
import ConformBooking from "./components/booking/ConformBooking";
import AdminHub from "./components/AdminHub";

// Ticket Module Imports
import CreateTicket from "./components/CreateTicket";
import UserTickets from "./components/UserTickets";
import AdminTickets from "./components/AdminTickets";
import AdminTicketDetail from "./components/AdminTicketDetail";

// Other Components
import FacilitiesCatalogue from "./components/FacilitiesCatalogue";
import StudentCatalogue from "./components/StudentCatalogue";
import AdminFeedback from "./components/AdminFeedback";
import UserProfile from "./pages/student/StudentProfile";
import UserManagement from "./pages/admin/UserManagement";

import NotificationPanel from './components/NotificationPanel';



import { UserCheck, ShieldCheck, GraduationCap, Building2, LogOut, User } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import {
  GraduationCap,
  Building2,
  LogOut,
  User,
  UserCheck,
  Ticket,
  PlusCircle,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Navigation = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHome = location.pathname === "/";
  const isAuth =
    location.pathname === "/auth" || location.pathname === "/oauth-callback";

    return (
        <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">Swift<span className="text-blue-500">Fix</span></span>
                    </Link>
                    {!isAdminRoute && (
                        <div className="flex space-x-2">
                            <Link to="/my-bookings" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                                <UserCheck size={18} /> My Bookings
                            </Link>
                            <Link to="/catalogue" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                                <Building2 size={18} /> Catalogue
                            </Link>
                            <Link to="/profile" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                                <User size={18} /> Profile
                            </Link>
                        </div>
                    )}
                    <div className="flex items-center space-x-2 ml-4">
                        <NotificationPanel />
                        <button onClick={() => { 
                            logout(); 
                            window.location.href = '/'; 
                        }} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-all">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
  if (isHome || isAuth) return null;

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              Swift<span className="text-blue-500">Fix</span>
            </span>
          </Link>

          {!isAdminRoute && (
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/my-bookings"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <UserCheck size={18} />
                My Bookings
              </Link>

              <Link
                to="/tickets/create"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-blue-600/20 transition-all border border-blue-500/30"
              >
                <PlusCircle size={18} />
                Create Ticket
              </Link>

              <Link
                to="/tickets"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Ticket size={18} />
                My Tickets
              </Link>

              <Link
                to="/catalogue"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <Building2 size={18} />
                Catalogue
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <User size={18} />
                Profile
              </Link>
            </div>
          )}

          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isAuth =
    location.pathname === "/auth" || location.pathname === "/oauth-callback";

  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans text-gray-900">
      <Navigation />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <MyBookings />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/catalogue"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <StudentCatalogue />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-catalogue"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <StudentCatalogue />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/book"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <CreateBooking />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/create"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <CreateTicket />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <UserTickets />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminHub />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/confirmed-bookings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ConformBooking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/catalogue"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <FacilitiesCatalogue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminFeedback />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <AdminTickets />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tickets/:id"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                  <AdminTicketDetail />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isHome && !isAuth && (
        <footer className="mt-auto py-8 text-center text-gray-500 text-xs border-t border-gray-800 bg-black">
          <p className="mb-1">SwiftFix • Smart Campus Operations Hub</p>
          <p>&copy; 2026 SwiftFix. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;