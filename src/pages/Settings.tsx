import React, { useState } from "react";
import { Bell, Check, FileSpreadsheet, Shield, User, UserCog, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/use-toast";
import SendNotification from "../components/SendNotification";

// Mock settings structure
interface AppSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  emailNotificationsEnabled: boolean;
  defaultTermStartDate: string;
  defaultTermEndDate: string;
  passMark: number;
  distinctionMark: number;
}

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    notificationsEnabled: true,
    soundEnabled: true,
    emailNotificationsEnabled: false,
    defaultTermStartDate: "2025-01-01",
    defaultTermEndDate: "2025-04-30",
    passMark: 35,
    distinctionMark: 75
  });

  // Load user from localStorage
  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
    }
  }, []);

  const handleToggleSetting = (key: keyof AppSettings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings({
        ...settings,
        [key]: !settings[key]
      });
      
      toast({
        title: "Setting Updated",
        description: `${key} is now ${!settings[key] ? 'enabled' : 'disabled'}.`,
      });
    }
  };

  const handleInputChange = (key: keyof AppSettings, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const isAdmin = user?.role === 'Admin' || user?.isSuperUser;

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon size={24} className="text-theme-purple" />
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appearance Settings */}
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-4">Appearance</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-foreground/60">Choose your preferred theme</p>
                </div>
                <select 
                  value={theme}
                  onChange={(e) => {
                    if ((e.target.value === 'dark' && theme === 'light') || 
                        (e.target.value === 'light' && theme === 'dark')) {
                      toggleTheme();
                    }
                  }}
                  className="glass px-3 py-1.5 rounded-lg border-none text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Notifications Settings */}
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-4">Notifications</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div>
                  <p className="font-medium">In-App Notifications</p>
                  <p className="text-sm text-foreground/60">Receive notifications within the app</p>
                </div>
                <button 
                  onClick={() => handleToggleSetting('notificationsEnabled')}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    settings.notificationsEnabled ? 'bg-primary' : 'bg-white/20'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.notificationsEnabled ? 'transform translate-x-5' : 'transform translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div>
                  <p className="font-medium">Sound Notifications</p>
                  <p className="text-sm text-foreground/60">Play sounds for notifications</p>
                </div>
                <button 
                  onClick={() => handleToggleSetting('soundEnabled')}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    settings.soundEnabled ? 'bg-primary' : 'bg-white/20'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.soundEnabled ? 'transform translate-x-5' : 'transform translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-foreground/60">Receive notifications via email</p>
                </div>
                <button 
                  onClick={() => handleToggleSetting('emailNotificationsEnabled')}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    settings.emailNotificationsEnabled ? 'bg-primary' : 'bg-white/20'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.emailNotificationsEnabled ? 'transform translate-x-5' : 'transform translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Academic Settings */}
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-4">Academic Settings</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-foreground/70">Default Term Start Date</label>
                <input
                  type="date"
                  value={settings.defaultTermStartDate}
                  onChange={(e) => handleInputChange('defaultTermStartDate', e.target.value)}
                  className="glass rounded-lg border-none px-4 py-2"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-foreground/70">Default Term End Date</label>
                <input
                  type="date"
                  value={settings.defaultTermEndDate}
                  onChange={(e) => handleInputChange('defaultTermEndDate', e.target.value)}
                  className="glass rounded-lg border-none px-4 py-2"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-foreground/70">Pass Mark</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.passMark}
                  onChange={(e) => handleInputChange('passMark', parseInt(e.target.value))}
                  className="glass rounded-lg border-none px-4 py-2"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-foreground/70">Distinction Mark</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.distinctionMark}
                  onChange={(e) => handleInputChange('distinctionMark', parseInt(e.target.value))}
                  className="glass rounded-lg border-none px-4 py-2"
                />
              </div>
            </div>
          </div>
          
          {/* Account Settings */}
          <div className="glass rounded-xl p-4">
            <h3 className="font-medium mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 glass rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-foreground/60">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user?.isSuperUser 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      : user?.role === 'Admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  }`}>
                    {user?.isSuperUser ? 'Superuser' : user?.role || 'User'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-foreground/70">Change Password</label>
                <button className="glass rounded-lg border-none px-4 py-2 text-left text-foreground/60 hover:text-foreground transition-colors">
                  Set New Password
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSettings}
            className="btn-primary flex items-center gap-2"
          >
            <Check size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
      
      {/* Admin Only Sections */}
      {isAdmin && (
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-theme-purple" />
            <h2 className="text-xl font-semibold">Admin Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <SendNotification />
            
            <div className="glass rounded-xl p-4">
              <h3 className="font-medium mb-4">CSV Templates</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Student Data Template</p>
                    <p className="text-sm text-foreground/60">CSV template for importing student data</p>
                  </div>
                  <button 
                    onClick={() => {
                      const headers = "ID,Name,Grade,Section,DateOfBirth,Gender,ParentName,ContactNumber\n";
                      const sampleData = "1,John Doe,8,A,2009-01-15,Male,Jane Doe,123-456-7890\n";
                      const csvContent = headers + sampleData;
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'student_template.csv');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      toast({
                        title: "Template Downloaded",
                        description: "Student data template has been downloaded.",
                      });
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Download Template</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Teacher Data Template</p>
                    <p className="text-sm text-foreground/60">CSV template for importing teacher data</p>
                  </div>
                  <button 
                    onClick={() => {
                      const headers = "ID,Name,Email,Department,JoinDate,Subjects\n";
                      const sampleData = "1,Jane Smith,janesmith@adventistcollege.mu,Science,2020-08-15,\"Biology, Chemistry\"\n";
                      const csvContent = headers + sampleData;
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'teacher_template.csv');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      toast({
                        title: "Template Downloaded",
                        description: "Teacher data template has been downloaded.",
                      });
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Download Template</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Marks Data Template</p>
                    <p className="text-sm text-foreground/60">CSV template for importing marks data</p>
                  </div>
                  <button 
                    onClick={() => {
                      const headers = "StudentID,StudentName,Subject,Term,AssessmentType,Mark,MaxMark,Remarks\n";
                      const sampleData = "1,John Doe,Mathematics,Term 1,Test,85,100,Excellent work\n";
                      const csvContent = headers + sampleData;
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', 'marks_template.csv');
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      toast({
                        title: "Template Downloaded",
                        description: "Marks data template has been downloaded.",
                      });
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Download Template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
