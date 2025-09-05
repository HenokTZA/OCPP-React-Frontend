import { useTheme } from "@/lib/theme";

function RecentSessions({ sessions, cps, cpKey, fmt }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-lg overflow-hidden ${
        isDark
          ? "bg-[#0f0f0e] border border-zinc-800"
          : "bg-light-bg-primary border border-light-border-secondary shadow-sm"
      }`}
    >
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h2
            className={`text-heading-md ${
              isDark ? "text-white" : "text-light-text-primary"
            }`}
          >
            Recent Sessions
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-body-sm">
          <thead
            className={`text-left ${
              isDark ? "bg-zinc-950" : "bg-light-bg-tertiary"
            }`}
          >
            <tr>
              <th
                className={`p-4 text-label-sm ${
                  isDark ? "text-primary-400" : "text-light-text-accent"
                }`}
              >
                ID
              </th>
              <th
                className={`p-4 text-label-sm ${
                  isDark ? "text-primary-400" : "text-light-text-accent"
                }`}
              >
                CP
              </th>
              <th
                className={`p-4 text-label-sm ${
                  isDark ? "text-primary-400" : "text-light-text-accent"
                }`}
              >
                kWh
              </th>
              <th
                className={`p-4 text-label-sm ${
                  isDark ? "text-primary-400" : "text-light-text-accent"
                }`}
              >
                Started
              </th>
              <th
                className={`p-4 text-label-sm ${
                  isDark ? "text-primary-400" : "text-light-text-accent"
                }`}
              >
                Ended
              </th>
              <th
                className={`p-4 text-label-sm ${
                  isDark ? "text-primary-400" : "text-light-text-accent"
                }`}
              >
                Total (€)
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.slice(0, 10).map((s, index) => {
              const cp = cps.find((c) => cpKey(c) === s.cp);
              const k = Number(s.kWh ?? 0);
              // const tot = cp?.price_per_kwh
              //   ? (k * cp.price_per_kwh).toFixed(2)
              //   : "—";
              const tot = s.total ? Number(s.total).toFixed(2) : "—";

              const statusColors = {
                Success: "text-green-500 bg-green-500/10",
                Waiting: "text-yellow-500 bg-yellow-500/10",
                "Due Date": "text-red-500 bg-red-500/10",
                Disabled: "text-zinc-500 bg-zinc-500/10",
              };

              const status =
                index === 0
                  ? "Waiting"
                  : index === 1
                  ? "Success"
                  : index === 2
                  ? "Due Date"
                  : "Disabled";

              return (
                <tr
                  key={s.id}
                  className={`border-b last:border-0 transition-colors ${
                    isDark
                      ? "border-zinc-800 hover:bg-zinc-900"
                      : "border-light-border-secondary hover:bg-interactive-hover-light"
                  }`}
                >
                  <td
                    className={`p-4 ${
                      isDark ? "text-white" : "text-light-text-primary"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{s.id}</div>
                    </div>
                  </td>
                  <td
                    className={`p-4 ${
                      isDark ? "text-white" : "text-light-text-primary"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{s.cp}</div>
                    </div>
                  </td>
                  <td
                    className={`p-4 ${
                      isDark ? "text-white" : "text-light-text-primary"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{k.toFixed(3)}</div>
                    </div>
                  </td>
                  <td
                    className={`p-4 ${
                      isDark ? "text-white" : "text-light-text-primary"
                    }`}
                  >
                    <div>
                      <div
                        className={`text-caption-sm ${
                          isDark ? "text-zinc-400" : "text-light-text-secondary"
                        }`}
                      >
                        {fmt(s.Started)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-caption-sm ${statusColors[status]}`}
                    >
                      {fmt(s.Ended)}
                    </span>
                  </td>
                  <td
                    className={`p-4 ${
                      isDark ? "text-white" : "text-light-text-primary"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{tot}</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentSessions;
