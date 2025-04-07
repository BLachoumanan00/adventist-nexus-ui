
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import { Toaster } from "./components/ui/toaster";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import TeacherPanel from "./pages/TeacherPanel";
import Results from "./pages/Results";
import UploadPanel from "./pages/UploadPanel";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { NotificationProvider } from "./context/NotificationContext";
import UserActivityLog from "./components/UserActivityLog";

const queryClient = new QueryClient();

function App() {
  const [isSuperUser, setIsSuperUser] = useState(false);

  useEffect(() => {
    // Check if user is superuser
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsSuperUser(userData.isSuperUser === true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
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
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <UploadPanel />
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
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                {isSuperUser && (
                  <Route
                    path="/activity"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <div className="glass-card">
                            <h2 className="text-xl font-semibold mb-6">User Activity Log</h2>
                            <UserActivityLog />
                          </div>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                )}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
              <Toaster />
            </Router>
          </NotificationProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
