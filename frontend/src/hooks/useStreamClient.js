/**
 * @fileoverview Stream Chat and Video Client Hook
 *
 * This module exports a custom React hook for initializing and managing the
 * Stream Chat and Stream Video clients. It handles user connection, session
 * joining, channel watching, and proper cleanup to prevent memory leaks and
 * redundant network requests.
 *
 * @module hooks/useStreamClient
 */

import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import sessionApi from "../api/sessions";

/**
 * Custom hook to initialize and manage Stream Video and Chat clients for a session.
 *
 * @param {Object} session - The session object from the backend
 * @param {boolean} loadingSession - True if the session data is currently loading
 * @param {boolean} isHost - True if the current user is the host of the session
 * @param {boolean} isParticipant - True if the current user is the participant of the session
 * @returns {Object} An object containing the initialized streamClient, call, chatClient, channel, and isInitializingCall status
 */
function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;

    const initCall = async () => {
      if (!session?.callId) return;
      if (!isHost && !isParticipant) return;
      if (session.status === "completed") return;

      try {
        const { token, userId, userName, userImage } =
          await sessionApi.getStreamToken();

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel(
          "messaging",
          session.callId,
        );
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        setIsInitializingCall(false);
      }
    };

    if (session && !loadingSession) initCall();

    // cleanup - performance reasons
    return () => {
      // iife
      (async () => {
        try {
          if (videoCall && videoCall.state?.callingState !== 'left') {
            try { await videoCall.leave(); } catch (e) { /* ignore if already left */ }
          }
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session?.callId, session?.status, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;
