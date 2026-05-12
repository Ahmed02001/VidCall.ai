import { useMutation, useQuery } from "@tanstack/react-query";
import { sessionsApi } from "../api/sessions.js";
import toast from "react-hot-toast";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionsApi.createSession,
    onSuccess: () => toast.success("Session created Successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to create Session"),
  });
  return result;
};

export const useJoinSession = (id) => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: () => sessionsApi.joinSession(id),
    onSuccess: () => toast.success("Joined Session Successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to joined Session"),
  });
  return result;
};
export const useEndSession = (id) => {
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: () => sessionsApi.endSession(id),
    onSuccess: () => toast.success("end Session Successfully"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end Session"),
  });
  return result;
};

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionsApi.getActiveSessions,
  });

  return result;
};

export const useMyResentSessions = () => {
  const result = useQuery({
    queryKey: ["resentSessions"],
    queryFn: sessionsApi.getMyResentSessions,
  });

  return result;
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["Session", id],
    queryFn: () => sessionsApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  return result;
};

export const useStreamToken = () => {
  const result = useQuery({
    queryKey: ["stream_Sessions"],
    queryFn: sessionsApi.getStreamToken,
  });

  return result;
};
