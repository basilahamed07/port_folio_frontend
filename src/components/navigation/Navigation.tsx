import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useProfile } from '../../hooks/usePortfolioData';

const SECTION_NAV_ITEMS = [
  { name: 'Home', sectionId: 'hero' },
  { name: 'About', sectionId: 'about' },
  { name: 'Experience', sectionId: 'experience' },
  { name: 'Education', sectionId: 'education' },
  { name: 'Contact', sectionId: 'contact' },
] as const;

type SectionNavItem = typeof SECTION_NAV_ITEMS[number];
type SectionId = SectionNavItem['sectionId'];

const QUICK_LINKS: SectionNavItem[] = [];

const OVERLAY_PANEL_CLASSES = [
  'flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-90',
  'hidden flex-1 bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-950 opacity-90 sm:block',
  'hidden flex-1 bg-gradient-to-br from-sky-900 via-indigo-950 to-slate-950 opacity-90 lg:block',
] as const;

export const Navigation = () => {
  const { profile } = useProfile();
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const overlayContentRef = useRef<HTMLDivElement | null>(null);
  const navLabel = (profile?.nav_label ?? profile?.name ?? 'NOVA').toUpperCase();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const handleBackdropInteraction = useCallback(
    (target: EventTarget | null) => {
      if (!menuOpen) return;
      const content = overlayContentRef.current;
      if (content && target instanceof Node && content.contains(target)) {
        return;
      }

      closeMenu();
    },
    [closeMenu, menuOpen]
  );

  const handleOverlayMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      handleBackdropInteraction(event.target);
    },
    [handleBackdropInteraction]
  );

  const handleOverlayTouchStart = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      handleBackdropInteraction(event.target);
    },
    [handleBackdropInteraction]
  );

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
    closeMenu();

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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }

    return () => {
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
          onClick={() => handleSectionClick(item.sectionId)}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white/90 tracking-tight"
          role="menuitem"
          whileHover={{ x: 8 }}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.45, delay: 0.45 + index * 0.08, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ y: 16, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
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
            {navLabel}
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="navigation-overlay"
            className="fixed inset-0 z-50"
            onMouseDown={handleOverlayMouseDown}
            onTouchStart={handleOverlayTouchStart}
            aria-hidden={!menuOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-slate-950/88 backdrop-blur-[140px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.35 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              />
              <div className="absolute inset-0 flex">
                {OVERLAY_PANEL_CLASSES.map((panelClass, index) => (
                  <motion.div
                    key={panelClass}
                    className={panelClass}
                    initial={{ y: '105%' }}
                    animate={{ y: 0, transition: { duration: 0.8, delay: 0.1 + index * 0.08, ease: [0.19, 1, 0.22, 1] } }}
                    exit={{ y: '105%', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                  />
                ))}
              </div>
              <motion.div
                className="pointer-events-none absolute -left-24 top-6 h-[46vh] w-[46vh] rounded-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.45),rgba(15,23,42,0))] blur-3xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.65, delay: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
              />
              <motion.div
                className="pointer-events-none absolute right-[-18%] bottom-[-10%] h-[58vh] w-[58vh] rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.4),rgba(15,23,42,0))] blur-[140px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
              />
              <motion.div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[44vh] w-[44vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.28),rgba(15,23,42,0))] blur-[160px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
              />
            </div>

            <motion.div
              ref={overlayContentRef}
              className="relative z-10 flex h-full flex-col items-center justify-center gap-14 px-6 text-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
            >
              <motion.button
                type="button"
                onClick={closeMenu}
                className="absolute top-10 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-100"
                data-cursor="pointer"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, rotate: -35 }}
                animate={{ opacity: 1, rotate: 0, transition: { duration: 0.4, delay: 0.35 } }}
                exit={{ opacity: 0, rotate: -20, transition: { duration: 0.2 } }}
              >
                <span className="sr-only">Close navigation</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                </svg>
              </motion.button>

              <motion.div
                className="flex flex-col items-center gap-8"
                role="menu"
                aria-label="Primary"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.3 } }}
                exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
              >
                <motion.p
                  className="text-xs font-semibold uppercase tracking-[0.6em] text-indigo-200"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.32 } }}
                  exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
                >
                  Navigation
                </motion.p>
                <div className="flex flex-col items-center gap-6 text-left">
                  {overlayNavItems}
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-indigo-200"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.38 } }}
                exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
              >
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
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
