
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
}

interface User {
  name: string;
  email: string;
  role: string;
  isSuperUser?: boolean;
}

const Header: React.FC<HeaderProps> = ({ notificationCount = 0 }) => {
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
        <div className="h-full flex items-center justify-between px-6">
          <h1 className="text-lg font-bold md:hidden">Adventist College</h1>
          
          <div className="flex-1 md:flex-initial">
            {/* Placeholder for future features */}
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex items-center mr-4">
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
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 transition-colors"
                onClick={() => setShowNotifications(prev => !prev)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            <ThemeToggle />
            
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 transition-colors"
              title="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
};

export default Header;
