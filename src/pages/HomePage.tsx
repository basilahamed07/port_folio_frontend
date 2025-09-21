import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroOrb } from '../components/animations/HeroOrb';
import { useProfile, useExperiences, useEducation, useProjects } from '../hooks/usePortfolioData';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    label: 'Years crafting immersive products',
    value: '5+',
    description: 'Designing cinematic interactions across web and native.',
  },
  {
    label: 'Across shipped launches',
    value: '28',
    description: 'From SaaS platforms to motion-rich experiential microsites.',
  },
  {
    label: 'Platforms humming at',
    value: '99.9%',
    description: 'Reliability engineered with resilient automation and observability.',
  },
  {
    label: 'Ecosystems explored',
    value: '12',
    description: 'React, Three.js, GSAP, Supabase, Node, Tailwind, Framer Motion.',
  },
];

const featureWords = ['Interactive', 'Motion-first', 'Human', 'Playable'];

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
  const pageRef = useRef<HTMLDivElement>(null);

  const loading = profileLoading || experienceLoading || educationLoading || projectsLoading;

  const techPillars = useMemo(
    () => ['React', 'TypeScript', 'Three.js', 'GSAP', 'Node.js', 'Supabase', 'TailwindCSS', 'Framer Motion'],
    []
  );

  const topExperiences = useMemo(() => experiences.slice(0, 3), [experiences]);
  const formalEducation = useMemo(() => education.filter((item) => item.type === 'education'), [education]);
  const certifications = useMemo(() => education.filter((item) => item.type === 'certification'), [education]);
  const highlightedCertification = useMemo(() => {
    if (certifications.length === 0) return null;

    const descriptor = certifications.find((cert) =>
      `${cert.degree} ${cert.school_name}`.toLowerCase().includes('edciot')
    );

    return descriptor ?? certifications[0];
  }, [certifications]);
  const remainingCertifications = useMemo(() => {
    if (!highlightedCertification) {
      return certifications.slice(0, 4);
    }

    return certifications.filter((cert) => cert.id !== highlightedCertification.id).slice(0, 4);
  }, [certifications, highlightedCertification]);
  const certificationSpotlightLabel = useMemo(() => {
    if (!highlightedCertification) return 'Certification spotlight';

    const label = `${highlightedCertification.degree} ${highlightedCertification.school_name}`.toLowerCase();
    return label.includes('edciot') ? 'EDCiOT certification spotlight' : 'Certification spotlight';
  }, [highlightedCertification]);
  const educationHighlights = useMemo(() => formalEducation.slice(0, 3), [formalEducation]);
  const educationMetrics = useMemo(
    () => [
      {
        label: 'Formal programs',
        value: formalEducation.length ? `${formalEducation.length}` : '0',
        description: 'Deep academic foundations across computer science and UX.',
      },
      {
        label: 'Certifications',
        value: certifications.length ? `${certifications.length}+` : 'In progress',
        description: 'Cloud, architecture, and product specialisations.',
      },
      {
        label: 'Latest credential',
        value: highlightedCertification?.duration ?? 'Ongoing',
        description: highlightedCertification?.school_name ?? 'Constant learner, always upskilling.',
      },
    ],
    [formalEducation, certifications, highlightedCertification]
  );
  const featuredProjects = useMemo(() => {
    const featured = projects.filter((project) => project.featured);
    return (featured.length > 0 ? featured : projects).slice(0, 3);
  }, [projects]);

  const contactEmail = profile?.email ?? 'hello@example.com';

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

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#03021a]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.45)_0%,_rgba(12,10,25,0.12)_45%,_rgba(2,6,23,0.18)_75%,_rgba(2,6,23,0)_100%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(76,5,124,0.28)_0%,_rgba(18,2,40,0.1)_55%,_rgba(2,6,23,0)_100%)] mix-blend-screen opacity-60" />
      </div>

      <section id="hero" className="relative z-10 flex min-h-screen w-full items-center px-4 py-16 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid w-full grid-cols-1 gap-12 sm:gap-16 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_0.95fr)] lg:items-center xl:gap-20 2xl:gap-24">
          <div className="flex flex-col justify-center space-y-9 text-center lg:text-left">
            <span
              className="hero-kicker inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200 shadow-lg shadow-indigo-500/10 lg:self-start"
              data-cursor="text"
            >
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              {profile?.location ?? 'Global'} Based
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
                'I design and ship playful, performant interfaces that feel alive. My work stitches together storytelling, motion, and immersive technology so every interaction feels intentional.'}
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
                Explore Featured Work
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
                Let&apos;s Collaborate
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
                transition={{ duration: 0.8, ease: 'easeOut' }}
                data-cursor="pointer"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Realtime</p>
                <p className="mt-2 text-sm text-indigo-100/90">GSAP-synced motion with tactile hover responses.</p>
              </motion.div>

              <motion.div
                className="absolute -left-6 bottom-6 w-44 rounded-3xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur-xl sm:-left-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                data-cursor="pointer"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">Three.js</p>
                <p className="mt-2 text-sm text-indigo-100/90">Earth, twin satellites, and comet trails in orbit.</p>
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
          className="reveal-on-scroll grid w-full gap-12 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl lg:grid-cols-[minmax(0,_1.2fr)_minmax(0,_0.8fr)] lg:p-10 xl:gap-14"
        >
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200" data-cursor="text">
              About
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl" data-cursor="text">
              Thoughtful interfaces that feel like play, engineered for performance.
            </h2>
            <p className="max-w-2xl text-base text-indigo-100/90 sm:text-lg" data-cursor="text">
              {profile?.bio ??
                'I blend brand, experience, and engineering to craft interactive systems that scale. From motion art direction to full-stack delivery, I focus on bridging imagination with reliable, testable code.'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {techPillars.map((tech) => (
                <motion.div
                  key={tech}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-indigo-100 backdrop-blur-xl"
                  whileHover={{ scale: 1.02 }}
                  data-cursor="pointer"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">
                    {tech[0]}
                  </span>
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-sky-500/25 p-8 text-indigo-50 shadow-2xl shadow-indigo-900/30" data-cursor="text">
            <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-indigo-200">Creative ethos</h3>
            <ul className="space-y-4 text-sm leading-relaxed">
              <li>- Motion is messaging: every transition tells part of the story.</li>
              <li>- Joy and speed coexist. Sub-100ms feedback keeps delight intact.</li>
              <li>- Accessibility and polish walk together-clarity elevates beauty.</li>
              <li>- Collaboration beats silos; I partner across product, design, and engineering.</li>
            </ul>
          </div>
        </motion.div>
      </section>

      <section id="experience" className={sectionShellClass}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll w-full"
        >
          <div className="flex flex-col gap-4 pb-10 text-left lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Experience</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Leading products from prototype to planet-scale</h2>
            </div>
            <p className="max-w-xl text-sm text-indigo-100/80">
              A snapshot of recent roles where I guided teams through invention, iteration, and launch.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8 2xl:gap-10">
            {topExperiences.map((experience) => (
              <motion.article
                key={experience.id}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl"
                whileHover={cardHover.whileHover}
                whileTap={cardHover.whileTap}
                data-cursor="text"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-indigo-200">
                  <span>{experience.company}</span>
                  <span>{experience.duration}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{experience.role}</h3>
                <p className="mt-3 text-sm leading-relaxed text-indigo-100/80 line-clamp-4">
                  {experience.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {experience.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="education" className={sectionShellClass}>
        <motion.div
          variants={sectionVariant}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.4 }}
          className="reveal-on-scroll w-full space-y-8"
        >
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl">
            <div className="pointer-events-none absolute -top-32 left-[10%] h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,_0.9fr)_minmax(0,_1.1fr)]">
              <div className="flex flex-col gap-8">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Education & certifications</p>
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">Learning engineered for momentum</h2>
                  <p className="max-w-xl text-sm text-indigo-100/80">
                    A holistic blend of academic rigor and hands-on credentials that keeps my practice sharp, with annual focus on emerging IoT ecosystems and immersive product systems.
                  </p>
                </div>

                {highlightedCertification && (
                  <div className="relative overflow-hidden rounded-3xl border border-indigo-400/40 bg-gradient-to-br from-indigo-600/30 via-purple-500/20 to-sky-500/20 p-6 shadow-[0_35px_60px_-15px_rgba(37,99,235,0.35)]">
                    <div className="pointer-events-none absolute -right-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative z-10 space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-100">
                        {certificationSpotlightLabel}
                      </p>
                      <h3 className="text-2xl font-semibold text-white">{highlightedCertification.degree}</h3>
                      <p className="text-sm font-semibold text-indigo-100/90">
                        {highlightedCertification.school_name} | {highlightedCertification.duration}
                      </p>
                      {highlightedCertification.description ? (
                        <p className="text-sm text-indigo-100/80">
                          {highlightedCertification.description}
                        </p>
                      ) : (
                        <p className="text-sm text-indigo-100/80">
                          A credential grounded in building resilient, human-first experiences.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  {educationMetrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left"
                    >
                      <p className="text-2xl font-semibold text-white">{metric.value}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-200">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-xs text-indigo-100/80">{metric.description}</p>
                    </div>
                  ))}
                </div>

                <motion.a
                  href="/education"
                  className="inline-flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-indigo-100 transition hover:border-indigo-400 hover:text-white"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  data-cursor="pointer"
                >
                  View full learning path
                  <span className="text-lg">&#8594;</span>
                </motion.a>
              </div>

              <div className="grid gap-6">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200">Formal foundations</p>
                  <div className="mt-5 space-y-5">
                    {educationHighlights.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                          <span>{item.school_name}</span>
                          <span>{item.duration}</span>
                        </div>
                        <h4 className="mt-3 text-base font-semibold text-white">{item.degree}</h4>
                        <p className="mt-2 text-sm text-indigo-100/80 line-clamp-3">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {remainingCertifications.length > 0 && (
                  <div className="rounded-3xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600/10 via-purple-500/10 to-sky-500/10 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200">Certified specialisms</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {remainingCertifications.map((cert) => (
                        <div key={cert.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                          <p className="text-sm font-semibold text-white">{cert.degree}</p>
                          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-indigo-200">{cert.school_name}</p>
                          <p className="mt-2 text-xs text-indigo-100/70">{cert.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Projects</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">A few immersive builds in orbit</h2>
            </div>
            <p className="max-w-xl text-sm text-indigo-100/80">
              Blending generative visuals, data storytelling, and robust engineering into cohesive experiences.
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
                      Live Demo
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
                      GitHub
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">Contact</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Let&apos;s build the next immersive story together
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-indigo-100/80 sm:text-base">
              I love collaborating with teams who care about craft and delight. Tell me about your product, prototype, or idea-you&apos;ll get thoughtful options and practical next steps.
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
