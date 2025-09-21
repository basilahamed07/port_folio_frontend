import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"]';
const TEXT_SELECTOR = '[data-cursor="text"], p, h1, h2, h3, h4, h5, h6, .cursor-text';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'text' | 'press'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const rafRef = useRef<number | null>(null);
  const pendingPointer = useRef<PointerEvent | null>(null);

  const resolveVariant = useCallback((target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return 'default';
    if (target.dataset.cursor === 'text' || target.closest(TEXT_SELECTOR)) {
      return 'text';
    }
    if (target.dataset.cursor === 'pointer' || target.closest(INTERACTIVE_SELECTOR)) {
      return 'hover';
    }
    return 'default';
  }, []);

  const processPointerMove = useCallback(() => {
    const event = pendingPointer.current;
    if (!event) {
      rafRef.current = null;
      return;
    }

    pendingPointer.current = null;
    rafRef.current = null;

    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
    setIsVisible(true);
    const variant = resolveVariant(event.target);
    setCursorVariant(variant);

    window.dispatchEvent(
      new CustomEvent('cursorMove', {
        detail: { x: clientX, y: clientY },
      })
    );
  }, [resolveVariant]);

  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(hasTouch || window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      document.body.classList.remove('custom-cursor-enabled');
      return;
    }

    document.body.classList.add('custom-cursor-enabled');

    const handlePointerMove = (event: PointerEvent) => {
      pendingPointer.current = event;
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        processPointerMove();
      });
    };

    const handlePointerLeave = () => {
      pendingPointer.current = null;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsVisible(false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      setCursorVariant(event.button === 0 ? 'press' : resolveVariant(event.target));
      setMousePosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
    };

    const handlePointerUp = (event: PointerEvent) => {
      setCursorVariant(resolveVariant(event.target));
      pendingPointer.current = event;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          processPointerMove();
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        pendingPointer.current = null;
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        setIsVisible(false);
      }
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pendingPointer.current = null;
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, [isMobile, processPointerMove, resolveVariant]);




  const variants = useMemo(() => ({

    default: {

      width: 32,

      height: 32,

      borderRadius: '9999px',

      background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.35) 0%, rgba(15, 23, 42, 0.05) 65%)',

      border: '1px solid rgba(148, 163, 184, 0.4)',

      boxShadow: '0 0 24px rgba(56, 189, 248, 0.35)',

      mixBlendMode: 'difference' as const,

      scale: 1,

    },

    hover: {

      width: 60,

      height: 60,

      borderRadius: '9999px',

      background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.45) 0%, rgba(14, 116, 144, 0.15) 60%)',

      border: '1.8px solid rgba(165, 243, 252, 0.7)',

      boxShadow: '0 0 32px rgba(34, 211, 238, 0.45)',

      mixBlendMode: 'screen' as const,

      scale: 1.08,

    },

    text: {

      width: 10,

      height: 40,

      borderRadius: '9999px',

      background: 'linear-gradient(180deg, rgba(244, 114, 182, 0.85) 0%, rgba(96, 165, 250, 0.85) 100%)',

      border: '1px solid rgba(248, 250, 252, 0.7)',

      mixBlendMode: 'normal' as const,

      scale: 1,

    },

    press: {

      width: 48,

      height: 48,

      borderRadius: '9999px',

      background: 'radial-gradient(circle at center, rgba(96, 165, 250, 0.5) 0%, rgba(30, 64, 175, 0.4) 70%)',

      border: '2px solid rgba(226, 232, 240, 0.8)',

      boxShadow: '0 0 28px rgba(59, 130, 246, 0.45)',

      mixBlendMode: 'screen' as const,

      scale: 0.92,

    },

  }), []);



  const offsetMap = {
    default: { x: 18, y: 18 },
    hover: { x: 30, y: 30 },
    text: { x: 6, y: 20 },
    press: { x: 22, y: 22 },
  } as const;

  if (isMobile || !isVisible) return null;

  const activeOffset = offsetMap[cursorVariant] ?? offsetMap.default;
  const offsetX = activeOffset.x;
  const offsetY = activeOffset.y;

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[9999] drop-shadow-2xl"
        style={{
          left: mousePosition.x - offsetX,
          top: mousePosition.y - offsetY,
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          stiffness: 520,
          damping: 35,
          mass: 0.6,
        }}
      />

      <motion.div
        className="fixed pointer-events-none z-[9998] w-2.5 h-2.5 rounded-full bg-cyan-100/90 shadow-[0_0_20px_rgba(165,243,252,0.65)]"
        style={{
          left: mousePosition.x - 5,
          top: mousePosition.y - 5,
        }}
        animate={{
          scale: cursorVariant === 'press' ? 0.45 : cursorVariant === 'hover' ? 0.75 : 1,
          opacity: cursorVariant === 'text' ? 0.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 640,
          damping: 38,
        }}
      />

      <motion.div
        className="fixed pointer-events-none z-[9997] rounded-full border border-cyan-300/45"
        style={{
          width: 36,
          height: 36,
          left: mousePosition.x - 18,
          top: mousePosition.y - 18,
        }}
        animate={{
          scale: cursorVariant === 'hover' ? 1.9 : cursorVariant === 'press' ? 1.1 : 1.4,
          opacity: cursorVariant === 'text' ? 0.15 : 0.4,
        }}
        transition={{
          type: 'tween',
          ease: 'easeOut',
          duration: 0.35,
        }}
      />
    </>
  );
};


