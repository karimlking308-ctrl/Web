import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface DataPacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

interface GlobalNeuralBackgroundProps {
  activeSection?: string;
}

export const GlobalNeuralBackground: React.FC<GlobalNeuralBackgroundProps> = ({ activeSection = 'home' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHome = activeSection === 'home';

  useEffect(() => {
    if (!isHome) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
      radius: 200,
    };

    // Calculate optimal particle count based on screen area (balanced for smooth 60fps)
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 14000), 45), 85);
    const particles: Particle[] = [];

    const colors = [
      '#06b6d4', // Cyan
      '#14b8a6', // Teal
      '#10b981', // Emerald
      '#38bdf8', // Sky Blue
      '#22d3ee', // Bright Cyan
      '#34d399', // Bright Mint
      '#6ee7b7', // Light Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.4,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Dynamic data packets traveling between nodes
    const dataPackets: DataPacket[] = [];
    const packetCount = 8;
    for (let i = 0; i < packetCount; i++) {
      dataPackets.push({
        fromIndex: Math.floor(Math.random() * particleCount),
        toIndex: Math.floor(Math.random() * particleCount),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let time = 0;
    const maxDistance = 150;
    const maxDistanceSq = maxDistance * maxDistance;

    const render = () => {
      time += 0.018;

      // Smooth mouse coordinates easing
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient dark-teal background radial gradient
      const grad = ctx.createRadialGradient(
        width * 0.5 + (mouse.x - width / 2) * 0.06,
        height * 0.4 + (mouse.y - height / 2) * 0.06,
        20,
        width * 0.5,
        height * 0.4,
        Math.max(width * 0.55, 450)
      );
      grad.addColorStop(0, 'rgba(13, 148, 136, 0.12)');
      grad.addColorStop(0.45, 'rgba(6, 182, 212, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Update particle positions with wrap-around boundaries
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Smooth wrap-around so particles remain evenly dispersed forever
        if (p.x < -30) p.x = width + 30;
        else if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        else if (p.y > height + 30) p.y = -30;

        // Interactive cursor repulsion / gentle fluid breeze
        if (mouse.isHovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 1) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 2.2;
            p.y -= (dy / dist) * force * 2.2;
          }
        }

        p.pulsePhase += p.pulseSpeed;
      }

      // 3. Draw synaptic lines between connected nodes
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const baseAlpha = (1 - dist / maxDistance) * 0.28;

            // Cursor proximity brightness boost
            const midX = (p1.x + p2.x) * 0.5;
            const midY = (p1.y + p2.y) * 0.5;
            const mouseDist = Math.hypot(mouse.x - midX, mouse.y - midY);
            const mouseBoost = mouse.isHovered && mouseDist < 160 ? (1 - mouseDist / 160) * 0.35 : 0;
            const finalAlpha = Math.min(baseAlpha + mouseBoost, 0.75);

            const pulse = (Math.sin(time * 2.2 + i * 0.5) + 1) * 0.5;
            ctx.strokeStyle = `rgba(34, 211, 238, ${finalAlpha * (0.7 + 0.3 * pulse)})`;
            ctx.lineWidth = 0.9 + (mouseBoost > 0 ? 0.4 : 0);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw & advance moving data packets along connections
      for (let k = 0; k < dataPackets.length; k++) {
        const packet = dataPackets[k];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          packet.progress = 0;
          packet.fromIndex = Math.floor(Math.random() * particles.length);
          packet.toIndex = Math.floor(Math.random() * particles.length);
        }

        const p1 = particles[packet.fromIndex];
        const p2 = particles[packet.toIndex];
        if (p1 && p2) {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          // Only render packet if the 2 nodes are within connected range
          if (distSq < maxDistanceSq * 1.5) {
            const packetX = p1.x + (p2.x - p1.x) * packet.progress;
            const packetY = p1.y + (p2.y - p1.y) * packet.progress;

            ctx.save();
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = packet.color;
            ctx.shadowColor = packet.color;
            ctx.shadowBlur = 8;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 5. Draw glowing neural particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5;
        const currentAlpha = p.alpha * (0.65 + 0.35 * pulse);

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        const hoverExpand = mouse.isHovered && dist < 120 ? (1 - dist / 120) * 1.6 : 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + hoverExpand, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6 + hoverExpand * 4;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHome]);

  // If on a secondary page, render the clean, professional static pure CSS tech grid background
  if (!isHome) {
    return (
      <div
        id="global-static-tech-grid-background"
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          backgroundColor: '#0a0b10',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      >
        {/* Subtle Vignette & Depth Lighting */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#0a0b10]/40 to-[#0a0b10]/90 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-cyan-500/5 via-emerald-500/3 to-transparent blur-[140px] pointer-events-none" />
      </div>
    );
  }

  // Home Page: Active, moving green/cyan neural network animation canvas
  return (
    <div
      id="global-neural-background"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#080b12]"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
      aria-hidden="true"
    >
      {/* 60FPS Lightweight Continuous Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85 select-none pointer-events-none"
      />

      {/* Subtle Readability & Contrast Gradient Overlays (Guarantees WCAG AA Text Contrast) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/65 via-[#080b12]/40 to-[#080b12]/75 pointer-events-none" />

      {/* Radial Vignette Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-purple-500/5 blur-[160px] pointer-events-none" />
    </div>
  );
};
