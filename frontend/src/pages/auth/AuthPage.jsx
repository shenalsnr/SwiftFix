import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Upload, GraduationCap, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosConfig';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login, adminLogin } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profilePhotoName, setProfilePhotoName] = useState('');

    // Login form state
    const [loginForm, setLoginForm] = useState({
        emailOrId: '',
        password: '',
    });

    // Registration form state
    const [registerForm, setRegisterForm] = useState({
        fullName: '',
        studentId: '',
        email: '',
        phoneNumber: '',
        address: '',
        faculty: 'Faculty of Computing',
        password: '',
        confirmPassword: '',
        profilePhoto: null,
    });

    const faculties = [
        'Faculty of Computing',
        'Faculty of Business',
        'Faculty of Engineering',
        'Faculty of Humanities & Sciences',
    ];

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', { emailOrId: loginForm.emailOrId });
            
            // Check if it's the specific admin account to use the correct endpoint
            let responseData;
            if (loginForm.emailOrId === 'admin123@gmail.com') {
                responseData = await adminLogin(loginForm.emailOrId, loginForm.password);
            } else {
                responseData = await login(loginForm.emailOrId, loginForm.password);
            }

            console.log('Login successful:', responseData);
            
            const { role } = responseData;

            // Redirect based on role from database
            if (role === 'ADMIN') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/student-catalogue';
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.';
            console.error('Login error:', errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (!registerForm.fullName || !registerForm.studentId || !registerForm.email || 
            !registerForm.phoneNumber || !registerForm.address || !registerForm.password) {
            setError('All fields are required');
            return;
        }

        if (registerForm.password !== registerForm.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Log every field before sending
            console.log('\n========== REGISTRATION DATA ==========');
            console.log('Full Name: ' + registerForm.fullName);
            console.log('Student ID: ' + registerForm.studentId);
            console.log('Email: ' + registerForm.email);
            console.log('Phone: ' + registerForm.phoneNumber);
            console.log('Address: ' + registerForm.address);
            console.log('Faculty: ' + registerForm.faculty);
            console.log('Password: ' + registerForm.password.substring(0, 3) + '***');
            console.log('Confirm Password: ' + registerForm.confirmPassword.substring(0, 3) + '***');
            console.log('Profile Photo: ' + (registerForm.profilePhoto ? registerForm.profilePhoto.name + ' (' + registerForm.profilePhoto.size + ' bytes)' : 'None'));
            console.log('========================================\n');

            const formData = new FormData();
            formData.append('fullName', registerForm.fullName);
            formData.append('studentId', registerForm.studentId);
            formData.append('email', registerForm.email);
            formData.append('phoneNumber', registerForm.phoneNumber);
            formData.append('address', registerForm.address);
            formData.append('faculty', registerForm.faculty);
            formData.append('password', registerForm.password);
            formData.append('confirmPassword', registerForm.confirmPassword);
            
            if (registerForm.profilePhoto) {
                console.log('→ Adding profile photo to FormData: ' + registerForm.profilePhoto.name);
                formData.append('profilePhoto', registerForm.profilePhoto);
            }

            // IMPORTANT: Don't set Content-Type header
            // Let the browser handle FormData automatically
            console.log('→ Sending registration request to backend...');
            const response = await axiosInstance.post('/api/auth/register', formData);

            console.log('✅ Registration successful!');
            console.log('Response:', response.data);

            const { role } = response.data;

            // Redirect based on role
            if (role === 'ADMIN') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/student-catalogue';
            }
        } catch (err) {
            // Show actual error message from backend
            const errorMsg = err.response?.data?.message || 
                           err.message ||
                           'Registration failed. Please try again.';
            
            console.log('\n========== ERROR DETAILS ==========');
            console.log('Error Message: ' + errorMsg);
            console.log('Status Code: ' + (err.response?.status || 'No response'));
            console.log('Full Response:', err.response?.data);
            console.log('===================================\n');
            
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Handle file input
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhotoName(file.name);
            setRegisterForm({ ...registerForm, profilePhoto: file });
        }
    };

    // Google OAuth handler
    const handleGoogleAuth = () => {
        console.log('Redirecting to Google OAuth...');
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Header with SwiftFix Logo */}
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
                    <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Auth Card */}
                <div className="relative w-full max-w-md">
                    <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                        {/* Card Header */}
                        <div className="px-8 py-8 border-b border-gray-50 bg-gray-50/30">
                            <h2 className="text-3xl font-black text-gray-900 text-center tracking-tight">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-500 text-center text-sm font-medium mt-2">
                                {isLogin ? 'Sign in to access your dashboard' : 'Join SwiftFix today'}
                            </p>
                        </div>

                        {/* Form Content */}
                        <div className="p-8">
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                    {error}
                                </div>
                            )}

                            {isLogin ? (
                                // Login Form
                                <form onSubmit={handleLogin} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                            Email or User ID
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={loginForm.emailOrId}
                                                onChange={(e) =>
                                                    setLoginForm({ ...loginForm, emailOrId: e.target.value })
                                                }
                                                placeholder="your@email.com or IT12345678"
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
                                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98]"
                                    >
                                        {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                                    </button>
                                </form>
                            ) : (
                                // Registration Form
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            <input
                                                type="text"
                                                value={registerForm.fullName}
                                                onChange={(e) =>
                                                    setRegisterForm({ ...registerForm, fullName: e.target.value })
                                                }
                                                placeholder="John Doe"
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                                User ID
                                            </label>
                                            <input
                                                type="text"
                                                value={registerForm.studentId}
                                                onChange={(e) =>
                                                    setRegisterForm({
                                                        ...registerForm,
                                                        studentId: e.target.value.toUpperCase(),
                                                    })
                                                }
                                                placeholder="IT12345678"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={registerForm.email}
                                                onChange={(e) =>
                                                    setRegisterForm({ ...registerForm, email: e.target.value })
                                                }
                                                placeholder="user@email.com"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                                Phone
                                            </label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <input
                                                    type="tel"
                                                    value={registerForm.phoneNumber}
                                                    onChange={(e) =>
                                                        setRegisterForm({
                                                            ...registerForm,
                                                            phoneNumber: e.target.value,
                                                        })
                                                    }
                                                    placeholder="+1234567890"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                                Address
                                            </label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    value={registerForm.address}
                                                    onChange={(e) =>
                                                        setRegisterForm({
                                                            ...registerForm,
                                                            address: e.target.value,
                                                        })
                                                    }
                                                    placeholder="123 Street"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                            Faculty
                                        </label>
                                        <select
                                            value={registerForm.faculty}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, faculty: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                                        >
                                            {faculties.map((faculty) => (
                                                <option key={faculty} value={faculty}>
                                                    {faculty}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                            Profile Photo
                                        </label>
                                        <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                                            <div className="flex items-center gap-3">
                                                <Upload size={20} className="text-gray-400" />
                                                <span className="text-sm text-gray-400 font-bold">
                                                    {profilePhotoName || 'Upload Student Image'}
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                                Password
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <input
                                                    type="password"
                                                    value={registerForm.password}
                                                    onChange={(e) =>
                                                        setRegisterForm({
                                                            ...registerForm,
                                                            password: e.target.value,
                                                        })
                                                    }
                                                    placeholder="••••••••"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                                Confirm Password
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <input
                                                    type="password"
                                                    value={registerForm.confirmPassword}
                                                    onChange={(e) =>
                                                        setRegisterForm({
                                                            ...registerForm,
                                                            confirmPassword: e.target.value,
                                                        })
                                                    }
                                                    placeholder="••••••••"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98]"
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </form>
                            )}

                            {/* Divider */}
                            <div className="my-8 flex items-center">
                                <div className="flex-1 border-t border-gray-100"></div>
                                <span className="px-4 text-xs font-black uppercase tracking-widest text-gray-300">or</span>
                                <div className="flex-1 border-t border-gray-100"></div>
                            </div>

                            {/* Google Auth Button */}
                            <button
                                onClick={handleGoogleAuth}
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-xl text-gray-700 font-bold transition-all duration-300 shadow-sm hover:shadow-md group"
                            >
                                <svg
                                    className="w-5 h-5 transition-transform group-hover:scale-110"
                                    viewBox="0 0 48 48"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                </svg>
                                Continue with Google
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-50 px-8 py-6 bg-gray-50/50">
                            <p className="text-sm text-gray-500 font-medium text-center">
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-black transition-colors"
                                >
                                    {isLogin ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default AuthPage;

