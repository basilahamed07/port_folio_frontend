import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis, { LenisOptions } from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const defaultOptions: LenisOptions = {
  duration: 1.2,
  lerp: 0.08,
  smoothWheel: true,
  smoothTouch: false,
  touchMultiplier: 1.5,
  wheelMultiplier: 1,
  autoRaf: false,
};

export const useSmoothScroll = (options?: Partial<LenisOptions>) => {
  useEffect(() => {
    if (prefersReducedMotion()) {
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
      return;
    }

    const mergedOptions: LenisOptions = { ...defaultOptions, ...options } as LenisOptions;
    const lenis = new Lenis(mergedOptions);
    window.__lenis = lenis;

    const handleLenisScroll = () => ScrollTrigger.update();
    const handleRefresh = () => lenis.resize();
    lenis.on('scroll', handleLenisScroll);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    const proxyTarget = document.body;

    ScrollTrigger.scrollerProxy(proxyTarget, {
      scrollTop(value) {
        if (typeof value === 'number') {
          lenis.scrollTo(value, { immediate: false });
        }
        return lenis.scroll;
      },
      scrollHeight: () => document.documentElement.scrollHeight,
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      pinType: proxyTarget.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.defaults({ scroller: proxyTarget });
    ScrollTrigger.addEventListener('refresh', handleRefresh);
    ScrollTrigger.refresh();

    document.documentElement.classList.add('lenis-enabled');
    document.body.dataset.smoothScroll = 'enabled';

    return () => {
      document.documentElement.classList.remove('lenis-enabled');
      delete document.body.dataset.smoothScroll;
      lenis.off('scroll', handleLenisScroll);
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
      lenis.destroy();
      gsap.ticker.remove(update);
      ScrollTrigger.removeEventListener('refresh', handleRefresh);
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.scrollerProxy(proxyTarget, {
        scrollTop(value) {
          if (typeof value === 'number') {
            window.scrollTo(0, value);
          }
          return window.scrollY || document.documentElement.scrollTop;
        },
        getBoundingClientRect: () => ({
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      });
      ScrollTrigger.clearScrollMemory();
      ScrollTrigger.refresh();
    };
  }, [options]);
};
