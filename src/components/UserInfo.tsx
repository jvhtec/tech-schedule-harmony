import { useAuth } from "@/components/AuthProvider";

export const UserInfo = () => {
  const { session, userRole } = useAuth();

  if (!session) return null;

  return (
    <div className="text-sm text-muted-foreground">
      Logged in as: <span className="font-medium">{session.user.email}</span>
      {userRole && (
        <span className="ml-2">
          ({userRole})
        </span>
      )}
    </div>
  );
};