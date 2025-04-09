import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Key, LogIn, User, UserPlus } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useActivityLogger } from "../hooks/useActivityLogger";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const navigate = useNavigate();

  React.useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const formatEmail = (email: string) => {
    if (!email.includes('@')) return `${email}@adventistcollege.mu`;
    return email;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const formattedEmail = formatEmail(email);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.email.toLowerCase() === formattedEmail.toLowerCase() && 
        u.password === password
      );
      
      if (user) {
        // Only blachoumanan@adventistcollege.mu can be superuser
        const isSuperUser = formattedEmail.toLowerCase() === 'blachoumanan@adventistcollege.mu';
        
        const userObj = {
          email: user.email,
          name: user.name,
          role: user.role,
          isSuperUser // Only true for the correct email
        };
        
        // Log user activity
        logActivity("User Login", `${user.name} logged in`);
        
        localStorage.setItem('currentUser', JSON.stringify(userObj));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
      
      setLoading(false);
    }, 1000);
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
              loading ? 'opacity-80' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
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
