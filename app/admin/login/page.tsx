"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginFormData = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage("");

    console.log("data: ", data);

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const result = await response.json();

      console.log("Login Result:", result);

      // ✅ Store Token in LocalStorage
      localStorage.setItem("accessToken", result.token);
      localStorage.setItem("userRole", result.role);

      router.push("/admin/dashboard/adminHome"); // ✅ Redirect to Admin Dashboard
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="email" {...register("email", { required: "Email is required" })} placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input type="password" {...register("password", { required: "Password is required" })} placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg" />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button type="submit" className={`w-full p-3 rounded-lg ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
