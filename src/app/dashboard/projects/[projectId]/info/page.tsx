import { EditProjectInfoForm } from "./edit-project-info-form";
import { getCurrentUser } from "@/lib/session";
import {
  getPublicProjectInfoByIdUseCase,
  isAdminOrOwnerOfProjectUseCase,
} from "@/use-cases/projects";
import { getProjectImageUrl } from "../settings/util";
import Image from "next/image";
import {
  DiscordIcon,
  GithubIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/icons";
import Link from "next/link";
import { socialIconStyles } from "@/styles/icons";
import { NotFoundError } from "@/app/util";
import { cardStyles, pageTitleStyles } from "@/styles/common";
import { cn } from "@/lib/utils";

export default async function InfoPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;

  const user = await getCurrentUser();

  const isAdminOrOwner = await isAdminOrOwnerOfProjectUseCase(
    user,
    parseInt(projectId)
  );

  const project = await getPublicProjectInfoByIdUseCase(parseInt(projectId));

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return (
    <div className="space-y-8">
      <h1 className={cn(pageTitleStyles, "flex justify-between items-center")}>
        <div>Info</div>
      </h1>

      <div className="flex gap-8">
        <div className="flex-grow">
          <EditProjectInfoForm
            isAdminOrOwner={isAdminOrOwner}
            projectId={project.id}
            info={project.info ?? ""}
          />
        </div>

        <div
          className={cn(cardStyles, "w-[300px] p-8 flex-shrink-0 space-y-8")}
        >
          <Image
            src={getProjectImageUrl(project)}
            width={300}
            height={200}
            alt="image of the project"
            className="rounded-lg object-cover w-full mb-8"
          />

          <div className="break-words">{project.description}</div>

          <div className="flex justify-center gap-6">
            {project.githubLink && (
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <GithubIcon className={socialIconStyles} />
              </Link>
            )}
            {project.youtubeLink && (
              <Link
                href={project.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <YoutubeIcon className={socialIconStyles} />
              </Link>
            )}
            {project.discordLink && (
              <Link
                href={project.discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <DiscordIcon className={socialIconStyles} />
              </Link>
            )}
            {project.xLink && (
              <Link
                href={project.xLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <XIcon className={socialIconStyles} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
