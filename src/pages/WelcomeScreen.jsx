import { motion } from "framer-motion";
import heroImage from "@/assets/welcome.png";
import { BsApple, BsFacebook, BsGoogle } from "react-icons/bs";

export default function WelcomeScreen() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#0A0A0A] to-[#152602] text-white">
      {/* Hero section */}
      <div className="relative w-full h-[55vh] sm:h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt="hero"
          className="w-full h-full object-cover object-bottom sm:object-center"
        />
        {/* Gradient overlay for smoother blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0e1a02]" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center px-6 pb-12 text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-3xl font-semibold"
        >
          Welcome to <br /> IMSOL <br /> Elektrotechnik
        </motion.h1>

        <div className="flex gap-4 mt-4 w-full sm:w-[500px]">
          <a
            href="/login"
            className="w-full py-4 px-4 bg-[#152405] hover:opacity-90 text-[#D7EB57] border border-[#D7EB57] rounded-full font-semibold transition-colors"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="w-full py-4 px-4 bg-gradient-to-r from-[#539C06] to-[#D7EB57] hover:opacity-90 text-black rounded-full font-semibold transition-colors"
          >
            Sign Up
          </a>
        </div>

        {/* OR */}
        <div className="flex items-center gap-3">
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
      </div>
    </div>
  );
}
