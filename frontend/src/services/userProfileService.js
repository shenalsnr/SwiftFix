import api from './axiosConfig';

const API_BASE_URL = 'http://localhost:8080/api/users';

/**
 * User Profile Service
 * Handles all API calls for user profile management (Module E - Auth + Module D - Notifications)
 */
export const userProfileService = {
    /**
     * Fetch current logged-in user with notification preferences
     * GET /api/users/me
     */
    getCurrentUser: () => 
        api.get(`${API_BASE_URL}/me`),

    /**
     * Update user profile and notification preferences
     * PUT /api/users/update-profile
     * @param {Object} profileData - User profile and notification data
     */
    updateUserProfile: (profileData) =>
        api.post(`${API_BASE_URL}/update-profile`, profileData),

    /**
     * Get user by ID
     * GET /api/users/{id}
     */
    getUserById: (id) =>
        api.get(`${API_BASE_URL}/${id}`),

    /**
     * Update specific user (legacy endpoint)
     * PUT /api/users/{id}
     */
    updateUser: (id, userData) =>
        api.put(`${API_BASE_URL}/${id}`, userData),

    /**
     * Get all users (Admin only)
     * GET /api/users
     */
    getAllUsers: () =>
        api.get(API_BASE_URL),

    /**
     * Delete user (Admin only)
     * DELETE /api/users/{id}
     */
    deleteUser: (id) =>
        api.delete(`${API_BASE_URL}/${id}`),
};

export default userProfileService;
