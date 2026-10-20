# Hosting on Railway (Step-by-Step Guide)

This guide walks you through deploying both the **Xperience1st Chatbot Service** and the **Xperience1st Employee Portal** onto [Railway](https://railway.app) in under 5 minutes.

---

## Architecture on Railway

You can run both services inside a **single Railway project** for clean management and zero cost waste:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Railway Project                                 │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Service 1: xperience1st-chatbot-service                        │   │
│   │ URL: https://chatbot-production.up.railway.app                 │   │
│   │ • Node.js + Express API (/api/chat, /api/health)               │   │
│   │ • Embeddable Script (/widget.js)                               │   │
│   │ • HR Admin Console (/admin-panel)                              │   │
│   │ • Volume: /app/persistent (Preserves all policy edits & logs)  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                               ▲                                        │
│                               │ Loads widget.js & calls /api           │
│   ┌───────────────────────────┴────────────────────────────────────┐   │
│   │ Service 2: xperience1st-employee-portal                        │   │
│   │ URL: https://portal-production.up.railway.app                  │   │
│   │ • React 18 + Vite Frontend                                     │   │
│   │ • Restricted Google SSO (@xperience1st.com)                    │   │
│   │ • Loads Chatbot via: <script src=".../widget.js">              │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Push Both Repositories to GitHub

### 1. Push the Chatbot Service
```bash
cd D:\Projects\Xperience1st-Chatbot-Service
git init
git add .
git commit -m "feat: initial release of Xperience1st Chatbot Service"
git branch -M main
git remote add origin https://github.com/<your-username>/xperience1st-chatbot-service.git
git push -u origin main
```

### 2. Push the Employee Portal
```bash
cd D:\Projects\Xperience1st-Employee-Portal
git init
git add .
git commit -m "feat: initial release of Xperience1st Employee Portal"
git branch -M main
git remote add origin https://github.com/<your-username>/xperience1st-employee-portal.git
git push -u origin main
```

---

## Step 2: Deploy the Chatbot Service (Deploy First)

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **+ New Project** -> **Deploy from GitHub repo**.
3. Select your `xperience1st-chatbot-service` repository.
4. Click on the service in Railway and navigate to the **Variables** tab:
   | Variable Name | Value | Description |
   | :--- | :--- | :--- |
   | `GEMINI_API_KEY` | `AIzaSy...your_gemini_key` | **Required**: Google Gemini API key for chatbot AI |
   | `ADMIN_PASSWORD` | `xperience2026` | **Required**: Password to log into `/admin-panel` |
   | `ALLOWED_DOMAIN` | `xperience1st.com` | Company email domain allowed to login |
   | `JWT_SECRET` | `xperience1st-secret-jwt-key-2026` | Any secure random string for JWT sessions |
   | `NODE_ENV` | `production` | Enables production mode optimizations |

5. **Attach a Persistent Volume** (Crucial to preserve edited policies, transcripts, and Word files):
   - In your Railway service canvas, right-click (or click **+ Add Resource**).
   - Select **Volume**.
   - Set Mount Path:
     ```text
     /app/persistent
     ```
   - Click **Add Volume**.

6. **Generate Public Domain**:
   - Go to **Settings** -> **Networking** -> click **Generate Domain**.
   - Railway will give you a public URL (e.g. `https://chatbot-production.up.railway.app`).
   - Copy this URL! You will use it in Step 3.

---

## Step 3: Deploy the Employee Portal

1. In the **same** Railway project, click **+ New** (or **+ Add Resource**) -> **GitHub Repo**.
2. Select your `xperience1st-employee-portal` repository.
3. In the **Variables** tab, add:
   | Variable Name | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_CHATBOT_URL` | `https://chatbot-production.up.railway.app` | **Required**: The public URL from Step 2 |
   | `VITE_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` | Google Cloud OAuth Client ID |

4. **Generate Public Domain**:
   - Go to **Settings** -> **Networking** -> click **Generate Domain**.
   - Railway will give you your portal URL (e.g. `https://portal-production.up.railway.app`).

---

## Step 4: Authorize Google SSO Domain

1. Open [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
2. Click on your **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized JavaScript origins**, click **+ ADD URI**:
   ```text
   https://portal-production.up.railway.app
   ```
4. Click **Save**.

---

## Verification Checklist

- **Chatbot Service Root**: `https://chatbot-production.up.railway.app/`
  - Shows green "Chatbot Service Active & Healthy" badge, embed script snippet, and testbench widget.
- **Widget Script**: `https://chatbot-production.up.railway.app/widget.js`
  - Returns `widget.js` with `Content-Type: application/javascript`.
- **HR Admin Console**: `https://chatbot-production.up.railway.app/admin-panel`
  - Log in with `ADMIN_PASSWORD` (e.g. `xperience2026`).
- **Employee Portal**: `https://portal-production.up.railway.app/`
  - Log in with your `@xperience1st.com` account.
  - Floating chatbot widget automatically activates, greets the employee, and answers HR queries!
