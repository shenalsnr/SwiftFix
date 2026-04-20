import api from './axiosConfig';

const API_BASE_URL = '/api/admin/users';

export const adminUserService = {
    getAllUsers: () => api.get(API_BASE_URL),
    updateUser: (id, userData) => api.put(`${API_BASE_URL}/${id}`, userData),
    deleteUser: (id) => api.delete(`${API_BASE_URL}/${id}`)
};

export default adminUserService;
