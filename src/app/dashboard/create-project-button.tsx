"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { btnIconStyles, btnStyles } from "@/styles/icons"
import { InteractiveOverlay } from "@/components/interactive-overlay"
import { useState } from "react"
import { CreateProjectForm } from "./create-project-form"
import Link from "next/link"

export function CreateProjectButton({
  isAuthenticated = true,
  className,
  title,
}: {
  isAuthenticated?: boolean
  className?: string
  title?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const AuthCaseButton = isAuthenticated ? (
    <>
      <InteractiveOverlay
        title={"Create Project"}
        description={"Create a new project to start managing your events."}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateProjectForm />}
      />

      <Button
        onClick={() => {
          setIsOpen(true)
        }}
        className={btnStyles + className}
      ></Button>
    </>
  ) : (
    <Link href="/sign-in">
      <Button className={btnStyles + className}>
        <PlusCircle className={btnIconStyles} />
        {title || "Create Project"}
      </Button>
    </Link>
  )

  return AuthCaseButton
}
