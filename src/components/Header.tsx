
import React from "react";
import { Bell, Search, User } from "lucide-react";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ notificationCount = 0 }) => {
  const location = useLocation();
  
  // Map routes to page titles
  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      "/": "Dashboard",
      "/admin": "Admin Panel",
      "/upload": "Upload Data",
      "/teacher": "Teacher Panel",
      "/statistics": "Statistics",
      "/results": "Results Generator",
      "/messages": "Messages",
      "/notifications": "Notifications",
      "/settings": "Settings",
    };
    
    return pathMap[location.pathname] || "Dashboard";
  };

  return (
    <header className="h-16 glass fixed top-0 right-0 left-[var(--sidebar-width)] z-20 transition-all duration-300 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 rounded-full glass border-none focus:ring-2 ring-primary/30 outline-none w-40 md:w-64 placeholder:text-foreground/50"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={16} />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
              {notificationCount}
            </span>
          )}
        </button>
        
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>
    </header>
  );
};

export default Header;
