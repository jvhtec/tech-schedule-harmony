import { Button } from "@/components/ui/button";

interface SignUpFormActionsProps {
  loading: boolean;
  onBack: () => void;
}

export const SignUpFormActions = ({ loading, onBack }: SignUpFormActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
      <Button type="button" variant="outline" onClick={onBack} className="w-full">
        Back to Login
      </Button>
    </div>
  );
};