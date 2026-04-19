import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { getResources } from '../../services/resourceService';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = 'user123'; // Hardcoded for demo

    useEffect(() => {
        fetchBookings();
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const data = await getResources();
            setResources(data);
        } catch (error) {
            console.error("Error fetching resources:", error);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getUserBookings(userId);
            setBookings(response.data);
        } catch (error) {
            console.error("Fetch Error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancelBooking(id);
            fetchBookings();
        } catch (error) {
            alert(error.response?.data?.message || 'Error cancelling booking');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'CANCELLED': return 'bg-gray-50 text-gray-600 border-gray-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-gray-500">
                <span className="text-lg font-medium">Fetching your record...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8">
            <div className="mb-10 pb-4 border-b border-gray-200">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Bookings</h2>
                <p className="text-gray-500 text-sm mt-1">Review and manage your personal resource reservations.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white p-20 rounded-[2rem] text-center shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500">You haven't made any resource requests in the system.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Resource</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Time Slot</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((booking) => {
                                    const resource = resources.find(r => String(r.id) === String(booking.resourceId));
                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-900">{resource ? resource.name : 'Unknown'}</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{resource?.type || 'N/A'}</div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                                {booking.date}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                                {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(booking.status)}`}>
                                                    {booking.status === 'APPROVED' ? 'CONFIRMED' : booking.status}
                                                </span>
                                                {booking.rejectionReason && (
                                                    <div className="mt-1.5 text-[10px] text-rose-500 font-medium max-w-[200px]">
                                                        Note: {booking.rejectionReason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {booking.status === 'APPROVED' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-8 text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest select-none">SwiftFix Personal Dashboard</p>
            </div>
        </div>
    );
};

export default MyBookings;
