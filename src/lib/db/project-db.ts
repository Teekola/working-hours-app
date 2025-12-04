import prisma from "@prisma";
import { cacheTag, revalidateTag } from "next/cache";

async function findById(id: number) {
   "use cache";
   cacheTag("project-find-by-id", `project-find-by-id:${id}`);
   return prisma.project.findUnique({ where: { id } });
}

async function findUserProjects(ownerId: string) {
   "use cache";
   cacheTag("find-user-projects", `find-user-projects:${ownerId}`);
   const user = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { defaultProject: true, projects: true },
   });

   return {
      defaultProject: user?.defaultProject,
      otherProjects:
         user?.projects.filter(
            (project) => project.id !== user.defaultProject?.id
         ) ?? [],
   };
}

async function create(data: { name: string; ownerId: string }) {
   const result = await prisma.$transaction(async (tx) => {
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

   revalidateTag(`find-user-projects:${data.ownerId}`, "max");
   revalidateTag(`project-find-all-for-user:${data.ownerId}`, "max");
   return result;
}

async function findAllForUser(userId: string) {
   "use cache";
   cacheTag("project-find-all-for-user", `project-find-all-for-user:${userId}`);
   const reuslt = prisma.project.findMany({ where: { ownerId: userId } });

   return reuslt;
}

export class ProjectDB {
   findById = findById;
   findUserProjects = findUserProjects;
   create = create;
   findAllForUser = findAllForUser;
}
