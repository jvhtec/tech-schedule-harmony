import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: "management" | "logistics" | "technician";
}

interface UserManagementCardProps {
  users: User[] | undefined;
  isLoading: boolean;
  onAddUser: () => void;
  onEditUser: (user: User) => void;
}

export const UserManagementCard = ({ users, isLoading, onAddUser, onEditUser }: UserManagementCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Button onClick={onAddUser}>
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
                  onClick={() => onEditUser(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};