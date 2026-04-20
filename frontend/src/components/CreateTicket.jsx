import { useMemo, useState } from "react";
import { createTicket } from "../services/ticketService";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertTriangle,
  Send,
  UploadCloud,
  ArrowLeft,
  Ticket,
  X,
  Building2,
  ShieldAlert,
} from "lucide-react";

const REQUEST_TITLES = [
  "Technical Support",
  "Student Services",
  "Finance & Payments",
  "Academic Affairs",
  "Examinations Division",
  "Facilities & Estates",
];

const CAMPUSES = [
  "Malabe Campus",
  "Kandy Center",
  "Matara Center",
  "Kurunegala Center",
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const getCurrentUser = () => {
  const savedUserId = localStorage.getItem("swiftfix_user_id") || "user1";
  const savedName = localStorage.getItem("swiftfix_user_name") || "Student User";
  return { id: savedUserId, name: savedName, role: "USER" };
};

export default function CreateTicket() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    regNo: "",
    contactNo: "",
    requestTitle: "",
    campus: "",
    subject: "",
    message: "",
    priority: "MEDIUM",
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full mt-1.5 px-4 py-3 rounded-2xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition";

  const getErrorMessage = (err) => {
    const data = err?.response?.data;
    if (data?.errors) {
      return Object.values(data.errors).join("\n");
    }
    return data?.message || err.message || "Could not submit ticket";
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    const combined = [...files, ...selected].slice(0, 3);
    setFiles(combined);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
        requestTitle: form.requestTitle.trim(),
        campus: form.campus.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        priority: form.priority,
        userId: currentUser.id,
      };

      await createTicket(payload, files);
      navigate("/tickets");
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-2xl">
        <div className="px-8 py-10 md:px-10 md:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-semibold mb-5">
              <Ticket size={16} />
              SwiftFix Ticket System
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              Submit a maintenance or support request
            </h1>
            <p className="mt-4 text-white/90 text-base md:text-lg leading-7 max-w-2xl">
              Report campus issues quickly with clear details, priority level, and image
              evidence so the admin team can take action faster.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
            <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/80">Workflow</p>
              <p className="text-xl font-black mt-1">OPEN → RESOLVED</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/80">Attachments</p>
              <p className="text-xl font-black mt-1">Up to 3 images</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={18} />
          Back to my tickets
        </Link>
      </div>

      <div className="grid xl:grid-cols-[1.25fr_0.75fr] gap-8">
        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6 md:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Ticket size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-600">Ticket Form</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Create a new ticket
              </h2>
              <p className="text-slate-500 mt-2">
                Fill all required details carefully to help the team resolve your issue
                faster.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">Full name *</label>
                <input
                  className={inputClass}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Email *</label>
                <input
                  className={inputClass}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Registration number *
                </label>
                <input
                  className={inputClass}
                  name="regNo"
                  value={form.regNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Contact number *</label>
                <input
                  className={inputClass}
                  name="contactNo"
                  value={form.contactNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Request title *</label>
                <select
                  className={inputClass}
                  name="requestTitle"
                  value={form.requestTitle}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select request title</option>
                  {REQUEST_TITLES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Campus / center *</label>
                <select
                  className={inputClass}
                  name="campus"
                  value={form.campus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select campus</option>
                  {CAMPUSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Priority *</label>
                <select
                  className={inputClass}
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  required
                >
                  {PRIORITIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Subject *</label>
                <input
                  className={inputClass}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Description *</label>
              <textarea
                className={`${inputClass} min-h-[180px] resize-y`}
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Describe the issue clearly. Include room, lab, equipment name, or exact location if possible."
              />
            </div>

            <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600">
                  <UploadCloud size={22} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Attachments</p>
                  <p className="text-sm text-slate-500">Upload up to 3 image files, 5MB each</p>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="block w-full text-sm text-slate-600"
              />

              {files.length > 0 && (
                <div className="mt-4 grid gap-3">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-7 py-3.5 shadow-lg shadow-indigo-600/20 transition"
            >
              <Send size={18} />
              {submitting ? "Submitting..." : "Submit ticket"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Helpful tips</h3>
                <p className="text-sm text-slate-500">Send better tickets, get faster action</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-600 leading-6">
              <li>Use a short, clear subject line.</li>
              <li>Add screenshots if the issue is visible on screen.</li>
              <li>Mention the exact room, lab, or equipment name.</li>
              <li>Choose the correct priority level.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] bg-slate-950 text-white shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black">Campus support flow</h3>
                <p className="text-sm text-slate-400">How the team handles tickets</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">1. Ticket submitted</div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">2. Admin review</div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">3. Technician assignment</div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">4. Resolution and closure</div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Current user</h3>
                <p className="text-sm text-slate-500">Linked identity used for this ticket</p>
              </div>
            </div>

            <p className="text-slate-700">
              <span className="font-semibold">User ID:</span> {currentUser.id}
            </p>
            <p className="text-slate-700 mt-1">
              <span className="font-semibold">Role:</span> {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}