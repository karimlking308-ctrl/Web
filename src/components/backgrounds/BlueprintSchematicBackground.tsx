import React, { useEffect, useRef } from 'react';

export const BlueprintSchematicBackground: React.FC = () => {
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

    // Architectural Blueprint Modules & Blocks
    interface SchematicBlock {
      x: number;
      y: number;
      w: number;
      h: number;
      label: string;
      subtext: string;
      alpha: number;
      maxAlpha: number;
      life: number;
      maxLife: number;
      ports: { x: number; y: number }[];
    }

    interface TraceLine {
      startX: number;
      startY: number;
      midX: number;
      midY: number;
      endX: number;
      endY: number;
      progress: number;
      speed: number;
      alpha: number;
    }

    interface Crosshair {
      x: number;
      y: number;
      size: number;
      pulse: number;
      code: string;
    }

    const blocks: SchematicBlock[] = [];
    const traces: TraceLine[] = [];
    const crosshairs: Crosshair[] = [];

    const moduleLabels = [
      { label: 'REST_ROUTER: /api/v1', subtext: 'STATUS: 200_OK' },
      { label: 'TEP-74_JETTON_PARSER', subtext: 'VERIFIED_AUDIT' },
      { label: 'SOLANA_RPC_POOL', subtext: 'LATENCY: 34ms' },
      { label: 'AES-256_GCM_CRYPT', subtext: 'NON_CUSTODIAL' },
      { label: 'MEMPOOL_MONITOR', subtext: 'BLOCK_SUB_12' },
      { label: 'FEE_ESTIMATOR_CU', subtext: 'ALGO: MEDIAN_3' },
      { label: 'METADATA_EXTRACTOR', subtext: 'URI_RESOLVER' },
      { label: 'DEDUST_LP_OBSERVER', subtext: 'RESERVE_SYNC' },
    ];

    // Generate schematic blocks at grid intervals
    const initBlocks = () => {
      blocks.length = 0;
      const cols = Math.max(2, Math.floor(width / 320));
      const rows = Math.max(2, Math.floor(height / 240));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.35) {
            const bx = c * 320 + 40 + (Math.random() - 0.5) * 40;
            const by = r * 240 + 40 + (Math.random() - 0.5) * 40;
            const bw = 160 + Math.random() * 50;
            const bh = 70 + Math.random() * 25;
            const modInfo = moduleLabels[Math.floor(Math.random() * moduleLabels.length)];

            blocks.push({
              x: bx,
              y: by,
              w: bw,
              h: bh,
              label: modInfo.label,
              subtext: modInfo.subtext,
              alpha: 0,
              maxAlpha: 0.15 + Math.random() * 0.2,
              life: Math.random() * 200,
              maxLife: 300 + Math.random() * 250,
              ports: [
                { x: bx + bw / 2, y: by },
                { x: bx + bw / 2, y: by + bh },
                { x: bx, y: by + bh / 2 },
                { x: bx + bw, y: by + bh / 2 },
              ],
            });
          }
        }
      }
    };

    initBlocks();

    // Generate technical trace lines connecting blocks
    for (let i = 0; i < 20; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const mx = sx + (Math.random() > 0.5 ? 120 : -120);
      const my = sy;
      const ex = mx;
      const ey = sy + (Math.random() > 0.5 ? 90 : -90);

      traces.push({
        startX: sx,
        startY: sy,
        midX: mx,
        midY: my,
        endX: ex,
        endY: ey,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        alpha: 0.1 + Math.random() * 0.2,
      });
    }

    // Generate precision crosshairs & technical ticks
    for (let i = 0; i < 12; i++) {
      crosshairs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 8 + Math.random() * 6,
        pulse: Math.random() * Math.PI * 2,
        code: `SEC_${Math.floor(100 + Math.random() * 900)}`,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw calm subtle technical schematic grid (Blueprint Paper Grid)
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.035)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines (slowly scrolling downwards for smooth motion)
      const yOffset = (frame * 0.2) % gridSize;
      for (let y = yOffset - gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw crosshairs & coordinate markers
      crosshairs.forEach((ch) => {
        ch.pulse += 0.02;
        const alpha = 0.15 + Math.sin(ch.pulse) * 0.08;

        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
        ctx.lineWidth = 1;

        // Cross lines
        ctx.beginPath();
        ctx.moveTo(ch.x - ch.size, ch.y);
        ctx.lineTo(ch.x + ch.size, ch.y);
        ctx.moveTo(ch.x, ch.y - ch.size);
        ctx.lineTo(ch.x, ch.y + ch.size);
        ctx.stroke();

        // Small circle
        ctx.beginPath();
        ctx.arc(ch.x, ch.y, ch.size * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Coordinate text
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.9})`;
        ctx.fillText(`${ch.code} [${Math.floor(ch.x)},${Math.floor(ch.y)}]`, ch.x + 8, ch.y - 4);
      });

      // 3. Draw 90-degree technical trace lines
      traces.forEach((tr) => {
        tr.progress += tr.speed;
        if (tr.progress > 1) {
          tr.progress = 0;
          tr.startX = Math.random() * width;
          tr.startY = Math.random() * height;
          tr.midX = tr.startX + (Math.random() > 0.5 ? 120 : -120);
          tr.midY = tr.startY;
          tr.endX = tr.midX;
          tr.endY = tr.startY + (Math.random() > 0.5 ? 90 : -90);
        }

        // Trace base line
        ctx.strokeStyle = `rgba(6, 182, 212, ${tr.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tr.startX, tr.startY);
        ctx.lineTo(tr.midX, tr.midY);
        ctx.lineTo(tr.endX, tr.endY);
        ctx.stroke();

        // Moving pulse dot along trace
        let px = tr.startX;
        let py = tr.startY;
        if (tr.progress < 0.5) {
          const t = tr.progress / 0.5;
          px = tr.startX + (tr.midX - tr.startX) * t;
          py = tr.startY;
        } else {
          const t = (tr.progress - 0.5) / 0.5;
          px = tr.midX;
          py = tr.midY + (tr.endY - tr.midY) * t;
        }

        ctx.fillStyle = '#38bdf8';
        ctx.globalAlpha = tr.alpha * 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Draw Schematic Modular Blocks with fade lifecycle
      blocks.forEach((b) => {
        b.life++;
        if (b.life < 50) {
          b.alpha = (b.life / 50) * b.maxAlpha;
        } else if (b.life > b.maxLife - 50) {
          b.alpha = ((b.maxLife - b.life) / 50) * b.maxAlpha;
        }

        if (b.life >= b.maxLife) {
          b.life = 0;
          b.x = Math.random() * (width - b.w);
          b.y = Math.random() * (height - b.h);
          const modInfo = moduleLabels[Math.floor(Math.random() * moduleLabels.length)];
          b.label = modInfo.label;
          b.subtext = modInfo.subtext;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, b.alpha);

        // Box border & subtle fill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
        ctx.fillRect(b.x, b.y, b.w, b.h);

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        // Header bar
        ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.fillRect(b.x, b.y, b.w, 18);

        // Corner tick marks
        const tick = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + tick);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(b.x + tick, b.y);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(b.x + b.w - tick, b.y);
        ctx.lineTo(b.x + b.w, b.y);
        ctx.lineTo(b.x + b.w, b.y + tick);
        ctx.stroke();

        // Module text
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(b.label, b.x + 8, b.y + 12);

        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(b.subtext, b.x + 8, b.y + 32);

        // Sub status bar
        ctx.fillStyle = '#10b981';
        ctx.fillRect(b.x + 8, b.y + b.h - 12, b.w - 16, 3);

        ctx.restore();
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
