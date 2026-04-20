import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../services/ticketService";
import {
  Search,
  Filter,
  Eye,
  Ticket,
  Wrench,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const badgeMap = {
  OPEN: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-200 text-slate-700 border-slate-300",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "ALL",
    priority: "ALL",
  });

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !search ||
        ticket.subject?.toLowerCase().includes(search) ||
        ticket.description?.toLowerCase().includes(search) ||
        ticket.requestTitle?.toLowerCase().includes(search) ||
        ticket.reporterName?.toLowerCase().includes(search) ||
        String(ticket.id).includes(search);

      const matchesStatus = filters.status === "ALL" || ticket.status === filters.status;
      const matchesPriority =
        filters.priority === "ALL" || ticket.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, filters]);

  const openCount = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const progressCount = tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length;
  const urgentCount = tickets.filter((ticket) => ticket.priority === "HIGH").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 text-white shadow-2xl">
        <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div>
            <p className="text-sm font-semibold text-blue-100 mb-3">SwiftFix · Admin panel</p>
            <h1 className="text-3xl md:text-5xl font-black">Maintenance ticket control center</h1>
            <p className="text-blue-100 mt-4 max-w-2xl leading-7">
              Review reported issues, filter by status or priority, and open any ticket for
              full technician handling.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 w-full xl:max-w-2xl">
            <div className="rounded-3xl bg-white/10 border border-white/15 p-5">
              <p className="text-sm text-blue-100">Open</p>
              <p className="text-3xl font-black mt-1">{openCount}</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-5">
              <p className="text-sm text-blue-100">In progress</p>
              <p className="text-3xl font-black mt-1">{progressCount}</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-5">
              <p className="text-sm text-blue-100">High priority</p>
              <p className="text-3xl font-black mt-1">{urgentCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search by id, title, user..."
              className="w-full rounded-2xl border border-slate-300 pl-11 pr-4 py-3.5"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 pl-11 pr-4 py-3.5 bg-white"
            >
              <option value="ALL">All statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 bg-white"
            >
              <option value="ALL">All priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-14 text-slate-600 font-medium">Loading tickets...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <Ticket size={28} />
          </div>
          <p className="text-2xl font-black text-slate-800">No tickets found</p>
          <p className="text-slate-500 mt-2">Try changing the filters or search text.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6 md:p-8"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      <Ticket size={13} />
                      #{ticket.id}
                    </span>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${
                        badgeMap[ticket.status] || "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {ticket.status.replaceAll("_", " ")}
                    </span>

                    <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-bold border border-slate-200">
                      {ticket.priority}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">{ticket.subject}</h3>
                  <p className="text-slate-600 mt-3 leading-7">{ticket.description}</p>

                  <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Reporter</p>
                      <p className="text-slate-900 font-bold mt-2">{ticket.reporterName}</p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Request title</p>
                      <p className="text-slate-900 font-bold mt-2">{ticket.requestTitle}</p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Campus</p>
                      <p className="text-slate-900 font-bold mt-2">{ticket.campus}</p>
                    </div>

                    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-500">Technician</p>
                      <p className="text-slate-900 font-bold mt-2">
                        {ticket.technicianId || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="xl:min-w-[220px] flex flex-col gap-3">
                  <div className="rounded-3xl bg-slate-950 text-white p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench size={18} />
                      <p className="font-black">Action panel</p>
                    </div>
                    <p className="text-sm text-slate-300">
                      Open the full ticket to assign a technician, update status, or add a
                      resolution.
                    </p>
                  </div>

                  <Link
                    to={`/admin/tickets/${ticket.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3.5 shadow-lg shadow-indigo-600/20 transition"
                  >
                    <Eye size={18} />
                    Open details
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {ticket.priority === "HIGH" && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full bg-red-50 text-red-700 border border-red-200">
                    <AlertTriangle size={14} />
                    High priority
                  </span>
                )}

                {ticket.status === "RESOLVED" && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={14} />
                    Ready for closure
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}