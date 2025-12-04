"use server";

import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

import { getAuthUser } from "./utils";

type ProjectSuccess = {
   created: true;
   data: ReturnType<typeof db.project.create> extends Promise<infer R>
      ? R
      : never;
};

type ProjectError = {
   created: false;
   error: string;
};

type CreateProjectResult = ProjectSuccess | ProjectError;

export async function createProject({
   projectName,
}: {
   projectName: string;
}): Promise<CreateProjectResult> {
   const user = await getAuthUser();
   try {
      const project = await db.project.create({
         name: projectName,
         ownerId: user.id,
      });
      return { created: true, data: project };
   } catch (error) {
      if (
         error instanceof Prisma.PrismaClientKnownRequestError &&
         error.code === "P2002"
      ) {
         return {
            created: false,
            error: `Project with name "${projectName}" already exists.`,
         };
      }
      return { created: false, error: "Unknown error occurred." };
   }
}
