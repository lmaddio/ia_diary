/**
 * Core type definitions for the diary application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string; // ISO date string
  mood: 1 | 2 | 3 | 4 | 5;
  sleepHours: number;
  workHours: number;
  outdoorHours: number;
  meals: string;
  activities: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryEntryInput {
  date?: string;
  mood: 1 | 2 | 3 | 4 | 5;
  sleepHours: number;
  workHours: number;
  outdoorHours: number;
  meals: string;
  activities: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DashboardMetrics {
  avgMood: number;
  avgSleep: number;
  avgWork: number;
  avgOutdoor: number;
  totalEntries: number;
  currentStreak: number;
  moodTrend: MoodTrendData[];
  timeDistribution: TimeDistributionData;
  bestMoodDay: string;
  mostProductiveDay: string;
  mostRestedDay: string;
}

export interface MoodTrendData {
  date: string;
  mood: number;
  sleep: number;
  work: number;
  outdoor: number;
}

export interface TimeDistributionData {
  sleep: number;
  work: number;
  outdoor: number;
  other: number;
}

export interface AIAnalysisResult {
  summary: string;
  patterns: string[];
  recommendations: string[];
  insights: {
    title: string;
    description: string;
    type: "positive" | "neutral" | "improvement";
  }[];
}

// Auth types for Clerk mock
export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: User | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}
