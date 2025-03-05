"use client"; // ✅ Ensure it's a Client Component

import { usePathname } from "next/navigation";
import LeftSidebar from "../../components/lefnavbar"; // ✅ Corrected Import

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Show Left Sidebar only for Admin Pages (except login)
  const showSidebar = pathname.startsWith("/admin") && pathname !== "/admin/login";

  return (
    <div className="flex">
      {showSidebar && <LeftSidebar />} {/* ✅ Left Sidebar for Admin Pages */}
      <main className={`flex-grow ${showSidebar ? "ml-64" : ""}`}>{children}</main>
    </div>
  );
}
