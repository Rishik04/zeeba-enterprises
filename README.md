# 🏗️ Zeba Enterprises – Construction Company Website

A full-stack web application built for **Zeba Enterprises**, a contracting, engineering, and infrastructure company.
The platform includes a **public-facing website** to showcase projects, services, tenders, and careers, along with a **secure admin dashboard** for managing content and job applications.

---

## 🚀 Tech Stack

### Frontend

* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, Shadcn UI (Radix UI primitives)
* **State & Data Fetching:** TanStack Query, Axios
* **Animations:** Framer Motion
* **Forms & Validation:** React Hook Form, Zod
* **Charts & Visualization:** Recharts
* **Routing:** React Router

### Backend

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (JSON Web Tokens), Bcrypt
* **File Uploads:** Multer

---

## 📂 Project Structure

```bash
zeba-enterprises/
├── backend/                # Express.js Backend
│   ├── src/
│   │   ├── auth/           # Authentication middleware
│   │   ├── controller/     # Route controllers (Career, Project, User)
│   │   ├── db/             # Database connection logic
│   │   ├── model/          # Mongoose Schemas
│   │   ├── services/       # Business logic
│   │   └── server.js       # Entry point
│   ├── uploads/            # Stored images and resumes
│   └── package.json
│
└── frontend/               # React Frontend
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/         # Images and logos
    │   ├── components/     # Reusable UI components (Admin, Pages, UI)
    │   ├── App.tsx         # Main application component & Routing
    │   └── main.tsx        # Entry point
    └── package.json
```

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js **v18+**
* MongoDB (Local instance or MongoDB Atlas)

---

### 🔹 Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

3. Start the backend server:

```bash
npm run dev
```

The API server will run on the port defined in `.env` (default: **5000**).

---

### 🔹 Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
npm install
```

2. Start the frontend development server:

```bash
npm run dev
```

The application will be available at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## ✨ Features

### 🌐 Public Portal

* Projects: View completed and ongoing construction projects
* Services: Detailed overview of engineering & contracting services
* Careers: Browse job openings and apply online
* Tenders: View current tender information
* Contact: Reach out to the company via contact forms

### 🔐 Admin Dashboard

* Secure admin authentication
* Create, update, and delete:

  * Projects
  * Career openings
  * Tender listings
* Review and manage job applications
* Upload and manage images/files

---

## 📄 Available Scripts

### Frontend (`/frontend`)

* `npm run dev` – Start development server
* `npm run build` – Build for production

### Backend (`/backend`)

* `npm run dev` – Start server with Nodemon (hot reload)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch:

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes:

```bash
git commit -m "Add AmazingFeature"
```

4. Push to the branch:

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

## 📝 License

This project is **proprietary** and owned by **Zeba Enterprises**.
Unauthorized copying, modification, or distribution is prohibited.
