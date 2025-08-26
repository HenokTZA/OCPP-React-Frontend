import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import {
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
  FiUserCheck,
  FiLoader,
} from "react-icons/fi";
import { BsApple, BsFacebook, BsGoogle } from "react-icons/bs";

export default function Signup() {
  const { signup } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    password2: "",
    role: "user", // <-- default to normal user; backend expects "user" or "super_admin"
  });

  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    setError("");

    // simple client-side checks
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if ((form.password || "").length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    // prepare payload (trim some fields)
    const payload = {
      ...form,
      username: form.username.trim(),
      email: form.email.trim(),
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
    };

    try {
      await signup(payload); // make sure signup() forwards all fields to /api/auth/signup/
      navigate("/login");
    } catch (e) {
      // show server message if available
      setError(e?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0A0A0A] to-[#152602]' 
        : 'bg-gradient-to-br from-[#F4FFAB] to-[#e2e8f0]'
    }`}>
      <ThemeToggle />
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
          <h1 className={`text-4xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Sign Up</h1>
          <p className={`text-md ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Please create an account to use out platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiUser
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name="full_name"
              type="text"
              placeholder="Full name"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark 
                  ? 'bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]' 
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
              }`}
              value={form.full_name}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <FiPhone
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark 
                  ? 'bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]' 
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
              }`}
              value={form.phone}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <FiUserCheck
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name="username"
              type="text"
              placeholder="Username"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark 
                  ? 'bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]' 
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
              }`}
              value={form.username}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <FiMail
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name="email"
              type="text"
              placeholder="Email"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark 
                  ? 'bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]' 
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
              }`}
              value={form.email}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <FiLock
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark 
                  ? 'bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]' 
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
              }`}
              value={form.password}
              onChange={onChange}
              required
              minLength={8}
              disabled={isLoading}
            />
            <div onClick={() => !isLoading && setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? (
                <FiEyeOff
                  className={`absolute top-[18px] right-4 cursor-pointer ${
                    isLoading ? 'text-gray-500' : 'text-[#777777]'
                  }`}
                  size={20}
                />
              ) : (
                <FiEye
                  className={`absolute top-[18px] right-4 cursor-pointer ${
                    isLoading ? 'text-gray-500' : 'text-[#777777]'
                  }`}
                  size={20}
                />
              )}
            </div>
          </div>

          <div className="relative">
            <FiLock
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name="password2"
              type={password2Visible ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark 
                  ? 'bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]' 
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
              }`}
              value={form.password2}
              onChange={onChange}
              minLength={8}
              required
              disabled={isLoading}
            />
            <div onClick={() => !isLoading && setPassword2Visible(!password2Visible)}>
              {password2Visible ? (
                <FiEyeOff
                  className={`absolute top-[18px] right-4 cursor-pointer ${
                    isLoading ? 'text-gray-500' : 'text-[#777777]'
                  }`}
                  size={20}
                />
              ) : (
                <FiEye
                  className={`absolute top-[18px] right-4 cursor-pointer ${
                    isLoading ? 'text-gray-500' : 'text-[#777777]'
                  }`}
                  size={20}
                />
              )}
            </div>
          </div>

          <div className="relative">
            <FiKey
              size={20}
              className="absolute top-[18px] left-4 text-[#539C06]"
            />
            <select
              name="role"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none appearance-none ${
                isDark 
                  ? 'bg-white/10 border border-[#484848] text-white' 
                  : 'bg-white border border-gray-300 text-gray-900 shadow-sm'
              }`}
              value={form.role}
              onChange={onChange}
              disabled={isLoading}
            >
              <option
                className={`${
                  isDark 
                    ? 'text-[#539c06] bg-white/10' 
                    : 'text-[#539c06] bg-white'
                } rounded-full px-4 w-full`}
                value=""
                disabled
              >
                Select Role
              </option>
              <option
                className={`${
                  isDark 
                    ? 'text-[#539c06] bg-white/10' 
                    : 'text-[#539c06] bg-white'
                } rounded-full px-4 w-full`}
                value="user"
              >
                Normal User
              </option>
              <option
                className={`${
                  isDark 
                    ? 'text-[#539c06] bg-white/10' 
                    : 'text-[#539c06] bg-white'
                } rounded-full px-4 w-full`}
                value="super_admin"
              >
                Super Admin
              </option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Sign Up button with loading state */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-4 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:opacity-90'
            } bg-gradient-to-r from-[#539C06] to-[#D7EB57] text-black`}
          >
            {isLoading ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-3 py-4">
          <div className={`flex-grow h-px ${
            isDark 
              ? 'bg-gradient-to-r from-[#152305] to-[#549D07]' 
              : 'bg-gradient-to-r from-gray-300 to-gray-400'
          }`} />
          <span className={`text-sm ${
            isDark ? 'text-[#38531D]' : 'text-gray-500'
          }`}>OR</span>
          <div className={`flex-grow h-px ${
            isDark 
              ? 'bg-gradient-to-l from-[#152305] to-[#549D07]' 
              : 'bg-gradient-to-l from-gray-300 to-gray-400'
          }`} />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-6">
          <button 
            className={`rounded-full p-4 border transition ${
              isDark 
                ? 'border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03]' 
                : 'border-gray-300 bg-white hover:bg-gray-50 shadow-sm'
            }`}
            disabled={isLoading}
          >
            <BsFacebook size={22} className={isDark ? 'text-white' : 'text-gray-700'} />
          </button>
          <button 
            className={`rounded-full p-4 border transition ${
              isDark 
                ? 'border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03]' 
                : 'border-gray-300 bg-white hover:bg-gray-50 shadow-sm'
            }`}
            disabled={isLoading}
          >
            <BsGoogle size={22} className={isDark ? 'text-white' : 'text-gray-700'} />
          </button>
          <button 
            className={`rounded-full p-4 border transition ${
              isDark 
                ? 'border-[#5AA00B] bg-gradient-to-r from-[#213A04] to-[#182b03]' 
                : 'border-gray-300 bg-white hover:bg-gray-50 shadow-sm'
            }`}
            disabled={isLoading}
          >
            <BsApple size={22} className={isDark ? 'text-white' : 'text-gray-700'} />
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm">
          <p className={isDark ? 'text-[#989E92]' : 'text-gray-600'}>Already have an account?</p>
          <Link 
            to="/login" 
            className={`hover:underline ${
              isLoading ? 'pointer-events-none opacity-50' : ''
            } ${
              isDark ? 'text-[#ACED2E]' : 'text-[#539C06]'
            }`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
