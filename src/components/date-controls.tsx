"use client";

import { addDays, format } from "date-fns";
import { fi } from "date-fns/locale";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

import { cn, getDateParam } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { ButtonLink } from "./ui/button-link";
import { Label } from "./ui/label";

type DateControlsProps = ComponentProps<"div">;

export function DateControls({
   className,
   ...props
}: Readonly<DateControlsProps>) {
   const { projectId, date: dateParam } = useParams<{
      projectId: string;
      date: string;
   }>();
   const [popoverOpen, setPopoverOpen] = useState(false);
   const router = useRouter();

   const date = new Date(dateParam);
   const prevDay = addDays(date, -1);
   const nextDay = addDays(date, 1);
   return (
      <div {...props} className={cn("flex flex-col gap-2", className)}>
         <Label>Date</Label>
         <div className="mb-2 flex w-full items-center gap-2">
            {/* Previous day button */}
            <ButtonLink
               href={{
                  pathname: `/dashboard/projects/${projectId}/${getDateParam(
                     prevDay
                  )}`,
               }}
               variant="outline"
               size="icon"
            >
               <ChevronLeftIcon />
            </ButtonLink>

            {/* Date picker popover button */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
               <PopoverTrigger asChild>
                  <Button
                     variant={"outline"}
                     className={cn("w-full pl-3 text-left font-normal")}
                     onClick={() => setPopoverOpen((prev) => !prev)}
                  >
                     {format(date, "PPP", {
                        locale: fi,
                     })}

                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0">
                  <Calendar
                     mode="single"
                     selected={date}
                     onSelect={(date) => {
                        if (!date) return;
                        router.push(
                           `/dashboard/projects/${projectId}/${getDateParam(
                              date
                           )}`
                        );
                        setPopoverOpen(false);
                     }}
                     autoFocus
                     locale={fi}
                  />
               </PopoverContent>
            </Popover>

            {/* Next day button */}
            <ButtonLink
               href={{
                  pathname: `/dashboard/projects/${projectId}/${getDateParam(
                     nextDay
                  )}`,
               }}
               variant="outline"
               size="icon"
            >
               <ChevronRightIcon />
            </ButtonLink>
         </div>
      </div>
   );
}
