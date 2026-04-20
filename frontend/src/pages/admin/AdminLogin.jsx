import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, GraduationCap, ShieldCheck, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { adminLogin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [loginForm, setLoginForm] = useState({
        emailOrId: '',
        password: '',
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting admin login with:', { emailOrId: loginForm.emailOrId });
            
            await adminLogin(loginForm.emailOrId, loginForm.password);
            
            console.log('Admin login successful!');
            navigate('/admin');
            
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Admin Login failed.';
            console.error('Admin Login error:', errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white">Swift<span className="text-blue-500">Fix</span></span>
                    </Link>
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-xs font-black uppercase tracking-widest">
                        <Home size={16} />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4 py-12">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-1/3 -right-32 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>

                {/* Admin Auth Card */}
                <div className="relative w-full max-w-md z-10">
                    <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                         {/* Card Header */}
                         <div className="px-8 py-8 border-b border-gray-50 bg-gray-50/30">
                            <h2 className="text-3xl font-black text-gray-900 text-center tracking-tight">
                                Admin Portal
                            </h2>
                            <p className="text-gray-500 text-center text-sm font-medium mt-2">
                                Secure access for system administrators
                            </p>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold animate-shake">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                        Admin ID / Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={loginForm.emailOrId}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, emailOrId: e.target.value })
                                            }
                                            placeholder="admin@swiftfix.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, password: e.target.value })
                                            }
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98]"
                                >
                                    {loading ? 'Verifying...' : 'Sign In to Admin Portal'}
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-50 px-8 py-6 bg-gray-50/50">
                            <p className="text-xs text-center text-gray-400 font-bold uppercase tracking-widest">
                                SwiftFix Security Protocol Active
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
            `}</style>
        </div>
    );
};

export default AdminLogin;
