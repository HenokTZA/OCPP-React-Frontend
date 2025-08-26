import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme";
import logo from "@/assets/logo_full.png";
import heroImage from "@/assets/hero.png";
import ThemeToggle from "@/components/ThemeToggle";

export default function SplashScreen() {
  const { isDark } = useTheme();
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random increment between 5-20
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-[#539C06] to-[#D7EB57] opacity-80' 
          : 'bg-gradient-to-b from-[#539C06] to-[#D7EB57] opacity-60'
      }`} />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center text-center z-10">
        {/* Logo with animation */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-52 h-auto animate-pulse" 
          />
        </div>
        
        {/* Loading text */}
        <h2 className={`text-2xl font-semibold mb-6 ${
          isDark ? 'text-white' : 'text-white'
        }`}>
          Welcome to IMSOL
        </h2>
        
        {/* Progress bar */}
        <div className="w-64 bg-white/20 rounded-full h-2 mb-4">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Loading percentage */}
        <p className={`text-sm ${
          isDark ? 'text-white/80' : 'text-white/80'
        }`}>
          Loading... {Math.round(progress)}%
        </p>
        
        {/* Loading dots animation */}
        {/* <div className="flex space-x-1 mt-4">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div> */}
      </div>
    </div>
  );
}
