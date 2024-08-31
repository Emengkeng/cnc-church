"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Menu, X, ChevronDown } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", path: "/main/dashboard" },
    { name: "Members", path: "/main/members" },
    { name: "Offering", path: "/main/offering" },
    { name: "Seed", path: "/main/seed" },
    { name: "Tithe", path: "/main/tithe" },
    { name: "Project", path: "/main/project" },
    { name: "Asset", path: "/main/asset" },
    { name: "Activity", path: "/main/activity" },
  ];

  function logout() {
    signOut(auth);
    localStorage.clear();
    router.push("/");
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="bg-black text-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Image
              className="h-8 w-auto"
              src="/images/logo.png"
              alt="Calvary Worship Center"
              width={32}
              height={32}
            />
            <span className="ml-2 font-bold text-gold hidden md:block">
              Concencrated Nation Church
            </span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.path
                      ? "bg-gold text-black"
                      : "text-white hover:bg-gold hover:text-black"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gold text-black hover:bg-white hover:text-black transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gold focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path
                    ? "bg-gold text-black"
                    : "text-white hover:bg-gold hover:text-black"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={logout}
              className="mt-3 block w-full px-4 py-2 rounded-md text-base font-medium bg-gold text-black hover:bg-white hover:text-black transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}