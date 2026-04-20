import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/home/home';
import AuthPage from './pages/auth/AuthPage';
import CreateBooking from './components/booking/CreateBooking';
import MyBookings from './components/booking/MyBookings';
import AdminDashboard from './components/booking/AdminDashboard';
import ConformBooking from './components/booking/ConformBooking';
import AdminHub from './components/AdminHub';
import FacilitiesCatalogue from './components/FacilitiesCatalogue';
import StudentCatalogue from './components/StudentCatalogue';
import AdminFeedback from './components/AdminFeedback';
import { UserCheck, ShieldCheck, GraduationCap, Building2, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Navigation = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isHome = location.pathname === '/';
    const isAuth = location.pathname === '/auth';

    if (isHome || isAuth) return null;

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
                        </div>
                    )}
                    <div className="flex space-x-2 ml-4">
                        <button onClick={() => { logout(); window.location.href = '/'; }} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 transition-all">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const AppContent = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isAuth = location.pathname === '/auth';

    return (
        <div className="min-h-screen flex flex-col bg-transparent font-sans text-gray-900">
            <Navigation />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/my-bookings" element={<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"><MyBookings /></div>} />
                    <Route path="/catalogue" element={<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"><StudentCatalogue /></div>} />
                    <Route path="/student-catalogue" element={<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"><StudentCatalogue /></div>} />
                    <Route path="/admin" element={<AdminHub />} />
                    <Route path="/admin/bookings" element={<AdminDashboard />} />
                    <Route path="/admin/confirmed-bookings" element={<ConformBooking />} />
                    <Route path="/admin/catalogue" element={<FacilitiesCatalogue />} />
                    <Route path="/admin/feedback" element={<AdminFeedback />} />
                    <Route path="/book" element={<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"><CreateBooking /></div>} />
                </Routes>
            </main>
            {!isHome && !isAuth && (
                <footer className="mt-auto py-8 text-center text-gray-500 text-xs border-t border-gray-800 bg-black">
                    <p className="mb-1">SwiftFix &bull; Smart Campus Operations Hub</p>
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
