import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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

const NAV_ITEM_CLASSES =
  'px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = useCallback(
    (sectionId: SectionId) => {
      if (sectionId === 'hero') {
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { duration: 1.1 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const target = document.getElementById(sectionId);
      if (!target) return;

      if (window.__lenis) {
        window.__lenis.scrollTo(target, {
          offset: -120,
          duration: 1.1,
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  const handleSectionClick = useCallback(
    (sectionId: SectionId) => {
      setIsOpen(false);

      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: sectionId } });
        return;
      }

      scrollToSection(sectionId);
    },
    [location.pathname, navigate, scrollToSection]
  );

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
        root: null,
        rootMargin: '-45% 0px -35% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    const observedElements = SECTION_NAV_ITEMS.map((item) => {
      const element = document.getElementById(item.sectionId);
      if (element) observer.observe(element);
      return element;
    });

    return () => {
      observer.disconnect();
      observedElements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const desktopItems = useMemo(
    () =>
      SECTION_NAV_ITEMS.map((item) => {
        const isActive = location.pathname === '/' && activeSection === item.sectionId;

        return (
          <motion.button
            key={item.sectionId}
            type="button"
            onClick={() => handleSectionClick(item.sectionId)}
            className={`${NAV_ITEM_CLASSES} ${
              isActive ? 'text-indigo-400 bg-indigo-400/10' : 'text-gray-300 hover:text-indigo-400 hover:bg-white/5'
            }`}
            data-cursor="pointer"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            {item.name}
          </motion.button>
        );
      }),
    [activeSection, handleSectionClick, location.pathname]
  );

  const mobileItems = useMemo(
    () =>
      SECTION_NAV_ITEMS.map((item) => (
        <button
          key={item.sectionId}
          type="button"
          onClick={() => handleSectionClick(item.sectionId)}
          className={`${NAV_ITEM_CLASSES} block w-full text-left ${
            location.pathname === '/' && activeSection === item.sectionId
              ? 'text-indigo-400 bg-indigo-400/10'
              : 'text-gray-300 hover:text-indigo-400 hover:bg-white/5'
          }`}
          data-cursor="pointer"
        >
          {item.name}
        </button>
      )),
    [activeSection, handleSectionClick, location.pathname]
  );

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-md border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              type="button"
              className="flex-shrink-0 z-50 text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSectionClick('hero')}
              data-cursor="pointer"
            >
              Portfolio
            </motion.button>

            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {desktopItems}
              <Link
                to="/admin"
                className="hidden lg:inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition hover:border-indigo-400 hover:text-white"
                data-cursor="pointer"
              >
                Admin
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <Link
                to="/admin"
                className="mr-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-100"
                data-cursor="pointer"
              >
                Admin
              </Link>

              <motion.button
                onClick={() => setIsOpen((prev) => !prev)}
                className="text-gray-400 hover:text-white p-2 z-50 relative"
                data-cursor="pointer"
                whileTap={{ scale: 0.95 }}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div
          className={`md:hidden ${isOpen ? 'block' : 'hidden'} relative z-40`}
          initial={false}
          animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/20 backdrop-blur-md">
            {mobileItems}
          </div>
        </motion.div>
      </motion.nav>

      <div className="h-16" />
    </>
  );
};
