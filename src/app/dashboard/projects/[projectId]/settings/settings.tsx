import { BannerUploadForm } from "@/app/dashboard/projects/[projectId]/settings/banner-upload-form";
import { getProjectImageUrl } from "@/app/dashboard/projects/[projectId]/settings/util";
import { ProjectVisibilitySwitch } from "@/app/dashboard/projects/[projectId]/settings/visibility-switch";
import { assertAuthenticated } from "@/lib/session";
import { pageTitleStyles } from "@/styles/common";
import { getProjectByIdUseCase } from "@/use-cases/projects";
import Image from "next/image";
import { ProjectNameForm } from "./project-name-form";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { ProjectDescriptionForm } from "./project-description-form";
import { SocialLinksForm } from "./social-links-form";

export default async function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const user = await assertAuthenticated();
  const project = await getProjectByIdUseCase(user, parseInt(params.projectId));

  if (!project) {
    return <div>Project not found</div>;
  }

  function upperCaseThatName(name: string) {
    return name.toUpperCase();
  }

  return (
    <div className="space-y-8">
      <h1 className={pageTitleStyles}>Project Settings</h1>

      <div className="grid grid-cols-3 gap-8">
        <ConfigurationPanel title={"Project Image"}>
          <div className="flex flex-col gap-8">
            <Image
              src={getProjectImageUrl(project)}
              width={200}
              height={200}
              className="w-full h-[100px] object-cover"
              alt="image of the project"
            />
            <p className="dark:text-gray-400">
              {upperCaseThatName(
                "Upload a project image to make your project stand out."
              )}
            </p>
            <BannerUploadForm projectId={project.id} />
          </div>
        </ConfigurationPanel>

        <ConfigurationPanel title={"Project Name"}>
          <ProjectNameForm projectId={project.id} projectName={project?.name ?? ""} />
        </ConfigurationPanel>

        <ConfigurationPanel title={"Project Visibility"}>
          <div className="flex flex-col gap-8">
            <p className="dark:text-gray-400">
              Projects are private by default. If you want random people on the
              internet to find and join your project without an invite, switch
              this to on.
            </p>
            <ProjectVisibilitySwitch project={project} />
          </div>
        </ConfigurationPanel>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ConfigurationPanel title={"Project Description"}>
          <ProjectDescriptionForm
            projectId={project.id}
            description={project?.description ?? ""}
          />
        </ConfigurationPanel>

        <ConfigurationPanel title={"Social Links"}>
          <SocialLinksForm project={project} />
        </ConfigurationPanel>
      </div>
    </div>
  );
}
