# Design References Directory (`context/designs/`)

Place any visual design references, UI mockups, wireframes, or inspiration screenshots here.

## How to Use During Agile Sprints

1. **Drop Images:** Place your reference images (e.g. `dashboard-mockup.png`, `users-page-design.jpg`, `club-details-wireframe.png`) in this folder.
2. **Instruct the Agent:** When prompting to refactor a specific page, mention the file name or ask the agent to inspect `context/designs/`.
3. **Agile Workflow:**
   - **Step 1:** The agent analyzes the design reference in `context/designs/`.
   - **Step 2:** The agent checks `context/ui-tokens.md` and `context/ui-rules.md` to map colors, typography (`Poppins` + `Roboto`), spacing, and geometry.
   - **Step 3:** The agent builds the mock layout first and verifies visual fidelity.
   - **Step 4:** The agent wires the backend APIs (`BACKEND_ADMIN_API_GUIDE.md` / `Admin.postman_collection.json`) or real-time Socket.io events.
   - **Step 5:** The agent adds micro-animations, tests edge cases, and registers new patterns in `context/ui-registry.md`.
