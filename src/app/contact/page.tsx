'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/supabase/client';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (!formData.name.trim()) {
        setErrorMsg('Please enter your name.');
        setSubmitting(false);
        return;
      }
      if (!formData.email.trim() && !formData.phone.trim()) {
        setErrorMsg('Please provide either an email or phone number.');
        setSubmitting(false);
        return;
      }

      const nameParts = formData.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '-';

      const supabase = createClient();
      const { error: insertError } = await supabase
        .from('contact_inquiries')
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          source: 'furniture',
          status: 'new',
        });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        setErrorMsg('Unable to submit inquiry. Please try again.');
      } else {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err: any) {
      console.error('Network error in inquiry submission:', err);
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-ink">
      <Header dynamic={false} />

      <main className="flex-grow pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-12 md:mb-16 pb-8 border-b border-hairline/60">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-sage" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sage">
                Atelier Inquiry & Bespoke
              </span>
            </div>
            <h1 className="font-serif text-[36px] sm:text-[48px] md:text-[60px] font-medium leading-[1.08] tracking-tight text-ink">
              Connect With Our Studio.
            </h1>
            <p className="font-sans text-[14px] md:text-[16px] text-body/80 font-normal leading-relaxed max-w-xl mt-4">
              Whether you are commissioning a bespoke dining table, sourcing for an architectural project, or visiting our workshop, our craft specialists are at your disposal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
            {/* Left: Studio Details */}
            <div className="md:col-span-5 space-y-8 font-sans text-sm text-body/85">
              <div>
                <h3 className="font-serif text-lg font-medium text-ink mb-2">Bangkok Atelier</h3>
                <p className="leading-relaxed text-muted">
                  332 Pradit Manutham Road<br />
                  Wang Thonglang, Bangkok 10310
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg font-medium text-ink mb-2">Private Viewing & Inquiries</h3>
                <p className="leading-relaxed text-muted">
                  Monday – Saturday: 10:00 – 19:00<br />
                  Sunday: By Appointment Only
                </p>
              </div>

              <div className="pt-4 border-t border-hairline/60">
                <span className="text-[11px] uppercase tracking-wider text-muted block mb-1">Direct Assistance</span>
                <p className="font-medium text-ink">+66 2 XXX XXXX</p>
                <p className="font-medium text-ink">atelier@emberandash.com</p>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="md:col-span-7 bg-white/40 p-8 sm:p-10 rounded-2xl border border-hairline/80 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-sage mx-auto" />
                  <h3 className="font-serif text-2xl font-medium text-ink">Thank You for Your Inquiry.</h3>
                  <p className="text-sm font-sans text-body/80 max-w-md mx-auto">
                    Our atelier team has received your message and will be in touch with tailored material advice shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 font-sans text-xs uppercase tracking-widest border-b border-ink pb-1 font-semibold hover:text-sage transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-3.5 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-ink/75 font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Architect / Client Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-hairline bg-white/70 text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-ink/75 font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-hairline bg-white/70 text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-wider text-ink/75 font-semibold mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+66 8X XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-hairline bg-white/70 text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs uppercase tracking-wider text-ink/75 font-semibold mb-2">
                      Project Details or Questions *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about the pieces, materials, or dimensions you are interested in..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-hairline bg-white/70 text-ink text-sm focus:outline-none focus:border-ink transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-ink hover:bg-black text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
