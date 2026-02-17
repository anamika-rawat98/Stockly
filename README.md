# 🍔 Stockly – Full-Stack Food Inventory Application

A **secure and modern full-stack food inventory application** built with **React, TypeScript, Redux Toolkit, Node.js, Express, and MongoDB**.

This project implements a complete **authentication flow** with **JWT-based authorization**, **protected routes**, and **persistent sessions**, along with an intuitive UI for managing inventory and shopping lists. The app also features a **modern glass effect UI** with translucent cards and backdrops for a sleek look.

---

## 🚀 Key Features

**Authentication & Security**

- User registration, login, and secure logout
- JWT-based authorization for backend routes
- Password hashing using bcrypt
- Persistent login using localStorage

**Inventory Management**

- Add, edit, delete, and search pantry items
- Track item quantity, minimum alert levels, and expiry dates
- Inline quick quantity updates with live stock preview
- Visual stock & expiry status indicators
- Shopping list integration for low or out-of-stock items

**UI & UX**

- Responsive modern UI built with Mantine
- **Glass effect** using translucent backgrounds and backdrop blur
- Interactive modals, tables, and forms
- Real-time notifications for actions and errors
- Smooth loaders for async operations

**Frontend & Backend Integration**

- Axios for API calls
- Global state management using Redux Toolkit
- Async operations handled with Thunks
- Protected backend routes and error handling

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit + Thunks
- Mantine UI & Notifications
- TailwindCSS for custom styling

### Backend

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt password hashing
- RESTful API design

---

## ⚡ Getting Started

**Clone the repo:**

```bash
git clone https://github.com/yourusername/stockly.git
cd stockly

Frontend
cd frontend
npm install
npm run dev

Backend
cd backend
npm install
npx ts-node src/index.ts

Access the app at http://localhost:8000
```
