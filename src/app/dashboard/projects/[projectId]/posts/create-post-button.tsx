"use client"

import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { CreateEventForm } from "./create-post-form"
import { Calendar } from "lucide-react"
import { btnIconStyles, btnStyles } from "@/styles/icons"
import { InteractiveOverlay } from "@/components/interactive-overlay"
import { useState } from "react"

export function CreatePostButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { projectId } = useParams<{ projectId: string }>()
  const { push } = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <InteractiveOverlay
        title={"Create Post"}
        description={"Fill in the form below to create a post."}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateEventForm projectId={parseInt(projectId)} />}
      />

      <Button
        onClick={() => {
          if (isAuthenticated) {
            setIsOpen(true)
          } else push("/sign-in")
        }}
        className={btnStyles}
      >
        <Calendar className={btnIconStyles} />
        Create Post
      </Button>
    </>
  )
}
