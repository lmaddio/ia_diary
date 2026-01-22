import { NextRequest, NextResponse } from "next/server";
import { DiaryEntry } from "@/types";

/**
 * Diary API Route
 * 
 * This route handles diary entry CRUD operations.
 * Data is stored in memory on the server.
 * 
 * Note: In-memory storage is lost when the server restarts.
 * For production, replace with a database (PostgreSQL, MongoDB, etc.)
 * 
 * Example with Prisma:
 * 
 * import { auth } from '@clerk/nextjs';
 * import { prisma } from '@/lib/prisma';
 * 
 * export async function POST(request: NextRequest) {
 *   const { userId } = auth();
 *   if (!userId) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 * 
 *   const body = await request.json();
 *   const entry = await prisma.diaryEntry.create({
 *     data: { ...body, userId }
 *   });
 * 
 *   return NextResponse.json(entry);
 * }
 */

// In-memory storage for diary entries
// Maps userId -> DiaryEntry[]
const diaryStorage = new Map<string, DiaryEntry[]>();

// Helper to generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// GET - Fetch all entries for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const entries = diaryStorage.get(userId) || [];
    
    // Sort by date descending
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json({ entries: sortedEntries });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch diary entries" },
      { status: 500 }
    );
  }
}

// POST - Create a new entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...entryData } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    const newEntry: DiaryEntry = {
      id: generateId(),
      userId,
      date: entryData.date,
      mood: entryData.mood,
      sleepHours: entryData.sleepHours,
      workHours: entryData.workHours,
      outdoorHours: entryData.outdoorHours,
      meals: entryData.meals || "",
      activities: entryData.activities || "",
      notes: entryData.notes || "",
      createdAt: now,
      updatedAt: now,
    };
    
    // Get existing entries for user
    const userEntries = diaryStorage.get(userId) || [];
    
    // Remove existing entry for the same date (update case)
    const filteredEntries = userEntries.filter(
      (e) => e.date !== newEntry.date
    );
    
    // Add new entry
    filteredEntries.push(newEntry);
    
    // Save back to storage
    diaryStorage.set(userId, filteredEntries);
    
    return NextResponse.json({
      success: true,
      entry: newEntry,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save diary entry" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, entryId, ...updates } = body;
    
    if (!userId || !entryId) {
      return NextResponse.json(
        { error: "User ID and Entry ID are required" },
        { status: 400 }
      );
    }
    
    const userEntries = diaryStorage.get(userId);
    
    if (!userEntries) {
      return NextResponse.json(
        { error: "No entries found for user" },
        { status: 404 }
      );
    }
    
    const entryIndex = userEntries.findIndex((e) => e.id === entryId);
    
    if (entryIndex === -1) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }
    
    // Update the entry
    const updatedEntry: DiaryEntry = {
      ...userEntries[entryIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    userEntries[entryIndex] = updatedEntry;
    diaryStorage.set(userId, userEntries);
    
    return NextResponse.json({
      success: true,
      entry: updatedEntry,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update diary entry" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an entry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const entryId = searchParams.get("entryId");
    
    if (!userId || !entryId) {
      return NextResponse.json(
        { error: "User ID and Entry ID are required" },
        { status: 400 }
      );
    }
    
    const userEntries = diaryStorage.get(userId);
    
    if (!userEntries) {
      return NextResponse.json(
        { error: "No entries found for user" },
        { status: 404 }
      );
    }
    
    const filteredEntries = userEntries.filter((e) => e.id !== entryId);
    
    if (filteredEntries.length === userEntries.length) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }
    
    diaryStorage.set(userId, filteredEntries);
    
    return NextResponse.json({
      success: true,
      message: "Entry deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete diary entry" },
      { status: 500 }
    );
  }
}
