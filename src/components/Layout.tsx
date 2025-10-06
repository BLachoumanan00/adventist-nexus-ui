
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Set dynamic sidebar width variable for responsive layout
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isMobile ? "0px" : "240px"
    );
  }, [isMobile]);

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={handleBackdropClick}
        />
      )}
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />
      <Header 
        notificationCount={3} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />
      <main className="pt-16 pb-4 px-3 sm:px-4 lg:px-6 xl:px-8 ml-0 md:ml-[var(--sidebar-width)] transition-all duration-300 min-h-[calc(100vh-4rem)] overflow-x-hidden">
        <div className="w-full max-w-full lg:max-w-7xl xl:max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
