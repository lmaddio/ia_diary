"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookHeart, Github, Chrome } from "lucide-react";
import { content } from "@/content/text";
import { useAuthStore } from "@/store/useAuthStore";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { login } = content.auth;
  const { signIn, isLoading, error, clearError, isSignedIn, isLoaded } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    clearError();
  }, [email, password, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn({ email, password });
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <BookHeart className="h-10 w-10 text-indigo-600" />
            <span className="font-bold text-2xl text-gray-900">
              {content.nav.brand}
            </span>
          </Link>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{login.title}</h1>
          <p className="text-gray-600 mb-8">{login.subtitle}</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label={login.emailLabel}
              placeholder={login.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label={login.passwordLabel}
              placeholder={login.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">{login.rememberMe}</span>
              </label>
              <Link
                href="#"
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {login.forgotPassword}
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              {login.submitButton}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                {login.orContinueWith}
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled>
              <Chrome className="h-5 w-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" type="button" disabled>
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600">
            {login.noAccount}{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {login.signUpLink}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">
            Track Your Journey to Better Well-being
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Log your daily mood, activities, and thoughts. Let AI help you discover patterns
            and insights for a healthier, happier life.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {["😊", "😴", "💪", "🌿"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-indigo-100 text-sm">
              Join 10,000+ users tracking their wellness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
