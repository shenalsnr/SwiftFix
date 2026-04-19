import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/api';
import { Calendar, Clock, Users, FileText, Send } from 'lucide-react';

const CreateBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resource = location.state?.selectedResource;

    const [formData, setFormData] = useState({
        resourceId: resource?.id || '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1,
    });
    const [existingBookings, setExistingBookings] = useState([]);
    const [conflictError, setConflictError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingService.getAllBookings();
                const relevant = response.data.filter(b =>
                    b.resourceId === formData.resourceId &&
                    (b.status === 'PENDING' || b.status === 'APPROVED')
                );
                setExistingBookings(relevant);
            } catch (error) {
                console.error("Error fetching existing bookings", error);
            }
        };
        if (formData.resourceId) {
            fetchBookings();
        }
    }, [formData.resourceId]);

    useEffect(() => {
        if (!formData.date || !formData.startTime || !formData.endTime) {
            setConflictError('');
            return;
        }

        const selectedStart = new Date(`${formData.date}T${formData.startTime}`);
        const selectedEnd = new Date(`${formData.date}T${formData.endTime}`);

        // Operating Hours Validation (7 AM - 6 PM)
        const startHour = parseInt(formData.startTime.split(':')[0]);
        const endHour = parseInt(formData.endTime.split(':')[0]);
        const endMinutes = parseInt(formData.endTime.split(':')[1]);

        if (startHour < 7) {
            setConflictError('Bookings cannot start before 7:00 AM.');
            return;
        }

        if (endHour > 18 || (endHour === 18 && endMinutes > 0)) {
            setConflictError('Bookings must end by 6:00 PM.');
            return;
        }

        if (selectedStart >= selectedEnd) {
            setConflictError('Start time must be before end time.');
            return;
        }

        const hasConflict = existingBookings.some(b => {
            if (b.date !== formData.date) return false;

            const fixTime = (t) => t.length === 5 ? `${t}:00` : t;
            const bStart = new Date(`${b.date}T${fixTime(b.startTime)}`);
            const bEnd = new Date(`${b.date}T${fixTime(b.endTime)}`);

            return selectedStart < bEnd && selectedEnd > bStart;
        });

        if (hasConflict) {
            setConflictError('This resource is already booked or pending for this time. Please select a different time.');
        } else {
            setConflictError('');
        }
    }, [formData.date, formData.startTime, formData.endTime, existingBookings]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await bookingService.createBooking({
                ...formData,
                userId: 'user123', // Hardcoded for demo
            });
            alert('Booking Requested Successfully');
            navigate('/my-bookings');
        } catch (error) {
            console.error("Submission Error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message || 'Error creating booking. Please check for time conflicts.';
            alert("Submission Error: " + errorMsg);
            setMessage({
                type: 'error',
                text: errorMsg
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Calendar className="text-blue-600" />
                Book a Resource
            </h2>

            {resource && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">Resource Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-700">
                        <div><span className="font-medium">Name:</span> {resource.name}</div>
                        <div><span className="font-medium">Location:</span> {resource.location || 'N/A'}</div>
                        <div><span className="font-medium">Capacity:</span> {resource.capacity || 'N/A'}</div>
                    </div>
                </div>
            )}

            {conflictError && (
                <div className="p-4 mb-6 rounded-lg bg-red-50 text-red-700 border border-red-200 shadow-sm font-medium">
                    {conflictError}
                </div>
            )}

            {message.text && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={resource ? "hidden" : "block"}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <FileText size={16} /> Resource ID
                        </label>
                        <input
                            type="text"
                            name="resourceId"
                            value={formData.resourceId}
                            onChange={handleChange}
                            required
                            readOnly={!!resource}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. ROOM-101"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Calendar size={16} /> Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Clock size={16} /> Start Time
                        </label>
                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            min="07:00"
                            max="18:00"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Clock size={16} /> End Time
                        </label>
                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            min="07:00"
                            max="18:00"
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Users size={16} /> Expected Attendees
                    </label>
                    <input
                        type="number"
                        name="attendees"
                        value={formData.attendees}
                        onChange={handleChange}
                        min="1"
                        max={resource?.capacity || undefined}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <textarea
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Why do you need this resource?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !!conflictError}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : <><Send size={20} /> Submit Booking Request</>}
                </button>
            </form>
        </div>
    );
};

export default CreateBooking;

