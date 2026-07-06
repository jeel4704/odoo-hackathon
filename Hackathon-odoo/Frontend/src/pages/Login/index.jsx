import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import api from "../../services/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  // Load remembered email
  const [rememberedEmail] = useState(() => {
    return localStorage.getItem("vendorbridge_remembered_email") || "";
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: rememberedEmail,
      rememberMe: !!rememberedEmail,
    },
  });

  const onSubmit = async (v) => {
    setIsLoading(true);

    // Persist or clear email if Remember Me is checked
    if (v.rememberMe) {
      localStorage.setItem("vendorbridge_remembered_email", v.email);
    } else {
      localStorage.removeItem("vendorbridge_remembered_email");
    }

    try {
      // Attempt backend authentication
      const response = await api.post("/login", {
        email: v.email,
        password: v.password,
      });

      const { user, token } = response.data;

      if (token) {
        localStorage.setItem("vendorbridge_token", token);
      }

      login(user);

      toast.success({
        title: "Authenticated Successfully",
        message: `Welcome back, ${user.name || "User"}!`,
      });

      nav("/");
    } catch (err) {
      // Extract a user-friendly error message
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Invalid email or password."
          : "Unable to login. Please try again.");
      toast.error({
        title: "Login Failed",
        message: errorMsg,
      });
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="glass-card rounded-3xl p-8 border border-white/10 glow-emerald max-w-md w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Enter your credentials to manage your procurement pipeline
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-5 w-5" />
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className={`w-full bg-slate-900/40 border ${
                  errors.email ? "border-red-500 focus:ring-red-500/20" : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                } rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/auth/forgot"
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition duration-150"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-5 w-5" />
              </div>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full bg-slate-900/40 border ${
                  errors.password ? "border-red-500 focus:ring-red-500/20" : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                } rounded-xl pl-11 pr-12 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 font-medium mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer select-none">
              <input
                {...register("rememberMe")}
                type="checkbox"
                className="w-4.5 h-4.5 rounded border-slate-800 bg-slate-900/60 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-slate-950 cursor-pointer transition duration-150"
              />
              Remember email
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verifying credentials...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Registration Footer */}
        <p className="text-center text-sm text-slate-400 mt-8">
          New to vendorBridge?{' '}
          <Link
            to="/auth/register"
            className="text-emerald-400 font-semibold hover:emerald-300 transition duration-150"
          >
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}