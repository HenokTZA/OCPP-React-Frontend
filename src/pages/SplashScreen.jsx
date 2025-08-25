import logo from "@/assets/logo_full.png";
import heroImage from "@/assets/hero.png";

export default function SplashScreen() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#539C06] to-[#D7EB57] opacity-80" />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center text-center">
        <img src={logo} alt="Logo" className="w-52 h-auto" />
      </div>
    </div>
  );
}
