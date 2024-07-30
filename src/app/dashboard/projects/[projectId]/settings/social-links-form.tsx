"use client";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoaderButton } from "@/components/loader-button";
import { useToast } from "@/components/ui/use-toast";
import { updateProjectSocialLinksAction } from "./actions";
import { Project } from "@/db/schema";
import { socialUrlSchema } from "./schema";

const updateSocialLinksSchema = z.object(socialUrlSchema);

export function SocialLinksForm({ project }: { project: Project }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateSocialLinksSchema>>({
    resolver: zodResolver(updateSocialLinksSchema),
    defaultValues: {
      githubLink: project.githubLink ?? "",
      discordLink: project.discordLink ?? "",
      xLink: project.xLink ?? "",
      youtubeLink: project.youtubeLink ?? "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateSocialLinksSchema>> = (
    values
  ) => {
    startTransition(() => {
      updateProjectSocialLinksAction({ projectId: project.id, ...values }).then(
        () => {
          toast({
            title: "Project Updated",
            description: "Your social links have been updated.",
          });
        }
      );
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 flex flex-col gap-2 flex-1"
      >
        <FormField
          control={form.control}
          name="youtubeLink"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Youtube</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discordLink"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Discord</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="xLink"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>X</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubLink"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Github</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton className="w-fit ml-auto" isLoading={pending}>
          Save
        </LoaderButton>
      </form>
    </Form>
  );
}
