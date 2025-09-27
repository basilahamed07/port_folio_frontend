import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEducation } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

export const EducationPage = () => {
  const { education, loading } = useEducation();
  const containerRef = useRef<HTMLDivElement>(null);

  const educationItems = education.filter(item => item.type === 'education');
  const certifications = education.filter(item => item.type === 'certification');

  useEffect(() => {
    if (!loading && education.length > 0 && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.education-item, .cert-item');
      
      items.forEach((item, index) => {
        gsap.fromTo(item,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );
      });
    }
  }, [loading, education]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#020213]/85" />
        <div className="relative z-10">
          <LoadingSpinner size="large" text="Loading education..." />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#03021a]/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.38)_0%,_rgba(17,24,39,0.16)_50%,_rgba(2,6,23,0)_100%)]" />
      </div>

      <div ref={containerRef} className="relative z-10 mx-auto w-full space-y-20 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32">
        <motion.div
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-indigo-300 via-sky-400 to-purple-400 bg-clip-text text-transparent"
            data-cursor="text"
          >
            Education
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-indigo-300 via-sky-400 to-purple-400" />
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto" data-cursor="text">
            My academic journey and continuous learning path
          </p>
        </motion.div>

        {/* Education Section */}
        {educationItems.length > 0 && (
          <div className="mb-20">
            <motion.h2
              className="text-3xl font-bold text-white mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              data-cursor="text"
            >
              🎓 Formal Education
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {educationItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="education-item group rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-950/70 p-6 shadow-xl backdrop-blur-md"
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: 'rgba(79, 70, 229, 0.45)',
                    boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.35)'
                  }}
                  data-cursor="pointer"
                >
                  <div className="mb-4">
                    <motion.div
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-500 text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110"
                    >
                      🏫
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-2" data-cursor="text">
                      {item.degree}
                    </h3>
                    <p className="font-semibold text-indigo-300" data-cursor="text">
                      {item.school_name}
                    </p>
                    <p className="text-gray-400 text-sm" data-cursor="text">
                      {item.duration}
                    </p>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed" data-cursor="text">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div>
            <motion.h2
              className="text-3xl font-bold text-white mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              data-cursor="text"
            >
              🏆 Certifications & Achievements
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  className="cert-item group rounded-xl border border-indigo-400/25 bg-gradient-to-r from-indigo-500/15 via-sky-500/10 to-purple-500/15 p-8 shadow-[0_20px_45px_rgba(56,189,248,0.15)] backdrop-blur-md"
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: 'rgba(56, 189, 248, 0.55)',
                    backgroundColor: 'rgba(79, 70, 229, 0.12)'
                  }}
                  data-cursor="pointer"
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-500 text-3xl text-white transition-transform duration-300 group-hover:scale-110"
                    >
                      🎖️
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2" data-cursor="text">
                        {cert.degree}
                      </h3>
                      <p className="text-indigo-300 font-semibold text-lg mb-1" data-cursor="text">
                        {cert.school_name}
                      </p>
                      <p className="text-gray-400 mb-4" data-cursor="text">
                        {cert.duration}
                      </p>
                      <p className="text-gray-300 leading-relaxed" data-cursor="text">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {education.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No education data available</p>
          </div>
        )}
      </div>
    </div>
  );
};


