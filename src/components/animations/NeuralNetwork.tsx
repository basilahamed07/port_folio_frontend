import { useEffect, useRef } from 'react';

interface NeuralNetworkProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  size: number;
  pulse: number;
  energy: number;
  connections: number[];
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
  baseOpacity: number;
  strength: number;
  pulseOffset: number;
  dataFlow: number;
}

export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const timeRef = useRef(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent multiple initializations
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Initialize nodes with better distribution
    const initializeNodes = () => {
      const nodeCount = window.innerWidth < 768 ? 25 : window.innerWidth < 1200 ? 40 : 55;
      nodesRef.current = [];

      // Create grid-based distribution with some randomness
      const cols = Math.ceil(Math.sqrt(nodeCount * (window.innerWidth / window.innerHeight)));
      const rows = Math.ceil(nodeCount / cols);
      const cellWidth = window.innerWidth / cols;
      const cellHeight = window.innerHeight / rows;

      for (let i = 0; i < nodeCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        // Base position with grid alignment
        const baseX = (col + 0.5) * cellWidth;
        const baseY = (row + 0.5) * cellHeight;
        
        // Add controlled randomness
        const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.6;
        const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.6;
        
        const x = Math.max(50, Math.min(window.innerWidth - 50, baseX + randomOffsetX));
        const y = Math.max(50, Math.min(window.innerHeight - 50, baseY + randomOffsetY));

        nodesRef.current.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 2,
          pulse: Math.random() * Math.PI * 2,
          energy: Math.random() * 0.5 + 0.5,
          connections: []
        });
      }
    };

    // Initialize connections with better logic
    const initializeConnections = () => {
      connectionsRef.current = [];
      const maxDistance = window.innerWidth < 768 ? 180 : 220;
      
      for (let i = 0; i < nodesRef.current.length; i++) {
        const nodeA = nodesRef.current[i];
        nodeA.connections = [];
        
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeB = nodesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2)
          );
          
          if (distance < maxDistance) {
            const connectionProbability = 1 - (distance / maxDistance);
            
            if (Math.random() < connectionProbability * 0.5) {
              const baseOpacity = Math.random() * 0.3 + 0.2;
              const connection: Connection = {
                from: i,
                to: j,
                opacity: baseOpacity,
                baseOpacity,
                strength: Math.random() * 0.5 + 0.5,
                pulseOffset: Math.random() * Math.PI * 2,
                dataFlow: Math.random()
              };
              
              connectionsRef.current.push(connection);
              nodeA.connections.push(j);
              nodesRef.current[j].connections.push(i);
            }
          }
        }
      }
    };

    initializeNodes();
    initializeConnections();

    // Listen for cursor movement
    const handleCursorMove = (e: CustomEvent) => {
      mouseRef.current = { x: e.detail.x, y: e.detail.y, isActive: true };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isActive: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener('cursorMove', handleCursorMove as EventListener);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      timeRef.current += deltaTime * 0.001;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Create subtle background gradient
      const bgGradient = ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        window.innerWidth / 2, window.innerHeight / 2, Math.max(window.innerWidth, window.innerHeight)
      );
      bgGradient.addColorStop(0, 'rgba(99, 102, 241, 0.02)');
      bgGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.01)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw connections
      connectionsRef.current.forEach((connection, index) => {
        const fromNode = nodesRef.current[connection.from];
        const toNode = nodesRef.current[connection.to];
        
        const distance = Math.sqrt(
          Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)
        );

        if (distance < 350) {
          // Calculate mouse proximity influence
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          let proximityBoost = 0;
          
          if (mouseRef.current.isActive) {
            const mouseDistance = Math.sqrt(
              Math.pow(mouseRef.current.x - midX, 2) + 
              Math.pow(mouseRef.current.y - midY, 2)
            );
            proximityBoost = Math.max(0, 1 - mouseDistance / 180);
          }

          // Dynamic opacity with pulse effect
          const pulseEffect = Math.sin(timeRef.current * 2 + connection.pulseOffset) * 0.1 + 0.9;
          connection.opacity = (connection.baseOpacity + proximityBoost * 0.4) * pulseEffect;

          // Enhanced gradient for connections
          const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
          const alpha = Math.min(connection.opacity, 0.8);
          gradient.addColorStop(0, `rgba(99, 102, 241, ${alpha * 0.8})`);
          gradient.addColorStop(0.3, `rgba(139, 92, 246, ${alpha})`);
          gradient.addColorStop(0.7, `rgba(168, 85, 247, ${alpha})`);
          gradient.addColorStop(1, `rgba(236, 72, 153, ${alpha * 0.8})`);

          // Draw connection with glow effect
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.8 + proximityBoost * 1.5;
          ctx.shadowColor = `rgba(139, 92, 246, ${alpha * 0.6})`;
          ctx.shadowBlur = 3 + proximityBoost * 8;
          
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          
          // Add slight curve to connections for more organic feel
          const controlX = midX + Math.sin(timeRef.current * 0.5 + index) * 10;
          const controlY = midY + Math.cos(timeRef.current * 0.5 + index) * 10;
          ctx.quadraticCurveTo(controlX, controlY, toNode.x, toNode.y);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Animated data flow particles
          if (connection.opacity > 0.3) {
            const flowSpeed = 1.2 + connection.strength * 0.6;
            connection.dataFlow += flowSpeed * deltaTime * 0.001;
            if (connection.dataFlow > 1) connection.dataFlow = 0;

            const t = connection.dataFlow;
            const flowX = fromNode.x + (toNode.x - fromNode.x) * t;
            const flowY = fromNode.y + (toNode.y - fromNode.y) * t;
            
            // Multiple particles per connection
            for (let p = 0; p < 3; p++) {
              const particleT = (t + p * 0.33) % 1;
              const pX = fromNode.x + (toNode.x - fromNode.x) * particleT;
              const pY = fromNode.y + (toNode.y - fromNode.y) * particleT;
              
              const particleSize = 1.5 + proximityBoost * 2;
              const particleAlpha = connection.opacity * (1 - Math.abs(particleT - 0.5) * 2) * 0.8;
              
              ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha})`;
              ctx.shadowColor = `rgba(255, 255, 255, ${particleAlpha * 0.8})`;
              ctx.shadowBlur = 4 + proximityBoost * 6;
              ctx.beginPath();
              ctx.arc(pX, pY, particleSize, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      });

      // Update and draw nodes
      nodesRef.current.forEach((node, index) => {
        // Calculate mouse influence
        let proximityBoost = 0;
        if (mouseRef.current.isActive) {
          const mouseDistance = Math.sqrt(
            Math.pow(mouseRef.current.x - node.x, 2) + Math.pow(mouseRef.current.y - node.y, 2)
          );
          proximityBoost = Math.max(0, 1 - mouseDistance / 140);
        }

        // Smooth attraction/repulsion to mouse
        if (proximityBoost > 0.1) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const force = proximityBoost * 0.02;
          node.vx += dx * force * 0.01;
          node.vy += dy * force * 0.01;
        } else {
          // Gentle return to original position
          const returnForce = 0.005;
          node.vx += (node.originalX - node.x) * returnForce;
          node.vy += (node.originalY - node.y) * returnForce;
        }

        // Add subtle floating motion
        const floatX = Math.sin(timeRef.current * 0.8 + index * 0.1) * 0.8;
        const floatY = Math.cos(timeRef.current * 0.6 + index * 0.15) * 0.6;
        node.vx += floatX * 0.002;
        node.vy += floatY * 0.002;

        // Update position with physics
        node.x += node.vx;
        node.y += node.vy;

        // Apply friction
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Boundary constraints with soft bounce
        const padding = 30;
        if (node.x <= padding) {
          node.vx += (padding - node.x) * 0.02;
        } else if (node.x >= window.innerWidth - padding) {
          node.vx -= (node.x - (window.innerWidth - padding)) * 0.02;
        }
        if (node.y <= padding) {
          node.vy += (padding - node.y) * 0.02;
        } else if (node.y >= window.innerHeight - padding) {
          node.vy -= (node.y - (window.innerHeight - padding)) * 0.02;
        }

        // Update node pulse and energy
        node.pulse += 0.03 + proximityBoost * 0.05;
        const pulseValue = Math.sin(node.pulse) * 0.4 + 0.6;
        const energyPulse = Math.sin(timeRef.current + index * 0.5) * 0.2 + 0.8;
        
        // Calculate final node size and opacity
        const baseSize = node.size * (0.8 + node.energy * 0.4);
        const finalSize = baseSize * pulseValue * (1 + proximityBoost * 0.8);
        const nodeOpacity = (0.6 + proximityBoost * 0.4) * energyPulse;

        // Draw node with multiple layers for depth
        
        // Outer glow (largest)
        const outerGradient = ctx.createRadialGradient(
          node.x, node.y, 0, 
          node.x, node.y, finalSize * 4
        );
        outerGradient.addColorStop(0, `rgba(99, 102, 241, ${nodeOpacity * 0.3})`);
        outerGradient.addColorStop(0.3, `rgba(139, 92, 246, ${nodeOpacity * 0.2})`);
        outerGradient.addColorStop(0.6, `rgba(168, 85, 247, ${nodeOpacity * 0.1})`);
        outerGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');

        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, finalSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Middle glow
        const middleGradient = ctx.createRadialGradient(
          node.x, node.y, 0, 
          node.x, node.y, finalSize * 2
        );
        middleGradient.addColorStop(0, `rgba(139, 92, 246, ${nodeOpacity * 0.6})`);
        middleGradient.addColorStop(0.5, `rgba(168, 85, 247, ${nodeOpacity * 0.4})`);
        middleGradient.addColorStop(1, `rgba(236, 72, 153, ${nodeOpacity * 0.2})`);

        ctx.fillStyle = middleGradient;
        ctx.shadowColor = `rgba(139, 92, 246, ${nodeOpacity * 0.8})`;
        ctx.shadowBlur = 8 + proximityBoost * 15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, finalSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Main node body
        const mainGradient = ctx.createRadialGradient(
          node.x - finalSize * 0.3, node.y - finalSize * 0.3, 0,
          node.x, node.y, finalSize
        );
        mainGradient.addColorStop(0, `rgba(255, 255, 255, ${nodeOpacity * 0.9})`);
        mainGradient.addColorStop(0.4, `rgba(139, 92, 246, ${nodeOpacity * 0.8})`);
        mainGradient.addColorStop(0.8, `rgba(168, 85, 247, ${nodeOpacity * 0.6})`);
        mainGradient.addColorStop(1, `rgba(99, 102, 241, ${nodeOpacity * 0.4})`);

        ctx.fillStyle = mainGradient;
        ctx.shadowColor = `rgba(255, 255, 255, ${nodeOpacity * 0.6})`;
        ctx.shadowBlur = 6 + proximityBoost * 12;
        ctx.beginPath();
        ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bright core highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${nodeOpacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(node.x - finalSize * 0.2, node.y - finalSize * 0.2, finalSize * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Energy rings for highly active nodes
        if (proximityBoost > 0.4 || node.connections.length > 3) {
          for (let ring = 0; ring < 3; ring++) {
            const ringRadius = finalSize * (2 + ring * 0.8);
            const ringOpacity = (nodeOpacity * 0.3) * (1 - ring * 0.3);
            const ringPhase = timeRef.current * (2 + ring * 0.5) + index;
            
            ctx.strokeStyle = `rgba(139, 92, 246, ${ringOpacity * Math.sin(ringPhase) * 0.5 + 0.5})`;
            ctx.lineWidth = 1;
            ctx.shadowColor = `rgba(139, 92, 246, ${ringOpacity * 0.8})`;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      resizeCanvas();
      initializeNodes();
      initializeConnections();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isInitializedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('cursorMove', handleCursorMove as EventListener);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ 
        background: 'transparent', 
        zIndex: 1,
        opacity: window.innerWidth < 768 ? 0.6 : 0.8 // Reduce opacity on mobile for better performance
      }}
    />
  );
};



