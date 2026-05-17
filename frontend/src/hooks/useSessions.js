/**
 * @fileoverview React Query Hooks for Session Management
 *
 * This module exports custom React Query hooks for interacting with the sessions API.
 * It provides mutations for creating, joining, and ending sessions, as well as
 * queries for fetching active, recent, and specific sessions.
 *
 * @module hooks/useSessions
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import sessionApi from "../api/sessions.js";
import toast from "react-hot-toast";

/**
 * Hook to create a new video call session.
 * On success, invalidates the 'activeSessions' query to trigger a refresh.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult} The mutation object
 */

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => {
      toast.success("Session created Successfully");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
    },
    onError: (error) => {
      console.error("Create session error:", error);
      toast.error(error.response?.data?.message || "Failed to create Session");
    },
  });
  return result;
};

/**
 * Hook to join an existing video call session.
 * Expects the session ID to be passed to the mutate function.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult} The mutation object
 */
export const useJoinSession = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: (id) => sessionApi.joinSession(id),
    onSuccess: (data, id) => {
      toast.success("Joined Session Successfully");
      queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
      queryClient.invalidateQueries({ queryKey: ["Session", id] });
    },
    onError: (error) => {
      console.error("Join Session Error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to join Session"
      );
    },
  });
  return result;
};
/**
 * Hook to end a video call session (host only).
 * Expects the session ID to be passed to the mutate function.
 *
 * @returns {import('@tanstack/react-query').UseMutationResult} The mutation object
 */
export const useEndSession = () => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: (id) => sessionApi.endSession(id),
    onSuccess: (data, id) => {
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

/**
 * Hook to fetch active video call sessions.
 *
 * @returns {import('@tanstack/react-query').UseQueryResult} The query result containing active sessions
 */
export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions,
  });

  return result;
};

/**
 * Hook to fetch the user's recent completed sessions.
 *
 * @returns {import('@tanstack/react-query').UseQueryResult} The query result containing recent sessions
 */
export const useMyResentSessions = () => {
  const result = useQuery({
    queryKey: ["recentSessions"],
    queryFn: sessionApi.getMyResentSessions,
  });

  return result;
};

/**
 * Hook to fetch details of a specific session by ID.
 * Polls the backend every 5 seconds for real-time updates.
 *
 * @param {string} id - The session ID
 * @returns {import('@tanstack/react-query').UseQueryResult} The query result containing the session details
 */
export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["Session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  return result;
};

/**
 * Hook to fetch the Stream Chat authentication token for the current user.
 *
 * @returns {import('@tanstack/react-query').UseQueryResult} The query result containing the token
 */
export const useStreamToken = () => {
  const result = useQuery({
    queryKey: ["stream_Sessions"],
    queryFn: sessionApi.getStreamToken,
  });

  return result;
};
