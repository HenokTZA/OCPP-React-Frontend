import { CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "@/lib/theme";

const statusMap = {
  Available: { color: "text-status-success", Icon: CheckCircle },
  Charging: { color: "text-status-warning", Icon: CheckCircle },
  Faulted: { color: "text-status-error", Icon: XCircle }
};

export default function ConnectorCard({ cp }) {
  const { isDark } = useTheme();
  const S = statusMap[cp.status] || statusMap.Available;
  
  return (
    <div className={`rounded-xl p-4 flex justify-between ${
      isDark 
        ? "bg-gradient-card-dark border border-dark-border-secondary shadow-theme-sm" 
        : "bg-light-bg-primary border border-light-border-secondary shadow-sm"
    }`}>
      <div>
        <h3 className={`text-heading-xs ${
          isDark ? "text-dark-text-primary" : "text-light-text-primary"
        }`}>{cp.name}</h3>
        <p className={`text-caption-md ${
          isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
        }`}>
          Connector {cp.connectorId} · {cp.status}
        </p>
      </div>
      <S.Icon className={`w-6 h-6 ${
        isDark ? `${S.color}-dark` : `${S.color}-light`
      }`} />
    </div>
  );
}

