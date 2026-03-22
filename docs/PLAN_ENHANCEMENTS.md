# Smart Hub: Final Enhancement Phase Plan

This document outlines the planned upgrades for the Smart Hub platform to improve user experience, backend connectivity, and codebase cleanliness.

## 1. User Interface & Experience Refinement
*   **Profile Page Modernization**: 
    *   Transition from technical labels (e.g., "Developer Mode") to user-friendly titles.
    *   Implement high-fidelity visual cards for "Engagement Overview" and "Activity Stream."
*   **Settings Page Overhaul**:
    *   Consolidate `settings.html` and `profile.html` logic to ensure a consistent experience.
    *   Fix HTML structural issues (redundant tags, messy indentation).

## 2. Backend & Data Integration
*   **Persistent Settings**: 
    *   Ensure theme preferences (Dark/Light), units (Metric/Imperial), and profile visibility are saved to the backend database via `/api/auth/profile`.
*   **Friend Management System**:
    *   **Backend**: Add endpoints to `authRoutes.js` for finding users by ID and adding them as friends.
    *   **Frontend**: Add a "Add Friend by ID" input field on the profile page.
    *   **Persistence**: Store friend data in both the backend (for cross-device sync) and local storage (for offline access/caching).

## 3. Codebase Cleanup
*   **Unused Script Removal**: 
    *   Identify and remove legacy scripts such as `beautify.js`, `upgrade_design.js`, and redundant utility files.
    *   
*   **Local Database Optimization**: 
    *   Refine `calc_history` management to prevent bloat and Ensure consistent data structures.

## 4. Next Steps Execution
1.  **Cleanup**: Remove `beautify.js` and other py files files.
2.  **API Extension**: Add friend-related logic to the backend.
3.  **UI Implementation**: Update `profile.html` and `settings.html`.
4.  **Final Verification**: Test all sync points and common edge cases.
