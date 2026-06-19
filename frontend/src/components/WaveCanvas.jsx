import { useEffect, useRef } from 'react';

export default function WaveCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);

    const waves = [
      { color: '#00d4ff', speed: 0.0015, amplitude: 10, frequency: 0.008, yOffset: 0.3, phase: 0 },
      { color: '#a855f7', speed: 0.001, amplitude: 12, frequency: 0.006, yOffset: 0.5, phase: 2 },
      { color: '#ec4899', speed: 0.0012, amplitude: 8, frequency: 0.01, yOffset: 0.7, phase: 4 },
      { color: '#fbbf24', speed: 0.0008, amplitude: 10, frequency: 0.007, yOffset: 0.4, phase: 1 },
      { color: '#3b82f6', speed: 0.001, amplitude: 9, frequency: 0.009, yOffset: 0.6, phase: 3 },
    ];

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      waves.forEach((wave) => {
        const baseY = wave.yOffset * h;

        // Draw thin ribbon stroke only (no fill)
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y =
            baseY +
            Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.8 + wave.phase) * (wave.amplitude * 0.3);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      time += 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        borderRadius: 'inherit',
        pointerEvents: 'none',
      }}
    />
  );
}
