import { useTheme } from "@/lib/theme";

const Field = ({ label, value, onChange, ...rest }) => {
  const { isDark } = useTheme();
  
  return (
    <label className="block">
      <span className={`text-label-md ${
        isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
      }`}>{label}</span>
      <input
        className={`mt-2 w-full rounded-lg border px-3 py-2 text-body-md transition-colors outline-none ${
          isDark
            ? "bg-dark-bg-primary border-dark-border-tertiary text-dark-text-primary focus:border-dark-border-primary focus:ring-2 focus:ring-dark-text-accent/20"
            : "bg-light-bg-primary border-light-border-tertiary text-light-text-primary focus:border-light-border-primary focus:ring-2 focus:ring-light-text-accent/20"
        }`}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
};

export default Field;
