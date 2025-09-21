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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading education..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-orange-900 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 25,
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
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
            data-cursor="text"
          >
            Education
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-400 mx-auto rounded-full" />
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
              transition={{ duration: 0.8, delay: 0.2 }}
              data-cursor="text"
            >
              🎓 Formal Education
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {educationItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="education-item bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl group"
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: 'rgba(251, 146, 60, 0.5)',
                    boxShadow: '0 25px 50px -12px rgba(251, 146, 60, 0.25)'
                  }}
                  data-cursor="pointer"
                >
                  <div className="mb-4">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300"
                    >
                      🏫
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-white mb-2" data-cursor="text">
                      {item.degree}
                    </h3>
                    <p className="text-orange-400 font-semibold" data-cursor="text">
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
              transition={{ duration: 0.8, delay: 0.4 }}
              data-cursor="text"
            >
              🏆 Certifications & Achievements
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  className="cert-item bg-gradient-to-r from-orange-400/10 to-red-400/10 backdrop-blur-sm border border-orange-400/20 rounded-xl p-8 shadow-xl group"
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: 'rgba(251, 146, 60, 0.5)',
                    backgroundColor: 'rgba(251, 146, 60, 0.1)'
                  }}
                  data-cursor="pointer"
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform duration-300"
                    >
                      🎖️
                    </motion.div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2" data-cursor="text">
                        {cert.degree}
                      </h3>
                      <p className="text-orange-400 font-semibold text-lg mb-1" data-cursor="text">
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