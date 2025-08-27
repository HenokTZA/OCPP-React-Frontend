import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { BsApple, BsFacebook, BsGoogle } from "react-icons/bs";
import {
  FiMail,
  FiLock,
  FiEyeOff,
  FiEye,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiUser,
} from "react-icons/fi";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);
    setMessage(null);

    try {
      const role = await login(form);
      if (role === "super_admin") navigate("/");
      else navigate("/app");
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Invalid username or password",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`flex items-center justify-center min-h-screen p-4 ${
        isDark
          ? "bg-gradient-to-br from-[#0A0A0A] to-[#152602]"
          : "bg-gradient-to-br from-[#F4FFAB] to-[#e2e8f0]"
      }`}
    >
      <ThemeToggle />
      <div
        className={`w-full max-w-md h-auto sm:rounded-3xl sm:py-24 sm:px-8 
                 sm:backdrop-blur-lg sm:border ${
                   isDark
                     ? "sm:border-white/10 sm:bg-white/5"
                     : "sm:border-black/10 sm:bg-black/5"
                 }`}
      >
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center">
            <img
              className="w-24 h-24 object-contain"
              src={logo}
              alt="Alt Logo"
            />
          </div>
          <h1
            className={`text-4xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Sign In
          </h1>
          <p
            className={`text-md ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Please sign in your account to get started!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error */}
          {message && (
            <div
              className={`ml-2 mb-4 flex items-center gap-2 text-sm font-medium ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {message.type === "success" ? (
                isDark ? (
                  <FiCheckCircle className="text-green-400 w-5 h-5" />
                ) : (
                  <FiCheckCircle className="text-green-600 w-5 h-5" />
                )
              ) : isDark ? (
                <FiXCircle className="text-red-400 w-5 h-5" />
              ) : (
                <FiXCircle className="text-red-600 w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <FiUser
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              type="text"
              placeholder="Username"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark
                  ? "bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]"
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm"
              }`}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark
                  ? "bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]"
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm"
              }`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              disabled={isLoading}
            />
            <div
              onClick={() => !isLoading && setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <FiEyeOff
                  className={`absolute top-[18px] right-4 cursor-pointer ${
                    isLoading ? "text-gray-500" : "text-[#777777]"
                  }`}
                  size={20}
                />
              ) : (
                <FiEye
                  className={`absolute top-[18px] right-4 cursor-pointer ${
                    isLoading ? "text-gray-500" : "text-[#777777]"
                  }`}
                  size={20}
                />
              )}
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label
              className={`flex items-center gap-2 ${
                isDark ? "text-[#989E92]" : "text-gray-600"
              }`}
            >
              <input
                type="checkbox"
                id="remember_me"
                className={`peer appearance-none w-4 h-4 rounded cursor-pointer ${
                  isDark
                    ? "bg-[#0A0A0A] checked:bg-[#213A04] checked:border-[#474747] text-white border border-[#484848]"
                    : "bg-white checked:bg-[#539C06] checked:border-[#539C06] text-white border border-gray-300"
                }`}
                disabled={isLoading}
              />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className={`hover:underline ${
                isLoading ? "pointer-events-none opacity-50" : ""
              } ${isDark ? "text-[#ACED2E]" : "text-[#539C06]"}`}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In button with loading state */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-4 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            } ${
              isDark
                ? "bg-gradient-to-r from-[#539C06] to-[#D7EB57] text-black"
                : "bg-gradient-to-r from-[#539C06] to-[#D7EB57] text-white"
            }`}
          >
            {isLoading ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-3 py-4">
          <div
            className={`flex-grow h-px ${
              isDark
                ? "bg-gradient-to-r from-[#152305] to-[#549D07]"
                : "bg-gradient-to-r from-gray-300 to-gray-400"
            }`}
          />
          <span
            className={`text-sm ${isDark ? "text-[#38531D]" : "text-gray-500"}`}
          >
            OR
          </span>
          <div
            className={`flex-grow h-px ${
              isDark
                ? "bg-gradient-to-l from-[#152305] to-[#549D07]"
                : "bg-gradient-to-l from-gray-300 to-gray-400"
            }`}
          />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-6">
          <button
            className={`rounded-full p-4 border transition ${
              isDark
                ? "border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03]"
                : "border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
            }`}
            disabled={isLoading}
          >
            <BsFacebook
              size={22}
              className={isDark ? "text-white" : "text-gray-700"}
            />
          </button>
          <button
            className={`rounded-full p-4 border transition ${
              isDark
                ? "border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03]"
                : "border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
            }`}
            disabled={isLoading}
          >
            <BsGoogle
              size={22}
              className={isDark ? "text-white" : "text-gray-700"}
            />
          </button>
          <button
            className={`rounded-full p-4 border transition ${
              isDark
                ? "border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03]"
                : "border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
            }`}
            disabled={isLoading}
          >
            <BsApple
              size={22}
              className={isDark ? "text-white" : "text-gray-700"}
            />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm">
          <p className={isDark ? "text-[#989E92]" : "text-gray-600"}>
            Don't have an account?
          </p>
          <Link
            to="/signup"
            className={`hover:underline ${
              isLoading ? "pointer-events-none opacity-50" : ""
            } ${isDark ? "text-[#ACED2E]" : "text-[#539C06]"}`}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
