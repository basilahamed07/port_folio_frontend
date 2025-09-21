import { useEffect, useRef } from 'react';

interface SpaceBackdropProps {
  className?: string;
  starDensity?: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  speed: number;
  twinkleOffset: number;
}

interface Comet {
  angle: number;
  radius: number;
  speed: number;
  tailLength: number;
  thickness: number;
  hue: number;
}

export const SpaceBackdrop: React.FC<SpaceBackdropProps> = ({ className = '', starDensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const parallaxAnimationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const parallaxRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const nebulaRefs = useRef<HTMLDivElement[]>([]);
  const swirlRef = useRef<HTMLDivElement | null>(null);
  const cometRef = useRef<Comet[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    const createStars = () => {
      const areaFactor = (width * height) / 5200;
      const targetCount = Math.max(180, Math.min(520, Math.round(areaFactor * starDensity)));
      const stars: Star[] = [];

      for (let i = 0; i < targetCount; i += 1) {
        const depth = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: depth,
          radius: 0.8 + depth * 1.8,
          speed: 0.18 + depth * 0.55,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      starsRef.current = stars;
    };

    const createComets = () => {
      const count = Math.max(2, Math.round((width + height) / 900));
      cometRef.current = Array.from({ length: count }).map((_, index) => ({
        angle: Math.random() * Math.PI * 2,
        radius: Math.max(width, height) * (0.4 + Math.random() * 0.4),
        speed: 0.0006 + Math.random() * 0.0009,
        tailLength: 90 + Math.random() * 140,
        thickness: 0.6 + Math.random() * 0.9,
        hue: 200 + index * 18 + Math.random() * 20,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createStars();
      createComets();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 2;
      const y = (event.clientY / innerHeight - 0.5) * 2;
      pointerRef.current.x = x;
      pointerRef.current.y = y;
    };

    const handleScroll = () => {
      const progress = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollRef.current = progress;
    };

    const animate = (time: number) => {
      parallaxRef.current.x += (pointerRef.current.x - parallaxRef.current.x) * 0.045;
      parallaxRef.current.y += (pointerRef.current.y - parallaxRef.current.y) * 0.045;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#020210';
      ctx.fillRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(width * 0.42, height * 0.35, width * 0.06, width * 0.55, height * 0.7, width * 0.95);
      gradient.addColorStop(0, 'rgba(120, 70, 255, 0.32)');
      gradient.addColorStop(0.35, 'rgba(29, 78, 216, 0.28)');
      gradient.addColorStop(0.68, 'rgba(12, 74, 110, 0.2)');
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.12)');
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const comets = cometRef.current;
      for (let i = 0; i < comets.length; i += 1) {
        const comet = comets[i];
        comet.angle += comet.speed * (i % 2 === 0 ? 1 : -1);
        const orbitX = width * 0.5 + Math.cos(comet.angle) * comet.radius;
        const orbitY = height * 0.5 + Math.sin(comet.angle) * comet.radius * 0.6;

        const parallaxX = parallaxRef.current.x * 85;
        const parallaxY = parallaxRef.current.y * 65;

        const trailX = orbitX + parallaxX;
        const trailY = orbitY + parallaxY + scrollRef.current * (120 + i * 45);

        const tailVectorX = Math.cos(comet.angle + Math.PI) * comet.tailLength;
        const tailVectorY = Math.sin(comet.angle + Math.PI) * comet.tailLength * 0.6;

        const gradientTail = ctx.createLinearGradient(trailX, trailY, trailX + tailVectorX, trailY + tailVectorY);
        gradientTail.addColorStop(0, `hsla(${comet.hue}, 95%, 78%, 0.9)`);
        gradientTail.addColorStop(0.65, `hsla(${comet.hue + 24}, 90%, 70%, 0.35)`);
        gradientTail.addColorStop(1, 'hsla(210, 95%, 80%, 0)');

        ctx.strokeStyle = gradientTail;
        ctx.lineWidth = comet.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(trailX + tailVectorX, trailY + tailVectorY);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `hsla(${comet.hue}, 100%, 88%, 0.95)`;
        ctx.shadowBlur = 16;
        ctx.shadowColor = `hsla(${comet.hue}, 100%, 75%, 0.8)`;
        ctx.arc(trailX, trailY, comet.thickness * 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i += 1) {
        const star = stars[i];
        const offsetX = parallaxRef.current.x * star.z * 26;
        const offsetY = parallaxRef.current.y * star.z * 18 + scrollRef.current * star.z * 160;

        star.y += star.speed;
        if (star.y - star.radius > height) {
          star.y = -star.radius;
          star.x = Math.random() * width;
        }

        const twinkle = 0.6 + Math.sin(time * 0.0018 + star.twinkleOffset) * 0.5;
        const alpha = 0.35 + twinkle * 0.55;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${190 + Math.floor(star.z * 65)}, ${170 + Math.floor(star.z * 80)}, 255, ${alpha})`;
        ctx.shadowBlur = 6 + star.z * 12;
        ctx.shadowColor = `rgba(147, 197, 253, ${alpha})`;
        ctx.arc(star.x + offsetX, star.y + offsetY, star.radius * (1.1 + star.z * 0.6), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalCompositeOperation = 'source-over';
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleParallax = () => {
      const scroll = scrollRef.current;
      nebulaRefs.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = 18 + index * 12;
        const translateY = -scroll * depth;
        const translateX = parallaxRef.current.x * (10 + index * 8);
        layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });

      if (swirlRef.current) {
        const rotation = scroll * 520 + parallaxRef.current.x * 40;
        swirlRef.current.style.transform = `translate3d(-50%, -50%, 0) rotate(${rotation}deg)`;
      }
    };

    const frameParallax = () => {
      handleParallax();
      parallaxAnimationRef.current = requestAnimationFrame(frameParallax);
    };

    resize();
    handleScroll();
    animationRef.current = requestAnimationFrame(animate);
    frameParallax();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (parallaxAnimationRef.current) cancelAnimationFrame(parallaxAnimationRef.current);
    };
  }, [starDensity]);

  const setNebulaRef = (index: number) => (element: HTMLDivElement | null) => {
    if (!element) return;
    nebulaRefs.current[index] = element;
  };

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 opacity-75" />
      <div ref={setNebulaRef(0)} className="absolute -top-[30vh] left-[-10vw] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.32)_0%,rgba(30,64,175,0.08)_45%,rgba(2,6,23,0)_70%)] blur-3xl mix-blend-screen" />
      <div ref={setNebulaRef(1)} className="absolute top-[20vh] right-[-15vw] h-[80vh] w-[65vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.32)_0%,rgba(124,58,237,0.1)_40%,rgba(2,6,23,0)_70%)] blur-3xl mix-blend-screen" />
      <div ref={setNebulaRef(2)} className="absolute bottom-[-25vh] left-[15vw] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.28)_0%,rgba(6,182,212,0.08)_45%,rgba(2,6,23,0)_70%)] blur-[160px] mix-blend-screen" />
      <div ref={setNebulaRef(3)} className="absolute top-1/2 left-1/2 h-[30vh] w-[30vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(148,163,255,0.25)_0%,rgba(2,6,23,0.2)_60%,rgba(2,6,23,0.95)_100%)] blur-lg opacity-80 mix-blend-screen" />
      <div ref={setNebulaRef(4)} className="absolute top-[5vh] left-[55vw] h-[22vh] w-[22vh] -translate-x-1/2 rounded-full bg-[conic-gradient(from_90deg_at_center,rgba(14,165,233,0.5),rgba(147,51,234,0.15),rgba(14,116,144,0.5))] blur-2xl opacity-60 mix-blend-screen" />
      <div
        ref={swirlRef}
        className="absolute top-1/2 left-1/2 h-[40vh] w-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,rgba(59,130,246,0.05)_60%,rgba(15,23,42,0.6)_100%)] blur-xl opacity-70 mix-blend-screen"
      />
    </div>
  );
};
