import Solutions from '../components/Solutions'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'

export default function SolutionsPage() {
  return (
    <div className="min-h-screen">
      <main className="relative pt-20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Strategic <span className="gradient-text">Solutions.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              We provide tailored solutions for modern business challenges,
              leveraging cutting-edge technology to drive growth and efficiency.
            </p>
          </Reveal>
        </div>
        <Solutions />
      </main>
      <Footer />
    </div>
  )
}