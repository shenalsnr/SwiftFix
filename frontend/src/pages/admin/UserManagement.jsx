import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminUserService } from '../../services/adminUserService';
import { 
    Users, 
    UserPlus, 
    Edit2, 
    Trash2, 
    Shield, 
    Mail, 
    Phone, 
    MapPin, 
    Building2,
    ChevronLeft,
    X,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        faculty: '',
        role: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminUserService.getAllUsers();
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please make sure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setFormData({
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            faculty: user.faculty || '',
            role: user.role || 'USER'
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await adminUserService.updateUser(currentUser.id, formData);
            setSuccess('User updated successfully!');
            setIsEditModalOpen(false);
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user.');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await adminUserService.deleteUser(currentUser.id);
            setSuccess('User deleted successfully!');
            setIsDeleteModalOpen(false);
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user.');
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
            TECHNICIAN: 'bg-blue-100 text-blue-800 border-blue-200',
            USER: 'bg-green-100 text-green-800 border-green-200',
        };
        return `px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[role] || 'bg-gray-100 text-gray-800'}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-bold animate-pulse">Initializing Management Console...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 font-sans">
            {/* Header section */}
            <div className="mb-10">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-all mb-4 group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Control Center
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">
                            User <span className="text-indigo-600">Management</span>
                        </h1>
                        <p className="text-gray-500 font-medium italic">Monitor, authorize, and manage campus user identities.</p>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <CheckCircle className="text-emerald-500" size={20} />
                    <p className="text-emerald-800 font-bold text-sm">{success}</p>
                </div>
            )}
            {error && (
                <div className="mb-6 bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="text-rose-500" size={20} />
                    <p className="text-rose-800 font-bold text-sm">{error}</p>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                                <th className="px-8 py-6">User Information</th>
                                <th className="px-8 py-6">Identity & Contact</th>
                                <th className="px-8 py-6">System Access</th>
                                <th className="px-8 py-6 text-center">Control Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl">
                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 text-lg tracking-tight">{user.fullName}</div>
                                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{user.studentId || 'NO-ID-ASSIGNED'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Mail size={14} className="text-gray-300" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Building2 size={14} className="text-gray-300" /> {user.faculty || 'Unassigned Faculty'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={getRoleBadge(user.role)}>{user.role}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <button 
                                                onClick={() => handleEditClick(user)}
                                                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
                                                title="Edit User"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(user)}
                                                className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:shadow-lg transition-all duration-300"
                                                title="Revoke Access"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="py-20 text-center">
                        <Users className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold italic">No active personnel records found.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-indigo-600 p-8 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-white tracking-tight">Modify Identity</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Full Legal Name</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Assigned Role</label>
                                        <select 
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="TECHNICIAN">TECHNICIAN</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Faculty</label>
                                        <input 
                                            type="text" 
                                            name="faculty"
                                            value={formData.faculty}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Number</label>
                                    <input 
                                        type="text" 
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Physical Address</label>
                                    <textarea 
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700 resize-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl border border-gray-200 text-gray-500 font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Revoke Access?</h2>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                You are about to permanently delete <span className="font-black text-gray-900">{currentUser?.fullName}'s</span> account. This action cannot be undone.
                            </p>
                        </div>
                        <div className="p-8 bg-gray-50 flex gap-4">
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-6 py-4 rounded-2xl bg-white border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteUser}
                                className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/30 transition-all"
                            >
                                Confirm Revoke
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
