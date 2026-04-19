import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/api';
import { getResources } from '../../services/resourceService';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, X, Calendar, Clock, User, Landmark } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
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
        const reason = window.prompt('Please enter a reason for cancellation:');
        if (reason === null) return; // User cancelled prompt

        try {
            await bookingService.cancelBooking(id, reason || 'Cancelled by user');
            fetchBookings();
        } catch (error) {
            alert(error.response?.data?.message || 'Error cancelling booking');
        }
    };

    const handleGenerateQr = (booking) => {
        setSelectedBooking(booking);
        setShowQrModal(true);
    };

    const downloadQrCode = () => {
        const canvas = document.getElementById('booking-qr-code');
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `Booking_QR_${selectedBooking.id}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
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
                                                    <div className={`mt-1.5 text-[10px] font-medium max-w-[200px] ${booking.status === 'CANCELLED' ? 'text-gray-500' : 'text-rose-500'}`}>
                                                        {booking.status === 'CANCELLED' ? 'Cancellation Reason: ' : 'Rejection Note: '}
                                                        {booking.rejectionReason}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {booking.status === 'APPROVED' && (
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleGenerateQr(booking)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group/qr"
                                                            title="Generate QR Code"
                                                        >
                                                            <QrCode size={20} className="group-hover/qr:scale-110 transition-transform" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(booking.id)}
                                                            className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-colors flex items-center"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
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

            {/* QR Modal */}
            {showQrModal && selectedBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                        <div className="relative p-8 text-center">
                            <button
                                onClick={() => setShowQrModal(false)}
                                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-6 flex justify-center">
                                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <QrCode size={32} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Booking QR Pass</h3>
                            <p className="text-gray-500 text-sm mb-8 px-4">Present this code at the resource location for verification.</p>

                            <div className="bg-gray-50 p-6 rounded-3xl mb-8 flex flex-col items-center border border-gray-100">
                                <QRCodeCanvas
                                    id="booking-qr-code"
                                    value={JSON.stringify({
                                        id: selectedBooking.id,
                                        user: selectedBooking.userId,
                                        resource: resources.find(r => String(r.id) === String(selectedBooking.resourceId))?.name || 'Unknown',
                                        date: selectedBooking.date,
                                        time: `${selectedBooking.startTime.slice(0, 5)} - ${selectedBooking.endTime.slice(0, 5)}`
                                    })}
                                    size={200}
                                    level={"H"}
                                    includeMargin={true}
                                    imageSettings={{
                                        src: "/favicon.ico", // Attempt to include logo if exists
                                        x: undefined,
                                        y: undefined,
                                        height: 24,
                                        width: 24,
                                        excavate: true,
                                    }}
                                />

                                <div className="mt-6 w-full text-left space-y-2 text-xs font-bold text-gray-500 uppercase tracking-widest px-4">
                                    <div className="flex items-center gap-2"><User size={14} className="text-indigo-400" /> {selectedBooking.userId}</div>
                                    <div className="flex items-center gap-2"><Landmark size={14} className="text-indigo-400" /> {resources.find(r => String(r.id) === String(selectedBooking.resourceId))?.name || 'Unknown'}</div>
                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-indigo-400" /> {selectedBooking.date}</div>
                                    <div className="flex items-center gap-2"><Clock size={14} className="text-indigo-400" /> {selectedBooking.startTime.slice(0, 5)} - {selectedBooking.endTime.slice(0, 5)}</div>
                                </div>
                            </div>

                            <button
                                onClick={downloadQrCode}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-900/20"
                            >
                                <Download size={18} /> Download Pass (.png)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
