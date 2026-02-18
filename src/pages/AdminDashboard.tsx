import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'applications' | 'jobs'>('contacts');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchItems = async (tab: string) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:9090/api/admin/${tab}`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(activeTab);
    }, [activeTab]);



    const updateStatus = async (id: string, tab: string, currentStatus: string) => {
        // Simple cycle for status update
        const nextStatus = currentStatus === 'PENDING' ? 'REVIEWED' : 'PENDING';

        try {
            let endpoint = '';
            if (tab === 'contacts') endpoint = `http://localhost:9090/api/admin/contacts/${id}`;
            else if (tab === 'applications') endpoint = `http://localhost:9090/api/admin/applications/${id}/status`;
            else if (tab === 'jobs') endpoint = `http://localhost:9090/api/admin/jobs/${id}/status`;

            if (!endpoint) return;

            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });

            if (res.ok) fetchItems(activeTab);
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d1a] p-6 md:p-10 pt-40 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                </div>

                <div className="flex space-x-4 mb-8">
                    {['contacts', 'applications', 'jobs'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab
                                ? 'bg-white text-black'
                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Name / Role</th>
                                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Details</th>
                                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Date</th>
                                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {loading ? (
                                    <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-400">Loading data...</td></tr>
                                ) : data.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-20 text-center text-gray-400">No records found.</td></tr>
                                ) : (
                                    data.map((item) => (
                                        <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-6 font-medium">
                                                <div className="text-white">{item.name || item.role}</div>
                                                <div className="text-sm text-gray-400">{item.email}</div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {item.message || item.about || (item.resumeLink && <a href={item.resumeLink} target="_blank" className="text-blue-400 hover:underline">View Resume</a>)}
                                            </td>
                                            <td className="px-6 py-6 text-gray-400 text-sm">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <button
                                                    onClick={() => activeTab !== 'jobs' && updateStatus(item._id, activeTab, item.status)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        item.status === 'REVIEWED' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                        }`}
                                                >
                                                    {item.status || 'ACTIVE'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
