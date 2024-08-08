"use client"

import { Input } from "@/components/ui/input"
import { ProjectBannerId, ProjectId } from "@/db/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { uploadImageAction } from "@/app/dashboard/projects/[projectId]/settings/actions"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { LoaderButton } from "@/components/loader-button"
import { useToast } from "@/components/ui/use-toast"
import { MAX_UPLOAD_IMAGE_SIZE } from "@/app-config"

const uploadImageSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size < MAX_UPLOAD_IMAGE_SIZE, {
    message: "Your image must be less than 1MB.",
  }),
})

export function BannerUploadForm({
  projectId,
  currBannerId,
}: {
  projectId: ProjectId
  currBannerId: ProjectBannerId
}) {
  const [pending, startTransition] = useTransition()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof uploadImageSchema>>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {},
  })

  const onSubmit: SubmitHandler<z.infer<typeof uploadImageSchema>> = (values, event) => {
    startTransition(() => {
      const formData = new FormData()
      formData.append("file", values.file!)
      uploadImageAction({ fileWrapper: formData, projectId, currBannerId }).then(() => {
        if (event) {
          const form = event.target as HTMLFormElement
          form.reset()
        }
        toast({
          title: "Image Updated",
          description: "You've successfull updated your project image.",
        })
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept=".jpg, .jpeg, .png, .webp, .gif, .avif, .ico, .bmp, .tiff"
                  onChange={(event) => {
                    const file = event.target.files && event.target.files[0]
                    onChange(file)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <LoaderButton isLoading={pending}>Upload</LoaderButton>
        </div>
      </form>
    </Form>
  )
}
