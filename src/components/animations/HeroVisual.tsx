import { lazy, Suspense } from 'react';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

const HeroOrbLazy = lazy(() => import('./HeroOrb').then((module) => ({ default: module.HeroOrb })));

interface HeroVisualProps {
  className?: string;
}

const FallbackHero = ({ className }: { className?: string }) => (
  <div className={`relative ${className ?? ''}`} aria-hidden="true">
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
    <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/30 blur-[120px]" />
    <div className="absolute left-[20%] top-[25%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/40 blur-3xl" />
    <div className="absolute right-[18%] bottom-[22%] h-40 w-40 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-500/35 blur-3xl" />
    <div className="absolute inset-6 rounded-3xl border border-white/10" />
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/5 shadow-inner shadow-sky-500/20">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-sky-400/50 via-cyan-300/40 to-indigo-400/30 blur-sm" />
      </div>
    </div>
  </div>
);

export const HeroVisual = ({ className }: HeroVisualProps) => {
  const { isLowPower, shouldReduceMotion } = usePerformanceMode();
  const preferFallback = isLowPower || shouldReduceMotion;

  if (preferFallback) {
    return <FallbackHero className={className} />;
  }

  return (
    <Suspense fallback={<FallbackHero className={className} />}>
      <HeroOrbLazy className={className} />
    </Suspense>
  );
};
