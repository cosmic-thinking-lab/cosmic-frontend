import Reveal from "./Reveal";

export default function Services(): JSX.Element {
  return (
    <section id="services" className="relative py-4 md:py-6 bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
            Our Services
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            End-to-end solutions for modern digital challenges, from strategy to deployment.
          </p>
        </div>

        <div className="grid gap-16 md:gap-20 grid-cols-1 lg:grid-cols-2">
          <Reveal delayMs={100}>
            <article className="group border-l border-white/10 pl-8 hover:border-white/30 transition-colors">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Web Development</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Custom web applications built with modern frameworks. Responsive, fast, and designed for scale.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delayMs={200}>
            <article className="group border-l border-white/10 pl-8 hover:border-white/30 transition-colors">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Product Strategy</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  From concept to launch. We help define your product roadmap, validate ideas, and build in the right direction.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delayMs={300}>
            <article className="group border-l border-white/10 pl-8 hover:border-white/30 transition-colors">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Performance & Scaling</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Optimize your infrastructure and codebase. We ensure your application scales smoothly as you grow.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delayMs={400}>
            <article className="group border-l border-white/10 pl-8 hover:border-white/30 transition-colors">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Team Augmentation</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Extend your team with expert developers. Perfect for startups and teams needing specialized skills.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
