"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = ({children} : {
    children: React.ReactNode;
}) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== "SUPER_ADMIN") {
      router.push("/admin/login"); // ✅ Redirects to login if no token or wrong role
    }
  }, []);

  return <>
  
{children}  </>
};

export default AdminDashboard;
