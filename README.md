
# 🧪 ONLINE EXAMINATION

## 📘 Project Overview

**ONLINE EXAMINATION** is a modern web-based system designed to manage online assessments for schools, colleges, and training centers. It allows **Admins**, **Lecturers**, and **Students** to interact within a secure and dynamic examination environment. The platform automates the process of quiz/exam creation, assignment, and grading with real-time result feedback and email notifications.

---

## 🎯 Objectives

- Simplify the process of managing and conducting exams.
- Enable real-time result generation and analytics.
- Provide role-based access with clear responsibilities.
- Ensure secure and mobile-accessible examination.

---

## 🛠️ Technologies Used

- **Frontend:** React.js
- **Backend:** ASP.NET Web API
- **Database:** SQL Server / MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Email Service:** SMTP or SendGrid
- **Hosting (optional):** Azure / AWS / Firebase

---

## 👥 User Roles & Functionalities

### 🛡️ Admin
- Secure login.
- Access Admin Dashboard.
- Create/Manage **Lecturer** accounts.
- Manage all users (Students & Lecturers).
- View overall platform activity.
- Manage all quizzes/exams system-wide.
- View quiz analytics and reports.
- Delete or disable users if needed.

### 👩‍🏫 Lecturer
- Register/Login securely.
- Access Lecturer Dashboard.
- Create, edit, and delete exams/quizzes.
- Add questions (MCQs, True/False, Short Answers).
- View student submissions and analytics.
- Receive notifications when a student submits an exam.

### 🎓 Student
- Register/Login securely.
- Access Student Dashboard.
- View available exams/quizzes.
- Attempt assigned exams.
- View results immediately after submission.
- Receive email confirmation of submission and score.

---

## 🧩 Updated Database Schema

Here's a suggested structure of the relational database for `ONLINE EXAMINATION`:

### 📂 Tables and Descriptions

| Table Name       | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `Users`          | Stores user information and roles (Admin, Lecturer, Student)                |
| `Roles`          | Defines user roles (Admin, Lecturer, Student)                               |
| `Quizzes`        | Contains details of each quiz or exam                                       |
| `Questions`      | Stores different question types linked to a quiz                            |
| `Answers`        | Stores student-submitted answers                                            |
| `Results`        | Stores calculated scores and feedback                                       |
| `EmailLogs`      | Stores email history/notifications sent                                     |
| `QuizAssignments`| Links quizzes to specific students (used for assigning exams selectively)   |
| `AuditLogs`      | Tracks user activities (created quiz, submitted exam, etc.)                 |

### 📦 Sample ER Model Relationships

- One `User` can have one `Role`
- One `Lecturer` can create multiple `Quizzes`
- Each `Quiz` can have multiple `Questions`
- Each `Student` can submit `Answers` linked to `Questions`
- Each `Answer` can be used to generate `Results`

---

## 📊 Dashboards Overview

### Admin Dashboard
- User management (Create/Edit/Delete Users)
- System activity logs and analytics
- Quiz/Exam management (View all quizzes by all lecturers)
- View platform stats (e.g., total users, quizzes conducted)
- Email notification monitor/logs

### Lecturer Dashboard
- Create/Edit quizzes
- Add questions and set timers
- Assign quizzes to students
- View student performance and quiz stats

### Student Dashboard
- View assigned quizzes
- Attempt quizzes within the time limit
- View results history
- Profile and password management

---

## ✅ Functional Requirements

- Secure login & JWT-based authentication
- Role-based access control
- Exam creation with multiple question types
- Timed quizzes with countdown
- Real-time scoring & result display
- Email notifications on submission and quiz assignment
- Admin tools for user and system management

---

## 📏 Non-Functional Requirements

- Handle 100+ concurrent users efficiently
- Responsive UI for desktop and mobile devices
- Data encryption and password hashing
- Robust input validation and error handling
- Cross-browser compatibility

---

## 📧 Email Notifications

Email alerts are sent for the following:
- **Student:** Confirmation of exam submission + result summary.
- **Lecturer:** Notification when student completes an assigned quiz.
- **Admin:** Account activity alerts (e.g., user creation, quiz deletion).

---

## 🔮 Enhancements
- Export results as PDF/Excel
- Live quiz monitoring dashboard
- Bulk upload of questions (CSV/Excel)
- Integration with learning management systems (LMS)

