import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type ApplicationFormState = {
    name: string;
    email: string;
    phone: string;
    resumeLink: string;
    info: string;
    customRole: string;
};

const initialState: ApplicationFormState = {
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
    info: "",
    customRole: "",
};

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    roleTitle: string;
}

export default function ApplicationModal({ isOpen, onClose, roleTitle }: ApplicationModalProps): JSX.Element | null {
    const [form, setForm] = useState<ApplicationFormState>(initialState);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isGeneralApplication = roleTitle === "General Application";

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const onChange =
        (key: keyof ApplicationFormState) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((f) => ({ ...f, [key]: e.target.value }));
            };

    const validate = (f: ApplicationFormState) => {
        if (isGeneralApplication && !f.customRole.trim()) return "Please enter the role you are interested in.";
        if (!f.name.trim()) return "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "Please enter a valid email.";
        if (!f.phone.trim()) return "Please enter your mobile number.";
        if (!f.resumeLink.trim()) return "Please provide a link to your resume/portfolio.";
        // Basic URL validation
        try {
            new URL(f.resumeLink);
        } catch (_) {
            return "Please enter a valid URL (include http:// or https://)";
        }
        return null;
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const v = validate(form);
        if (v) {
            setError(v);
            return;
        }
        setSubmitting(true);

        const finalRole = isGeneralApplication ? form.customRole : roleTitle;

        try {
            const response = await fetch("https://formsubmit.co/ajax/connect@cosmicthinkinglab.online", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    role: finalRole,
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    resume: form.resumeLink,
                    details: form.info || "No additional details provided",
                    _subject: `Job Application: ${finalRole} - ${form.name}`,
                    _template: "table"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit application. Please try again.");
            }

            setSubmitted(true);
            setForm(initialState);

            // Auto close after success? Maybe keep it open to show success message.
        } catch (err) {
            setError("Something went wrong. Please try again later.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">
                    {isGeneralApplication ? "One Submission, Infinite Possibilities" : "Apply for Role"}
                </h2>

                {!isGeneralApplication && (
                    <p className="text-yellow-400 font-medium mb-6 text-lg">{roleTitle}</p>
                )}

                {submitted ? (
                    <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Application Received!</h3>
                        <p className="text-gray-400 mb-6">
                            Thank you for your interest. We'll review your details and get back to you soon.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        {isGeneralApplication && (
                            <div>
                                <label htmlFor="customRole" className="block text-sm font-medium text-gray-400 mb-1">Role / Position *</label>
                                <input
                                    id="customRole"
                                    type="text"
                                    value={form.customRole}
                                    onChange={onChange("customRole")}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all border-yellow-500/50"
                                    placeholder="e.g. 3D Artist, Copywriter..."
                                    autoFocus
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
                            <input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={onChange("name")}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address *</label>
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={onChange("email")}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Mobile Number *</label>
                            <input
                                id="phone"
                                type="tel"
                                value={form.phone}
                                onChange={onChange("phone")}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div>
                            <label htmlFor="resumeLink" className="block text-sm font-medium text-gray-400 mb-1">Resume / Portfolio Link *</label>
                            <input
                                id="resumeLink"
                                type="url"
                                value={form.resumeLink}
                                onChange={onChange("resumeLink")}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                                placeholder="https://drive.google.com/..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Please provide a Google Drive, Dropbox, or portfolio link.</p>
                        </div>

                        <div>
                            <label htmlFor="info" className="block text-sm font-medium text-gray-400 mb-1">Education / About You</label>
                            <textarea
                                id="info"
                                rows={3}
                                value={form.info}
                                onChange={onChange("info")}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all resize-none"
                                placeholder="Tell us a bit about your background..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-white text-black py-4 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 mt-4"
                        >
                            {submitting ? "Submitting..." : "Submit Application"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
