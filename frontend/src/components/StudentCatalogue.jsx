import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResources } from '../services/resourceService';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Search, CalendarDays, BookOpen,
    LogOut, GraduationCap,
    Activity, CheckCircle, AlertTriangle, CalendarCheck,
    MapPin, Users, Info, User
} from 'lucide-react';

// --- Sub-components definition ---



const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass, accentBg }) => (
    <div className="bg-white border border-slate-200 rounded-[20px] p-[30px] relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(37,99,235,0.1)] hover:border-indigo-400/30 group">
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[20px]" style={{ background: accentBg }} />
        <div className={`w-[54px] h-[54px] rounded-[14px] flex items-center justify-center mb-5 ${bgColorClass} ${colorClass}`}>
            <Icon size={24} />
        </div>
        <h3 className="text-[1.1rem] font-bold text-[#0f172a] mb-2">{title}</h3>
        <p className="text-[2rem] font-extrabold text-[#0f172a] leading-none tracking-tight group-hover:translate-x-1 transition-transform">{value}</p>
    </div>
);

// --- Main Page Component ---

const StudentCatalogue = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [resources, setResources] = useState([]);
    const [myBookingsCount, setMyBookingsCount] = useState(0);
    const [filters, setFilters] = useState({ type: '', capacity: '', location: '' });
    const [loading, setLoading] = useState(true);

    // Derive the display name from AuthContext user, or fall back to decoding the JWT token
    const displayName = (() => {
        if (user?.fullName) return user.fullName;
        if (user?.email) return user.email;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.fullName) return payload.fullName;
                if (payload.email) return payload.email;
                if (payload.sub) return payload.sub;
            }
        } catch (e) {
            // ignore decode errors
        }
        return 'User';
    })();

    // Derive the current user ID for API calls
    const currentUserId = (() => {
        if (user?.userId) return user.userId;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.sub; // subject is the userId in the backend JWT implementation
            }
        } catch (e) {
            // ignore decode errors
        }
        return null;
    })();

    useEffect(() => {
        fetchResources();
    }, [filters]);

    useEffect(() => {
        const fetchPersonalStats = async () => {
            if (!currentUserId) return;
            try {
                const res = await bookingService.getUserBookings(currentUserId);
                setMyBookingsCount(res.data.length || 0);
            } catch (e) {
                console.error("Failed to load user stats", e);
            }
        };

        if (!authLoading) {
            fetchPersonalStats();
        }
    }, [currentUserId, authLoading]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await getResources(filters);
            setResources(data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleBook = (res) => {
        navigate('/book', { state: { selectedResource: res } });
    };

    const stats = {
        total: resources.length,
        active: resources.filter(r => r.status === 'ACTIVE').length,
        outOfService: resources.filter(r => r.status === 'OUT_OF_SERVICE').length
    };

    return (
        <div className="max-w-[1120px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Welcome Section mimicking sf-section-center */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                <div className="flex-1">
                    <span className="inline-flex items-center gap-2 bg-[#eff6ff] border border-blue-200/50 rounded-full px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.12em] uppercase text-[#2563eb] mb-4">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Student Dashboard
                    </span>
                    <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-[800] text-[#0f172a] tracking-tight leading-tight mb-2">
                        Welcome, {authLoading ? 'Loading...' : displayName}
                    </h2>
                    <p className="text-[1.05rem] text-[#64748b] leading-relaxed max-w-[520px]">
                        Browse available facilities, easily submit your booking requests, and instantly manage your campus reservations.
                    </p>
                </div>
                
                <div className="flex shrink-0">
                    <button 
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm group"
                    >
                        <User size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                        My Profile
                    </button>
                </div>
            </div>

            {/* Statistics Section mimicking sf-about-grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Resources" value={stats.total} icon={Activity}
                    colorClass="text-[#2563eb]" bgColorClass="bg-gradient-to-br from-[#dbeafe] to-[#eff6ff]"
                    accentBg="linear-gradient(90deg, #2563eb, #6366f1)"
                />
                <StatCard
                    title="Available Now" value={stats.active} icon={CheckCircle}
                    colorClass="text-[#059669]" bgColorClass="bg-gradient-to-br from-[#d1fae5] to-[#ecfdf5]"
                    accentBg="linear-gradient(90deg, #059669, #10b981)"
                />
                <StatCard
                    title="My Bookings" value={myBookingsCount} icon={CalendarCheck}
                    colorClass="text-[#7c3aed]" bgColorClass="bg-gradient-to-br from-[#ede9fe] to-[#f5f3ff]"
                    accentBg="linear-gradient(90deg, #7c3aed, #a78bfa)"
                />
                <StatCard
                    title="Out of Service" value={stats.outOfService} icon={AlertTriangle}
                    colorClass="text-[#d97706]" bgColorClass="bg-gradient-to-br from-[#fef3c7] to-[#fffbeb]"
                    accentBg="linear-gradient(90deg, #d97706, #f59e0b)"
                />
            </div>

            {/* Filters Section mimicking sf-hours-bar */}
            <div className="bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border border-indigo-600/10 rounded-2xl px-8 py-5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-[0.95rem] text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                    >
                        <option value="">All Categories</option>
                        <option value="LECTURE_HALL">Lecture Hall</option>
                        <option value="LAB">Laboratory</option>
                        <option value="MEETING_ROOM">Meeting Room</option>
                        <option value="EQUIPMENT">Equipment</option>
                    </select>
                </div>

                <div className="flex-1 w-full relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Min capacity..."
                        value={filters.capacity}
                        onChange={handleFilterChange}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-[0.95rem] text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                </div>

                <div className="flex-1 w-full relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        name="location"
                        placeholder="Find location..."
                        value={filters.location}
                        onChange={handleFilterChange}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-[0.95rem] text-slate-700 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                </div>
            </div>

            {/* Resource Catalogue Table Section mimicking sf-about-card */}
            <div className="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden transition-all duration-300">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-[1.1rem] font-bold text-[#0f172a]">Resource Catalogue</h3>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{resources.length} Available</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-100/80 text-slate-400 text-[0.75rem] uppercase tracking-wider font-bold">
                                <th className="px-8 py-5">Resource Name</th>
                                <th className="px-6 py-5">Type</th>
                                <th className="px-6 py-5">Capacity</th>
                                <th className="px-6 py-5">Location</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                            <p className="text-slate-500 font-medium text-[0.95rem]">Syncing resources...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : resources.length > 0 ? (
                                resources.map((res) => (
                                    <tr key={res.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-[#0f172a] text-[1rem]">{res.name}</div>
                                            <div className="text-[0.7rem] font-bold text-slate-400 mt-1 uppercase tracking-wider">ID: {res.id}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[0.75rem] font-bold bg-slate-100 text-slate-600 border border-slate-200/60 uppercase tracking-wide">
                                                {res.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center text-slate-600 text-[0.95rem] font-medium">
                                                <Users size={16} className="mr-2 text-slate-400" />
                                                {res.capacity || '--'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center text-slate-600 text-[0.95rem] font-medium hidden sm:flex">
                                                <MapPin size={16} className="mr-2 text-slate-400" />
                                                {res.location || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[0.75rem] font-bold border uppercase tracking-wide ${res.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                                : 'bg-amber-50 text-amber-700 border-amber-200/60'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${res.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                {res.status === 'ACTIVE' ? 'Available' : 'Maintenance'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="relative inline-block group/tooltip">
                                                <button
                                                    onClick={() => handleBook(res)}
                                                    disabled={res.status === 'OUT_OF_SERVICE'}
                                                    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[11px] text-[0.9rem] font-semibold transition-all duration-300 outline-none ${res.status === 'OUT_OF_SERVICE'
                                                        ? 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                                                        : 'text-white bg-gradient-to-br from-blue-600 to-indigo-600 shadow-[0_8px_28px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.4)] border-none'
                                                        }`}
                                                >
                                                    Book Now
                                                </button>

                                                {res.status === 'OUT_OF_SERVICE' && (
                                                    <div className="absolute bottom-full right-0 mb-3 hidden group-hover/tooltip:block w-max animate-in fade-in slide-in-from-bottom-1">
                                                        <div className="bg-slate-800 text-white text-[0.75rem] font-bold uppercase tracking-wide py-2 px-3 rounded-lg shadow-xl flex items-center">
                                                            <Info size={14} className="mr-1.5 text-slate-300" /> Offline Action
                                                        </div>
                                                        <div className="w-2.5 h-2.5 bg-slate-800 transform rotate-45 absolute -bottom-1 right-8 rounded-sm"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="h-16 w-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center mb-2 shadow-sm">
                                                <Search className="text-slate-300" size={32} />
                                            </div>
                                            <h4 className="text-[1.1rem] font-bold text-[#0f172a]">No resources found</h4>
                                            <p className="text-slate-500 max-w-sm text-[0.95rem] leading-relaxed">Adjust your filters or search criteria to view available facilities in the catalogue.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default StudentCatalogue;
