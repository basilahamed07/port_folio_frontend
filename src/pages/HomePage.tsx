import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProfile, useExperiences, useEducation, useProjects, useSkills, useMissionStats, useSpaceHighlights } from '../hooks/usePortfolioData';
import { HeroOrb } from '../components/animations/HeroOrb';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);



const sectionVariant = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const cardHover = {
  whileHover: { y: -6, scale: 1.01 },
  whileTap: { scale: 0.99 },
};

const sectionShellClass =
  'relative z-10 w-full scroll-mt-28 px-4 py-20 sm:px-8 lg:px-14 xl:px-20 2xl:px-28';

const ABOUT_TRAIT_BADGES = [
  'Realtime telemetry',
  'Adaptive UX systems',
  'Crew leadership',
  'Immersive storytelling',
] as const;

const HIGHLIGHT_CONFIGS = [
  {
    className: 'absolute -right-6 top-1/3 w-40 rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl sm:-right-10',
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
  },
  {
    className: 'absolute -left-6 bottom-6 w-44 rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl sm:-left-12',
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
  },
] as const;


const certificationCardVariants = {
  idle: {
    y: 0,
    scale: 1,
    boxShadow: '0 14px 32px -18px rgba(15, 23, 42, 0.45)',
  },
  active: {
    y: -14,
    scale: 1.045,
    boxShadow: '0 45px 75px -30px rgba(99, 102, 241, 0.55)',
    transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] },
  },
};

export const HomePage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { experiences, loading: experienceLoading } = useExperiences();
  const { education, loading: educationLoading } = useEducation();
  const { projects, loading: projectsLoading } = useProjects();
  const { skillsSection, loading: skillsLoading } = useSkills();
  const { missionStats, loading: missionStatsLoading } = useMissionStats();
  const { spaceHighlights, loading: spaceHighlightsLoading } = useSpaceHighlights();
  const pageRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const loading =
    profileLoading ||
    experienceLoading ||
    educationLoading ||
    projectsLoading ||
    skillsLoading ||
    missionStatsLoading ||
    spaceHighlightsLoading;

  const orderedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      const aIndex = a.order_index ?? 0;
      const bIndex = b.order_index ?? 0;
      return aIndex - bIndex;
    });
  }, [experiences]);

  const educationTimeline = useMemo(() => {
    return [...education].sort((a, b) => {
      const aIndex = a.order_index ?? 0;
      const bIndex = b.order_index ?? 0;
      return aIndex - bIndex;
    });
  }, [education]);

  const formalEducation = useMemo(
    () => educationTimeline.filter((item) => item.type === 'education'),
    [educationTimeline]
  );
  const certifications = useMemo(
    () => educationTimeline.filter((item) => item.type === 'certification'),
    [educationTimeline]
  );

  const [activeCertificationId, setActiveCertificationId] = useState<string | null>(null);

  const latestCredential = useMemo(() => {
    if (certifications.length > 0) {
      return certifications[certifications.length - 1];
    }
    if (formalEducation.length > 0) {
      return formalEducation[formalEducation.length - 1];
    }
    return null;
  }, [certifications, formalEducation]);

  const educationMetrics = useMemo(
    () => [
      {
        label: 'Formal programs',
        value: formalEducation.length ? `${formalEducation.length}` : '0',
        description: 'Ground control theory, HCI, and systems strategy for mission-critical builds.',
      },
      {
        label: 'Certifications',
        value: certifications.length ? `${certifications.length}` : '0',
        description: 'Flight software, spatial computing, and systems architecture credentials.',
      },
      {
        label: 'Latest credential',
        value: latestCredential?.duration ?? 'Ongoing',
        description: latestCredential?.school_name ?? 'Crew-ready, always logging new simulations and certifications.',
      },
    ],
    [formalEducation.length, certifications.length, latestCredential]
  );
  const featuredProjects = useMemo(() => {
    const featured = projects.filter((project) => project.featured);
    return (featured.length > 0 ? featured : projects).slice(0, 3);
  }, [projects]);

  const skillsItems = useMemo(() => skillsSection?.items ?? [], [skillsSection]);
  const skillsTitle = skillsSection?.title ?? 'Skills arsenal';
  const skillsDescription = skillsSection?.description ?? 'Capabilities powering each mission.';

  const contactEmail = profile?.email ?? 'hello@example.com';
  const orbitLocation = profile?.location ? `Orbiting from ${profile.location}` : 'Orbiting Earth';
  const featureWords = useMemo(
    () =>
      profile?.headline_words && profile.headline_words.length > 0
        ? profile.headline_words
        : ['Interstellar', 'Mission-ready', 'Combat-simulated', 'Adaptive'],
    [profile?.headline_words]
  );

  const aboutBackgroundImage = useMemo(
    () => profile?.about_background_url ?? profile?.avatar_url ?? null,
    [profile?.about_background_url, profile?.avatar_url]
  );
  const aboutBackgroundStyle = useMemo(
    () =>
      aboutBackgroundImage
        ? {
            backgroundImage: `linear-gradient(160deg, rgba(8, 12, 24, 0.92) 0%, rgba(18, 20, 36, 0.82) 45%, rgba(10, 15, 32, 0.94) 100%), url(${aboutBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
        : undefined,
    [aboutBackgroundImage]
  );
  const primaryExperience = orderedExperiences[0];
  const aboutHighlights = [
    {
      label: 'Mission focus',
      value: profile?.title ?? 'Mission systems architect',
      description: 'Designing immersive control rooms and telemetry loops built to handle launch pressure.',
    },
    {
      label: 'Current command',
      value: primaryExperience
        ? `${primaryExperience.role}${primaryExperience.company ? ` @ ${primaryExperience.company}` : ''}`
        : 'Guiding cross-functional crews',
      description:
        primaryExperience?.duration ?? 'Keeping crews calibrated across every release window.',
    },
    {
      label: 'Operating base',
      value: profile?.location ?? 'Orbiting Earth',
      description: 'Remote-first with on-site mission embeds where the crew needs a lead.',
    },
    {
      label: 'Comms channel',
      value: contactEmail,
      description: 'Available for mission-critical engagements and rapid discovery calls.',
    },
  ];
  const conciseHighlights = useMemo(() => aboutHighlights.slice(0, 3), [aboutHighlights]);


  useEffect(() => {
    if (loading) return;
    if (!aboutSectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-about-animate="heading"]', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('[data-about-animate="card"]', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.14,
        delay: 0.12,
      });

      gsap.from('[data-about-animate="meta"]', {
        opacity: 0,
        y: 18,
        duration: 0.75,
        ease: 'power2.out',
        stagger: 0.08,
        delay: 0.3,
      });
    }, aboutSectionRef);

    return () => ctx.revert();
  }, [loading]);

  const getLogoUrl = (entity: { logo_url?: string | null } | Record<string, unknown>) => {
    const logo = (entity as { logo_url?: string | null }).logo_url;
    if (logo) return logo;
    const image = (entity as { image_url?: string | null }).image_url;
    return image ?? undefined;
  };

  const getInitial = (label?: string | null) => {
    if (!label) return 'N';
    const trimmed = label.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : 'N';
  };

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const heroTimeline = gsap.timeline({ delay: 0.3 });

      heroTimeline
        .fromTo('.hero-kicker', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .fromTo('.hero-heading', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.2')
        .fromTo('.hero-subheading', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');

      gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((element, index) => {
        gsap.fromTo(
          element,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: index * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              scroller: document.body,
              start: 'top 85%',
            },
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading portfolio..." />
      </div>
    );
  }

  const handleScrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -120, duration: 1 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-hidden text-white">
      <section id="hero" className="relative z-10 flex min-h-screen w-full items-center px-4 py-16 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid w-full grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)] lg:items-center xl:gap-20 2xl:gap-24">
          <div className="flex flex-col justify-center space-y-9 text-center lg:text-left">
            <span
              className="hero-kicker inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200 shadow-lg shadow-indigo-500/10 lg:self-start"
              data-cursor="text"
            >
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              {orbitLocation}
            </span>

            <motion.h1
              className="hero-heading text-4xl font-black leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
              data-cursor="text"
            >
              {featureWords.map((word, index) => (
                <span
                  key={word}
                  className="inline-block animate-gradient bg-gradient-to-r from-indigo-300 via-purple-400 to-sky-300 bg-clip-text text-transparent"
                >
                  {word}
                  {index !== featureWords.length - 1 ? <span className="text-white">.</span> : null}
                  {' '}
                </span>
              ))}
              {profile?.name ?? 'Alex Johnson'}
            </motion.h1>

            <motion.p
              className="hero-subheading mx-auto max-w-2xl text-base text-indigo-100/90 sm:text-lg md:text-xl lg:text-left"
              data-cursor="text"
            >
              {profile?.bio ??
                'I craft mission control systems that feel like cinematic space operas. From holographic telemetry to responsive combat dashboards, every interaction is tuned for clarity under pressure.'}
            </motion.p>

            <div className="hero-cta flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <motion.button
                type="button"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 transition duration-300 hover:shadow-2xl hover:shadow-purple-500/40"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                data-cursor="pointer"
                onClick={() => handleScrollToSection('projects')}
              >
                Launch Mission Log
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all group-hover:translate-x-1 group-hover:bg-white/30">
                  ?
                </span>
              </motion.button>

              <motion.button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-indigo-100 transition duration-300 hover:border-indigo-400 hover:text-white"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                data-cursor="pointer"
                onClick={() => handleScrollToSection('contact')}
              >
                Open Comms Channel
                <span className="text-xl">?</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
              {missionStats.map((item) => (
                <motion.div
                  key={item.id ?? item.label}
                  className="reveal-on-scroll group rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/60 hover:bg-indigo-500/10"
                  whileHover={{ scale: 1.03 }}
                  data-cursor="pointer"
                >
                  <p className="text-3xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-indigo-200">{item.label}</p>
                  <p className="mt-2 text-xs text-indigo-100/80">{item.description ?? 'Details on standby.'}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:pl-6 xl:pl-10 2xl:pl-16">
            <div className="reveal-on-scroll relative flex aspect-square w-full max-w-[460px] items-center justify-center rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl backdrop-saturate-150 sm:max-w-[520px] sm:rounded-[42px] sm:p-8 2xl:max-w-[560px]">
              <div className="absolute inset-10 -z-10 rounded-[52px] bg-gradient-to-tr from-indigo-500/40 via-purple-500/30 to-sky-400/30 blur-3xl sm:inset-12" />
              <HeroOrb className="h-full w-full" />

              {spaceHighlights.slice(0, HIGHLIGHT_CONFIGS.length).map((highlight, index) => {
                const config = HIGHLIGHT_CONFIGS[index];
                if (!config) return null;

                return (
                  <motion.div
                    key={highlight.id ?? highlight.title ?? index}
                    className={config.className}
                    initial={config.initial}
                    whileInView={config.whileInView}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    data-cursor="pointer"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                      {highlight.title ?? 'Mission signal'}
                    </p>
                    <p className="mt-2 text-sm text-indigo-100/90">
                      {highlight.description ?? 'Dynamic highlight ready for telemetry updates.'}
                    </p>
                  </motion.div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      <section id="skills" className={sectionShellClass}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll grid w-full gap-10 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)] lg:p-10 xl:gap-14"
        >
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200" data-cursor="text">{skillsTitle}</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl" data-cursor="text">{profile?.title ?? 'Mission systems specialist'}</h2>
            <ul className="grid gap-3 sm:grid-cols-2" data-cursor="text">
              {skillsItems.map((skill) => (
                <motion.li
                  key={skill.id ?? skill.name}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-indigo-100 backdrop-blur-xl"
                  whileHover={{ x: 6 }}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-sky-500 text-xs font-bold text-white">
                    {getInitial(skill.name)}
                  </span>
                  {skill.name}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-sky-500/20 p-8 text-indigo-50 shadow-2xl shadow-indigo-900/30" data-cursor="text">
            <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-indigo-200">Capability summary</h3>
            <p className="text-sm leading-relaxed text-indigo-100/80">{skillsDescription}</p>
            <p className="text-sm leading-relaxed text-indigo-100/80">{profile?.bio ?? 'I build interaction systems that keep crews confident while the mission heats up.'}</p>
          </div>
        </motion.div>
      </section>

      <section id="experience" className={sectionShellClass}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll w-full space-y-12"
        >
          <div className="flex flex-col gap-4 text-left lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Experience</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Commanding product crews from briefing to deorbit</h2>
            </div>
            <p className="max-w-xl text-sm text-indigo-100/80">
              Every assignment is logged so you can trace how each squad moved from concept to live deployment.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-6xl">
            <span className="pointer-events-none absolute left-6 top-0 h-full w-px bg-gradient-to-b from-sky-400/60 via-white/12 to-transparent lg:hidden" />
            <span className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-sky-400/60 via-white/12 to-transparent lg:block" />

            <div className="space-y-12 lg:space-y-16">
              {orderedExperiences.map((experience, index) => {
                const isLeft = index % 2 === 0;
                const isFirst = index === 0;
                const isLast = index === orderedExperiences.length - 1;
                const logoUrl = getLogoUrl(experience as Record<string, unknown>);
                const initial = getInitial(experience.company ?? experience.role);

                const card = (
                  <div
                    className={`rounded-3xl border border-white/12 bg-white/5 p-6 text-left shadow-2xl shadow-indigo-950/25 backdrop-blur-xl sm:p-7 ${
                      isLeft ? 'lg:text-right' : 'lg:text-left'
                    }`}
                    data-cursor="text"
                  >
                    <div
                      className={`mb-5 flex items-start gap-4 ${
                        isLeft ? 'lg:flex-row-reverse' : ''
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-sky-400/30 bg-gradient-to-br from-sky-500/30 via-sky-400/25 to-transparent text-sm font-semibold text-sky-100 shadow-sm lg:hidden ${
                          isLeft ? 'order-last' : ''
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-inner">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={`${experience.company} logo`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-white">{initial}</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-indigo-200">
                          <span>{experience.company}</span>
                          <span className="text-indigo-100/70">{experience.duration}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{experience.role}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-indigo-100/80">
                            {experience.description}
                          </p>
                        </div>
                        {experience.technologies?.length ? (
                          <div
                            className={`flex flex-wrap gap-2 ${
                              isLeft ? 'lg:justify-end' : 'lg:justify-start'
                            }`}
                          >
                            {experience.technologies.map((tech) => (
                              <span
                                key={`${experience.id ?? index}-${tech}`}
                                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100/80"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );

                const cardColumnClass = isLeft
                  ? 'relative order-2 lg:order-1 lg:col-start-1 lg:pr-14 lg:text-right'
                  : 'relative order-2 lg:order-3 lg:col-start-3 lg:pl-14 lg:text-left';

                return (
                  <motion.article
                    key={experience.id ?? index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.55 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="experience-home-item relative grid gap-8 pl-12 sm:pl-16 lg:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:pl-0"
                  >
                    <span className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-sky-400/30 to-transparent lg:hidden" />

                    <div className="order-1 hidden lg:flex lg:col-start-2 lg:flex-col lg:items-center lg:justify-center">
                      {!isFirst && (
                        <span className="mb-4 h-14 w-[3px] rounded-full bg-gradient-to-b from-transparent via-sky-200/45 to-sky-200/20" />
                      )}
                      <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-950 bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 text-lg font-semibold text-slate-950 shadow-xl">
                        {index + 1}
                      </div>
                      {!isLast && (
                        <span className="mt-4 h-14 w-[3px] rounded-full bg-gradient-to-b from-sky-200/20 via-sky-200/45 to-transparent" />
                      )}
                    </div>

                    <div className={cardColumnClass}>
                      {isLeft ? (
                        <span className="pointer-events-none absolute right-[-68px] top-1/2 hidden h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-400/25 via-indigo-300/70 to-indigo-200/10 lg:block" />
                      ) : (
                        <span className="pointer-events-none absolute left-[-68px] top-1/2 hidden h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-l from-sky-400/25 via-indigo-300/70 to-indigo-200/10 lg:block" />
                      )}
                      {card}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="education" className={sectionShellClass}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll w-full space-y-10"
        >
          <div className="space-y-4 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Training & credentials</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Training engineered for orbital velocity</h2>
            <p className="max-w-2xl text-sm text-indigo-100/80">
              Formal programs follow the timeline; certifications sit in a hover-ready dossier for quick inspection.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {educationMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left">
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-200">{metric.label}</p>
                <p className="mt-2 text-xs text-indigo-100/80">{metric.description}</p>
              </div>
            ))}
          </div>

          <div className="relative mx-auto w-full max-w-6xl">
            <span className="pointer-events-none absolute left-6 top-0 h-full w-px bg-gradient-to-b from-indigo-400/60 via-white/12 to-transparent lg:hidden" />
            <span className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-indigo-400/60 via-white/12 to-transparent lg:block" />

            <div className="space-y-12 lg:space-y-16">
              {formalEducation.map((item, index) => {
                const isLeft = index % 2 === 0;
                const isFirst = index === 0;
                const isLast = index === formalEducation.length - 1;
                const logoUrl = getLogoUrl(item as Record<string, unknown>);
                const initial = getInitial(item.school_name ?? item.degree);

                const card = (
                  <div
                    className={`rounded-3xl border border-white/12 bg-white/5 p-6 text-left shadow-xl shadow-indigo-900/25 backdrop-blur-xl sm:p-7 ${
                      isLeft ? 'lg:text-right' : 'lg:text-left'
                    }`}
                    data-cursor="text"
                  >
                    <div
                      className={`mb-5 flex items-start gap-4 ${
                        isLeft ? 'lg:flex-row-reverse' : ''
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-indigo-400/35 bg-gradient-to-br from-indigo-500/30 via-sky-500/25 to-transparent text-sm font-semibold text-indigo-100 shadow-sm lg:hidden ${
                          isLeft ? 'order-last' : ''
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-inner">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={`${item.school_name} logo`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-white">{initial}</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-indigo-200">
                          <span>{item.school_name}</span>
                          <span className="text-indigo-100/70">{item.duration}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.degree}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-indigo-100/80">{item.description ?? 'Details on standby.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                const cardColumnClass = isLeft
                  ? 'relative order-2 lg:order-1 lg:col-start-1 lg:pr-14 lg:text-right'
                  : 'relative order-2 lg:order-3 lg:col-start-3 lg:pl-14 lg:text-left';

                return (
                  <motion.article
                    key={item.id ?? index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="education-home-item relative grid gap-8 pl-12 sm:pl-16 lg:grid-cols-[minmax(0,1fr)_140px_minmax(0,1fr)] lg:items-center lg:gap-12 lg:pl-0"
                  >
                    <span className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent lg:hidden" />

                    <div className="order-1 hidden lg:flex lg:col-start-2 lg:flex-col lg:items-center lg:justify-center">
                      {!isFirst && (
                        <span className="mb-4 h-14 w-[3px] rounded-full bg-gradient-to-b from-transparent via-indigo-200/45 to-indigo-200/20" />
                      )}
                      <div className="relative z-20 flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-950 bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 text-lg font-semibold text-slate-950 shadow-xl">
                        {index + 1}
                      </div>
                      {!isLast && (
                        <span className="mt-4 h-14 w-[3px] rounded-full bg-gradient-to-b from-indigo-200/20 via-indigo-200/45 to-transparent" />
                      )}
                    </div>

                    <div className={cardColumnClass}>
                      {isLeft ? (
                        <span className="pointer-events-none absolute right-[-68px] top-1/2 hidden h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-400/20 via-indigo-300/70 to-indigo-200/10 lg:block" />
                      ) : (
                        <span className="pointer-events-none absolute left-[-68px] top-1/2 hidden h-[3px] w-16 -translate-y-1/2 rounded-full bg-gradient-to-l from-indigo-400/20 via-indigo-300/70 to-indigo-200/10 lg:block" />
                      )}
                      {card}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          {certifications.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-950/25 backdrop-blur-xl">
              <div className="flex flex-col gap-4 text-left sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Certification dossier</p>
                  <h3 className="flex items-center gap-3 text-lg font-semibold uppercase tracking-[0.25em] text-indigo-100">
                    Certifications
                    <span className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-500/15 px-3 py-1 text-[0.65rem] font-semibold text-indigo-200">
                      {certifications.length} listed
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-indigo-100/70 sm:max-w-xs sm:text-right">
                  Hover a badge to surface the mission focus.
                </p>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {certifications.map((item, index) => {
                  const cardId = item.id ?? `home-cert-${index}`;
                  const logoUrl = getLogoUrl(item as Record<string, unknown>);
                  const initial = getInitial(item.degree);
                  const description = (item.description ?? '').trim();
                  const isActive = activeCertificationId === cardId;

                  return (
                    <motion.div
                      key={cardId}
                      className="group relative overflow-visible rounded-2xl border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-xl transition-transform will-change-transform"
                      data-cursor="text"
                      variants={certificationCardVariants}
                      initial="idle"
                      animate={isActive ? 'active' : 'idle'}
                      whileHover="active"
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.32, ease: [0.19, 1, 0.22, 1] }}
                      onHoverStart={() => setActiveCertificationId(cardId)}
                      onHoverEnd={() =>
                        setActiveCertificationId((current) => (current === cardId ? null : current))
                      }
                      onFocus={() => setActiveCertificationId(cardId)}
                      onBlur={() =>
                        setActiveCertificationId((current) => (current === cardId ? null : current))
                      }
                      tabIndex={0}
                    >
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/18 via-sky-500/12 to-purple-500/18 opacity-0 blur-[26px]"
                        variants={{ idle: { opacity: 0 }, active: { opacity: 1 } }}
                        transition={{ duration: 0.32, ease: [0.19, 1, 0.22, 1] }}
                      />
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/10">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={`${item.school_name} logo`}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-white">{initial}</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">{item.degree}</p>
                          <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">{item.school_name}</p>
                          <p className="text-xs text-indigo-100/70">{item.duration}</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            key="cert-popover"
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-72 -translate-x-1/2 translate-y-6 rounded-2xl border border-indigo-400/40 bg-slate-950/95 p-5 text-left shadow-2xl shadow-indigo-900/50 backdrop-blur-xl md:flex md:flex-col"
                          >
                            <div className="mb-4 flex items-center gap-4">
                              {logoUrl ? (
                                <img
                                  src={logoUrl}
                                  alt={`${item.school_name} emblem`}
                                  loading="lazy"
                                  className="h-16 w-16 flex-shrink-0 rounded-xl object-cover shadow-lg"
                                />
                              ) : (
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-500/20 text-lg font-semibold text-indigo-100">
                                  {initial}
                                </div>
                              )}
                              <div className="space-y-1 text-left">
                                <p className="text-sm font-semibold text-white">{item.degree}</p>
                                <p className="text-xs uppercase tracking-[0.3em] text-indigo-200">{item.school_name}</p>
                                <p className="text-xs text-indigo-100/70">{item.duration}</p>
                              </div>
                            </div>
                            <p className="text-xs leading-relaxed text-indigo-100/85">
                              {description || 'No additional details provided.'}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {description ? (
                        <div className="mt-4 rounded-xl border border-indigo-400/25 bg-slate-950/70 p-4 text-left text-xs text-indigo-100/85 md:hidden">
                          {description}
                        </div>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            </div>
      )}
        </motion.div>
      </section>

      <section id="about" className={sectionShellClass}>
        <motion.div
          ref={aboutSectionRef}
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.35 }}
          style={aboutBackgroundStyle}
          className="reveal-on-scroll relative w-full overflow-hidden space-y-10 rounded-[36px] border border-white/10 bg-white/5 bg-cover bg-center p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl sm:p-10 lg:p-14"
        >
          {aboutBackgroundImage ? (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,90,182,0.18),transparent_65%)]" />
          ) : null}
          <div className="space-y-4 text-left sm:text-center lg:text-left" data-about-animate="heading">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">About</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {profile?.name ?? 'Crewmate'} keeps mission crews aligned even when telemetry spikes.
            </h2>
            <p className="mx-auto max-w-3xl text-sm text-indigo-100/80 sm:text-base lg:mx-0">
              {profile?.bio ?? 'I build interaction systems that keep crews confident while missions push the boundaries.'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,_0.95fr)_minmax(0,_1.05fr)] lg:items-start">
            <div
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-indigo-950/85 via-slate-950/60 to-slate-900/60 p-6 sm:p-8"
              data-about-animate="card"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),transparent_65%)]" />
              <div className="relative flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile?.name ?? 'Portrait'}
                    loading="lazy"
                    className="h-24 w-24 rounded-[28px] border border-white/20 object-cover shadow-xl"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/15 bg-white/10 text-3xl font-semibold text-indigo-100 shadow-inner">
                    {getInitial(profile?.name)}
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white sm:text-3xl">{profile?.name ?? 'Crewmate'}</h3>
                  {profile?.title ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">{profile.title}</p>
                  ) : null}
                  <p className="text-sm leading-relaxed text-indigo-100/85 sm:text-base">
                    {profile?.bio ?? 'I build interaction systems that keep crews confident while missions push the boundaries.'}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200 sm:justify-start">
                  <span
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-indigo-100"
                    data-about-animate="meta"
                  >
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-300" />
                    {profile?.location ?? orbitLocation}
                  </span>
                  {primaryExperience?.company ? (
                    <span
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-indigo-100"
                      data-about-animate="meta"
                    >
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-pink-300" />
                      {primaryExperience.company}
                    </span>
                  ) : null}
                </div>
                {primaryExperience ? (
                  <div
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-indigo-100/85 shadow-inner"
                    data-about-animate="meta"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Current mission</p>
                    <p className="mt-2 text-base font-semibold text-white">{primaryExperience.role}</p>
                    {primaryExperience.duration ? (
                      <p className="mt-1 text-xs uppercase tracking-[0.35em] text-indigo-200">{primaryExperience.duration}</p>
                    ) : null}
                  </div>
                ) : null}
                <motion.button
                  type="button"
                  className="group inline-flex items-center justify-center gap-3 rounded-full border border-indigo-400/40 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100 transition hover:border-white/60 hover:bg-white/20"
                  data-cursor="pointer"
                  data-about-animate="meta"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleScrollToSection('contact')}
                >
                  Initiate Contact
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs text-white transition group-hover:bg-white/25">
                    {'>'}
                  </span>
                </motion.button>
              </div>
            </div>

            <div className="grid gap-6">
              <div
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-7"
                data-about-animate="card"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Mission snapshot</p>
                  <span className="text-xs text-indigo-100/70">Quick view</span>
                </div>
                <ul className="mt-4 grid gap-4">
                  {conciseHighlights.map((item) => (
                    <li
                      key={item.id ?? item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                      data-about-animate="meta"
                    >
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200">{item.label}</p>
                      <p className="mt-1 text-xs text-indigo-100/75">{item.description ?? 'Details on standby.'}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-[28px] border border-white/10 bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-purple-500/10 p-6 backdrop-blur-xl sm:p-7"
                data-about-animate="card"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Signal traits</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {ABOUT_TRAIT_BADGES.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-indigo-100"
                      data-about-animate="meta"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </section>


      <section id="contact" className={`${sectionShellClass} pb-32`}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-sky-500/30 px-8 py-12 text-center backdrop-blur-2xl sm:px-16"
        >
          <div className="absolute -top-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="relative space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Comm link</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Open a secure channel for the next mission
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-indigo-100/80 sm:text-base">
              Bring me into your next mission and we'll plot flight paths, redundancies, and interaction models built for deep space ambitions.
            </p>
            <motion.a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-xl shadow-indigo-900/30 transition hover:-translate-y-1"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              data-cursor="pointer"
            >
              {contactEmail}
              <span>?</span>
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};


