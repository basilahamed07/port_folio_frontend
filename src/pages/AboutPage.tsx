import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProfile } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

export const AboutPage = () => {
  const { profile, loading } = useProfile();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && profile && containerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      if (imageRef.current) {
        tl.fromTo(imageRef.current,
          { x: -100, opacity: 0, rotationY: -15 },
          { x: 0, opacity: 1, rotationY: 0, duration: 1, ease: "power3.out" }
        );
      }

      if (textRef.current) {
        tl.fromTo(textRef.current,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
          "-=0.5"
        );
      }

    }
  }, [loading, profile]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#020213]/85" />
        <div className="relative z-10">
          <LoadingSpinner size="large" text="Loading about..." />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#020213]/85" />
        <p className="relative z-10 text-xl">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#03021a]/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(55,48,163,0.42)_0%,_rgba(17,24,39,0.12)_45%,_rgba(2,6,23,0)_100%)]" />
      </div>

      <div
        ref={containerRef}
        className="relative z-10 mx-auto w-full space-y-16 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32"
      >
        <motion.div
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            data-cursor="text"
          >
            About Me
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image */}
          <motion.div
            ref={imageRef}
            className="relative"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="aspect-square bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-xl flex items-center justify-center mb-6">
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {profile.name.charAt(0)}
                  </motion.div>
                </div>

                <div className="space-y-4 text-center">
                  <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
                  <p className="text-indigo-400 font-semibold">{profile.title}</p>
                  <p className="text-gray-400">📍 {profile.location}</p>
                  <p className="text-gray-400">✉️ {profile.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            ref={textRef}
            className="space-y-8"
          >
            <div>
              <motion.h2
                className="text-3xl font-bold text-white mb-6"
                data-cursor="text"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                My Story
              </motion.h2>
              
              <motion.p
                className="text-gray-300 text-lg leading-relaxed mb-6"
                data-cursor="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {profile.bio}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'Years of Experience', value: '5+', icon: '💼' },
                { label: 'Projects Completed', value: '50+', icon: '🚀' },
                { label: 'Technologies Mastered', value: '15+', icon: '⚡' },
                { label: 'Happy Clients', value: '25+', icon: '😊' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    borderColor: 'rgba(99, 102, 241, 0.5)' 
                  }}
                  data-cursor="pointer"
                  onClick={() => {
                    // Create a simple resume download
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = 'resume.pdf';
                    link.click();
                  }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-indigo-400 mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-cursor="pointer"
              >
                Download Resume
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
