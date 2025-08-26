import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import heroImage from "@/assets/welcome.png";
import ThemeToggle from "@/components/ThemeToggle";
import { BsApple, BsFacebook, BsGoogle } from "react-icons/bs";

export default function WelcomeScreen() {
  const { isDark } = useTheme();

  return (
    <div className="relative min-h-screen">
      <ThemeToggle />
      
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={heroImage}
          alt="hero"
          className="w-full h-full object-cover object-center"
        />
        
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-transparent via-transparent via-transparent to-[#0A0A0A]' 
            : 'bg-gradient-to-b from-transparent via-transparent via-transparent to-[#F4FFAB]'
        }`} />
        
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60' 
            : 'bg-gradient-to-t from-[#F4FFAB] via-transparent to-transparent opacity-40'
        }`} />
        
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-radial-gradient from-transparent via-transparent to-[#0A0A0A] opacity-30' 
            : 'bg-radial-gradient from-transparent via-transparent to-[#F4FFAB] opacity-20'
        }`} />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center space-y-6 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
          >
            Welcome to <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D7EB57] to-[#ACED2E]">
              IMSOL
            </span> <br /> 
            Elektrotechnik
          </motion.h1>

          <div className="flex sm:flex-row gap-4 mt-6 w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <a
              href="/login"
              className={`w-full py-4 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                isDark 
                  ? 'bg-[#152405] hover:bg-[#1a2f06] text-[#D7EB57] border border-[#D7EB57] shadow-lg' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="w-full py-4 px-6 bg-gradient-to-r from-[#539C06] to-[#D7EB57] hover:from-[#4a8a05] hover:to-[#c4d44e] text-black rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </a>
          </div>

          <div className="flex items-center gap-4 w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className={`flex-grow h-px ${
              isDark 
                ? 'bg-gradient-to-r from-transparent via-[#D7EB57] to-[#D7EB57]' 
                : 'bg-gradient-to-r from-transparent via-white to-white'
            }`} />
            <span className={`text-sm font-medium px-3 ${
              isDark ? 'text-[#D7EB57]' : 'text-white'
            }`}>OR</span>
            <div className={`flex-grow h-px ${
              isDark 
                ? 'bg-gradient-to-l from-transparent via-[#D7EB57] to-[#D7EB57]' 
                : 'bg-gradient-to-l from-transparent via-white to-white'
            }`} />
          </div>

          <div className="flex justify-center gap-4 sm:gap-6">
            <button className={`rounded-full p-3 sm:p-4 border transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
              isDark 
                ? 'border-[#D7EB57] bg-[#152405]/80 hover:bg-[#1a2f06]/90 backdrop-blur-sm' 
                : 'border-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'
            }`}>
              <BsFacebook size={20} className="text-white" />
            </button>
            <button className={`rounded-full p-3 sm:p-4 border transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
              isDark 
                ? 'border-[#D7EB57] bg-[#152405]/80 hover:bg-[#1a2f06]/90 backdrop-blur-sm' 
                : 'border-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'
            }`}>
              <BsGoogle size={20} className="text-white" />
            </button>
            <button className={`rounded-full p-3 sm:p-4 border transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
              isDark 
                ? 'border-[#D7EB57] bg-[#152405]/80 hover:bg-[#1a2f06]/90 backdrop-blur-sm' 
                : 'border-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'
            }`}>
              <BsApple size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
