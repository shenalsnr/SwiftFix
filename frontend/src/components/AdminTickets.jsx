import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTickets } from "../services/ticketService";
import {
  Ticket,
  ChevronRight,
  User,
  Building2,
  RefreshCw,
  Inbox,
} from "lucide-react";

const STATUS_STYLES = {
  OPEN: "bg-amber-100 text-amber-800 ring-amber-200",
  IN_PROGRESS: "bg-sky-100 text-sky-800 ring-sky-200",
  RESOLVED: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  CLOSED: "bg-slate-200 text-slate-700 ring-slate-300",
  REJECTED: "bg-rose-100 text-rose-800 ring-rose-200",
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await getTickets();
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      alert("Could not load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              Admin · Maintenance hub
            </p>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="text-indigo-600" />
              Incoming tickets
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Open a ticket to see submitter details first, then the request. Actions depend on{" "}
              <strong>request title</strong> (Technical Support uses technician steps).
            </p>
          </div>
          <button
            type="button"
            onClick={loadTickets}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading tickets…</div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 py-16 text-center text-slate-500">
            No tickets yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {tickets.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/tickets/${t.id}`)}
                  className="w-full text-left rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                      <div className="shrink-0 p-3 rounded-xl bg-indigo-50 text-indigo-600">
                        <Ticket size={22} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate group-hover:text-indigo-700">
                          {t.subject || "No subject"}
                        </p>
                        <p className="text-sm text-slate-600 line-clamp-2 mt-0.5">{t.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <User size={14} />
                            {t.reporterName || "—"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Building2 size={14} />
                            {t.requestTitle || "—"}
                          </span>
                          <span>#{t.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ring-1 ${
                          STATUS_STYLES[t.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {t.status?.replace("_", " ")}
                      </span>
                      <ChevronRight
                        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                        size={22}
                      />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
