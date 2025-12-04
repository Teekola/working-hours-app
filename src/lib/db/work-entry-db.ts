import prisma from "@prisma";
import { cacheTag, revalidateTag } from "next/cache";

async function findWorkEntry({
   userId,
   projectId,
   day,
   month,
   year,
}: {
   userId: string;
   projectId: number;
   day: number;
   month: number;
   year: number;
}) {
   "use cache";
   cacheTag(
      "find-work-entry",
      `find-work-entry:${userId}:${projectId}:${day}:${month}:${year}`
   );
   return prisma.workEntry.findUnique({
      where: {
         userId_projectId_day_month_year: {
            userId,
            projectId,
            day,
            month,
            year,
         },
      },
   });
}

async function upsertWorkRecord({
   userId,
   projectId,
   day,
   month,
   year,
   hours,
}: {
   userId: string;
   projectId: number;
   day: number;
   month: number;
   year: number;
   hours: number;
}) {
   const result = prisma.workEntry.upsert({
      where: {
         userId_projectId_day_month_year: {
            userId,
            projectId,
            day,
            month,
            year,
         },
      },
      create: {
         user: { connect: { id: userId } },
         project: { connect: { id: projectId } },
         hours,
         day,
         month,
         year,
      },
      update: { hours },
   });

   revalidateTag(
      `find-work-entry:${userId}:${projectId}:${day}:${month}:${year}`,
      "max"
   );
   revalidateTag(`get-monthly-hours-for-project:${userId}:${projectId}`, "max");

   return result;
}

/**
 * Get summed hours for a project and user grouped by year and month,
 * filtered to last N months from today (default 6)
 */
async function getMonthlyHoursForProject(
   userId: string,
   projectId: number,
   monthsBack = 6
) {
   "use cache";
   cacheTag(
      "get-monthly-hours-for-project",
      `get-monthly-hours-for-project:${userId}:${projectId}`
   );
   const now = new Date();
   const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - (monthsBack - 1),
      1
   );

   return prisma.workEntry.groupBy({
      by: ["year", "month"],
      where: {
         userId,
         projectId,
         OR: [
            {
               year: { gt: startDate.getFullYear() },
            },
            {
               year: startDate.getFullYear(),
               month: { gte: startDate.getMonth() + 1 },
            },
         ],
      },
      _sum: {
         hours: true,
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
   });
}

async function deleteEntry(id: number) {
   const result = await prisma.workEntry.delete({ where: { id } });
   revalidateTag(
      `find-work-entry:${result.userId}:${result.projectId}:${result.day}:${result.month}:${result.year}`,
      "max"
   );
   revalidateTag(
      `get-monthly-hours-for-project:${result.userId}:${result.projectId}`,
      "max"
   );
   return result;
}

export class WorkEntryDB {
   findWorkEntry = findWorkEntry;
   upsertWorkRecord = upsertWorkRecord;
   getMonthlyHoursForProject = getMonthlyHoursForProject;
   deleteEntry = deleteEntry;
}
