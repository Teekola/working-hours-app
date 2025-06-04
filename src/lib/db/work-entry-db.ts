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

   async getEntriesForUserInMonth(userId: string, month: number, year: number) {
      return prisma.workEntry.findMany({
         where: { userId, month, year },
         include: { project: true },
      });
   }

   async deleteEntry(id: number) {
      return prisma.workEntry.delete({ where: { id } });
   }
}
