
Welcome to the **City-Cruise-International** frontend. This is a high-fidelity, React-based educational platform designed with an "African/Diaspora" aesthetic—combining elite professional branding with smooth, soulful UX.

## 📌 Project Overview
City-Cruise-International is an end-to-end learning management system (LMS). 
- **Current State:** 100% UI/UX Complete (Frontend-Ready).
- **Tech Stack:** React, Tailwind CSS, Framer Motion, Zustand (State Management), Lucide-React.
- **Goal:** Replace "Mock Data" and "Local State" with a robust Node/Express/MongoDB backend.

---

## 🏗 System Logic & Flow
The application follows a specific state-driven journey:

1. **Authentication:** Users enter via `Login.jsx`. The app uses `useAuthStore.js` (Zustand) to persist the session.
2. **The Hub:** `Dashboard.jsx` serves as the command center. It calculates "Mastery Progress" based on completed course IDs.
3. **The Player:** `CoursePlayer.jsx` tracks video progress. *Backend needs to save % completion per user.*
4. **The Assessment:** Upon 100% completion, the `Exam.jsx` module is unlocked. Results are sent to the `adminStore`.
5. **The Reward:** When an Admin marks a submission as "Passed," a notification triggers in the student's dashboard, allowing them to invoke `CertificateGenerator.jsx` for a high-res PDF download.

---

## 📂 Core Directory Map

| Directory / File | Responsibility | Backend Action Required |
|:--- |:--- |:--- |
| `src/context/authStore.js` | Manages User/Session | Replace mock login with JWT Auth calls. |
| `src/context/adminStore.js` | Handles Grading/Notifications | Connect to a WebSocket or Poll API for real-time alerts. |
| `src/data/coursesData.js` | Static Course Content | Move this structure to a MongoDB 'Courses' Collection. |
| `src/pages/Dashboard.jsx` | User Stats & Enrolled Courses | Fetch `user.enrolledCourses` and `user.certificates`. |
| `src/pages/Exam.jsx` | Quiz Logic | `POST` results to `/api/submissions`. |
| `src/components/CertificateGenerator.jsx` | PDF Rendering Logic | Ensure `user.firstName` and `course.title` are sanitized. |

---


### Forgot Password Flow
**Sequence:** `forgot-password` -> `verify-otp` -> `reset-password`

#### a. Request OTP
- **Endpoint:** `POST /auth/forgot-password`
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | string | Yes | Registered email address |
- **Response:** `{ "success": true, "message": "If your email is registered, you will receive an OTP shortly." }`

#### b. Verify OTP
- **Endpoint:** `POST /auth/verify-otp`
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | string | Yes | User's email |
  | `otp` | string | Yes | 6-digit OTP received via email |
- **Response:** `{ "success": true, "message": "OTP verified successfully" }`

#### c. Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **Request Body:**
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `email` | string | Yes | User's email |
  | `otp` | string | Yes | Confirmed 6-digit OTP |
  | `newPassword` | string | Yes | New secure password |
- **Response:** `{ "success": true, "message": "Password reset successfully" }`





## 🔐 Security & Environment Variables
The backend developer must provide a `.env` file for the frontend containing:

```env
VITE_API_URL=http://localhost:5000/api



VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name

 **Admin Password:*admin123* 


  **PS:*Incae you could not run it just delete the node modules and package lock.json , then npm install It works like that* 