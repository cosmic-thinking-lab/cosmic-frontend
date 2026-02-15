import Reveal from "./Reveal";

export default function About(): JSX.Element {
  const stats: Array<{ label: string; value: string }> = [
    { label: "Projects Delivered", value: "150+" },
    { label: "Happy Clients", value: "100+" },
    { label: "Team Experts", value: "25+" },
  ];

  return (
    <section id="about" className="relative pt-20 pb-4 md:pt-24 md:pb-6 bg-transparent overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:gap-20 grid-cols-1 lg:grid-cols-12 items-start">
          <Reveal className="lg:col-span-6" delayMs={0}>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 md:mb-8 tracking-tight">
                About Cosmic Thinking Lab
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 leading-relaxed font-light mb-6 md:mb-8">
                We partner with ambitious teams to build world-class software products. Since 2015, we've helped startups and enterprises scale their technical vision. <span className="gradient-text font-medium">Founded by IIT Ropar alumni with deep technical expertise.</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
                {stats.map((s, idx) => (
                  <Reveal key={s.label} delayMs={200 + 100 * idx}>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white mb-2">{s.value}</div>
                      <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">{s.label}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6" delayMs={200}>
            <div className="space-y-6 md:space-y-8">
              <div className="border-l border-white/20 pl-6 md:pl-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Our Mission</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  To be the trusted technology partner for visionary teams. We combine technical excellence with strategic thinking to deliver software that creates real value.
                </p>
              </div>

              <div className="border-l border-white/20 pl-6 md:pl-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Our Approach</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  We listen first, then architect thoughtfully. Every decision is driven by your business goals, not trends. We build partnerships, not just projects.
                </p>
              </div>

              <div className="border-l border-white/20 pl-6 md:pl-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Our Commitment</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  Transparent communication, consistent delivery, and genuine care for your success. We treat your challenges as our own and invest in long-term relationships.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
