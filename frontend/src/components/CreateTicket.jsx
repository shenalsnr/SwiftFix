import { useMemo, useState } from "react";
import { createTicket } from "../services/ticketService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AlertTriangle,
  Send,
  UploadCloud,
  ArrowLeft,
  Ticket,
  X,
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

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get the numeric userId the same way CreateBooking/MyBookings do
  const currentUserId = (() => {
    if (user?.userId != null) return String(user.userId);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub;
      }
    } catch (e) { }
    return 'unknown';
  })();

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
    "w-full mt-1.5 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500";

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

  const getErrorMessage = (err) => {
    const data = err?.response?.data;
    if (data?.errors) {
      return Object.values(data.errors).join("\n");
    }
    return data?.message || err.message || "Could not submit ticket";
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
        userId: currentUserId,
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft size={18} />
          Back to my tickets
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-indigo-100 text-indigo-700 p-3 rounded-2xl">
              <Ticket size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-600">SwiftFix · Maintenance</p>
              <h1 className="text-3xl font-black text-slate-900">Submit a support request</h1>
              <p className="text-slate-500 mt-2">
                Fill the form carefully and upload up to 3 image attachments.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="text-sm font-semibold text-slate-700">Registration number *</label>
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

              <div className="md:col-span-1">
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
              <label className="text-sm font-semibold text-slate-700">Message *</label>
              <textarea
                className={`${inputClass} min-h-[150px] resize-y`}
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <UploadCloud className="text-slate-500" size={24} />
                <div>
                  <p className="font-semibold text-slate-800">Attachments</p>
                  <p className="text-sm text-slate-500">Up to 3 images, 5MB each</p>
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
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold px-6 py-3 shadow-lg"
            >
              <Send size={18} />
              {submitting ? "Submitting..." : "Submit ticket"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-950 text-white p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-400" size={24} />
              <h2 className="text-xl font-black">Helpful tips</h2>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>Use a clear subject line.</li>
              <li>Add screenshots when the issue is visible.</li>
              <li>Include exact room, lab, or equipment details.</li>
              <li>Technical Support tickets usually need technician assignment.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg">
            <h3 className="text-lg font-black text-slate-900">Current user</h3>
            <p className="text-slate-600 mt-2">User ID: {currentUserId}</p>
            <p className="text-slate-600">Role: {user?.role || 'STUDENT'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}