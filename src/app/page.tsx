"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next/client";
import api from "@/lib/axiosInterceptor";
const isProduction = process.env.NODE_ENV === "production";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const resData = await res.data;
      console.log(resData);
      // Access token (short-lived)
      setCookie("accessToken", resData.accessToken, {
        maxAge: 60 * 60 * 5,
        sameSite: "lax",
        secure: isProduction, // true in prod, false in dev
        httpOnly: false, // client-side JS needs access
      });

      // Refresh token (long-lived)
      setCookie("refreshToken", resData.refreshToken, {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: isProduction,
        httpOnly: false, // cannot be accessed by JS
      });

      // Middleware will redirect based on role
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-slate-800">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-slate-500 mt-1">
          Login to continue
        </p>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          ADMIN → /admin &nbsp; | &nbsp; VENDOR → /vendor
        </div>
      </div>
    </div>
  );
}
