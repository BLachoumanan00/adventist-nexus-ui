
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import UploadPanel from "./pages/UploadPanel";
import TeacherPanel from "./pages/TeacherPanel";
import Statistics from "./pages/Statistics";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
            <Route path="/upload" element={<Layout><UploadPanel /></Layout>} />
            <Route path="/teacher" element={<Layout><TeacherPanel /></Layout>} />
            <Route path="/statistics" element={<Layout><Statistics /></Layout>} />
            <Route path="/results" element={<Layout><Results /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
