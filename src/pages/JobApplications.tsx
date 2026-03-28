import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import {
    ArrowLeft,
    Users,
    Mail,
    Phone,
    FileText,
    Calendar,
    Clock,
    ChevronDown,
    X,
    AlertCircle,
    Briefcase,
    MapPin,
    Building2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Application {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    about?: string;
    resumeLink?: string;
    status: string;
    createdAt: string;
    jobId?: { _id: string; title: string } | string;
}

// ─── Status helpers ───────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { value: 'PENDING',  label: 'Pending',  color: 'text-yellow-400',  bg: 'bg-yellow-500/20 border-yellow-500/30' },
    { value: 'REVIEWED', label: 'Reviewed', color: 'text-blue-400',    bg: 'bg-blue-500/20 border-blue-500/30' },
    { value: 'HIRED',    label: 'Hired',    color: 'text-green-400',   bg: 'bg-green-500/20 border-green-500/30' },
    { value: 'ACCEPTED', label: 'Accepted', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
    { value: 'REJECTED', label: 'Rejected', color: 'text-red-400',     bg: 'bg-red-500/20 border-red-500/30' },
];

const getStatusStyle = (status?: string) => {
    const s = STATUS_OPTIONS.find(o => o.value === status?.toUpperCase());
    return s ?? { value: status ?? 'PENDING', label: status ?? 'Pending', color: 'text-gray-400', bg: 'bg-gray-500/20 border-gray-500/30' };
};

// ─── Application Detail Modal ─────────────────────────────────────────────────
interface DetailModalProps {
    app: Application;
    onClose: () => void;
    onStatusChange: (id: string, status: string) => void;
    updatingId: string | null;
}

const ApplicationDetailModal: React.FC<DetailModalProps> = ({ app, onClose, onStatusChange, updatingId }) => {
    const st = getStatusStyle(app.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-xl bg-[#12121f] border border-white/10 rounded-2xl shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-400">
                            {app.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{app.name}</h2>
                            <p className="text-sm text-gray-400">{app.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {app.phone && (
                        <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <Phone size={12} /> Phone
                            </div>
                            <p className="text-sm text-white font-medium">{app.phone}</p>
                        </div>
                    )}
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <Calendar size={12} /> Applied On
                        </div>
                        <p className="text-sm text-white font-medium">{new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    {app.role && (
                        <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <Briefcase size={12} /> Applied Role
                            </div>
                            <p className="text-sm text-white font-medium">{app.role}</p>
                        </div>
                    )}
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <Clock size={12} /> Current Status
                        </div>
                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md border ${st.bg} ${st.color}`}>
                            {st.label}
                        </span>
                    </div>
                </div>

                {/* About */}
                {app.about && (
                    <div className="mb-5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">About</h4>
                        <p className="text-sm text-gray-300 leading-relaxed bg-white/5 rounded-xl p-4 border border-white/5">{app.about}</p>
                    </div>
                )}

                {/* Resume */}
                {app.resumeLink && (
                    <div className="mb-6">
                        <a
                            href={app.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 font-semibold px-5 py-3 rounded-xl transition-all text-sm"
                        >
                            <FileText size={16} />
                            View Resume / Portfolio
                        </a>
                    </div>
                )}

                {/* Update Status */}
                <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                disabled={updatingId === app._id}
                                onClick={() => onStatusChange(app._id, opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-50 ${
                                    app.status?.toUpperCase() === opt.value
                                        ? `${opt.bg} ${opt.color} scale-105`
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const JobApplications: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [searchParams] = useSearchParams();
    const jobTitle = searchParams.get('title') || 'Job';
    const jobDept = searchParams.get('dept') || '';
    const jobLoc = searchParams.get('loc') || '';

    const navigate = useNavigate();
    const { fetchJobApplications, updateItemStatus, loading } = useAdmin();

    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!jobId) return;
        try {
            setError(null);
            const data = await fetchJobApplications(jobId, jobTitle);
            setApplications(data as Application[]);
        } catch (err: any) {
            if (err.message === 'Unauthorized') {
                localStorage.removeItem('adminToken');
                navigate('/admin');
            } else {
                setError(err.message || 'Failed to load applications.');
            }
        }
    }, [jobId, fetchJobApplications, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/admin'); return; }
        load();
    }, [load, navigate]);

    const handleStatusChange = async (appId: string, status: string) => {
        setUpdatingId(appId);
        setOpenDropdownId(null);
        try {
            await updateItemStatus(appId, 'applications', status);
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
            if (selectedApp?._id === appId) setSelectedApp(prev => prev ? { ...prev, status } : null);
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter
    const filtered = applications.filter(app => {
        const matchStatus = filterStatus === 'ALL' || app.status?.toUpperCase() === filterStatus;
        const q = search.toLowerCase();
        const matchSearch = !q
            || app.name?.toLowerCase().includes(q)
            || app.email?.toLowerCase().includes(q)
            || app.phone?.toLowerCase().includes(q)
            || app.role?.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    // Stats
    const stats = STATUS_OPTIONS.reduce((acc, opt) => {
        acc[opt.value] = applications.filter(a => a.status?.toUpperCase() === opt.value).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="min-h-screen bg-[#0d0d1a] px-6 pb-10 pt-32 md:px-10 md:pt-40 text-white">
            <div className="max-w-6xl mx-auto">

                {/* ── Back button + heading ── */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                        <span className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                            <ArrowLeft size={16} />
                        </span>
                        Back to Dashboard
                    </button>
                </div>

                {/* ── Job Info Card ── */}
                <div className="bg-gradient-to-br from-purple-900/30 via-[#181830] to-[#0d0d1a] border border-purple-500/20 rounded-2xl p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                <Briefcase className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{jobTitle}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                    {jobDept && (
                                        <span className="flex items-center gap-1.5 text-sm text-purple-400">
                                            <Building2 size={13} /> {jobDept}
                                        </span>
                                    )}
                                    {jobLoc && (
                                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                            <MapPin size={13} /> {jobLoc}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                            <Users className="w-5 h-5 text-purple-400" />
                            <span className="text-2xl font-bold text-white">{applications.length}</span>
                            <span className="text-gray-400 text-sm">Applicant{applications.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {/* Stats row */}
                    {applications.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-white/5">
                            {STATUS_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFilterStatus(prev => prev === opt.value ? 'ALL' : opt.value)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                        filterStatus === opt.value
                                            ? `${opt.bg} ${opt.color} scale-105`
                                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    {opt.label}
                                    <span className={`${filterStatus === opt.value ? opt.color : 'text-gray-500'} font-mono`}>
                                        {stats[opt.value] ?? 0}
                                    </span>
                                </button>
                            ))}
                            {filterStatus !== 'ALL' && (
                                <button
                                    onClick={() => setFilterStatus('ALL')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                                >
                                    <X size={11} /> Clear Filter
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Search ── */}
                <div className="mb-5">
                    <input
                        type="text"
                        placeholder="Search by name, email, phone or role…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full sm:w-80 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <p className="text-gray-400 text-sm">Loading applications…</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="text-red-400 font-semibold">{error}</p>
                        <button onClick={load} className="text-sm text-purple-400 hover:text-purple-300 transition-colors mt-1">
                            Try again
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                        <Users className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-400 font-semibold text-lg">
                            {applications.length === 0 ? 'No applications yet' : 'No results match your filter'}
                        </p>
                        <p className="text-gray-600 text-sm">
                            {applications.length === 0
                                ? 'Applications submitted for this job will appear here.'
                                : 'Try adjusting the status filter or search query.'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1.2fr_auto] gap-4 px-6 py-3.5 bg-white/5 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-gray-400 rounded-t-2xl">
                            <span>Applicant</span>
                            <span>Contact</span>
                            <span>Applied</span>
                            <span>Status</span>
                            <span className="w-8" />
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-white/10">
                            {filtered.map(app => {
                                const st = getStatusStyle(app.status);
                                return (
                                    <div
                                        key={app._id}
                                        className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1.2fr_auto] gap-3 md:gap-4 px-6 py-5 hover:bg-white/[0.03] transition-colors group"
                                    >
                                        {/* Applicant */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-400 shrink-0">
                                                {app.name?.charAt(0)?.toUpperCase() ?? '?'}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm">{app.name}</div>
                                                {app.role && <div className="text-xs text-purple-400 mt-0.5">{app.role}</div>}
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="flex flex-col gap-1 justify-center">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-300">
                                                <Mail size={12} className="text-gray-500 shrink-0" />
                                                <span className="truncate">{app.email}</span>
                                            </div>
                                            {app.phone && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Phone size={11} className="shrink-0" />
                                                    {app.phone}
                                                </div>
                                            )}
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center text-sm text-gray-400">
                                            <span>{new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        </div>

                                        {/* Status dropdown */}
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <button
                                                    disabled={updatingId === app._id}
                                                    onClick={() => setOpenDropdownId(openDropdownId === app._id ? null : app._id)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all disabled:opacity-50 ${st.bg} ${st.color}`}
                                                >
                                                    {updatingId === app._id ? (
                                                        <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            {st.label}
                                                            <ChevronDown size={11} className={`transition-transform duration-200 ${openDropdownId === app._id ? 'rotate-180' : ''}`} />
                                                        </>
                                                    )}
                                                </button>
                                                {/* Dropdown on click */}
                                                {openDropdownId === app._id && (
                                                    <>
                                                        <div 
                                                            className="fixed inset-0 z-10" 
                                                            onClick={() => setOpenDropdownId(null)}
                                                        />
                                                        <div className="absolute top-full left-0 mt-1.5 z-20 min-w-[130px] bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                                                            {STATUS_OPTIONS.map(opt => (
                                                                <button
                                                                    key={opt.value}
                                                                    onClick={() => handleStatusChange(app._id, opt.value)}
                                                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/5 relative z-30 ${opt.color} ${app.status?.toUpperCase() === opt.value ? 'bg-white/5' : ''}`}
                                                                >
                                                                    {opt.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* View detail button */}
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="p-2 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                                title="View Details"
                                            >
                                                <FileText size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer count */}
                        <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.02] text-xs text-gray-500 rounded-b-2xl">
                            Showing {filtered.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
                            {filterStatus !== 'ALL' && ` · filtered by ${filterStatus.toLowerCase()}`}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Detail Modal ── */}
            {selectedApp && (
                <ApplicationDetailModal
                    app={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onStatusChange={handleStatusChange}
                    updatingId={updatingId}
                />
            )}
        </div>
    );
};

export default JobApplications;
