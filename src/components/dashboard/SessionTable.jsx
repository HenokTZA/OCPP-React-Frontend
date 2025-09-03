import React from "react";
import { useTheme } from "@/lib/theme";

export default function SessionTable({ sessions }) {
  const { isDark } = useTheme();
  
  if (!Array.isArray(sessions)) {
    // you could also return a spinner or "Loading…" here
    return null;
  }

  return (
    <div className={`rounded-xl overflow-hidden ${
      isDark 
        ? "bg-gradient-card-dark border border-dark-border-secondary" 
        : "bg-light-bg-primary border border-light-border-secondary shadow-sm"
    }`}>
      <table className="w-full">
        <thead className={`${
          isDark ? "bg-dark-bg-secondary" : "bg-light-bg-tertiary"
        }`}>
          <tr>
            <th className={`px-4 py-3 text-left text-label-sm ${
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            }`}>ID</th>
            <th className={`px-4 py-3 text-left text-label-sm ${
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            }`}>CP</th>
            <th className={`px-4 py-3 text-left text-label-sm ${
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            }`}>User</th>
            <th className={`px-4 py-3 text-left text-label-sm ${
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            }`}>kWh</th>
            <th className={`px-4 py-3 text-left text-label-sm ${
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            }`}>Started</th>
            <th className={`px-4 py-3 text-left text-label-sm ${
              isDark ? "text-dark-text-secondary" : "text-light-text-secondary"
            }`}>Ended</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            // grab your fields; guard against missing
            const id      = s.id      ?? "-";
            const cp      = s.cp      ?? "-";
            const user    = s.user    ?? "-";
            const kWh     = typeof s.kWh === "number" ? s.kWh : null;
            const started = s.Started ? new Date(s.Started) : null;
            const ended   = s.Ended   ? new Date(s.Ended)   : null;

            return (
              <tr key={id} className={`border-t ${
                isDark ? "border-dark-border-tertiary" : "border-light-border-tertiary"
              }`}>
                <td className={`px-4 py-3 text-body-sm ${
                  isDark ? "text-dark-text-primary" : "text-light-text-primary"
                }`}>{id}</td>
                <td className={`px-4 py-3 text-body-sm ${
                  isDark ? "text-dark-text-primary" : "text-light-text-primary"
                }`}>{cp}</td>
                <td className={`px-4 py-3 text-body-sm ${
                  isDark ? "text-dark-text-primary" : "text-light-text-primary"
                }`}>{user}</td>
                <td className={`px-4 py-3 text-body-sm ${
                  isDark ? "text-dark-text-primary" : "text-light-text-primary"
                }`}>{kWh !== null ? kWh.toFixed(2) : "—"}</td>
                <td className={`px-4 py-3 text-body-sm ${
                  isDark ? "text-dark-text-primary" : "text-light-text-primary"
                }`}>{started ? started.toLocaleString() : "—"}</td>
                <td className={`px-4 py-3 text-body-sm ${
                  isDark ? "text-dark-text-primary" : "text-light-text-primary"
                }`}>{ended   ? ended.toLocaleString()   : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

