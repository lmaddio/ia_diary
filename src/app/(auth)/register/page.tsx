"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookHeart, Github, Chrome } from "lucide-react";
import { content } from "@/content/text";
import { useAuthStore } from "@/store/useAuthStore";
import { Button, Input } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = content.auth;
  const { signUp, isLoading, error, clearError, isSignedIn, isLoaded } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Clear errors when inputs change
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      clearError();
      setFormError("");
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    if (!agreedToTerms) {
      setFormError("Please agree to the terms and conditions");
      return;
    }

    const success = await signUp({ name, email, password });
    if (success) {
      router.push("/dashboard");
    }
  };

  const displayError = formError || error;

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-purple-100 text-lg mb-8">
            Create your account in seconds and begin tracking your mood, sleep,
            activities, and more. Discover patterns that help you thrive.
          </p>
          <div className="space-y-4">
            {[
              "📊 Visual dashboards to track your progress",
              "🧠 AI-powered insights and recommendations",
              "📝 Free expression through daily journaling",
              "🔒 Your data is private and secure",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {register.title}
          </h1>
          <p className="text-gray-600 mb-8">{register.subtitle}</p>

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {displayError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              label={register.nameLabel}
              placeholder={register.namePlaceholder}
              value={name}
              onChange={handleInputChange(setName)}
              required
              autoComplete="name"
            />

            <Input
              type="email"
              label={register.emailLabel}
              placeholder={register.emailPlaceholder}
              value={email}
              onChange={handleInputChange(setEmail)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label={register.passwordLabel}
              placeholder={register.passwordPlaceholder}
              value={password}
              onChange={handleInputChange(setPassword)}
              required
              autoComplete="new-password"
            />

            <Input
              type="password"
              label={register.confirmPasswordLabel}
              placeholder={register.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={handleInputChange(setConfirmPassword)}
              required
              autoComplete="new-password"
            />

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600">
                {register.termsAgree}{" "}
                <Link href="#" className="text-indigo-600 hover:text-indigo-700">
                  {register.termsLink}
                </Link>{" "}
                {register.andText}{" "}
                <Link href="#" className="text-indigo-600 hover:text-indigo-700">
                  {register.privacyLink}
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {register.submitButton}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or sign up with
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

          {/* Sign In Link */}
          <p className="mt-8 text-center text-gray-600">
            {register.hasAccount}{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {register.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
