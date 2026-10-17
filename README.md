# 🔧 WorkStation — Handyman Service Platform

A full-stack web application that connects customers with service providers, making it easier to discover home services, post service requests, compare bids, and manage work in one place.

**Live Demo:** [WorkStation](https://work-station-sand.vercel.app/)

**GitHub Repository:** [Ananthu952/WorkStation](https://github.com/Ananthu952/WorkStation)

---

## 📌 Overview

WorkStation is a web-based handyman service marketplace designed to simplify the process of finding and hiring professionals for home maintenance and repair services.

Customers can create service requests and receive bids from providers. Service providers can explore available jobs and submit bids, while the platform supports managing work requests and bid acceptance through a structured workflow.

The project is being developed with a modern frontend and a Python-based backend, with an emphasis on usability, maintainability, and future extensibility.

## ✨ Features

### 👤 Authentication
- User registration and login.
- Password-based authentication.
- JWT-based authentication for protected API requests.
- Protected frontend routes.

### 🏠 Customer Features
- Customer dashboard.
- Create and manage service requests.
- View individual work-request details.
- Track work status.
- Review bids submitted by service providers.
- Accept a suitable bid.

### 🛠️ Service Provider Features
- Browse available work requests.
- View job details.
- Submit bids for jobs.
- Manage submitted bids.
- Support for a dedicated provider dashboard.

### 📂 Service Categories
- Organize services into categories.
- Retrieve service categories through the backend API.
- Connect service requests with relevant service information.

### 💰 Bidding Workflow
- Allow providers to submit bids for available work.
- Enable customers to review bids.
- Accept a selected bid.
- Support work assignment through the bidding process.

### 🔐 Role-Based Architecture
- Separate customer, provider, and administrator areas.
- Protected routes based on authentication and authorization.
- Architecture designed to support provider verification and administrative management.

> **Development note:** Provider applications, administrative workflows, notifications, maps, and other planned capabilities should be described as completed features only after their backend and frontend implementations are verified.

## 🧰 Technology Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Python
- Flask
- Flask REST API
- SQLAlchemy
- SQLite
- Flask-CORS
- JWT authentication

### Development Tools
- Git and GitHub
- Visual Studio Code
- Node.js and npm
- Python virtual environment

### Deployment
- Vercel for the frontend
- Configurable backend API URL

## 🏗️ Architecture

WorkStation follows a client-server architecture.

```text
┌─────────────────────────────┐
│       React Frontend        │
│                             │
│ React + TypeScript + Vite   │
│ Tailwind CSS + Axios        │
└──────────────┬──────────────┘
               │
               │ HTTP / REST API
               │ JWT Authentication
               ▼
┌─────────────────────────────┐
│       Flask Backend         │
│                             │
│ Authentication              │
│ Service Categories          │
│ Providers                    │
│ Work Requests                │
│ Bidding                      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           SQLite            │
│                             │
│ Application Data            │
└─────────────────────────────┘
```

## 📁 Project Structure

The repository contains separate frontend and backend applications.

```text
WorkStation/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── __init__.py
│   ├── run.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
└── README.md
```

*The directory tree is illustrative. Update filenames and folders to match the current repository.*

## ⚙️ Getting Started

Follow these steps to run WorkStation locally.

### Prerequisites

Install the following:

- Python 3.10 or later, compatible with the backend dependencies.
- Node.js and npm.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/Ananthu952/WorkStation.git
cd WorkStation
```

### 2. Set Up the Backend

Open a terminal in the backend directory.

```bash
cd backend
```

Create and activate a Python virtual environment.

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the backend dependencies.

```bash
pip install -r requirements.txt
```

Start the Flask application using the entry point configured in the project. For example, if the project uses `run.py`:

```bash
python run.py
```

The backend commonly runs at:

```text
http://localhost:5000
```

If your application uses a different entry point, follow the configuration in your backend.

### 3. Set Up the Frontend

Open another terminal.

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory if the application uses a configurable API base URL.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Set this value to the actual API prefix registered by your Flask application.

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### 4. Run Both Applications

Keep the backend and frontend running in separate terminals.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

Ensure that the frontend API URL, Flask routes, and CORS configuration agree before testing authentication and other API operations.

## 🔌 API Overview

The Flask backend is organized around REST API functionality.

| Module | Purpose |
|---|---|
| Authentication | User registration and login |
| Categories | Retrieve and manage service categories |
| Providers | Access service-provider information |
| Work Requests | Create, retrieve, and manage work requests |
| Bidding | Submit bids and manage bid-related operations |

The exact endpoint paths, HTTP methods, request bodies, and response formats depend on the routes registered in the current backend. Refer to the Flask route files for the authoritative API reference.

## 🔄 Typical User Workflow

1. A customer registers and logs in.
2. The customer creates a service request.
3. A service provider browses available work.
4. The provider submits a bid.
5. The customer reviews the submitted bids.
6. The customer accepts a suitable bid.
7. The work request moves into the assignment workflow.

## 🔒 Security Considerations

- JWT authentication for protected requests.
- Password hashing rather than storing plain-text passwords.
- Environment-based configuration for deployment.
- CORS configuration for approved frontend origins.
- Role and permission checks on protected backend operations.
- Secret keys and credentials should not be committed to GitHub.

Before production deployment, ensure that development secrets are replaced, sensitive environment variables are configured securely, and authorization is enforced by the backend rather than relying only on frontend route protection.

## 🚀 Deployment

The frontend is linked from the public GitHub repository and can be accessed here:

**[Open the WorkStation Live Demo](https://work-station-sand.vercel.app/)**

For a full deployment:

1. Deploy the frontend and configure its API base URL.
2. Deploy the Flask backend to a Python-compatible hosting platform.
3. Configure the production CORS origins.
4. Set secure JWT and application secret keys through environment variables.
5. Configure persistent database storage appropriate for the hosting environment.
6. Test registration, login, work creation, bid submission, and bid acceptance on the deployed application.

A production deployment must use a reachable backend URL; a local URL such as `localhost:5000` works only on the developer's machine.

## 🗺️ Future Enhancements

Potential improvements include:

- Provider verification and approval workflow.
- Location-based provider discovery and distance filtering.
- Provider portfolio galleries.
- Saved or favorite providers.
- Real-time notifications and messaging.
- Cloud-based image storage.
- Administrative analytics dashboard.
- Automated backend and frontend testing.
- Production monitoring and improved deployment configuration.

These items represent possible future enhancements and should be updated as implementation progresses.

## 👨‍💻 Author

**Ananthu S**

GitHub: [@Ananthu952](https://github.com/Ananthu952)

---

⭐ If you find this project interesting, consider starring the repository.

