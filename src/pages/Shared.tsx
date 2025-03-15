import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import AdCard from "@/components/AdCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featureFlags } from "@/config/features";
import { cn } from "@/lib/utils";
import { Plus, Users, Mail, Link as LinkIcon, UserPlus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import GroupFeed from "@/components/GroupFeed";
import { 
  getAllGroups, 
  createGroup, 
  deleteGroup, 
  addMemberToGroup, 
  InnerCircleGroup 
} from "@/lib/journalStorage";

// Inner Circle (formerly Shared) component
const InnerCircle = () => {
  const [groups, setGroups] = useState<InnerCircleGroup[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<InnerCircleGroup | null>(null);
  const { isAuthenticated, isGuestMode } = useAuth();
  const { toast } = useToast();

  // Load groups from storage
  useEffect(() => {
    const storedGroups = getAllGroups();
    setGroups(storedGroups);
  }, []);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    if (groups.length >= 4) {
      toast({
        title: "Maximum groups reached",
        description: "You can create up to 4 private groups",
        variant: "destructive",
      });
      return;
    }

    // Create new group in storage
    const newGroup = createGroup(newGroupName);

    // Update UI
    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setIsCreatingGroup(false);

    toast({
      title: "Group created",
      description: `Your "${newGroupName}" group has been created`,
    });
  };

  const handleDeleteGroup = (id: string) => {
    // Delete group from storage
    deleteGroup(id);
    
    // Update UI
    setGroups(groups.filter(group => group.id !== id));
    
    toast({
      title: "Group deleted",
      description: "Your group has been deleted",
    });
  };

  const handleInviteMember = (groupId: string, email: string) => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    // Add member to group in storage
    const success = addMemberToGroup(groupId, email);
    
    if (success) {
      // Update UI
      const updatedGroups = groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            memberCount: (group.memberCount || 0) + 1
          };
        }
        return group;
      });
      
      setGroups(updatedGroups);
      
      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${email}`,
      });
      
      return true;
    } else {
      toast({
        title: "Error",
        description: "This email is already a member of the group",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const renderGroupCreation = () => {
    if (!isCreatingGroup) {
      return (
        <Button 
          onClick={() => setIsCreatingGroup(true)} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Group
        </Button>
      );
    }

    return (
      <div className="space-y-3">
        <Input
          placeholder="Group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="w-full"
        />
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateGroup} 
            className="flex-1"
          >
            Create
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCreatingGroup(false);
              setNewGroupName("");
            }}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  if (featureFlags.sharedEnabled && (isAuthenticated || isGuestMode)) {
    if (selectedGroup) {
      return (
        <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: "#e0f2f1" }}>
          <Header />
          <main className="mt-6">
            <GroupFeed 
              group={selectedGroup} 
              onBack={() => setSelectedGroup(null)} 
            />
            
            <div className="mt-8">
              <AdCard variant="medium" />
            </div>
          </main>
          <BottomBar />
        </div>
      );
    }
    
    return (
      <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: "#e0f2f1" }}>
        <Header />
        <main>
          <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Inner Circle</h1>
          
          <div className="space-y-1 mb-8 animate-fade-in">
            <h2 className="text-sm text-muted-foreground font-medium">YOUR PRIVATE GROUPS</h2>
            <div className="h-px bg-border w-full"></div>
          </div>

          <div className="space-y-4">
            {groups.map(group => (
              <Card key={group.id} className="animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {group.name}
                    <button 
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Users className="w-3 h-3 mr-1" /> 
                    {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center justify-center gap-1"
                      onClick={() => {
                        const email = prompt("Enter email address to invite:");
                        if (email) {
                          handleInviteMember(group.id, email);
                        }
                      }}
                    >
                      <Mail className="w-3 h-3" />
                      Invite
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 flex items-center justify-center gap-1"
                      onClick={() => {
                        const link = `https://app.example.com/join-group/${group.id}/${Date.now()}`;
                        navigator.clipboard.writeText(link);
                        toast({
                          title: "Link copied",
                          description: "Group invite link copied to clipboard"
                        });
                      }}
                    >
                      <LinkIcon className="w-3 h-3" />
                      Share Link
                    </Button>
                  </div>
                  <Button 
                    className="w-full mt-3"
                    onClick={() => setSelectedGroup(group)}
                  >
                    View Group
                  </Button>
                </CardContent>
              </Card>
            ))}

            {groups.length < 4 && (
              <Card className="animate-fade-in shadow-md">
                <CardContent className="p-4">
                  {renderGroupCreation()}
                </CardContent>
              </Card>
            )}

            {/* Show ad after groups list */}
            <AdCard variant="medium" className="mt-4" />
          </div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4" style={{ backgroundColor: "#e0f2f1" }}>
      <Header />

      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Inner Circle</h1>

        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">COMING SOON</h2>
          <div className="h-px bg-border w-full"></div>
        </div>

        <div className="rounded-xl neo-shadow p-8 text-center animate-fade-in">
          <h3 className="text-xl font-medium mb-4">Private Groups</h3>
          <p className="text-muted-foreground mb-6">
            This feature is coming soon! You'll be able to share selected journal entries with friends and family.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Group Management</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Create private groups</li>
                <li>• Invite friends and family</li>
                <li>• Manage member permissions</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Sharing Options</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Share specific entries</li>
                <li>• Control privacy settings</li>
                <li>• Receive comments and reactions</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <AdCard variant="medium" />
        </div>
      </main>

      <BottomBar />
    </div>
  );
};

export default InnerCircle;
