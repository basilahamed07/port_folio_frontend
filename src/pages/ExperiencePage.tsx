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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading experience..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-green-900 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-40 left-10 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
            data-cursor="text"
          >
            Experience
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full" />
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto" data-cursor="text">
            My professional journey building amazing digital experiences
          </p>
        </motion.div>

        <div className="relative timeline-container">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-green-400 to-blue-400 timeline-line" 
               style={{ height: '0%', top: '0%' }} />

          <div className="space-y-16">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                className={`experience-item relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-4 border-gray-900 shadow-lg"
                    whileHover={{ scale: 1.5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                </div>

                {/* Content card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-16' : 'pl-16'}`}>
                  <motion.div
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl"
                    whileHover={{ 
                      borderColor: 'rgba(34, 197, 94, 0.5)',
                      boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25)'
                    }}
                    data-cursor="pointer"
                  >
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2" data-cursor="text">
                        {experience.role}
                      </h3>
                      <p className="text-green-400 font-semibold text-lg" data-cursor="text">
                        {experience.company}
                      </p>
                      <p className="text-gray-400" data-cursor="text">
                        {experience.duration}
                      </p>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed" data-cursor="text">
                      {experience.description}
                    </p>

                    {experience.technologies && experience.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-sm font-medium border border-green-400/30"
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(34, 197, 94, 0.3)' }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
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