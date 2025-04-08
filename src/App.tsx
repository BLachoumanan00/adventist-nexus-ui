import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import TeacherPanel from "./pages/TeacherPanel";
import Results from "./pages/Results";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import UploadPanel from "./pages/UploadPanel";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { NotificationProvider } from "./context/NotificationContext";
import Notifications from "./pages/Notifications";
import StudentAttendance from "./components/StudentAttendance";
import CertificateGenerator from "./components/CertificateGenerator";
import ResultGenerator from "./components/ResultGenerator";
import UserActivityLog from "./components/UserActivityLog";

import "./App.css";

function App() {
  // Create a default admin user if none exists
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const superUserEmail = "blachoumanan@adventistcollege.mu";
    
    if (users.length === 0) {
      // Add a default admin user with the specific email
      const defaultAdmin = {
        name: "Billy Lachoumanan",
        email: superUserEmail,
        password: "Admin0000*",
        role: "Admin",
        isSuperUser: true, // Explicitly marking as superuser
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    } else {
      // Check if the superuser exists, if not ensure it does
      const superUserExists = users.some((user: any) => 
        user.email.toLowerCase() === superUserEmail.toLowerCase());
      
      if (!superUserExists) {
        const updatedUsers = [...users, {
          name: "Billy Lachoumanan",
          email: superUserEmail,
          password: "Admin0000*",
          role: "Admin",
          isSuperUser: true, // Explicitly marking as superuser
          createdAt: new Date().toISOString()
        }];
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      } else {
        // Make sure the existing superuser has the correct properties
        const updatedUsers = users.map((user: any) => {
          if (user.email.toLowerCase() === superUserEmail.toLowerCase()) {
            return {
              ...user,
              password: "Admin0000*", // Ensure password is correct
              role: "Admin", // Ensure role is correct
              isSuperUser: true // Explicitly ensure superuser status
            };
          }
          return user;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    }
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <Layout>
                  <TeacherPanel />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Layout>
                  <Results />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Statistics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Layout>
                  <StudentAttendance />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <Layout>
                  <CertificateGenerator />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/result-generator"
            element={
              <ProtectedRoute>
                <Layout>
                  <ResultGenerator />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-logs"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserActivityLog />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Layout>
                  <UploadPanel />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
