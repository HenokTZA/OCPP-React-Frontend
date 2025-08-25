import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/password/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + data.detail);
      } else {
        setMessage("❌ " + (data.detail || "Something went wrong"));
      }
    } catch (err) {
      setMessage("❌ Network error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#152602] p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="flex justify-center">
            <img
              className="w-24 h-24 object-contain"
              src={logo}
              alt="Alt Logo"
            />
          </div>
          <h1 className="text-4xl font-semibold text-white">
            Forgot
            <br />
            Password
          </h1>
          <p className="text-gray-400 text-md">
            Enter your email to recover your password
          </p>
        </div>

        {message && <div className="mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-4 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-4 bg-gradient-to-r from-[#539C06] to-[#D7EB57] hover:opacity-90 text-black rounded-full font-semibold transition-colors"
          >
            Send
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p className="text-[#989E92]">Remembered your password?</p>
          <Link to="/login" className="text-[#D7EB57] hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
