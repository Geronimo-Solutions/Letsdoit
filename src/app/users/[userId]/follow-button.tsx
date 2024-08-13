"use client"

import { useToast } from "@/components/ui/use-toast"
import { useServerAction } from "zsa-react"
import { followUserAction } from "./actions"
import { UserId } from "@/use-cases/types"
import { LoaderButton } from "@/components/loader-button"
import { UserPlus } from "lucide-react"
import { btnIconStyles, btnStyles } from "@/styles/icons"
import { useRouter } from "next/navigation"

export function FollowButton({
  foreignUserId,
  isAthenticated,
}: {
  foreignUserId: UserId
  isAthenticated: boolean
}) {
  const { toast } = useToast()
  const { push } = useRouter()

  const { execute, isPending } = useServerAction(followUserAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "You've followed that user.",
      })
    },
    onError() {
      toast({
        title: "Uh oh",
        variant: "destructive",
        description: "Something went wrong trying to follow that user.",
      })
    },
  })

  return (
    <LoaderButton
      className={btnStyles}
      onClick={() => {
        if (isAthenticated) {
          execute({ foreignUserId })
        }
        push("/sign-in")
      }}
      isLoading={isPending}
    >
      <UserPlus className={btnIconStyles} /> Follow
    </LoaderButton>
  )
}
