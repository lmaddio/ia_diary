"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { DiaryEntry } from "@/types";
import { content } from "@/content/text";
import { formatDate, getMoodEmoji } from "@/lib/utils";

interface RecentEntriesProps {
  entries: DiaryEntry[];
}

export default function RecentEntries({ entries }: RecentEntriesProps) {
  const { recentEntries } = content.dashboard;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {recentEntries.title}
        </h3>
        <Link
          href="/diary"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
        >
          {recentEntries.viewAll}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{recentEntries.noEntries}</p>
          <Link
            href="/diary"
            className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            Create your first entry →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(entry.date)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {entry.notes || entry.activities || "No notes"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {entry.sleepHours}h sleep
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.workHours}h work
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
