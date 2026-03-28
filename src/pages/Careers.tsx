import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import ApplicationModal from "../components/ApplicationModal";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { usePublicApi } from "../hooks/usePublicApi";

// Converts a raw rupee value to LPA (Lakhs Per Annum)
const toL = (value: number): string => {
    const lpa = value / 1_00_000;
    // Show decimal only if not a whole number
    return Number.isInteger(lpa) ? `${lpa}` : `${parseFloat(lpa.toFixed(1))}`;
};

// Handles single values AND ranges like "500000-600000" → "5 – 6 LPA"
const formatSalary = (salary: string): string => {
    if (!salary) return '';
    const parts = salary.split('-').map(s => s.trim());
    const nums = parts.map(Number);
    // If all parts are valid numbers, format as LPA
    if (nums.every(n => !isNaN(n) && n > 0)) {
        return `${nums.map(toL).join(' – ')} LPA`;
    }
    // Fallback: return as-is (e.g. "Negotiable")
    return salary;
};


interface Job {
    _id: string;
    title: string;
    department?: string;
    location?: string;
    type?: string;
    description?: string;
    salary?: string;
    isActive?: boolean;
}

export default function Careers(): JSX.Element {
    const [expandedRole, setExpandedRole] = useState<string | null>(null);
    const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState<string | null>(null);

    const { fetchJobs } = usePublicApi();

    useEffect(() => {
        const loadJobs = async () => {
            setJobsLoading(true);
            setJobsError(null);
            try {
                const data = await fetchJobs();
                // Only show active jobs on the public page
                const active = (data || []).filter((j: Job) => j.isActive !== false);
                setJobs(active);
            } catch (err: any) {
                console.error('Failed to load jobs:', err);
                setJobsError('Could not load open positions. Please try again later.');
            } finally {
                setJobsLoading(false);
            }
        };
        loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const benefits = [
        {
            title: "Remote First",
            description: "Work from anywhere in the universe. We trust you to manage your time and output.",
        },
        {
            title: "Top-tier Equipment",
            description: "Get the latest Apple gear and a budget for your home office setup.",
        },
        {
            title: "Learning Budget",
            description: "Annual stipend for conferences, courses, and books to fuel your growth.",
        },
        {
            title: "Health & Wellness",
            description: "Comprehensive health coverage and wellness allowances for a balanced life.",
        },
    ];

    const toggleRole = (id: string) => {
        setExpandedRole(expandedRole === id ? null : id);
    };

    const handleApply = (e: React.MouseEvent, job: Job) => {
        e.stopPropagation();
        setSelectedJob({ id: job._id, title: job.title });
    };

    return (
        <div className="min-h-screen bg-transparent text-white">

            <main className="relative pt-32 pb-12">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-6 mb-16">
                    <Reveal>
                        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight">
                            Join the <br />
                            <span className="gradient-text">Cosmic Thinking Lab.</span>
                        </h1>
                    </Reveal>
                    <Reveal delayMs={100}>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed font-light">
                            We are a team of visionaries, engineers, and designers building the future of digital experiences.
                            We're looking for obsessive perfectionists to join our mission.
                        </p>
                    </Reveal>
                </section>

                {/* Benefits Section */}
                <section className="mx-auto max-w-7xl px-6 mb-16">
                    <div className="border-t border-white/10 pt-16">
                        <Reveal delayMs={200}>
                            <h2 className="text-3xl font-bold mb-12">Why Cosmic Thinking Lab?</h2>
                        </Reveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {benefits.map((benefit, idx) => (
                                <Reveal key={benefit.title} delayMs={200 + (idx * 50)}>
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-white">{benefit.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Open Roles Section */}
                <section className="mx-auto max-w-7xl px-6 mb-16">
                    <div className="border-t border-white/10 pt-16">
                        <Reveal delayMs={300}>
                            <h2 className="text-3xl font-bold mb-12">Open Positions</h2>
                        </Reveal>

                        {/* Loading state */}
                        {jobsLoading && (
                            <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                                <Loader2 size={24} className="animate-spin" />
                                <span>Loading open positions...</span>
                            </div>
                        )}

                        {/* Error state */}
                        {!jobsLoading && jobsError && (
                            <div className="text-center py-20 text-gray-400">
                                <p>{jobsError}</p>
                            </div>
                        )}

                        {/* Empty state */}
                        {!jobsLoading && !jobsError && jobs.length === 0 && (
                            <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
                                <p className="text-gray-400 text-lg">No open positions at the moment.</p>
                                <p className="text-gray-500 text-sm mt-2">Check back soon or send us a general application below.</p>
                            </div>
                        )}

                        {/* Jobs list */}
                        {!jobsLoading && !jobsError && jobs.length > 0 && (
                            <div className="space-y-4">
                                {jobs.map((job, idx) => (
                                    <Reveal key={job._id} delayMs={300 + (idx * 50)}>
                                        <div
                                            onClick={() => toggleRole(job._id)}
                                            className="group relative border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer rounded-lg"
                                        >
                                            <div className="p-8">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors flex items-center gap-3">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                                            {job.department && <span>{job.department}</span>}
                                                            {job.department && job.location && <span>•</span>}
                                                            {job.location && <span>{job.location}</span>}
                                                            {job.type && <><span>•</span><span>{job.type}</span></>}
                                                            {job.salary && <><span>•</span><span className="text-purple-400">{formatSalary(job.salary)}</span></>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={(e) => handleApply(e, job)}
                                                            className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors z-10"
                                                        >
                                                            Apply Now
                                                        </button>
                                                        <ArrowUpRight
                                                            size={20}
                                                            className={`text-gray-400 transition-transform duration-300 ${expandedRole === job._id ? 'rotate-180' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expandable description */}
                                            <div
                                                className={`px-8 transition-all duration-300 ease-in-out ${expandedRole === job._id ? 'max-h-96 pb-8 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                            >
                                                <p className="text-gray-300 leading-relaxed border-t border-white/10 pt-4 whitespace-pre-line">
                                                    {job.description || 'No description provided.'}
                                                </p>
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Culture CTA */}
                <section className="mx-auto max-w-7xl px-6">
                    <Reveal delayMs={400}>
                        <div className="bg-gradient-to-r from-gray-900 to-[#12122b] border border-white/10 p-12 md:p-20 text-center rounded-2xl">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Don't see your role?</h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                                We are always looking for exceptional talent. Send us your portfolio and tell us how you can contribute to the mission.
                            </p>
                            <button
                                onClick={() => setSelectedJob({ id: '', title: 'General Application' })}
                                className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors inline-block cursor-pointer"
                            >
                                Email Us
                            </button>
                        </div>
                    </Reveal>
                </section>
            </main>

            <Footer />

            <ApplicationModal
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                roleTitle={selectedJob?.title || ""}
                jobId={selectedJob?.id || ''}
            />
        </div>
    );
}
