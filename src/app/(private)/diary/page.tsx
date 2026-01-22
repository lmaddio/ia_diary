"use client";

import { useState } from "react";
import { PenLine, MessageCircle, History, Trash2 } from "lucide-react";
import { content } from "@/content/text";
import { useAuthStore } from "@/store/useAuthStore";
import { useDiaryStore } from "@/store/useDiaryStore";
import { DiaryEntryInput } from "@/types";
import { formatDate, getMoodEmoji, toISODateString } from "@/lib/utils";
import { DiaryForm, ChatInterface } from "@/components/chat";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

type Tab = "entry" | "chat" | "history";

export default function DiaryPage() {
  const { diary } = content;
  const { user } = useAuthStore();
  const {
    entries,
    addEntry,
    deleteEntry,
    chatMessages,
    sendChatMessage,
    clearChat,
    isChatLoading,
    getEntryByDate,
  } = useDiaryStore();

  const [activeTab, setActiveTab] = useState<Tab>("entry");
  const [selectedDate, setSelectedDate] = useState(toISODateString());

  const todayEntry = getEntryByDate(selectedDate);

  const handleSubmitEntry = async (entry: DiaryEntryInput) => {
    if (user) {
      await addEntry(user.id, { ...entry, date: selectedDate });
    }
  };

  const handleSendMessage = (message: string) => {
    if (user) {
      sendChatMessage(message, user.id);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (user && confirm(diary.history.confirmDelete)) {
      await deleteEntry(user.id, entryId);
    }
  };

  const tabs = [
    { id: "entry" as Tab, label: "New Entry", icon: PenLine },
    { id: "chat" as Tab, label: "Chat", icon: MessageCircle },
    { id: "history" as Tab, label: "History", icon: History },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{diary.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{diary.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {activeTab === "entry" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <DiaryForm
                onSubmit={handleSubmitEntry}
                initialData={todayEntry ? {
                  mood: todayEntry.mood,
                  sleepHours: todayEntry.sleepHours,
                  workHours: todayEntry.workHours,
                  outdoorHours: todayEntry.outdoorHours,
                  meals: todayEntry.meals,
                  activities: todayEntry.activities,
                  notes: todayEntry.notes,
                  date: selectedDate,
                } : { date: selectedDate }}
              />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="h-[600px]">
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onClearChat={clearChat}
                isLoading={isChatLoading}
              />
            </div>
          )}

          {activeTab === "history" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {diary.history.title}
              </h3>
              {entries.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No entries yet. Start logging your day!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formatDate(entry.date)}
                            </p>
                            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>😴 {entry.sleepHours}h</span>
                              <span>💼 {entry.workHours}h</span>
                              <span>🌳 {entry.outdoorHours}h</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDate(entry.date);
                              setActiveTab("entry");
                            }}
                          >
                            {diary.history.edit}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {(entry.notes || entry.activities) && (
                        <div className="mt-3 pl-12">
                          {entry.activities && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Activities:</span>{" "}
                              {entry.activities}
                            </p>
                          )}
                          {entry.notes && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              <span className="font-medium">Notes:</span>{" "}
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Entries</span>
                <span className="font-semibold text-gray-900 dark:text-white">{entries.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">This Week</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {entries.filter((e) => {
                    const entryDate = new Date(e.date);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return entryDate >= weekAgo;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Avg Mood</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {entries.length > 0
                    ? getMoodEmoji(Math.round(
                        entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
                      ))
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Moods */}
          {entries.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Moods
              </h3>
              <div className="flex justify-between">
                {entries.slice(0, 7).map((entry) => (
                  <div key={entry.id} className="text-center">
                    <div className="text-2xl mb-1">{getMoodEmoji(entry.mood)}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl border border-indigo-100 dark:border-indigo-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              💡 Tip of the Day
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Taking just 5 minutes to log your day can help you identify
              patterns and improve your well-being over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
