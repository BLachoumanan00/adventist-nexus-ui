
import React, { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { useNotifications } from "../context/NotificationContext";
import NotificationPanel from "./NotificationPanel";
import { useActivityLogger } from "../hooks/useActivityLogger";

interface HeaderProps {
  notificationCount?: number;
  onMenuClick?: () => void;
  isMobile?: boolean;
}

interface User {
  name: string;
  email: string;
  role: string;
  isSuperUser?: boolean;
}

const Header: React.FC<HeaderProps> = ({ notificationCount = 0, onMenuClick, isMobile = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const { logActivity } = useActivityLogger();
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
    }
  }, []);
  
  const handleLogout = () => {
    if (user) {
      logActivity("Logged Out");
    }
    
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] h-16 glass z-20 transition-all duration-300">
        <div className="h-full flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button 
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-bold md:hidden">Adventist College</h1>
          </div>
          
          <div className="flex-1 md:flex-initial">
            {/* Placeholder for future features */}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <div className="hidden lg:flex items-center mr-4">
                <div className="text-right mr-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-foreground/60">
                    {user.isSuperUser ? 'Superuser' : user.role}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
            
            <div className="relative">
              <button 
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 transition-colors touch-manipulation"
                onClick={() => setShowNotifications(prev => !prev)}
                aria-label="Notifications"
              >
                <Bell size={isMobile ? 18 : 20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            <ThemeToggle />
            
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 transition-colors touch-manipulation"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={isMobile ? 18 : 20} />
            </button>
          </div>
        </div>
      </header>
      
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};

export default Header;
