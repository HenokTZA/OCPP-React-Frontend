const UserLoadingSpinner = ({ message, isDark }) => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
    {/* Enhanced modern spinner */}
    <div className="relative flex items-center justify-center">
      {/* Subtle glow effect */}
      <div
        className={`absolute w-20 h-20 rounded-full ${
          isDark ? "bg-[#2d8c07]/10" : "bg-[#2d8c07]/5"
        } animate-ping`}
      ></div>

      {/* Outer ring with gradient */}
      <div
        className={`w-16 h-16 rounded-full ${
          isDark
            ? "border-[1.5px] border-[#2d8c07]/20"
            : "border-[1.5px] border-[#2d8c07]/15"
        }`}
      ></div>

      {/* Animated energy bar - smoother and more elegant */}
      <div className="absolute w-16 h-16 animate-spin">
        <div className="flex justify-center">
          <div
            className={`w-1 h-4 rounded-full ${
              isDark
                ? "bg-gradient-to-b from-[#ccbb00] to-[#ccbb00]/80"
                : "bg-gradient-to-b from-[#ccbb00] to-[#ccbb00]/90"
            }`}
            style={{ transform: "translateY(-28px)" }}
          ></div>
        </div>
      </div>

      {/* Central dot with subtle glow */}
      <div
        className={`absolute w-2.5 h-2.5 rounded-full ${
          isDark
            ? "bg-[#2d8c07] shadow-[0_0_10px_rgba(45,140,7,0.5)]"
            : "bg-[#2d8c07] shadow-[0_0_8px_rgba(45,140,7,0.3)]"
        }`}
      ></div>
    </div>

    {/* Enhanced text with subtle animation */}
    <div className="text-center space-y-2">
      <p
        className={`text-lg font-medium tracking-wide ${
          isDark ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {message || "Powering up"}
      </p>
      <div className="flex justify-center space-x-1.5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              isDark ? "bg-[#ccbb00]/70" : "bg-[#ccbb00]"
            } animate-pulse`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

export default UserLoadingSpinner;
