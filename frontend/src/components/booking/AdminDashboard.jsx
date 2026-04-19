import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/api';
import { LayoutDashboard, CheckCircle, XCircle, Users, Calendar, Clock, MessageSquareText, Settings } from 'lucide-react';

import { getResources } from '../../services/resourceService';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState(null);
    const [reason, setReason] = useState('');

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
            const response = await bookingService.getAllBookings();
            setBookings(response.data);
        } catch (error) {
            console.error("Fetch Error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await bookingService.approveBooking(id);
            fetchBookings();
        } catch (error) {
            alert('Error approving booking');
        }
    };

    const handleReject = async (id) => {
        if (!reason) {
            alert('Please provide a rejection reason');
            return;
        }
        try {
            await bookingService.rejectBooking(id, reason);
            setRejectingId(null);
            setReason('');
            fetchBookings();
        } catch (error) {
            alert('Error rejecting booking');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            APPROVED: 'bg-green-100 text-green-800 border-green-200',
            REJECTED: 'bg-red-100 text-red-800 border-red-200',
            CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return `px-2 py-0.5 rounded text-[10px] font-bold border ${styles[status]}`;
    };

    if (loading) return <div className="text-center py-20 font-semibold text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <LayoutDashboard className="text-indigo-600" />
                    Admin Booking Management
                </h2>
                <button
                    onClick={() => navigate('/admin/catalogue')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
                >
                    <Settings size={18} />
                    Manage Catalogue
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-indigo-50 text-indigo-900 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Resource Details</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Schedule</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => {
                            const resource = resources.find(r => String(r.id) === String(booking.resourceId));
                            return (
                                <React.Fragment key={booking.id}>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{resource ? resource.name : 'Unknown Resource'}</div>
                                            <div className="mt-1">
                                                {resource ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-blue-100">{resource.type}</span> : <span className="text-gray-400 text-[10px]">Loading...</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-700">{booking.userId}</div>
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                <Users size={10} /> {booking.attendees} attendees
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-xs text-gray-700">
                                                <Calendar size={12} className="text-gray-400" /> {booking.date}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-700">
                                                <Clock size={12} className="text-gray-400" /> {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadge(booking.status)}>{booking.status === 'APPROVED' ? 'CONFIRMED' : booking.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {booking.status === 'PENDING' ? (
                                                <div className="flex justify-center gap-4">
                                                    <button
                                                        onClick={() => handleApprove(booking.id)}
                                                        className="text-green-500 hover:text-green-700 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={22} />
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectingId(rejectingId === booking.id ? null : booking.id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={22} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                    {rejectingId === booking.id && (
                                        <tr className="bg-red-50">
                                            <td colSpan="5" className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 relative">
                                                        <MessageSquareText className="absolute left-3 top-2.5 text-red-300" size={16} />
                                                        <input
                                                            type="text"
                                                            value={reason}
                                                            onChange={(e) => setReason(e.target.value)}
                                                            placeholder="Enter rejection reason..."
                                                            className="w-full pl-10 pr-4 py-2 text-sm border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleReject(booking.id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                                                    >
                                                        CONFIRM REJECTION
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <div className="py-20 text-center text-gray-400 italic bg-gray-50">
                        No booking records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
