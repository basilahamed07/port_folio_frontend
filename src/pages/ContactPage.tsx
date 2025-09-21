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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-pink-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading contact info..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-pink-900 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.9, 1],
            rotate: [0, -180, -360]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            data-cursor="text"
          >
            Get In Touch
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full" />
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto" data-cursor="text">
            Let's collaborate and create something amazing together
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact form */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6" data-cursor="text">
                Send me a message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                      data-cursor="text"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      placeholder="john@example.com"
                      data-cursor="text"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    placeholder="Project Collaboration"
                    data-cursor="text"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell me about your project or say hello!"
                    data-cursor="text"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                <p className="text-gray-300 text-lg leading-relaxed mb-8" data-cursor="text">
                  I'm always interested in new opportunities, collaborations, and exciting projects. 
                  Whether you have a question, a project idea, or just want to say hello, I'd love to hear from you.
                </p>
              </div>

              {profile && (
                <div className="space-y-6">
                  <motion.div
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-400/10 to-purple-400/10 backdrop-blur-sm border border-pink-400/20 rounded-lg"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(244, 114, 182, 0.5)' }}
                    data-cursor="pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                      ✉️
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-semibold" data-cursor="text">{profile.email}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-400/10 to-purple-400/10 backdrop-blur-sm border border-pink-400/20 rounded-lg"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(244, 114, 182, 0.5)' }}
                    data-cursor="pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                      📍
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-semibold" data-cursor="text">{profile.location}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-400/10 to-purple-400/10 backdrop-blur-sm border border-pink-400/20 rounded-lg"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(244, 114, 182, 0.5)' }}
                    data-cursor="pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                      ⚡
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Response Time</p>
                      <p className="text-white font-semibold">Usually within 24 hours</p>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className="pt-8">
                <motion.div
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  whileHover={{ borderColor: 'rgba(244, 114, 182, 0.3)' }}
                >
                  <h3 className="text-xl font-bold text-white mb-4" data-cursor="text">
                    What I can help with:
                  </h3>
                  <ul className="space-y-2 text-gray-300">
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