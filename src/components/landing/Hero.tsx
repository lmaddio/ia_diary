"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { content } from "@/content/text";
import Button from "@/components/ui/Button";

export default function Hero() {
  const { hero } = content.landing;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" />
          <span>{hero.subtitle}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          {hero.title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {hero.title.split(" ").slice(-1)}
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          {hero.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="group">
              {hero.cta.primary}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              {hero.cta.secondary}
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none h-full" />
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-2">😄</div>
                  <div className="text-sm text-gray-500">Mood Today</div>
                  <div className="text-lg font-semibold text-gray-900">Great</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-2">😴</div>
                  <div className="text-sm text-gray-500">Sleep</div>
                  <div className="text-lg font-semibold text-gray-900">7.5 hrs</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-2">🏃</div>
                  <div className="text-sm text-gray-500">Activity</div>
                  <div className="text-lg font-semibold text-gray-900">45 min</div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="h-32 flex items-end justify-around gap-2">
                  {[60, 80, 70, 90, 75, 85, 95].map((height, i) => (
                    <div
                      key={i}
                      className="w-8 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-around mt-2 text-xs text-gray-400">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
