"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { InteractiveOverlay } from "@/components/interactive-overlay";
import { useState } from "react";
import { CreateProjectForm } from "./create-project-form";

export function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <InteractiveOverlay
        title={"Create Project"}
        description={"Create a new project to start managing your events."}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateProjectForm />}
      />

      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Create Project
      </Button>
    </>
  );
}
