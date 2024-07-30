"use client";

import { joinProjectAction } from "@/app/dashboard/projects/[projectId]/actions";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/components/ui/use-toast";
import { btnIconStyles } from "@/styles/icons";
import { Handshake } from "lucide-react";
import { useParams } from "next/navigation";
import { useServerAction } from "zsa-react";

export function JoinProjectButton() {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const { execute, status } = useServerAction(joinProjectAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "You joined this project.",
      });
    },
  });

  return (
    <LoaderButton
      isLoading={status === "pending"}
      onClick={() => {
        execute(parseInt(projectId));
      }}
    >
      <Handshake className={btnIconStyles} /> Join Project
    </LoaderButton>
  );
}
