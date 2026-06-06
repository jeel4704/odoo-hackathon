import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = (v) => {
    login({
      name: "Admin",
      email: v.email,
      role: "Admin",
    });

    nav("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 to-emerald-600 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold">VendorBridge</h1>
          <p className="mt-4 text-emerald-100 text-lg">
            Streamline procurement, vendor management and approvals.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="/vendor-illustration.png"
            alt="VendorBridge"
            className="max-w-md w-full object-contain"
          />
        </div>

        <p className="text-sm text-emerald-100">
          Modern procurement workflow for growing businesses.
        </p>
      </div>

      {/* Right Login Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to continue to your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
          >
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                to="/auth/forgot"
                className="text-emerald-600 hover:text-emerald-700"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400">
              or continue with
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="border border-gray-300 rounded-xl py-3 hover:bg-gray-50">
              Google
            </button>

            <button className="border border-gray-300 rounded-xl py-3 hover:bg-gray-50">
              Microsoft
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-emerald-600 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}