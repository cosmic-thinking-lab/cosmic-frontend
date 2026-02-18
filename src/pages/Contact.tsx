import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('http://localhost:9090/api/solution/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        budget: '',
        message: ''
      })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

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
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
                      Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white/60 mb-2">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-white/60 mb-2">
                    Project budget (optional)
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                  >
                    <option value="" className="bg-gray-900 text-gray-400">Please choose an option</option>
                    <option value="10k-50k" className="bg-gray-900">$10K - $50K</option>
                    <option value="50k-100k" className="bg-gray-900">$50K - $100K</option>
                    <option value="100k+" className="bg-gray-900">$100K+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                {status === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-200 rounded-lg">
                    Message sent successfully! We will get back to you soon.
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Sending...' : 'Submit Inquiry'}
                    {!status && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    )}
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