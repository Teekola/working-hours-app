"use server";

import { revalidatePath } from "next/cache";

import { getAuthUser } from "@/actions/utils";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";

type UpsertWorkEntryInput = {
   projectId: number;
   day: number;
   month: number;
   year: number;
   hours: number;
};

type UpsertWorkEntrySuccess = {
   success: true;
   data: Awaited<ReturnType<typeof db.workEntry.upsertWorkRecord>>;
};

type UpsertWorkEntryError = {
   success: false;
   error: string;
};

export type UpsertWorkEntryResult = UpsertWorkEntrySuccess | UpsertWorkEntryError;

export async function upsertWorkEntry(input: UpsertWorkEntryInput): Promise<UpsertWorkEntryResult> {
   try {
      const user = await getAuthUser();
      const { day, month, year, hours, projectId } = input;

      const result = await db.workEntry.upsertWorkRecord({
         userId: user.id,
         projectId,
         day,
         month,
         year,
         hours,
      });

      revalidatePath(`/dashboard/projects/${projectId}`);

      return { success: true, data: result };
   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         return { success: false, error: `Database error: ${error.message}` };
      }
      return { success: false, error: "Unknown server error." };
   }
}

type GetWorkEntryParams = {
   projectId: number;
   day: number;
   month: number;
   year: number;
};

export async function getWorkEntry({ projectId, day, month, year }: GetWorkEntryParams) {
   const user = await getAuthUser();

   const entry = await db.workEntry.findWorkEntry({
      userId: user.id,
      projectId,
      day,
      month,
      year,
   });

   if (!entry) {
      return { hours: 0 };
   }

   return { hours: entry.hours };
}
