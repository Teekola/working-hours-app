import prisma from "@prisma";

export class ProjectDB {
   async findById(id: number) {
      return prisma.project.findUnique({ where: { id } });
   }

   async create(data: { name: string; ownerId: string }) {
      return await prisma.$transaction(async (tx) => {
         // Create the project
         const project = await tx.project.create({
            data,
         });

         // Check if the user has a defaultProjectId set
         const owner = await tx.user.findUnique({
            where: { id: data.ownerId },
            select: { defaultProjectId: true },
         });

         // If not set, update the user's defaultProjectId
         if (!owner?.defaultProjectId) {
            await tx.user.update({
               where: { id: data.ownerId },
               data: { defaultProjectId: project.id },
            });
         }

         return project;
      });
   }

   async findAllForUser(userId: string) {
      return prisma.project.findMany({ where: { ownerId: userId } });
   }
}
