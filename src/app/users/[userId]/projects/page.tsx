import { ProjectCard } from "@/app/dashboard/project-card";
import { getPublicProjectsByUserIdUseCase } from "@/use-cases/projects";
import Image from "next/image";

export default async function ProjectsContent({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = params;
  const userProjects = await getPublicProjectsByUserIdUseCase(parseInt(userId));

  return (
    <div>
      {userProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-8 bg-slate-900 rounded-xl">
          <Image
            src="/empty-state/mountain.svg"
            width="200"
            height="200"
            alt="no gruops placeholder image"
          ></Image>
          <h2 className="text-2xl">This user isn't part of any projects</h2>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {userProjects.map((project) => (
          <ProjectCard
            memberCount={project.memberCount.toString()}
            project={project}
            key={project.id}
            buttonText={"View Project"}
          />
        ))}
      </div>
    </div>
  );
}
