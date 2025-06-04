"use server";

import { getAuthUser } from "@/actions/utils";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";

type UpsertWorkEntryInput = {
   projectId: number;
   date: Date;
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
      const { date, hours, projectId } = input;

      const result = await db.workEntry.upsertWorkRecord({
         userId: user.id,
         projectId,
         date,
         hours,
      });

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
   date: Date;
};

export async function getWorkEntry({ projectId, date }: GetWorkEntryParams) {
   const user = await getAuthUser();

   const entry = await db.workEntry.findWorkEntry({
      userId: user.id,
      projectId,
      date,
   });

   if (!entry) {
      return { hours: 0 };
   }

   return { hours: entry.hours };
}
