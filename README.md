# Reflex — Small Retail Logistics System 🇰🇪

Reflex is a lightweight, robust delivery management platform designed specifically for small Kenyan retailers (electronics shops, pharmacies, hardware stores). It replaces chaotic, un-tracked WhatsApp loops and phone calls with structured, role-based dashboards and transactional data protection guards.

This system was built, deployed, and defended as part of the **Power Learn Project Readiness Sprint**.

---

## 👥 Project Team Roles & Contributions

Our team of four software engineering students split the sprint architecture and deliverables as follows:
*   **Student A (Frontend Lead):** Developed the React interface shell, integrated the `html5-qrcode` mobile camera scanning components, and engineered the resilient HTTP polling loop.
*   **Student B (Backend & DB Lead):** Authored the Flask REST API, designed the relational PostgreSQL schema, and built the strict backend sequential state transition machine.
*   **Student C (DevOps & Testing):** Configured the unified GitHub Codespaces environment, wrote automated integration tests with `pytest`, managed deployments, and logged dry-run timing data.
*   **Student D (Product & Defense Lead):** Created the executive narrative, drafted the presentation storyboard following the "one key takeaway per slide" rule, and documented the system's intentional architectural trade-offs.

---

## 🏗️ System Architecture & Tech Stack

Reflex uses a highly defensible, production-grade tech stack optimized for quick iteration and strict transactional safety:

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS
*   **Backend:** Python, Flask, SQLAlchemy ORM, Alembic
*   **Database:** PostgreSQL (with explicit Enum status constraints)
*   **Hardware Sync:** HTML5-QRcode Library with manual alphanumeric fallback inputs
*   **DevOps:** GitHub Codespaces (`.devcontainer`), Vercel (Frontend), Render (Backend/Database)

---

## ⚙️ Core Engineering Design Decisions

### 1. Robust HTTP Short Polling Sync Mechanism
Instead of complex, infrastructure-heavy WebSockets, the frontend synchronizes active queues every 10 seconds via controlled polling. If a rider or dispatcher drops offline, the system gracefully traps the network failure, displays a non-intrusive alert banner, and attempts recovery cleanly without halting execution.

### 2. Strict Sequential Backend State Machine
To guarantee relational schema integrity under high concurrency, the database locks down delivery states strictly. An order can **never** bypass validation stages arbitrarily. The backend logic explicitly enforces:
`PENDING` ➔ `ASSIGNED` ➔ `PICKED_UP` ➔ `DELIVERED`

### 3. Dual-Channel Order Confirmation Scan
Riders are equipped with an HTML5 hardware camera scanning view to verify delivery confirmation codes on-site. If a rider is working under poor illumination or possesses a device with a broken camera lens, they can switch immediately to a manual alphanumeric keyboard input fallback to resolve the shipment cleanly.

---

## 🚀 Quick Start with GitHub Codespaces

Our project is pre-configured for **GitHub Codespaces**, providing an instantaneous full-stack container sandbox with all languages and live databases automated:

1. Click the green **Code** button on this repository.
2. Select the **Codespaces** tab, then click **Create codespace on main**.
3. Once initialization concludes, open your terminal and start the backend service:
   ```bash
   cd backend && python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   flask run --port=5000
   ```
4. Split your terminal window and fire up the web application dashboard:
   ```bash
   cd frontend && npm install
   npm run dev
   ```
5. Use the control selector module in the sidebar panel to rotate freely between **Retailer Staff**, **Dispatcher Desk**, and **Motorcycle Rider** persona workflows for demonstration testing.

---

## 📊 Documentation Registry

All mandatory grading assets are version-controlled alongside the source code in the `docs/` folder:
*   `docs/STORYBOARD.md` — Detailed presentation slide map adhering to the one-takeaway rule.
*   `docs/TRADE_OFFS.md` — Log sheet detailing three intentional design shortcuts and their engineering justifications.
*   `docs/DEFENSE_FRAMEWORK.md` — High-pressure cross-examination playbook utilizing **State ➔ Context ➔ Evidence**.
*   `docs/DEMO_SCRIPT.md` — 3-minute operational execution timeline script for live presentations.

