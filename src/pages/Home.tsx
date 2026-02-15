import { Shield, Zap, Maximize } from 'lucide-react'
import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import TrustedBy from '../components/TrustedBy'
import Services from '../components/Services'
import Solutions from '../components/Solutions'
import About from '../components/About'
import ContactCTA from '../components/ContactCTA'
import Footer from '../components/Footer'

export default function Home() {
  const words = ['architect', 'build', 'scale', 'design', 'optimize', 'deploy']
  const [currentWord, setCurrentWord] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      <Hero />
      <TrustedBy />
      <div className="relative">
        {/* Moving gradient circles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"
            style={{
              animation: 'moveCircle1 20s ease-in-out infinite',
              top: '20%',
              left: '10%'
            }}></div>
          <div className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl"
            style={{
              animation: 'moveCircle2 25s ease-in-out infinite reverse',
              top: '60%',
              right: '15%'
            }}></div>
          <div className="absolute w-64 h-64 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full blur-3xl"
            style={{
              animation: 'moveCircle3 30s ease-in-out infinite',
              bottom: '20%',
              left: '20%'
            }}></div>
        </div>

        <div className="relative z-10">
          <section id="vision" className="py-16 bg-transparent">
            <div className="mx-auto max-w-7xl px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                    <span>Digital</span>{" "}
                    <span>Products.</span>{" "}
                    <span>Reimagined</span>{" "}
                    <span>for</span>{" "}
                    <span className="gradient-text">Impact.</span>
                  </h2>
                </div>
                <div>
                  <p className="text-lg md:text-xl text-gray-400 leading-relaxed">We empower visionary companies to build software that defines their future. From complex systems to elegant interfaces, we engineer success.<br /><br />Innovation, delivered effectively.</p>
                </div>
              </div>
            </div>
          </section>
          <section id="opportunities" className="py-16 bg-transparent">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">Unseen <br />Possibilities.</h3>
                  <div className="space-y-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-white">Enterprise-Grade Engineering.</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">Software today demands more than just code. It requires security, scalability, and performance built into every layer.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="feature-card-glow p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all duration-500">
                  <Shield className="w-10 h-10 text-yellow-500 mb-6" />
                  <h4 className="text-xl font-bold mb-3">Bulletproof Security</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">We build with a security-first mindset, ensuring your data and infrastructure are protected from modern threats.</p>
                </div>
                <div className="feature-card-glow p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all duration-500">
                  <Zap className="w-10 h-10 text-yellow-500 mb-6" />
                  <h4 className="text-xl font-bold mb-3">High Performance</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Optimized code and infrastructure that scales horizontally, ensuring lightning-fast response times under load.</p>
                </div>
                <div className="feature-card-glow p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all duration-500">
                  <Maximize className="w-10 h-10 text-yellow-500 mb-6" />
                  <h4 className="text-xl font-bold mb-3">Infinite Scalability</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Architecture designed to grow with your business, supporting millions of users without breaking a sweat.</p>
                </div>
              </div>

              <div className="max-w-4xl">
                <div className="space-y-6">
                  <div className="text-lg md:text-xl text-gray-400 leading-relaxed flex items-center flex-wrap">
                    <span>We</span>
                    <div className="inline-block h-7 overflow-hidden relative align-middle mx-2">
                      <div
                        className="transition-all duration-700 ease-in-out"
                        style={{ transform: `translateY(-${currentWord * 1.75}rem)` }}
                      >
                        {words.map((word, index) => (
                          <div key={index} className="h-7 flex items-center text-yellow-500 font-semibold whitespace-nowrap">
                            {word}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span>systems that power growth.</span>
                  </div>
                  <p className="gradient-text text-xl font-light leading-relaxed">Through robust architecture, modern frameworks, and <span className="highlight">cutting-edge technology</span>, every product is reliable, fast, and built for the long term.</p>
                </div>
              </div>
            </div>
          </section>
          <Services />
          <Solutions />
          <About />
          <ContactCTA />
          <Footer />
        </div>
      </div>
    </div >
  )
}