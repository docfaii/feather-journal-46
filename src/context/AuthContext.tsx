import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, migrateGuestData?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Check if user is already logged in on mount or using guest mode
  useEffect(() => {
    const checkUserSession = () => {
      // Check if guest mode is enabled
      const guestMode = localStorage.getItem("guestMode");
      if (guestMode === "true") {
        setIsGuestMode(true);
        setLoading(false);
        return;
      }

      // In a real app, this would check a token in localStorage or cookies
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  // Update user profile
  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Mock login function - replace with real auth in production
  const login = async (email: string, password: string, migrateGuestData = false) => {
    setLoading(true);
    try {
      // This simulates an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // If we're migrating guest data, we don't clear it yet
      if (!migrateGuestData) {
        // In a real app, this would be where you'd clear local data
        // For now, we'll just simulate this behavior
        console.log("Clearing guest data without migration");
      } else {
        console.log("Migrating guest data to account");
        // In a real app, here we would:
        // 1. Get all entries from localStorage
        // 2. Send those entries to the server to be associated with the user's account
        // 3. Then clear the localStorage entries after confirmation
        
        // For this demo, we'll keep the entries in localStorage
        // In a real app with a backend, they would be uploaded to the server
      }
      
      // Ensure guest mode is disabled when logging in
      localStorage.removeItem("guestMode");
      setIsGuestMode(false);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock signup function - replace with real auth in production
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // This simulates an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user creation
      const userData: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        name,
        email
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      // Ensure guest mode is disabled when signing up
      localStorage.removeItem("guestMode");
      setIsGuestMode(false);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock password reset function
  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    try {
      // This simulates an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Password reset email sent to: ${email}`);
      // In a real app, this would trigger a password reset email
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setIsGuestMode(false);
    localStorage.removeItem("guestMode");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isGuestMode,
        sendPasswordResetEmail,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
