import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/bookings';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const bookingService = {
    createBooking: (data) => api.post('', data),
    getUserBookings: (userId) => api.get(`/user?userId=${userId}`),
    getAllBookings: () => api.get(''),
    approveBooking: (id) => api.put(`/${id}/approve`),
    rejectBooking: (id, reason) => api.put(`/${id}/reject`, { reason }),
    cancelBooking: (id, reason) => api.put(`/${id}/cancel`, { reason }),
};

export default api;
