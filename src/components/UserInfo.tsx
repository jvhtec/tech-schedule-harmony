import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const UserInfo = () => {
  const { session, userRole, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!session) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-muted-foreground">
        Logged in as: <span className="font-medium">{session.user.email}</span>
        {userRole && (
          <span className="ml-2">
            ({userRole})
          </span>
        )}
      </div>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => navigate('/dashboard')}
        title="Dashboard"
      >
        <LayoutDashboard className="h-4 w-4" />
      </Button>
      {userRole === 'management' && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/settings')}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleLogout}
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};