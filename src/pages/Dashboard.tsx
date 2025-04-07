
import React from "react";
import { BarChart3, Clock, LineChart, Bell, PieChart, Users } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Performance Overview</h2>
            <select className="glass border-none rounded-lg px-3 py-1.5 text-sm">
              <option>This Term</option>
              <option>Last Term</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-64 w-full bg-theme-soft-blue/30 rounded-lg flex items-center justify-center">
            <BarChart3 size={36} className="text-theme-blue/40" />
            <span className="ml-2 text-sm text-foreground/60">Performance Chart</span>
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
          
          <button className="w-full mt-4 px-4 py-2 text-sm text-center text-primary hover:underline">
            View All Notifications
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="glass-card">
          <h2 className="text-lg font-semibold mb-4">Subject Distribution</h2>
          <div className="h-48 flex items-center justify-center">
            <PieChart size={36} className="text-theme-purple/40" />
          </div>
        </div>
        
        <div className="glass-card">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-3">
            {['Grade sheets updated', 'New student registered', 'Report generated'].map((activity, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-blue"></span>
                {activity}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass-card md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Add Student', icon: Users },
              { label: 'Enter Marks', icon: LineChart },
              { label: 'Generate Report', icon: BarChart3 },
              { label: 'Send Notice', icon: Bell }
            ].map((item, i) => (
              <button key={i} className="p-4 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 flex flex-col items-center gap-2 transition-colors">
                <item.icon size={24} className="text-theme-purple" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
