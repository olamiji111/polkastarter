import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};


export function convertDollar(text: string) {
  // Use Unicode escape for fullwidth dollar
  return text.replace(/\$/g, '\uFE69');
}
