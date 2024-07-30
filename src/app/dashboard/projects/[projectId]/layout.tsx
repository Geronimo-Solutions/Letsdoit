import { ProjectHeader } from "@/app/dashboard/projects/[projectId]/project-header";
import { TabsSection } from "@/app/dashboard/projects/[projectId]/tabs-section";
import { NotFoundError, PrivateProjectAccessError } from "@/app/util";
import { getCurrentUser } from "@/lib/session";
import { pageWrapperStyles } from "@/styles/common";
import { getPublicProjectInfoByIdUseCase } from "@/use-cases/projects";
import {
  isProjectOwnerUseCase,
  isProjectVisibleToUserUseCase,
} from "@/use-cases/membership";
import { ReactNode } from "react";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { projectId: string };
}) {
  const user = await getCurrentUser();

  const project = await getPublicProjectInfoByIdUseCase(parseInt(params.projectId));

  if (!project) {
    throw new NotFoundError("Project not found.");
  }

  const isProjectVisibleToUser = await isProjectVisibleToUserUseCase(
    user,
    project.id
  );

  const isProjectOwner = user ? await isProjectOwnerUseCase(user, project.id) : false;

  if (!isProjectVisibleToUser) {
    throw new PrivateProjectAccessError();
  }

  return (
    <div>
      <ProjectHeader project={project} />

      <TabsSection projectId={params.projectId} showSettings={isProjectOwner} />

      <div className={pageWrapperStyles}>{children}</div>
    </div>
  );
}
