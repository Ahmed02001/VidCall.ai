import axiosInstance from "../lib/axios";

const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },

  getMyResentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-resent");
    return response.data;
  },

  getSessionById: async (id) => {
    if (!id) throw new Error("Session ID is required");
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  joinSession: async (id) => {
    if (!id) throw new Error("Session ID is required");
    const response = await axiosInstance.post(`/sessions/${id}/join`);
    return response.data;
  },

  endSession: async (id) => {
    if (!id) throw new Error("Session ID is required");
    const response = await axiosInstance.post(`/sessions/${id}/end`);
    return response.data;
  },

  getStreamToken: async () => {
    const response = await axiosInstance.get(`/chat/token`);
    return response.data;
  },
};

export default sessionApi;
