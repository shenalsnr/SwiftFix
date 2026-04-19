import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        email: '',
        phoneNumber: '',
        address: '',
        faculty: 'COMPUTING',
        password: '',
        confirmPassword: '',
        profilePhotoPath: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const facultyOptions = [
        { value: 'COMPUTING', label: 'Faculty of Computing' },
        { value: 'BUSINESS', label: 'Faculty of Business' },
        { value: 'ENGINEERING', label: 'Faculty of Engineering' },
        { value: 'HUMANITIES_SCIENCES', label: 'Faculty of Humanities & Sciences' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // For now, store the file name. In production, you'd upload to a server
            setFormData((prev) => ({
                ...prev,
                profilePhotoPath: file.name,
            }));
        }
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.studentId.match(/^[A-Z]{2}\d{8}$/)) {
            setError('Student ID must be in format: IT12345678');
            return false;
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email');
            return false;
        }
        if (!formData.phoneNumber.match(/^\d{10,}$/)) {
            setError('Phone number must be at least 10 digits');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Address is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await register(formData);
            navigate('/student-catalogue');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Student ID *
                        </label>
                        <input
                            type="text"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            placeholder="IT12345678"
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="1234567890"
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Street Name, City"
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Faculty *
                        </label>
                        <select
                            name="faculty"
                            value={formData.faculty}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                        >
                            {facultyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Profile Photo (Optional)
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                        {formData.profilePhotoPath && (
                            <p className="text-sm text-gray-400 mt-2">Selected: {formData.profilePhotoPath}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
