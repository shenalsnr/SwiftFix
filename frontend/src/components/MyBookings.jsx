import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import { Clock, Calendar, XCircle, CheckCircle, AlertCircle } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = 'user123'; // Hardcoded for demo

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getUserBookings(userId);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
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
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'CANCELLED': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    if (loading) return <div className="text-center py-10">Loading your bookings...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <Clock className="text-blue-600" />
                My Bookings
            </h2>

            {bookings.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center shadow-inner border border-dashed border-gray-300">
                    <p className="text-gray-500">You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xl font-bold text-gray-800">{booking.resourceId}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2 italic">
                                            <Calendar size={14} /> {booking.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} /> {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                                        </div>
                                        <div className="col-span-2 mt-2">
                                            <span className="font-semibold text-gray-700">Purpose:</span> {booking.purpose}
                                        </div>
                                        {booking.rejectionReason && (
                                            <div className="col-span-2 mt-2 p-2 bg-red-50 text-red-600 rounded text-xs flex items-center gap-2">
                                                <AlertCircle size={14} /> <strong>Rejection Reason:</strong> {booking.rejectionReason}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {booking.status === 'APPROVED' && (
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        className="text-red-500 hover:text-red-700 flex flex-col items-center gap-1 transition-colors"
                                    >
                                        <XCircle size={24} />
                                        <span className="text-[10px] font-bold">CANCEL</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
