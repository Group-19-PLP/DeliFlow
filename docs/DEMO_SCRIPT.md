# Live Demo Operational Execution Script
**Target Duration:** 3:00 Minutes | **Presenter:** Emmanuel (Sharing Screen)

---

### ⏱️ Phase 1: The Retailer Request Log (00:00 - 01:00)
1. **Action:** Emmanuel selects the **Retailer Staff** persona dropdown toggle view.
2. **Action:** Input these exact test metrics into the form fields:
   * *Customer Name:* "Mwangi Kamau"
   * *Phone:* "0712345678"
   * *Address:* "Biashara Street, Nairobi"
   * *Item:* "Samsung Smartphone Box"
3. **Action:** Click **"Dispatch Request"**.
4. **Talking Point (Emmanuel):** *"Notice that the moment I log this request, it hits our PostgreSQL ledger with a state of `PENDING`. Our HTTP polling loop means the central dispatch dashboard will surface this request automatically within 10 seconds without manual page refreshes."*

### ⏱️ Phase 2: The Dispatcher Assignment (01:00 - 02:00)
1. **Action:** Switch the persona selector dropdown to **Dispatcher Desk**.
2. **Action:** Locate the freshly logged "Mwangi Kamau" row item in the open queue.
3. **Action:** Select **"Rider Juma (Boda ID: 442)"** from the assignment selector dropdown.
4. **Action:** Click **"Confirm Route"**.
5. **Talking Point (Emmanuel):** *"Our Flask backend intercepts this action, verifies that the rider is currently unassigned, and moves the request to the `ASSIGNED` state. This change propagates instantly out to Rider Juma's mobile tracking terminal view."*

### ⏱️ Phase 3: Rider Collection & Verification Scan (02:00 - 03:00)
1. **Action:** Switch the persona selector dropdown to **Motorcycle Rider**.
2. **Action:** Click **"Confirm Package Pick Up"**. (The status badge turns to `PICKED_UP`).
3. **Action:** Click **"Open Camera Scanner to Deliver"**. (The live hardware camera preview box mounts).
4. **Action:** Type `RFX-900` into the manual backup fallback entry box (simulating a broken lens block state).
5. **Action:** Click **"Verify"**. (The component updates instantly to a green checkmark indicating successful completion).
6. **Talking Point (Student D):** *"If Rider Juma works in low-light settings or carries an older handset, camera scans can fail. By utilizing our secondary verification code endpoint fallback, he inputs the tracking sequence manually, confirming delivery safely without crashing the backend execution loop."*
