import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const UserInfo = () => {
  const { session, userRole } = useAuth();
  const { toast } = useToast();

  if (!session) return null;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
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
        onClick={handleLogout}
        title="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};