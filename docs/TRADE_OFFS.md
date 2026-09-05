# Architectural Trade-Offs

In engineering DeliFlow, our team had to balance developer velocity, system reliability, and real-world last-mile delivery constraints. Below are the primary architectural trade-offs we made:

### 1. HTTP Short-Polling vs. WebSockets
*   **The Decision:** We implemented a 10-second HTTP polling loop on the React frontend to refresh the dispatch and rider queues, rather than using WebSockets (Socket.io/ActionCable).
*   **The Trade-Off:** While WebSockets offer true real-time updates, they introduce significant complexity in deployment, load balancing, and handling dropped connections on spotty mobile networks. Short-polling guarantees state synchronization every 10 seconds and is highly resilient to connection drops, which is critical for riders in low-signal areas.

### 2. Dual-Channel QR Scanner (Camera + Manual Fallback)
*   **The Decision:** We integrated `html5-qrcode` for hardware scanning but strictly built a manual 6-digit alphanumeric fallback.
*   **The Trade-Off:** Relying 100% on a camera scanner provides a magical UX, but in real-world Kenyan delivery scenarios, riders may have broken lenses, work in pitch-black lighting, or face strict browser camera permission blockers. The UI trade-off of having a manual entry field ensures 100% delivery completion rates regardless of hardware degradation.

### 3. Render Free Tier Deployment vs. AWS/GCP
*   **The Decision:** We deployed the web service and static site to Render instead of provisioning EC2 instances or Google Cloud Run.
*   **The Trade-Off:** Render provides zero-configuration CI/CD directly from GitHub, maximizing our development speed. The trade-off is the "cold start" delay on the free tier (the API spins down after inactivity). For a production enterprise scale, we would migrate to a paid tier or AWS, but Render was optimal for this sprint.
