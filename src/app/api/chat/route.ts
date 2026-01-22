import { NextRequest, NextResponse } from "next/server";
import { DiaryEntry } from "@/types";

/**
 * Chat API Route
 * 
 * This route handles chat messages and generates AI responses.
 * Currently mocked - replace with actual LLM integration (OpenAI, Anthropic, etc.)
 * 
 * To integrate with OpenAI:
 * 1. npm install openai
 * 2. Set OPENAI_API_KEY in environment
 * 3. Replace the mock response with actual API call:
 * 
 * import OpenAI from 'openai';
 * const openai = new OpenAI();
 * 
 * const completion = await openai.chat.completions.create({
 *   model: "gpt-4",
 *   messages: [
 *     { role: "system", content: systemPrompt },
 *     ...conversationHistory
 *   ],
 * });
 */

interface ChatRequest {
  message: string;
  entries: DiaryEntry[];
  userId: string;
}

function generateMockResponse(message: string, entries: DiaryEntry[]): string {
  const lowerMessage = message.toLowerCase();

  // Calculate some stats from entries for context
  const avgMood = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
    : 0;
  const avgSleep = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.sleepHours, 0) / entries.length
    : 0;
  const avgWork = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.workHours, 0) / entries.length
    : 0;

  // Generate contextual responses based on the message
  if (lowerMessage.includes("mood") && lowerMessage.includes("week")) {
    if (entries.length === 0) {
      return "I don't have enough data yet to analyze your weekly mood. Start logging your daily entries and I'll be able to provide insights!";
    }
    const moodDescriptions = ["very low", "low", "neutral", "good", "great"];
    const avgMoodDesc = moodDescriptions[Math.round(avgMood) - 1] || "neutral";
    return `Based on your recent entries, your average mood has been ${avgMoodDesc} (${avgMood.toFixed(1)}/5). ${
      avgMood >= 4
        ? "That's wonderful! Keep up whatever you're doing."
        : avgMood >= 3
        ? "That's okay, but there might be room for improvement. Would you like some suggestions?"
        : "I notice your mood has been on the lower side. Let's explore what might be affecting you."
    }`;
  }

  if (lowerMessage.includes("sleep")) {
    if (entries.length === 0) {
      return "I don't have sleep data yet. Log your daily entries and I can help analyze your sleep patterns!";
    }
    return `You've been averaging ${avgSleep.toFixed(1)} hours of sleep. ${
      avgSleep >= 7
        ? "That's a healthy amount! Good sleep is crucial for mood and productivity."
        : avgSleep >= 5
        ? "You might want to aim for 7-8 hours. Sleep deprivation can significantly affect mood and cognitive function."
        : "Your sleep seems quite low. This could be impacting your mood and energy. Consider prioritizing better sleep hygiene."
    }`;
  }

  if (lowerMessage.includes("work") && lowerMessage.includes("balance")) {
    if (entries.length === 0) {
      return "Start logging your work hours and I can help you analyze your work-life balance!";
    }
    const avgOutdoor = entries.reduce((sum, e) => sum + e.outdoorHours, 0) / entries.length;
    return `You're working an average of ${avgWork.toFixed(1)} hours and spending ${avgOutdoor.toFixed(1)} hours outside daily. ${
      avgWork > 9
        ? "That's quite a lot of work! Make sure to take breaks and maintain boundaries."
        : avgWork >= 7
        ? "That's a standard workload. Just ensure you're taking time for yourself."
        : "Your work hours seem reasonable. Make sure you're productive during that time."
    } ${
      avgOutdoor < 1
        ? "I notice you're not spending much time outside. Even 30 minutes of outdoor time can boost mood significantly!"
        : "Good job getting some outdoor time!"
    }`;
  }

  if (lowerMessage.includes("pattern") || lowerMessage.includes("analyze")) {
    if (entries.length < 5) {
      return "I'll need at least 5 diary entries to identify meaningful patterns. Keep logging your daily experiences!";
    }
    return `Looking at your ${entries.length} entries, I can see some patterns emerging:\n\n` +
      `• Your mood tends to be higher on days when you sleep more than ${avgSleep.toFixed(0)} hours\n` +
      `• Working less than ${avgWork.toFixed(0)} hours seems associated with better mood\n` +
      `• Outdoor time appears to positively influence your overall well-being\n\n` +
      `Would you like me to elaborate on any of these patterns?`;
  }

  if (lowerMessage.includes("tip") || lowerMessage.includes("suggest") || lowerMessage.includes("advice")) {
    const tips = [
      "Try to maintain a consistent sleep schedule - going to bed and waking up at the same time helps regulate your mood.",
      "Even a short 15-minute walk outside can significantly boost your mood and energy levels.",
      "Consider taking short breaks every 90 minutes during work to maintain focus and reduce stress.",
      "Journaling about what you're grateful for each day can help shift your perspective positively.",
      "Stay hydrated! Dehydration can affect mood and cognitive function more than we realize.",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    return `Here's a wellness tip for you:\n\n${randomTip}\n\nWould you like more personalized advice based on your diary entries?`;
  }

  // Default response
  return `Thanks for sharing! Based on your diary data, I can see you've logged ${entries.length} entries so far. ${
    entries.length > 0
      ? `Your average mood is ${avgMood.toFixed(1)}/5 and you're sleeping about ${avgSleep.toFixed(1)} hours.`
      : "Start logging your daily entries and I'll be able to provide personalized insights!"
  }\n\nYou can ask me things like:\n• "How has my mood been this week?"\n• "What affects my sleep quality?"\n• "Give me tips to improve my work-life balance"`;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, entries } = body;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateMockResponse(message, entries);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
