import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import JobModal from '../components/JobModal';
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';

interface DashboardItem {
    _id: string;
    // Common fields
    status?: string;
    createdAt: string;
    
    // Application/Contact fields
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    message?: string;
    about?: string;
    resumeLink?: string;
    
    // Job Listing fields
    title?: string;
    department?: string;
    location?: string;
    type?: string;
    isActive?: boolean;
    salary?: string;
    description?: string;
    responsibilities?: string[];
    requirements?: string[];
}

// ─── Portal Dropdown ──────────────────────────────────────────────────────────
interface StatusDropdownProps {
    itemId: string;
    currentStatus?: string;
    anchorEl: HTMLButtonElement | null;
    onSelect: (status: string) => void;
    onClose: () => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, anchorEl, onSelect, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Position relative to the anchor button using fixed coords
    const rect = anchorEl?.getBoundingClientRect();
    const top = rect ? rect.bottom + 6 : 0;
    const right = rect ? window.innerWidth - rect.right : 0;

    useEffect(() => {
        const handleOutside = (e: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                anchorEl && !anchorEl.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [anchorEl, onClose]);

    const statusOptions = [
        { value: 'PENDING',  color: 'text-yellow-400' },
        { value: 'REVIEWED', color: 'text-green-400' },
        { value: 'REJECTED', color: 'text-red-400' },
    ];

    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            style={{ position: 'fixed', top, right, zIndex: 9999 }}
            className="w-36 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
            {statusOptions.map(({ value, color }) => (
                <button
                    key={value}
                    onClick={() => onSelect(value)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/5 ${color} ${currentStatus === value ? 'bg-white/5' : ''}`}
                >
                    {value}
                </button>
            ))}
        </div>,
        document.body
    );
};
// ─────────────────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'applications' | 'jobs'>('contacts');
    const [data, setData] = useState<DashboardItem[]>([]);
    const navigate = useNavigate();
    const { fetchDashboardData, updateItemStatus, createJob, updateJob, deleteJob, loading } = useAdmin();
    
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<DashboardItem | null>(null);

    // Track which row's dropdown is open + its anchor button element
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const loadItems = useCallback(async (tab: string) => {
        try {
            const result = await fetchDashboardData(tab);
            setData(result);
        } catch (error) {
            console.error('Fetch error:', error);
            if ((error as Error).message === 'Unauthorized') {
                localStorage.removeItem('adminToken');
                navigate('/admin');
            }
        }
    }, [fetchDashboardData, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        loadItems(activeTab);
    }, [activeTab, loadItems, navigate]);

    const handleToggleDropdown = (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
        if (openDropdownId === itemId) {
            setOpenDropdownId(null);
            setAnchorEl(null);
        } else {
            setOpenDropdownId(itemId);
            setAnchorEl(e.currentTarget);
        }
    };

    const handleStatusSelect = async (id: string, tab: string, newStatus: string) => {
        setOpenDropdownId(null);
        setAnchorEl(null);
        try {
            const success = await updateItemStatus(id, tab, newStatus);
            if (success) loadItems(activeTab);
        } catch (error) {
            console.error('Update error:', error);
            if ((error as Error).message === 'Unauthorized') {
                navigate('/admin');
            }
        }
    };

    const handleToggleJobStatus = async (id: string, currentIsActive: boolean) => {
        try {
            await updateJob(id, { isActive: !currentIsActive });
            loadItems(activeTab);
        } catch (error) {
            console.error('Toggle status error:', error);
        }
    };

    const handleCreateJob = async (jobData: any) => {
        try {
            await createJob(jobData);
            loadItems(activeTab);
        } catch (error) {
            console.error('Create job error', error);
            alert('Failed to create job');
        }
    };

    const handleUpdateJob = async (jobData: any) => {
        if (!editingJob) return;
        try {
            await updateJob(editingJob._id, jobData);
            loadItems(activeTab);
            setEditingJob(null);
        } catch (error) {
            console.error('Update job error', error);
            alert('Failed to update job');
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this job listing?')) return;
        try {
            await deleteJob(id);
            loadItems(activeTab);
        } catch (error) {
            console.error('Delete job error', error);
            alert('Failed to delete job');
        }
    };

    const openCreateModal = () => {
        setEditingJob(null);
        setIsJobModalOpen(true);
    };

    const openEditModal = (job: DashboardItem) => {
        setEditingJob(job);
        setIsJobModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const renderTableHeaders = () => {
        if (activeTab === 'jobs') {
            return (
                <tr>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Position</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Details</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Posted Date</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400 text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400 text-right">Actions</th>
                </tr>
            );
        }
        return (
            <tr>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Name / Role</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Details</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Date</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400 text-center">Status</th>
            </tr>
        );
    };

    const statusBadgeClass = (status?: string) => {
        if (status === 'PENDING')  return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30';
        if (status === 'REVIEWED') return 'bg-green-500/20 text-green-400 hover:bg-green-500/30';
        if (status === 'REJECTED') return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
        return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30';
    };

    return (
        <div className="min-h-screen bg-[#0d0d1a] px-6 pb-6 pt-32 md:px-10 md:pb-10 md:pt-40 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-6 py-2 rounded-lg font-medium transition-colors border border-red-500/20 w-fit"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div className="flex flex-wrap gap-2 md:gap-4 w-full lg:w-auto">
                        {['contacts', 'applications', 'jobs'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-xl font-bold transition-all ${activeTab === tab
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    
                    {activeTab === 'jobs' && (
                        <button
                            onClick={openCreateModal}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 md:py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 w-full lg:w-auto"
                        >
                            <Plus size={20} />
                            <span>Create New Job</span>
                        </button>
                    )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            {renderTableHeaders()}
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400">Loading data...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-20 text-center text-gray-400">No records found.</td></tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                        {activeTab === 'jobs' ? (
                                            <>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="text-white text-lg">{item.title}</div>
                                                    <div className="text-sm text-purple-400">{item.department}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{item.type} • {item.location}</div>
                                                </td>
                                                <td className="px-6 py-6 text-sm text-gray-400 max-w-xs truncate">
                                                    {item.description}
                                                </td>
                                                <td className="px-6 py-6 text-gray-400 text-sm">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    <button
                                                        onClick={() => handleToggleJobStatus(item._id, item.isActive || false)}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${item.isActive
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-gray-500/20 text-gray-400'
                                                            }`}
                                                    >
                                                        {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button 
                                                            onClick={() => openEditModal(item)}
                                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteJob(item._id)}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="text-white">{item.name || item.role}</div>
                                                    <div className="text-sm text-gray-400">{item.email}</div>
                                                    {item.phone && <div className="text-sm text-gray-500">{item.phone}</div>}
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="text-sm text-gray-300">{item.message || item.about}</div>
                                                    {item.resumeLink && (
                                                        <a href={item.resumeLink} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-1 inline-block">
                                                            View Resume
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 text-gray-400 text-sm">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    {/* Status badge — triggers portal dropdown */}
                                                    <button
                                                        onClick={(e) => handleToggleDropdown(e, item._id)}
                                                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${statusBadgeClass(item.status)}`}
                                                    >
                                                        {item.status || 'PENDING'}
                                                        <ChevronDown
                                                            size={12}
                                                            className={`transition-transform ${openDropdownId === item._id ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>

                                                    {/* Portal dropdown — renders directly on <body>, outside all overflow contexts */}
                                                    {openDropdownId === item._id && (
                                                        <StatusDropdown
                                                            itemId={item._id}
                                                            currentStatus={item.status}
                                                            anchorEl={anchorEl}
                                                            onSelect={(status) => handleStatusSelect(item._id, activeTab, status)}
                                                            onClose={() => { setOpenDropdownId(null); setAnchorEl(null); }}
                                                        />
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <JobModal
                isOpen={isJobModalOpen}
                onClose={() => setIsJobModalOpen(false)}
                onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
                initialData={editingJob}
                title={editingJob ? 'Edit Job' : 'Create New Job'}
            />
        </div>
    );
};

export default AdminDashboard;
