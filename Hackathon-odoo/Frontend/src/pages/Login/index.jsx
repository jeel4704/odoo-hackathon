import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, X } from "lucide-react";
import api from "../../services/api";

export default function Login() {
  const [showMockChooser, setShowMockChooser] = useState(false);
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
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Invalid email or password."
          : "Unable to login. Please try again.");
      toast.error({
        title: "Login Failed",
        message: errorMsg,
      });
      // Log the error for debugging purposes
      console.error("Login error:", err);
      // Do not navigate; user can correct credentials
    }
    finally {
      setIsLoading(false);
    }
  };

  const executeGoogleLogin = async (googleToken) => {
    setIsLoading(true);
    setShowMockChooser(false);

    try {
      const res = await api.post("/auth/google-login", {
        access_token: googleToken
      });

      const { user, token } = res.data;

      if (token) {
        localStorage.setItem("vendorbridge_token", token);
      }

      login(user);
      toast.push({
        title: "Google Authentication",
        message: `Connected successfully as ${user.name}!`
      });
      nav("/");
    } catch (apiErr) {
      if (googleToken && googleToken.includes("mock_token_")) {
        console.warn("Backend auth failed, falling back to simulated Google credentials...", apiErr);
        
        await new Promise((resolve) => setTimeout(resolve, 800));

        const email = googleToken.replace("mock_token_", "");
        
        const mockGoogleUser = {
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          email: email,
          role: "Procurement"
        };

        login(mockGoogleUser);
        toast.push({
          title: "Demo Google Authentication",
          message: `Connected in offline sandbox mode. Welcome ${mockGoogleUser.name}!`
        });
        nav("/");
      } else {
        console.error("Real Google authentication failed:", apiErr);
        const errorMsg = apiErr.response?.data || "Unable to verify Google credentials with the backend server.";
        toast.push({
          title: "Google Authentication Failed",
          message: errorMsg
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Check if client ID is missing or placeholder
    if (!clientId || clientId === "your-google-client-id-here.apps.googleusercontent.com" || clientId === "PROVIDE_YOUR_CLIENT_ID_IN_FRONTEND_ENV") {
      // Open the custom simulated Google Account Chooser
      setShowMockChooser(true);
      return;
    }

    if (!window.google) {
      toast.push({
        title: "Google Auth Loading",
        message: "Google OAuth client is still loading. Please try again in a few seconds."
      });
      return;
    }

    setIsLoading(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        prompt: "select_account", // Forces showing all logged-in accounts on the device
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setIsLoading(false);
            toast.push({
              title: "Google Auth Cancelled",
              message: tokenResponse.error_description || "Authentication was cancelled."
            });
            return;
          }
          await executeGoogleLogin(tokenResponse.access_token);
        }
      });

      client.requestAccessToken();
    } catch (err) {
      setIsLoading(false);
      toast.push({
        title: "Google Error",
        message: "Failed to initialize Google sign-in client."
      });
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
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
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

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate-800/80"></div>
          <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            or login with
          </span>
          <div className="flex-1 border-t border-slate-800/80"></div>
        </div>

        {/* Social Providers */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 rounded-xl py-3 text-slate-300 font-semibold transition duration-150 hover:text-white hover:border-slate-700 active:scale-[0.98] w-full"
          >
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745 1.055 15.006 0 12 0 7.354 0 3.307 2.68 1.347 6.578l3.919 3.187Z"
              />
              <path
                fill="#FBBC05"
                d="M1.347 6.578A11.901 11.901 0 0 0 0 12c0 1.95.465 3.79 1.288 5.425l4.03-3.137A7.042 7.042 0 0 1 4.909 12c0-1.026.22-1.999.613-2.88L1.347 6.578Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.245 0 5.973-1.078 7.964-2.924l-3.86-3.003c-1.127.755-2.564 1.205-4.104 1.205-3.155 0-5.83-2.13-6.78-4.996l-4.004 3.12A11.984 11.984 0 0 0 12 24Z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.825-.074-1.62-.21-2.385H12v4.51h6.44c-.277 1.463-1.1 2.706-2.34 3.535l3.86 3.003c2.257-2.08 3.53-5.145 3.53-8.663Z"
              />
            </svg>
            Google Account
          </button>
        </div>

        {/* Registration Footer */}
        <p className="text-center text-sm text-slate-400 mt-8">
          New to vendorBridge?{" "}
          <Link
            to="/auth/register"
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition duration-150"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* Google Mock Account Chooser Modal Overlay */}
      {showMockChooser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl animate-text-fade text-slate-100">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowMockChooser(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Icon logo */}
            <div className="flex justify-center mb-4 mt-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745 1.055 15.006 0 12 0 7.354 0 3.307 2.68 1.347 6.578l3.919 3.187Z" />
                <path fill="#FBBC05" d="M1.347 6.578A11.901 11.901 0 0 0 0 12c0 1.95.465 3.79 1.288 5.425l4.03-3.137A7.042 7.042 0 0 1 4.909 12c0-1.026.22-1.999.613-2.88L1.347 6.578Z" />
                <path fill="#34A853" d="M12 24c3.245 0 5.973-1.078 7.964-2.924l-3.86-3.003c-1.127.755-2.564 1.205-4.104 1.205-3.155 0-5.83-2.13-6.78-4.996l-4.004 3.12A11.984 11.984 0 0 0 12 24Z" />
                <path fill="#4285F4" d="M23.49 12.275c0-.825-.074-1.62-.21-2.385H12v4.51h6.44c-.277 1.463-1.1 2.706-2.34 3.535l3.86 3.003c2.257-2.08 3.53-5.145 3.53-8.663Z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold mb-1">Choose an account</h3>
            <p className="text-xs text-slate-400 mb-6">to continue to <span className="text-emerald-400 font-semibold">vendorBridge</span></p>

            <div className="space-y-2.5 text-left">
              {/* Account list */}
              {[
                { name: "Jeel Patel", email: "jeelpatel472004@gmail.com", avatarBg: "bg-emerald-600" },
                { name: "Jeel SMTP", email: "jeel3749@gmail.com", avatarBg: "bg-blue-600" },
                { name: "Demo Guest", email: "demo@vendorbridge.com", avatarBg: "bg-amber-600" }
              ].map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => executeGoogleLogin(`mock_token_${acc.email}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 hover:border-slate-700 transition duration-150 active:scale-[0.99]"
                >
                  <div className={`w-8 h-8 rounded-full ${acc.avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
                    {acc.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate">{acc.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{acc.email}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500">
              To use real Google SSO authentication, set <code className="text-emerald-400/90 font-mono">VITE_GOOGLE_CLIENT_ID</code> in your <code className="font-mono">Frontend/.env</code> file.
            </div>
          </div>
        </div>
      )}
    </>
  );
}