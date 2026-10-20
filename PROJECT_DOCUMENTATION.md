# Xperience1st Employee Portal & AI Chatbot Platform
# Full Technical Architecture & System Documentation

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture & Decoupled Model](#2-system-architecture--decoupled-model)
3. [Technology Stack & Frameworks](#3-technology-stack--frameworks)
4. [Chatbot Service & Admin Engine (`Xperience1st-Chatbot-Service`)](#4-chatbot-service--admin-engine)
   - [The Embeddable Widget Script (`/widget.js`)](#41-the-embeddable-widget-script-widgetjs)
   - [RAG Ingestion & Microsoft Word Pipeline](#42-rag-ingestion--microsoft-word-pipeline)
   - [HR Admin Management Console (`/admin-panel`)](#43-hr-admin-management-console-admin-panel)
5. [Employee Portal Frontend (`Xperience1st-Employee-Portal`)](#5-employee-portal-frontend)
   - [Decoupled Architecture](#51-decoupled-architecture)
   - [Portal Modules & Pages](#52-portal-modules--pages)
6. [Complete REST & Streaming API Reference](#6-complete-rest--streaming-api-reference)
7. [Security & Compliance Guardrails](#7-security--compliance-guardrails)
8. [Railway Cloud Deployment Guide](#8-railway-cloud-deployment-guide)
9. [Environment Variables Reference](#9-environment-variables-reference)

---

## 1. Executive Summary

The **Xperience1st HR Platform** is an enterprise-grade digital employee service hub and user-aware AI policy assistant designed for **Xperience1st** consultants, engineers, and staff.

The system is decoupled into **two independent standalone services**:
1. **Chatbot Service & Admin Engine (`Xperience1st-Chatbot-Service`)**: Node.js/Express service hosting the Google Gemini 2.5 Flash RAG assistant, document ingestion pipeline, HR admin console, and a zero-dependency embeddable chat script (`/widget.js`).
2. **Employee Portal Frontend (`Xperience1st-Employee-Portal`)**: React 18 + Vite SPA delivering employee self-service tools (Leave Planner, Salesforce Vouchers, Health Insurance, Organization Directory) and loading the chatbot strictly via the hosted widget script.

---

## 2. System Architecture & Decoupled Model

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Railway Cloud Project                           │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Service 1: Xperience1st-Chatbot-Service                        │   │
│   │ Live URL: https://chatbot-production.up.railway.app            │   │
│   │ • Express.js Backend on Node 22                                │   │
│   │ • Google Gemini 2.5 Flash Streaming API (/api/chat)            │   │
│   │ • Standalone Embed Script (/widget.js)                         │   │
│   │ • HR Admin Console (/admin-panel)                              │   │
│   │ • Attached Volume: /app/persistent                             │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                               ▲                                        │
│                               │ Loads widget.js & calls REST API       │
│   ┌───────────────────────────┴────────────────────────────────────┐   │
│   │ Service 2: Xperience1st-Employee-Portal                        │   │
│   │ Live URL: https://portal-production.up.railway.app             │   │
│   │ • React 18 + Vite + Tailwind CSS SPA                           │   │
│   │ • Restricted Google SSO (@xperience1st.com)                    │   │
│   │ • Zero internal chat components: loads widget.js via script    │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack & Frameworks

### 3.1. Frontend Ecosystem (`Xperience1st-Employee-Portal`)

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Component-based UI framework for reactive rendering. |
| **Vite** | `6.0.7` | High-speed frontend build tool and local development server. |
| **Tailwind CSS** | `3.4.17` | Utility-first CSS framework styled with custom brand purple (`#6C47C9`). |
| **@react-oauth/google** | `0.12.1` | Google Identity Services OAuth 2.0 SDK for company login. |
| **Lucide React** | `0.469.0` | Comprehensive enterprise SVG icon set. |
| **Canvas Confetti** | `1.9.4` | Micro-animation effects for voucher simulation celebrations. |
| **Nginx (Alpine)** | `alpine` | Production web server with automated `${PORT}` substitution. |

### 3.2. Backend & AI Engine (`Xperience1st-Chatbot-Service`)

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `20+ / 22-alpine` | Non-blocking event-driven runtime environment. |
| **Express.js** | `4.21.2` | Web framework handling routing, SSE streams, and static assets. |
| **@google/generative-ai** | `0.24.0` | Official Google SDK powering **Gemini 2.5 Flash**. |
| **jsonwebtoken (JWT)** | `9.0.3` | HMAC SHA-256 token issuance and session verification. |
| **Mammoth** | `1.13.0` | Ingestion engine extracting text from Microsoft Word (`.docx`) files. |
| **Docx** | `9.9.0` | Programmatic generator creating `.docx` policy files on the fly. |
| **Cors** | `2.8.5` | Cross-Origin Resource Sharing enabling script embedding across domains. |
| **Dotenv** | `16.4.7` | Environment configuration manager. |

---

## 4. Chatbot Service & Admin Engine

### 4.1. The Embeddable Widget Script (`/widget.js`)
The Chatbot Service serves a 19 KB standalone script (`public/widget.js`):
- **Universal Script Embed**:
  ```html
  <script 
    src="https://your-chatbot-domain.com/widget.js" 
    data-backend-url="https://your-chatbot-domain.com" 
    defer>
  </script>
  ```
- **Strict Google SSO Gate**: Reads `localStorage.getItem('xperience_portal_token')`. If the user is unauthenticated or signed in with a non-`@xperience1st.com` email, it renders a corporate lock screen and disables the input field.
- **Dynamic Context Injection**: Extracts the employee's name and department to personalize welcome messages:
  > *"Hello Alex! 👋 I'm your Xperience1st HR Assistant. How can I help you today with company policies, leave requests, medical insurance, or certifications?"*
- **Streaming Markdown Renderer**: Converts Gemini stream chunks (`data: {"content": "..."}`) into rich HTML with bold headers, bullet indicators, and code blocks without technical symbols.
- **Mobile Viewport Guard**: Automatically injects dynamic viewport tags preventing mobile browsers from zooming in during input focus.
- **Global Controller API**:
  ```javascript
  window.XperienceChatWidget.open();
  window.XperienceChatWidget.close();
  window.XperienceChatWidget.ask("What is the annual leave policy?");
  ```

### 4.2. RAG Ingestion & Microsoft Word Pipeline
The assistant answers strictly based on the company's official policies:
1. **11 Pre-loaded Word Documents** (`Policies RAG Files/*.docx`):
   - Vacations and Leave Policy
   - Compensation and Profit Share Policy
   - Extended WFH Policy (Non-Cairo & Giza Residents)
   - Workplace, Dress Code, and Company Property Policy
   - Probation Period Policy
   - Team Engagement & Recognition Budget
   - Travel Process Request
   - Complaint Procedure & Whistleblower Protections
   - Library Usage & Borrowing Policy
   - Employee Handbook & Code of Conduct
   - Offboarding Policy
2. **Automated Startup Sync**: On container startup, `server.js` checks `/app/persistent`. If empty, it extracts raw text via `mammoth`, constructs `knowledge_base.json`, and compiles the unified `rag_data.txt`.
3. **Live Admin Creation & Locking**: Administrators can write policies in `/admin-panel`. The server compiles the text into an authentic `.docx` binary using `docx` and writes it to disk. Document titles and categories are strictly locked after creation to preserve index integrity.

### 4.3. HR Admin Management Console (`/admin-panel`)
The compiled React dashboard served at `/admin-panel` provides:
- Live conversation inspector with avatar badges and employee identifiers.
- Full UTF-8 BOM CSV export of all chat logs (`/api/export-logs`).
- Real-time policy document editor and `.docx` generator.
- Dynamic CMS content updater for portal announcements and insurance notices.
- Anonymous Speak Up report tracker.
- Uncovered policy queries tracker for HR gap analysis.

---

## 5. Employee Portal Frontend

### 5.1. Decoupled Architecture
The frontend in `Xperience1st-Employee-Portal` has zero internal chatbot code. It communicates with the backend via two mechanisms:
1. **Dynamic Script Injection** (`src/main.jsx`): Automatically injects `widget.js` pointing to `VITE_CHATBOT_URL`.
2. **Centralized API Helper** (`src/api.js`):
   ```javascript
   export const CHATBOT_URL = (import.meta.env.VITE_CHATBOT_URL || '').replace(/\/+$/, '');
   export function apiUrl(endpoint) {
     const clean = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
     return CHATBOT_URL ? `${CHATBOT_URL}${clean}` : clean;
   }
   ```
   All portal fetch requests (`/api/portal/content`, `/api/auth/google`, `/api/user/chats`) seamlessly route across origins to the hosted chatbot service.

### 5.2. Portal Modules & Pages

1. **Dashboard & Hub (`Dashboard.jsx`)**:
   - Live company announcements and CEO messages (synced via CMS).
   - Dynamic leave balance meters and medical insurance coverage gauges with smooth entrance animations.
   - Quick navigation shortcuts into company tools.
2. **HR Policy Explorer (`Policies.jsx`)**:
   - Filterable, categorized repository of official company policies.
   - Search bar with instant keyword matching.
   - 1-click **"Ask AI Assistant"** button that opens `widget.js` pre-filled with the policy query.
3. **Leave Simulator & Rules (`LeavePlanner.jsx`)**:
   - Validates leave requests against the mandatory 3-day advance notice rule.
   - Visual leave calendar with public holidays and weekend exclusions.
4. **Salesforce Vouchers Hub (`Certifications.jsx`)**:
   - Catalog of 100% company-sponsored certifications (Salesforce AI Specialist, Platform Dev I, App Architect, Administrator).
   - 1-day paid study leave scheduler for exam dates.
   - Interactive voucher request simulator with celebratory confetti.
5. **Medical & Insurance Hub (`Insurance.jsx`)**:
   - Coverage breakdown: Prime Health & MetLife in-network guidelines (100% inpatient, 85% outpatient up to 150,000 EGP).
   - Downloadable network directory and claims submission checklist.
6. **Company Directory & Hierarchy (`Directory.jsx`, `Hierarchy.jsx`)**:
   - Complete contact lists, department breakdowns, and organizational tree.
7. **Personal Conversation History (`History.jsx`)**:
   - Per-user conversation log pulling past sessions from `/api/user/chats`.
   - Allows employees to review past queries and delete threads.
8. **Anonymous Whistleblower Speak Up (`Dashboard.jsx`)**:
   - Direct, 100% confidential escalation channel to Executive HR.

---

## 6. Complete REST & Streaming API Reference

### 6.1. Authentication Endpoints

#### `POST /api/auth/google`
Verifies Google OAuth JWT credentials.
- **Request Body**: `{ "credential": "<Google_ID_Token>" }`
- **Validation**: Enforces `email.endsWith('@' + ALLOWED_DOMAIN)`.
- **Response**: `{ "success": true, "token": "<JWT_Token>", "user": { ... } }`

#### `GET /api/auth/me`
Validates the current session token (`Authorization: Bearer <token>`).

---

### 6.2. Chatbot & User Endpoints

#### `POST /api/chat`
Main streaming conversation endpoint (**Protected by `requireAuth`**).
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ "messages": [{ "role": "user", "content": "..." }], "sessionId": "..." }`
- **Stream Format**: Server-Sent Events (`data: {"content": "chunk"}\n\n`).
- **Context Injection**: Pre-pends employee persona (name, role, department) into Gemini's system instruction.

#### `GET /api/user/chats`
Returns all non-anonymous chat sessions belonging to the logged-in user.

#### `GET /api/user/chats/:sessionId`
Retrieves message history for a specific conversation session.

#### `DELETE /api/user/chats/:sessionId`
Deletes a user's conversation thread from `chat_logs.json`.

---

### 6.3. Public & Configuration Endpoints

#### `GET /widget.js`
Serves the embeddable chat widget script with universal CORS (`Access-Control-Allow-Origin: *`).

#### `GET /api/config`
Returns widget branding settings, quick suggestion pills, and Google Client ID.

#### `GET /api/portal/content`
Returns dynamic CMS content (announcements, banners, leadership messages) for the portal.

#### `POST /api/speak-up`
Submits an anonymous whistleblower report. **Strictly purges user email and name before saving**.

---

### 6.4. HR Admin Endpoints (`adminAuth` required)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/admin/login` | `POST` | Authenticates admin using `ADMIN_PASSWORD`. |
| `/api/chat-logs` | `GET` | Returns all system transcripts with filtering by employee/date. |
| `/api/export-logs` | `GET` | Generates and downloads full UTF-8 BOM CSV export of chat transcripts. |
| `/api/admin/knowledge-base` | `GET` | Lists all indexed policy documents with word counts. |
| `/api/admin/knowledge-base` | `POST` | Creates a new policy and writes a real `.docx` file to disk. |
| `/api/admin/knowledge-base/:id` | `PUT` | Updates content of an existing policy (Title/Category locked). |
| `/api/admin/portal-content` | `POST` | Updates portal announcements and insurance notices. |
| `/api/admin/speak-up` | `GET` | Lists whistleblower submissions with status escalation. |
| `/api/admin/uncovered-queries` | `GET` | Logs queries where policy coverage was insufficient for HR follow-up. |

---

## 7. Security & Compliance Guardrails

1. **Google Workspace Domain Isolation**:
   - `backend/middleware/auth.js` decodes tokens and rejects any email domain other than `@xperience1st.com` with `403 Forbidden`.
2. **Whistleblower Confidentiality**:
   - When a session is flagged as `isSpeakUp`, the backend irreversibly sets `userEmail = 'Anonymous'`, `userName = 'Anonymous Employee'`, and `department = 'Confidential'`. These sessions are omitted from `/api/user/chats`.
3. **CORS Guardrails**:
   - Configured with `origin: '*'` on `/widget.js` and `/api/chat` to allow authorized frontend hosting across any external company domain.
4. **Persistent Disk Isolation**:
   - Policy files, CMS content, and transcripts are stored in isolated JSON/DOCX files under `./persistent/`, eliminating reliance on external database connections for core operations.

---

## 8. Railway Cloud Deployment Guide

### Step 1: Deploy Chatbot Service
1. Create new project on [railway.app](https://railway.app) from repo `Xperience1st-Chatbot-Service`.
2. Set Environment Variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `ADMIN_PASSWORD`: Password for `/admin-panel` (e.g. `xperience2026`).
   - `ALLOWED_DOMAIN`: `xperience1st.com`.
   - `JWT_SECRET`: Secure random string.
   - `NODE_ENV`: `production`.
3. Attach **Volume** mounted at `/app/persistent`.
4. Go to **Settings** -> **Networking** -> click **Generate Domain** (e.g. `https://chatbot-production.up.railway.app`).

### Step 2: Deploy Employee Portal
1. In the same Railway project, add resource from repo `Xperience1st-Employee-Portal`.
2. Set Environment Variables:
   - `VITE_CHATBOT_URL`: `https://chatbot-production.up.railway.app` (from Step 1).
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
3. Go to **Settings** -> **Networking** -> click **Generate Domain** (e.g. `https://portal-production.up.railway.app`).

### Step 3: Authorize Google SSO Domain
1. In [Google Cloud Console](https://console.cloud.google.com/) -> **Credentials** -> your OAuth 2.0 Client ID.
2. Under **Authorized JavaScript origins**, add: `https://portal-production.up.railway.app`.

---

## 9. Environment Variables Reference

### Chatbot Service (`.env`)
```env
PORT=5001
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
ADMIN_PASSWORD=xperience2026
ALLOWED_DOMAIN=xperience1st.com
JWT_SECRET=xperience1st-secret-jwt-key-2026
NODE_ENV=production
```

### Employee Portal (`.env`)
```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_CHATBOT_URL=https://your-chatbot-service.up.railway.app
```
