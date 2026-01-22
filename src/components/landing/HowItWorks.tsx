"use client";

import { content } from "@/content/text";

export default function HowItWorks() {
  const { howItWorks } = content.landing;

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {howItWorks.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < howItWorks.steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300" />
              )}

              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-2xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
