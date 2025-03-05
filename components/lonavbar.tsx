"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    router.push("/admin/login");
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg">
        Logout
      </button>
    </nav>
  );
}
