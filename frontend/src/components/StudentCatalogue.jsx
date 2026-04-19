import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResources } from '../services/resourceService';
import { Search } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';

const StudentCatalogue = () => {
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({ type: '', capacity: '', location: '' });

    useEffect(() => {
        fetchResources();
    }, [filters, refreshTrigger]);

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

    const handleBook = (res) => {
        navigate('/book', { state: { selectedResource: res } });
    };

    return (
        <div className="space-y-6">
            <ResourceDashboard refreshTrigger={refreshTrigger} />
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Facilities & Assets Catalogue</h2>
                        <p className="text-sm text-gray-500">View and book campus resources.</p>
                    </div>
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
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleBook(res)}
                                                disabled={res.status === 'OUT_OF_SERVICE'}
                                                className={`px-4 py-2 font-medium rounded-lg transition ${res.status === 'OUT_OF_SERVICE' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
                                            >
                                                Book
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

            </div>
        </div>
    );
};

export default StudentCatalogue;
