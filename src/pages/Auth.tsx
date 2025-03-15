import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { ChevronLeft, LogIn, UserPlus, Lock, Mail, Info, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getAllEntries } from "@/lib/journalStorage";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [showDataLossWarning, setShowDataLossWarning] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const navigate = useNavigate();
  const { login, signup, sendPasswordResetEmail, isGuestMode } = useAuth();

  // Check if there's guest data on mount
  useEffect(() => {
    const entries = getAllEntries();
    setHasLocalData(entries.length > 0 && isGuestMode);
  }, [isGuestMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isForgotPassword) {
        await sendPasswordResetEmail(email);
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions.",
        });
        setIsForgotPassword(false);
      } else if (isLogin) {
        // When logging in, check if there's guest data to migrate
        if (hasLocalData) {
          setShowMigrationDialog(true);
          setIsSubmitting(false);
          return;
        }
        
        await performLogin();
      } else {
        await signup(name, email, password);
        toast({
          title: "Account created successfully",
          description: "Welcome to Lil Baby Kicks journal!",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      if (!showMigrationDialog) {
        setIsSubmitting(false);
      }
    }
  };

  const performLogin = async (migrateData = false) => {
    try {
      await login(email, password, migrateData);
      toast({
        title: "Logged in successfully",
        description: "Welcome back to Lil Baby Kicks journal!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login error",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMigrationConfirm = () => {
    setShowMigrationDialog(false);
    performLogin(true);
  };

  const handleMigrationDecline = () => {
    setShowMigrationDialog(false);
    setShowDataLossWarning(true);
  };

  const handleDataLossConfirm = () => {
    setShowDataLossWarning(false);
    performLogin(false);
  };

  const handleSkipLogin = () => {
    // Show warning dialog instead of immediately using guest mode
    setShowGuestWarning(true);
  };
  
  const confirmGuestMode = () => {
    // Use guest mode - set localStorage flag
    localStorage.setItem("guestMode", "true");
    toast({
      title: "Using guest mode",
      description: "Your data will be stored locally on this device only.",
    });
    setShowGuestWarning(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col">
      <header className="flex justify-between items-center mb-12 animate-slide-down">
        <Link
          to="/landing"
          className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <Logo />
        <div className="w-10 h-10 opacity-0">
          {/* Empty div for alignment */}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        <div className="w-full space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isForgotPassword 
                ? "Reset Your Password" 
                : isLogin 
                  ? "Welcome Back" 
                  : "Create Your Journal"
              }
            </h1>
            <p className="text-sm text-muted-foreground">
              {isForgotPassword
                ? "Enter your email to receive reset instructions"
                : isLogin
                  ? "Sign in to continue your journaling journey"
                  : "Sign up to start capturing your precious moments"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
                    required={!isLogin && !isForgotPassword}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
                  required
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 pl-10 pr-4 rounded-xl glass-morphism outline-none focus:ring-2 focus:ring-foreground transition-all"
                    required={!isForgotPassword}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-medium transition-all duration-300",
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              )}
            >
              {isSubmitting ? (
                <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
              ) : isForgotPassword ? (
                "Send Reset Instructions"
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="text-center flex items-center justify-center space-x-2 text-sm">
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setIsLogin(!isLogin);
              }}
              className="underline text-muted-foreground hover:text-foreground transition-colors"
              disabled={isSubmitting}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
            
            <span className="text-muted-foreground">|</span>
            
            {isLogin && (
              <button
                onClick={() => {
                  setIsForgotPassword(true);
                  setIsLogin(true);
                }}
                className="underline text-muted-foreground hover:text-foreground transition-colors"
                disabled={isSubmitting}
              >
                Forgot password?
              </button>
            )}
          </div>

          <div className="text-center pt-2">
            <button 
              onClick={handleSkipLogin}
              className="px-4 py-2 text-sm rounded-xl glass-morphism hover:bg-black/5 transition-all"
            >
              Skip login & use guest mode
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              Guest mode stores data locally on your device for privacy
            </p>
          </div>
        </div>
      </main>
      
      {/* Guest Mode Warning Dialog */}
      <Dialog open={showGuestWarning} onOpenChange={setShowGuestWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-500" />
              Guest Mode Information
            </DialogTitle>
            <DialogDescription>
              Please read this important information before proceeding with guest mode.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <h3 className="font-medium">Benefits of Creating an Account:</h3>
              <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                <li>Access your journal from any device</li>
                <li>Never lose your entries if your device is lost or damaged</li>
                <li>Share your journey securely with loved ones</li>
                <li>Get personalized recommendations and insights</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Guest Mode Limitations:</h3>
              <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                <li>Data is stored <b>only on this device</b></li>
                <li>Entries will be <b>lost if browser data is cleared</b></li>
                <li>Cannot access your journal from other devices</li>
                <li>Limited sharing capabilities</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter className="flex sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowGuestWarning(false)}
              className="sm:flex-1"
            >
              Go Back & Sign Up
            </Button>
            <Button 
              onClick={confirmGuestMode}
              className="sm:flex-1"
            >
              Continue as Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Migration Dialog */}
      <Dialog open={showMigrationDialog} onOpenChange={setShowMigrationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Migrate Guest Data
            </DialogTitle>
            <DialogDescription>
              We've detected existing journal entries on this device.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <p>Would you like to migrate your local journal entries to your account?</p>
            <p className="text-sm text-muted-foreground">
              This will preserve all your existing entries, bookmarks, and settings.
            </p>
          </div>
          
          <DialogFooter className="flex sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={handleMigrationDecline}
              className="sm:flex-1"
            >
              No, Start Fresh
            </Button>
            <Button 
              onClick={handleMigrationConfirm}
              className="sm:flex-1"
            >
              Yes, Migrate My Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Loss Warning Dialog */}
      <Dialog open={showDataLossWarning} onOpenChange={setShowDataLossWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Warning: Data Loss
            </DialogTitle>
            <DialogDescription>
              You're about to lose all your local journal entries.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <p className="font-medium">This action cannot be undone.</p>
            <p className="text-sm text-muted-foreground">
              All entries, bookmarks, and settings stored on this device will be permanently lost.
            </p>
          </div>
          
          <DialogFooter className="flex sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDataLossWarning(false)}
              className="sm:flex-1"
            >
              Go Back
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDataLossConfirm}
              className="sm:flex-1"
            >
              Continue Without Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
