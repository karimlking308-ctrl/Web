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

interface GlobalNeuralBackgroundProps {
  activeSection?: string;
}

export const GlobalNeuralBackground: React.FC<GlobalNeuralBackgroundProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
      radius: 170,
    };

    // Calculate optimal particle count based on screen area (capped for smooth 60fps)
    const particleCount = Math.min(Math.max(Math.floor((width * height) / 16000), 35), 70);
    const particles: Particle[] = [];

    const colors = [
      '#06b6d4', // Cyan
      '#14b8a6', // Teal
      '#10b981', // Emerald
      '#38bdf8', // Sky Blue
      '#22d3ee', // Bright Cyan
      '#34d399', // Bright Mint
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.35,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handlePointerLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    let time = 0;
    const maxDistance = 140;
    const maxDistanceSq = maxDistance * maxDistance;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp for natural fluid motion
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient dark-teal core glow
      const grad = ctx.createRadialGradient(
        width * 0.5 + (mouse.x - width / 2) * 0.05,
        height * 0.4 + (mouse.y - height / 2) * 0.05,
        10,
        width * 0.5,
        height * 0.4,
        Math.max(width * 0.5, 400)
      );
      grad.addColorStop(0, 'rgba(13, 148, 136, 0.10)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.03)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Update particle positions & boundaries
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently off window boundaries
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        else if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        else if (p.y > height) { p.y = height; p.vy *= -1; }

        // Interactive cursor repulsion / gentle breeze
        if (mouse.isHovered) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 1) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        p.pulsePhase += p.pulseSpeed;
      }

      // 3. Draw interconnecting neural synaptic lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const baseAlpha = (1 - dist / maxDistance) * 0.22;

            // Cursor proximity line brightness boost
            const midX = (p1.x + p2.x) * 0.5;
            const midY = (p1.y + p2.y) * 0.5;
            const mouseDist = Math.hypot(mouse.x - midX, mouse.y - midY);
            const mouseBoost = mouse.isHovered && mouseDist < 140 ? (1 - mouseDist / 140) * 0.25 : 0;
            const finalAlpha = Math.min(baseAlpha + mouseBoost, 0.6);

            const pulse = (Math.sin(time * 2 + i) + 1) * 0.5;
            ctx.strokeStyle = `rgba(34, 211, 238, ${finalAlpha * (0.75 + 0.25 * pulse)})`;
            ctx.lineWidth = 0.85 + (mouseBoost > 0 ? 0.35 : 0);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Occasional traveling data pulse token between nodes
            if ((i + j) % 6 === 0) {
              const packetPos = (Math.sin(time * 1.6 + i * 0.6) + 1) * 0.5;
              const packetX = p1.x + (p2.x - p1.x) * packetPos;
              const packetY = p1.y + (p2.y - p1.y) * packetPos;

              ctx.beginPath();
              ctx.arc(packetX, packetY, 1.3, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(52, 211, 153, ${finalAlpha * 1.6})`;
              ctx.fill();
            }
          }
        }
      }

      // 4. Draw glowing particles / ledger nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5;
        const currentAlpha = p.alpha * (0.6 + 0.4 * pulse);

        // Distance to cursor for dynamic node expansion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        const hoverExpand = mouse.isHovered && dist < 110 ? (1 - dist / 110) * 1.4 : 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + hoverExpand, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;

        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5 + hoverExpand * 3;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      id="global-neural-background"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#080b12]"
      aria-hidden="true"
    >
      {/* 60FPS Lightweight Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-80 select-none pointer-events-none"
      />

      {/* Subtle Readability & Contrast Gradient Overlays (Guarantees WCAG AA Text Contrast) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/70 via-[#080b12]/45 to-[#080b12]/80 pointer-events-none" />

      {/* Radial Vignette Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[350px] bg-purple-500/5 blur-[160px] pointer-events-none" />
    </div>
  );
};
