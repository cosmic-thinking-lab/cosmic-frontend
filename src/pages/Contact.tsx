import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">

      <main className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-16 md:mb-24">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(100deg,#fff_0%,#a5b4fc_100%)]">
                We are here for you,
              </span>
              <br />
              <span className="text-white">let's collaborate!</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Left Column - Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h3 className="text-2xl font-medium mb-6 text-indigo-300">Get in Touch</h3>
                <div className="space-y-4">
                  <a href="tel:+13865971231" className="block text-xl hover:text-indigo-400 transition-colors">
                    +1 386 597 1231
                  </a>
                  <a href="mailto:info@cosmicthinkinglabs.com" className="block text-xl hover:text-indigo-400 transition-colors">
                    info@cosmicthinkinglabs.com
                  </a>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <h3 className="text-xl font-medium mb-4 text-white/80">Company</h3>
                <p className="text-lg text-white/60 leading-relaxed">
                  Cosmic Thinking Labs is a full-service software development company focused on delivering solutions for Web & Mobile Applications, AI & IoT to clients globally. We believe in technological empowerment and provide end-to-end tech solutions to build an effective digital presence.
                </p>
              </div>

              <div className="pt-8 border-t border-white/10">
                <h3 className="text-xl font-medium mb-4 text-white/80">Project Approved?</h3>
                <p className="text-lg text-white/60 leading-relaxed mb-6">
                  If your project has been approved, you can proceed with the payment securely.
                </p>
                <Link
                  to="/payment"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-wide text-sm"
                >
                  Make a Payment
                </Link>
              </div>
            </div>

            {/* Right Column - Inquiry Form */}
            <div className="lg:col-span-7">
              <h3 className="text-2xl font-medium mb-8 text-indigo-300">Submit your Inquiry</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-white/60 mb-2">
                    Source
                  </label>
                  <select
                    id="source"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                  >
                    <option value="" className="bg-gray-900 text-gray-400">Please choose an option</option>
                    <option value="clutch" className="bg-gray-900">Clutch</option>
                    <option value="google" className="bg-gray-900">Google</option>
                    <option value="referral" className="bg-gray-900">Referral</option>
                    <option value="other" className="bg-gray-900">Others</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
                      Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white/60 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                  {/* Empty placeholder to keep the grid aligned if needed, or remove for single col on mobile */}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    Submit Inquiry
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}