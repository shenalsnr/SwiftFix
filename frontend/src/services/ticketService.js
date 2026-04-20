import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API = `${API_ROOT}/api/tickets`;

export const createTicket = async (ticketData, files = []) => {
  const validFiles = (files || []).filter(Boolean);

  if (validFiles.length === 0) {
    const response = await axios.post(API, ticketData);
    return response.data;
  }

  const formData = new FormData();
  formData.append(
    "ticket",
    new Blob([JSON.stringify(ticketData)], { type: "application/json" })
  );

  validFiles.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.post(API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getTickets = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const getTicketsByUserId = async (userId) => {
  const response = await axios.get(`${API}/user/${userId}`);
  return response.data;
};

export const getTicketById = async (id, acknowledge = false) => {
  const response = await axios.get(`${API}/${id}`, {
    params: { acknowledge },
  });
  return response.data;
};

export const updateStatus = async (id, status, rejectionReason = "", adminReply = "") => {
  const response = await axios.put(`${API}/${id}`, {
    status,
    rejectionReason,
    adminReply,
  });
  return response.data;
};

export const assignTechnician = async (id, technicianId) => {
  const response = await axios.put(`${API}/${id}/assign`, { technicianId });
  return response.data;
};

export const patchResolution = async (id, resolutionNotes) => {
  const response = await axios.patch(`${API}/${id}/resolution`, { resolutionNotes });
  return response.data;
};

export const addComment = async (ticketId, payload) => {
  const response = await axios.post(`${API}/${ticketId}/comments`, payload);
  return response.data;
};

export const updateComment = async (ticketId, commentId, payload) => {
  const response = await axios.put(`${API}/${ticketId}/comments/${commentId}`, payload);
  return response.data;
};

export const deleteComment = async (ticketId, commentId, actorId, actorRole) => {
  const response = await axios.delete(`${API}/${ticketId}/comments/${commentId}`, {
    params: { actorId, actorRole },
  });
  return response.data;
};

export const deleteTicket = async (id) => {
  await axios.delete(`${API}/${id}`);
};

export const toAbsoluteFileUrl = (fileUrl) => {
  if (!fileUrl) return "#";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
  return `${API_ROOT}${fileUrl}`;
};