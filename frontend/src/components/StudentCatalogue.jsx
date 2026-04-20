import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResources } from '../services/resourceService';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    Search, CalendarDays, BookOpen,
    LogOut, GraduationCap,
    Activity, CheckCircle, AlertTriangle, CalendarCheck,
    MapPin, Users, Info
} from 'lucide-react';

// --- Sub-components definition ---



const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 flex items-center justify-between group">
        <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
            <h4 className="text-3xl font-bold text-gray-800 group-hover:translate-x-1 transition-transform">{value}</h4>
        </div>
        <div className={`h-14 w-14 rounded-2xl ${bgColorClass} ${colorClass} flex items-center justify-center transform group-hover:rotate-6 transition-transform`}>
            <Icon size={26} />
        </div>
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

    useEffect(() => {
        fetchResources();
    }, [filters]);

    useEffect(() => {
        const fetchPersonalStats = async () => {
            if (!user?.userId) return;
            try {
                const res = await bookingService.getUserBookings(user.userId);
                setMyBookingsCount(res.data.length || 0);
            } catch (e) {
                console.error("Failed to load user stats", e);
            }
        };

        if (!authLoading) {
            fetchPersonalStats();
        }
    }, [user, authLoading]);

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
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome, {authLoading ? 'Loading...' : displayName}
                    </h2>
                    <p className="text-gray-500 font-medium">Here's an overview of campus resources available for you today.</p>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Resources" value={stats.total} icon={Activity}
                    colorClass="text-blue-600" bgColorClass="bg-blue-50"
                />
                <StatCard
                    title="Available Now" value={stats.active} icon={CheckCircle}
                    colorClass="text-emerald-600" bgColorClass="bg-emerald-50"
                />
                <StatCard
                    title="My Bookings" value={myBookingsCount} icon={CalendarCheck}
                    colorClass="text-indigo-600" bgColorClass="bg-indigo-50"
                />
                <StatCard
                    title="Out of Service" value={stats.outOfService} icon={AlertTriangle}
                    colorClass="text-rose-600" bgColorClass="bg-rose-50"
                />
            </div>

            {/* Filters Section */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex items-center hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        <option value="LECTURE_HALL">Lecture Hall</option>
                        <option value="LAB">Laboratory</option>
                        <option value="MEETING_ROOM">Meeting Room</option>
                        <option value="EQUIPMENT">Equipment</option>
                    </select>
                </div>

                <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex items-center hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                    <Users className="text-gray-400 mr-3" size={20} />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Min capability..."
                        value={filters.capacity}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent outline-none text-gray-700 font-medium placeholder-gray-400"
                    />
                </div>

                <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 flex items-center hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                    <MapPin className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        name="location"
                        placeholder="Find location..."
                        value={filters.location}
                        onChange={handleFilterChange}
                        className="w-full bg-transparent outline-none text-gray-700 font-medium placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Resource Catalogue Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 bg-white flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Resource Catalogue</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4 rounded-tl-lg">Resource Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Capacity</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                            <p className="text-gray-500 font-medium">Loading resources...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : resources.length > 0 ? (
                                resources.map((res) => (
                                    <tr key={res.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{res.name}</div>
                                            <div className="text-xs text-gray-400 mt-1 uppercase">ID: {res.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                                {res.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600 text-sm font-medium">
                                                <Users size={16} className="mr-1.5 text-gray-400" />
                                                {res.capacity || '--'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600 text-sm font-medium">
                                                <MapPin size={16} className="mr-1.5 text-gray-400" />
                                                {res.location || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${res.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${res.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                {res.status === 'ACTIVE' ? 'Available' : 'Maintenance'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative inline-block group/tooltip">
                                                <button
                                                    onClick={() => handleBook(res)}
                                                    disabled={res.status === 'OUT_OF_SERVICE'}
                                                    className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 transform outline-none focus:ring-2 focus:ring-offset-1 ${res.status === 'OUT_OF_SERVICE'
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-200 focus:ring-blue-500'
                                                        }`}
                                                >
                                                    Book Now
                                                </button>

                                                {res.status === 'OUT_OF_SERVICE' && (
                                                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block w-max">
                                                        <div className="bg-gray-800 text-white text-xs font-medium py-1 px-2 rounded-lg shadow-lg flex items-center">
                                                            <Info size={12} className="mr-1 inline" /> Not available right now
                                                        </div>
                                                        <div className="w-2 h-2 bg-gray-800 transform rotate-45 absolute -bottom-1 right-6"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                                <Search className="text-gray-300" size={32} />
                                            </div>
                                            <h4 className="text-lg font-bold text-gray-800">No resources found</h4>
                                            <p className="text-gray-500 max-w-sm">Try adjusting your filters or search criteria to find available resources.</p>
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
