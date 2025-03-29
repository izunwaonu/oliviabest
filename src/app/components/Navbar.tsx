"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");

  return (
    <nav className="fixed w-full mb-4 top-0 left-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2 rounded-full" />
            <span className="text-xl font-bold">Oliviabest Eatery</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-gray-300">Home</Link>

            {/* Debtors Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(dropdownOpen === "debtors" ? "" : "debtors")}
                className="hover:text-gray-300 focus:outline-none"
              >
                Debtors ▼
              </button>
              {dropdownOpen === "debtors" && (
                <div className="absolute mt-2 bg-white text-black rounded-md shadow-lg py-2 w-40">
                  <Link href="/debtors" className="block px-4 py-2 hover:bg-gray-200">Add Debtor</Link>
                </div>
              )}
            </div>

            <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            <Link href="/debtorlist" className="hover:text-gray-300">Transaction History</Link>

            {/* Payment Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(dropdownOpen === "payment" ? "" : "payment")}
                className="hover:text-gray-300 focus:outline-none"
              >
                Payment ▼
              </button>
              {dropdownOpen === "payment" && (
                <div className="absolute mt-2 bg-white text-black rounded-md shadow-lg py-2 w-40">
                  <Link href="/payments" className="block px-4 py-2 hover:bg-gray-200">Add Payment</Link>
                </div>
              )}
            </div>

            {/* Login / Logout */}
            {session ? (
              <button onClick={() => signOut()} className="hover:text-gray-300">
                Logout
              </button>
            ) : (
              <button onClick={() => signIn()} className="hover:text-gray-300">
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white text-black py-2 space-y-2 px-4">
          <Link href="/" className="block" onClick={() => setMenuOpen(false)}>Home</Link>
          
          {/* Debtors Dropdown */}
          <div className="border-t pt-2">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "debtors" ? "" : "debtors")}
              className="w-full text-left"
            >
              Debtors ▼
            </button>
            {dropdownOpen === "debtors" && (
              <div className="pl-4">
                <Link href="/debtors" className="block" onClick={() => setMenuOpen(false)}>Add Debtor</Link>
              </div>
            )}
          </div>

          <Link href="/dashboard" className="block" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link href="/debtorlist" className="block" onClick={() => setMenuOpen(false)}>Transaction History</Link>

          {/* Payment Dropdown */}
          <div className="border-t pt-2">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "payment" ? "" : "payment")}
              className="w-full text-left"
            >
              Payment ▼
            </button>
            {dropdownOpen === "payment" && (
              <div className="pl-4">
                <Link href="/payments" className="block" onClick={() => setMenuOpen(false)}>Add Payment</Link>
              </div>
            )}
          </div>

          {/* Login / Logout */}
          {session ? (
            <button onClick={() => signOut()} className="block w-full text-left">
              Logout
            </button>
          ) : (
            <button onClick={() => signIn()} className="block w-full text-left">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
