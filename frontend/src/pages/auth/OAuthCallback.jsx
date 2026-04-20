import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap } from 'lucide-react';

/**
 * OAuthCallback
 * 
 * This page is the landing target after a successful Google OAuth2 login.
 * The backend redirects here with token, userId, role, email, and fullName
 * as URL query parameters. We store them in localStorage and update the
 * AuthContext state so the rest of the app treats the user as authenticated.
 */
const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login: _unused, ...authContext } = useAuth();
    const [status, setStatus] = useState('Processing your Google sign-in...');
    const [error, setError] = useState('');

    useEffect(() => {
        const token    = searchParams.get('token');
        const userId   = searchParams.get('userId');
        const role     = searchParams.get('role');
        const email    = searchParams.get('email');
        const fullName = searchParams.get('fullName');
        const err      = searchParams.get('error');

        if (err) {
            setError('Google sign-in failed: ' + err);
            setTimeout(() => navigate('/auth'), 3000);
            return;
        }

        if (!token) {
            setError('No authentication token received. Redirecting to login...');
            setTimeout(() => navigate('/auth'), 3000);
            return;
        }

        // Persist auth data to localStorage — same keys the rest of the app uses
        localStorage.setItem('token',  token);
        localStorage.setItem('role',   role  || 'USER');
        localStorage.setItem('user',   JSON.stringify({
            userId:   userId   || null,
            email:    email    || '',
            fullName: fullName || '',
        }));

        setStatus('Sign-in successful! Redirecting...');

        // Short delay so the user sees the success message, then navigate
        setTimeout(() => {
            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student-catalogue');
            }
        }, 1000);
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                        <GraduationCap className="text-white" size={32} />
                    </div>
                    <span className="text-3xl font-bold text-white">
                        Swift<span className="text-blue-400">Fix</span>
                    </span>
                </div>

                {error ? (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 max-w-sm mx-auto">
                        <p className="text-red-300 font-medium">{error}</p>
                        <p className="text-gray-400 text-sm mt-2">Redirecting to login...</p>
                    </div>
                ) : (
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 max-w-sm mx-auto backdrop-blur-xl">
                        {/* Spinner */}
                        <div className="flex justify-center mb-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                        <p className="text-white font-semibold text-lg">{status}</p>
                        <p className="text-gray-400 text-sm mt-2">Please wait a moment...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;
