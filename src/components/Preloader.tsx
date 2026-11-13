import { useEffect, useState } from 'react';

interface PreloaderProps {
  isReady: boolean;
  progress: number;
}

export function Preloader({ isReady, progress }: PreloaderProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const fadeTimer = window.setTimeout(() => setFadingOut(true), 220);
    const unmountTimer = window.setTimeout(() => setShouldRender(false), 950);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [isReady]);

  if (!shouldRender) return null;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, progress) / 100) * circumference;

  return (
    <div
      aria-hidden={fadingOut}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050402] transition-opacity duration-700 ease-out ${
        fadingOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      {/* Warm ambient studio glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(200, 155, 92, 0.08) 0%, rgba(5, 4, 2, 0) 60%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-7 px-6 text-center">
        {/* Precision SVG Escapement Ring */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80" fill="none">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="rgba(200, 155, 92, 0.16)"
              strokeWidth="1"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#c89b5c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          <span className="font-mono text-[11px] tracking-[0.22em] text-[#e6c697]">
            {String(Math.min(100, progress)).padStart(2, '0')}%
          </span>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[10px] tracking-[0.42em] text-[#c89b5c] uppercase">
            AURELIA · Haute Horlogerie India
          </p>
          <h2 className="font-serif text-2xl font-light tracking-[0.08em] text-[#f5efe6] sm:text-3xl">
            Calibre AU-8920
          </h2>
          <p className="text-xs tracking-[0.18em] text-[#9c8f7e] uppercase">
            Preparing Optical Frame Sequence
          </p>
        </div>
      </div>
    </div>
  );
}
