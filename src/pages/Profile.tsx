import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Camera, User, Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BottomBar from "@/components/BottomBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatar_url || null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      name,
      avatar_url: profileImage || undefined
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved.",
    });
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    // This is a mock function for password reset
    // In a real app, this would call an API endpoint
    
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Save the profile image immediately
      updateProfile({
        avatar_url: imageUrl
      });
      
      toast({
        title: "Profile image updated",
        description: "Your profile image has been saved.",
      });
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4">
      <header className="py-4 flex items-center justify-between mb-6 animate-slide-down">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full neo-shadow hover:neo-inset transition-all duration-300 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <h1 className="text-xl font-medium">Your Profile</h1>
        
        <div className="w-10 h-10">
          {/* Placeholder for layout balance */}
        </div>
      </header>
      
      <main className="animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            
            <label htmlFor="profile-image" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer">
              <Camera className="w-4 h-4 text-white" />
              <input 
                type="file" 
                id="profile-image" 
                accept="image/*" 
                className="hidden"
                onChange={handleImageUpload} 
              />
            </label>
          </div>
          
          <h2 className="text-2xl font-bold">{user?.name || "Your Name"}</h2>
          <p className="text-muted-foreground">{user?.email || "your.email@example.com"}</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-4 neo-shadow p-6 rounded-xl">
            <h3 className="text-lg font-medium flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </h3>
            
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Display Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="space-y-4 neo-shadow p-6 rounded-xl">
            <h3 className="text-lg font-medium flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Change Password
            </h3>
            
            <form onSubmit={handlePasswordReset}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Update Password
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Profile;
