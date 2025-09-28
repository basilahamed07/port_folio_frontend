import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useExperiences } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

const getInitial = (label?: string | null) => {
  if (!label) {
    return 'N';
  }
  const trimmed = label.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : 'N';
};

const renderLogo = (
  url: string | null | undefined,
  label: string | null | undefined
) => {
  if (url) {
    return (
      <img
        src={url}
        alt={`${label ?? 'Experience'} logo`}
        className="h-12 w-12 flex-shrink-0 rounded-xl object-cover shadow-lg"
      />
    );
  }

  return (
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/25 text-lg font-semibold text-indigo-200 shadow-inner">
      {getInitial(label)}
    </div>
  );
};

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
          {/* Timeline line for large screens */}
          <div
            className="timeline-line pointer-events-none absolute left-1/2 hidden w-[3px] -translate-x-1/2 transform rounded-full bg-gradient-to-b from-indigo-400 via-sky-400 to-purple-500 lg:block"
            style={{ height: '0%', top: '0%' }}
          />

          <div className="space-y-16">
            {experiences.map((experience, index) => {
              const isLeft = index % 2 === 0;
              const isFirst = index === 0;
              const isLast = index === experiences.length - 1;

              const card = (
                <motion.div
                  className={`rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-950/75 p-8 shadow-xl backdrop-blur-md ${
                    isLeft ? 'lg:text-right' : 'lg:text-left'
                  }`}
                  whileHover={{
                    borderColor: 'rgba(56, 189, 248, 0.45)',
                    boxShadow: '0 25px 50px -12px rgba(56, 189, 248, 0.35)',
                  }}
                  data-cursor="pointer"
                >
                  <div
                    className={`mb-5 flex items-start gap-4 ${
                      isLeft ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-indigo-400/40 bg-gradient-to-br from-indigo-400/40 via-sky-400/30 to-transparent text-base font-semibold text-slate-100 shadow-sm lg:hidden ${
                        isLeft ? 'order-last' : ''
                      }`}
                    >
                      {index + 1}
                    </span>
                    {renderLogo(experience.logo_url, experience.company)}
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white" data-cursor="text">
                        {experience.role}
                      </h3>
                      <p className="text-indigo-300 font-semibold" data-cursor="text">
                        {experience.company}
                      </p>
                      <p className="text-slate-300 text-sm" data-cursor="text">
                        {experience.duration}
                      </p>
                    </div>
                  </div>

                  <p className="text-indigo-100/80 mb-6 leading-relaxed" data-cursor="text">
                    {experience.description}
                  </p>

                  {experience.technologies && experience.technologies.length > 0 && (
                    <div
                      className={`flex flex-wrap gap-2 ${isLeft ? 'lg:justify-end' : 'lg:justify-start'}`}
                    >
                      {experience.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          className="rounded-full border border-sky-400/40 bg-sky-400/15 px-3 py-1 text-sm font-medium text-sky-200"
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: 'rgba(56, 189, 248, 0.3)',
                          }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );

              const cardColumnClass = isLeft
                ? 'relative order-2 lg:order-1 lg:col-start-1 lg:pr-12 lg:text-right'
                : 'relative order-2 lg:order-3 lg:col-start-3 lg:pl-12 lg:text-left';

              return (
                <motion.article
                  key={experience.id}
                  className="experience-item relative grid gap-8 pl-10 sm:pl-12 lg:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:pl-0"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-indigo-200/35 to-transparent opacity-70 lg:hidden" />

                  <div className="order-1 hidden lg:flex lg:col-start-2 lg:flex-col lg:items-center lg:justify-center">
                    {!isFirst && (
                      <span className="mb-4 h-12 w-[3px] rounded-full bg-gradient-to-b from-transparent via-indigo-300/45 to-indigo-300/15" />
                    )}
                    <motion.div
                      className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-950 bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 text-lg font-semibold text-slate-950 shadow-xl"
                      whileHover={{ scale: 1.12 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {index + 1}
                    </motion.div>
                    {!isLast && (
                      <span className="mt-4 h-12 w-[3px] rounded-full bg-gradient-to-b from-indigo-300/15 via-indigo-300/45 to-transparent" />
                    )}
                  </div>

                  <div className={cardColumnClass}>
                    {isLeft ? (
                      <span className="pointer-events-none hidden lg:block absolute right-[-64px] top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-400/20 via-indigo-300/70 to-indigo-200/10" />
                    ) : (
                      <span className="pointer-events-none hidden lg:block absolute left-[-64px] top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-l from-indigo-400/20 via-indigo-300/70 to-indigo-200/10" />
                    )}
                    {card}
                  </div>
                </motion.article>
              );
            })}
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
