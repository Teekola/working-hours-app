import prisma from "@prisma";
async function findById(id: string) {
   return prisma.user.findUnique({ where: { id } });
}

async function getUserWithProjects(id: string) {
   return prisma.user.findUnique({
      where: { id },
      include: {
         projects: true,
         defaultProject: true,
         workEntries: true,
      },
   });
}

export class UserDB {
   findById = findById;
   getUserWithProjects = getUserWithProjects;
}
