import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { useProjects } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

export const ProjectsPage = () => {
  const { projects, loading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projects.filter(project => 
    filter === 'all' || (filter === 'featured' && project.featured)
  );

  useEffect(() => {
    if (!loading && projects.length > 0 && containerRef.current) {
      const projectCards = containerRef.current.querySelectorAll('.project-card');
      
      projectCards.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );
      });
    }
  }, [loading, projects, filteredProjects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-32 left-16 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-96 h-96 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -40, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
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
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            data-cursor="text"
          >
            Projects
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto" data-cursor="text">
            Showcasing my passion for creating innovative digital solutions
          </p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              data-cursor="pointer"
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'featured' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              data-cursor="pointer"
            >
              Featured
            </button>
          </div>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl group"
              whileHover={{ 
                scale: 1.05,
                borderColor: 'rgba(59, 130, 246, 0.5)',
                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)'
              }}
              onClick={() => setSelectedProject(project)}
              data-cursor="pointer"
            >
              {/* Project image */}
              <div className="aspect-video bg-gradient-to-br from-blue-400/20 to-cyan-400/20 relative overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      🚀
                    </motion.div>
                  </div>
                )}
                
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <motion.span
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(245, 158, 11, 0.7)', '0 0 0 10px rgba(245, 158, 11, 0)'],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⭐ Featured
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Project content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300" data-cursor="text">
                  {project.title}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2" data-cursor="text">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-blue-400/20 text-blue-300 rounded text-xs font-medium border border-blue-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-400/20 text-gray-300 rounded text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex space-x-2">
                  {project.live_url && (
                    <motion.a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      data-cursor="pointer"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                      Live Demo
                    </motion.a>
                  )}
                  
                  {project.github_url && (
                    <motion.a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-300 rounded-lg font-medium hover:border-blue-400 hover:text-blue-400 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      data-cursor="pointer"
                    >
                      <CodeBracketIcon className="w-4 h-4 mr-2" />
                      Code
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No projects found</p>
          </div>
        )}
      </div>

      {/* Project modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-white" data-cursor="text">
                {selectedProject.title}
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white text-2xl"
                data-cursor="pointer"
              >
                ×
              </button>
            </div>

            {selectedProject.image_url && (
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full aspect-video object-cover rounded-lg mb-6"
              />
            )}

            <p className="text-gray-300 text-lg leading-relaxed mb-6" data-cursor="text">
              {selectedProject.description}
            </p>

            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-400/20 text-blue-300 rounded-full font-medium border border-blue-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              {selectedProject.live_url && (
                <motion.a
                  href={selectedProject.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor="pointer"
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
                  View Live Project
                </motion.a>
              )}
              
              {selectedProject.github_url && (
                <motion.a
                  href={selectedProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:border-blue-400 hover:text-blue-400 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-cursor="pointer"
                >
                  <CodeBracketIcon className="w-5 h-5 mr-2" />
                  View Source Code
                </motion.a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};