
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { ThemeProvider } from "./hooks/useTheme";

import "./App.css";

function App() {
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const superUserEmail = "blachoumanan@adventistcollege.mu";
    
    if (users.length === 0) {
      const defaultAdmin = {
        name: "Billy Lachoumanan",
        email: superUserEmail,
        password: "Admin0000*",
        role: "Admin",
        isSuperUser: true,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    } else {
      const updatedUsers = users.map((user: any) => {
        if (user.email.toLowerCase() === "blackhoumanan@adventistcollege.mu") {
          return {
            ...user,
            isSuperUser: false,
            role: "Admin"
          };
        }
        
        if (user.email.toLowerCase() === superUserEmail.toLowerCase()) {
          return {
            ...user,
            password: "Admin0000*",
            role: "Admin",
            isSuperUser: true
          };
        }
        
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  }, []);

  return (
    <ThemeProvider>
      <NotificationProvider>
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
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
