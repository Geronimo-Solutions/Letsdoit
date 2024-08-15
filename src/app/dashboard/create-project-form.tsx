"use client"

import { LoaderButton } from "@/components/loader-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"
import { schema } from "./validation"
import { createProjectAction } from "./actions"
import { Textarea } from "@/components/ui/textarea"
import { CheckIcon } from "lucide-react"
import { btnIconStyles } from "@/styles/icons"
import { ToggleContext } from "@/components/interactive-overlay"
import { useRouter } from "next/navigation"

export function CreateProjectForm({ isBrowsePage = false }: { isBrowsePage: boolean }) {
  const { setIsOpen, preventCloseRef } = useContext(ToggleContext)
  const { toast } = useToast()
  const { push } = useRouter()
  const { execute, isPending } = useServerAction(createProjectAction, {
    onStart() {
      preventCloseRef.current = true
    },
    onFinish(prop) {
      preventCloseRef.current = false
    },
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Project Created",
        description: "You can now start managing your events",
      })
      setIsOpen(false)
      if (isBrowsePage) {
        push("/dashboard")
      }
    },
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          execute(values).then(() => {})
        })}
        className="flex flex-col gap-4 flex-1 px-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton isLoading={isPending}>
          <CheckIcon className={btnIconStyles} /> Create Project
        </LoaderButton>
      </form>
    </Form>
  )
}
