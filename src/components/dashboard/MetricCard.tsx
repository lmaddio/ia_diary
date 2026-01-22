"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "indigo" | "green" | "blue" | "purple" | "orange";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "indigo",
}: MetricCardProps) {
  const colors = {
    indigo: {
      bg: "bg-indigo-50",
      icon: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      iconBg: "bg-green-100",
    },
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  };

  const c = colors[color];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-gray-950 transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-sm mt-2",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", c.iconBg)}>
          <Icon className={cn("h-6 w-6", c.icon)} />
        </div>
      </div>
    </div>
  );
}
