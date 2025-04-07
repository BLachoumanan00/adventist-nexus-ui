
import { useCallback } from 'react';

export interface UserActivity {
  userId: string;
  userName: string;
  action: string;
  details?: string;
  timestamp: string;
}

export const useActivityLogger = () => {
  const logActivity = useCallback((action: string, details?: string) => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    
    if (!user) return; // Don't log if no user is logged in
    
    const activity: UserActivity = {
      userId: user.email,
      userName: user.name,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    
    // Get existing activities from localStorage
    const existingActivities = localStorage.getItem('userActivities') 
      ? JSON.parse(localStorage.getItem('userActivities')!) 
      : [];
    
    // Add new activity to beginning of the array
    const updatedActivities = [activity, ...existingActivities];
    
    // Limit to 1000 most recent activities
    const limitedActivities = updatedActivities.slice(0, 1000);
    
    // Save back to localStorage
    localStorage.setItem('userActivities', JSON.stringify(limitedActivities));
    
    // Also log to console for development
    console.log(`Activity: ${user.name} (${user.email}) - ${action}${details ? ` - ${details}` : ''}`);
  }, []);

  return { logActivity };
};
