import { createPortal } from "react-dom";
import Modal from "./ui/Modal.jsx";

export default function UserPricesModal({
  cpId,
  rows,
  setRows,
  addEmail,
  setAddEmail,
  addK,
  setAddK,
  addH,
  setAddH,
  onAdd,
  onPatch,
  onDelete,
  onClose,
}) {
  return createPortal(
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">User management</h2>

        <div className="flex items-end gap-2">
          <div>
            <div className="text-xs opacity-70 mb-1">e-mail</div>
            <input
              className="input input-bordered"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              placeholder="user@email.com"
            />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Price per kWh</div>
            <input
              className="input input-bordered w-28"
              value={addK}
              onChange={(e) => setAddK(e.target.value)}
              placeholder="e.g. 0.35"
            />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Price per h</div>
            <input
              className="input input-bordered w-28"
              value={addH}
              onChange={(e) => setAddH(e.target.value)}
              placeholder="e.g. 1.20"
            />
          </div>
          <button
            className="btn btn-primary"
            disabled={!addEmail.trim()}
            onClick={() => onAdd(cpId)}
          >
            + Add user
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left border-b">
            <tr>
              <th>e-mail</th>
              <th>Price per kWh</th>
              <th>Price per h</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td>{row.user_email}</td>
                <td>
                  {row.editing ? (
                    <input
                      className="input input-bordered w-28"
                      defaultValue={row.price_per_kwh ?? ""}
                      onChange={(e) => (row._k = e.target.value)}
                    />
                  ) : (
                    <span>{Number(row.price_per_kwh ?? 0).toFixed(3)} CHF</span>
                  )}
                </td>
                <td>
                  {row.editing ? (
                    <input
                      className="input input-bordered w-28"
                      defaultValue={row.price_per_hour ?? ""}
                      onChange={(e) => (row._h = e.target.value)}
                    />
                  ) : (
                    <span>
                      {Number(row.price_per_hour ?? 0).toFixed(2)} CHF
                    </span>
                  )}
                </td>
                <td className="text-right">
                  {!row.editing ? (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setRows((arr) =>
                            arr.map((x) =>
                              x.id === row.id ? { ...x, editing: true } : x
                            )
                          )
                        }
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => onDelete(cpId, row.id)}
                      >
                        🗑️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-ghost"
                        onClick={() =>
                          setRows((arr) =>
                            arr.map((x) =>
                              x.id === row.id ? { ...x, editing: false } : x
                            )
                          )
                        }
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          const patch = {
                            price_per_kwh:
                              row._k === undefined || row._k === ""
                                ? null
                                : Number(row._k),
                            price_per_hour:
                              row._h === undefined || row._h === ""
                                ? null
                                : Number(row._h),
                          };
                          onPatch(cpId, row.id, patch);
                        }}
                      >
                        Save
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="btn" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>,
    document.body
  );
}
