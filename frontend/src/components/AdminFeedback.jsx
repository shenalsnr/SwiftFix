import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MessageSquare, 
    Star, 
    ChevronLeft, 
    Calendar, 
    User, 
    Building2 
} from 'lucide-react';

const AdminFeedback = () => {
    const navigate = useNavigate();
    const [feedback, setFeedback] = React.useState([]);

    React.useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('swiftfix_feedback') || '[]');
        setFeedback(stored);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Sub-section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <button 
                            onClick={() => navigate('/admin')}
                            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-6 group"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Admin Hub
                        </button>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Student Feedback</h1>
                        <p className="text-gray-500 mt-1">Review student ratings and qualitative suggestions.</p>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="grid grid-cols-1 gap-6">
                    {feedback.length > 0 ? (
                        feedback.map((fb) => (
                            <div key={fb.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    {/* Left Side: Student Info & Stars */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                                <MessageSquare size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={14} 
                                                            className={i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                                        />
                                                    ))}
                                                    <span className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">{fb.rating}/5 Rating</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">Feedback from {fb.studentId}</h3>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                                                <Building2 size={16} className="text-gray-400" />
                                                {fb.department}
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                                                <Calendar size={16} className="text-gray-400" />
                                                {fb.date}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Message Bubble */}
                                    <div className="flex-1 md:max-w-xl">
                                        <div className="bg-gray-50 rounded-2xl p-6 relative">
                                            {/* Speech bubble tail for larger screens */}
                                            <div className="hidden md:block absolute -left-2 top-6 w-4 h-4 bg-gray-50 rotate-45 transform"></div>
                                            <p className="text-gray-700 leading-relaxed italic text-sm">
                                                "{fb.message}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Student Feedback Yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">Real responses from the student homepage will appear here automatically as they are submitted.</p>
                        </div>
                    )}
                </div>

                {/* Total Stats Summary */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 text-center shadow-sm transition-all hover:scale-105">
                        <div className="text-3xl font-black text-indigo-600 mb-1">
                            {feedback.length > 0 
                                ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length).toFixed(1) 
                                : '0.0'}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Average Rating</div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 text-center shadow-sm transition-all hover:scale-105">
                        <div className="text-3xl font-black text-emerald-600 mb-1">
                            {feedback.length > 0 ? '100%' : '0%'}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Response Rate</div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 text-center shadow-sm transition-all hover:scale-105">
                        <div className="text-3xl font-black text-sky-600 mb-1">
                            {feedback.length}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Suggestions</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFeedback;
