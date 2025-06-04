import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
   const supabase = await createClient();

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect("/auth/login");
   }

   return (
      <div className="flex w-full flex-1 flex-col gap-12">
         <Link href="/dashboard/projects">Projects</Link>
      </div>
   );
}
