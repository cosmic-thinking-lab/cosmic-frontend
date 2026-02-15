import Reveal from "./Reveal";

export default function DetailedServices(): JSX.Element {
    const serviceCategories = [
        {
            title: "Digital Experience",
            services: [
                "Mobile Application Development",
                "UI/UX Design Services",
                "B2B/B2C Portals",
                "eCommerce",
            ],
        },
        {
            title: "Cloud Services",
            services: [
                "Management and Support",
                "Cloud Optimization",
                "Cloud Security",
                "Cloud Migration",
            ],
        },
        {
            title: "Data And Analytics",
            services: [
                "Data Engineering",
                "Data Visualization",
                "Data Driven Decisions",
                "Data Driven AI/ML",
            ],
        },
        {
            title: "Digital Enterprise",
            services: [
                "Application Services",
                "Business Process Automation",
                "Modern Workplace",
                "MuleSoft Services",
                "Pimcore Services",
                "Odoo Services",
                "Gen AI Services",
            ],
        },
    ];

    return (
        <section className="py-20 bg-transparent">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {serviceCategories.map((category, index) => (
                        <Reveal key={index} delayMs={index * 100}>
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
                                    {category.title}
                                </h3>
                                <ul className="space-y-4">
                                    {category.services.map((service, serviceIndex) => (
                                        <li
                                            key={serviceIndex}
                                            className="text-gray-400 hover:text-blue-400 transition-colors cursor-default text-sm"
                                        >
                                            {service}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
