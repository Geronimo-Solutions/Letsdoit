import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { formProjectStyles, pageTitleStyles, pageWrapperStyles } from "@/styles/common"
import { searchPublicProjectsUseCase } from "@/use-cases/projects"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectCard } from "@/app/dashboard/project-card"
import { PageHeader } from "@/components/page-header"
import Image from "next/image"
import { ProjectPagination } from "./pagination"
import { Button } from "@/components/ui/button"
import { PlusCircle, XIcon } from "lucide-react"
import Link from "next/link"
import { UserSession } from "@/use-cases/types"
import { getCurrentUser } from "@/lib/session"
import { btnIconStyles, btnStyles } from "@/styles/icons"
import { CreateProjectButton } from "../dashboard/create-project-button"

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string }
}) {
  const search = searchParams.search
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const user = await getCurrentUser()

  return (
    <>
      <PageHeader>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-8 flex-grow">
            <h1 className={pageTitleStyles}>Browse Projects</h1>

            <div className="flex items-center justify-between">
              <form
                key={search}
                action={async (formData: FormData) => {
                  "use server"
                  const searchString = formData.get("search") as string
                  redirect(searchString ? `/browse?search=${searchString}` : "/browse")
                }}
                className="flex"
              >
                <div className={formProjectStyles}>
                  <div className="flex gap-2 items-center">
                    <div className="flex relative max-w-md w-full">
                      <Input
                        defaultValue={search}
                        placeholder="tech, health, ai, environment, etc."
                        name="search"
                        id="project"
                      />
                      {search && (
                        <Button
                          size="icon"
                          variant="link"
                          className="absolute right-1"
                          asChild
                        >
                          <Link href={`/browse`}>
                            <XIcon />
                          </Link>
                        </Button>
                      )}
                    </div>
                    <SubmitButton>Search</SubmitButton>
                  </div>
                </div>
              </form>
              <CreateProjectButton
                isBrowsePage
                isAuthenticated={!!user}
                title={"Add Project"}
              />
            </div>
          </div>
        </div>
      </PageHeader>

      <div className={pageWrapperStyles}>
        <Suspense fallback={<ProjectsListSkeleton />}>
          <ProjectsList page={page} search={search} />
        </Suspense>
      </div>
    </>
  )
}

function ProjectsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {new Array(6).fill("").map((v, idx) => (
        <div key={idx} className="rounded border p-4 space-y-4 h-[300px]">
          <Skeleton className="w-[140px] h-[20px] rounded" />
          <Skeleton className="h-[40px] rounded w-full" />
          <Skeleton className="w-[80px] h-[40px] rounded" />
        </div>
      ))}
    </div>
  )
}

async function ProjectsList({ search, page }: { search?: string; page: number }) {
  const { data, perPage, total } = await searchPublicProjectsUseCase(search ?? "", page)

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-8 dark:bg-slate-900 rounded-xl">
        <Image
          src="/empty-state/mountain.svg"
          width="200"
          height="200"
          alt="no gruops placeholder image"
        ></Image>

        <h2 className="text-2xl text-white">No projects matching your search</h2>
      </div>
    )
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {data.map((project) => (
          <ProjectCard
            memberCount={project.memberCount.toString()}
            key={project.id}
            project={project}
            buttonText="View"
          />
        ))}
      </div>

      <ProjectPagination
        search={search ?? ""}
        page={page}
        totalPages={Math.ceil(total / perPage)}
      />
    </>
  )
}
