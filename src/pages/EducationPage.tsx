import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEducation } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

export const EducationPage = () => {
  const { education, loading } = useEducation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCertId, setActiveCertId] = useState<string | null>(null);

  const educationItems = useMemo(
    () =>
      education
        .filter((item) => item.type === 'education')
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
    [education]
  );

  const certifications = useMemo(
    () =>
      education
        .filter((item) => item.type === 'certification')
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
    [education]
  );

  const getInitial = (label?: string | null) => {
    if (!label) {
      return 'N';
    }
    const trimmed = label.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : 'N';
  };

  const renderLogo = (
    url: string | null | undefined,
    label: string | null | undefined,
    options?: { size?: 'sm' | 'lg'; extraClasses?: string }
  ) => {
    const sizeClass = options?.size === 'lg' ? 'h-16 w-16' : 'h-14 w-14';
    const textSize = options?.size === 'lg' ? 'text-2xl' : 'text-xl';
    const extra = options?.extraClasses ?? '';

    if (url) {
      return (
        <img
          src={url}
          alt={`${label ?? 'Certification'} logo`}
          className={`${sizeClass} ${extra} flex-shrink-0 rounded-lg object-cover shadow-lg`}
        />
      );
    }

    return (
      <div
        className={`${sizeClass} ${extra} flex flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 ${textSize} font-bold text-indigo-200`}
      >
        {getInitial(label)}
      </div>
    );
  };

  useEffect(() => {
    if (!loading && education.length > 0 && containerRef.current) {
      const items = containerRef.current.querySelectorAll('.education-item, .cert-item');
      
      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });

      gsap.fromTo(
        '.education-timeline-line',
        { height: 0 },
        {
          height: '100%',
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.education-timeline-container',
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: 1,
          },
        }
      );
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
              className="mb-12 text-center text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              data-cursor="text"
            >
              🎓 Formal Education
            </motion.h2>

            <div className="relative education-timeline-container">
              <div
                className="education-timeline-line pointer-events-none absolute left-1/2 hidden w-[3px] -translate-x-1/2 transform rounded-full bg-gradient-to-b from-indigo-400 via-sky-400 to-purple-500 lg:block"
                style={{ height: '0%', top: '0%' }}
              />

              <div className="space-y-16">
                {educationItems.map((item, index) => {
                  const isLeft = index % 2 === 0;
                  const isFirst = index === 0;
                  const isLast = index === educationItems.length - 1;

                  const card = (
                    <motion.div
                      className={`rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/85 to-indigo-950/70 p-8 shadow-xl backdrop-blur-md ${
                        isLeft ? 'lg:text-right' : 'lg:text-left'
                      }`}
                      whileHover={{
                        borderColor: 'rgba(79, 70, 229, 0.45)',
                        boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.35)',
                      }}
                      data-cursor="pointer"
                    >
                      <div
                        className={`mb-5 flex items-start gap-4 ${
                          isLeft ? 'lg:flex-row-reverse' : ''
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full border border-indigo-400/40 bg-gradient-to-br from-indigo-500/30 via-sky-500/20 to-transparent text-base font-semibold text-slate-100 shadow-sm lg:hidden ${
                            isLeft ? 'order-last' : ''
                          }`}
                        >
                          {index + 1}
                        </span>
                        {renderLogo(item.logo_url, item.school_name, { extraClasses: 'shadow-lg' })}
                        <div className="space-y-1 text-left lg:text-right">
                          <h3 className="text-2xl font-bold text-white" data-cursor="text">
                            {item.degree}
                          </h3>
                          <p className="text-indigo-300 font-semibold" data-cursor="text">
                            {item.school_name}
                          </p>
                          <p className="text-slate-300 text-sm" data-cursor="text">
                            {item.duration}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-200 text-sm leading-relaxed" data-cursor="text">
                        {item.description}
                      </p>
                    </motion.div>
                  );

                  const cardColumnClass = isLeft
                    ? 'relative order-2 lg:order-1 lg:col-start-1 lg:pr-12 lg:text-right'
                    : 'relative order-2 lg:order-3 lg:col-start-3 lg:pl-12 lg:text-left';

                  return (
                    <motion.article
                      key={item.id}
                      className="education-item relative grid gap-8 pl-10 sm:pl-12 lg:grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:pl-0"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-indigo-200/35 to-transparent opacity-60 lg:hidden" />

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
                          <span className="pointer-events-none hidden lg:block absolute right-[-68px] top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-400/20 via-indigo-300/70 to-indigo-200/10" />
                        ) : (
                          <span className="pointer-events-none hidden lg:block absolute left-[-68px] top-1/2 h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-l from-indigo-400/20 via-indigo-300/70 to-indigo-200/10" />
                        )}
                        {card}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div>
            <motion.h2
              className="mb-12 text-center text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              data-cursor="text"
            >
              🏆 Certifications & Achievements
            </motion.h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {certifications.map((cert) => {
                const isActive = activeCertId === cert.id;

                return (
                  <motion.div
                    key={cert.id}
                    className="cert-item group relative rounded-xl border border-indigo-400/30 bg-gradient-to-r from-indigo-500/15 via-sky-500/12 to-purple-500/15 p-6 shadow-[0_20px_45px_rgba(56,189,248,0.15)] backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-sky-300/60"
                    onHoverStart={() => setActiveCertId(cert.id)}
                    onHoverEnd={() =>
                      setActiveCertId((current) => (current === cert.id ? null : current))
                    }
                    onFocus={() => setActiveCertId(cert.id)}
                    onBlur={() =>
                      setActiveCertId((current) => (current === cert.id ? null : current))
                    }
                    tabIndex={0}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    data-cursor="pointer"
                  >
                    <div className="flex items-center gap-4">
                      {renderLogo(cert.logo_url, cert.school_name, { extraClasses: 'shadow-lg' })}
                      <div className="text-left">
                        <h3 className="text-2xl font-bold text-white" data-cursor="text">
                          {cert.degree}
                        </h3>
                        <p className="text-indigo-300 font-semibold" data-cursor="text">
                          {cert.school_name}
                        </p>
                        <p className="text-slate-300 text-sm" data-cursor="text">
                          {cert.duration}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-indigo-100/80" data-cursor="text">
                      Hover or focus to view certification details.
                    </p>

                    <motion.div
                      className="pointer-events-none absolute left-1/2 top-full z-30 hidden w-80 -translate-x-1/2 translate-y-4 rounded-2xl border border-indigo-400/40 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl md:block"
                      initial={false}
                      animate={
                        isActive
                          ? { opacity: 1, y: 0, scale: 1 }
                          : { opacity: 0, y: 16, scale: 0.94 }
                      }
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="mb-4 flex items-center gap-4">
                        {renderLogo(cert.logo_url, cert.school_name, {
                          size: 'lg',
                          extraClasses: 'shadow-xl',
                        })}
                        <div className="space-y-1 text-left">
                          <h4 className="text-lg font-semibold text-white" data-cursor="text">
                            {cert.degree}
                          </h4>
                          <p className="text-indigo-300 text-sm" data-cursor="text">
                            {cert.school_name}
                          </p>
                          <p className="text-slate-300 text-xs" data-cursor="text">
                            {cert.duration}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-200" data-cursor="text">
                        {cert.description}
                      </p>
                    </motion.div>

                    <div className="mt-5 rounded-xl border border-indigo-400/25 bg-slate-900/65 p-5 shadow-inner md:hidden">
                      <div className="mb-3 flex items-center gap-4">
                        {renderLogo(cert.logo_url, cert.school_name, {
                          extraClasses: 'shadow-lg',
                        })}
                        <div className="text-left">
                          <h4 className="text-lg font-semibold text-white" data-cursor="text">
                            {cert.degree}
                          </h4>
                          <p className="text-indigo-200 text-sm" data-cursor="text">
                            {cert.school_name}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-200" data-cursor="text">
                        {cert.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
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
