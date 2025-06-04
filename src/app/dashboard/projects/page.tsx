import { redirect } from "next/navigation";

import { PageHeading } from "@/components/page-heading";
import { ProjectDialogDrawer } from "@/components/project-dialog-drawer";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardProjectsPage() {
   const supabase = await createClient();

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect("/auth/login");
   }

   return (
      <div className="flex w-full flex-1 flex-col gap-12">
         <header className="flex flex-wrap items-center justify-between">
            <PageHeading>Projects</PageHeading>
            <ProjectDialogDrawer />
         </header>
      </div>
   );
}
