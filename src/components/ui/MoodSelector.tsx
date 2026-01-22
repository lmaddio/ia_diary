"use client";

import { cn } from "@/lib/utils";
import { content } from "@/content/text";

interface MoodSelectorProps {
  value: number;
  onChange: (mood: 1 | 2 | 3 | 4 | 5) => void;
  label?: string;
}

export default function MoodSelector({ value, onChange, label }: MoodSelectorProps) {
  const moods = [1, 2, 3, 4, 5] as const;

  const moodStyles = {
    1: { bg: "bg-red-100 dark:bg-red-900/30", border: "border-red-500", hover: "hover:bg-red-50 dark:hover:bg-red-900/20" },
    2: { bg: "bg-orange-100 dark:bg-orange-900/30", border: "border-orange-500", hover: "hover:bg-orange-50 dark:hover:bg-orange-900/20" },
    3: { bg: "bg-yellow-100 dark:bg-yellow-900/30", border: "border-yellow-500", hover: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20" },
    4: { bg: "bg-lime-100 dark:bg-lime-900/30", border: "border-lime-500", hover: "hover:bg-lime-50 dark:hover:bg-lime-900/20" },
    5: { bg: "bg-green-100 dark:bg-green-900/30", border: "border-green-500", hover: "hover:bg-green-50 dark:hover:bg-green-900/20" },
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {label}
        </label>
      )}
      <div className="flex justify-between gap-2">
        {moods.map((mood) => {
          const moodData = content.moods[mood];
          const styles = moodStyles[mood];
          const isSelected = value === mood;

          return (
            <button
              key={mood}
              type="button"
              onClick={() => onChange(mood)}
              className={cn(
                "flex-1 flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-200",
                isSelected
                  ? `${styles.bg} ${styles.border}`
                  : `border-gray-200 dark:border-gray-700 ${styles.hover}`,
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              )}
            >
              <span className="text-2xl mb-1">{moodData.emoji}</span>
              <span className={cn(
                "text-xs font-medium",
                isSelected ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
              )}>
                {moodData.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
