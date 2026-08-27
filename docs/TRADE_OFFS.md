# Reflex System Design Trade-Off Log Sheet
*Sprint Reference:* Technical MVP Boundary Document

---

### 📉 Weak Point 1: HTTP Short Polling Network Resource Overhead
*   *What it is:* The React application pulls operational data tables every 10 seconds rather than opening persistent socket pipelines.
*   *Acceptable because:* It removes complex state infrastructure dependencies and connection state crashes on our Python cluster. This allowed us to devote 45% more sprint cycles toward validation models and offline field handling code routines.
*   *Time-unlocked alternative:* Migrate network layers entirely onto a unidirectional Server-Sent Events (SSE) streaming infrastructure framework.

### 📉 Weak Point 2: Storing Stateless JWT Auth State in LocalStorage
*   *What it is:* Security tokens for authentication profiles are cached on browser client memory domains directly.
*   *Acceptable because:* It completely bypasses the need for memory-heavy active session databases like Redis on the backend. This guarantees low operational latency targets on low-tier, free cloud server instances (Render).
*   *Time-unlocked alternative:* Reconfigure middleware authorization layers to emit strictly isolated HttpOnly and SameSite signed secure cookies.

### 📉 Weak Point 3: Client-Side Clock Dependency for Offline Logs
*   *What it is:* When a rider drops offline, the transaction log uses the phone's built-in system clock to generate tracking time labels.
*   *Acceptable because:* Devising cross-network vector clocks or distributed synchronization protocols is out of scope for a one-week sprint build. The server forces a strict "Last-Write-Wins" resolution logic based on database storage arrival time entries.
*   *Time-unlocked alternative:* Implement standard network event-sourcing structures paired with cryptographic hardware clock timestamps generated upon scanning.
