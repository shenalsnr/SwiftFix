import axios from "axios";

const API = "http://localhost:8080/api/tickets";

export const createTicket = (data) => axios.post(API, data);

export const getTickets = () => axios.get(API);

export const getTicketsByUserId = (userId) => axios.get(`${API}/user/${userId}`);

/** @param {boolean} [acknowledge=false] admin first-open acknowledgement for submitter */
export const getTicketById = (id, acknowledge = false) =>
  axios.get(`${API}/${id}`, { params: { acknowledge } });

export const updateStatus = (id, status, rejectionReason) =>
  axios.put(`${API}/${id}`, {
    status,
    ...(rejectionReason ? { rejectionReason } : {}),
  });

export const assignTechnician = (id, technicianId) =>
  axios.put(`${API}/${id}/assign`, { technicianId });

export const patchResolution = (id, resolutionNotes) =>
  axios.patch(`${API}/${id}/resolution`, { resolutionNotes });

export const deleteTicket = (id) => axios.delete(`${API}/${id}`);
