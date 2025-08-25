import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";
import {
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import { BsApple, BsFacebook, BsGoogle } from "react-icons/bs";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);

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
    setError("");

    // simple client-side checks
    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }
    if ((form.password || "").length < 8) {
      setError("Password must be at least 8 characters.");
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
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#152602] px-4 py-8">
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
          <h1 className="text-4xl font-semibold text-white">Sign Up</h1>
          <p className="text-gray-400 text-md">
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
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.full_name}
              onChange={onchange}
              required
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
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.phone}
              onChange={onchange}
              required
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
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.username}
              onChange={onchange}
              required
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
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.email}
              onChange={onchange}
              required
            />
          </div>

          <div className="relative">
            <FiLock
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name={passwordVisible ? "text" : "password"}
              type="password"
              placeholder="Password"
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.password}
              onChange={onchange}
              required
              minLength={8}
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

          <div className="relative">
            <FiLock
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              name={password2Visible ? "text" : "password2"}
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={form.password2}
              onChange={onchange}
              minLength={8}
              required
            />
            <div onClick={() => setPassword2Visible(!password2Visible)}>
              {password2Visible ? (
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

          <div className="relative">
            <FiKey
              size={20}
              className="absolute top-[18px] left-4 text-[#539C06]"
            />
            <select
              name="role"
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-[#539C06] focus:outline-none appearance-none"
              value={form.role}
              onChange={onChange}
            >
              <option
                className="text-[#539c06] bg-white/10 rounded-full px-4 w-full"
                value=""
                disabled
              >
                Select Role
              </option>
              <option
                className="text-[#539c06] bg-white/10 rounded-full px-4 w-full"
                value="user"
              >
                {" "}
                Normal User{" "}
              </option>{" "}
              <option
                className="text-[#539c06] bg-white/10 rounded-full px-4 w-full"
                value="super_admin"
              >
                {" "}
                Super Admin{" "}
              </option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

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
          <p className="text-[#989E92]">Already have an account?</p>
          <Link to="/login" className="text-[#D7EB57] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
