import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import MilleniumDataFilter from "./features/MilleniumDataFilter/MillenuiumDataFilter";
import XmlReconciliation from "./features/XmlReconciliation/XmlReconciliation";
import "./index.css";
import "./App.css";

const views: Array<{ to: string; label: string }> = [
  { to: "/", label: "Millenium Filter" },
  { to: "/xml-reconciliation", label: "XML Reconciliation" },
];

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef2ff_0%,_#f8fafc_40%,_#e2e8f0_100%)] px-4 py-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-900 p-2 shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
          <div className="flex flex-wrap items-center gap-2">
            {views.map((view) => (
              <NavLink
                style={{ padding: "10px" }}
                key={view.to}
                to={view.to}
                end={view.to === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-xl border px-4 py-2.5 text-sm font-semibold tracking-[0.01em] transition-all duration-200",
                    "focus:ring-2",
                    isActive
                      ? "bg-[#5a7dff] text-white shadow-[0_6px_18px_rgba(90,125,255,0.4)]"
                      : "bg-slate-800/80 text-slate-300 hover:border-[#5a7dff]/60 hover:bg-slate-700 hover:text-white",
                  ].join(" ")
                }
              >
                {view.label}
              </NavLink>
            ))}
          </div>
        </div>

        <Routes>
          <Route path="/" element={<MilleniumDataFilter />} />
          <Route path="/xml-reconciliation" element={<XmlReconciliation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
