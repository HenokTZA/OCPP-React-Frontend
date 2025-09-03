import { useTheme } from "@/lib/theme";

export default function StatCard({ label, value }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`p-4 rounded-xl text-center ${
      isDark 
        ? "bg-gradient-card-dark border border-dark-border-secondary" 
        : "bg-light-bg-primary border border-light-border-secondary shadow-sm"
    }`}>
      <div className={`text-caption-sm mb-1 ${
        isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
      }`}>{label}</div>
      <div className={`text-heading-lg ${
        isDark ? "text-dark-text-primary" : "text-light-text-primary"
      }`}>{value ?? 0}</div>
    </div>
  );
}
