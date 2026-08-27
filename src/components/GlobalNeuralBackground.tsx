import React, { useEffect, useRef } from 'react';

export type BackgroundStateType =
  | 'home'
  | 'dataStream'
  | 'matrixCipher'
  | 'valueFlow'
  | 'ecosystemMap'
  | 'blueprintSchematic';

interface GlobalNeuralBackgroundProps {
  activeSection: string;
}

// Map any route/section ID to one of the 6 background states
export function getBackgroundState(sectionId: string): BackgroundStateType {
  switch (sectionId) {
    case 'utility-tools':
    case 'gas-calculator':
    case 'tools':
    case 'fee-estimator':
      return 'dataStream';

    case 'developer-scripts':
    case 'vault':
    case 'digital-vault':
    case 'scripts':
    case 'downloads':
      return 'matrixCipher';

    case 'store':
    case 'pricing':
    case 'pro':
      return 'valueFlow';

    case 'backers-hub':
    case 'investors-hub':
    case 'token':
    case 'backers':
    case 'investors':
      return 'ecosystemMap';

    case 'dev-docs':
    case 'about':
    case 'trust-legal-hub':
    case 'faq':
    case 'docs':
    case 'legal':
    case 'security':
      return 'blueprintSchematic';

    case 'home':
    default:
      return 'home';
  }
}

export const GlobalNeuralBackground: React.FC<GlobalNeuralBackgroundProps> = ({ activeSection }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetStateRef = useRef<BackgroundStateType>(getBackgroundState(activeSection));

  // Update target state whenever activeSection changes
  useEffect(() => {
    targetStateRef.current = getBackgroundState(activeSection);
  }, [activeSection]);

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
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking for interactive neural reactivity
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false,
    };

    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handlePointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isHovered = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);

    // -------------------------------------------------------------
    // STATE INTERPOLATION WEIGHTS (Smooth 2.0-Second Cross-Fade)
    // -------------------------------------------------------------
    const stateKeys: BackgroundStateType[] = [
      'home',
      'dataStream',
      'matrixCipher',
      'valueFlow',
      'ecosystemMap',
      'blueprintSchematic',
    ];

    const weights: Record<BackgroundStateType, number> = {
      home: targetStateRef.current === 'home' ? 1.0 : 0.0,
      dataStream: targetStateRef.current === 'dataStream' ? 1.0 : 0.0,
      matrixCipher: targetStateRef.current === 'matrixCipher' ? 1.0 : 0.0,
      valueFlow: targetStateRef.current === 'valueFlow' ? 1.0 : 0.0,
      ecosystemMap: targetStateRef.current === 'ecosystemMap' ? 1.0 : 0.0,
      blueprintSchematic: targetStateRef.current === 'blueprintSchematic' ? 1.0 : 0.0,
    };

    // -------------------------------------------------------------
    // 1. HOME: Neural Network Nodes & Synapses
    // -------------------------------------------------------------
    interface NeuralNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulsePhase: number;
      pulseSpeed: number;
    }

    interface SynapsePacket {
      from: number;
      to: number;
      progress: number;
      speed: number;
      color: string;
    }

    const neuralColors = ['#06b6d4', '#14b8a6', '#10b981', '#38bdf8', '#22d3ee'];
    const neuralNodes: NeuralNode[] = [];
    const numNeural = 65;

    for (let i = 0; i < numNeural; i++) {
      neuralNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.2,
        color: neuralColors[Math.floor(Math.random() * neuralColors.length)],
        alpha: Math.random() * 0.5 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02,
      });
    }

    const synapsePackets: SynapsePacket[] = [
      { from: 0, to: 4, progress: 0.1, speed: 0.008, color: '#38bdf8' },
      { from: 10, to: 15, progress: 0.4, speed: 0.007, color: '#22d3ee' },
      { from: 20, to: 28, progress: 0.7, speed: 0.009, color: '#10b981' },
      { from: 35, to: 42, progress: 0.3, speed: 0.006, color: '#06b6d4' },
      { from: 50, to: 58, progress: 0.8, speed: 0.008, color: '#34d399' },
    ];

    // -------------------------------------------------------------
    // 2. DATA STREAM: High-Speed Vectors & Packets (Sky Blue)
    // -------------------------------------------------------------
    interface DataVectorStream {
      x: number;
      y: number;
      length: number;
      speed: number;
      width: number;
      angle: number;
      alpha: number;
      pulse: number;
      label?: string;
    }

    const dataStreams: DataVectorStream[] = [];
    const streamLabels = ['tx/s: 2,940', '128k CUs', 'Priority: 45k', 'Lamports', 'MEMPOOL', 'RPC_SYNC'];
    for (let i = 0; i < 28; i++) {
      dataStreams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 80 + Math.random() * 160,
        speed: 3.5 + Math.random() * 6.5,
        width: 1 + Math.random() * 1.5,
        angle: (Math.random() > 0.6 ? -20 : 0) * (Math.PI / 180),
        alpha: 0.2 + Math.random() * 0.6,
        pulse: Math.random() * Math.PI * 2,
        label: Math.random() > 0.6 ? streamLabels[Math.floor(Math.random() * streamLabels.length)] : undefined,
      });
    }

    // -------------------------------------------------------------
    // 3. MATRIX CIPHER & HEX GRID: Falling Code & Security Grid (Emerald)
    // -------------------------------------------------------------
    const matrixTokens = [
      '0', '1', '0x7F', '0x00', '0xFF', 'fn', 'let', 'mut', 'pub', 'Keypair', 'lamports',
      'Jito', 'Arc', 'Mutex', 'vec![]', 'Ok(())', 'u64', 'λ', '§', 'solana', 'TEP-74', 'AES-256',
    ];
    const matrixColumns: { y: number; speed: number; chars: string[]; alpha: number }[] = [];
    const matrixColCount = Math.max(25, Math.floor(width / 32));

    for (let i = 0; i < matrixColCount; i++) {
      matrixColumns.push({
        y: Math.random() * -120,
        speed: 0.45 + Math.random() * 0.85,
        chars: Array.from({ length: 18 }, () => matrixTokens[Math.floor(Math.random() * matrixTokens.length)]),
        alpha: 0.15 + Math.random() * 0.45,
      });
    }

    // -------------------------------------------------------------
    // 4. VALUE FLOW: Swirling Capital Galaxy (Deep Purple)
    // -------------------------------------------------------------
    interface ValueStar {
      arm: number;
      dist: number;
      angle: number;
      speed: number;
      size: number;
      alpha: number;
      color: string;
    }

    interface ValueOrbitNode {
      orbitRadius: number;
      angle: number;
      speed: number;
      label: string;
      color: string;
    }

    const valueStars: ValueStar[] = [];
    const purpleColors = ['#a855f7', '#c084fc', '#e879f9', '#8b5cf6', '#38bdf8', '#ffffff'];
    for (let i = 0; i < 150; i++) {
      const arm = i % 3;
      const dist = 30 + Math.random() * 520;
      const spiralOffset = dist * 0.006;
      const armAngle = (arm * (2 * Math.PI / 3)) + spiralOffset;

      valueStars.push({
        arm,
        dist,
        angle: armAngle + (Math.random() - 0.5) * 0.25,
        speed: 0.0007 + (50 / dist) * 0.0003,
        size: 1 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.5,
        color: purpleColors[Math.floor(Math.random() * purpleColors.length)],
      });
    }

    const valueNodes: ValueOrbitNode[] = [
      { orbitRadius: 160, angle: 0.4, speed: 0.0012, label: '$sopump Core', color: '#c084fc' },
      { orbitRadius: 240, angle: 1.8, speed: 0.0009, label: 'TON Reserves', color: '#38bdf8' },
      { orbitRadius: 320, angle: 3.5, speed: 0.0007, label: 'DeDust Pool', color: '#a855f7' },
      { orbitRadius: 400, angle: 4.9, speed: 0.0005, label: 'VIP Vault Hub', color: '#f472b6' },
    ];

    // -------------------------------------------------------------
    // 5. ECOSYSTEM MAP: Expansive Hub Clusters & Satellite Chains (Cyan/Gold)
    // -------------------------------------------------------------
    interface EcosystemHub {
      name: string;
      baseXRatio: number;
      baseYRatio: number;
      x: number;
      y: number;
      color: string;
      satellites: { angle: number; dist: number; speed: number; label: string }[];
    }

    const ecosystemHubs: EcosystemHub[] = [
      {
        name: 'SolPump Core Engine',
        baseXRatio: 0.5,
        baseYRatio: 0.38,
        x: 0,
        y: 0,
        color: '#06b6d4',
        satellites: [
          { angle: 0.2, dist: 55, speed: 0.008, label: 'Jito MEV' },
          { angle: 2.1, dist: 70, speed: -0.006, label: 'RPC Pool' },
          { angle: 4.2, dist: 60, speed: 0.007, label: 'Airdrop Engine' },
        ],
      },
      {
        name: 'TON Jetton Mainnet',
        baseXRatio: 0.22,
        baseYRatio: 0.65,
        x: 0,
        y: 0,
        color: '#10b981',
        satellites: [
          { angle: 0.5, dist: 50, speed: 0.009, label: 'TEP-74' },
          { angle: 3.2, dist: 65, speed: -0.007, label: 'DeDust DEX' },
        ],
      },
      {
        name: 'Institutional IP Desk',
        baseXRatio: 0.78,
        baseYRatio: 0.65,
        x: 0,
        y: 0,
        color: '#f59e0b',
        satellites: [
          { angle: 1.2, dist: 55, speed: 0.007, label: 'IP Valuation' },
          { angle: 3.8, dist: 60, speed: -0.008, label: 'Licensing' },
        ],
      },
      {
        name: 'Developer Consortium',
        baseXRatio: 0.5,
        baseYRatio: 0.85,
        x: 0,
        y: 0,
        color: '#a855f7',
        satellites: [
          { angle: 0.8, dist: 45, speed: 0.01, label: 'Grants' },
          { angle: 3.0, dist: 55, speed: -0.006, label: 'Audits' },
        ],
      },
    ];

    // -------------------------------------------------------------
    // 6. BLUEPRINT SCHEMATIC: Calm Technical Grid & Traces (Slate/Cyan)
    // -------------------------------------------------------------
    interface BlueprintTrace {
      startX: number;
      startY: number;
      midX: number;
      midY: number;
      endX: number;
      endY: number;
      progress: number;
      speed: number;
    }

    interface BlueprintCrosshair {
      x: number;
      y: number;
      code: string;
      pulse: number;
    }

    const blueprintTraces: BlueprintTrace[] = [];
    for (let i = 0; i < 16; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const mx = sx + (Math.random() > 0.5 ? 100 : -100);
      const my = sy;
      const ex = mx;
      const ey = sy + (Math.random() > 0.5 ? 80 : -80);

      blueprintTraces.push({
        startX: sx,
        startY: sy,
        midX: mx,
        midY: my,
        endX: ex,
        endY: ey,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    const blueprintCrosshairs: BlueprintCrosshair[] = [];
    for (let i = 0; i < 10; i++) {
      blueprintCrosshairs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        code: `SEC_${Math.floor(100 + Math.random() * 900)}`,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Hexagon drawing helper
    const drawHexagon = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    let lastTimestamp = performance.now();
    let frame = 0;

    // -------------------------------------------------------------
    // MASTER RENDER LOOP (60FPS Dynamic Interpolation)
    // -------------------------------------------------------------
    const render = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;
      frame++;

      // 1. Update smooth cross-fading weights (2.0-second smooth transition)
      // Rate: exponential decay toward target weight (reaches ~98% in 2000ms)
      const currentTarget = targetStateRef.current;
      const lerpSpeed = Math.min(1.0, dt * 2.2);

      stateKeys.forEach((key) => {
        const targetVal = key === currentTarget ? 1.0 : 0.0;
        weights[key] += (targetVal - weights[key]) * lerpSpeed;
        if (Math.abs(weights[key] - targetVal) < 0.001) {
          weights[key] = targetVal;
        }
      });

      // Smooth mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // ===========================================================
      // LAYER 1: GLOBAL HOME NEURAL NETWORK
      // ===========================================================
      if (weights.home > 0.01) {
        ctx.save();
        const homeAlpha = weights.home;

        // Update & Draw Neural Nodes
        neuralNodes.forEach((node, idx) => {
          node.x += node.vx;
          node.y += node.vy;
          node.pulsePhase += node.pulseSpeed;

          // Boundary bouncing
          if (node.x < 0) { node.x = 0; node.vx *= -1; }
          if (node.x > width) { node.x = width; node.vx *= -1; }
          if (node.y < 0) { node.y = 0; node.vy *= -1; }
          if (node.y > height) { node.y = height; node.vy *= -1; }

          // Subtle mouse attraction / gentle deflection
          if (mouse.isHovered) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 1) {
              const force = (180 - dist) / 180;
              node.x -= (dx / dist) * force * 1.5;
              node.y -= (dy / dist) * force * 1.5;
            }
          }

          // Connect to nearby nodes
          for (let j = idx + 1; j < neuralNodes.length; j++) {
            const other = neuralNodes[j];
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 135) {
              const lineAlpha = (1 - dist / 135) * 0.22 * homeAlpha;
              const grad = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
              grad.addColorStop(0, node.color);
              grad.addColorStop(1, other.color);

              ctx.strokeStyle = grad;
              ctx.lineWidth = 1;
              ctx.globalAlpha = lineAlpha;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }

          // Draw Node Core
          const dynRadius = node.radius * (1 + Math.sin(node.pulsePhase) * 0.15);
          ctx.fillStyle = node.color;
          ctx.globalAlpha = (node.alpha * 0.8 + Math.sin(node.pulsePhase) * 0.2) * homeAlpha;
          ctx.beginPath();
          ctx.arc(node.x, node.y, dynRadius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle halo
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.15 * homeAlpha;
          ctx.beginPath();
          ctx.arc(node.x, node.y, dynRadius + 3, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Synapse Packets
        synapsePackets.forEach((p) => {
          p.progress += p.speed;
          if (p.progress > 1) {
            p.progress = 0;
            p.from = Math.floor(Math.random() * neuralNodes.length);
            p.to = Math.floor(Math.random() * neuralNodes.length);
          }

          const n1 = neuralNodes[p.from];
          const n2 = neuralNodes[p.to];
          if (n1 && n2) {
            const px = n1.x + (n2.x - n1.x) * p.progress;
            const py = n1.y + (n2.y - n1.y) * p.progress;

            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.7 * homeAlpha;
            ctx.beginPath();
            ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.restore();
      }

      // ===========================================================
      // LAYER 2: DATA STREAM (Tools Hub & Fee Estimator - Sky Blue)
      // ===========================================================
      if (weights.dataStream > 0.01) {
        ctx.save();
        const dsAlpha = weights.dataStream;

        dataStreams.forEach((stream) => {
          stream.x += Math.cos(stream.angle) * stream.speed;
          stream.y += Math.sin(stream.angle) * stream.speed;
          stream.pulse += 0.02;

          if (stream.x > width + 100 || stream.y > height + 100 || stream.y < -100) {
            stream.x = -100;
            stream.y = Math.random() * height;
            stream.speed = 3.5 + Math.random() * 6.5;
          }

          const tailX = stream.x - Math.cos(stream.angle) * stream.length;
          const tailY = stream.y - Math.sin(stream.angle) * stream.length;

          const grad = ctx.createLinearGradient(tailX, tailY, stream.x, stream.y);
          grad.addColorStop(0, 'rgba(14, 165, 233, 0)');
          grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
          grad.addColorStop(1, '#38bdf8');

          ctx.strokeStyle = grad;
          ctx.lineWidth = stream.width;
          ctx.globalAlpha = stream.alpha * dsAlpha;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(stream.x, stream.y);
          ctx.stroke();

          // Glowing Head Bullet
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = (stream.alpha + 0.2) * dsAlpha;
          ctx.beginPath();
          ctx.arc(stream.x, stream.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Live Data Telemetry Label
          if (stream.label) {
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#7dd3fc';
            ctx.globalAlpha = 0.5 * dsAlpha;
            ctx.fillText(stream.label, stream.x + 8, stream.y + 3);
          }
        });

        ctx.restore();
      }

      // ===========================================================
      // LAYER 3: MATRIX CIPHER & HEX GRID (Scripts & Vault - Emerald)
      // ===========================================================
      if (weights.matrixCipher > 0.01) {
        ctx.save();
        const mcAlpha = weights.matrixCipher;

        // Faint rigid hexagonal security grid
        const hexSize = 34;
        const hexW = hexSize * 1.732;
        const hexH = hexSize * 1.5;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5 * mcAlpha;

        for (let y = 0; y < height + hexH; y += hexH) {
          const rowIdx = Math.floor(y / hexH);
          const xOffset = (rowIdx % 2 === 0) ? 0 : hexW / 2;
          for (let x = -hexW; x < width + hexW; x += hexW) {
            drawHexagon(x + xOffset, y, hexSize);
            ctx.stroke();
          }
        }

        // Falling Matrix Binary & Cryptographic Glyph Rain
        ctx.font = '12px "JetBrains Mono", monospace';
        matrixColumns.forEach((col, colIdx) => {
          const x = colIdx * 32 + 10;
          col.y += col.speed;

          if (frame % 20 === 0 && Math.random() > 0.7) {
            const rIdx = Math.floor(Math.random() * col.chars.length);
            col.chars[rIdx] = matrixTokens[Math.floor(Math.random() * matrixTokens.length)];
          }

          col.chars.forEach((ch, rIdx) => {
            const charY = col.y - (rIdx * 16);
            if (charY > 0 && charY < height) {
              if (rIdx === 0) {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = col.alpha * 1.4 * mcAlpha;
              } else if (rIdx < 3) {
                ctx.fillStyle = '#6ee7b7';
                ctx.globalAlpha = col.alpha * 1.1 * mcAlpha;
              } else {
                ctx.fillStyle = '#10b981';
                ctx.globalAlpha = col.alpha * (1 - rIdx / col.chars.length) * mcAlpha;
              }
              ctx.fillText(ch, x, charY);
            }
          });

          if (col.y - (col.chars.length * 16) > height) {
            col.y = Math.random() * -80;
            col.speed = 0.45 + Math.random() * 0.85;
          }
        });

        ctx.restore();
      }

      // ===========================================================
      // LAYER 4: VALUE FLOW (Pricing & Pro - Deep Purple Swirling Galaxy)
      // ===========================================================
      if (weights.valueFlow > 0.01) {
        ctx.save();
        const vfAlpha = weights.valueFlow;
        const centerX = width * 0.5;
        const centerY = height * 0.42;

        // Core Ambient Galaxy Glow
        const pulse = 1 + Math.sin(frame * 0.02) * 0.1;
        const glowGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 300 * pulse);
        glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.16)');
        glowGrad.addColorStop(0.4, 'rgba(192, 132, 252, 0.06)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.globalAlpha = vfAlpha;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 300 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Orbital Concentric Rings
        [160, 240, 320, 400].forEach((r) => {
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.08)';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.6 * vfAlpha;
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Swirling Spiral Stars
        valueStars.forEach((star) => {
          star.angle += star.speed;
          const sx = centerX + Math.cos(star.angle) * star.dist;
          const sy = centerY + Math.sin(star.angle) * star.dist * 0.62;

          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * vfAlpha;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Pulsating Capital Hub Nodes
        valueNodes.forEach((node) => {
          node.angle += node.speed;
          const nx = centerX + Math.cos(node.angle) * node.orbitRadius;
          const ny = centerY + Math.sin(node.angle) * (node.orbitRadius * 0.62);

          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.85 * vfAlpha;
          ctx.beginPath();
          ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.4 * vfAlpha;
          ctx.beginPath();
          ctx.arc(nx, ny, 8.5, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#e2e8f0';
          ctx.globalAlpha = 0.65 * vfAlpha;
          ctx.fillText(node.label, nx + 12, ny + 3);
        });

        ctx.restore();
      }

      // ===========================================================
      // LAYER 5: ECOSYSTEM INTEGRATION MAP (Backers & Investors Hub - Vast Clusters)
      // ===========================================================
      if (weights.ecosystemMap > 0.01) {
        ctx.save();
        const emAlpha = weights.ecosystemMap;

        // Calculate responsive hub positions
        ecosystemHubs.forEach((hub) => {
          hub.x = width * hub.baseXRatio;
          hub.y = height * hub.baseYRatio;
        });

        // Draw Inter-Hub Constellation Arcs
        for (let i = 0; i < ecosystemHubs.length; i++) {
          for (let j = i + 1; j < ecosystemHubs.length; j++) {
            const h1 = ecosystemHubs[i];
            const h2 = ecosystemHubs[j];

            const grad = ctx.createLinearGradient(h1.x, h1.y, h2.x, h2.y);
            grad.addColorStop(0, h1.color);
            grad.addColorStop(1, h2.color);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 0.22 * emAlpha;
            ctx.beginPath();
            ctx.moveTo(h1.x, h1.y);
            ctx.lineTo(h2.x, h2.y);
            ctx.stroke();
          }
        }

        // Draw Hub Clusters & Orbiting Satellite Chains
        ecosystemHubs.forEach((hub, hIdx) => {
          const pulse = Math.sin(frame * 0.025 + hIdx) * 0.2 + 0.8;

          // Main Hub Core
          ctx.fillStyle = hub.color;
          ctx.globalAlpha = 0.85 * emAlpha;
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 6.5 * pulse, 0, Math.PI * 2);
          ctx.fill();

          // Hub Outer Shield Ring
          ctx.strokeStyle = hub.color;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.4 * emAlpha;
          ctx.beginPath();
          ctx.arc(hub.x, hub.y, 14 * pulse, 0, Math.PI * 2);
          ctx.stroke();

          // Hub Label
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f8fafc';
          ctx.globalAlpha = 0.8 * emAlpha;
          ctx.fillText(hub.name, hub.x + 18, hub.y + 4);

          // Orbiting Satellites
          hub.satellites.forEach((sat) => {
            sat.angle += sat.speed;
            const sx = hub.x + Math.cos(sat.angle) * sat.dist;
            const sy = hub.y + Math.sin(sat.angle) * (sat.dist * 0.6);

            // Connection line to hub
            ctx.strokeStyle = hub.color;
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = 0.15 * emAlpha;
            ctx.beginPath();
            ctx.moveTo(hub.x, hub.y);
            ctx.lineTo(sx, sy);
            ctx.stroke();

            // Satellite Dot
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.7 * emAlpha;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Satellite Label
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#cbd5e1';
            ctx.globalAlpha = 0.55 * emAlpha;
            ctx.fillText(sat.label, sx + 6, sy + 3);
          });
        });

        ctx.restore();
      }

      // ===========================================================
      // LAYER 6: BLUEPRINT SCHEMATIC (Docs, API, Trust & Legal - Grid & Traces)
      // ===========================================================
      if (weights.blueprintSchematic > 0.01) {
        ctx.save();
        const bpAlpha = weights.blueprintSchematic;

        // Blueprint Grid Pattern (40px)
        const gridSize = 40;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.035)';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7 * bpAlpha;

        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        const yOffset = (frame * 0.15) % gridSize;
        for (let y = yOffset - gridSize; y < height + gridSize; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Technical 90-degree Traces
        blueprintTraces.forEach((tr) => {
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

          ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.6 * bpAlpha;
          ctx.beginPath();
          ctx.moveTo(tr.startX, tr.startY);
          ctx.lineTo(tr.midX, tr.midY);
          ctx.lineTo(tr.endX, tr.endY);
          ctx.stroke();

          // Trace Pulse Head
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
          ctx.globalAlpha = 0.8 * bpAlpha;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Precision Crosshairs & Coordinate Tags
        blueprintCrosshairs.forEach((ch) => {
          ch.pulse += 0.02;
          const alpha = (0.2 + Math.sin(ch.pulse) * 0.1) * bpAlpha;

          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.globalAlpha = bpAlpha;

          ctx.beginPath();
          ctx.moveTo(ch.x - 7, ch.y);
          ctx.lineTo(ch.x + 7, ch.y);
          ctx.moveTo(ch.x, ch.y - 7);
          ctx.lineTo(ch.x, ch.y + 7);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(ch.x, ch.y, 3.5, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(148, 163, 184, ${alpha * 0.9})`;
          ctx.fillText(`${ch.code} [${Math.floor(ch.x)},${Math.floor(ch.y)}]`, ch.x + 8, ch.y - 3);
        });

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
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
      {/* 60FPS Dynamic Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-75 transition-opacity duration-1000"
      />

      {/* Subtle Readability & Contrast Gradient Overlays (Guarantees WCAG AA Text Contrast) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080b12]/75 via-[#080b12]/50 to-[#080b12]/80 pointer-events-none" />
      
      {/* Radial Vignette Lighting Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/5 blur-[180px] pointer-events-none" />
    </div>
  );
};
