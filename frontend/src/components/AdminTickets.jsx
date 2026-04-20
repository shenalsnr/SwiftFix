import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../services/ticketService";
import { Search, Filter, Eye } from "lucide-react";

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

      const matchesStatus =
        filters.status === "ALL" || ticket.status === filters.status;

      const matchesPriority =
        filters.priority === "ALL" || ticket.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, filters]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-indigo-600">SwiftFix · Admin panel</p>
        <h1 className="text-3xl font-black text-slate-900">All maintenance tickets</h1>
        <p className="text-slate-500 mt-2">
          Review, filter, and open tickets for detailed handling.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search by id, title, user..."
              className="w-full rounded-2xl border border-slate-300 pl-11 pr-4 py-3"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 pl-11 pr-4 py-3 bg-white"
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
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white"
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
        <div className="text-center py-12 text-slate-600">Loading tickets...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-xl font-bold text-slate-800">No tickets found</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">#{ticket.id}</span>
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

                  <h2 className="text-xl font-black text-slate-900">{ticket.subject}</h2>
                  <p className="text-slate-600">{ticket.description}</p>

                  <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>Reporter: {ticket.reporterName}</span>
                    <span>•</span>
                    <span>{ticket.requestTitle}</span>
                    <span>•</span>
                    <span>{ticket.campus}</span>
                    <span>•</span>
                    <span>Tech: {ticket.technicianId || "Not assigned"}</span>
                  </div>
                </div>

                <div>
                  <Link
                    to={`/admin/tickets/${ticket.id}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold px-5 py-3"
                  >
                    <Eye size={18} />
                    Open details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}