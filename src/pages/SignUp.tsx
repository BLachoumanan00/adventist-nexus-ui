
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Key, UserPlus, User, Mail } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useToast } from "../hooks/use-toast";
import { useAuthContext } from "../components/AuthProvider";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();
  const { signUp, loading } = useAuthContext();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    // Format email if domain is missing
    const formattedEmail = !email.includes('@') 
      ? `${email}@adventistcollege.mu` 
      : email;
    
    const { error } = await signUp(formattedEmail, password, {
      full_name: name,
      role: 'teacher'
    });
    
    if (!error) {
      navigate('/login');
    }
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
          <p className="text-foreground/70">Create Your Account</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="glass w-full py-3 px-4 pl-11 rounded-xl border-none focus:ring-2 ring-primary/30 outline-none"
                required
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
            </div>
          </div>
          
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
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
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
                placeholder="Create a password"
                className="glass w-full py-3 px-4 pl-11 pr-11 rounded-xl border-none focus:ring-2 ring-primary/30 outline-none"
                required
                minLength={6}
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="glass w-full py-3 px-4 pl-11 pr-11 rounded-xl border-none focus:ring-2 ring-primary/30 outline-none"
                required
                minLength={6}
              />
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={20} />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={20} />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-foreground/70">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
