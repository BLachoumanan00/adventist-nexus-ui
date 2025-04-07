
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart2, 
  FileText, 
  Settings, 
  Mail, 
  Bell, 
  Menu, 
  X, 
  Upload, 
  ShieldCheck 
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: ShieldCheck, label: "Admin Panel", path: "/admin" },
    { icon: Upload, label: "Upload Data", path: "/upload" },
    { icon: BookOpen, label: "Teacher Panel", path: "/teacher" },
    { icon: BarChart2, label: "Statistics", path: "/statistics" },
    { icon: FileText, label: "Results", path: "/results" },
    { icon: Mail, label: "Messages", path: "/messages" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Return mobile menu if on mobile
  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-2 rounded-full glass"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Mobile navigation menu - slide in from left */}
        <div
          className={`fixed inset-0 z-40 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="relative h-full w-64 glass shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h1 className="font-bold text-lg">Adventist College</h1>
              <ThemeToggle />
            </div>
            <nav className="p-3 flex flex-col gap-1">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="nav-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="glass px-4 py-2 rounded-full text-sm">
                Adventist College Mauritius
              </div>
            </div>
          </div>
          
          {/* Backdrop - click to close */}
          <div 
            className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } glass fixed left-0 top-0 transition-all duration-300 overflow-hidden z-30 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!isCollapsed && <h1 className="font-bold">Adventist College</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <nav className="p-3 flex-grow flex flex-col gap-1">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? item.label : ""}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        {!isCollapsed && <div className="text-sm">Theme</div>}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
