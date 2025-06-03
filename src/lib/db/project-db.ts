import prisma from "@prisma";

export class ProjectDB {
   async findById(id: number) {
      return prisma.project.findUnique({ where: { id } });
   }

   async create(data: { name: string; ownerId: string }) {
      return prisma.project.create({
         data,
      });
   }

   async findAllForUser(userId: string) {
      return prisma.project.findMany({ where: { ownerId: userId } });
   }
}
