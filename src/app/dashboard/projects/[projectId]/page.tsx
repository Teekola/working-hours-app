import { notFound, redirect } from "next/navigation";

import HoursPerMonthTable from "@/components/hours-per-month-table";
import { ProjectSelect } from "@/components/project-select";
import { WorkEntryForm } from "@/components/work-entry-form";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectPage({
   params,
}: Readonly<{ params: Promise<{ projectId: string }> }>) {
   const { projectId } = await params;
   const supabase = await createClient();

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect("/auth/login");
   }

   const { defaultProject, otherProjects } = await db.project.findUserProjects(data.user.id);

   if (!defaultProject) {
      redirect("/dashboard/projects");
   }

   const allProjects = [defaultProject].concat(otherProjects);
   const currentProject = allProjects.find((project) => project.id === Number(projectId));

   if (!currentProject) {
      notFound();
   }

   const workEntry = await db.workEntry.findWorkEntry({
      userId: data.user.id,
      projectId: currentProject.id,
      date: new Date(),
   });

   return (
      <div className="flex w-full flex-1 flex-col gap-12">
         <header className="flex items-center justify-between gap-4">
            <ProjectSelect projects={allProjects} currentProjectName={currentProject.name} />
         </header>

         <WorkEntryForm
            projectId={currentProject.id}
            defaultValues={
               workEntry
                  ? {
                       date: new Date(workEntry.year, workEntry.month - 1, workEntry.day),
                       hours: workEntry.hours + "",
                    }
                  : undefined
            }
         />

         <HoursPerMonthTable projectId={currentProject.id} />
      </div>
   );
}
