// Centralized API URL helper for cross-origin or local proxy requests
export const CHATBOT_URL = (import.meta.env.VITE_CHATBOT_URL || '').replace(/\/+$/, '');

export function apiUrl(endpoint) {
  const clean = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  return CHATBOT_URL ? (CHATBOT_URL + clean) : clean;
}
