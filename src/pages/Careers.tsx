import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import ApplicationModal from "../components/ApplicationModal";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function Careers(): JSX.Element {
    const [expandedRole, setExpandedRole] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const roles = [
        {
            title: "Senior Product Designer",
            department: "Design",
            location: "Remote",
            type: "Full-time",
            description: `We are looking for a Senior Product Designer to lead the design of our core products. You will work closely with engineering and product teams to create intuitive and beautiful experiences for our users. You should have a strong portfolio showcasing your ability to solve complex design problems.

            In this role, you will be responsible for the entire design lifecycle, from user research and wireframing to high-fidelity prototyping and visual design. You will champion the user, ensuring that every interaction is thoughtful, delightful, and serves a clear purpose. We believe that good design is not just about how things look, but how they work.

            Key Responsibilities:
            • Lead design projects across the entire product lifecycle and multiple product launches.
            • Work with small multi-disciplinary teams. You’ll partner closely with engineering, product, and business folks to find elegant but practical solutions to design challenges.
            • Rapidly produce multiple concepts and prototypes; knowing when to apply pixel-perfect attention to detail, and when to make low-fi sketches and prototypes.
            • Conduct user research and usability testing to validate your designs and uncover new opportunities.
            • Mentor junior designers and help build a culture of design excellence within the company.

            Requirements:
            • 5+ years of experience in product design, ideally at a tech company or startup.
            • A stunning portfolio that demonstrates not just visual polish, but a deep understanding of user experience and design thinking.
            • Proficiency with modern design tools like Figma, Principle, or Framer.
            • Experience with design systems and maintaining consistency across a complex product suite.
            • Strong communication skills – you should be able to articulate your design decisions and collaborate effectively with non-designers.
            • A passion for technology and a curiosity about how things are built.

            What We Offer:
            • Competitive salary and equity package.
            • Flexible remote-first work environment.
            • Comprehensive health, dental, and vision insurance.
            • Generous learning and development budget.
            • The opportunity to work on challenging problems that have a real impact on the world.`
        },
        {
            title: "Full Stack Engineer",
            department: "Engineering",
            location: "Remote / New York",
            type: "Full-time",
            description: "Join our engineering team to build scalable and high-performance applications. You will work across the stack, from database design to frontend implementation. Experience with React, Node.js, and cloud infrastructure (AWS/GCP) is required."
        },
        {
            title: "Growth Strategy Lead",
            department: "Strategy",
            location: "Remote",
            type: "Contract",
            description: "We need a Growth Strategy Lead to drive our user acquisition and retention strategies. You will analyze data, identify opportunities, and execute experiments to grow our user base. A background in data analysis and marketing is essential."
        },
        {
            title: "Frontend Developer (Creative)",
            department: "Engineering",
            location: "Remote",
            type: "Full-time",
            description: "Are you passionate about creative coding and UI animations? We are looking for a Frontend Developer who specializes in creating immersive web experiences. Proficiency in Three.js, WebGL, and GSAP is highly desirable."
        },
    ];

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

    const toggleRole = (title: string) => {
        if (expandedRole === title) {
            setExpandedRole(null);
        } else {
            setExpandedRole(title);
        }
    };

    const handleApply = (e: React.MouseEvent, title: string) => {
        e.stopPropagation();
        setSelectedRole(title);
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

                        <div className="space-y-4">
                            {roles.map((role, idx) => (
                                <Reveal key={role.title} delayMs={300 + (idx * 50)}>
                                    <div
                                        onClick={() => toggleRole(role.title)}
                                        className="group relative border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer rounded-lg"
                                    >
                                        <div className="p-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors flex items-center gap-3">
                                                        {role.title}
                                                    </h3>
                                                    <div className="flex gap-4 text-sm text-gray-400">
                                                        <span>{role.department}</span>
                                                        <span>•</span>
                                                        <span>{role.location}</span>
                                                        <span>•</span>
                                                        <span>{role.type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={(e) => handleApply(e, role.title)}
                                                        className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors z-10"
                                                    >
                                                        Apply Now
                                                    </button>
                                                    <ArrowUpRight
                                                        size={20}
                                                        className={`text-gray-400 transition-transform duration-300 ${expandedRole === role.title ? 'rotate-180' : ''}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={`px-8 transition-all duration-300 ease-in-out ${expandedRole === role.title ? 'max-h-96 pb-8 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
                                                }`}
                                        >
                                            <p className="text-gray-300 leading-relaxed border-t border-white/10 pt-4 whitespace-pre-line">
                                                {role.description}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
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
                                onClick={() => setSelectedRole("General Application")}
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
                isOpen={!!selectedRole}
                onClose={() => setSelectedRole(null)}
                roleTitle={selectedRole || ""}
            />
        </div>
    );
}
