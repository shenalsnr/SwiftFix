import axios from 'axios';

// Create Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000, // 10 seconds
    // DON'T set default Content-Type header - let axios auto-detect
    // This allows FormData with multipart/form-data to work correctly
});

// Request interceptor - Add JWT token to headers if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // IMPORTANT: Don't override Content-Type for FormData
        // If no Content-Type is set and data is FormData, axios will auto-set it with boundary
        if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and log them
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Log full error details for debugging
        console.error('=== AXIOS ERROR ===');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Message:', error.response?.data?.message);
        console.error('Full Error Response:', error.response?.data);
        console.error('Request URL:', error.config?.url);
        console.error('Request Method:', error.config?.method);
        console.error('===================');

        // If 401, user is unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            // Optional: redirect to /auth
            // window.location.href = '/auth';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
