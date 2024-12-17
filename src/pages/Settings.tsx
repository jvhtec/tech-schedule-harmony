import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import CreateUserDialog from "@/components/settings/CreateUserDialog";
import EditUserDialog from "@/components/settings/EditUserDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { UserInfo } from "@/components/UserInfo";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
    role: "management" | "logistics";
  } | null>(null);

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          role,
          name,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      console.log("Fetched users:", profiles);
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

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-red-600">
            Error loading settings
          </h1>
          <UserInfo />
        </div>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
        </div>
        <UserInfo />
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
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Role: {user.role}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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
      
      <EditUserDialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
      />
    </div>
  );
};

export default Settings;