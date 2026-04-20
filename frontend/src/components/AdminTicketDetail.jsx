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

  const getErrorMessage = (err, fallback) => {
    return err?.response?.data?.message || err?.message || fallback;
  };

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
      const updated = await deleteComment(
        ticket.id,
        commentId,
        adminUser.id,
        adminUser.role
      );
      setTicket(updated);
    } catch (err) {
      alert(getErrorMessage(err, "Failed to delete comment"));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading ticket...</div>;
  }

  if (!ticket) {
    return <div className="text-center py-12 text-slate-600">Ticket not found</div>;
  }

  const isOpen = ticket.status === "OPEN";
  const isInProgress = ticket.status === "IN_PROGRESS";
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
    "rounded-2xl text-white font-bold px-4 py-3 transition inline-flex items-center justify-center gap-2";
  const disabledClass = "bg-slate-300 cursor-not-allowed";

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/admin/tickets"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={18} />
          Back to all tickets
        </Link>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
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

            <h1 className="text-3xl font-black text-slate-900">{ticket.subject}</h1>
            <p className="text-slate-600 mt-3">{ticket.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">Reporter</p>
                <p className="text-slate-600 mt-1">{ticket.reporterName}</p>
                <p className="text-slate-500">{ticket.reporterEmail}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">Request info</p>
                <p className="text-slate-600 mt-1">{ticket.requestTitle}</p>
                <p className="text-slate-500">{ticket.campus}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">Contact</p>
                <p className="text-slate-600 mt-1">{ticket.contactNo}</p>
                <p className="text-slate-500">{ticket.regNo}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="font-semibold text-slate-800">Technician</p>
                <p className="text-slate-600 mt-1">{ticket.technicianId || "Not assigned"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ticket.attachments?.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Paperclip size={18} className="text-slate-600" />
            <h2 className="text-xl font-black text-slate-900">Attachments</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {ticket.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={toAbsoluteFileUrl(attachment.fileUrl)}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {attachment.originalFilename}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6 space-y-5">
          <h2 className="text-xl font-black text-slate-900">Admin actions</h2>

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

        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6 space-y-5">
          <h2 className="text-xl font-black text-slate-900">Technician & resolution</h2>

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
              className="w-full mt-2 rounded-2xl border border-slate-300 px-4 py-3 min-h-[140px]"
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

      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-slate-600" />
          <h2 className="text-xl font-black text-slate-900">Comments</h2>
        </div>

        {ticket.comments?.length > 0 ? (
          <div className="space-y-3 mb-5">
            {ticket.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">
                      {comment.authorName}{" "}
                      <span className="text-xs text-slate-500">({comment.authorRole})</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "-"}
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
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {editingComment[comment.id] !== undefined ? (
                  <div className="mt-3 space-y-3">
                    <textarea
                      value={editingComment[comment.id]}
                      onChange={(e) =>
                        setEditingComment((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold"
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
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 mt-3">{comment.message}</p>
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
            placeholder="Add a new admin/staff comment..."
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3"
          />
          <button
            onClick={handleAddComment}
            className="rounded-2xl bg-slate-900 hover:bg-black text-white font-bold px-5 py-3"
          >
            Add comment
          </button>
        </div>
      </div>
    </div>
  );
}