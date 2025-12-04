import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function getDateParam(date: Date) {
   const year = date.getFullYear();
   const month = date.getMonth() + 1;
   const day = date.getDate();
   return `${year}-${month}-${day}`;
}

export function getDateFromDateParam(date: string) {
   return new Date(date);
}
