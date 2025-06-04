import React from "react";

import { redirect } from "next/navigation";

import { startOfMonth, subMonths } from "date-fns";

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

interface HoursPerMonthTable {
   projectId: number;
}

interface MonthlyHours {
   year: number;
   month: number;
   _sum: { hours: number | null };
}

export default async function HoursPerMonthTable({ projectId }: HoursPerMonthTable) {
   const supabase = await createClient();
   const { data, error } = await supabase.auth.getUser();
   if (error || !data?.user) {
      redirect("/auth/login");
   }

   const monthsToShow = 6;

   const rawData: MonthlyHours[] = await db.workEntry.getMonthlyHoursForProject(
      data.user.id,
      projectId,
      monthsToShow
   );

   const now = new Date();
   const monthsArray: { year: number; month: number; hours: number }[] = [];

   for (let i = 0; i < monthsToShow; i++) {
      const d = subMonths(startOfMonth(now), i);
      const found = rawData.find(
         (item) => item.year === d.getFullYear() && item.month === d.getMonth() + 1
      );
      monthsArray.push({
         year: d.getFullYear(),
         month: d.getMonth() + 1,
         hours: found?._sum.hours ?? 0,
      });
   }

   const monthFormatter = new Intl.DateTimeFormat("fi-FI", {
      month: "long",
   });

   return (
      <div className="mx-auto max-w-md rounded-md border p-4 shadow-sm">
         <h2 className="mb-4 text-xl font-semibold">Hours worked per month</h2>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
               </TableRow>
            </TableHeader>

            <TableBody>
               {monthsArray.map(({ year, month, hours }) => (
                  <TableRow key={`${year}-${month}`}>
                     <TableCell>{year}</TableCell>
                     <TableCell>{monthFormatter.format(new Date(year, month - 1, 1))}</TableCell>
                     <TableCell className="text-right">{hours.toFixed(1)}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
