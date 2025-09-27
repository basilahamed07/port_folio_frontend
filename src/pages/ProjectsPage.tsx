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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">
        <div className="absolute inset-0 bg-[#020213]/85" />
        <div className="relative z-10">
          <LoadingSpinner size="large" text="Loading projects..." />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden py-20 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#03021a]/58" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.36)_0%,_rgba(17,24,39,0.13)_55%,_rgba(2,6,23,0)_100%)]" />
      </div>

      <div ref={containerRef} className="relative z-10 mx-auto w-full space-y-16 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32">
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
            Projects
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-indigo-300 via-sky-400 to-purple-400" />
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto" data-cursor="text">
            Showcasing my passion for creating innovative digital solutions
          </p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-full border border-white/10 bg-slate-900/60 p-1 backdrop-blur-md shadow-[0_25px_60px_-25px_rgba(56,189,248,0.25)]">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-300 hover:text-white'
              }`}
              data-cursor="pointer"
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === 'featured' 
                  ? 'bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-300 hover:text-white'
              }`}
              data-cursor="pointer"
            >
              Featured
            </button>
          </div>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-indigo-950/70 to-sky-900/60 shadow-xl backdrop-blur-md"
              whileHover={{ 
                scale: 1.05,
                borderColor: 'rgba(99, 102, 241, 0.5)',
                boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.35)'
              }}
              onClick={() => setSelectedProject(project)}
              data-cursor="pointer"
            >
              {/* Project image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-400/20 via-sky-400/15 to-purple-400/20">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 text-3xl font-bold text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      🚀
                    </motion.div>
                  </div>
                )}
                
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <motion.span
                      className="rounded-full bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 px-3 py-1 text-xs font-bold text-slate-900"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(245, 158, 11, 0.7)', '0 0 0 10px rgba(245, 158, 11, 0)'],
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      ⭐ Featured
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Project content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-sky-400" data-cursor="text">
                  {project.title}
                </h3>
                
                <p className="text-indigo-100/80 text-sm mb-4 line-clamp-2" data-cursor="text">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="rounded border border-sky-400/40 bg-sky-400/15 px-2 py-1 text-xs font-medium text-sky-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="rounded bg-slate-400/10 px-2 py-1 text-xs text-slate-200">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  {project.live_url && (
                    <motion.a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 px-4 py-2 font-medium text-white shadow-[0_18px_40px_-18px_rgba(56,189,248,0.45)] transition-all duration-300 hover:shadow-indigo-900/30"
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
                      className="flex flex-1 items-center justify-center rounded-lg border border-slate-600 px-4 py-2 font-medium text-slate-200 transition-all duration-300 hover:border-sky-400 hover:text-sky-300"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            className="w-full max-h-[90vh] max-w-4xl overflow-y-auto rounded-xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-sky-950 p-8 shadow-[0_40px_70px_-35px_rgba(56,189,248,0.35)]"
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

            <p className="mb-6 text-lg leading-relaxed text-indigo-100/85" data-cursor="text">
              {selectedProject.description}
            </p>

            {selectedProject.technologies && selectedProject.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-xl font-semibold text-white">Technologies Used</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-sky-400/40 bg-sky-400/15 px-4 py-2 font-medium text-sky-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {selectedProject.live_url && (
                <motion.a
                  href={selectedProject.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-[0_25px_60px_-30px_rgba(56,189,248,0.6)] transition-all duration-300 hover:shadow-indigo-900/40"
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
                  className="flex items-center rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-200 transition-all duration-300 hover:border-sky-400 hover:text-sky-300"
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


