import React, { useEffect, useRef } from 'react';

export const GalaxyCapitalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth;
      height = canvas.height = rect.height || window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Capital nodes (Major financial centers in the galaxy)
    interface CapitalNode {
      x: number;
      y: number;
      label: string;
      orbitRadius: number;
      angle: number;
      orbitSpeed: number;
      radius: number;
      color: string;
      pulse: number;
    }

    // Stellar galaxy spiral dust particles
    interface SpiralStar {
      arm: number;
      dist: number;
      angle: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
    }

    // Floating value transfer packets between nodes
    interface ValueTransferPacket {
      fromNode: number;
      toNode: number;
      progress: number;
      speed: number;
      color: string;
    }

    const capitalNodes: CapitalNode[] = [
      { x: 0, y: 0, label: '$sopump Core', orbitRadius: 0, angle: 0, orbitSpeed: 0, radius: 6, color: '#06b6d4', pulse: 0 },
      { x: 0, y: 0, label: 'TON Jetton Reserves', orbitRadius: 180, angle: 0.5, orbitSpeed: 0.0012, radius: 4.5, color: '#10b981', pulse: 1 },
      { x: 0, y: 0, label: 'DeDust Liquidity LP', orbitRadius: 260, angle: 2.1, orbitSpeed: 0.0009, radius: 4, color: '#38bdf8', pulse: 2 },
      { x: 0, y: 0, label: 'Backer Grants Tier 1', orbitRadius: 340, angle: 3.8, orbitSpeed: 0.0007, radius: 4.5, color: '#a855f7', pulse: 3 },
      { x: 0, y: 0, label: 'IP Valuation Desk', orbitRadius: 420, angle: 5.2, orbitSpeed: 0.0005, radius: 5, color: '#f59e0b', pulse: 4 },
      { x: 0, y: 0, label: 'Treasury Staking', orbitRadius: 210, angle: 4.2, orbitSpeed: -0.001, radius: 3.5, color: '#34d399', pulse: 5 },
    ];

    const spiralStars: SpiralStar[] = [];
    const colors = ['#06b6d4', '#10b981', '#a855f7', '#38bdf8', '#fbbf24', '#ffffff'];

    // Generate 3-arm spiral galaxy dust
    const numArms = 3;
    const numStars = 160;
    for (let i = 0; i < numStars; i++) {
      const arm = i % numArms;
      const dist = 40 + Math.random() * 550;
      const spiralOffset = dist * 0.005; // logarithmic curvature
      const armAngle = (arm * (2 * Math.PI / numArms)) + spiralOffset;

      spiralStars.push({
        arm,
        dist,
        angle: armAngle + (Math.random() - 0.5) * 0.3,
        speed: 0.0006 + (60 / dist) * 0.0004,
        size: 1 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.45,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Value transfer packets moving between nodes
    const valueTransfers: ValueTransferPacket[] = [
      { fromNode: 0, toNode: 1, progress: 0.2, speed: 0.006, color: '#10b981' },
      { fromNode: 1, toNode: 2, progress: 0.6, speed: 0.005, color: '#38bdf8' },
      { fromNode: 0, toNode: 3, progress: 0.4, speed: 0.004, color: '#a855f7' },
      { fromNode: 3, toNode: 4, progress: 0.8, speed: 0.005, color: '#f59e0b' },
      { fromNode: 2, toNode: 5, progress: 0.1, speed: 0.007, color: '#34d399' },
    ];

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.45;

      // 1. Central galaxy core glow
      const corePulse = 1 + Math.sin(frame * 0.02) * 0.08;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 320 * corePulse);
      coreGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      coreGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.08)');
      coreGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.03)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 320 * corePulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw orbital trajectory rings
      [180, 260, 340, 420].forEach((r) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Draw swirling galaxy stars & financial dust
      spiralStars.forEach((star) => {
        star.angle += star.speed;
        const sx = centerX + Math.cos(star.angle) * star.dist;
        const sy = centerY + Math.sin(star.angle) * star.dist * 0.6; // Slight perspective tilt

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Update & calculate Capital Node positions
      capitalNodes.forEach((node, idx) => {
        if (idx === 0) {
          node.x = centerX;
          node.y = centerY;
        } else {
          node.angle += node.orbitSpeed;
          node.x = centerX + Math.cos(node.angle) * node.orbitRadius;
          node.y = centerY + Math.sin(node.angle) * (node.orbitRadius * 0.6);
        }
        node.pulse += 0.03;
      });

      // 5. Draw glowing constellation connection lines
      for (let i = 0; i < capitalNodes.length; i++) {
        for (let j = i + 1; j < capitalNodes.length; j++) {
          const n1 = capitalNodes[i];
          const n2 = capitalNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 450) {
            const lineAlpha = (1 - dist / 450) * 0.2;
            const lineGrad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            lineGrad.addColorStop(0, n1.color);
            lineGrad.addColorStop(1, n2.color);

            ctx.strokeStyle = lineGrad;
            ctx.lineWidth = 1;
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // 6. Draw value transfer packets traveling along capital lines
      valueTransfers.forEach((transfer) => {
        transfer.progress += transfer.speed;
        if (transfer.progress > 1) transfer.progress = 0;

        const n1 = capitalNodes[transfer.fromNode];
        const n2 = capitalNodes[transfer.toNode];

        const px = n1.x + (n2.x - n1.x) * transfer.progress;
        const py = n1.y + (n2.y - n1.y) * transfer.progress;

        ctx.fillStyle = transfer.color;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 7. Draw Capital Node hubs and badges
      capitalNodes.forEach((node) => {
        const dynRadius = node.radius + Math.sin(node.pulse) * 1.5;

        // Outer Halo
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4 + Math.sin(node.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynRadius + 4, 0, Math.PI * 2);
        ctx.stroke();

        // Node Body
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynRadius, 0, Math.PI * 2);
        ctx.fill();

        // White core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, dynRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Text Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.globalAlpha = 0.7;
        ctx.fillText(node.label, node.x + 10, node.y + 3);
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/80 via-[#080b12]/60 to-[#080b12]/90 pointer-events-none" />
    </div>
  );
};
