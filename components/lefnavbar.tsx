"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { name: "Dashboard", path: "/admin/dashboard/adminHome" },
  { name: "College Onboarding", path: "/admin/dashboard/collegeOnboarding" },
  { name: "Subscription Status", path: "/admin/dashboard/subscriptionStatus" },
  { name: "Reports", path: "/admin/dashboard/report" },
];

export default function LeftSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-20 flex flex-col">
      <div className="p-4 text-xl font-bold border-b border-gray-700">Admin Panel</div>
      <nav className="flex flex-col mt-4">
        {adminLinks.map((link) => (
          <Link key={link.path} href={link.path}>
            <div
              className={`p-3 hover:bg-gray-700 cursor-pointer ${
                pathname === link.path ? "bg-gray-700" : ""
              }`}
            >
              {link.name}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
