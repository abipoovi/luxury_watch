import { forwardRef, useImperativeHandle, useRef } from 'react';
import { TOTAL_FRAMES, WATCH_CHAPTERS, type ChapterId } from '../config/watchSequence';

export interface ScrollProgressRailHandle {
  updateTelemetry: (progress: number, zeroBasedFrame: number) => void;
}

interface ScrollProgressRailProps {
  activeChapter: ChapterId;
  onJumpToChapter: (chapter: ChapterId) => void;
}

export const ScrollProgressRail = forwardRef<
  ScrollProgressRailHandle,
  ScrollProgressRailProps
>(function ScrollProgressRail({ activeChapter, onJumpToChapter }, ref) {
  const barRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);

  useImperativeHandle(ref, () => ({
    updateTelemetry: (progress: number, zeroBasedFrame: number) => {
      if (barRef.current) {
        const pct = Math.max(4, Math.min(100, progress * 100));
        barRef.current.style.height = `${pct}%`;
      }
      if (frameRef.current) {
        const displayFrame = String(
          Math.min(TOTAL_FRAMES, Math.max(1, Math.round(zeroBasedFrame) + 1))
        ).padStart(3, '0');
        if (frameRef.current.textContent !== displayFrame) {
          frameRef.current.textContent = displayFrame;
        }
      }
    },
  }));

  return (
    <aside
      aria-label="Sequence progress telemetry"
      className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex xl:right-8"
    >
      {/* Chapter Vertical Markers */}
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {WATCH_CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onJumpToChapter(chapter.id)}
              className="group flex items-center gap-3 focus:outline-none"
            >
              <span
                className={`font-mono text-[10px] tracking-[0.22em] uppercase transition-all duration-300 ${
                  isActive
                    ? 'translate-x-0 text-[#e6c697] opacity-100'
                    : 'translate-x-1 text-[#9c8f7e] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
              >
                {chapter.title}
              </span>
              <span
                className={`block h-px transition-all duration-300 ${
                  isActive
                    ? 'w-7 bg-[#e6c697]'
                    : 'w-3.5 bg-[#9c8f7e]/45 group-hover:w-5 group-hover:bg-[#c89b5c]'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Vertical Progress Track */}
      <div className="relative h-24 w-px bg-[#c89b5c]/20">
        <div
          ref={barRef}
          className="absolute inset-x-0 top-0 bg-[#e6c697]"
          style={{ height: '4%' }}
        />
      </div>

      {/* Frame Telemetry */}
      <div className="text-right font-mono text-[10px] tracking-[0.22em] text-[#9c8f7e] tabular-nums">
        <span ref={frameRef} className="text-[#e6c697]">
          001
        </span>
        <span className="mx-1 text-[#9c8f7e]/50">/</span>
        <span>{TOTAL_FRAMES}</span>
      </div>
    </aside>
  );
});
