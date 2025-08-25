import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password2Visible, setPassword2Visible] = useState(false);

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
        <div className="text-center space-y-3 mb-8">
          <div className="flex justify-center">
            <img
              className="w-24 h-24 object-contain"
              src={logo}
              alt="Alt Logo"
            />
          </div>
          <h1 className="text-4xl font-semibold text-white">
            Create New
            <br />
            Password
          </h1>
          <p className="text-gray-400 text-md">Please enter the new password</p>
        </div>

        {message && <div className="mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First password */}
          <div className="relative">
            <FiLock
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Create new password"
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-2 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm password */}
          <div className="relative pb-4">
            <FiLock
              className="absolute top-[18px] left-4 text-[#539C06]"
              size={20}
            />
            <input
              type={password2Visible ? "text" : "password"}
              placeholder="Confirm new password"
              className="w-full bg-white/10 border border-[#484848] rounded-full pl-12 pr-3 py-4 text-white placeholder-[#AAAAAA] focus:ring-1 focus:ring-[#539C06] focus:outline-none"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              minLength={8}
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

          <button
            type="submit"
            className="w-full py-4 px-4 bg-gradient-to-r from-[#539C06] to-[#D7EB57] hover:opacity-90 text-black rounded-full font-semibold transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;
