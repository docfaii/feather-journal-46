import React from "react";
import { Settings, User, Bookmark, Wallet, LogOut, Sparkle, LogIn } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { logout, user, isGuestMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isGuestMode) {
      // If in guest mode, navigate to login page instead of logging out
      navigate("/auth");
    } else {
      logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/landing");
    }
  };

  return (
    <header className={cn("py-4 px-5 mb-6 flex items-center justify-between animate-slide-down", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full glass-morphism hover:bg-white/10 transition-all duration-300"
            aria-label="User profile"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-5 h-5 text-foreground" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer">
              <div className="flex items-center space-x-2 w-full">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <span>{isGuestMode ? "Guest Mode" : (user?.name || "Your Profile")}</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/bookmarks" className="flex items-center cursor-pointer">
              <Bookmark className="mr-2 h-4 w-4" />
              <span>Bookmarks</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/wallet" className="flex items-center cursor-pointer">
              <Wallet className="mr-2 h-4 w-4" />
              <span>Wallet</span>
              <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout} 
            className={isGuestMode ? "" : "text-destructive focus:text-destructive"}
          >
            {isGuestMode ? (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log In</span>
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1 flex justify-center">
        <Logo />
      </div>

      <Link
        to="/insights"
        className="w-10 h-10 flex items-center justify-center rounded-full glass-morphism hover:bg-white/10 transition-all duration-300"
        aria-label="Insights"
      >
        <Sparkle className="w-5 h-5 text-foreground" />
      </Link>
    </header>
  );
};

export default Header;
