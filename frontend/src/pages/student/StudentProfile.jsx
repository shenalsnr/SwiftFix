import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userProfileService } from '../../services/userProfileService';
import { User, Mail, Phone, MapPin, Building2, AlertCircle, CheckCircle, Loader, Upload } from 'lucide-react';

const UserProfile = () => {
    const { user: authUser, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        faculty: '',
        studentId: '',
        role: '',
        profilePhotoPath: '',
        notificationPreferences: {
            emailNotifications: true,
            bookingUpdates: true,
            resourceAvailability: true,
            systemAlerts: true,
        },
    });

    const [formData, setFormData] = useState(profileData);

    // Fetch current user data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await userProfileService.getCurrentUser();
                setProfileData(response.data);
                setFormData(response.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && token) {
            fetchUserProfile();
        }
    }, [isAuthenticated, token]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle notification preferences toggle
    const handleNotificationChange = (key) => {
        setFormData(prev => ({
            ...prev,
            notificationPreferences: {
                ...prev.notificationPreferences,
                [key]: !prev.notificationPreferences[key]
            }
        }));
    };

    // Handle profile update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const submitData = new FormData();
            submitData.append('fullName', formData.fullName || '');
            submitData.append('studentId', formData.studentId || '');
            submitData.append('phoneNumber', formData.phoneNumber || '');
            submitData.append('address', formData.address || '');
            submitData.append('faculty', formData.faculty || '');
            
            // Add notification preferences
            submitData.append('emailNotifications', formData.notificationPreferences.emailNotifications);
            submitData.append('bookingUpdates', formData.notificationPreferences.bookingUpdates);
            submitData.append('resourceAvailability', formData.notificationPreferences.resourceAvailability);
            submitData.append('systemAlerts', formData.notificationPreferences.systemAlerts);

            if (profilePhoto) {
                submitData.append('profilePhoto', profilePhoto);
            }

            const response = await userProfileService.updateUserProfile(submitData);
            setProfileData(response.data);
            setFormData(response.data);
            setIsEditing(false);
            setProfilePhoto(null);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel edit
    const handleCancel = () => {
        setFormData(profileData);
        setIsEditing(false);
        setError('');
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <User className="w-8 h-8 text-blue-600" />
                            User Profile
                        </h1>
                        <p className="text-gray-600">Manage your profile information and notification preferences</p>
                    </div>
                    {/* Profile Image Section */}
                    <div className="flex-shrink-0 text-center">
                        {profileData.profilePhotoPath ? (
                            <img 
                                src={profileData.profilePhotoPath} 
                                alt="Profile" 
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md mx-auto">
                                <span className="text-2xl font-bold text-blue-600">
                                    {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : <User className="w-8 h-8 text-blue-600" />}
                                </span>
                            </div>
                        )}
                        {isEditing && (
                            <div className="mt-2">
                                <label className="flex items-center gap-1 cursor-pointer bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors justify-center font-medium">
                                    <Upload className="w-3 h-3" />
                                    {profilePhoto ? 'File Selected' : 'Change Photo'}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                                    />
                                </label>
                                {profilePhoto && <p className="text-[10px] text-gray-500 mt-1 truncate max-w-[80px]">{profilePhoto.name}</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Alert Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-green-700">{success}</p>
                    </div>
                )}

                {/* Main Content */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Information Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Personal Information
                            </h2>
                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Enter your full name"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                        {profileData.fullName || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email Address
                                </label>
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                    {profileData.email || 'Not provided'}
                                </p>
                            </div>

                            {/* Student ID */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Student ID
                                </label>
                                {isEditing && profileData.studentId && profileData.studentId.startsWith('OAUTH2_') ? (
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Enter your real Student ID"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                        {profileData.studentId || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Role
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                        profileData.role === 'ADMIN' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {profileData.role || 'Not provided'}
                                    </span>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Enter your phone number"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                        {profileData.phoneNumber || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            {/* Faculty */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Building2 className="w-4 h-4 inline mr-1" />
                                    Faculty
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="faculty"
                                        value={formData.faculty}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Enter your faculty"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                        {profileData.faculty || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Address
                            </label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    placeholder="Enter your address"
                                    rows="3"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                    {profileData.address || 'Not provided'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Notification Preferences Card (Module D - Notifications) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                        <p className="text-gray-600 mb-4 text-sm">Control which notifications you want to receive</p>

                        <div className="space-y-4">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-600 mt-1">Receive email updates about your activity</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.notificationPreferences?.emailNotifications || false}
                                        onChange={() => handleNotificationChange('emailNotifications')}
                                        disabled={!isEditing}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Booking Updates */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Booking Updates</h3>
                                    <p className="text-sm text-gray-600 mt-1">Get notified about booking confirmations and changes</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.notificationPreferences?.bookingUpdates || false}
                                        onChange={() => handleNotificationChange('bookingUpdates')}
                                        disabled={!isEditing}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Resource Availability */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Resource Availability</h3>
                                    <p className="text-sm text-gray-600 mt-1">Be notified when resources you want become available</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.notificationPreferences?.resourceAvailability || false}
                                        onChange={() => handleNotificationChange('resourceAvailability')}
                                        disabled={!isEditing}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* System Alerts */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-gray-900">System Alerts</h3>
                                    <p className="text-sm text-gray-600 mt-1">Receive important system notifications and updates</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.notificationPreferences?.systemAlerts || false}
                                        onChange={() => handleNotificationChange('systemAlerts')}
                                        disabled={!isEditing}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
