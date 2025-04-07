
import React, { useState, useEffect } from 'react';
import { Activity, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { UserActivity } from '../hooks/useActivityLogger';

const UserActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<UserActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string | null>(null);
  
  useEffect(() => {
    // Load activities from localStorage
    const storedActivities = localStorage.getItem('userActivities')
      ? JSON.parse(localStorage.getItem('userActivities')!)
      : [];
    setActivities(storedActivities);
    setFilteredActivities(storedActivities);
  }, []);
  
  // Extract unique users and actions for filters
  const uniqueUsers = Array.from(new Set(activities.map(a => a.userName)));
  const uniqueActions = Array.from(new Set(activities.map(a => a.action)));
  
  // Apply filters when search term or filters change
  useEffect(() => {
    let result = activities;
    
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(activity =>
        activity.userName.toLowerCase().includes(lowerCaseSearch) ||
        activity.action.toLowerCase().includes(lowerCaseSearch) ||
        (activity.details && activity.details.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    if (filterUser) {
      result = result.filter(activity => activity.userName === filterUser);
    }
    
    if (filterAction) {
      result = result.filter(activity => activity.action === filterAction);
    }
    
    setFilteredActivities(result);
  }, [searchTerm, filterUser, filterAction, activities]);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
    } catch (error) {
      return timestamp;
    }
  };
  
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Activity size={16} className="text-theme-purple" />
          <span>User Activity Log</span>
        </h3>
        <div className="text-xs text-foreground/60">
          {filteredActivities.length} activities shown
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg glass"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={16} />
        </div>
        
        <select
          value={filterUser || ''}
          onChange={(e) => setFilterUser(e.target.value || null)}
          className="glass px-4 py-2 rounded-lg"
        >
          <option value="">All Users</option>
          {uniqueUsers.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
        
        <select
          value={filterAction || ''}
          onChange={(e) => setFilterAction(e.target.value || null)}
          className="glass px-4 py-2 rounded-lg"
        >
          <option value="">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Timestamp</th>
              <th className="pb-2 text-left font-medium text-foreground/70 text-sm">User</th>
              <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Action</th>
              <th className="pb-2 text-left font-medium text-foreground/70 text-sm">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 text-sm text-foreground/80">{formatTimestamp(activity.timestamp)}</td>
                  <td className="py-2">{activity.userName}</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-sm">
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-2 text-sm text-foreground/70">{activity.details || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-foreground/50">
                  No activity logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserActivityLog;
