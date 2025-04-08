
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Key, LogIn, User, UserPlus } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/use-toast";

// Helper function to capitalize first letter after periods
const capitalizeAfterPeriod = (text: string) => {
  return text.replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Format email if domain is missing
    const formattedEmail = !email.includes('@') 
      ? `${email}@adventistcollege.mu` 
      : email;
    
    // Get users from localStorage or create empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching credentials
    const user = users.find((u: any) => 
      u.email.toLowerCase() === formattedEmail.toLowerCase() && 
      u.password === password
    );
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (user) {
        // Special case for the specific admin account
        const isSuperUser = formattedEmail.toLowerCase() === 'blachoumanan@adventistcollege.mu';
        
        const userObj = {
          email: user.email,
          name: user.name,
          role: user.role,
          isSuperUser // Set this directly from the email check
        };
        
        // Log user activity
        logUserActivity(userObj);
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(userObj));
        
        toast({
          title: "Login Successful",
          description: capitalizeAfterPeriod(`welcome back, ${user.name}!`),
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: capitalizeAfterPeriod("invalid email or password."),
          variant: "destructive",
        });
      }
    }, 1000);
  };
  
  // Log user login activity
  const logUserActivity = (user: any) => {
    const activity = {
      userId: user.email,
      userName: user.name,
      action: "Logged In",
      details: `User logged in with role: ${user.isSuperUser ? 'Superuser' : user.role}`,
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
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${
      theme === 'dark' 
        ? 'from-gray-900 to-blue-950' 
        : 'from-blue-50 to-purple-50'
    } p-4`}>
      <div className="glass-card w-full max-w-md py-8 px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Adventist College Mauritius</h1>
          <p className="text-foreground/70">School Management System</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <input 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@adventistcollege.mu"
                className="glass w-full py-3 px-4 pl-11 rounded-xl border-none focus:ring-2 ring-primary/30 outline-none"
                required
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
            </div>
            <p className="text-xs text-foreground/50">
              Domain @adventistcollege.mu will be added if not specified
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="glass w-full py-3 px-4 pl-11 pr-11 rounded-xl border-none focus:ring-2 ring-primary/30 outline-none"
                required
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`btn-primary w-full py-3 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-80' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-foreground/70">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
