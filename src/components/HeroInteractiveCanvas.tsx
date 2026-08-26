import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  connections: number[];
}

export const HeroInteractiveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
      radius: 180,
    };

    // Responsive particle count based on screen width
    const particleCount = Math.min(Math.floor((width * height) / 12000), 75);
    const particles: Particle[] = [];

    const colors = [
      '#06b6d4', // Cyan
      '#14b8a6', // Teal
      '#10b981', // Emerald
      '#38bdf8', // Sky / Electric Blue
      '#22d3ee', // Bright Cyan
    ];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
      });
    }

    // Resize observer to handle dynamic layout shifts without stutter
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === canvas.parentElement) {
          width = canvas.width = entry.contentRect.width;
          height = canvas.height = entry.contentRect.height;
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    const parentEl = canvas.parentElement;
    if (parentEl) {
      parentEl.addEventListener('mousemove', handleMouseMove, { passive: true });
      parentEl.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    let time = 0;

    // Optimization: Pre-calculate max distance squared for faster connection checks
    const maxDistance = 145;
    const maxDistanceSq = maxDistance * maxDistance;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp for realistic fluid parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Background Atmospheric Glows on Canvas
      const grad = ctx.createRadialGradient(
        width * 0.5 + (mouse.x - width / 2) * 0.08,
        height * 0.45 + (mouse.y - height / 2) * 0.08,
        10,
        width * 0.5,
        height * 0.45,
        width * 0.45
      );
      grad.addColorStop(0, 'rgba(13, 148, 136, 0.12)'); // deep dark-teal core
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.04)');
      grad.addColorStop(1, 'rgba(3, 7, 13, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Update & Move Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Autonomous drift
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently off canvas borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive Cursor Parallax Repulsion / Magnetism
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && mouse.isHovered) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          // Subtle deflection vector away from cursor
          p.x -= Math.cos(angle) * force * 1.5;
          p.y -= Math.sin(angle) * force * 1.5;
        }

        // Periodic pulsing brightness
        p.pulsePhase += p.pulseSpeed;
      }

      // 3. Draw Interconnecting Blockchain / Neural Network Lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDistance) * 0.28;

            // Distance to mouse for interactive brightness boost
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const mouseDist = Math.hypot(mouse.x - midX, mouse.y - midY);
            const mouseBoost = mouse.isHovered && mouseDist < 160 ? (1 - mouseDist / 160) * 0.35 : 0;

            const finalAlpha = Math.min(alpha + mouseBoost, 0.65);

            // Pulsating glow on lines
            const pulse = (Math.sin(time * 2 + i) + 1) * 0.5;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${finalAlpha * (0.7 + 0.3 * pulse)})`;
            ctx.lineWidth = 0.85 + (mouseBoost > 0 ? 0.4 : 0);
            ctx.stroke();

            // Occasional traveling data pulse token between nodes
            if ((i + j) % 7 === 0) {
              const packetPos = (Math.sin(time * 1.8 + i * 0.5) + 1) / 2;
              const packetX = p1.x + (p2.x - p1.x) * packetPos;
              const packetY = p1.y + (p2.y - p1.y) * packetPos;

              ctx.beginPath();
              ctx.arc(packetX, packetY, 1.3, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(52, 211, 153, ${finalAlpha * 1.8})`;
              ctx.shadowColor = '#34d399';
              ctx.shadowBlur = 4;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      // 4. Draw Glowing Particles / Ledger Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5;
        const currentAlpha = p.alpha * (0.6 + 0.4 * pulse);

        // Distance to cursor for dynamic node expansion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        const hoverExpand = mouse.isHovered && dist < 120 ? (1 - dist / 120) * 1.5 : 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + hoverExpand, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        
        // Node outer glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6 + hoverExpand * 3;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (parentEl) {
        parentEl.removeEventListener('mousemove', handleMouseMove);
        parentEl.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block select-none pointer-events-none"
      />
    </div>
  );
};
