import React, { useState } from "react";

type FormState = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  budget: "",
  message: "",
};

export default function ContactCTA(): JSX.Element {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange =
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
      };

  const validate = (f: FormState) => {
    if (!f.name.trim()) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "Please enter a valid email.";
    if (!f.message.trim()) return "Please include a brief message.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const v = validate(form);
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/connect@cosmicthinkinglab.online", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || "Not provided",
          budget: form.budget || "Not provided",
          message: form.message,
          _subject: `New Inquiry from ${form.name}`,
          _template: "table"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send message. Please try again.");
      }

      setSubmitted(true);
      setForm(initialState);
    } catch (err) {
      setError("Something went wrong. Please try again later or email us directly.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative pt-20 pb-4 md:pt-24 md:pb-6 bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
            Let's Build Something Great
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light mb-8">
            Tell us about your project. We'll review your details and get back to you within 24 hours.
          </p>
          <div className="text-lg md:text-xl text-white/50">
            Or email us at{" "}
            <a
              href="mailto:connect@cosmicthinkinglab.online"
              className="text-white underline decoration-white/30 hover:decoration-white transition-all"
            >
              connect@cosmicthinkinglab.online
            </a>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSubmit} noValidate className="space-y-8">
            {submitted && (
              <div className="text-center p-6 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-green-400 text-lg font-medium mb-2">Message sent successfully</div>
                <div className="text-gray-400">We'll be in touch within 24 hours.</div>
              </div>
            )}

            {error && (
              <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-red-400">{error}</div>
              </div>
            )}

            {!submitted && (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={onChange("name")}
                      className="w-full bg-transparent border-b border-white/20 text-white placeholder-gray-500 py-4 focus:border-white focus:outline-none transition-colors text-lg"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={onChange("email")}
                      className="w-full bg-transparent border-b border-white/20 text-white placeholder-gray-500 py-4 focus:border-white focus:outline-none transition-colors text-lg"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={onChange("company")}
                    className="w-full bg-transparent border-b border-white/20 text-white placeholder-gray-500 py-4 focus:border-white focus:outline-none transition-colors text-lg"
                    placeholder="Company (optional)"
                  />
                </div>

                <div>
                  <select
                    id="budget"
                    name="budget"
                    value={form.budget}
                    onChange={onChange("budget")}
                    className="w-full bg-transparent border-b border-white/20 text-white py-4 focus:border-white focus:outline-none transition-colors text-lg"
                  >
                    <option value="" className="bg-black">Project budget (optional)</option>
                    <option value="10k-50k" className="bg-black">$10K - $50K</option>
                    <option value="50k-100k" className="bg-black">$50K - $100K</option>
                    <option value="100k+" className="bg-black">$100K+</option>
                  </select>
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={onChange("message")}
                    className="w-full bg-transparent border-b border-white/20 text-white placeholder-gray-500 py-4 focus:border-white focus:outline-none transition-colors text-lg resize-none"
                    placeholder="Tell us about your project, timeline, and goals"
                    required
                  />
                </div>

                <div className="text-center pt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-white text-black px-12 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 text-lg"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
