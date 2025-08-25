import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { BsApple, BsFacebook, BsGoogle } from "react-icons/bs";
import { FiMail, FiLock, FiEyeOff, FiEye } from "react-icons/fi";
import logo from "@/assets/logo.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const role = await login(form);
      if (role === "super_admin") navigate("/");
      else navigate("/app");
    } catch (err) {
      setError(err?.message || "Invalid username or password");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#152602] p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center">
            <img
              className="w-24 h-24 object-contain"
              src={logo}
              alt="Alt Logo"
            />
          </div>
          <h1 className="text-4xl font-semibold text-white">Sign In</h1>
          <p className="text-gray-400 text-md">
            Please sign in your account to get started!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <FiMail
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              type="text"
              placeholder="Email address"
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
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
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <div onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? (
                <FiEyeOff
                  className="absolute top-[18px] right-4 text-[#777777] cursor-pointer"
                  size={20}
                />
              ) : (
                <FiEye
                  className="absolute top-[18px] right-4 text-[#777777] cursor-pointer"
                  size={20}
                />
              )}
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#989E92]">
              <input
                type="checkbox"
                id="remember_me"
                className="peer appearance-none w-4 h-4 rounded bg-[#0A0A0A] checked:bg-[#213A04] checked:border-[#474747] text-white border border-[#484848] cursor-pointer"
              />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              className="text-[#ACED2E] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Sign In button */}
          <button
            type="submit"
            className="w-full py-4 px-4 bg-gradient-to-r from-[#539C06] to-[#D7EB57] hover:opacity-90 text-black rounded-full font-semibold transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-3 py-4">
          <div className="flex-grow h-px bg-gradient-to-r from-[#152305] to-[#549D07]" />
          <span className="text-[#38531D] text-sm">OR</span>
          <div className="flex-grow h-px bg-gradient-to-l from-[#152305] to-[#549D07]" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-6">
          <button className="rounded-full p-4 border border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03] transition">
            <BsFacebook size={22} className="text-white" />
          </button>
          <button className="rounded-full p-4 border border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03] transition">
            <BsGoogle size={22} className="text-white" />
          </button>
          <button className="rounded-full p-4 border border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03] transition">
            <BsApple size={22} className="text-white" />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p className="text-[#989E92]">Don’t have an account?</p>
          <Link to="/signup" className="text-[#D7EB57] hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
