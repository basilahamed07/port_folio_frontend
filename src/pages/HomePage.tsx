import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProfile, useExperiences, useEducation, useProjects, useSkills } from '../hooks/usePortfolioData';
import { HeroOrb } from '../components/animations/HeroOrb';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    label: 'Deep-space missions shipped',
    value: '32',
    description: 'Command modules and immersive ops rooms launched with cinematic UX.',
  },
  {
    label: 'Live telemetry uptime',
    value: '99.99%',
    description: 'Redundant pipelines keep mission dashboards glowing around the clock.',
  },
  {
    label: 'Realtime data streams',
    value: '74',
    description: 'Sensor, satellite, and crew feeds braided into one control surface.',
  },
  {
    label: 'Systems in active rotation',
    value: '12',
    description: 'React, Three.js, GSAP, Supabase, Tailwind, and more interlinked.',
  },
];

const featureWords = ['Interstellar', 'Mission-ready', 'Combat-simulated', 'Adaptive'];

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

export const HomePage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { experiences, loading: experienceLoading } = useExperiences();
  const { education, loading: educationLoading } = useEducation();
  const { projects, loading: projectsLoading } = useProjects();
  const { skillsSection, loading: skillsLoading } = useSkills();
  const pageRef = useRef<HTMLDivElement>(null);

  const loading =
    profileLoading || experienceLoading || educationLoading || projectsLoading || skillsLoading;

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
  const getLogoUrl = (entity: { logo_url?: string | null } | Record<string, unknown>) => {
    const logo = (entity as { logo_url?: string | null }).logo_url;
    if (logo) return logo;
    const image = (entity as { image_url?: string | null }).image_url;
    return image ?? undefined;
  };

  const getInitial = (label?: string | null) => {
    if (!label) return '�';
    const trimmed = label.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : '�';
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
              {stats.map((item) => (
                <motion.div
                  key={item.label}
                  className="reveal-on-scroll group rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/60 hover:bg-indigo-500/10"
                  whileHover={{ scale: 1.03 }}
                  data-cursor="pointer"
                >
                  <p className="text-3xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-indigo-200">{item.label}</p>
                  <p className="mt-2 text-xs text-indigo-100/80">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:pl-6 xl:pl-10 2xl:pl-16">
            <div className="reveal-on-scroll relative flex aspect-square w-full max-w-[460px] items-center justify-center rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-2xl backdrop-saturate-150 sm:max-w-[520px] sm:rounded-[42px] sm:p-8 2xl:max-w-[560px]">
              <div className="absolute inset-10 -z-10 rounded-[52px] bg-gradient-to-tr from-indigo-500/40 via-purple-500/30 to-sky-400/30 blur-3xl sm:inset-12" />
              <HeroOrb className="h-full w-full" />

              <motion.div
                className="absolute -right-6 top-1/3 w-40 rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl sm:-right-10"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                data-cursor="pointer"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Telemetry sync</p>
                <p className="mt-2 text-sm text-indigo-100/90">GSAP-synced thrusters and HUD cues reacting to pointer flight paths.</p>
              </motion.div>

              <motion.div
                className="absolute -left-6 bottom-6 w-44 rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl sm:-left-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                data-cursor="pointer"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Three.js combat sim</p>
                <p className="mt-2 text-sm text-indigo-100/90">Procedural starfighters, nebulae, and plasma trails flying in formation.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className={sectionShellClass}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll grid w-full gap-10 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl lg:grid-cols-[minmax(0,_0.9fr)_minmax(0,_1.1fr)] lg:p-10 xl:gap-16"
        >
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-sky-900/40 shadow-2xl shadow-indigo-950/40">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_65%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(167,139,250,0.35),transparent_70%)]" />
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile?.name ?? 'Portrait'}
                  loading="lazy"
                  className="relative h-full w-full object-cover"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center text-sm font-semibold text-indigo-100/70">
                  Upload your portrait
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">About</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">{profile?.name ?? 'Crewmate'}</h2>
            <p className="text-sm leading-relaxed text-indigo-100/80 sm:text-base">{profile?.bio ?? 'I build interaction systems that keep crews confident while missions push the boundaries.'}</p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
              <span>{profile?.title ?? 'Systems Architect'}</span>
              <span className="text-indigo-100/70">{orbitLocation}</span>
            </div>
          </div>
        </motion.div>
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

          <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,_1fr)_3.5rem_minmax(0,_1fr)] lg:gap-12">
            <span className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-sky-400/70 via-white/10 to-transparent lg:block" />

            {orderedExperiences.map((experience, index) => {
              const alignLeft = index % 2 === 0;
              const logoUrl = getLogoUrl(experience as Record<string, unknown>);
              const initial = getInitial(experience.company ?? experience.role);

              return (
                <motion.article
                  key={experience.id ?? index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.55 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-indigo-950/20 backdrop-blur-xl sm:p-7 ${
                    alignLeft
                      ? 'lg:col-start-1 lg:col-end-2 lg:ml-0 lg:mr-8'
                      : 'lg:col-start-3 lg:col-end-4 lg:mr-0 lg:ml-8'
                  }`}
                  data-cursor="text"
                >
                  <span
                    className={`hidden lg:flex absolute top-8 h-3 w-3 items-center justify-center rounded-full bg-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.7)] ${
                      alignLeft ? 'right-[-1.75rem]' : 'left-[-1.75rem]'
                    }`}
                  />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
                      {logoUrl ? (
                        <img src={logoUrl} alt={`${experience.company} logo`} loading="lazy" className="h-full w-full object-cover" />
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
                        <p className="mt-2 text-sm leading-relaxed text-indigo-100/80">{experience.description}</p>
                      </div>
                      {experience.technologies?.length ? (
                        <div className="flex flex-wrap gap-2">
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
                </motion.article>
              );
            })}
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

          <div className="grid gap-12 lg:grid-cols-[minmax(0,_0.55fr)_minmax(0,_0.45fr)]">
            <div className="relative mt-6 space-y-10 lg:pl-10">
              <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-indigo-400/60 via-white/15 to-transparent lg:block" />
              {formalEducation.map((item, index) => {
                const logoUrl = getLogoUrl(item as Record<string, unknown>);
                const initial = getInitial(item.school_name ?? item.degree);

                return (
                  <motion.article
                    key={item.id ?? index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="relative rounded-3xl border border-white/10 bg-white/5 p-6 pl-12 text-left shadow-xl shadow-indigo-900/25 backdrop-blur-xl sm:p-7"
                    data-cursor="text"
                  >
                    <span className="absolute left-4 top-6 flex h-8 w-8 items-center justify-center">
                      <span className="absolute h-8 w-8 rounded-full border border-indigo-300/40 bg-indigo-500/15 blur-md" />
                      <span className="relative h-3 w-3 rounded-full bg-indigo-300 shadow-[0_0_12px_rgba(165,180,252,0.6)]" />
                    </span>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
                        {logoUrl ? (
                          <img src={logoUrl} alt={`${item.school_name} logo`} loading="lazy" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-white">{initial}</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-indigo-200">
                          <span>Program</span>
                          <span className="text-indigo-100/70">{item.duration}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.degree}</h3>
                          <p className="mt-2 text-sm text-indigo-100/80 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-[0.25em] text-indigo-100">Certifications</h3>
                <p className="mt-2 text-sm text-indigo-100/80">Hover a badge to surface the mission focus.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {certifications.length ? (
                  certifications.map((item, index) => {
                    const logoUrl = getLogoUrl(item as Record<string, unknown>);
                    const initial = getInitial(item.degree);
                    return (
                      <motion.div
                        key={item.id ?? index}
                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-6 backdrop-blur-xl transition-[transform,box-shadow] duration-300 hover:-translate-y-2 hover:shadow-[0_25px_55px_-18px_rgba(129,140,248,0.55)]"
                        data-cursor="text"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="relative z-10 flex items-center gap-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
                            {logoUrl ? (
                              <img src={logoUrl} alt={`${item.school_name} logo`} loading="lazy" className="h-full w-full object-cover" />
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
                        {item.description ? (
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-8 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="px-5 pb-5 pt-6 text-left text-xs text-indigo-100/85">{item.description}</p>
                          </div>
                        ) : null}
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-xs text-indigo-100/60">No certifications logged yet.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      <section id="projects" className={sectionShellClass}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll w-full"
        >
          <div className="flex flex-col gap-4 pb-10 text-left lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Missions</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Highlighted operations across the fleet</h2>
            </div>
            <p className="max-w-xl text-sm text-indigo-100/80">
              From orbital simulators to planetary logistics dashboards, each mission fuses spectacle with reliability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8 2xl:gap-10">
            {featuredProjects.map((project) => (
              <motion.article
                key={project.id}
                className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl"
                whileHover={cardHover.whileHover}
                whileTap={cardHover.whileTap}
                data-cursor="text"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-indigo-200">{project.technologies.slice(0, 3).join(' | ')}</div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 text-sm text-indigo-100/80 line-clamp-4">{project.description}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-indigo-100 transition hover:border-indigo-400 hover:text-white"
                      data-cursor="pointer"
                    >
                      Mission Brief
                      <span>?</span>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-indigo-100 transition hover:border-indigo-400 hover:text-white"
                      data-cursor="pointer"
                    >
                      Source Logs
                      <span>?</span>
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
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




