# 🚚 DeliFlow - Delivery Management System

DeliFlow is a full-stack, role-based Delivery Management System designed to bridge the gap between dispatchers, retailer staff, and last-mile motorcycle riders. 

**Live Demo (Frontend):** [https://deliflow-react-frontend.onrender.com](https://deliflow-react-frontend.onrender.com)  
**Live API (Backend):** [https://deliflow-flask-backend.onrender.com](https://deliflow-flask-backend.onrender.com)  
**System Architecture:** [View Architecture Docs](./docs/SYSTEM_ARCHITECTURE.md)

---

## 🛠 Tech Stack

### Frontend (Client-Side)
*   **Framework:** React 18 + Vite (TypeScript)
*   **Styling:** Tailwind CSS
*   **Hardware Integration:** `html5-qrcode` (Dual-channel Mobile Scanner with manual alphanumeric fallback)
*   **State Management:** React Hooks with resilient 10-second HTTP short-polling
*   **Deployment:** Render (Static Site)

### Backend (Server-Side)
*   **Framework:** Flask (Python 3.11)
*   **WSGI Server:** Gunicorn
*   **Database ORM:** Flask-SQLAlchemy
*   **Migrations:** Flask-Migrate (Alembic)
*   **Deployment:** Render (Web Service)

### Database
*   **Engine:** PostgreSQL (Hosted on Render)

---

## ✨ Key Features

1.  **Role-Based Workspaces:** Dedicated operational views for Dispatchers, Retailers, and Riders.
2.  **Strict State Machine Logic:** Deliveries strictly follow the `PENDING` ➔ `ASSIGNED` ➔ `PICKED_UP` ➔ `DELIVERED` lifecycle.
3.  **Hardware-Resilient Verification:** Riders can verify deliveries using a live camera QR scanner or a manual 6-digit alphanumeric fallback for degraded hardware/lighting conditions.
4.  **Graceful API Error Handling:** Fully JSON-compliant REST endpoints with isolated 404/500 error handlers.

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
