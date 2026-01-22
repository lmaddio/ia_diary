"use client";

import { Brain, Lightbulb, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { AIAnalysisResult } from "@/types";
import { content } from "@/content/text";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AIAnalysisProps {
  result: AIAnalysisResult | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  hasEnoughData: boolean;
}

export default function AIAnalysis({
  result,
  isAnalyzing,
  onAnalyze,
  hasEnoughData,
}: AIAnalysisProps) {
  const { analysis } = content.dashboard;

  const insightIcons = {
    positive: CheckCircle,
    neutral: Lightbulb,
    improvement: AlertCircle,
  };

  const insightColors = {
    positive: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
    neutral: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    improvement: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {analysis.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{analysis.description}</p>
          </div>
        </div>
        <Button
          onClick={onAnalyze}
          isLoading={isAnalyzing}
          disabled={!hasEnoughData || isAnalyzing}
          size="sm"
        >
          {isAnalyzing ? analysis.loading : analysis.button}
        </Button>
      </div>

      {!hasEnoughData && !result && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{analysis.noData}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Summary
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary}</p>
          </div>

          {/* Patterns */}
          {result.patterns.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Patterns Detected</h4>
              <ul className="space-y-2">
                {result.patterns.map((pattern, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-indigo-500 dark:text-indigo-400 mt-1">•</span>
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Insights */}
          {result.insights.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Insights</h4>
              <div className="space-y-3">
                {result.insights.map((insight, index) => {
                  const Icon = insightIcons[insight.type];
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border",
                        insightColors[insight.type]
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{insight.title}</span>
                      </div>
                      <p className="text-sm opacity-80">{insight.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <Lightbulb className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mt-1 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
