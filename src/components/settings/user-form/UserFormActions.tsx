import { Button } from "@/components/ui/button";

interface UserFormActionsProps {
  onCancel: () => void;
  loading: boolean;
}

export const UserFormActions = ({ onCancel, loading }: UserFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </div>
  );
};