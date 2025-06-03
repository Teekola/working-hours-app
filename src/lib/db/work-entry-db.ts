import prisma from "@prisma";

export class WorkEntryDB {
   async logWork(data: {
      userId: string;
      projectId: number;
      date: Date;
      hours: number;
      month: number;
      year: number;
   }) {
      return prisma.workEntry.create({ data });
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
