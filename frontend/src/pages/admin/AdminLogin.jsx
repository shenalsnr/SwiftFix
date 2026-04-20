import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, GraduationCap, ShieldCheck } from 'lucide-react';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-700/50 backdrop-blur-xl bg-gray-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                            <GraduationCap className="text-white" size={28} />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Swift<span className="text-blue-400">Fix</span>
                        </span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-40 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 -right-32 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                {/* Admin Auth Card */}
                <div className="relative w-full max-w-md z-10">
                    <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden">
                         {/* Card Header */}
                         <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 px-8 py-6 border-b border-gray-700/30 flex flex-col items-center">
                            <div className="bg-red-500/20 p-3 rounded-full mb-3 border border-red-500/30">
                                <ShieldCheck className="text-red-400" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white text-center">
                                Admin Portal
                            </h2>
                            <p className="text-gray-400 text-center text-sm mt-1">
                                Secure access for administrators only
                            </p>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Admin ID / Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 text-gray-500" size={20} />
                                        <input
                                            type="text"
                                            value={loginForm.emailOrId}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, emailOrId: e.target.value })
                                            }
                                            placeholder="admin@swiftfix.com"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                                        <input
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, password: e.target.value })
                                            }
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-8 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg shadow-red-500/20"
                                >
                                    {loading ? 'Authenticating...' : 'Access Admin Portal'}
                                </button>
                            </form>
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
            `}</style>
        </div>
    );
};

export default AdminLogin;
