import { useState } from "react";
import { FiMail, FiLoader, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@/lib/theme";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const data = await forgotPassword(email);
      if (data.ok) {
        setMessage({ type: "success", text: data.detail });
      } else {
        setMessage({
          type: "error",
          text: data.detail || "Something went wrong",
        });
      }
    } catch (err) {
      console.log(err);
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

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
            Forgot
            <br />
            Password
          </h1>
          <p
            className={`text-md ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Enter your email to recover your password
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiMail
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              type="email"
              placeholder="Your email"
              className={`w-full rounded-full pl-12 pr-4 py-4 focus:ring-1 focus:ring-[#539C06] focus:outline-none ${
                isDark
                  ? "bg-white/10 border border-[#484848] text-white placeholder-[#AAAAAA]"
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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
                Sending
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-sm">
          <p className={isDark ? "text-[#989E92]" : "text-gray-600"}>
            Remembered your password?
          </p>
          <Link
            to="/login"
            className={`hover:underline ${
              isDark ? "text-[#ACED2E]" : "text-[#539C06]"
            }`}
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
