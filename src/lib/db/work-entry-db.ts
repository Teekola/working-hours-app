import prisma from "@prisma";

export class WorkEntryDB {
   async findWorkEntry({
      userId,
      projectId,
      date,
   }: {
      userId: string;
      projectId: number;
      date: Date;
   }) {
      return prisma.workEntry.findUnique({
         where: {
            userId_projectId_day_month_year: {
               userId,
               projectId,
               day: date.getDate(),
               month: date.getMonth() + 1,
               year: date.getFullYear(),
            },
         },
      });
   }

   async upsertWorkRecord({
      userId,
      projectId,
      date,
      hours,
   }: {
      userId: string;
      projectId: number;
      date: Date;
      hours: number;
   }) {
      return prisma.workEntry.upsert({
         where: {
            userId_projectId_day_month_year: {
               userId,
               projectId,
               day: date.getDate(),
               month: date.getMonth() + 1,
               year: date.getFullYear(),
            },
         },
         create: {
            user: { connect: { id: userId } },
            project: { connect: { id: projectId } },
            hours,
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
         },
         update: { hours },
      });
   }

   /**
    * Get summed hours for a project and user grouped by year and month,
    * filtered to last N months from today (default 6)
    */
   async getMonthlyHoursForProject(userId: string, projectId: number, monthsBack = 6) {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

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

   async deleteEntry(id: number) {
      return prisma.workEntry.delete({ where: { id } });
   }
}
