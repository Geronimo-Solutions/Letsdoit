import { assertAuthenticated } from "@/lib/session";
import { pageTitleStyles } from "@/styles/common";
import { getProjectByIdUseCase } from "@/use-cases/projects";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { DeleteProjectButton } from "./delete-project-button";

export default async function DangerTab({
  params,
}: {
  params: { projectId: string };
}) {
  const user = await assertAuthenticated();
  const project = await getProjectByIdUseCase(user, parseInt(params.projectId));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className={pageTitleStyles}>Danger</h1>

      <div className="grid grid-cols-2 gap-8">
        <ConfigurationPanel variant="destructive" title={"Delete this Project"}>
          <div className="flex flex-col gap-8">
            <p className="dark:text-gray-400">
              Delete this project and all it's data.
            </p>
            <DeleteProjectButton />
          </div>
        </ConfigurationPanel>
      </div>
    </div>
  );
}
