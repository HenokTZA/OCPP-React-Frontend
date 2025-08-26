import { useTheme } from '@/lib/theme';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 group theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <FiSun 
          className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-200" 
        />
      ) : (
        <FiMoon 
          className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform duration-200" 
        />
      )}
    </button>
  );
}
