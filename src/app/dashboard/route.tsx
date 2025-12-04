import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { getDateParam } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
   const supabase = await createClient();

   const baseUrl = new URL(req.nextUrl).origin;

   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      return NextResponse.redirect(new URL("/auth/login", baseUrl), 303);
   }

   const { defaultProject } = await db.project.findUserProjects(data.user.id);

   if (!defaultProject) {
      return NextResponse.redirect(new URL("/dashboard/projects", baseUrl));
   }

   return NextResponse.redirect(
      new URL(
         `/dashboard/projects/${defaultProject.id}/${getDateParam(new Date())}`,
         baseUrl
      )
   );
}
