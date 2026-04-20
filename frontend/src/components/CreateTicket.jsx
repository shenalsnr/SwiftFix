import { useState } from "react";
import { createTicket } from "../services/ticketService";
import { useNavigate, Link } from "react-router-dom";
import { AlertTriangle, Send, UploadCloud, ArrowLeft, Ticket } from "lucide-react";

/** Must match backend workflow: {@link TicketService} uses exact "Technical Support". */
const REQUEST_TITLES = [
  "Technical Support",
  "Student Services",
  "Finance & Payments",
  "Academic Affairs",
  "Examinations Division",
  "Facilities & Estates",
];

export default function CreateTicket() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    regNo: "",
    contactNo: "",
    requestTitle: "",
    campus: "",
    subject: "",
    message: "",
    priority: "",
    file: null,
    userId: "user1",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, file: e.target.files[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        regNo: form.regNo.trim(),
        contactNo: form.contactNo.trim(),
        requestTitle: form.requestTitle,
        subject: form.subject.trim(),
        campus: form.campus,
        message: form.message.trim(),
        userId: form.userId,
      };
      if (form.priority) payload.priority = form.priority;

      await createTicket(payload);
      navigate("/tickets");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors &&
          Object.values(err.response.data.errors).join(" ")) ||
        err.message;
      alert(msg || "Could not submit ticket. Check all fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-shadow";

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft size={18} />
          Back to my tickets
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-8 py-7 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur">
                <Ticket className="text-indigo-300" size={28} />
              </div>
              <div>
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
                  SwiftFix · Maintenance
                </p>
                <h1 className="text-2xl font-bold tracking-tight">Submit a support request</h1>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-xl">
              Your request is routed by <strong className="text-white">request title</strong>. Technical
              requests use a technician workflow; other offices follow a shorter review path.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200/80 px-4 py-3 text-amber-900 text-sm">
              <AlertTriangle className="shrink-0 mt-0.5" size={18} />
              <span>
                Choose the correct <strong>request title</strong> so your ticket reaches the right team.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">Full name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={input}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">Registration number *</label>
                <input
                  type="text"
                  name="regNo"
                  value={form.regNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g. IT23809642"
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Contact number *</label>
                <input
                  type="text"
                  name="contactNo"
                  value={form.contactNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 0771234567"
                  className={input}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Request title *</label>
              <p className="text-xs text-slate-500 mt-0.5 mb-1.5">
                Select the area that should handle this ticket (drives admin workflow).
              </p>
              <select
                name="requestTitle"
                value={form.requestTitle}
                onChange={handleChange}
                required
                className={input}
              >
                <option value="">Select request title</option>
                {REQUEST_TITLES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">Campus / center *</label>
                <select name="campus" value={form.campus} onChange={handleChange} required className={input}>
                  <option value="">Select campus</option>
                  <option value="Malabe">Malabe Campus</option>
                  <option value="Kandy">Kandy Center</option>
                  <option value="Matara">Matara Center</option>
                  <option value="Kurunegala">Kurunegala Center</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} className={input}>
                  <option value="">Default (medium)</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Subject *</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Short summary"
                className={input}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Message *</label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Describe the issue, location, and what you already tried…"
                className={input + " resize-y min-h-[120px]"}
              />
            </div>

            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-6 text-center">
              <UploadCloud className="mx-auto text-slate-400 mb-2" size={36} />
              <p className="text-sm font-medium text-slate-700">Attachment (optional)</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                File upload UI is kept for your workflow; full file storage can be wired to the API later.
              </p>
              <input
                type="file"
                onChange={handleFile}
                className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-sm file:font-medium hover:file:bg-indigo-700"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-6 py-3 font-semibold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-600/25"
              >
                <Send size={18} />
                {submitting ? "Submitting…" : "Submit request"}
              </button>
              <button
                type="reset"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
