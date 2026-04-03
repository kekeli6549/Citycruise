import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Loader2 } from 'lucide-react';
import { sendEnquiry } from '../api/emailService';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      await sendEnquiry(formData.email, formData.fullname, formData.message);

      setStatus('Message sent successfully!');
      setFormData({ fullname: '', email: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">

          {/* Left Panel: Info */}
          <div className="md:w-2/5 bg-brand-blue p-12 lg:p-16 text-white flex flex-col justify-between relative">
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="font-heading text-4xl mb-4">Let's shape your future.</h2>
                <p className="font-body text-blue-100/70">Have questions about our fleet or services? Our team in Abuja is ready to assist you.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Headquarters</p>
                    <p className="text-xs text-blue-100/60 leading-relaxed">Central Business District, Abuja, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Email Us</p>
                    <p className="text-xs text-blue-100/60 leading-relaxed">citycruisesupport@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Right Panel: Form */}
          <div className="md:w-3/5 p-12 lg:p-16 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  {/* Increased size from text-[10px] to text-xs for better legibility */}
                  <label className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  {/* Increased size from text-[10px] to text-xs for better legibility */}
                  <label className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {/* Increased size from text-[10px] to text-xs for better legibility */}
                <label className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-bold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows="4"
                  required
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all resize-none"
                ></textarea>
              </div>

              <motion.button
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-200 ${isSubmitting ? 'bg-slate-400' : 'bg-brand-dark hover:bg-brand-blue'}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Request Call Back'
                )}
              </motion.button>

              {status && (
                <p className={`font-mono text-xs text-center ${status.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;