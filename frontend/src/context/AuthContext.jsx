import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on app load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (storedToken && storedUser && storedRole) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (emailOrId, password) => {
        try {
            const response = await authService.login({ emailOrId, password });
            const { token, role, userId, email, fullName } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify({ userId, email, fullName }));

            // Update state
            setToken(token);
            setRole(role);
            setUser({ userId, email, fullName });
            setIsAuthenticated(true);

            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const adminLogin = async (emailOrId, password) => {
        try {
            const response = await authService.adminLogin({ emailOrId, password });
            const { token, role, userId, email, fullName } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify({ userId, email, fullName }));

            // Update state
            setToken(token);
            setRole(role);
            setUser({ userId, email, fullName });
            setIsAuthenticated(true);

            return response.data;
        } catch (error) {
            console.error('Admin Login failed:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            const { token, role, userId, email, fullName } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify({ userId, email, fullName }));

            // Update state
            setToken(token);
            setRole(role);
            setUser({ userId, email, fullName });
            setIsAuthenticated(true);

            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        setToken(null);
        setRole(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                token,
                role,
                loading,
                login,
                adminLogin,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
