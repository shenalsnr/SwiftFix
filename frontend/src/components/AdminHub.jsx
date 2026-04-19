import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck,
    CalendarCheck,
    Building2,
    ArrowRight,
    LayoutDashboard,
    CheckCircle,
    MessageSquare,
} from 'lucide-react';

const ADMIN_SECTIONS = [
    {
        title: 'Confirmed Bookings',
        description: 'View a strict list of all successfully approved and confirmed resource bookings.',
        icon: CheckCircle,
        color: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        borderColor: 'border-emerald-100',
        href: '/admin/confirmed-bookings',
        tag: 'Live Status'
    },
    {
        title: 'Booking Management',
        description: 'Review, approve or reject resource booking requests submitted by users.',
        icon: CalendarCheck,
        color: 'text-indigo-600',
        iconBg: 'bg-indigo-50',
        borderColor: 'border-indigo-100',
        href: '/admin/bookings',
        tag: 'Action Required'
    },
    {
        title: 'Facilities & Assets',
        description: 'Add, edit or remove campus resources such as lecture halls, labs and equipment.',
        icon: Building2,
        color: 'text-sky-600',
        iconBg: 'bg-sky-50',
        borderColor: 'border-sky-100',
        href: '/admin/catalogue',
        tag: 'Inventory'
    },
    {
        title: 'Student Feedback',
        description: 'Analyze ratings and detailed suggestions from students to improve campus facilities.',
        icon: MessageSquare,
        color: 'text-amber-600',
        iconBg: 'bg-amber-50',
        borderColor: 'border-amber-100',
        href: '/admin/feedback',
        tag: 'User Insights'
    },
];

const AdminHub = () => {
    return (
        <div className="min-h-[80vh] bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                            <ShieldCheck className="text-white" size={20} />
                        </div>
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Administrator Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
                        Control Center
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                        Welcome back to the SwiftFix management portal. Oversee campus resources, 
                        validate booking requests, and ensure seamless operations from one central dashboard.
                    </p>
                </div>



                {/* Section Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {ADMIN_SECTIONS.map(({ title, description, icon: Icon, color, iconBg, borderColor, href, tag }) => (
                        <Link
                            key={href}
                            to={href}
                            className={`group relative bg-white border ${borderColor} rounded-[2rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 transform hover:-translate-y-2 flex flex-col`}
                        >
                            {/* Card Tag */}
                            <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${iconBg} ${color}`}>
                                    {tag}
                                </span>
                            </div>

                            {/* Icon Wrapper */}
                            <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={28} className={color} />
                            </div>

                            {/* Text Content */}
                            <h2 className="text-xl font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                {title}
                            </h2>
                            <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-grow">
                                {description}
                            </p>

                            {/* CTA Link */}
                            <div className={`flex items-center gap-2 font-bold text-sm ${color}`}>
                                <span className="uppercase tracking-widest overflow-hidden group-hover:mr-2 transition-all">Launch Console</span>
                                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="mt-16 flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                        <LayoutDashboard size={14} className="text-indigo-600" />
                        <span className="text-xs font-bold text-gray-400 tracking-tighter uppercase">SwiftFix Operations Ecosystem</span>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">Secured Administrator Session &bull; 2026</p>
                </div>
            </div>
        </div>
    );
};

export default AdminHub;

