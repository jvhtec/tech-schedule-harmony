import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import CreateUserDialog from "@/components/settings/CreateUserDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  const [createUserOpen, setCreateUserOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          role,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      return profiles;
    },
    enabled: userRole === 'management'
  });

  if (userRole !== 'management') {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-red-600">
          Access Denied: Management privileges required
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button onClick={() => setCreateUserOpen(true)}>
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create and manage users with management or logistics privileges.
            </p>
            
            {isLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.id}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Role: {user.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateUserDialog 
        open={createUserOpen} 
        onOpenChange={setCreateUserOpen}
      />
    </div>
  );
};

export default Settings;