import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useContactMessages, useProfile } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const ContactPage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { sendMessage } = useContactMessages();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await sendMessage(formData);

    if (result.success) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (profileLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#020213]/85" />
        <div className="relative z-10">
          <LoadingSpinner size="large" text="Loading contact info..." />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#03021a]/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.35)_0%,_rgba(17,24,39,0.12)_55%,_rgba(2,6,23,0)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full space-y-16 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <motion.div
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-indigo-300 via-sky-400 to-purple-400 bg-clip-text text-transparent"
            data-cursor="text"
          >
            Get In Touch
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-indigo-300 via-sky-400 to-purple-400" />
          <p className="mx-auto mt-6 max-w-2xl text-xl text-indigo-100/85" data-cursor="text">
            Let's collaborate and create something amazing together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Contact form */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/75 via-indigo-950/70 to-sky-950/60 p-8 shadow-[0_25px_60px_-30px_rgba(56,189,248,0.35)] backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-6" data-cursor="text">
                Send me a message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-indigo-100/90">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
                      placeholder="John Doe"
                      data-cursor="text"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-indigo-100/90">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
                      placeholder="john@example.com"
                      data-cursor="text"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-indigo-100/90">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
                    placeholder="Project Collaboration"
                    data-cursor="text"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-indigo-100/90">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/60"
                    placeholder="Tell me about your project or say hello!"
                    data-cursor="text"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:shadow-[0_25px_60px_-30px_rgba(56,189,248,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  data-cursor="pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      Send Message
                    </div>
                  )}
                </motion.button>

                {/* Status messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    className="flex items-center justify-center text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    Message sent successfully! I'll get back to you soon.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    className="flex items-center justify-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <XCircleIcon className="w-5 h-5 mr-2" />
                    Failed to send message. Please try again.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6" data-cursor="text">
                  Let's start a conversation
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-indigo-100/85" data-cursor="text">
                  I'm always interested in new opportunities, collaborations, and exciting projects. 
                  Whether you have a question, a project idea, or just want to say hello, I'd love to hear from you.
                </p>
              </div>

              {profile && (
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center gap-4 rounded-lg border border-white/10 bg-gradient-to-r from-slate-900/70 via-indigo-950/60 to-sky-950/55 p-4 backdrop-blur-md"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(56, 189, 248, 0.4)' }}
                    data-cursor="pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 text-xl text-white">
                      ✉️
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Email</p>
                      <p className="font-semibold text-white" data-cursor="text">{profile.email}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4 rounded-lg border border-white/10 bg-gradient-to-r from-slate-900/70 via-indigo-950/60 to-sky-950/55 p-4 backdrop-blur-md"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(56, 189, 248, 0.4)' }}
                    data-cursor="pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 text-xl text-white">
                      📍
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Location</p>
                      <p className="font-semibold text-white" data-cursor="text">{profile.location}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-4 rounded-lg border border-white/10 bg-gradient-to-r from-slate-900/70 via-indigo-950/60 to-sky-950/55 p-4 backdrop-blur-md"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(56, 189, 248, 0.4)' }}
                    data-cursor="pointer"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 text-xl text-white">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Response Time</p>
                      <p className="font-semibold text-white">Usually within 24 hours</p>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className="pt-8">
                <motion.div
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-indigo-950/60 to-sky-950/55 p-6 backdrop-blur-md"
                  whileHover={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}
                >
                  <h3 className="text-xl font-bold text-white mb-4" data-cursor="text">
                    What I can help with:
                  </h3>
                  <ul className="space-y-2 text-indigo-100/85">
                    {[
                      '🚀 Frontend Development',
                      '⚛️ React Applications',
                      '🎨 UI/UX Design',
                      '📱 Responsive Websites',
                      '🔧 Performance Optimization',
                      '💼 Consulting & Code Review'
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        data-cursor="text"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
