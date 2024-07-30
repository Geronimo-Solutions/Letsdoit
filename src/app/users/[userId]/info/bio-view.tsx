"use client";

import { extensions } from "@/app/dashboard/projects/[projectId]/info/edit-project-info-form";
import { EditorProvider } from "@tiptap/react";

export default function BioView({ bio }: { bio: string }) {
  return (
    <div className="no-scroll">
      <EditorProvider
        extensions={extensions}
        content={bio}
        editable={false}
      ></EditorProvider>
    </div>
  );
}
