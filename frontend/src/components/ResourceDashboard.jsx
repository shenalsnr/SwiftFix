import React, { useState, useEffect } from 'react';
import { getResourceStats } from '../services/resourceService';
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const ResourceDashboard = ({ refreshTrigger }) => {
    const [stats, setStats] = useState({ totalCount: 0, activeCount: 0, maintenanceCount: 0, typeBreakdown: {} });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getResourceStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching resource stats:", error);
            }
        };
        fetchStats();
    }, [refreshTrigger]);

    const activePercentage = stats.totalCount > 0 ? (stats.activeCount / stats.totalCount) * 100 : 0;
    const maintenancePercentage = stats.totalCount > 0 ? (stats.maintenanceCount / stats.totalCount) * 100 : 0;

    return (
        <div className="mb-0 font-sans">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resource Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                {/* Total Resources Card */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Resources</p>
                        <h4 className="text-3xl font-bold text-gray-800">{stats.totalCount}</h4>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Activity size={24} />
                    </div>
                </div>

                {/* Active Resources Card */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
                        <h4 className="text-3xl font-bold text-gray-800">{stats.activeCount}</h4>
                        <div className="w-full bg-gray-100 mt-2 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${activePercentage}%` }}></div>
                        </div>
                    </div>
                    <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle size={24} />
                    </div>
                </div>

                {/* Maintenance Resources Card */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div className="flex-1 mr-4">
                        <p className="text-sm font-medium text-gray-500 mb-1">Out of Service</p>
                        <h4 className="text-3xl font-bold text-gray-800">{stats.maintenanceCount}</h4>
                        <div className="w-full bg-gray-100 mt-2 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${maintenancePercentage}%` }}></div>
                        </div>
                    </div>
                    <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                </div>

            </div>

            {/* Type Breakdown CSS Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Type Breakdown</h4>
                <div className="space-y-4">
                    {Object.entries(stats.typeBreakdown || {}).map(([type, count]) => {
                        const bgColors = {
                            LECTURE_HALL: 'bg-indigo-500',
                            LAB: 'bg-teal-500',
                            MEETING_ROOM: 'bg-orange-500',
                            EQUIPMENT: 'bg-purple-500'
                        };
                        const displayColor = bgColors[type] || 'bg-blue-500';
                        const percentage = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;
                        return (
                            <div key={type} className="flex items-center group">
                                <div className="w-32 text-sm font-medium text-gray-600">{type}</div>
                                <div className="flex-1 ml-4 bg-gray-100 h-3 rounded-full overflow-hidden flex items-center">
                                    <div className={`${displayColor} h-3 rounded-full transition-all duration-700 ease-out`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <div className="w-10 text-right text-sm font-bold text-gray-700 ml-4 group-hover:text-blue-600 transition-colors">{count}</div>
                            </div>
                        );
                    })}
                    {Object.keys(stats.typeBreakdown || {}).length === 0 && (
                        <p className="text-sm text-gray-400 italic">No resource types available yet. Add some to see the breakdown!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceDashboard;
