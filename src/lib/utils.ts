import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Format date to display string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function toISODateString(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
}

/**
 * Calculate average of numbers
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

/**
 * Delay function for simulating async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get mood color class
 */
export function getMoodColor(mood: number): string {
  const colors: Record<number, string> = {
    1: "text-red-500 bg-red-100",
    2: "text-orange-500 bg-orange-100",
    3: "text-yellow-500 bg-yellow-100",
    4: "text-lime-500 bg-lime-100",
    5: "text-green-500 bg-green-100",
  };
  return colors[mood] || "text-gray-500 bg-gray-100";
}

/**
 * Get mood emoji
 */
export function getMoodEmoji(mood: number): string {
  const emojis: Record<number, string> = {
    1: "😢",
    2: "😕",
    3: "😐",
    4: "🙂",
    5: "😄",
  };
  return emojis[mood] || "😐";
}
