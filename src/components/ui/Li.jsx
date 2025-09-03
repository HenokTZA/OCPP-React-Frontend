import { useTheme } from "@/lib/theme";

const Li = ({ label, cb, disabled }) => {
  const { isDark } = useTheme();
  
  return (
    <li>
      <button
        disabled={disabled}
        onClick={cb}
        className={`w-full text-left px-3 py-2 text-body-sm transition-colors rounded-md ${
          disabled
            ? isDark
              ? "text-dark-text-muted cursor-not-allowed"
              : "text-light-text-muted cursor-not-allowed"
            : isDark
              ? "text-dark-text-primary hover:bg-interactive-hover-dark hover:text-dark-text-accent"
              : "text-light-text-primary hover:bg-interactive-hover-light hover:text-light-text-accent"
        }`}
      >
        {label}
      </button>
    </li>
  );
};

export default Li;
