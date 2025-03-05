"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Hide profile icon on Home, Login, and Register pages
  const hideProfileIcon = ["/", "/admin/login", "/admin/register", "/college/login", "/college/register"].includes(pathname);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    window.location.href = "/admin/login"; // Redirect to login page
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md h-20 fixed top-0 left-0 w-full z-50">
      <h1 className="text-3xl font-bold">Education Master</h1>

      {/* ✅ Show Profile Icon ONLY if not on login/register pages */}
      {!hideProfileIcon && (
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2">
            <User className="w-8 h-8 text-white cursor-pointer" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2">
              <button className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left">Profile</button>
              <button onClick={handleLogout} className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 text-left">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
