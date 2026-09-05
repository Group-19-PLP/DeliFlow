# Technical Defense Framework

This document outlines the rationale behind the DeliFlow technology stack.

### 1. PostgreSQL over SQLite
Initially prototyped in SQLite, we migrated to **PostgreSQL** for production. SQLite uses file-level locking, meaning concurrent writes (e.g., a dispatcher assigning an order at the exact millisecond a retailer logs a new one) can crash the database. PostgreSQL easily handles high-concurrency ACID transactions, which is mandatory for a multi-tenant logistics platform.

### 2. React + Vite (Frontend)
We chose **Vite** over Create React App (CRA) or plain HTML/JS. Vite's instant Hot Module Replacement (HMR) accelerated our UI development. React allowed us to isolate complex logic (like the camera scanner and the polling loops) into reusable component lifecycles (`useEffect`), preventing the dispatcher dashboard from becoming a tangled mess of vanilla DOM manipulations.

### 3. Flask + Gunicorn (Backend)
**Flask** was selected over Django to keep the backend lightweight and exclusively focused on REST JSON endpoints. By pairing Flask with **Gunicorn** as our WSGI HTTP server, we created a robust, production-ready environment that can handle concurrent HTTP requests efficiently. We explicitly pinned `setuptools<=80.10.2` and forced Python 3.11 to ensure maximum compatibility between Gunicorn and our deployment environment.
