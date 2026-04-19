import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateBooking from './components/booking/CreateBooking';
import MyBookings from './components/booking/MyBookings';
import AdminDashboard from './components/booking/AdminDashboard';
import ConformBooking from './components/booking/ConformBooking';
import AdminHub from './components/AdminHub';
import FacilitiesCatalogue from './components/FacilitiesCatalogue';
import StudentCatalogue from './components/StudentCatalogue';
import { UserCheck, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                {/* Navigation Bar */}
                <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <GraduationCap className="text-white" size={24} />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-gray-800">Swift<span className="text-blue-600">Fix</span></span>
                            </div>
                            <div className="flex space-x-2">
                                <Link to="/my-bookings" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                    <UserCheck size={18} /> My Bookings
                                </Link>
                                <Link to="/catalogue" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                    <Building2 size={18} /> Catalogue
                                </Link>

                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <Routes>
                        <Route path="/" element={<CreateBooking />} />
                        <Route path="/my-bookings" element={<MyBookings />} />
                        <Route path="/catalogue" element={<StudentCatalogue />} />
                        <Route path="/admin" element={<AdminHub />} />
                        <Route path="/admin/bookings" element={<AdminDashboard />} />
                        <Route path="/admin/confirmed-bookings" element={<ConformBooking />} />
                        <Route path="/admin/catalogue" element={<FacilitiesCatalogue />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="mt-auto py-8 text-center text-gray-400 text-xs border-t border-gray-100 bg-white">
                    <p className="mb-1">SwiftFix &bull; Smart Campus Operations Hub</p>
                    <p>&copy; 2026 SwiftFix. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;
