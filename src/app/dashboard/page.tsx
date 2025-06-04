import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
   const supabase = await createClient();

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect("/auth/login");
   }

   const { defaultProject } = await db.project.findUserProjects(data.user.id);

   if (!defaultProject) {
      redirect("/dashboard/projects");
   }

   redirect(`/dashboard/projects/${defaultProject.id}`);
}
