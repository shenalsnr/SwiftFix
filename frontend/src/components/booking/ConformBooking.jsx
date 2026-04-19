import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { getResources } from '../../services/resourceService';
import { CheckCircle, Calendar, Clock, Building2, Users, Search, FilterX, Hash, Trash2, MessageSquareText, XCircle } from 'lucide-react';

const ConformBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, resourcesRes] = await Promise.all([
                bookingService.getAllBookings(),
                getResources()
            ]);
            
            const confirmedBookings = bookingsRes.data.filter(b => b.status === 'APPROVED');
            setBookings(confirmedBookings);
            setResources(resourcesRes);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const resource = resources.find(r => String(r.id) === String(booking.resourceId));
        const resourceName = resource?.name?.toLowerCase() || '';
        const userId = booking.userId?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch = resourceName.includes(searchLower) || userId.includes(searchLower);
        const matchesDate = filterDate === '' || booking.date === filterDate;

        return matchesSearch && matchesDate;
    });

    const resetFilters = () => {
        setSearchTerm('');
        setFilterDate('');
    };

    const handleRemove = (id) => {
        setCancellingId(cancellingId === id ? null : id);
        setCancelReason('');
    };

    const handleConfirmCancel = async (id) => {
        if (!cancelReason) {
            alert('Please provide a reason for cancellation');
            return;
        }
        try {
            await bookingService.cancelBooking(id, cancelReason);
            setCancellingId(null);
            setCancelReason('');
            fetchData();
        } catch (error) {
            console.error("Error removing booking:", error);
            alert("Failed to remove booking");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-indigo-600">
                <div className="animate-spin mr-3"><CheckCircle size={32} /></div>
                <span className="text-xl font-bold">Generating Report...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-2xl text-green-600 shadow-sm border border-green-200">
                        <CheckCircle size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Confirmed Bookings</h2>
                        <p className="text-gray-500 text-sm mt-1">Detailed administrative table of all approved reservations.</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="flex justify-center mb-10">
                <div className="bg-white px-10 py-8 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-green-100 flex flex-col items-center group hover:scale-105 transition-transform duration-300">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Total Confirmed</span>
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">
                        {filteredBookings.length}
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by Student ID or Resource..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    />
                </div>
                <div className="relative w-full md:w-64 group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all text-gray-700"
                    />
                </div>
                {(searchTerm || filterDate) && (
                    <button 
                        onClick={resetFilters}
                        className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest px-4 py-2 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <FilterX size={16} /> Reset
                    </button>
                )}
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/5 overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-black tracking-[0.15em] border-b border-gray-200">
                            <tr>
                                <th className="px-8 py-5 flex items-center gap-2 font-black "><Building2 size={16}/> Resource</th>
                                <th className="px-8 py-5 font-black "><Hash size={16} className="inline mr-2"/> Student ID</th>
                                <th className="px-8 py-5 font-black "><Calendar size={16} className="inline mr-2"/> Date</th>
                                <th className="px-8 py-5 font-black "><Clock size={16} className="inline mr-2"/> Time</th>
                                <th className="px-8 py-5 text-center font-black "><Users size={16} className="inline mr-2"/> People</th>
                                <th className="px-8 py-5 text-center font-black ">Status</th>
                                <th className="px-8 py-5 text-center font-black ">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium ">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Building2 size={48} className="text-gray-200 mb-4" />
                                            <h3 className="text-lg font-bold text-gray-700">No matching bookings found</h3>
                                            <p className="text-gray-400 text-sm">Adjust your filters to see more results.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => {
                                    const resource = resources.find(r => String(r.id) === String(booking.resourceId));
                                    return (
                                        <React.Fragment key={booking.id}>
                                            <tr className="hover:bg-indigo-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{resource ? resource.name : 'Unknown'}</div>
                                                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">{resource?.type || 'N/A'}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold border border-gray-200">
                                                        {booking.userId}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-bold text-gray-600">
                                                    {booking.date}
                                                </td>
                                                <td className="px-8 py-5 text-sm font-bold text-gray-600">
                                                    {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="text-sm font-bold text-gray-900 bg-blue-50/50 px-2 py-1 rounded-md">
                                                        {booking.attendees}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex justify-center">
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">
                                                            <CheckCircle size={12} /> Confirmed
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex justify-center">
                                                        <button 
                                                            onClick={() => handleRemove(booking.id)}
                                                            className={`p-2 rounded-lg transition-colors group/btn ${cancellingId === booking.id ? 'bg-rose-500 text-white' : 'text-rose-500 hover:bg-rose-50'}`}
                                                            title={cancellingId === booking.id ? "Close" : "Remove Booking"}
                                                        >
                                                            {cancellingId === booking.id ? <XCircle size={18} /> : <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {cancellingId === booking.id && (
                                                <tr className="bg-rose-50/50">
                                                    <td colSpan="7" className="px-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1 relative">
                                                                <MessageSquareText className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
                                                                <input 
                                                                    type="text" 
                                                                    value={cancelReason}
                                                                    onChange={(e) => setCancelReason(e.target.value)}
                                                                    placeholder="Why is this booking being removed? (Required)"
                                                                    className="w-full pl-12 pr-4 py-2 bg-white border border-rose-100 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm transition-all"
                                                                />
                                                            </div>
                                                            <button 
                                                                onClick={() => handleConfirmCancel(booking.id)}
                                                                className="px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/10"
                                                            >
                                                                Confirm Removal
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Table Footer / Summary */}
            {filteredBookings.length > 0 && (
                <div className="mt-6 px-8 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                    <span>Total Confirmed: {filteredBookings.length}</span>
                    <span>Last Synced: {new Date().toLocaleTimeString()}</span>
                </div>
            )}
        </div>
    );
};

export default ConformBooking;
