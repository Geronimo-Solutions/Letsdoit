import { ProjectCard } from "@/app/dashboard/project-card"
import { Button } from "@/components/ui/button"
import { assertAuthenticated } from "@/lib/safe-action"
import { cn } from "@/lib/utils"
import { cardStyles, pageTitleStyles } from "@/styles/common"
import { btnIconStyles, btnStyles } from "@/styles/icons"
import { getProjectsByUserUseCase } from "@/use-cases/projects"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CreateProjectButton } from "./create-project-button"
import { PageHeader } from "@/components/page-header"

export default async function DashboardPage() {
  const user = await assertAuthenticated()

  const projects = await getProjectsByUserUseCase(user)

  const hasProjects = projects.length > 0

  if (!hasProjects) {
    return (
      <div
        className={cn(
          "space-y-8 container mx-auto py-24 min-h-screen max-w-2xl flex flex-col items-center"
        )}
      >
        <div className="flex justify-between items-center">
          <h1 className={pageTitleStyles}>Your Projects</h1>
        </div>

        <div className={cn(cardStyles, "flex flex-col items-center gap-6 p-12 w-full")}>
          <Image
            src="/empty-state/no-data.svg"
            width="200"
            height="200"
            alt="no image placeholder image"
          ></Image>
          <h2>Uhoh, you don't own any projects</h2>

          <div className="flex gap-4">
            <CreateProjectButton />

            <Button asChild className={btnStyles} variant={"secondary"}>
              <Link href={`/browse`}>
                <Search className={btnIconStyles} /> Browse Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const ownedProjects = projects.filter((project) => project.userId === user.id)
  const memberProjects = projects.filter((project) => project.userId !== user.id)

  return (
    <>
      <PageHeader>
        <h1
          className={cn(
            pageTitleStyles,
            "flex justify-between items-center flex-wrap gap-4"
          )}
        >
          Your Projects
          {hasProjects && <CreateProjectButton />}
        </h1>
      </PageHeader>
      <div className={cn("space-y-8 container mx-auto py-12 min-h-screen")}>
        <div className="flex justify-between items-center">
          <h2 className={"text-2xl"}>Projects You Manage</h2>
        </div>

        {ownedProjects.length === 0 && (
          <p className="flex gap-8 items-center mt-8 py-4 rounded border dark:bg-gray-800 px-4">
            You don't manage any projects
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ownedProjects.map((project) => (
            <ProjectCard
              memberCount={project.memberCount.toString()}
              project={project}
              key={project.id}
              buttonText={"Manage Project"}
              isAuthenticated={!!user}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <h2 className={"text-2xl"}>Your Other Projects</h2>
        </div>

        {memberProjects.length === 0 && (
          <p className={cn(cardStyles, "flex gap-8 items-center mt-8 py-4 px-4")}>
            You're not part of any projects
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {memberProjects.map((project) => (
            <ProjectCard
              memberCount={project.memberCount.toString()}
              project={project}
              key={project.id}
              buttonText={"View Project"}
              isAuthenticated={!!user}
            />
          ))}
        </div>
      </div>
    </>
  )
}
