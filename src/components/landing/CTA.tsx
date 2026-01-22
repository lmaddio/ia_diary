"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { content } from "@/content/text";
import Button from "@/components/ui/Button";

export default function CTA() {
  const { cta } = content.landing;

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {cta.title}
        </h2>
        <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
          {cta.description}
        </p>
        <Link href="/register">
          <Button
            size="lg"
            className="bg-white text-indigo-600 hover:bg-gray-100 group"
          >
            {cta.button}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
