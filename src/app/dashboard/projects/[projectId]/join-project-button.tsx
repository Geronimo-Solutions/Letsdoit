"use client"

import { joinProjectAction } from "@/app/dashboard/projects/[projectId]/actions"
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/components/ui/use-toast"
import { btnIconStyles } from "@/styles/icons"
import { Handshake } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useServerAction } from "zsa-react"

export function JoinProjectButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { projectId } = useParams<{ projectId: string }>()
  const { toast } = useToast()
  const { push } = useRouter()
  const { execute, status } = useServerAction(joinProjectAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "You joined this project.",
      })
    },
  })

  return (
    <LoaderButton
      isLoading={status === "pending"}
      onClick={() => {
        if (isAuthenticated) {
          execute(parseInt(projectId))
        } else push("/sign-in")
      }}
    >
      <Handshake className={btnIconStyles} /> Join Project
    </LoaderButton>
  )
}
