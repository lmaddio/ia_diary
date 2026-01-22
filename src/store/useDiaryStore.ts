"use client";

import { create } from "zustand";
import { DiaryEntry, DiaryEntryInput, ChatMessage, DashboardMetrics, AIAnalysisResult } from "@/types";
import { generateId, toISODateString, average } from "@/lib/utils";

interface DiaryStore {
  entries: DiaryEntry[];
  chatMessages: ChatMessage[];
  isLoading: boolean;
  isChatLoading: boolean;
  analysisResult: AIAnalysisResult | null;
  isAnalyzing: boolean;
  currentUserId: string | null;

  // Entry Actions
  loadEntries: (userId: string) => Promise<void>;
  addEntry: (userId: string, entry: DiaryEntryInput) => Promise<DiaryEntry | null>;
  updateEntry: (userId: string, entryId: string, updates: Partial<DiaryEntryInput>) => Promise<void>;
  deleteEntry: (userId: string, entryId: string) => Promise<void>;
  getEntryByDate: (date: string) => DiaryEntry | undefined;

  // Chat Actions
  addChatMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  sendChatMessage: (content: string, userId: string) => Promise<void>;
  clearChat: () => void;

  // Analytics Actions
  getMetrics: (days?: number) => DashboardMetrics;
  analyzePatterns: (userId: string) => Promise<void>;
  clearAnalysis: () => void;
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  entries: [],
  chatMessages: [],
  isLoading: false,
  isChatLoading: false,
  analysisResult: null,
  isAnalyzing: false,
  currentUserId: null,

  loadEntries: async (userId: string) => {
    set({ isLoading: true, currentUserId: userId });
    
    try {
      const response = await fetch(`/api/diary?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      
      if (response.ok) {
        set({ entries: data.entries || [], isLoading: false });
      } else {
        console.error("Failed to load entries:", data.error);
        set({ entries: [], isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load entries:", error);
      set({ entries: [], isLoading: false });
    }
  },

  addEntry: async (userId: string, input: DiaryEntryInput) => {
    try {
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          date: input.date || toISODateString(),
          mood: input.mood,
          sleepHours: input.sleepHours,
          workHours: input.workHours,
          outdoorHours: input.outdoorHours,
          meals: input.meals,
          activities: input.activities,
          notes: input.notes,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.entry) {
        // Update local state
        set((state) => {
          // Remove existing entry for the same date
          const filtered = state.entries.filter((e) => e.date !== data.entry.date);
          const newEntries = [...filtered, data.entry].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          return { entries: newEntries };
        });
        return data.entry;
      }
      
      return null;
    } catch (error) {
      console.error("Failed to add entry:", error);
      return null;
    }
  },

  updateEntry: async (userId: string, entryId: string, updates: Partial<DiaryEntryInput>) => {
    try {
      const response = await fetch("/api/diary", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          entryId,
          ...updates,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.entry) {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === entryId ? data.entry : e
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  },

  deleteEntry: async (userId: string, entryId: string) => {
    try {
      const response = await fetch(
        `/api/diary?userId=${encodeURIComponent(userId)}&entryId=${encodeURIComponent(entryId)}`,
        { method: "DELETE" }
      );
      
      if (response.ok) {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== entryId),
        }));
      }
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  },

  getEntryByDate: (date: string) => {
    return get().entries.find((e) => e.date === date);
  },

  addChatMessage: (message) => {
    const chatMessage: ChatMessage = {
      id: generateId(),
      ...message,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      chatMessages: [...state.chatMessages, chatMessage],
    }));
  },

  sendChatMessage: async (content: string, userId: string) => {
    const { addChatMessage, entries } = get();

    // Add user message
    addChatMessage({ role: "user", content });

    set({ isChatLoading: true });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          entries: entries.slice(0, 30), // Send last 30 entries for context
          userId,
        }),
      });

      const data = await response.json();
      addChatMessage({ role: "assistant", content: data.response });
    } catch {
      addChatMessage({
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
      });
    } finally {
      set({ isChatLoading: false });
    }
  },

  clearChat: () => {
    set({ chatMessages: [] });
  },

  getMetrics: (days = 7) => {
    const { entries } = get();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEntries = entries.filter(
      (e) => new Date(e.date) >= cutoffDate
    );

    // Calculate averages
    const avgMood = average(recentEntries.map((e) => e.mood));
    const avgSleep = average(recentEntries.map((e) => e.sleepHours));
    const avgWork = average(recentEntries.map((e) => e.workHours));
    const avgOutdoor = average(recentEntries.map((e) => e.outdoorHours));

    // Calculate streak
    let streak = 0;
    const sortedDates = entries
      .map((e) => e.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = toISODateString(expectedDate);
      
      if (sortedDates.includes(expectedDateStr)) {
        streak++;
      } else {
        break;
      }
    }

    // Mood trend data
    const moodTrend = recentEntries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({
        date: e.date,
        mood: e.mood,
        sleep: e.sleepHours,
        work: e.workHours,
        outdoor: e.outdoorHours,
      }));

    // Time distribution
    const totalSleep = recentEntries.reduce((sum, e) => sum + e.sleepHours, 0);
    const totalWork = recentEntries.reduce((sum, e) => sum + e.workHours, 0);
    const totalOutdoor = recentEntries.reduce((sum, e) => sum + e.outdoorHours, 0);
    const totalHours = days * 24;
    const other = Math.max(0, totalHours - totalSleep - totalWork - totalOutdoor);

    // Best days
    const byMood = [...recentEntries].sort((a, b) => b.mood - a.mood);
    const byWork = [...recentEntries].sort((a, b) => b.workHours - a.workHours);
    const bySleep = [...recentEntries].sort((a, b) => b.sleepHours - a.sleepHours);

    return {
      avgMood: Math.round(avgMood * 10) / 10,
      avgSleep: Math.round(avgSleep * 10) / 10,
      avgWork: Math.round(avgWork * 10) / 10,
      avgOutdoor: Math.round(avgOutdoor * 10) / 10,
      totalEntries: entries.length,
      currentStreak: streak,
      moodTrend,
      timeDistribution: {
        sleep: totalSleep,
        work: totalWork,
        outdoor: totalOutdoor,
        other,
      },
      bestMoodDay: byMood[0]?.date || "",
      mostProductiveDay: byWork[0]?.date || "",
      mostRestedDay: bySleep[0]?.date || "",
    };
  },

  analyzePatterns: async (userId: string) => {
    const { entries } = get();
    set({ isAnalyzing: true });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: entries.slice(0, 60), // Send last 60 entries
          userId,
        }),
      });

      const data = await response.json();
      set({ analysisResult: data, isAnalyzing: false });
    } catch {
      set({
        isAnalyzing: false,
        analysisResult: {
          summary: "Unable to analyze patterns at this time.",
          patterns: [],
          recommendations: [],
          insights: [],
        },
      });
    }
  },

  clearAnalysis: () => {
    set({ analysisResult: null });
  },
}));
