
import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { 
  BarChart, 
  GraduationCap, 
  Settings, 
  Upload, 
  Users, 
  FileText, 
  PieChart, 
  Bell,
  Calendar,
  Award,
  FileBarChart,
  ClipboardList,
  Sun,
  Moon
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../hooks/useTheme";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  badge?: number;
}

const SidebarLink: React.FC<SidebarLinkProps & { onClick?: () => void }> = ({ to, icon, text, badge, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors touch-manipulation ${
        isActive ? "bg-primary/20 text-primary" : "hover:bg-white/10 active:bg-white/20"
      }`}
    >
      {icon}
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">{text}</span>
      {badge !== undefined && badge > 0 && (
        <div className="ml-auto bg-primary text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
          {badge > 99 ? "99+" : badge}
        </div>
      )}
    </NavLink>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose, isMobile = false }) => {
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`w-60 h-full overflow-y-auto glass border-r border-white/10 flex flex-col fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 ${
      isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
    }`}>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-lg font-bold whitespace-nowrap">School Management</h1>
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <nav className="flex-1 p-2">
        <div className="mb-6">
          <div className="text-xs uppercase text-foreground/50 font-medium px-3 py-1.5">
            General
          </div>
          <div className="space-y-1">
            <SidebarLink to="/dashboard" icon={<BarChart size={18} />} text="Dashboard" onClick={handleLinkClick} />
            <SidebarLink to="/notifications" icon={<Bell size={18} />} text="Notifications" badge={unreadCount} onClick={handleLinkClick} />
            <SidebarLink to="/statistics" icon={<PieChart size={18} />} text="Statistics" onClick={handleLinkClick} />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-xs uppercase text-foreground/50 font-medium px-3 py-1.5">
            Academic
          </div>
          <div className="space-y-1">
            <SidebarLink to="/teacher" icon={<GraduationCap size={18} />} text="Teacher Panel" onClick={handleLinkClick} />
            <SidebarLink to="/results" icon={<FileText size={18} />} text="Results" onClick={handleLinkClick} />
            <SidebarLink to="/attendance" icon={<Calendar size={18} />} text="Attendance" onClick={handleLinkClick} />
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-xs uppercase text-foreground/50 font-medium px-3 py-1.5">
            Administration
          </div>
          <div className="space-y-1">
            <SidebarLink to="/admin" icon={<Users size={18} />} text="User Management" onClick={handleLinkClick} />
            <SidebarLink to="/upload" icon={<Upload size={18} />} text="Data Upload" onClick={handleLinkClick} />
            <SidebarLink to="/certificates" icon={<Award size={18} />} text="Certificates" onClick={handleLinkClick} />
            <SidebarLink to="/result-generator" icon={<FileBarChart size={18} />} text="Result Generator" onClick={handleLinkClick} />
            <SidebarLink to="/activity-logs" icon={<ClipboardList size={18} />} text="Activity Logs" onClick={handleLinkClick} />
            <SidebarLink to="/settings" icon={<Settings size={18} />} text="Settings" onClick={handleLinkClick} />
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-medium">BL</span>
            </div>
            <div>
              <div className="text-sm font-medium">Billy Lachoumanan</div>
              <div className="text-xs text-foreground/60">Superuser</div>
            </div>
          </div>
          
          <button 
            onClick={toggleTheme} 
            className="w-8 h-8 flex items-center justify-center rounded-full glass hover:bg-white/10"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
