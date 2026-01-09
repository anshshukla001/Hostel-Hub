import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Homepage from "./Homepage";
import Gatepass from "../Gatepass/Gatepass";
import Profile from "../Profile/Profile";
import ProtectedRoute from "../ProtectedRoutes/ProtectedRoute";
import Complaints from "../Complaints/Complaints";
import ChangePassword from "../Profile/ChangePassword";
import HostelDetails from "../Admin/HostelDetails";
import HostelListing from "../Admin/HostelListing";
import HostelStatistics from "../Admin/HostelStatistics";

const Main = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute
              component={Homepage}
              allowedRoles={["Student", "Warden", "Admin"]}
            />
          }
        />
        <Route
          path="/gatepass"
          element={
            <ProtectedRoute
              component={Gatepass}
              allowedRoles={["Student", "Warden"]}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              component={Profile}
              allowedRoles={["Student", "Warden", "Admin"]}
            />
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute
              component={Complaints}
              allowedRoles={["Student", "Warden"]}
            />
          }
        />
        <Route
          path="/changepassword"
          element={
            <ProtectedRoute
              component={ChangePassword}
              allowedRoles={["Student", "Warden", "Admin"]}
            />
          }
        />
        <Route
          path="/hosteldetails"
          element={
            <ProtectedRoute
              component={HostelDetails}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/hostel/:hostelID"
          element={
            <ProtectedRoute
              component={HostelListing}
              allowedRoles={["Admin"]}
            />
          }
        />
        <Route
          path="/hostelstatistics"
          element={
            <ProtectedRoute
              component={HostelStatistics}
              allowedRoles={["Admin"]}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Main;
