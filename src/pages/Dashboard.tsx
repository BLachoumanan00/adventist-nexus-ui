import React from "react";
import { BarChart3, Clock, LineChart, Bell, PieChart, Users, FileText, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useActivityLogger } from "../hooks/useActivityLogger";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "../hooks/useTheme";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logActivity } = useActivityLogger();
  const { theme } = useTheme();
  
  const handleQuickAccess = (path: string, action: string) => {
    logActivity("Quick Access", `Accessed ${action} from Dashboard`);
    navigate(path);
  };

  // Performance data for the chart
  const performanceData = [
    { month: 'Jan', mathematics: 65, science: 78, english: 82 },
    { month: 'Feb', mathematics: 72, science: 75, english: 79 },
    { month: 'Mar', mathematics: 78, science: 80, english: 84 },
    { month: 'Apr', mathematics: 74, science: 82, english: 87 },
    { month: 'May', mathematics: 80, science: 85, english: 89 },
    { month: 'Jun', mathematics: 85, science: 83, english: 91 },
  ];
  
  return (
    <div className="animate-fade-in w-full overflow-x-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="dashboard-card flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 mr-4">
            <Users className="text-theme-blue" />
          </div>
          <div>
            <h3 className="text-sm text-foreground/60">Total Students</h3>
            <p className="text-2xl font-bold">1,245</p>
          </div>
        </div>
        
        <div className="dashboard-card flex items-center">
          <div className="p-3 rounded-full bg-theme-soft-purple/50 mr-4">
            <LineChart className="text-theme-purple" />
          </div>
          <div>
            <h3 className="text-sm text-foreground/60">Average Score</h3>
            <p className="text-2xl font-bold">76.5%</p>
          </div>
        </div>
        
        <div className="dashboard-card flex items-center">
          <div className="p-3 rounded-full bg-theme-soft-green/50 mr-4">
            <Clock className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm text-foreground/60">Upcoming</h3>
            <p className="text-2xl font-bold">Term End</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="glass-card lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold">Performance Overview</h2>
            <select className="glass border-none rounded-lg px-3 py-2 sm:py-1.5 text-sm w-full sm:w-auto min-h-[44px] sm:min-h-[36px] touch-manipulation">
              <option>This Term</option>
              <option>Last Term</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-48 sm:h-64 w-full rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"} />
                <YAxis stroke={theme === 'dark' ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.8)', 
                    color: theme === 'dark' ? '#fff' : '#000',
                    borderRadius: '8px', 
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar dataKey="mathematics" name="Mathematics" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="science" name="Science" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="english" name="English" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <div className="p-2 rounded-full bg-theme-soft-yellow/50">
                  <Bell size={16} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Staff Meeting</h3>
                  <p className="text-xs text-foreground/60">Tomorrow at 10:00 AM</p>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="w-full mt-4 px-4 py-2 text-sm text-center text-primary hover:underline"
            onClick={() => {
              navigate('/notifications');
              logActivity("Viewed Notifications", "Accessed from Dashboard");
            }}
          >
            View All Notifications
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6">
        <div className="glass-card">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Subject Distribution</h2>
          <div className="h-40 sm:h-48 flex items-center justify-center">
            <PieChart size={36} className="text-theme-purple/40" />
          </div>
        </div>
        
        <div className="glass-card">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activities</h2>
          <ul className="space-y-2 sm:space-y-3">
            {['Grade sheets updated', 'New student registered', 'Report generated'].map((activity, i) => (
              <li key={i} className="text-xs sm:text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-blue flex-shrink-0"></span>
                <span className="truncate">{activity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-card sm:col-span-2 lg:col-span-2">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {[
              { label: 'Add Student', icon: Users, path: '/admin', action: 'Student Management' },
              { label: 'Enter Marks', icon: LineChart, path: '/teacher', action: 'Teacher Panel' },
              { label: 'Generate Report', icon: FileText, path: '/results', action: 'Results' },
              { label: 'Send Notice', icon: Bell, path: '/notifications', action: 'Notifications' }
            ].map((item, i) => (
              <button 
                key={i} 
                className="p-3 sm:p-4 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 active:bg-white/70 dark:active:bg-white/15 flex flex-col items-center justify-center gap-2 transition-all touch-manipulation min-h-[80px] sm:min-h-[100px]"
                onClick={() => handleQuickAccess(item.path, item.action)}
              >
                <item.icon size={20} className="text-theme-purple flex-shrink-0" />
                <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
