"use client";

import {
  Heart,
  Clock,
  Activity,
  Utensils,
  Brain,
  PenLine,
} from "lucide-react";
import { content } from "@/content/text";

const iconMap = {
  heart: Heart,
  clock: Clock,
  activity: Activity,
  utensils: Utensils,
  brain: Brain,
  pen: PenLine,
};

export default function Features() {
  const { features } = content.landing;

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {features.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.items.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Heart;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
