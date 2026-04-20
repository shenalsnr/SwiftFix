import { useEffect, useState } from "react";
import { getTicketsByUserId } from "../services/ticketService";
import { Link } from "react-router-dom";
import { Search, Calendar, RotateCcw, MessageCircle, Ticket, Plus } from "lucide-react";

const STATUS_STYLES = {
  OPEN: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-sky-100 text-sky-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-200 text-slate-700",
  REJECTED: "bg-rose-100 text-rose-800",
};

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const userId = "user1";

  const load = async () => {
    try {
      const res = await getTicketsByUserId(userId);
      setTickets(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let data = [...tickets];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.subject || "").toLowerCase().includes(q) ||
          (t.requestTitle || "").toLowerCase().includes(q)
      );
    }
    if (date) {
      data = data.filter((t) => {
        if (!t.createdAt) return true;
        return t.createdAt.startsWith(date);
      });
    }
    setFiltered(data);
  }, [search, date, tickets]);

  const resetFilters = () => {
    setSearch("");
    setDate("");
    setFiltered(tickets);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-slate-50 to-slate-100/90">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
              SwiftFix · My requests
            </p>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="text-indigo-600" />
              My tickets
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              When staff opens your ticket, you&apos;ll see their first acknowledgement below.
            </p>
          </div>
          <Link
            to="/tickets/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white px-5 py-2.5 font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
          >
            <Plus size={20} />
            New request
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 flex flex-col md:flex-row gap-4 shadow-sm">
          <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2 flex-1">
            <Search size={18} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search subject, message, or title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2">
            <Calendar size={18} className="text-slate-400 mr-2" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="outline-none text-sm" />
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 py-16 text-center text-slate-500">
            <p>No tickets match.</p>
            <Link to="/tickets/create" className="text-indigo-600 font-medium mt-2 inline-block">
              Submit a request
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-semibold text-lg text-slate-900">{t.subject || "Ticket"}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {t.requestTitle} · #{t.id}
                      {t.createdAt && ` · ${t.createdAt.split("T")[0]}`}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      STATUS_STYLES[t.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {t.status?.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-4">{t.description}</p>

                {t.adminReply && (
                  <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
                    <div className="flex items-center gap-2 text-indigo-800 font-semibold text-sm mb-1">
                      <MessageCircle size={16} />
                      Message from administration
                    </div>
                    <p className="text-sm text-indigo-950">{t.adminReply}</p>
                    {t.repliedAt && (
                      <p className="text-xs text-indigo-600/80 mt-2">
                        {new Date(t.repliedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {t.requestTitle === "Technical Support" && (
                  <p className="text-xs text-slate-500 mt-3">
                    Technician:{" "}
                    <span className="font-medium text-slate-700">{t.technicianId || "Not assigned yet"}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
