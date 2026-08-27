import React, { useEffect, useRef } from 'react';

export const DataStreamBackground: React.FC = () => {
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

    // Data packets streaming horizontally & diagonally
    interface Packet {
      x: number;
      y: number;
      speed: number;
      length: number;
      color: string;
      alpha: number;
      laneY: number;
      size: number;
    }

    interface FloatingMetric {
      x: number;
      y: number;
      vx: number;
      vy: number;
      text: string;
      alpha: number;
      maxAlpha: number;
      color: string;
      size: number;
      life: number;
      maxLife: number;
    }

    interface CircuitNode {
      x: number;
      y: number;
      radius: number;
      pulse: number;
      color: string;
      connections: { x: number; y: number }[];
    }

    const packets: Packet[] = [];
    const metrics: FloatingMetric[] = [];
    const nodes: CircuitNode[] = [];

    const colors = ['#06b6d4', '#10b981', '#6366f1', '#38bdf8', '#22d3ee'];
    const sampleMetrics = [
      '+42.5 Gwei',
      '0.000005 SOL',
      '128,450 CUs',
      'tx/s: 2,840',
      '0x7f..9c3',
      'Latency: 38ms',
      'SPL-20 Valid',
      'SigVerify: OK',
      'Jito Tip: 0.001',
      'Compute Unit: 200k',
      'Block: #2948102',
      'TPS: 3,120',
      'Lamport: 5000',
    ];

    // Initialize horizontal lanes
    const laneCount = Math.max(12, Math.floor(height / 60));
    for (let i = 0; i < 45; i++) {
      const laneIndex = Math.floor(Math.random() * laneCount);
      const laneY = (laneIndex * (height / laneCount)) + Math.random() * 20;
      packets.push({
        x: Math.random() * width,
        y: laneY,
        laneY,
        speed: 2 + Math.random() * 4,
        length: 20 + Math.random() * 80,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.2 + Math.random() * 0.5,
        size: 1 + Math.random() * 2,
      });
    }

    // Initialize floating metrics
    for (let i = 0; i < 18; i++) {
      metrics.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0.2 + Math.random() * 0.4,
        vy: (Math.random() - 0.5) * 0.2,
        text: sampleMetrics[Math.floor(Math.random() * sampleMetrics.length)],
        alpha: 0,
        maxAlpha: 0.25 + Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 10 + Math.random() * 3,
        life: Math.random() * 200,
        maxLife: 250 + Math.random() * 200,
      });
    }

    // Initialize circuit nodes
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const connections = [];
      const numConn = 1 + Math.floor(Math.random() * 3);
      for (let c = 0; c < numConn; c++) {
        connections.push({
          x: x + (Math.random() - 0.5) * 200,
          y: y + (Math.random() - 0.5) * 100,
        });
      }
      nodes.push({
        x,
        y,
        radius: 2 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle horizontal grid bus lines
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 70) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw circuit traces between nodes
      nodes.forEach((node) => {
        node.pulse += 0.03;
        const currentAlpha = 0.15 + Math.sin(node.pulse) * 0.08;

        node.connections.forEach((conn) => {
          ctx.strokeStyle = `rgba(6, 182, 212, ${currentAlpha * 0.5})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 8]);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(conn.x, node.y);
          ctx.lineTo(conn.x, conn.y);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Node glow
        ctx.fillStyle = node.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulse) * 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 3. Draw streaming data packets
      packets.forEach((p) => {
        p.x += p.speed;
        if (p.x > width + p.length) {
          p.x = -p.length;
          p.y = (Math.floor(Math.random() * laneCount) * (height / laneCount)) + Math.random() * 20;
        }

        const grad = ctx.createLinearGradient(p.x - p.length, p.y, p.x, p.y);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.7, p.color);
        grad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = grad;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.moveTo(p.x - p.length, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        // Packet head spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Draw floating telemetry metrics & numbers
      ctx.font = '11px "JetBrains Mono", monospace';
      metrics.forEach((m) => {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;

        // Fade in and fade out
        if (m.life < 40) {
          m.alpha = (m.life / 40) * m.maxAlpha;
        } else if (m.life > m.maxLife - 40) {
          m.alpha = ((m.maxLife - m.life) / 40) * m.maxAlpha;
        }

        if (m.life >= m.maxLife || m.x > width + 50) {
          m.life = 0;
          m.x = -50;
          m.y = Math.random() * height;
          m.text = sampleMetrics[Math.floor(Math.random() * sampleMetrics.length)];
        }

        ctx.fillStyle = m.color;
        ctx.globalAlpha = Math.max(0, m.alpha);
        ctx.fillText(m.text, m.x, m.y);
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
      <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/80 via-[#080b12]/60 to-[#080b12]/90 pointer-events-none" />
    </div>
  );
};
