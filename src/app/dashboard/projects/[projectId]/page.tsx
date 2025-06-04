import { notFound, redirect } from "next/navigation";

import { ProjectSelect } from "@/components/project-select";
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

   return (
      <div className="flex w-full flex-1 flex-col gap-12">
         <header className="flex items-center justify-between gap-4">
            <ProjectSelect projects={allProjects} currentProjectName={currentProject.name} />
         </header>
      </div>
   );
}
