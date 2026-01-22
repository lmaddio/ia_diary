"use client";

import { useState } from "react";
import { Smile, Moon, Briefcase, Sun, Calendar, Flame } from "lucide-react";
import { content } from "@/content/text";
import { useAuthStore } from "@/store/useAuthStore";
import { useDiaryStore } from "@/store/useDiaryStore";
import { getMoodEmoji } from "@/lib/utils";
import {
  MetricCard,
  MoodChart,
  TimeDistributionChart,
  AIAnalysis,
  RecentEntries,
} from "@/components/dashboard";

type TimeRange = 7 | 30 | 365;

export default function DashboardPage() {
  const { dashboard } = content;
  const { user } = useAuthStore();
  const { entries, getMetrics, analyzePatterns, analysisResult, isAnalyzing } = useDiaryStore();
  
  const [timeRange, setTimeRange] = useState<TimeRange>(7);
  const metrics = getMetrics(timeRange);

  const handleAnalyze = () => {
    if (user) {
      analyzePatterns(user.id);
    }
  };

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: 7, label: dashboard.lastWeek },
    { value: 30, label: dashboard.lastMonth },
    { value: 365, label: dashboard.allTime },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{dashboard.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {dashboard.greeting}, {user?.name?.split(" ")[0] || "there"}! 👋
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === option.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <MetricCard
          title={dashboard.metrics.avgMood}
          value={metrics.avgMood > 0 ? `${getMoodEmoji(Math.round(metrics.avgMood))} ${metrics.avgMood.toFixed(1)}` : "—"}
          icon={Smile}
          color="indigo"
        />
        <MetricCard
          title={dashboard.metrics.avgSleep}
          value={metrics.avgSleep > 0 ? `${metrics.avgSleep}h` : "—"}
          icon={Moon}
          color="purple"
        />
        <MetricCard
          title={dashboard.metrics.avgWork}
          value={metrics.avgWork > 0 ? `${metrics.avgWork}h` : "—"}
          icon={Briefcase}
          color="orange"
        />
        <MetricCard
          title={dashboard.metrics.avgOutdoor}
          value={metrics.avgOutdoor > 0 ? `${metrics.avgOutdoor}h` : "—"}
          icon={Sun}
          color="green"
        />
        <MetricCard
          title={dashboard.metrics.totalEntries}
          value={metrics.totalEntries}
          icon={Calendar}
          color="blue"
        />
        <MetricCard
          title={dashboard.metrics.streak}
          value={`${metrics.currentStreak} days`}
          icon={Flame}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MoodChart data={metrics.moodTrend} />
        </div>
        <div>
          <TimeDistributionChart data={metrics.timeDistribution} />
        </div>
      </div>

      {/* AI Analysis & Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIAnalysis
          result={analysisResult}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
          hasEnoughData={entries.length >= 3}
        />
        <RecentEntries entries={entries} />
      </div>
    </div>
  );
}
