# 📚 Library Management System

A comprehensive Library Management System built with Flask and Celery, offering robust user authentication, book management, and request handling, plus automated notifications via email. Designed for seamless library administration and an easy user experience.

---

## 🚀 Features

- **User Authentication & Roles**: Secure login and role-based access.
- **Admin Dashboard**: Admins can:
  - Approve or reject book requests.
  - View logs and issued books.
- **Book Management**:
  - Users can browse, request, and view issued books.
  - Admins manage book details, including sections.
- **Request System**:
  - Users can submit borrowing requests (limited to 5 active requests).
  - Admins view and manage all requests.
- **Feedback & Logging**:
  - Users submit feedback on books.
  - Activity logs track requests, approvals, returns, and rejections.
- **Automated Email Notifications**:
  - **Daily Reminder**: Reminds users who haven’t logged in within 24 hours.
  - **Monthly Report**: Summarizes each user’s book requests and issues.

---

## 🛠️ Tech Stack

- **Backend**: Flask, SQLAlchemy ORM, Rest API
- **Frontend**: VueJs, Bootstap, Javascript
- **Task Management**: Celery for task scheduling
- **Database Models**:
  - `User`, `Role`, `Books`, `Section`, `Request`, `IssueBook`, `Log`, `Feedback`
- **API Endpoints**:
  - **User**: login, registration, book request, feedback submission.
  - **Admin**: request management, approval/rejection, logs access.

---

## 📝 Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configue Celery
```bash
celery -A your_application_name worker --loglevel=info
```

### 3. Run Application

```bash
flask run
```


