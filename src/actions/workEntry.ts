"use server";

import { refresh } from "next/cache";

import { getAuthUser } from "@/actions/utils";
import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

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

export type UpsertWorkEntryResult =
   | UpsertWorkEntrySuccess
   | UpsertWorkEntryError;

export async function upsertWorkEntry(
   input: UpsertWorkEntryInput
): Promise<UpsertWorkEntryResult> {
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

      refresh();

      return { success: true, data: result };
   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         return { success: false, error: `Database error: ${error.message}` };
      }
      return { success: false, error: "Unknown server error." };
   }
}
