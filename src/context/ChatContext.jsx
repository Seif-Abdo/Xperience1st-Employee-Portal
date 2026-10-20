import { apiUrl } from '../api';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);

  // Load user's past chat sessions from Chatbot Service
  const loadUserSessions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(apiUrl('/api/user/chats'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error('Error fetching user chat sessions:', err);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadUserSessions();
    } else {
      setSessions([]);
    }
  }, [isAuthenticated, token, loadUserSessions]);

  // Bridge functions that talk directly to the hosted widget.js script
  const setIsWidgetOpen = (open) => {
    if (open) {
      window.XperienceChatWidget?.open();
    } else {
      window.XperienceChatWidget?.close();
    }
  };

  const sendMessage = (query) => {
    window.XperienceChatWidget?.ask(query);
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        loadUserSessions,
        setIsWidgetOpen,
        sendMessage,
        isWidgetOpen: window.XperienceChatWidget?.isOpen?.() || false
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
