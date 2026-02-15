import About from '../components/About'
import Footer from '../components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main className="relative pt-28">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl md:text-4xl font-semibold">
            <span className="bg-clip-text text-transparent bg-[linear-gradient(100deg,#dbe4ff_0%,#f1f5ff_40%,#dbe4ff_100%)]">
              About
            </span>
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            We combine craftsmanship with pragmatic engineering to deliver outcomes that matter.
          </p>
        </div>
        <About />
      </main>
      <Footer />
    </div>
  )
}