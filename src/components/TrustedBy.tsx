import Reveal from "./Reveal";

export default function TrustedBy(): JSX.Element {
    const companies = [
        { name: "ORIX", color: "text-red-500" },
        { name: "TRIANZ", color: "text-blue-500" },
        { name: "GACL", color: "text-yellow-500" },
        { name: "Kotak Life", color: "text-red-600" },
        { name: "YASKAWA", color: "text-blue-600" },
        { name: "L&T", color: "text-blue-500" },
        { name: "Mahindra", color: "text-red-600" },
        { name: "PETRONAS", color: "text-teal-500" },
        { name: "PUMA", color: "text-red-600" },
        { name: "Birla Sun Life", color: "text-orange-600" },
        { name: "PEUGEOT", color: "text-white" },
        { name: "Tech Mahindra", color: "text-red-600" },
    ];

    return (
        <section className="py-20 bg-transparent nav-blur-border border-b border-white/5">
            <div className="mx-auto max-w-7xl px-6">
                <Reveal>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Trusted by <span className="text-blue-400">350+</span> companies
                            worldwide
                        </h2>
                    </div>
                </Reveal>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {companies.map((company, index) => (
                        <Reveal key={index} delayMs={index * 50}>
                            <div className="h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                                <span
                                    className={`font-bold text-lg md:text-xl ${company.color || "text-gray-400"
                                        } group-hover:scale-110 transition-transform`}
                                >
                                    {company.name}
                                </span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
