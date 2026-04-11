# Admin Utility Features - Issues & Gaps

During the implementation of the new admin utility endpoints, the following items were identified as potential areas for improvement or gaps:

## 1. Pagination in UI
- **Activity Logs:** The `adminGetActivityLogs` is called with a default limit of 50. The UI currently lacks pagination controls to view older logs.
- **Students Search:** The `getStudents` API supports limit and offset, but the UI does not implement infinite scroll or pagination for search results.

## 2. Status Consistency
- **User Status:** The API now uses `isActive` (boolean), but some parts of the frontend were previously checking for a `status` string (e.g., "Active", "Banned"). I have updated the components to honor `isActive`, but a full codebase audit for status strings is recommended.
- **Course Status:** The toggle now sends `active` or `inactive`. The UI still internalizes "Published" and "Draft" for labels, which may lead to minor terminology mismatches if the backend only recognizes the new status values.

## 3. Category/Discipline Tags
- **Automatic Generation:** Tags are currently auto-generated from the name (e.g., "Web Dev" -> "web-dev"). If the user requires specific tags that don't match the name exactly, a dedicated tag input field in the UI will be necessary.

## 4. Stats Object Structure
- **Assumed Schema:** I've implemented the `stats` display assuming the backend returns an object with `totalStudents`, `revenue`, `pendingExams`, and a `trends` object. If the backend schema differs, the mapping in `AdminDashboard.jsx` stats array will need adjustment.

## 5. Lesson Deletion UI
- **Curriculum Context:** Deleting a lesson from the curriculum builder now triggers an API call if the lesson has a database ID. However, there is no "undo" for this action since it deletes from the DB immediately rather than waiting for the "Save Course" action.

## 7. Exam Update Mechanism
- **Bulk Nested Updates (500 Error):** The `adminUpdateExam` currently sends both `title` and a nested `questions` array via `PATCH /admin/exams/:id`. This is currently resulting in a **500 Internal Server Error**.
- **Recommended Backend Fix:** The backend should be updated to handle nested question updates within the Exam PATCH. If the backend only supports updating `passPercentage` on the Exam object, then separate endpoints for updating individual questions (e.g., `PATCH /admin/questions/:id`) or a dedicated bulk question sync endpoint will be required.
- **Instructional Dummies:** If an exam curriculum is currently empty, the builder provides instructional templates.

## 8. Technical Discrepancies & Fixes
- **GET /admin/courses/:id/exam (404):** The admin endpoint for fetching course exams was 404ing. I've switched the frontend to use the public `GET /courses/:id/exam` endpoint. If an admin-specific view (to see answers/hidden fields) is required, the backend must implement or fix the `/admin` prefix route.
- **Question Field Mapping:** The backend returns `question_text`, while the frontend builder uses `text`. I've implemented a standardized remapping layer during fetch to ensure `question_text` is correctly rendered in the UI.

## 9. Development Roadmap
- **Pagination:** Implement pagination for user search and activity logs.
- **Improved UX:** Transition `alert()` and `confirm()` to unified toast/modal systems.
