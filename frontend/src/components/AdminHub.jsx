import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Settings,
  ArrowRight,
  Building2,
  MessageSquareMore,
  Users,
  Ticket,
  ClipboardList,
} from "lucide-react";

const AdminHub = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Booking Management",
      description: "Review, approve, or reject incoming resource requests.",
      icon: CalendarCheck,
      path: "/admin/bookings",
      color: "from-indigo-500 to-blue-600",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Ticket Management",
      description: "Monitor maintenance tickets, comments, status changes, and technician updates.",
      icon: Ticket,
      path: "/admin/tickets",
      color: "from-cyan-500 to-sky-600",
      lightColor: "bg-cyan-50",
      textColor: "text-cyan-600",
    },
    {
      title: "Confirmed Bookings",
      description: "Access and review the verified master booking schedule.",
      icon: ClipboardList,
      path: "/admin/confirmed-bookings",
      color: "from-emerald-500 to-teal-600",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Resource Catalogue",
      description: "Manage facilities, lecture halls, labs, and other resources.",
      icon: Building2,
      path: "/admin/catalogue",
      color: "from-amber-500 to-orange-600",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "User Feedback",
      description: "Analyze student satisfaction and service-related feedback.",
      icon: MessageSquareMore,
      path: "/admin/feedback",
      color: "from-rose-500 to-pink-600",
      lightColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
    {
      title: "User Management",
      description: "Manage student accounts, roles, and access permissions.",
      icon: Users,
      path: "/admin/users",
      color: "from-purple-500 to-fuchsia-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 mb-4">
            <ShieldBadge />
            Operations Control Center
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                Admin Portal
              </h1>
              <p className="mt-4 text-slate-600 max-w-2xl text-base md:text-lg">
                Welcome, Administrator. Monitor and manage all campus resource
                operations from this centralized hub.
              </p>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm px-6 py-5 min-w-[260px]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-3 text-white">
                  <LayoutDashboard size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Admin Workspace</p>
                  <p className="text-lg font-bold text-slate-900">SwiftFix Control</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;

            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className="group relative bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 text-left overflow-hidden"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.color}`}
                />

                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${item.lightColor} mb-6`}
                >
                  <Icon className={`${item.textColor}`} size={30} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                  Launch Module
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ShieldBadge = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="text-indigo-700"
  >
    <path
      d="M12 3L19 6V11C19 16 15.5 20.5 12 21C8.5 20.5 5 16 5 11V6L12 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 12L11.2 13.7L14.8 10.1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AdminHub;