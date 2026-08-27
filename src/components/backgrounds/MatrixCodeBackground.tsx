import React, { useEffect, useRef } from 'react';

export const MatrixCodeBackground: React.FC = () => {
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

    // Characters & Code Snippet Tokens
    const codeTokens = [
      '0', '1', '{', '}', '[', ']', '<', '>', '/', ';', ':', '=>', 'fn', 'let', 'mut',
      'const', 'async', 'await', 'pub', 'struct', 'impl', 'tx.sign()', 'Keypair', 'lamports',
      'JitoBundle', '0x7F', '0x00', '0xFF', 'solana', 'transfer', 'token_acc', 'rpc_client',
      'pubkey', 'std::sync', 'Arc<Mutex>', 'vec![]', 'match', 'Ok(())', 'Err(e)', 'u64',
    ];

    // Columns of falling code
    const fontSize = 13;
    const columns = Math.floor(width / 22);
    const drops: { y: number; speed: number; chars: string[]; alpha: number }[] = [];

    for (let i = 0; i < columns; i++) {
      drops.push({
        y: Math.random() * -100,
        speed: 0.35 + Math.random() * 0.75, // Slow, elegant scrolling
        chars: Array.from({ length: 24 }, () => codeTokens[Math.floor(Math.random() * codeTokens.length)]),
        alpha: 0.15 + Math.random() * 0.35,
      });
    }

    // Large floating watermarked code brackets
    interface FloatingBracket {
      x: number;
      y: number;
      char: string;
      size: number;
      rot: number;
      rotSpeed: number;
      vx: number;
      vy: number;
      alpha: number;
    }

    const largeBrackets: FloatingBracket[] = [
      { x: width * 0.15, y: height * 0.3, char: '{ }', size: 140, rot: 0.1, rotSpeed: 0.001, vx: 0.1, vy: 0.05, alpha: 0.05 },
      { x: width * 0.85, y: height * 0.25, char: '</>', size: 120, rot: -0.15, rotSpeed: -0.001, vx: -0.08, vy: 0.04, alpha: 0.06 },
      { x: width * 0.7, y: height * 0.75, char: '[ ]', size: 150, rot: 0.05, rotSpeed: 0.0015, vx: 0.05, vy: -0.06, alpha: 0.04 },
      { x: width * 0.25, y: height * 0.8, char: 'fn()', size: 110, rot: -0.08, rotSpeed: -0.0008, vx: -0.05, vy: -0.05, alpha: 0.05 },
      { x: width * 0.5, y: height * 0.5, char: '$ >_', size: 130, rot: 0, rotSpeed: 0.0005, vx: 0.02, vy: 0.03, alpha: 0.05 },
    ];

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw large floating wireframe code brackets
      largeBrackets.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.rotSpeed;

        if (b.x < -100) b.x = width + 100;
        if (b.x > width + 100) b.x = -100;
        if (b.y < -100) b.y = height + 100;
        if (b.y > height + 100) b.y = -100;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.font = `900 ${b.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(16, 185, 129, ${b.alpha})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.char, 0, 0);

        ctx.strokeStyle = `rgba(52, 211, 153, ${b.alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.strokeText(b.char, 0, 0);
        ctx.restore();
      });

      // 2. Draw falling matrix-style code stream columns
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      drops.forEach((drop, colIndex) => {
        const x = colIndex * 22;
        drop.y += drop.speed;

        // Occasional char mutation
        if (frame % 15 === 0 && Math.random() > 0.6) {
          const charIdx = Math.floor(Math.random() * drop.chars.length);
          drop.chars[charIdx] = codeTokens[Math.floor(Math.random() * codeTokens.length)];
        }

        // Draw trail of characters
        drop.chars.forEach((ch, rowIdx) => {
          const charY = drop.y - (rowIdx * (fontSize + 4));
          if (charY > 0 && charY < height) {
            // Head of the stream is bright, trail fades out
            if (rowIdx === 0) {
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = drop.alpha * 1.5;
            } else if (rowIdx < 3) {
              ctx.fillStyle = '#6ee7b7'; // Bright emerald
              ctx.globalAlpha = drop.alpha * 1.2;
            } else {
              ctx.fillStyle = '#10b981'; // Deep emerald
              ctx.globalAlpha = drop.alpha * (1 - (rowIdx / drop.chars.length));
            }

            ctx.fillText(ch, x, charY);
            ctx.globalAlpha = 1;
          }
        });

        // Reset column when out of view
        if (drop.y - (drop.chars.length * fontSize) > height) {
          drop.y = Math.random() * -60;
          drop.speed = 0.35 + Math.random() * 0.75;
          drop.alpha = 0.15 + Math.random() * 0.35;
        }
      });

      // 3. Subtle horizontal scanline pulse
      const scanY = (frame * 1.2) % height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      scanGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.04)');
      scanGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, width, 60);

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
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/85 via-[#080b12]/65 to-[#080b12]/90 pointer-events-none" />
    </div>
  );
};
