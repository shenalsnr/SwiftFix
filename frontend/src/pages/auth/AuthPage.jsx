import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Upload, GraduationCap } from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';

const AuthPage = () => {
    const navigate = useNavigate();
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
            
            const response = await axiosInstance.post('/api/auth/login', {
                emailOrId: loginForm.emailOrId,
                password: loginForm.password,
            });

            console.log('Login successful:', response.data);
            
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirect based on role
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student-catalogue');
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

            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Redirect based on role
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student-catalogue');
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col">
            {/* Header with SwiftFix Logo */}
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
            <div className="flex-1 flex items-center justify-center p-4 py-12">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/3 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                {/* Auth Card */}
                <div className="relative w-full max-w-md">
                    <div className="backdrop-blur-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-8 py-6 border-b border-gray-700/30">
                            <h2 className="text-2xl font-bold text-white text-center">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-400 text-center text-sm mt-1">
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
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email or Student ID
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                                            <input
                                                type="text"
                                                value={loginForm.emailOrId}
                                                onChange={(e) =>
                                                    setLoginForm({ ...loginForm, emailOrId: e.target.value })
                                                }
                                                placeholder="your@email.com or IT12345678"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                                            <input
                                                type="password"
                                                value={loginForm.password}
                                                onChange={(e) =>
                                                    setLoginForm({ ...loginForm, password: e.target.value })
                                                }
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-200"
                                    >
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </button>
                                </form>
                            ) : (
                                // Registration Form
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-500" size={20} />
                                            <input
                                                type="text"
                                                value={registerForm.fullName}
                                                onChange={(e) =>
                                                    setRegisterForm({ ...registerForm, fullName: e.target.value })
                                                }
                                                placeholder="John Doe"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Student ID
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
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={registerForm.email}
                                                onChange={(e) =>
                                                    setRegisterForm({ ...registerForm, email: e.target.value })
                                                }
                                                placeholder="user@email.com"
                                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Phone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 text-gray-500" size={20} />
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
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Address
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-gray-500" size={20} />
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
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Faculty
                                        </label>
                                        <select
                                            value={registerForm.faculty}
                                            onChange={(e) =>
                                                setRegisterForm({ ...registerForm, faculty: e.target.value })
                                            }
                                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            style={{
                                                backgroundColor: '#1a1a2e',
                                                color: 'white',
                                            }}
                                        >
                                            {faculties.map((faculty) => (
                                                <option
                                                    key={faculty}
                                                    value={faculty}
                                                    style={{
                                                        backgroundColor: '#1a1a2e',
                                                        color: 'white',
                                                    }}
                                                >
                                                    {faculty}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Profile Photo
                                        </label>
                                        <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-600/50 rounded-lg cursor-pointer hover:border-blue-500/50 transition">
                                            <div className="flex items-center gap-2">
                                                <Upload size={20} className="text-gray-400" />
                                                <span className="text-sm text-gray-400">
                                                    {profilePhotoName || 'Choose file'}
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
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
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
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
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
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition duration-200"
                                    >
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </button>
                                </form>
                            )}

                            {/* Divider */}
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-gray-600/50"></div>
                                <span className="px-3 text-sm text-gray-400">or</span>
                                <div className="flex-1 border-t border-gray-600/50"></div>
                            </div>

                            {/* Google Auth Button */}
                            <button
                                onClick={handleGoogleAuth}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 hover:border-blue-400 rounded-lg text-white font-semibold transition duration-200 hover:shadow-lg hover:shadow-blue-500/20"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path
                                        d="M12 6V12L15 15"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-700/30 px-8 py-4 bg-gray-900/50">
                            <p className="text-sm text-gray-400 text-center">
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError('');
                                    }}
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
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

