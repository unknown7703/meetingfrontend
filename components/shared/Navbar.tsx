"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { Routes } from "@/constants/Routes";
import { Menu, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Prevent hydration mismatch by setting mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between py-4 px-8 shadow-sm bg-background border-b">
      <h1 className="text-xl font-bold">Meet</h1>

      <nav className="hidden text-lg md:flex gap-4">
        <Button asChild variant="ghost">
          <Link href={Routes.home}>Home</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={Routes.meet}>Meet</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={Routes.summary}>Summary</Link>
        </Button>
        {!isAuthenticated && (
          <Button asChild variant="ghost">
            <Link href={Routes.signup}>Signup</Link>
          </Button>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button - Prevent SSR mismatch */}
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-800">
              {session.user.email}
            </span>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button asChild variant="ghost">
            <Link href={Routes.login}>Login</Link>
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-16 right-4 bg-background border shadow-md p-4 rounded-md flex flex-col gap-2 md:hidden">
          <Button asChild onClick={() => setIsOpen(false)}>
            <Link href={Routes.home}>Home</Link>
          </Button>
          <Button asChild onClick={() => setIsOpen(false)}>
            <Link href={Routes.meet}>Meet</Link>
          </Button>
          <Button asChild onClick={() => setIsOpen(false)}>
            <Link href={Routes.summary}>Summary</Link>
          </Button>
          {!isAuthenticated && (
            <Button asChild onClick={() => setIsOpen(false)}>
              <Link href={Routes.signup}>Signup</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
