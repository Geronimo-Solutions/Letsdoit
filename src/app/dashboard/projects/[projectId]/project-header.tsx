import { JoinProjectButton } from "@/app/dashboard/projects/[projectId]/join-project-button";
import { LeaveProjectButton } from "@/app/dashboard/projects/[projectId]/leave-project-button";
import { getProjectImageUrl } from "@/app/dashboard/projects/[projectId]/settings/util";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { headerStyles, pageTitleStyles } from "@/styles/common";
import { btnIconStyles } from "@/styles/icons";
import { getUpcomingEventsUseCase } from "@/use-cases/events";
import { getMemberCountUseCase } from "@/use-cases/projects";
import {
  isProjectOwnerUseCase,
  isUserMemberOfProjectUseCase,
} from "@/use-cases/membership";
import { CalendarIcon, LoaderIcon, LockIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

async function MembershipButtons({ project }: { project: Pick<Project, "id"> }) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [isProjectOwner, isInProject] = await Promise.all([
    isProjectOwnerUseCase(user, project.id),
    isUserMemberOfProjectUseCase(user, project.id),
  ]);

  return (
    <div className="flex gap-2">
      {!isProjectOwner && (
        <>{isInProject ? <LeaveProjectButton /> : <JoinProjectButton />}</>
      )}
    </div>
  );
}

export async function ProjectHeader({
  project,
}: {
  project: Pick<Project, "name" | "id" | "isPublic" | "bannerId">;
}) {
  const user = await getCurrentUser();
  const numberOfMembers = await getMemberCountUseCase(user, project.id);
  const upcomingEvents = await getUpcomingEventsUseCase(user, project.id);

  return (
    <div className={cn(headerStyles, "py-8")}>
      <div className="container mx-auto">
        <div className="flex justify-between">
          <div className="flex flex-col md:flex-row gap-8">
            <Image
              src={getProjectImageUrl(project)}
              width={40}
              height={40}
              alt="image of the project"
              className="rounded-lg object-cover h-[40px]"
            />

            <div className="space-y-4">
              <h1 className={pageTitleStyles}>{project.name} </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">
                    {numberOfMembers} members
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">
                    {upcomingEvents.length} upcoming events
                  </span>
                </div>

                {!project.isPublic && (
                  <Badge
                    className="p-2 flex gap-2 w-fit px-4 items-center"
                    variant={"outline"}
                  >
                    <LockIcon className={btnIconStyles} /> Private Project
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <Suspense fallback={<LoaderIcon className="animate-spin" />}>
              <MembershipButtons project={project} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
