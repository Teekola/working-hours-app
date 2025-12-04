"use client";

import { useState } from "react";

import Link from "next/link";

import { ChevronDownIcon } from "lucide-react";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project } from "@/lib/generated/prisma/browser";

import { ProjectDialogDrawer } from "./project-dialog-drawer";
import { useParams } from "next/navigation";

interface ProjectSelectProps {
   projects: Project[];
   currentProjectName: string;
}

export function ProjectSelect({
   projects,
   currentProjectName,
}: ProjectSelectProps) {
   const [open, setOpen] = useState(false);
   const { date: dateParam } = useParams<{ date: string }>();

   return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
         <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg border py-2 px-3 text-left text-2xl font-bold">
            {currentProjectName}
            <ChevronDownIcon
               className={`ml-2 h-6 w-6 ${open ? "rotate-180" : "rotate-0"}`}
            />
         </DropdownMenuTrigger>
         <DropdownMenuContent className="flex w-(--radix-dropdown-menu-trigger-width) flex-1 flex-col">
            {projects.map((project) => (
               <DropdownMenuItem asChild key={project.id}>
                  <Link
                     href={`/dashboard/projects/${project.id}/${dateParam}`}
                     className="block w-full flex-1 cursor-pointer py-2 text-base"
                  >
                     {project.name}
                  </Link>
               </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <ProjectDialogDrawer className="sm:ml-auto sm:w-fit" />
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
