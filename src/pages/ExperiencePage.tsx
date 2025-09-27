import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperiences } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

export const ExperiencePage = () => {
  const { experiences, loading } = useExperiences();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && experiences.length > 0 && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.experience-item');
      
      items.forEach((item, index) => {
        gsap.fromTo(item,
          { x: index % 2 === 0 ? -100 : 100, opacity: 0, rotationY: index % 2 === 0 ? -15 : 15 },
          {
            x: 0,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Timeline line animation
      gsap.fromTo('.timeline-line',
        { height: 0 },
        {
          height: '100%',
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.timeline-container',
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1
          }
        }
      );
    }
  }, [loading, experiences]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#020213]/85" />
        <div className="relative z-10">
          <LoadingSpinner size="large" text="Loading experience..." />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#03021a]/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.36)_0%,_rgba(17,24,39,0.14)_60%,_rgba(2,6,23,0)_100%)]" />
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
            Experience
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-indigo-300 via-sky-400 to-purple-400" />
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto" data-cursor="text">
            My professional journey building amazing digital experiences
          </p>
        </motion.div>

        <div className="relative timeline-container">
          {/* Timeline line */}
          <div className="timeline-line absolute left-1/2 w-1 -translate-x-1/2 transform bg-gradient-to-b from-indigo-400 via-sky-400 to-purple-500" 
               style={{ height: '0%', top: '0%' }} />

          <div className="space-y-16">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                className={`experience-item relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 z-20 -translate-x-1/2 transform">
                  <motion.div
                    className="h-6 w-6 rounded-full border-4 border-slate-950 bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 shadow-lg"
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {/* Content card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-16' : 'pl-16'}`}>
                  <motion.div
                    className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-950/75 p-8 shadow-xl backdrop-blur-md"
                    whileHover={{ 
                      borderColor: 'rgba(56, 189, 248, 0.45)',
                      boxShadow: '0 25px 50px -12px rgba(56, 189, 248, 0.35)'
                    }}
                    data-cursor="pointer"
                  >
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2" data-cursor="text">
                        {experience.role}
                      </h3>
                      <p className="text-indigo-300 font-semibold text-lg" data-cursor="text">
                        {experience.company}
                      </p>
                      <p className="text-slate-300" data-cursor="text">
                        {experience.duration}
                      </p>
                    </div>

                    <p className="text-indigo-100/80 mb-6 leading-relaxed" data-cursor="text">
                      {experience.description}
                    </p>

                    {experience.technologies && experience.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="rounded-full border border-sky-400/40 bg-sky-400/15 px-3 py-1 text-sm font-medium text-sky-200"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(56, 189, 248, 0.3)' }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Spacer for the other side */}
                <div className="w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No experience data available</p>
          </div>
        )}
      </div>
    </div>
  );
};


