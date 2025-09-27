import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';
import { CustomCursor } from './components/ui/CustomCursor';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { EducationPage } from './pages/EducationPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { SpaceBackdrop } from './components/visuals/SpaceBackdrop';
import { usePerformanceMode } from './hooks/usePerformanceMode';

const scrollToId = (sectionId?: string | null) => {
  if (!sectionId) return;

  if (sectionId === 'hero') {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.05 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -120, duration: 1.05 });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const ScrollManager = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const sectionId = state.scrollTo;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToId(sectionId));
      });

      navigate(location.pathname, { replace: true, state: { ...state, scrollTo: undefined } });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const sectionFromHash = location.hash.replace('#', '');
      if (sectionFromHash) {
        requestAnimationFrame(() => scrollToId(sectionFromHash));
      }
    }
  }, [location.hash, location.pathname]);

  return null;
};

export default function App() {
  const { isLowPower, shouldReduceMotion } = usePerformanceMode();
  const smoothScrollEnabled = !isLowPower && !shouldReduceMotion;
  const cursorEnabled = !isLowPower && !shouldReduceMotion;

  useSmoothScroll(undefined, smoothScrollEnabled);

  return (
    <Router>
      <ScrollManager />
      <div className="relative min-h-screen overflow-hidden text-white">
        <SpaceBackdrop className="opacity-90" lowPower={isLowPower} />
        <CustomCursor enabled={cursorEnabled} />
        <Navigation />
        <main className="page-transition">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
