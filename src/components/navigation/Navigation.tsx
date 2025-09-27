import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const SECTION_NAV_ITEMS = [
  { name: 'Home', sectionId: 'hero' },
  { name: 'About', sectionId: 'about' },
  { name: 'Experience', sectionId: 'experience' },
  { name: 'Education', sectionId: 'education' },
  { name: 'Projects', sectionId: 'projects' },
  { name: 'Contact', sectionId: 'contact' },
] as const;

type SectionNavItem = typeof SECTION_NAV_ITEMS[number];
type SectionId = SectionNavItem['sectionId'];

const QUICK_LINKS: SectionNavItem[] = [
  { name: 'Experience', sectionId: 'experience' },
  { name: 'Projects', sectionId: 'projects' },
  { name: 'Contact', sectionId: 'contact' },
];

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const overlayTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const scrollToSection = (sectionId: SectionId) => {
    if (sectionId === 'hero') {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -120, duration: 1, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionClick = (sectionId: SectionId) => {
    setMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }

    scrollToSection(sectionId);
  };

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('hero');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id as SectionId);
        }
      },
      {
        rootMargin: '-45% 0px -35% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    const observed = SECTION_NAV_ITEMS.map((item) => {
      const element = document.getElementById(item.sectionId);
      if (element) observer.observe(element);
      return element;
    });

    return () => {
      observer.disconnect();
      observed.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [location.pathname]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const ctx = gsap.context(() => {
      const panels = overlay.querySelectorAll('[data-overlay-panel]');
      const items = overlay.querySelectorAll('[data-overlay-item]');

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.set(overlay, { autoAlpha: 0 })
        .fromTo(
          overlay,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25 }
        )
        .fromTo(
          panels,
          { yPercent: 105 },
          { yPercent: 0, duration: 0.6, stagger: 0.05 },
          '<'
        )
        .from(
          items,
          { y: 50, opacity: 0, stagger: 0.08, duration: 0.45, ease: 'power3.out' },
          '-=0.25'
        );

      overlayTimelineRef.current = tl;
    }, overlay);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = overlayTimelineRef.current;
    const overlay = overlayRef.current;
    if (!tl || !overlay) return;

    if (menuOpen) {
      overlay.style.pointerEvents = 'auto';
      document.body.style.overflow = 'hidden';
      tl.play();
    } else {
      tl.reverse();
      tl.eventCallback('onReverseComplete', () => {
        overlay.style.pointerEvents = 'none';
        document.body.style.removeProperty('overflow');
        tl.eventCallback('onReverseComplete', null);
      });
    }

    return () => {
      tl.eventCallback('onReverseComplete', null);
      document.body.style.removeProperty('overflow');
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [menuOpen]);

  const desktopQuickLinks = useMemo(
    () =>
      QUICK_LINKS.map((item) => {
        const isActive = location.pathname === '/' && activeSection === item.sectionId;
        return (
          <motion.button
            key={item.sectionId}
            type="button"
            onClick={() => handleSectionClick(item.sectionId)}
            className={`group relative flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] transition-colors ${
              isActive ? 'text-indigo-200 bg-white/10 border-indigo-400/40' : 'text-slate-200 hover:text-white hover:border-indigo-400/60'
            }`}
            data-cursor="pointer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
            {item.name}
          </motion.button>
        );
      }),
    [activeSection, handleSectionClick, location.pathname]
  );

  const overlayNavItems = useMemo(
    () =>
      SECTION_NAV_ITEMS.map((item, index) => (
        <motion.button
          key={item.sectionId}
          type="button"
          data-overlay-item
          onClick={() => handleSectionClick(item.sectionId)}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white/90 tracking-tight"
          whileHover={{ x: 8 }}
        >
          <span className="inline-flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-indigo-300" />
            {item.name}
          </span>
        </motion.button>
      )),
    [handleSectionClick]
  );

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-gradient-to-r from-slate-950/70 via-slate-950/40 to-slate-900/50 backdrop-blur-xl"
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <motion.button
            type="button"
            onClick={() => handleSectionClick('hero')}
            className="text-[0.95rem] font-semibold uppercase tracking-[0.4em] text-indigo-200"
            data-cursor="pointer"
            whileHover={{ letterSpacing: '0.5em' }}
          >
            NOVA
          </motion.button>

          <div className="hidden md:flex items-center gap-3">
            {desktopQuickLinks}
            <motion.button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative inline-flex items-center justify-center rounded-full border border-indigo-400/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100"
              data-cursor="pointer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Menu
            </motion.button>
            <Link
              to="/admin"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100 transition hover:border-indigo-400 hover:text-white"
              data-cursor="pointer"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/admin"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-100"
              data-cursor="pointer"
            >
              Admin
            </Link>
            <motion.button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200"
              data-cursor="pointer"
              whileTap={{ scale: 0.92 }}
              aria-expanded={menuOpen}
              aria-label="Open navigation menu"
            >
              <span className="sr-only">Open menu</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="h-16" />

      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-50"
        aria-hidden={!menuOpen}
      >
        <div className="absolute inset-0 flex">
          <div data-overlay-panel className="flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
          <div data-overlay-panel className="flex-1 bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-950 hidden sm:block" />
          <div data-overlay-panel className="flex-1 bg-gradient-to-br from-sky-800 via-indigo-900 to-slate-950 hidden lg:block" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-12 px-6 text-center">
          <motion.button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute top-10 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-100"
            data-cursor="pointer"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.92 }}
          >
            <span className="sr-only">Close navigation</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </motion.button>

          <div className="flex flex-col items-center gap-8">
            <p className="text-xs font-semibold uppercase tracking-[0.6em] text-indigo-200">Navigation</p>
            <div className="flex flex-col items-center gap-6 text-left">
              {overlayNavItems}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200">
            <p>Connect</p>
            <div className="flex gap-3 text-sm tracking-[0.3em] text-indigo-100/80">
              <a href="mailto:comms@novacarter.io" className="hover:text-white" data-cursor="pointer">
                Email
              </a>
              <span className="opacity-40">/</span>
              <a href="https://github.com/nova" className="hover:text-white" data-cursor="pointer" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span className="opacity-40">/</span>
              <a href="https://www.linkedin.com" className="hover:text-white" data-cursor="pointer" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

