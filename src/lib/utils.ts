import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatWithLeadingZero = (num: number): string => {
  return num.toString().padStart(2, '0');
};
