import React, { useEffect, useRef } from 'react';

export const VaultGeometryBackground: React.FC = () => {
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

    // Inflowing Asset Particles converging to central/lateral vault hubs
    interface AssetToken {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      speed: number;
      radius: number;
      color: string;
      label: string;
      alpha: number;
      angle: number;
      dist: number;
    }

    interface ShimmerHex {
      x: number;
      y: number;
      radius: number;
      rot: number;
      rotSpeed: number;
      pulsePhase: number;
      color: string;
      borderWidth: number;
    }

    const tokens: AssetToken[] = [];
    const hexes: ShimmerHex[] = [];

    const assetLabels = ['ZIP', 'IP-NFT', 'KEY', 'TON', 'SOL', 'PRO', 'SHA-256', 'DATA', 'VIP'];
    const colors = ['#a855f7', '#06b6d4', '#f59e0b', '#38bdf8', '#c084fc', '#10b981'];

    // Vault centers
    const getVaultCenters = () => [
      { x: width * 0.5, y: height * 0.35 },
      { x: width * 0.15, y: height * 0.7 },
      { x: width * 0.85, y: height * 0.7 },
    ];

    // Initialize pulsating concentric hexagons
    const initHexes = () => {
      hexes.length = 0;
      const centers = getVaultCenters();
      centers.forEach((c, idx) => {
        const baseRadius = idx === 0 ? 160 : 100;
        for (let r = 1; r <= 4; r++) {
          hexes.push({
            x: c.x,
            y: c.y,
            radius: baseRadius * (r * 0.35),
            rot: (r * Math.PI) / 6,
            rotSpeed: (idx === 0 ? 0.002 : -0.003) * (r % 2 === 0 ? 1 : -1),
            pulsePhase: r * 0.8,
            color: idx === 0 ? '#a855f7' : (idx === 1 ? '#06b6d4' : '#f59e0b'),
            borderWidth: r === 1 ? 2 : 1,
          });
        }
      });
    };

    initHexes();

    // Initialize converging asset tokens
    for (let i = 0; i < 40; i++) {
      const centers = getVaultCenters();
      const targetCenter = centers[Math.floor(Math.random() * centers.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 180 + Math.random() * 450;

      tokens.push({
        x: targetCenter.x + Math.cos(angle) * dist,
        y: targetCenter.y + Math.sin(angle) * dist,
        targetX: targetCenter.x,
        targetY: targetCenter.y,
        speed: 0.5 + Math.random() * 1.2,
        radius: 2 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        label: assetLabels[Math.floor(Math.random() * assetLabels.length)],
        alpha: 0.2 + Math.random() * 0.6,
        angle,
        dist,
      });
    }

    const drawPolygon = (x: number, y: number, radius: number, sides: number, rotation: number) => {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = rotation + (i * 2 * Math.PI) / sides;
        const px = x + Math.cos(a) * radius;
        const py = y + Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const centers = getVaultCenters();

      // 1. Draw glowing central vault rings & concentric lock geometry
      centers.forEach((c, cIdx) => {
        const pulse = Math.sin(frame * 0.02 + cIdx) * 0.15 + 0.85;

        // Core ambient glow
        const glowGrad = ctx.createRadialGradient(c.x, c.y, 5, c.x, c.y, 220 * pulse);
        glowGrad.addColorStop(0, cIdx === 0 ? 'rgba(168, 85, 247, 0.18)' : 'rgba(6, 182, 212, 0.12)');
        glowGrad.addColorStop(0.5, cIdx === 0 ? 'rgba(168, 85, 247, 0.04)' : 'rgba(6, 182, 212, 0.03)');
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 220 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Lock Core Circle
        ctx.strokeStyle = cIdx === 0 ? 'rgba(192, 132, 252, 0.3)' : 'rgba(34, 211, 238, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 35 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs / Security ticks
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 65 * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Draw rotating & pulsating hexagons
      hexes.forEach((hex) => {
        hex.rot += hex.rotSpeed;
        hex.pulsePhase += 0.015;
        const dynRadius = hex.radius * (1 + Math.sin(hex.pulsePhase) * 0.06);

        ctx.save();
        ctx.strokeStyle = hex.color;
        ctx.lineWidth = hex.borderWidth;
        ctx.globalAlpha = 0.15 + Math.sin(hex.pulsePhase) * 0.08;

        drawPolygon(hex.x, hex.y, dynRadius, 6, hex.rot);
        ctx.stroke();
        ctx.restore();
      });

      // 3. Draw inflowing digital asset tokens (ZIP, KEY, TON, SOL)
      tokens.forEach((t) => {
        t.dist -= t.speed;
        t.angle += 0.008; // Swirl inward

        t.x = t.targetX + Math.cos(t.angle) * t.dist;
        t.y = t.targetY + Math.sin(t.angle) * t.dist;

        // Reset once reached the vault center
        if (t.dist < 25) {
          t.dist = 220 + Math.random() * 380;
          t.angle = Math.random() * Math.PI * 2;
          const randomCenter = centers[Math.floor(Math.random() * centers.length)];
          t.targetX = randomCenter.x;
          t.targetY = randomCenter.y;
        }

        // Draw particle stream trail to target
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = t.alpha * 0.4;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x - Math.cos(t.angle) * 15, t.y - Math.sin(t.angle) * 15);
        ctx.stroke();

        // Draw particle body
        ctx.fillStyle = t.color;
        ctx.globalAlpha = t.alpha;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw tiny label badge for some tokens
        if (t.dist > 80 && t.dist < 320 && Math.random() > 0.4) {
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = '#e2e8f0';
          ctx.globalAlpha = t.alpha * 0.6;
          ctx.fillText(t.label, t.x + 6, t.y + 3);
        }

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
