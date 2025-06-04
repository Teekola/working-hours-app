"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const projectSchema = z.object({
   projectName: z.string().min(2, {
      message: "Project name must be at least 2 characters.",
   }),
});
type ProjectFormProps = React.HTMLAttributes<HTMLFormElement>;
export function ProjectForm(props: ProjectFormProps) {
   const form = useForm<z.infer<typeof projectSchema>>({
      resolver: zodResolver(projectSchema),
      defaultValues: {
         projectName: "",
      },
   });

   function onSubmit(data: z.infer<typeof projectSchema>) {
      console.log(data);
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
            <Button type="submit" size="lg" className="w-full">
               Submit
            </Button>
         </form>
      </Form>
   );
}
