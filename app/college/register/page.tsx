"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type RegisterFormData = {
  email: string;
  password: string;
  institutionName: string;
  affiliatedUniversity: string;
  deemedUniversity: string;
  recognitionStatus: string;
  institutionCode?: string; // Optional field
  council: string;
  issuingCode: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: RegisterFormData) => {
    setLoading(true);
    console.log("Registering user:", data);
    setTimeout(() => {
      setLoading(false);
      router.push("/college/login");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-extrabold pt-32">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Institution <span className="text-indigo-600">Register</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Institution Name */}
          <div>
            <label className="block font-medium">Institution Name</label>
            <input
              type="text"
              {...register("institutionName", { required: "Institution Name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.institutionName && (
              <p className="text-red-500 text-sm">{errors.institutionName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: 6 })}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Affiliated University */}
          <div>
            <label className="block font-medium">Affiliated University</label>
            <input
              type="text"
              {...register("affiliatedUniversity", { required: "Affiliated University is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.affiliatedUniversity && (
              <p className="text-red-500 text-sm">{errors.affiliatedUniversity.message}</p>
            )}
          </div>

          {/* Deemed University */}
          <div>
            <label className="block font-medium">Deemed University</label>
            <input
              type="text"
              {...register("deemedUniversity", { required: "Deemed University is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.deemedUniversity && (
              <p className="text-red-500 text-sm">{errors.deemedUniversity.message}</p>
            )}
          </div>

          {/* Recognition Status */}
          <div>
            <label className="block font-medium">Recognition Status</label>
            <input
              type="text"
              {...register("recognitionStatus", { required: "Recognition Status is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.recognitionStatus && (
              <p className="text-red-500 text-sm">{errors.recognitionStatus.message}</p>
            )}
          </div>

          {/* Institution Code (Optional) */}
          <div>
            <label className="block font-medium">Institution Code (Optional)</label>
            <input type="text" {...register("institutionCode")} className="w-full p-2 border rounded" />
          </div>

          {/* Council */}
          <div>
            <label className="block font-medium">Council</label>
            <input
              type="text"
              {...register("council", { required: "Council is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.council && <p className="text-red-500 text-sm">{errors.council.message}</p>}
          </div>

          {/* Issuing Code */}
          <div>
            <label className="block font-medium">Issuing Code</label>
            <input
              type="text"
              {...register("issuingCode", { required: "Issuing Code is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.issuingCode && (
              <p className="text-red-500 text-sm">{errors.issuingCode.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
