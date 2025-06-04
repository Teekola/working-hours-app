"use client";

import * as React from "react";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

import { ProjectForm } from "./project-form";

type ProjectDialogDrawerProps = React.ComponentProps<typeof Button>;

export function ProjectDialogDrawer(props: ProjectDialogDrawerProps) {
   const [open, setOpen] = React.useState(false);
   const isDesktop = useMediaQuery("(min-width: 476px)");

   if (isDesktop) {
      return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button variant="outline" {...props}>
                  <PlusIcon className="-ml-2" /> New Project
               </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[476px]" disableCloseOnOverlayClick>
               <DialogHeader>
                  <DialogTitle>New Project</DialogTitle>
                  <DialogDescription>Create a new project for tracking hours.</DialogDescription>
               </DialogHeader>
               <ProjectForm setOpen={setOpen} />
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <Drawer open={open} onOpenChange={setOpen}>
         <DrawerTrigger asChild>
            <Button variant="outline" {...props}>
               <PlusIcon className="-ml-2" /> New Project
            </Button>
         </DrawerTrigger>
         <DrawerContent>
            <DrawerHeader className="text-left">
               <DrawerTitle>New Project</DrawerTitle>
               <DrawerDescription>Create a new project for tracking hours.</DrawerDescription>
            </DrawerHeader>
            <ProjectForm className="px-4" setOpen={setOpen} />
            <DrawerFooter className="pt-2">
               <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
               </DrawerClose>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
