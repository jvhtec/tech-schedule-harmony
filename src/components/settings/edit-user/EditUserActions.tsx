import { Button } from "@/components/ui/button";

interface EditUserActionsProps {
  onDelete: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const EditUserActions = ({ onDelete, onCancel, loading }: EditUserActionsProps) => {
  return (
    <div className="flex justify-between gap-4">
      <Button type="button" variant="destructive" onClick={onDelete}>
        Delete User
      </Button>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};