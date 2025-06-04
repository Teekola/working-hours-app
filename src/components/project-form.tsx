"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ButtonLoading } from "./ui/button-loading";

const projectSchema = z.object({
   projectName: z.string().min(2, {
      message: "Project name must be at least 2 characters.",
   }),
});
interface ProjectFormProps extends React.HTMLAttributes<HTMLFormElement> {
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export function ProjectForm({ setOpen, ...props }: ProjectFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const form = useForm<z.infer<typeof projectSchema>>({
      resolver: zodResolver(projectSchema),
      defaultValues: {
         projectName: "",
      },
   });

   async function onSubmit(data: z.infer<typeof projectSchema>) {
      setIsSubmitting(true);
      const createProjectResult = await createProject(data);

      if (!createProjectResult.created) {
         form.setError("projectName", { message: createProjectResult.error });
         setIsSubmitting(false);
         return;
      }

      console.log("Created project", createProjectResult.data);
      setIsSubmitting(false);
      setOpen(false);
   }

   return (
      <Form {...form}>
         <form
            {...props}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6", props.className)}
         >
            <FormField
               control={form.control}
               name="projectName"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Project name</FormLabel>
                     <FormControl>
                        <Input {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            {isSubmitting && (
               <ButtonLoading size="lg" className="w-full">
                  Submitting...
               </ButtonLoading>
            )}
            {!isSubmitting && (
               <Button type="submit" size="lg" className="w-full">
                  Submit
               </Button>
            )}
         </form>
      </Form>
   );
}
