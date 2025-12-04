import { redirect } from "next/navigation";

import { WorkEntryForm } from "@/components/work-entry-form";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { getDateFromDateParam } from "@/lib/utils";

export default async function DayPage({
   params,
}: Readonly<PageProps<"/dashboard/projects/[projectId]/[date]">>) {
   const { projectId, date: dateParam } = await params;
   const supabase = await createClient();

   const date = getDateFromDateParam(dateParam);

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect("/auth/login");
   }

   const workEntry = await db.workEntry.findWorkEntry({
      userId: data.user.id,
      projectId: Number(projectId),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
   });

   return (
      <WorkEntryForm
         projectId={Number(projectId)}
         date={date}
         defaultValues={
            workEntry
               ? {
                    hours: workEntry.hours.toString(),
                 }
               : undefined
         }
      />
   );
}
