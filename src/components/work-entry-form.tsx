"use client";

import { useEffect, useTransition } from "react";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { fi } from "date-fns/locale";
import {
   CalendarIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
   Loader2,
   Minus,
   Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getWorkEntry, upsertWorkEntry } from "@/actions/workEntry";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const schema = z.object({
   date: z.date(),
   hours: z
      .string({ invalid_type_error: "Hours must be a number" })
      .refine((v) => Number(v) <= 24 && Number(v) >= 0, {
         message: "Hours must be within 0-24",
      }),
});

interface WorkEntryFormProps extends React.HTMLAttributes<HTMLFormElement> {
   defaultValues?: {
      date: Date;
      hours: string;
   };
   projectId: number;
}

export function WorkEntryForm({
   defaultValues,
   projectId,
   ...props
}: Readonly<WorkEntryFormProps>) {
   const [isPending, startTransition] = useTransition();
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [popoverOpen, setPopoverOpen] = React.useState(false);

   const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues ?? {
         date: new Date(),
         hours: "0",
      },
   });

   const date = form.watch("date");

   useEffect(() => {
      if (!date) return;

      startTransition(async () => {
         const result = await getWorkEntry({
            projectId,
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
         });
         form.setValue("hours", result.hours + "");
      });
   }, [date, form, projectId]);

   async function onSubmit(data: z.infer<typeof schema>) {
      setIsSubmitting(true);
      const { hours, date } = data;

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      await upsertWorkEntry({
         projectId,
         hours: Number(hours),
         day,
         month,
         year,
      });
      form.reset();
      setIsSubmitting(false);
   }

   const incrementHours = () => {
      const current = form.getValues("hours") ?? 0;
      form.setValue("hours", "" + Math.min(Number(current) + 0.5, 24), {
         shouldDirty: true,
      });
   };

   const decrementHours = () => {
      const current = form.getValues("hours") ?? 0;
      form.setValue("hours", "" + Math.max(Number(current) - 0.5, 0), {
         shouldDirty: true,
      });
   };

   const setPresetHours = (value: number) => {
      form.setValue("hours", value + "", { shouldDirty: true });
   };

   const canSubmit = form.formState.isDirty && !isSubmitting;

   return (
      <Form {...form}>
         <form
            {...props}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6", props.className)}
         >
            <FormField
               control={form.control}
               name="date"
               render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel>Date</FormLabel>
                     <div className="mb-2 flex w-full items-center gap-2">
                        {/* Previous day button */}
                        <Button
                           type="button"
                           variant="outline"
                           size="icon"
                           onClick={() =>
                              field.onChange(
                                 addDays(field.value ?? new Date(), -1)
                              )
                           }
                        >
                           <ChevronLeftIcon />
                        </Button>

                        {/* Date picker popover button */}
                        <Popover
                           open={popoverOpen}
                           onOpenChange={setPopoverOpen}
                        >
                           <PopoverTrigger asChild>
                              <FormControl>
                                 <Button
                                    variant={"outline"}
                                    className={cn(
                                       "w-full pl-3 text-left font-normal",
                                       !field.value && "text-muted-foreground"
                                    )}
                                    onClick={() =>
                                       setPopoverOpen((prev) => !prev)
                                    }
                                 >
                                    {field.value ? (
                                       format(field.value, "PPP", {
                                          locale: fi,
                                       })
                                    ) : (
                                       <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                 </Button>
                              </FormControl>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0">
                              <Calendar
                                 mode="single"
                                 selected={field.value}
                                 onSelect={(date) => {
                                    field.onChange(date);
                                    setPopoverOpen(false);
                                 }}
                                 initialFocus
                                 locale={fi}
                              />
                           </PopoverContent>
                        </Popover>

                        {/* Next day button */}
                        <Button
                           type="button"
                           variant="outline"
                           size="icon"
                           onClick={() =>
                              field.onChange(
                                 addDays(field.value ?? new Date(), 1)
                              )
                           }
                        >
                           <ChevronRightIcon />
                        </Button>
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="hours"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Hours Worked</FormLabel>
                     <div className="flex items-center gap-2">
                        <Button
                           className="w-full max-w-32"
                           type="button"
                           variant="outline"
                           size="icon"
                           onClick={decrementHours}
                           disabled={isPending}
                        >
                           <Minus className="h-4 w-4" />
                        </Button>
                        <FormControl>
                           <HoursInput field={field} disabled={isPending} />
                        </FormControl>
                        <Button
                           className="w-full max-w-32"
                           type="button"
                           variant="outline"
                           size="icon"
                           onClick={incrementHours}
                           disabled={isPending}
                        >
                           <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                           type="button"
                           variant="secondary"
                           size="sm"
                           onClick={() => setPresetHours(7.5)}
                           disabled={isPending}
                        >
                           7,5 h
                        </Button>
                     </div>

                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" className="w-full" disabled={!canSubmit}>
               {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               )}
               Save Entry
            </Button>

            {isPending && (
               <div className="text-sm text-muted-foreground">
                  Loading data for selected date…
               </div>
            )}
         </form>
      </Form>
   );
}

const dotRegex = /\./g;
const commaRegex = /\,/g;

function transformDecimalInputValue(input: string, decimalSeparator = ".") {
   const replaceRegex = decimalSeparator === "," ? dotRegex : commaRegex;
   let filteredValue = input
      .replace(/[^0-9.,]/g, "")
      .replace(replaceRegex, decimalSeparator);

   const decimalIndex = filteredValue.indexOf(decimalSeparator);

   const limitToOneRegex = decimalSeparator === "," ? commaRegex : dotRegex;
   filteredValue =
      filteredValue.slice(0, decimalIndex + 1) +
      filteredValue.slice(decimalIndex + 1).replace(limitToOneRegex, "");

   if (decimalIndex === 0) {
      filteredValue = filteredValue.replace(decimalSeparator, "");
   }

   if (/^0[0-9]+/.test(filteredValue) && decimalIndex === -1) {
      filteredValue = filteredValue.replace(/^0+/, "");
   }
   return filteredValue;
}

// Round to nearest 0.5
function roundToNearestHalf(num: number) {
   return Math.round(num * 2) / 2;
}

export function HoursInput({
   field,
   disabled,
}: {
   field: {
      value: string | undefined; // always dot decimal internally
      onChange: (value: string | undefined) => void;
   };
   disabled: boolean;
}) {
   const decimalSeparator = ","; // display separator

   // Initialize display value replacing dot with comma
   const [inputValue, setInputValue] = React.useState(() =>
      field.value === undefined || field.value === null
         ? ""
         : field.value.replace(".", decimalSeparator)
   );

   // Sync display value when internal value changes
   React.useEffect(() => {
      const formatted =
         field.value === undefined || field.value === null
            ? ""
            : field.value.replace(".", decimalSeparator);
      if (formatted !== inputValue) {
         setInputValue(formatted);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [field.value]);

   function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      let val = e.target.value;

      // Sanitize input with comma decimal separator
      val = transformDecimalInputValue(val, decimalSeparator);

      setInputValue(val);

      if (val === "") {
         field.onChange("");
         return;
      }

      // Convert comma to dot before storing internally
      const internalValue = val.replace(",", ".");

      // Validate that internalValue parses as number
      const parsed = parseFloat(internalValue);
      if (!isNaN(parsed)) {
         field.onChange(internalValue);
      } else {
         // Invalid input — do not update internal value
         field.onChange("");
      }
   }

   function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      let val = e.target.value;
      if (val.endsWith(decimalSeparator)) {
         val = val.slice(0, -1);
      }

      if (val === "") {
         setInputValue("");
         field.onChange("");
         return;
      }

      const internalValue = val.replace(",", ".");
      let parsed = parseFloat(internalValue);
      if (!isNaN(parsed)) {
         // Clamp 0-24 and round to nearest 0.5
         parsed = Math.min(Math.max(parsed, 0), 24);
         parsed = roundToNearestHalf(parsed);

         const storedValue = parsed.toString(); // dot decimal internally
         const displayValue = storedValue.replace(".", decimalSeparator);

         setInputValue(displayValue);
         field.onChange(storedValue);
      } else {
         setInputValue("");
         field.onChange("");
      }
   }

   return (
      <Input
         type="text"
         inputMode="decimal"
         pattern="[0-9]*[.,]?[0-9]*"
         autoComplete="off"
         spellCheck={false}
         disabled={disabled}
         className="text-center"
         onFocus={(e) => e.target.select()}
         {...field}
         value={disabled ? "" : inputValue}
         onChange={handleInputChange}
         onBlur={handleBlur}
      />
   );
}
