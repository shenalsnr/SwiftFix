import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getTicketById,
  updateStatus,
  assignTechnician,
  patchResolution,
  addComment,
  updateComment,
  deleteComment,
  toAbsoluteFileUrl,
} from "../services/ticketService";
import {
  ArrowLeft,
  UserCog,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Paperclip,
  Trash2,
  Pencil,
  Ticket,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const getAdminUser = () => {
  const savedUserId = localStorage.getItem("swiftfix_admin_id") || "admin1";
  const savedName = localStorage.getItem("swiftfix_admin_name") || "Admin User";
  return { id: savedUserId, name: savedName, role: "ADMIN" };
};

const badgeMap = {
  OPEN: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-200 text-slate-700 border-slate-300",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminTicketDetail() {
  const { id } = useParams();
  const adminUser = useMemo(() => getAdminUser(), []);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const [technicianId, setTechnicianId] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminReply, setAdminReply] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const [editingComment, setEditingComment] = useState({});

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

  const loadTicket = async () => {
    setLoading(true);
    try {
      const data = await getTicketById(id, false);
      setTicket(data);
      setTechnicianId(data.technicianId || "");
      setResolutionNotes(data.resolutionNotes || "");
      setAdminReply(data.adminReply || "");
      setRejectionReason(data.rejectionReason || "");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to load ticket"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [id]);

  const handleStatus = async (status) => {
    if (!ticket) return;

    if (ticket.status === status) {
      alert(`Ticket is already ${status.replaceAll("_", " ")}`);
      return;
    }

    if (status === "REJECTED" && !rejectionReason.trim()) {
      alert("Rejection reason is required");
      return;
    }

    try {
      const updated = await updateStatus(
        ticket.id,
        status,
        status === "REJECTED" ? rejectionReason.trim() : "",
        adminReply.trim()
      );
      setTicket(updated);
      setAdminReply(updated.adminReply || "");
      setRejectionReason(updated.rejectionReason || "");
      setResolutionNotes(updated.resolutionNotes || resolutionNotes);
      setTechnicianId(updated.technicianId || technicianId);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to update status"));
    }
  };

  const handleAssign = async () => {
    if (!ticket) return;

    if (!technicianId.trim()) {
      alert("Technician ID is required");
      return;
    }

    try {
      const updated = await assignTechnician(ticket.id, technicianId.trim());
      setTicket(updated);
      setTechnicianId(updated.technicianId || "");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to assign technician"));
    }
  };

  const handleResolution = async () => {
    if (!ticket) return;

    if (!resolutionNotes.trim()) {
      alert("Resolution notes are required");
      return;
    }

    try {
      const updated = await patchResolution(ticket.id, resolutionNotes.trim());
      setTicket(updated);
      setResolutionNotes(updated.resolutionNotes || "");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to save resolution notes"));
    }
  };

  const handleAddComment = async () => {
    if (!commentDraft.trim() || !ticket) return;

    try {
      const updated = await addComment(ticket.id, {
        authorId: adminUser.id,
        authorName: adminUser.name,
        authorRole: adminUser.role,
        message: commentDraft.trim(),
      });
      setTicket(updated);
      setCommentDraft("");
    } catch (err) {
      alert(getErrorMessage(err, "Failed to add comment"));
    }
  };

  const handleUpdateComment = async (commentId) => {
    const message = (editingComment[commentId] || "").trim();
    if (!message || !ticket) return;

    try {
      const updated = await updateComment(ticket.id, commentId, {
        editorId: adminUser.id,
        editorRole: adminUser.role,
        message,
      });
      setTicket(updated);
      setEditingComment((prev) => ({ ...prev, [commentId]: undefined }));
    } catch (err) {
      alert(getErrorMessage(err, "Failed to update comment"));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!ticket) return;

    try {
      const updated = await deleteComment(ticket.id, commentId, adminUser.id, adminUser.role);
      setTicket(updated);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to delete comment"));
    }
  };

  if (loading) {
    return <div className="text-center py-14 text-slate-600 font-medium">Loading ticket...</div>;
  }

  if (!ticket) {
    return <div className="text-center py-14 text-slate-600 font-medium">Ticket not found</div>;
  }

  const isOpen = ticket.status === "OPEN";
  const isResolved = ticket.status === "RESOLVED";
  const isClosed = ticket.status === "CLOSED";
  const isRejected = ticket.status === "REJECTED";
  const isLocked = isClosed || isRejected;

  const startDisabled = !isOpen;
  const resolveDisabled = isResolved || isClosed || isRejected;
  const closeDisabled = !isResolved;
  const rejectDisabled = isClosed || isRejected;
  const assignDisabled = isClosed || isRejected || !technicianId.trim();
  const resolutionDisabled = isClosed || isRejected || !resolutionNotes.trim();

  const buttonBase =
    "rounded-2xl text-white font-bold px-4 py-3.5 transition inline-flex items-center justify-center gap-2";
  const disabledClass = "bg-slate-300 cursor-not-allowed";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <Link
          to="/admin/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={18} />
          Back to all tickets
        </Link>
      </div>

      <div className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-900 text-white shadow-2xl">
        <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Ticket size={13} />
                #{ticket.id}
              </span>
              <span
                className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${
                  badgeMap[ticket.status] || "bg-white/10 text-white border-white/10"
                }`}
              >
                {ticket.status.replaceAll("_", " ")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {ticket.priority}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black">{ticket.subject}</h1>
            <p className="text-slate-300 mt-4 max-w-3xl leading-7">{ticket.description}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 w-full xl:max-w-xl">
            <div className="rounded-3xl bg-white/10 border border-white/10 p-5">
              <p className="text-sm text-slate-300">Reporter</p>
              <p className="text-xl font-black mt-1">{ticket.reporterName}</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/10 p-5">
              <p className="text-sm text-slate-300">Technician</p>
              <p className="text-xl font-black mt-1">{ticket.technicianId || "Not assigned"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-8">
        <div className="space-y-8">
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Ticket details</h2>
                <p className="text-sm text-slate-500">Core information provided by the reporter</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Reporter</p>
                <p className="text-slate-900 font-bold mt-2">{ticket.reporterName}</p>
                <p className="text-sm text-slate-500 mt-1">{ticket.reporterEmail}</p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Request info</p>
                <p className="text-slate-900 font-bold mt-2">{ticket.requestTitle}</p>
                <p className="text-sm text-slate-500 mt-1">{ticket.campus}</p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Contact</p>
                <p className="text-slate-900 font-bold mt-2">{ticket.contactNo}</p>
                <p className="text-sm text-slate-500 mt-1">{ticket.regNo}</p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Technician</p>
                <p className="text-slate-900 font-bold mt-2">
                  {ticket.technicianId || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          {ticket.attachments?.length > 0 && (
            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <Paperclip size={18} className="text-slate-600" />
                <h2 className="text-2xl font-black text-slate-900">Attachments</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {ticket.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={toAbsoluteFileUrl(attachment.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    {attachment.originalFilename}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare size={18} className="text-slate-600" />
              <h2 className="text-2xl font-black text-slate-900">Comments</h2>
            </div>

            {ticket.comments?.length > 0 ? (
              <div className="space-y-4 mb-5">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-3xl bg-slate-50 border border-slate-200 p-4 md:p-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-800">
                          {comment.authorName}{" "}
                          <span className="text-xs font-semibold text-slate-500">
                            ({comment.authorRole})
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : "-"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setEditingComment((prev) => ({
                              ...prev,
                              [comment.id]:
                                prev[comment.id] !== undefined ? undefined : comment.message,
                            }))
                          }
                          className="w-9 h-9 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="w-9 h-9 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {editingComment[comment.id] !== undefined ? (
                      <div className="mt-4 space-y-3">
                        <textarea
                          value={editingComment[comment.id]}
                          onChange={(e) =>
                            setEditingComment((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            className="rounded-2xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() =>
                              setEditingComment((prev) => ({
                                ...prev,
                                [comment.id]: undefined,
                              }))
                            }
                            className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-700 mt-3 leading-7">{comment.message}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 mb-5">No comments yet</p>
            )}

            <div className="flex flex-col md:flex-row gap-3">
              <textarea
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Add a new admin or staff comment..."
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3"
              />
              <button
                onClick={handleAddComment}
                className="rounded-2xl bg-slate-900 hover:bg-black text-white font-bold px-5 py-3 transition"
              >
                Add comment
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wrench size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Admin actions</h2>
                <p className="text-sm text-slate-500">Manage the ticket workflow</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">Admin reply</label>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  className="w-full mt-2 rounded-2xl border border-slate-300 px-4 py-3 min-h-[120px]"
                  placeholder="Optional response to the reporter..."
                  disabled={isLocked}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleStatus("IN_PROGRESS")}
                  disabled={startDisabled}
                  className={`${buttonBase} ${
                    startDisabled ? disabledClass : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Start progress
                </button>

                <button
                  onClick={() => handleStatus("RESOLVED")}
                  disabled={resolveDisabled}
                  className={`${buttonBase} ${
                    resolveDisabled ? disabledClass : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  <CheckCircle2 size={18} />
                  Mark resolved
                </button>

                <button
                  onClick={() => handleStatus("CLOSED")}
                  disabled={closeDisabled}
                  className={`${buttonBase} ${
                    closeDisabled ? disabledClass : "bg-slate-800 hover:bg-black"
                  }`}
                >
                  Close ticket
                </button>

                <button
                  onClick={() => handleStatus("REJECTED")}
                  disabled={rejectDisabled}
                  className={`${buttonBase} ${
                    rejectDisabled ? disabledClass : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Rejection reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full mt-2 rounded-2xl border border-slate-300 px-4 py-3 min-h-[100px]"
                  placeholder="Required only when rejecting"
                  disabled={isClosed || isRejected}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserCog size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Technician & resolution</h2>
                <p className="text-sm text-slate-500">Assignment and final fix details</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">Technician ID</label>
                <div className="mt-2 flex gap-3">
                  <input
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                    className="flex-1 rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="e.g. tech01"
                    disabled={isLocked}
                  />
                  <button
                    onClick={handleAssign}
                    disabled={assignDisabled}
                    className={`${buttonBase} ${
                      assignDisabled ? disabledClass : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    <UserCog size={18} />
                    Assign
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Resolution notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full mt-2 rounded-2xl border border-slate-300 px-4 py-3 min-h-[160px]"
                  placeholder="Add technical findings or final fix details..."
                  disabled={isLocked}
                />
              </div>

              <button
                onClick={handleResolution}
                disabled={resolutionDisabled}
                className={`${buttonBase} ${
                  resolutionDisabled ? disabledClass : "bg-slate-900 hover:bg-black"
                }`}
              >
                Save resolution notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}