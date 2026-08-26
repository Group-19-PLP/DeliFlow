# Reflex Presentation Storyboard Outline

### Slide 1: The Status Quo Crisis
*   *Visual Elements:* Splitted comparison chart showing messy chaotic phone logs vs lost customer data receipts.
*   *Core Takeaway:* *Unstructured messaging tools lead to lost delivery tracking records and layout visibility blindspots for small Kenyan retail entities.*
*   *Speaker Script notes:* Today, thousands of merchants coordinate high-value logistics via chaotic WhatsApp threads. There is zero historical verification of context, no live rider assignment verification tracking, and zero absolute proof of package arrival.

### Slide 2: The Reflex Solution Architecture
*   *Visual Elements:* Workflow pipeline illustration linking Retail Input Panel -> Dispatch Routing Desk -> Rider Status Endpoint App.
*   *Core Takeaway:* *Reflex centralizes dispatch logic into single role-based views with structured sequential transaction protections.*
*   *Speaker Script notes:* We built a lightweight architecture optimized for real-world field settings. By shifting coordination out of untracked personal chat logs, we establish clean, accountable records at every point of the asset transport lifecycle.

### Slide 3: System Architecture Overview
*   *Visual Elements:* System block diagram illustrating the React frontend, Flask API gateway layer, and transactional PostgreSQL storage database.
*   *Core Takeaway:* *A lightweight relational stack ensures absolute validation and concurrency guards for active logistical route entries.*
*   *Speaker Script notes:* We selected a Python/Flask structure connected to a robust PostgreSQL engine. This approach guarantees that two dispatch agents cannot cross-assign a single rider asset simultaneously, preventing real-time delivery collisions.
