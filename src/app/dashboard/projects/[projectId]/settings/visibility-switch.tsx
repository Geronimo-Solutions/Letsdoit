"use client";

import { toggleProjectVisibilityAction } from "@/app/dashboard/projects/[projectId]/settings/actions";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Project } from "@/db/schema";
import { useServerAction } from "zsa-react";

export function ProjectVisibilitySwitch({ project }: { project: Project }) {
  const { toast } = useToast();

  const { execute } = useServerAction(toggleProjectVisibilityAction, {
    onSuccess() {
      toast({
        title: "Update successful",
        description: "Project visibility updated.",
      });
    },
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex items-center space-x-2">
      <Switch
        defaultChecked={project.isPublic}
        onCheckedChange={() => {
          execute(project.id);
        }}
        id="visibility"
      />
      <Label htmlFor="visibility">Is Project Public</Label>
    </div>
  );
}
