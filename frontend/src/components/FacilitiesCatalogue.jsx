import React, { useState, useEffect } from 'react';
import { getResources, createResource, updateResource, deleteResource } from '../services/resourceService';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';

const FacilitiesCatalogue = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({ type: '', capacity: '', location: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentResource, setCurrentResource] = useState({ name: '', type: '', capacity: '', location: '', availabilityWindows: '', status: 'ACTIVE' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const fetchResources = async () => {
        try {
            const data = await getResources(filters);
            setResources(data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleInputChange = (e) => {
        setCurrentResource({ ...currentResource, [e.target.name]: e.target.value });
    };

    const openModal = (resource = null) => {
        if (resource) {
            setIsEditing(true);
            setCurrentResource(resource);
        } else {
            setIsEditing(false);
            setCurrentResource({ name: '', type: '', capacity: '', location: '', availabilityWindows: '', status: 'ACTIVE' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentResource({ name: '', type: '', capacity: '', location: '', availabilityWindows: '', status: 'ACTIVE' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateResource(currentResource.id, currentResource);
            } else {
                await createResource(currentResource);
            }
            fetchResources();
            setRefreshTrigger(prev => prev + 1);
            closeModal();
        } catch (error) {
            console.error('Error saving resource:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteResource(id);
                fetchResources();
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error('Error deleting resource:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <ResourceDashboard refreshTrigger={refreshTrigger} />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Facilities & Assets Catalogue</h2>
                    <p className="text-sm text-gray-500">Manage campus resources seamlessly.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    <Plus size={18} /> Add New Resource
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 flex-1 focus-within:ring-2 focus-within:ring-blue-100">
                    <Search className="text-gray-400 mr-2" size={18} />
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="w-full py-2 outline-none text-sm bg-transparent cursor-pointer text-gray-600"
                    >
                        <option value="">Filter by type (All)</option>
                        <option value="LECTURE_HALL">LECTURE_HALL</option>
                        <option value="LAB">LAB</option>
                        <option value="MEETING_ROOM">MEETING_ROOM</option>
                        <option value="EQUIPMENT">EQUIPMENT</option>
                    </select>
                </div>
                <div className="flex items-center w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 flex-1 focus-within:ring-2 focus-within:ring-blue-100">
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Min capacity"
                        value={filters.capacity}
                        onChange={handleFilterChange}
                        className="w-full py-2 outline-none text-sm"
                    />
                </div>
                <div className="flex items-center w-full md:w-auto bg-white border border-gray-200 rounded-lg px-3 flex-1 focus-within:ring-2 focus-within:ring-blue-100">
                    <Search className="text-gray-400 mr-2" size={18} />
                    <input
                        type="text"
                        name="location"
                        placeholder="Filter by location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        className="w-full py-2 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4 font-semibold uppercase tracking-wider">Name</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Type</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Capacity</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Location</th>
                            <th className="p-4 font-semibold uppercase tracking-wider">Status</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.length > 0 ? (
                            resources.map((res) => (
                                <tr key={res.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-gray-800">{res.name}</td>
                                    <td className="p-4 text-gray-600 text-sm">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">{res.type}</span>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">{res.capacity || 'N/A'}</td>
                                    <td className="p-4 text-gray-600 text-sm">{res.location || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${res.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => openModal(res)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition" title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(res.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500 text-sm">
                                    No resources found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Resource' : 'Add New Resource'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                                <input required type="text" name="name" value={currentResource.name} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g., Main Auditorium" />
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                                    <select required name="type" value={currentResource.type} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white cursor-pointer">
                                        <option value="" disabled>Select a type</option>
                                        <option value="LECTURE_HALL">LECTURE_HALL</option>
                                        <option value="LAB">LAB</option>
                                        <option value="MEETING_ROOM">MEETING_ROOM</option>
                                        <option value="EQUIPMENT">EQUIPMENT</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                    <input type="number" name="capacity" value={currentResource.capacity} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g., 200" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input type="text" name="location" value={currentResource.location} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g., Building A, Floor 2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Windows</label>
                                <input type="text" name="availabilityWindows" value={currentResource.availabilityWindows} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="e.g., Mon-Fri 08:00 - 18:00" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="status" value={currentResource.status} onChange={handleInputChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition">
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm cursor-pointer">
                                    {isEditing ? 'Save Changes' : 'Add Resource'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default FacilitiesCatalogue;
