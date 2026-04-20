import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getTicketById,
  updateStatus,
  assignTechnician,
  patchResolution,
} from "../services/ticketService";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Hash,
  MapPin,
  ClipboardList,
  Wrench,
  CheckCircle2,
} from "lucide-react";

const TECH_TITLE = "Technical Support";

function isTechnicalSupport(title) {
  return title?.trim() === TECH_TITLE;
}

export default function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [techId, setTechId] = useState("");
  const [resolutionDraft, setResolutionDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const res = await getTicketById(id, true);
      setTicket(res.data);
    } catch (e) {
      setError("Could not load ticket.");
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (e) {
      const msg = e.response?.data?.message || e.message;
      alert(msg || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  if (error && !ticket) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/admin/tickets" className="text-indigo-600 font-medium">
          Back to list
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Loading…</div>
    );
  }

  const tech = isTechnicalSupport(ticket.requestTitle);

  const card =
    "rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden mb-6";
  const cardHead = "px-6 py-3 bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-800";
  const cardBody = "px-6 py-5 space-y-3 text-sm text-slate-700";
  const btnPrimary =
    "rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50";
  const btnSecondary =
    "rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate("/admin/tickets")}
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft size={18} />
          All tickets
        </button>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-indigo-600">Ticket #{ticket.id}</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{ticket.subject}</h1>
          <p className="text-slate-500 text-sm mt-1">
            <span className="font-medium text-slate-700">{ticket.requestTitle}</span>
            {tech ? " · Technician workflow" : " · Standard review workflow"}
          </p>
        </div>

        {/* 1 — Submitter */}
        <div className={card}>
          <div className={cardHead}>1 · Submitted by</div>
          <div className={cardBody}>
            <div className="grid sm:grid-cols-2 gap-4">
              <p className="flex items-center gap-2">
                <User size={16} className="text-slate-400 shrink-0" />
                <span>{ticket.reporterName}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="break-all">{ticket.reporterEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Hash size={16} className="text-slate-400 shrink-0" />
                {ticket.regNo}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400 shrink-0" />
                {ticket.contactNo}
              </p>
              <p className="flex items-center gap-2 sm:col-span-2">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                {ticket.campus}
              </p>
            </div>
            {ticket.adminReply && (
              <div className="mt-4 rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-indigo-900 text-sm">
                <strong className="block text-indigo-800 mb-1">Auto message to user (on first open)</strong>
                {ticket.adminReply}
                {ticket.repliedAt && (
                  <p className="text-xs text-indigo-600/80 mt-2">
                    Sent {new Date(ticket.repliedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2 — Request */}
        <div className={card}>
          <div className={cardHead}>2 · Request details</div>
          <div className={cardBody}>
            <p className="flex items-start gap-2">
              <ClipboardList size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="whitespace-pre-wrap">{ticket.description}</span>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-semibold uppercase text-slate-500">Status</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                {ticket.status?.replace("_", " ")}
              </span>
              {ticket.priority && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                  Priority {ticket.priority}
                </span>
              )}
            </div>
            {ticket.resolutionNotes && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Resolution notes</p>
                <p className="whitespace-pre-wrap">{ticket.resolutionNotes}</p>
              </div>
            )}
            {tech && ticket.technicianId && (
              <p className="flex items-center gap-2 pt-2 text-slate-600">
                <Wrench size={16} />
                Technician: <strong>{ticket.technicianId}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={card}>
          <div className={`${cardHead} flex items-center gap-2`}>
            <CheckCircle2 size={18} />
            Admin actions
          </div>
          <div className="px-6 py-5 space-y-4">
            {tech ? (
              <>
                <p className="text-xs text-slate-500">
                  Flow: <strong>Start</strong> → assign technician (while in progress) → optional resolution
                  notes → <strong>Mark work finished</strong> → <strong>Close</strong>.
                </p>
                <div className="flex flex-wrap gap-2">
                  {ticket.status === "OPEN" && (
                    <button
                      type="button"
                      disabled={busy}
                      className={btnPrimary}
                      onClick={() => run(() => updateStatus(id, "IN_PROGRESS"))}
                    >
                      Start handling
                    </button>
                  )}
                  {ticket.status === "IN_PROGRESS" && (
                    <>
                      <div className="flex flex-wrap items-end gap-2 w-full">
                        <div className="flex-1 min-w-[140px]">
                          <label className="text-xs font-medium text-slate-600">Technician id / name</label>
                          <input
                            value={techId}
                            onChange={(e) => setTechId(e.target.value)}
                            placeholder="e.g. tech-msi-01"
                            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={busy || !techId.trim()}
                          className={btnSecondary}
                          onClick={() =>
                            run(() => assignTechnician(id, techId.trim()).then(() => setTechId("")))
                          }
                        >
                          Assign technician
                        </button>
                      </div>
                      <div className="w-full">
                        <label className="text-xs font-medium text-slate-600">Resolution notes (optional)</label>
                        <textarea
                          value={resolutionDraft}
                          onChange={(e) => setResolutionDraft(e.target.value)}
                          rows={2}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          placeholder="What was done?"
                        />
                        <button
                          type="button"
                          disabled={busy || !resolutionDraft.trim()}
                          className={`${btnSecondary} mt-2`}
                          onClick={() =>
                            run(() =>
                              patchResolution(id, resolutionDraft.trim()).then(() => setResolutionDraft(""))
                            )
                          }
                        >
                          Save resolution notes
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        className={btnPrimary}
                        onClick={() => run(() => updateStatus(id, "RESOLVED"))}
                      >
                        Mark work finished
                      </button>
                    </>
                  )}
                  {ticket.status === "RESOLVED" && (
                    <button
                      type="button"
                      disabled={busy}
                      className={btnPrimary}
                      onClick={() => run(() => updateStatus(id, "CLOSED"))}
                    >
                      Close ticket
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  This request title uses a short path: mark as resolved when done, then close.
                </p>
                <div className="flex flex-wrap gap-2">
                  {ticket.status === "OPEN" && (
                    <button
                      type="button"
                      disabled={busy}
                      className={btnPrimary}
                      onClick={() => run(() => updateStatus(id, "RESOLVED"))}
                    >
                      Mark as resolved
                    </button>
                  )}
                  {ticket.status === "RESOLVED" && (
                    <button
                      type="button"
                      disabled={busy}
                      className={btnPrimary}
                      onClick={() => run(() => updateStatus(id, "CLOSED"))}
                    >
                      Close ticket
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
