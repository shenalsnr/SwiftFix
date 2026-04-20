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
  Ticket,
  Clock3,
  Wrench,
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

  const openCount = tickets.filter((ticket) => ticket.status === "OPEN").length;
  const progressCount = tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length;
  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "RESOLVED" || ticket.status === "CLOSED"
  ).length;

  if (loading) {
    return <div className="text-center py-14 text-slate-600 font-medium">Loading tickets...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-900 text-white shadow-2xl">
        <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div>
            <p className="text-sm font-semibold text-indigo-300 mb-3">SwiftFix · Student panel</p>
            <h1 className="text-3xl md:text-5xl font-black">My maintenance tickets</h1>
            <p className="text-slate-300 mt-4 max-w-2xl leading-7">
              Track ticket progress, review replies from admins, and continue the discussion
              from one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 w-full xl:max-w-2xl">
            <div className="rounded-3xl bg-white/10 border border-white/10 p-5">
              <p className="text-sm text-slate-300">Open</p>
              <p className="text-3xl font-black mt-1">{openCount}</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/10 p-5">
              <p className="text-sm text-slate-300">In progress</p>
              <p className="text-3xl font-black mt-1">{progressCount}</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/10 p-5">
              <p className="text-sm text-slate-300">Resolved / Closed</p>
              <p className="text-3xl font-black mt-1">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Ticket timeline</h2>
          <p className="text-slate-500 mt-1">
            View updates, attachments, admin replies, and your own comments.
          </p>
        </div>

        <Link
          to="/tickets/create"
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 shadow-lg shadow-indigo-600/20 transition"
        >
          <PlusCircle size={18} />
          Create ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
            <Ticket size={28} />
          </div>
          <p className="text-2xl font-black text-slate-800">No tickets yet</p>
          <p className="text-slate-500 mt-2">Create your first ticket to start tracking issues.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-[2rem] bg-white border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${
                          badgeMap[ticket.status] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {ticket.status.replaceAll("_", " ")}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <Ticket size={13} />
                        #{ticket.id}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        <Clock3 size={13} />
                        {ticket.priority}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900">{ticket.subject}</h3>
                    <p className="text-slate-600 mt-3 leading-7">{ticket.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
                  <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-sm font-semibold text-slate-500">Request title</p>
                    <p className="text-slate-900 font-bold mt-2">{ticket.requestTitle}</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-sm font-semibold text-slate-500">Campus</p>
                    <p className="text-slate-900 font-bold mt-2">{ticket.campus}</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-sm font-semibold text-slate-500">Technician</p>
                    <p className="text-slate-900 font-bold mt-2">
                      {ticket.technicianId || "Not assigned yet"}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-sm font-semibold text-slate-500">Created</p>
                    <p className="text-slate-900 font-bold mt-2 text-sm">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "-"}
                    </p>
                  </div>
                </div>

                {(ticket.adminReply || ticket.rejectionReason || ticket.resolutionNotes) && (
                  <div className="grid lg:grid-cols-3 gap-4 mt-8">
                    {ticket.adminReply && (
                      <div className="rounded-3xl bg-blue-50 border border-blue-200 p-5">
                        <p className="font-black text-blue-800">Admin reply</p>
                        <p className="text-blue-900/85 mt-2 text-sm leading-6">{ticket.adminReply}</p>
                      </div>
                    )}

                    {ticket.rejectionReason && (
                      <div className="rounded-3xl bg-red-50 border border-red-200 p-5">
                        <p className="font-black text-red-800">Rejection reason</p>
                        <p className="text-red-900/85 mt-2 text-sm leading-6">
                          {ticket.rejectionReason}
                        </p>
                      </div>
                    )}

                    {ticket.resolutionNotes && (
                      <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-5">
                        <p className="font-black text-emerald-800">Resolution notes</p>
                        <p className="text-emerald-900/85 mt-2 text-sm leading-6">
                          {ticket.resolutionNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {ticket.attachments?.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Paperclip size={16} className="text-slate-500" />
                      <p className="font-black text-slate-900">Attachments</p>
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

                <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <MessageSquare size={18} className="text-slate-600" />
                    <h4 className="text-xl font-black text-slate-900">Comments</h4>
                  </div>

                  {ticket.comments?.length > 0 ? (
                    <div className="space-y-4 mb-5">
                      {ticket.comments.map((comment) => {
                        const isOwner = comment.authorId === currentUser.id;

                        return (
                          <div
                            key={comment.id}
                            className="rounded-3xl bg-white border border-slate-200 p-4 md:p-5"
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

                              {isOwner && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      setEditingComment((prev) => ({
                                        ...prev,
                                        [comment.id]:
                                          prev[comment.id] !== undefined
                                            ? undefined
                                            : comment.message,
                                      }))
                                    }
                                    className="w-9 h-9 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center transition"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(ticket.id, comment.id)}
                                    className="w-9 h-9 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center transition"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
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
                                    onClick={() => handleUpdateComment(ticket.id, comment.id)}
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
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
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
                      className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 bg-white"
                    />
                    <button
                      onClick={() => handleAddComment(ticket.id)}
                      className="rounded-2xl bg-slate-900 hover:bg-black text-white font-bold px-5 py-3 transition"
                    >
                      Add comment
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 md:px-8 py-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Wrench size={16} />
                  Ticket managed through SwiftFix maintenance workflow
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}