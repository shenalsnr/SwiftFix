import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTicketsByUserId,
  addComment,
  updateComment,
  deleteComment,
  toAbsoluteFileUrl,
} from "../services/ticketService";
import {
  AlertCircle,
  MessageSquare,
  PlusCircle,
  Paperclip,
  Pencil,
  Trash2,
} from "lucide-react";

const getCurrentUser = () => {
  const savedUserId = localStorage.getItem("swiftfix_user_id") || "user1";
  const savedName = localStorage.getItem("swiftfix_user_name") || "Student User";
  return { id: savedUserId, name: savedName, role: "USER" };
};

const badgeMap = {
  OPEN: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-200 text-slate-700 border-slate-300",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export default function UserTickets() {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [editingComment, setEditingComment] = useState({});

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getTicketsByUserId(currentUser.id);
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

  const handleAddComment = async (ticketId) => {
    const message = (commentDrafts[ticketId] || "").trim();
    if (!message) return;

    try {
      const updated = await addComment(ticketId, {
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        message,
      });

      setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)));
      setCommentDrafts((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add comment");
    }
  };

  const handleUpdateComment = async (ticketId, commentId) => {
    const message = (editingComment[commentId] || "").trim();
    if (!message) return;

    try {
      const updated = await updateComment(ticketId, commentId, {
        editorId: currentUser.id,
        editorRole: currentUser.role,
        message,
      });

      setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)));
      setEditingComment((prev) => ({ ...prev, [commentId]: undefined }));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (ticketId, commentId) => {
    try {
      const updated = await deleteComment(ticketId, commentId, currentUser.id, currentUser.role);
      setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete comment");
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading tickets...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600">SwiftFix · Student panel</p>
          <h1 className="text-3xl font-black text-slate-900">My tickets</h1>
          <p className="text-slate-500 mt-2">
            Track progress, see admin replies, and continue the conversation.
          </p>
        </div>

        <Link
          to="/tickets/create"
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 shadow-lg"
        >
          <PlusCircle size={18} />
          Create ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-xl font-bold text-slate-800">No tickets yet</p>
          <p className="text-slate-500 mt-2">Create your first ticket to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${
                        badgeMap[ticket.status] || "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {ticket.status.replaceAll("_", " ")}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      #{ticket.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {ticket.priority}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900">{ticket.subject}</h2>
                  <p className="text-slate-600 mt-2">{ticket.description}</p>

                  <div className="grid md:grid-cols-2 gap-3 mt-5 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                      <p className="font-semibold text-slate-800">Request title</p>
                      <p className="text-slate-600 mt-1">{ticket.requestTitle}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                      <p className="font-semibold text-slate-800">Campus</p>
                      <p className="text-slate-600 mt-1">{ticket.campus}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                      <p className="font-semibold text-slate-800">Technician</p>
                      <p className="text-slate-600 mt-1">{ticket.technicianId || "Not assigned yet"}</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                      <p className="font-semibold text-slate-800">Created</p>
                      <p className="text-slate-600 mt-1">
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {(ticket.adminReply || ticket.rejectionReason || ticket.resolutionNotes) && (
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  {ticket.adminReply && (
                    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
                      <p className="font-bold text-blue-800">Admin reply</p>
                      <p className="text-blue-900/80 mt-2 text-sm">{ticket.adminReply}</p>
                    </div>
                  )}

                  {ticket.rejectionReason && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                      <p className="font-bold text-red-800">Rejection reason</p>
                      <p className="text-red-900/80 mt-2 text-sm">{ticket.rejectionReason}</p>
                    </div>
                  )}

                  {ticket.resolutionNotes && (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                      <p className="font-bold text-emerald-800">Resolution notes</p>
                      <p className="text-emerald-900/80 mt-2 text-sm">{ticket.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {ticket.attachments?.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Paperclip size={16} className="text-slate-500" />
                    <p className="font-bold text-slate-800">Attachments</p>
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

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-slate-600" />
                  <h3 className="font-black text-slate-900">Comments</h3>
                </div>

                {ticket.comments?.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {ticket.comments.map((comment) => {
                      const isOwner = comment.authorId === currentUser.id;

                      return (
                        <div
                          key={comment.id}
                          className="rounded-2xl bg-white border border-slate-200 p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div>
                              <p className="font-bold text-slate-800">
                                {comment.authorName}{" "}
                                <span className="text-xs text-slate-500">({comment.authorRole})</span>
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {comment.createdAt
                                  ? new Date(comment.createdAt).toLocaleString()
                                  : "-"}
                              </p>
                            </div>

                            {isOwner && (
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
                                  onClick={() => handleDeleteComment(ticket.id, comment.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
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
                                  onClick={() => handleUpdateComment(ticket.id, comment.id)}
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
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <AlertCircle size={16} />
                    No comments yet
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-3">
                  <textarea
                    value={commentDrafts[ticket.id] || ""}
                    onChange={(e) =>
                      setCommentDrafts((prev) => ({
                        ...prev,
                        [ticket.id]: e.target.value,
                      }))
                    }
                    placeholder="Write a follow-up comment..."
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 bg-white"
                  />
                  <button
                    onClick={() => handleAddComment(ticket.id)}
                    className="rounded-xl bg-slate-900 hover:bg-black text-white font-semibold px-5 py-3"
                  >
                    Add comment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}