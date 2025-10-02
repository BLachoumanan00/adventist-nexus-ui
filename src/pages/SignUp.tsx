import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAuthContext } from "../components/AuthProvider";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, loading, isAuthenticated } = useAuthContext();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const formatEmail = (email: string) => {
    if (!email.includes('@')) return `${email}@adventistcollege.mu`;
    return email;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
      });
      return;
    }

    const formattedEmail = formatEmail(email);
    const { error } = await signUp(formattedEmail, password, { 
      full_name: fullName,
      role: 'student'
    });
    
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* iOS-style Header */}
      <div className="safe-top pt-12 pb-8 px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-[22px] mb-6 shadow-lg">
          <GraduationCap className="text-primary-foreground" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Create Account</h1>
        <p className="text-muted-foreground text-lg">Join Adventist College</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-6 overflow-y-auto">
        <form onSubmit={handleSignUp} className="space-y-4 max-w-md mx-auto pb-4">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground px-1">Full Name</label>
            <input 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="ios-input"
              required
              disabled={loading}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground px-1">Email</label>
            <input 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@adventistcollege.mu"
              className="ios-input"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground px-1">
              Domain @adventistcollege.mu will be added automatically
            </p>
          </div>
          
          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground px-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="ios-input pr-12"
                required
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground px-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="ios-input pr-12"
                required
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Action Area - iOS style */}
      <div className="safe-bottom px-6 pb-8 space-y-4 max-w-md mx-auto w-full border-t border-border pt-6">
        <button 
          onClick={handleSignUp}
          className={`ios-button w-full ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
        
        <div className="text-center pt-4">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:opacity-80 transition-opacity">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
