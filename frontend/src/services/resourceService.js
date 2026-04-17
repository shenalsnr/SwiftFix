import axios from 'axios';

const API_URL = 'http://localhost:8080/api/resources';

export const getResources = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.capacity) params.append('capacity', filters.capacity);
    if (filters.location) params.append('location', filters.location);
    
    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const createResource = async (resource) => {
    const response = await axios.post(API_URL, resource);
    return response.data;
};

export const updateResource = async (id, resource) => {
    const response = await axios.put(`${API_URL}/${id}`, resource);
    return response.data;
};

export const deleteResource = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
