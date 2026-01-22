import { NextRequest, NextResponse } from "next/server";
import { DiaryEntry, AIAnalysisResult } from "@/types";

/**
 * Analysis API Route
 * 
 * This route analyzes diary entries and returns patterns/insights.
 * Currently mocked - replace with actual LLM integration for deeper analysis.
 * 
 * To integrate with OpenAI:
 * 1. npm install openai
 * 2. Set OPENAI_API_KEY in environment
 * 3. Create a prompt that includes the diary data
 * 4. Parse the structured response
 */

interface AnalyzeRequest {
  entries: DiaryEntry[];
  userId: string;
}

function analyzeEntries(entries: DiaryEntry[]): AIAnalysisResult {
  if (entries.length < 3) {
    return {
      summary: "Not enough data to provide meaningful analysis. Please log at least 3 entries.",
      patterns: [],
      recommendations: [],
      insights: [],
    };
  }

  // Calculate statistics
  const avgMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
  const avgSleep = entries.reduce((sum, e) => sum + e.sleepHours, 0) / entries.length;
  const avgWork = entries.reduce((sum, e) => sum + e.workHours, 0) / entries.length;
  const avgOutdoor = entries.reduce((sum, e) => sum + e.outdoorHours, 0) / entries.length;

  // Find correlations
  const highMoodDays = entries.filter((e) => e.mood >= 4);
  const lowMoodDays = entries.filter((e) => e.mood <= 2);

  const avgSleepOnHighMood = highMoodDays.length > 0
    ? highMoodDays.reduce((sum, e) => sum + e.sleepHours, 0) / highMoodDays.length
    : 0;
  const avgSleepOnLowMood = lowMoodDays.length > 0
    ? lowMoodDays.reduce((sum, e) => sum + e.sleepHours, 0) / lowMoodDays.length
    : 0;

  const avgWorkOnHighMood = highMoodDays.length > 0
    ? highMoodDays.reduce((sum, e) => sum + e.workHours, 0) / highMoodDays.length
    : 0;
  const avgWorkOnLowMood = lowMoodDays.length > 0
    ? lowMoodDays.reduce((sum, e) => sum + e.workHours, 0) / lowMoodDays.length
    : 0;

  const avgOutdoorOnHighMood = highMoodDays.length > 0
    ? highMoodDays.reduce((sum, e) => sum + e.outdoorHours, 0) / highMoodDays.length
    : 0;

  // Generate patterns
  const patterns: string[] = [];
  
  if (avgSleepOnHighMood > avgSleepOnLowMood + 0.5) {
    patterns.push(
      `You sleep an average of ${(avgSleepOnHighMood - avgSleepOnLowMood).toFixed(1)} more hours on days when your mood is better.`
    );
  }

  if (avgWorkOnLowMood > avgWorkOnHighMood + 1) {
    patterns.push(
      `You tend to work ${(avgWorkOnLowMood - avgWorkOnHighMood).toFixed(1)} more hours on days when your mood is lower.`
    );
  }

  if (avgOutdoorOnHighMood > avgOutdoor) {
    patterns.push(
      `Days with more outdoor time (${avgOutdoorOnHighMood.toFixed(1)}h vs ${avgOutdoor.toFixed(1)}h average) are associated with better mood.`
    );
  }

  // Check weekly patterns
  const entriesByDay = entries.reduce((acc, entry) => {
    const day = new Date(entry.date).getDay();
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {} as Record<number, DiaryEntry[]>);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let bestDay = 0;
  let bestMood = 0;
  Object.entries(entriesByDay).forEach(([day, dayEntries]) => {
    const dayAvg = dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length;
    if (dayAvg > bestMood) {
      bestMood = dayAvg;
      bestDay = parseInt(day);
    }
  });

  if (Object.keys(entriesByDay).length >= 5) {
    patterns.push(`Your best mood day tends to be ${dayNames[bestDay]}.`);
  }

  // Generate insights
  const insights: AIAnalysisResult["insights"] = [];

  if (avgMood >= 4) {
    insights.push({
      title: "Positive Mood Trend",
      description: `Your average mood of ${avgMood.toFixed(1)}/5 indicates you're generally doing well. Keep up your current habits!`,
      type: "positive",
    });
  } else if (avgMood >= 3) {
    insights.push({
      title: "Room for Improvement",
      description: `Your average mood of ${avgMood.toFixed(1)}/5 is okay, but there might be opportunities to feel better.`,
      type: "neutral",
    });
  } else {
    insights.push({
      title: "Attention Needed",
      description: `Your average mood of ${avgMood.toFixed(1)}/5 suggests you might be going through a challenging time. Consider reaching out for support.`,
      type: "improvement",
    });
  }

  if (avgSleep < 7) {
    insights.push({
      title: "Sleep Deficit",
      description: `Your average sleep of ${avgSleep.toFixed(1)} hours is below the recommended 7-8 hours. This could be affecting your mood and energy.`,
      type: "improvement",
    });
  } else {
    insights.push({
      title: "Healthy Sleep Habits",
      description: `Great job maintaining ${avgSleep.toFixed(1)} hours of sleep on average!`,
      type: "positive",
    });
  }

  if (avgOutdoor < 0.5) {
    insights.push({
      title: "Limited Outdoor Time",
      description: `You're averaging only ${(avgOutdoor * 60).toFixed(0)} minutes outside daily. Natural light and fresh air can significantly boost well-being.`,
      type: "improvement",
    });
  }

  if (avgWork > 9) {
    insights.push({
      title: "High Work Hours",
      description: `You're averaging ${avgWork.toFixed(1)} work hours daily. Consider if this is sustainable and if you're taking adequate breaks.`,
      type: "improvement",
    });
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (avgSleep < 7) {
    recommendations.push("Try to add an extra 30-60 minutes to your sleep time by going to bed earlier.");
  }

  if (avgOutdoor < 1) {
    recommendations.push("Take a 15-20 minute walk outside during lunch or after work to boost your mood naturally.");
  }

  if (avgWork > 9) {
    recommendations.push("Set boundaries for your work hours and schedule regular breaks to prevent burnout.");
  }

  if (patterns.length === 0) {
    recommendations.push("Continue logging daily entries to help identify more patterns in your well-being.");
  }

  recommendations.push("Consider tracking what you eat and how it affects your energy levels throughout the day.");

  // Generate summary
  const moodDescriptions = ["very low", "low", "neutral", "good", "great"];
  const moodDesc = moodDescriptions[Math.round(avgMood) - 1] || "neutral";

  const summary = `Based on ${entries.length} diary entries, your overall well-being is ${moodDesc}. ` +
    `You average ${avgSleep.toFixed(1)} hours of sleep, ${avgWork.toFixed(1)} hours of work, ` +
    `and ${avgOutdoor.toFixed(1)} hours of outdoor time daily. ` +
    (patterns.length > 0
      ? `I've identified ${patterns.length} key pattern${patterns.length > 1 ? "s" : ""} that may be affecting your mood.`
      : "Continue logging entries to uncover more patterns.");

  return {
    summary,
    patterns,
    recommendations,
    insights,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { entries } = body;

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

    const analysis = analyzeEntries(entries);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze entries" },
      { status: 500 }
    );
  }
}
