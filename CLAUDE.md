# Hostel Hub

Hostel management system with role-based access for Students, Wardens, and Admins. Students apply for gate passes and raise complaints; Wardens approve/reject gate passes and resolve/dismiss complaints for their hostel; Admins view hostel-level statistics and manage users.

## Architecture

Monorepo with two independent packages:

- **`backend/`** — Express.js REST API (Node.js, CommonJS `require`)
- **`frontend/`** — React 18 SPA (Create React App, JSX components)

Database: MongoDB via Mongoose. Auth: JWT (stored in `localStorage`, sent as `Bearer` token in `Authorization` header). File uploads: Multer → Cloudinary. Emails: Nodemailer (Gmail SMTP). Styling: Tailwind CSS + Bootstrap + CoreUI.

## Getting Started

```bash
# Backend
cd backend
npm install
npm run dev          # nodemon index.js (port from .env)

# Frontend
cd frontend
npm install
npm start            # react-scripts start (port 3000)
```

### Required Environment Variables (backend `.env`)

```
PORT=<number>
mongoURL=<mongodb-connection-string>
jwtSecretKey=<string>
CLOUDINARY_CLOUD_NAME=<string>
CLOUDINARY_API_KEY=<string>
CLOUDINARY_API_SECRET=<string>
EMAIL=<gmail-address>
EMAIL_PASS=<gmail-app-password>
```

## Backend Structure

```
backend/
├── index.js                          # Express app entry, mounts routes, CORS, middleware
├── dbConnection.js                   # Mongoose connect
├── vercel.json / vercel.js           # Vercel deployment config
├── models/
│   ├── user.models.js                # User schema (fullName, email, phone, role, hostel, room, rollNo, pass, salt)
│   ├── gatepass.models.js            # Gatepass schema (name, leaveType, dates/times, reason, status, hostel)
│   └── complaints.model.js           # Complaint schema (name, complaintType, complaintDetails, status, hostel)
├── controllers/
│   ├── user.controllers.js           # Signup, login, profile CRUD, hostel/student/warden listings, user removal
│   ├── gatepass.controllers.js       # Apply, edit, fetch, approve, reject, search gatepasses
│   ├── complaints.controllers.js     # Raise, fetch by user/hostel, resolve, dismiss, search complaints
│   └── admin.controllers.js          # Hostel statistics aggregation
├── routes/
│   ├── user.routes.js                # /user/*
│   ├── gatepass.routes.js            # /gatepass/*
│   ├── complaints.routes.js          # /complaints/*
│   └── admin.routes.js               # /admin/*
├── middlewares/
│   ├── auth.middlewares.js           # JWT auth check (skips /user/signup and /user/login)
│   └── multer.middlewares.js         # Memory storage, 5MB limit, jpg/jpeg/png only
└── services/
    ├── auth.services.js              # createToken / validateToken (jsonwebtoken)
    ├── cloudinary.services.js        # uploadOnCloudinary (stream upload)
    └── nodemailer.services.js        # sendEmail (Gmail transporter)
```

### API Routes

| Prefix        | Method   | Path                              | Auth | Role        | Handler                |
|---------------|----------|-----------------------------------|------|-------------|------------------------|
| `/user`       | POST     | `/signup`                         | No   | —           | userSignup             |
| `/user`       | POST     | `/login`                          | No   | —           | userLogin              |
| `/user`       | GET      | `/getUser`                        | Yes  | Any         | getUser                |
| `/user`       | PUT      | `/update`                         | Yes  | Any         | userUpdate             |
| `/user`       | POST     | `/profileImage`                   | Yes  | Any         | profileImageHandler    |
| `/user`       | POST     | `/changepassword`                 | Yes  | Any         | changePasswordHandler  |
| `/user`       | GET      | `/getHostels`                     | Yes  | Admin       | getHostelsHandler      |
| `/user`       | GET      | `/:hostel/getstudents`            | Yes  | Admin       | getStudentsHandler     |
| `/user`       | GET      | `/:hostel/getwardens`             | Yes  | Admin       | getWardensHandler      |
| `/user`       | DELETE   | `/remove/:userID`                 | Yes  | Admin       | removeUserHandler      |
| `/gatepass`   | POST     | `/apply`                          | Yes  | Student     | gatePassEntry          |
| `/gatepass`   | PATCH    | `/apply`                          | Yes  | Student     | gatePassEdit           |
| `/gatepass`   | GET      | `/all`                            | Yes  | Student     | getAllGatepass          |
| `/gatepass`   | GET      | `/warden/gatepass/:hostel`        | Yes  | Warden      | fetchHostelGatepasses  |
| `/gatepass`   | PUT      | `/warden/approve/:gatepassId`     | Yes  | Warden      | approveGatepass        |
| `/gatepass`   | PUT      | `/warden/reject/:gatepassId`      | Yes  | Warden      | rejectGatepass         |
| `/gatepass`   | GET      | `/search`                         | Yes  | Warden      | searchGatepasses       |
| `/complaints` | POST     | `/raise`                          | Yes  | Student     | raiseComplaint         |
| `/complaints` | GET      | `/getByUser`                      | Yes  | Student     | getComplaintsByUser    |
| `/complaints` | GET      | `/getByHostel`                    | Yes  | Warden      | getComplaintsByHostel  |
| `/complaints` | PUT      | `/warden/resolve/:complaintID`    | Yes  | Warden      | handleResolve          |
| `/complaints` | PUT      | `/warden/dismiss/:complaintID`    | Yes  | Warden      | handleDismiss          |
| `/complaints` | GET      | `/search`                         | Yes  | Warden      | searchComplaints       |
| `/admin`      | GET      | `/hostel-stats`                   | Yes  | Admin       | getHostelStats         |

### Data Models

**User** — roles: `Student | Warden | Admin`. Password hashed with HMAC-SHA256 + random salt in a Mongoose `pre('save')` hook. JWT contains: `id, name, profileImage, role, email, hostel, rollNo, room`.

**Gatepass** — leaveType: `Day Out | Night Out`. Status: `Pending → Approved | Rejected`. Linked to user via `createdBy` (ObjectId ref). One gatepass per outDate per user enforced in controller.

**Complaint** — types: `Furniture | Electrical | Water Supply | Cleaning | Mess Food`. Status: `Pending → Resolved | Dismissed`. Linked to user via `createdBy`.

## Frontend Structure

```
frontend/src/
├── App.js                            # Top-level routes: /login, /signup, /*→Main
├── index.js                          # ReactDOM render with BrowserRouter, AppContextProvider, Toaster
├── axiosConfig.js                    # Axios defaults: baseURL, token interceptor
├── Context/AppContext.js             # React Context for isAuthenticated state
├── Components/
│   ├── logIn/Login.jsx               # Login form
│   ├── logIn/Signup.jsx              # Signup form (Student/Warden role select)
│   ├── Home/Navbar.jsx               # Role-aware navbar (Admin sees Hostel Details/Stats; others see Gatepass/Complaints)
│   ├── Home/Homepage.jsx             # Landing carousel (CoreUI)
│   ├── Home/Main.jsx                 # Nested routes with ProtectedRoute wrappers
│   ├── ProtectedRoutes/ProtectedRoute.jsx  # Auth + role guard
│   ├── Profile/Profile.jsx           # View/edit profile, upload avatar, logout
│   ├── Profile/ChangePassword.jsx    # Change password form
│   ├── Gatepass/Gatepass.jsx         # Role switch: Student ↔ Warden view
│   ├── Gatepass/StudentGatepass.jsx  # Apply/edit gatepass + history table
│   ├── Gatepass/WardenGatepass.jsx   # Approve/reject pending gatepasses + search
│   ├── Complaints/Complaints.jsx     # Role switch: Student ↔ Warden view
│   ├── Complaints/StudentComplaints.jsx  # Raise complaint + history
│   ├── Complaints/RaiseComplaint.jsx     # Complaint form
│   ├── Complaints/ComplaintHistory.jsx   # Past complaints list
│   ├── Complaints/WardenComplaints.jsx   # Resolve/dismiss pending complaints + search
│   ├── Admin/HostelDetails.jsx       # List all hostels with student/warden counts
│   ├── Admin/HostelListing.jsx       # View students/wardens for a hostel, remove users
│   └── Admin/HostelStatistics.jsx    # Pie chart (Chart.js) of student distribution
└── Images/                           # Static images and logos
```

### Frontend Conventions

- Functional components only, hooks for state (`useState`, `useEffect`, `useContext`).
- Styling: Tailwind utility classes inline. Brand color: `#DC851F` (orange), dark text: `#343330`.
- API calls via configured Axios instance (`axiosConfig.js`), token from `localStorage`.
- Toast notifications: `react-hot-toast`.
- Loading spinners: `react-spinners` (`ScaleLoader`).
- No TypeScript. No state management library (just Context).

## Deployment

- **Backend**: Vercel (via `vercel.json`, `@vercel/node`). Set env vars in Vercel dashboard.
- **Frontend**: Vercel. Set `REACT_APP_API_URL` env var to your deployed backend URL.
- After deploying backend, add your frontend's Vercel URL to the CORS `origin` array in `backend/index.js`.

## Development Notes

- Backend uses CommonJS (`require`/`module.exports`). Frontend uses ES modules (`import`/`export`).
- The `pass` field (not `password`) is used throughout for the password field name.
- JWT tokens have no expiry set — they are valid indefinitely.
- Auth middleware runs globally; only `/user/signup` and `/user/login` are exempt.
- Email notifications are sent on: signup (welcome), gatepass approved/rejected, complaint resolved/dismissed.
- No role-based middleware on routes; role enforcement is only in the frontend via `ProtectedRoute`. Any authenticated user can hit any API endpoint.
