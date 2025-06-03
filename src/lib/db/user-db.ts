import prisma from "@prisma";

export class UserDB {
   async findById(id: string) {
      return prisma.user.findUnique({ where: { id } });
   }

   async getUserWithProjects(id: string) {
      return prisma.user.findUnique({
         where: { id },
         include: {
            projects: true,
            defaultProject: true,
            workEntries: true,
         },
      });
   }
}
