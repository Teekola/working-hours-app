"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { upsertWorkEntry } from "@/actions/workEntry";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const schema = z.object({
   hours: z
      .string({ message: "Hours must be a number" })
      .refine((v) => Number(v) <= 24 && Number(v) >= 0, {
         message: "Hours must be within 0-24",
      }),
});

interface WorkEntryFormProps extends React.HTMLAttributes<HTMLFormElement> {
   defaultValues?: {
      hours: string;
   };
   projectId: number;
   date: Date;
}

export function WorkEntryForm({
   defaultValues,
   projectId,
   date,
   ...props
}: Readonly<WorkEntryFormProps>) {
   const [isSubmitting, setIsSubmitting] = React.useState(false);

   const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues ?? {
         hours: "0",
      },
   });

   async function onSubmit(data: z.infer<typeof schema>) {
      setIsSubmitting(true);
      const { hours } = data;

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

      form.reset({ hours });
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
                           disabled={isSubmitting}
                           onClick={decrementHours}
                        >
                           <Minus className="h-4 w-4" />
                        </Button>
                        <FormControl>
                           <HoursInput field={field} disabled={isSubmitting} />
                        </FormControl>
                        <Button
                           className="w-full max-w-32"
                           type="button"
                           variant="outline"
                           size="icon"
                           disabled={isSubmitting}
                           onClick={incrementHours}
                        >
                           <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                           type="button"
                           variant="secondary"
                           size="sm"
                           onClick={() => setPresetHours(7.5)}
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
   disabled?: boolean;
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
         value={inputValue}
         onChange={handleInputChange}
         onBlur={handleBlur}
      />
   );
}
