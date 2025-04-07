
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  // Set dynamic sidebar width variable for responsive layout
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isMobile ? "0px" : "16rem"
    );
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950">
      <Sidebar />
      <Header notificationCount={3} />
      <main className="pt-20 pb-6 px-6 ml-0 md:ml-[var(--sidebar-width)] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
