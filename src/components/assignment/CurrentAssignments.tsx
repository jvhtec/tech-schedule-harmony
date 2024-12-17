import { Assignment } from "@/types/assignment";

interface CurrentAssignmentsProps {
  assignments?: Assignment[];
}

export const CurrentAssignments = ({ assignments }: CurrentAssignmentsProps) => {
  if (!assignments?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Current Assignments:</h3>
      <div className="space-y-2">
        {assignments.map((assignment) => {
          const role = assignment.sound_role || assignment.lights_role || assignment.video_role;
          return (
            <div
              key={assignment.id}
              className="p-2 bg-secondary rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {(assignment.technicians as { name: string }).name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {role}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};