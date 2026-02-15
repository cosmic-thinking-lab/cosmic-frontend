import Services from '../components/Services'
import DetailedServices from '../components/DetailedServices'
import Footer from '../components/Footer'
import ThreeHero from '../components/ThreeHero'
import Reveal from '../components/Reveal'

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <main className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <Reveal>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Our <span className="gradient-text">Expertise.</span><br />
                Your <span className="text-gray-400">Success.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                We bridge the gap between complex engineering and elegant design,
                delivering digital solutions that scale with your vision.
              </p>
            </Reveal>
            <Reveal delayMs={200}>
              <div className="h-[400px] md:h-[500px]">
                <ThreeHero className="h-full" />
              </div>
            </Reveal>
          </div>
        </div>

        <Services />
        <DetailedServices />
      </main>
      <Footer />
    </div>
  )
}