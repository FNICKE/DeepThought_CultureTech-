# Hiring Assignment Submission: TechHR Portal (MERN)

**Role:** React Developer  
**Candidate:** [Your Name]  
**Deployment Link:** [https://deepthought1.netlify.app/](https://deepthought1.netlify.app/)

---

## 🚀 Project Overview
This project is an advanced, IT-focused HRMS (Human Resource Management System) built using the MERN stack. Originally based on a construction industry template, the system has been pivoted to handle tech-sector workflows, including modern designations (Developers, Designers, PMs) and engineering-centric departments.

## 🛠 Tech Stack
- **Frontend:** React.js, Tailwind CSS, Lucide-React (Icons), Framer Motion (Animations)
- **Backend:** Node.js, Express.js
- **Database:** MySQL (Hosted on Clever Cloud)
- **Deployment:** Netlify (Frontend) & Render (Backend)

---

## ✨ Key Features & Tickets Completed

### 1. Overtime Management (Part 1)
- **Logging Interface:** Dedicated screen for site managers to log extra hours.
- **Strict Validations:** 
  - Frontend & Backend: Hours (1-6 per day).
  - Date Window: 7-day limit for new entries.
  - **Monthly Cap:** Automated backend rejection if a worker exceeds 60 hours per month.
- **Persistence:** Full status tracking (Pending/Approved/Rejected).

### 2. Ticket Blitz (Part 2)
- **LF-101 (Date Formatting):** Standardized all dates to `DD/MM/YYYY` (Indian Standard).
- **LF-102 (Validation):** Implemented negative-salary prevention on both client and server.
- **LF-103 (Designations):** Added a dynamic IT-focused designation system (Fullstack, Backend, etc.).
- **LF-104 (CSV Export):** Integrated a one-click CSV export for the employee directory.
- **LF-105 (Mobile Responsiveness):** Rebuilt the layout using a mobile-first sidebar drawer and scrolling data tables for seamless field use.

### 3. Payroll Management Hub
- Added a full CRUD system for Salary entries, allowing managers to view, edit, and delete processed payments.

---

## ⚙️ Setup & Installation
1. Clone the repository.
2. Install dependencies: `npm install` (in both `frontend` and `backend` directories).
3. Set up your `.env` file with MySQL credentials.
4. **Initialize Database:** Run `npm run db:init` in the backend folder to build the schema automatically.
5. **Unlock IT Roles:** Run `node scripts/fixDesignations.js` to configure the role-based security.
6. Start the app: `npm run dev`.

---

## 🤖 AI Usage Note
I used **Antigravity (Google DeepMind)** as my primary AI coding assistant. Antigravity helped me:
- Refactor the UI for premium responsiveness.
- Debug complex MySQL ENUM constraints during the transition to IT roles.
- Implement robust multi-layer validation for the Overtime feature.
- Optimize the Git workflow to ensure sensitive environment variables were properly ignored.

---
*Developed for DeepThought — April 2026*
