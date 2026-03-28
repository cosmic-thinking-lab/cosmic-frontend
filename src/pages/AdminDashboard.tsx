import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import JobModal from '../components/JobModal';
import { Plus, Edit2, Trash2, ChevronDown, X, IndianRupee, Banknote, Users, AlertTriangle } from 'lucide-react';

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
    jobId?: { _id: string; title: string } | string;
    
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

    // Payment fields
    firstName?: string;
    lastName?: string;
    mobile?: string;
    serviceName?: string;
    amount?: number;
    orderId?: string;
    paymentId?: string;
    isManual?: boolean;
}

// ─── Manual Payment Modal ─────────────────────────────────────────────────────
interface ManualPaymentModalProps {
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
}

const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({ onClose, onSubmit, loading }) => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        serviceName: '',
        amount: '',
        notes: '',
        status: 'pending' as 'pending' | 'success' | 'failed',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.firstName || !form.email || !form.mobile || !form.serviceName || !form.amount) {
            setError('Please fill in all required fields.');
            return;
        }
        try {
            await onSubmit({ ...form, amount: Number(form.amount) });
        } catch (err: any) {
            setError(err.message || 'Failed to save payment.');
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            {/* Card */}
            <div className="relative w-full max-w-lg bg-[#12121f] border border-white/10 rounded-2xl shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                            <Banknote className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Add Manual Payment</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Record an offline / cash payment</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Service + Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-1 space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Service / Pay For *</label>
                            <input
                                name="serviceName"
                                value={form.serviceName}
                                onChange={handleChange}
                                placeholder="e.g. LMS for School"
                                className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount (₹) *</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    name="amount"
                                    type="number"
                                    min="1"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Customer Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name *</label>
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                            />
                        </div>
                    </div>

                    {/* Email + Mobile */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Email *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="client@example.com"
                            className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Mobile *</label>
                        <input
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Status *</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 transition-colors text-sm appearance-none cursor-pointer"
                        >
                            <option value="pending">Pending</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
                        <textarea
                            name="notes"
                            rows={3}
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Cash received on... / Cheque no. ..."
                            className="w-full bg-[#0a0a14]/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors text-sm resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 rounded-xl transition-colors border border-white/10 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-sm"
                        >
                            {loading ? 'Saving...' : 'Save Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── Portal Dropdown ──────────────────────────────────────────────────────────
interface StatusDropdownProps {
    itemId: string;
    currentStatus?: string;
    anchorEl: HTMLButtonElement | null;
    activeTab: 'contacts' | 'applications' | 'jobs' | 'payments';
    onSelect: (status: string) => void;
    onClose: () => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ currentStatus, anchorEl, activeTab, onSelect, onClose }) => {
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

    const statusOptions = activeTab === 'jobs' ? [
        { value: 'active',   color: 'text-green-400',  label: 'ACTIVE' },
        { value: 'inactive', color: 'text-gray-400',   label: 'INACTIVE' },
    ] : activeTab === 'applications' ? [
        { value: 'PENDING',  color: 'text-yellow-400' },
        { value: 'REVIEWED', color: 'text-blue-400' },
        { value: 'HIRED', color: 'text-green-400' },
        { value: 'ACCEPTED', color: 'text-emerald-400' },
        { value: 'REJECTED', color: 'text-red-400' },
    ] : activeTab === 'payments' ? [
        { value: 'pending', color: 'text-yellow-400' },
        { value: 'success', color: 'text-green-400' },
        { value: 'failed', color: 'text-red-400' },
    ] : [
        { value: 'pending', color: 'text-yellow-400' },
        { value: 'contacted', color: 'text-blue-400' },
        { value: 'resolved', color: 'text-slate-400' },
        { value: 'accepted', color: 'text-emerald-400' },
    ];

    // normalise so the current item always matches one of the option values
    const normalisedCurrent = activeTab === 'jobs'
        ? (currentStatus === 'true' || currentStatus === 'active' ? 'active' : 'inactive')
        : currentStatus;

    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            style={{ position: 'fixed', top, right, zIndex: 9999 }}
            className="w-36 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
            {statusOptions.map(({ value, color, label }: any) => (
                <button
                    key={value}
                    onClick={() => onSelect(value)}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/5 ${color} ${normalisedCurrent === value ? 'bg-white/5' : ''}`}
                >
                    {label ?? value}
                </button>
            ))}
        </div>,
        document.body
    );
};
// ─────────────────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'contacts' | 'applications' | 'jobs' | 'payments'>('contacts');
    const [data, setData] = useState<DashboardItem[]>([]);
    const navigate = useNavigate();
    const { fetchDashboardData, updateItemStatus, createJob, updateJob, deleteJob, createManualPayment, loading } = useAdmin();
    
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<DashboardItem | null>(null);
    const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<DashboardItem | null>(null);

    // Track which row's dropdown is open + its anchor button element
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    
    // Track which job's description is being viewed in the modal
    const [viewingDescJob, setViewingDescJob] = useState<DashboardItem | null>(null);

    const handleViewApplications = (jobId: string, item: DashboardItem) => {
        const params = new URLSearchParams();
        if (item.title)      params.set('title', item.title);
        if (item.department) params.set('dept',  item.department);
        if (item.location)   params.set('loc',   item.location);
        navigate(`/admin/jobs/${jobId}/applications?${params.toString()}`);
    };

    const loadItems = useCallback(async (tab: string) => {
        setData([]); // Clear previous tab's data so it doesn't render incorrectly while loading or if it fails
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
        try {
            await deleteJob(id);
            loadItems(activeTab);
            setJobToDelete(null);
        } catch (error) {
            console.error('Delete job error', error);
            alert('Failed to delete job');
        }
    };

    const handleCreateManualPayment = async (data: any) => {
        await createManualPayment(data);
        setIsManualPaymentModalOpen(false);
        loadItems('payments');
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
        if (activeTab === 'payments') {
            return (
                <tr>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Transaction</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Customer</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Amount</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400">Date</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-gray-400 text-center">Status</th>
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
        const lowerStatus = status?.toLowerCase();
        if (lowerStatus === 'pending')  return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30';
        if (lowerStatus === 'reviewed') return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30';
        if (lowerStatus === 'contacted') return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30';
        if (lowerStatus === 'hired' || lowerStatus === 'success') return 'bg-green-500/20 text-green-400 hover:bg-green-500/30';
        if (lowerStatus === 'accepted') return 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30';
        if (lowerStatus === 'resolved') return 'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30';
        if (lowerStatus === 'rejected' || lowerStatus === 'failed') return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
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
                        {['contacts', 'applications', 'jobs', 'payments'].map((tab) => (
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

                    {activeTab === 'payments' && (
                        <button
                            onClick={() => setIsManualPaymentModalOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 md:py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 w-full lg:w-auto"
                        >
                            <Plus size={20} />
                            <span>Add Manual Payment</span>
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
                                    <React.Fragment key={item._id}>
                                        <tr 
                                            className={`hover:bg-white/5 transition-colors ${activeTab === 'jobs' ? 'cursor-pointer group/row' : ''}`}
                                            onClick={() => {
                                                if (activeTab === 'jobs') handleViewApplications(item._id, item);
                                            }}
                                        >
                                        {activeTab === 'jobs' ? (
                                            <>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="text-white text-lg">{item.title}</div>
                                                    <div className="text-sm text-purple-400">{item.department}</div>
                                                    <div className="text-xs text-gray-500 mt-1">{item.type} • {item.location}</div>
                                                </td>
                                                <td className="px-6 py-6 text-sm text-gray-400 max-w-xs">
                                                    <div className="truncate">
                                                        {item.description}
                                                    </div>
                                                    {item.description && item.description.length > 50 && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setViewingDescJob(item); }}
                                                            className="text-purple-400 hover:text-purple-300 text-[10px] font-bold mt-1.5 uppercase transition-colors"
                                                        >
                                                            Show More
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 text-gray-400 text-sm">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    {/* Status dropdown — same portal system as other tabs */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleToggleDropdown(e, item._id); }}
                                                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                                            item.isActive
                                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                                        }`}
                                                    >
                                                        {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                        <ChevronDown
                                                            size={12}
                                                            className={`transition-transform ${openDropdownId === item._id ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>

                                                    {openDropdownId === item._id && (
                                                        <StatusDropdown
                                                            itemId={item._id}
                                                            currentStatus={item.isActive ? 'active' : 'inactive'}
                                                            anchorEl={anchorEl}
                                                            activeTab="jobs"
                                                            onSelect={(status) => handleStatusSelect(item._id, 'jobs', status)}
                                                            onClose={() => { setOpenDropdownId(null); setAnchorEl(null); }}
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button 
                                                            title="View Applications"
                                                            onClick={(e) => { e.stopPropagation(); handleViewApplications(item._id, item); }}
                                                            className="p-2 rounded-lg transition-colors text-gray-400 hover:text-purple-400 group-hover/row:bg-purple-500/10 group-hover/row:text-purple-400"
                                                        >
                                                            <Users size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors z-10"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setJobToDelete(item); }}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors z-10"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : activeTab === 'payments' ? (
                                            <>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <div className="text-white text-sm font-mono truncate max-w-[160px]">
                                                            {item.isManual ? 'MANUAL' : (item.paymentId || item.orderId || 'N/A')}
                                                        </div>
                                                        {item.isManual && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
                                                                <Banknote size={9} />
                                                                Offline
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-purple-400 font-bold mt-1">{item.serviceName}</div>
                                                </td>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="text-white">{item.firstName} {item.lastName}</div>
                                                    <div className="text-sm text-gray-400">{item.email}</div>
                                                    {item.mobile && <div className="text-sm text-gray-500">{item.mobile}</div>}
                                                </td>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className={`text-lg font-bold ${item.status === 'failed' ? 'text-red-400' : item.status === 'pending' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                                                        &#8377;{item.amount?.toLocaleString() ?? '0'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-gray-400 text-sm">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-6 text-center">
                                                    {/* Clickable status badge opens dropdown */}
                                                    <button
                                                        onClick={(e) => handleToggleDropdown(e, item._id)}
                                                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${statusBadgeClass(item.status)}`}
                                                    >
                                                        {item.status?.toUpperCase() || 'PENDING'}
                                                        <ChevronDown
                                                            size={12}
                                                            className={`transition-transform ${openDropdownId === item._id ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>

                                                    {openDropdownId === item._id && (
                                                        <StatusDropdown
                                                            itemId={item._id}
                                                            currentStatus={item.status}
                                                            anchorEl={anchorEl}
                                                            activeTab={activeTab}
                                                            onSelect={(status) => handleStatusSelect(item._id, activeTab, status)}
                                                            onClose={() => { setOpenDropdownId(null); setAnchorEl(null); }}
                                                        />
                                                    )}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="text-white">{item.name || item.role}</div>
                                                    <div className="text-sm text-gray-400">{item.email}</div>
                                                    {item.phone && <div className="text-sm text-gray-500">{item.phone}</div>}
                                                    {/* Show which job this application is for */}
                                                    {activeTab === 'applications' && (
                                                        <div className="mt-1.5">
                                                            {typeof item.jobId === 'object' && item.jobId?.title ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/20">
                                                                    📋 {item.jobId.title}
                                                                </span>
                                                            ) : item.role ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                                                                    🎯 {item.role}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-500/15 text-gray-500 border border-gray-500/20">
                                                                    General Application
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
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
                                                        {item.status || (activeTab === 'applications' ? 'PENDING' : 'pending')}
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
                                                            activeTab={activeTab}
                                                            onSelect={(status) => handleStatusSelect(item._id, activeTab, status)}
                                                            onClose={() => { setOpenDropdownId(null); setAnchorEl(null); }}
                                                        />
                                                    )}
                                                </td>
                                            </>
                                        )}
                                        </tr>

                                    </React.Fragment>
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

            {isManualPaymentModalOpen && (
                <ManualPaymentModal
                    onClose={() => setIsManualPaymentModalOpen(false)}
                    onSubmit={handleCreateManualPayment}
                    loading={loading}
                />
            )}

            {/* View Description Modal */}
            {viewingDescJob && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        onClick={() => setViewingDescJob(null)} 
                    />
                    <div className="relative w-full max-w-2xl bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in text-left">
                        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{viewingDescJob.title}</h3>
                                <p className="text-purple-400 text-sm mt-1">{viewingDescJob.department} • Job Description</p>
                            </div>
                            <button 
                                onClick={() => setViewingDescJob(null)}
                                className="p-2 -mr-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {viewingDescJob.description || 'No description provided.'}
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {jobToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                        onClick={() => setJobToDelete(null)} 
                    />
                    <div className="relative w-full max-w-md bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in text-center">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Delete Job Listing?</h3>
                        <p className="text-gray-400 mb-8">
                            Are you sure you want to permanently delete <strong className="text-white">{jobToDelete.title}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button 
                                onClick={() => setJobToDelete(null)}
                                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleDeleteJob(jobToDelete._id)}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                            >
                                Delete Job
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
