import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  twinkleSpeed: number;
  baseOpacity: number;
}

export const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const targetStarCount = Math.floor((canvas.width * canvas.height) / 8000);
      starsRef.current = Array.from({ length: targetStarCount }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.6 + 0.4,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        baseOpacity: Math.random() * 0.35 + 0.35,
      }));
    };

    const render = (time: number) => {
      const stars = starsRef.current;
      const width = canvas.width;
      const shift = (time * 22) % width;
      ctx.clearRect(0, 0, width, canvas.height);

      ctx.globalCompositeOperation = 'lighter';
      stars.forEach((star, index) => {
        const pulse = Math.sin(time * star.twinkleSpeed + index) * 0.35 + 0.65;
        let x = star.x - shift;
        if (x < 0) x += width;
        ctx.fillStyle = `rgba(205, 225, 255, ${(star.baseOpacity * pulse).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
    };

    const loop = (time: number) => {
      render(time / 1000);
      animationRef.current = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-transparent">
      <div className="absolute inset-0 opacity-28 galaxy-flow" style={{ backgroundImage: 'linear-gradient(90deg, rgba(227, 242, 255, 0.45) 0%, rgba(125, 196, 255, 0.2) 40%, rgba(10, 36, 70, 0) 70%)', backgroundSize: '200% 100%' }} />
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />
      <div className="absolute -top-[20%] left-[5%] h-[55vw] w-[55vw] min-h-[480px] min-w-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(125,196,255,0.4),rgba(18,24,87,0.08),rgba(5,10,32,0))] blur-3xl opacity-70 animate-[galaxy-drift_26s_ease-in-out_infinite]" />
      <div className="absolute top-[10%] right-[-15%] h-[50vw] w-[50vw] min-h-[420px] min-w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,177,255,0.32),rgba(47,83,201,0.12),rgba(6,12,38,0))] blur-[140px] opacity-60 animate-[galaxy-drift_34s_linear_infinite_reverse]" />
      <div className="absolute bottom-[-25%] left-[30%] h-[48vw] w-[48vw] min-h-[360px] min-w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(96,165,255,0.38),rgba(24,71,145,0.12),rgba(4,10,30,0))] blur-[120px] opacity-55 animate-[galaxy-drift_42s_ease-in-out_infinite]" />

      <div className="absolute top-[18%] left-[35%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(135,206,250,0.5),rgba(12,105,170,0.05))] opacity-80 animate-[galaxy-pulse_18s_ease-in-out_infinite]" />
      <div className="absolute bottom-[18%] right-[28%] h-[160px] w-[160px] translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(252,255,199,0.4),rgba(10,36,52,0))] opacity-70 animate-[galaxy-pulse_22s_ease-in-out_infinite_reverse]" />

      <div className="absolute top-1/4 -left-[12%] h-[2px] w-[480px] rounded-full bg-gradient-to-r from-transparent via-sky-200/70 to-transparent opacity-80 animate-[galaxy-comet_9s_linear_infinite]" />
      <div className="absolute bottom-[26%] right-[-18%] h-[2px] w-[520px] rounded-full bg-gradient-to-r from-transparent via-fuchsia-200/55 to-transparent opacity-70 animate-[galaxy-comet_12s_linear_infinite_reverse]" />
    </div>
  );
};
