import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    ShieldCheck, 
    Settings, 
    PieChart, 
    Users, 
    ArrowRight,
    ClipboardList,
    Building2,
    MessageSquareMore
} from 'lucide-react';

const AdminHub = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Active Resources', value: '24', icon: <Building2 size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Bookings', value: '142', icon: <CalendarCheck size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'System Health', value: '98%', icon: <ShieldCheck size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const menuItems = [
        {
            title: "Booking Management",
            description: "Review, approve, or reject incoming resource requests.",
            icon: <ClipboardList size={28} />,
            path: "/admin/bookings",
            color: "from-indigo-500 to-blue-600",
            lightColor: "bg-indigo-50",
            textColor: "text-indigo-600"
        },
        {
            title: "Confirmed Bookings",
            description: "Access and export the verified master schedule.",
            icon: <CalendarCheck size={28} />,
            path: "/admin/confirmed-bookings",
            color: "from-emerald-500 to-teal-600",
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Resource Catalogue",
            description: "Manage facilities, lockers, and parking inventory.",
            icon: <Building2 size={28} />,
            path: "/admin/catalogue",
            color: "from-amber-500 to-orange-600",
            lightColor: "bg-amber-50",
            textColor: "text-amber-600"
        },
        {
            title: "User Feedback",
            description: "Analyze student satisfaction and service reports.",
            icon: <MessageSquareMore size={28} />,
            path: "/admin/feedback",
            color: "from-rose-500 to-pink-600",
            lightColor: "bg-rose-50",
            textColor: "text-rose-600"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Admin Portal</span>
                            <span className="w-8 h-[1px] bg-gray-200"></span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Version 2.4.0</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
                            Operations <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 text-bold">Control Center</span>
                        </h1>
                        <p className="max-w-2xl text-lg text-gray-500 font-medium leading-relaxed">
                            Welcome, Administrator. Monitor and manage all campus resource operations from this centralized hub.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[180px]">
                                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-500 text-left overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-bl-[100px]`}></div>
                            
                            <div className={`${item.lightColor} ${item.textColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                {item.icon}
                            </div>
                            
                            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{item.title}</h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                                {item.description}
                            </p>
                            
                            <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${item.textColor} group-hover:gap-4 transition-all duration-500`}>
                                Launch Module <ArrowRight size={14} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminHub;
