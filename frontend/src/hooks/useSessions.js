import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import sessionApi from "../api/sessions.js";
import toast from "react-hot-toast";

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => {
      toast.success("Session created Successfully");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to create Session"),
  });
  return result;
};

export const useJoinSession = (id) => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: () => sessionApi.joinSession(id),
    onSuccess: () => {
      toast.success("Joined Session Successfully");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["Session", id] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to join Session"),
  });
  return result;
};
export const useEndSession = (id) => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: () => sessionApi.endSession(id),
    onSuccess: () => {
      toast.success("End Session Successfully");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["resentSessions"] });
      queryClient.invalidateQueries({ queryKey: ["Session", id] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end Session"),
  });
  return result;
};

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });

  return result;
};

export const useMyResentSessions = () => {
  const result = useQuery({
    queryKey: ["recentSessions"],
    queryFn: sessionApi.getMyResentSessions,
  });

  return result;
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["Session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  return result;
};

export const useStreamToken = () => {
  const result = useQuery({
    queryKey: ["stream_Sessions"],
    queryFn: sessionApi.getStreamToken,
  });

  return result;
};
