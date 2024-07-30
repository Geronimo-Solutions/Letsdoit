"use client";

import { leaveProjectAction } from "@/app/dashboard/projects/[projectId]/actions";
import { LoaderButton } from "@/components/loader-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { DoorOpen } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useServerAction } from "zsa-react";

export function LeaveProjectButton() {
  const { toast } = useToast();
  const { projectId } = useParams<{ projectId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const { execute, status } = useServerAction(leaveProjectAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "You left this project.",
      });
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className={btnStyles}>
          <DoorOpen className={btnIconStyles} /> Leave Project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this project? If it was a private project
            an admin will need to reinvite you.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            variant={"destructive"}
            isLoading={status === "pending"}
            onClick={() => {
              execute(parseInt(projectId));
            }}
          >
            Yes, leave project
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
