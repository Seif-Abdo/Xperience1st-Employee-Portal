# Xperience1st Employee Portal (Standalone Frontend)

The official corporate frontend for **Xperience1st** employees, decoupled from the chatbot engine.

---

## Architecture & Chatbot Integration

The frontend contains **no internal chatbot code, complex state, or chat components**. Instead, it seamlessly embeds the hosted chatbot via a single script tag pointing to your Chatbot Service:

```html
<script 
  src="%VITE_CHATBOT_URL%/widget.js" 
  data-backend-url="%VITE_CHATBOT_URL%" 
  defer>
</script>
```

When an employee signs in with their `@xperience1st.com` Google Workspace account, the portal stores the authenticated JWT token. The hosted chatbot script automatically detects the active session, verifies the domain, and unlocks the personalized AI assistant.

---

## Quickstart

### 1. Configure Environment
```bash
copy .env.example .env
```
Set your values:
```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_CHATBOT_URL=http://localhost:5001
```

### 2. Run Locally
```bash
npm install
npm run dev
```
Portal will run at [http://localhost:5173](http://localhost:5173).
