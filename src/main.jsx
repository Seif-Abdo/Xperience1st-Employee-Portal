import { apiUrl } from './api';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import './index.css';

const DEFAULT_GOOGLE_CLIENT_ID = '543357447432-kmdsbgtiag9vnatfgtlkgriq0losi9nf.apps.googleusercontent.com';
const INITIAL_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;

function Root() {
  const [clientId, setClientId] = useState(INITIAL_CLIENT_ID);

  useEffect(() => {
    fetch(apiUrl('/api/config'))
      .then(res => res.json())
      .then(data => {
        if (data && data.googleClientId) {
          setClientId(data.googleClientId);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

// Dynamically load the hosted widget.js from Chatbot Service
function loadChatbotWidget() {
  if (document.getElementById('xperience-chatbot-script')) return;
  const chatbotHost = (import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5001').replace(/\/+$/, '');
  const script = document.createElement('script');
  script.id = 'xperience-chatbot-script';
  script.src = chatbotHost + '/widget.js';
  script.setAttribute('data-backend-url', chatbotHost);
  script.defer = true;
  document.body.appendChild(script);
}
loadChatbotWidget();
