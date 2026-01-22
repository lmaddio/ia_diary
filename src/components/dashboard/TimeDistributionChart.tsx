"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import { TimeDistributionData } from "@/types";
import { content } from "@/content/text";

interface TimeDistributionChartProps {
  data: TimeDistributionData;
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#e5e7eb"];

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Payload<number, string>[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataItem;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">{data.value} hours</p>
      </div>
    );
  }
  return null;
}

export default function TimeDistributionChart({ data }: TimeDistributionChartProps) {
  const chartData: ChartDataItem[] = [
    { name: "Sleep", value: Math.round(data.sleep), color: COLORS[0] },
    { name: "Work", value: Math.round(data.work), color: COLORS[1] },
    { name: "Outdoor", value: Math.round(data.outdoor), color: COLORS[2] },
    { name: "Other", value: Math.round(data.other), color: COLORS[3] },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {content.dashboard.charts.timeDistribution}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
