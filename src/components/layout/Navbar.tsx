"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookHeart } from "lucide-react";
import { content } from "@/content/text";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, user, signOut } = useAuthStore();

  const publicLinks = [
    { href: "/#features", label: content.nav.features },
    { href: "/#how-it-works", label: "How It Works" },
  ];

  const privateLinks = [
    { href: "/dashboard", label: content.nav.dashboard },
    { href: "/diary", label: content.nav.diary },
  ];

  const links = isSignedIn ? privateLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookHeart className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              {content.nav.brand}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {isSignedIn && <ThemeToggle />}
            {isSignedIn ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {content.dashboard.greeting}, {user?.name?.split(" ")[0]}
                </span>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  {content.nav.logout}
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {content.nav.login}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{content.nav.register}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-2 text-base font-medium",
                  pathname === link.href
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-600 dark:text-gray-300"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              {isSignedIn && <ThemeToggle showLabel className="w-full justify-center" />}
              {isSignedIn ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  {content.nav.logout}
                </Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      {content.nav.login}
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">{content.nav.register}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
