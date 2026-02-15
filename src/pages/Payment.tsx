import { useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { CheckCircle2 } from 'lucide-react'

// Add Razorpay type definition
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function Payment() {
    const [amount, setAmount] = useState('')
    const [payFor, setPayFor] = useState('')
    const [notes, setNotes] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [paymentId, setPaymentId] = useState('')

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!amount || !email || !mobileNumber || !firstName) {
            alert('Please fill in all required fields')
            return
        }

        setLoading(true)

        const options = {
            key: "rzp_test_RtMpMMVMKTWqZz",
            amount: Number(amount) * 100, // Amount in paise
            currency: "INR",
            name: "Cosmic Thinking Labs",
            description: payFor || "Service Payment",
            image: "/cosmic-logo.png",
            handler: async function (response: any) {
                setPaymentId(response.razorpay_payment_id)
                setPaymentSuccess(true)
                setLoading(false)

                try {
                    await fetch('http://localhost:9090/api/payment/success', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            paymentId: response.razorpay_payment_id,
                            amount: Number(amount),
                            payFor: payFor || "Service Payment",
                            firstName,
                            lastName,
                            email,
                            mobileNumber,
                            notes
                        })
                    });
                    console.log('Payment success notification sent to backend');
                } catch (error) {
                    console.error('Failed to notify backend of payment success:', error);
                }
            },
            prefill: {
                name: `${firstName} ${lastName}`,
                email: email,
                contact: mobileNumber,
            },
            notes: {
                description: notes
            },
            theme: {
                color: "#161b22"
            }
        };

        const rzp1 = new window.Razorpay(options);

        rzp1.on('payment.failed', function (response: any) {
            console.error("Payment Failed: " + response.error.description);
            setLoading(false)
        });

        rzp1.open();
    }

    return (
        <div className="min-h-screen bg-[#0a0a14] selection:bg-white/20">
            <NavBar />

            <main className="relative pt-32 pb-20 px-6">
                <div className="mx-auto max-w-2xl">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                            {paymentSuccess ? 'Payment Successful' : 'Make a payment'}
                        </h1>
                        <p className="text-gray-400">
                            {paymentSuccess
                                ? 'Thank you for your payment. Your transaction has been completed successfully.'
                                : 'Complete your secure payment for Cosmic Thinking Labs services.'
                            }
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                        {paymentSuccess ? (
                            <div className="text-center py-8 md:py-12">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
                                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                                    We have received your payment. A confirmation email has been sent to {email}.
                                </p>
                                <div className="bg-white/5 rounded-lg p-4 max-w-sm mx-auto border border-white/10">
                                    <p className="text-sm text-gray-400 mb-1">Transaction ID</p>
                                    <p className="text-white font-mono">{paymentId}</p>
                                </div>
                                <div className="mt-8">
                                    <button
                                        onClick={() => {
                                            setPaymentSuccess(false)
                                            setAmount('')
                                            setPayFor('')
                                            setNotes('')
                                            setEmail('')
                                            setFirstName('')
                                            setLastName('')
                                            setMobileNumber('')
                                        }}
                                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                                    >
                                        Make another payment
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handlePayment}>

                                {/* Transaction Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label htmlFor="payFor" className="block text-sm font-medium text-gray-300">
                                            Pay for
                                        </label>
                                        <input
                                            type="text"
                                            id="payFor"
                                            value={payFor}
                                            onChange={(e) => setPayFor(e.target.value)}
                                            className="w-full bg-[#0a0a14]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                            placeholder="e.g. Web Development Services"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                                            Amount *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                id="amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required
                                                className="w-full bg-[#0a0a14]/50 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300">
                                        Notes <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={4}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full bg-[#0a0a14]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                        placeholder="Add any additional details here..."
                                    />
                                </div>

                                <div className="border-t border-white/10 pt-6 mt-6">
                                    <h3 className="text-lg font-medium text-white mb-4">Client Info</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full bg-[#0a0a14]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                                placeholder="you@company.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-300">
                                                Mobile Number *
                                            </label>
                                            <input
                                                type="tel"
                                                id="mobileNumber"
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value)}
                                                required
                                                className="w-full bg-[#0a0a14]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                    className="w-full bg-[#0a0a14]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="w-full bg-[#0a0a14]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Pay Now'}
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
