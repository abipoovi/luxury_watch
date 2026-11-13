import { forwardRef } from 'react';
import { EXPLODED_COMPONENTS } from '../config/watchSequence';

interface ExplodedOverlayProps {
  activePartIndex: number;
  onSelectPart: (index: number, revealProgress: number) => void;
}

export const ExplodedOverlay = forwardRef<HTMLDivElement, ExplodedOverlayProps>(
  function ExplodedOverlay({ activePartIndex, onSelectPart }, ref) {
    const activePart = EXPLODED_COMPONENTS[activePartIndex] ?? EXPLODED_COMPONENTS[0];

    return (
      <div
        ref={ref}
        className="pointer-events-none invisible opacity-0 absolute inset-0 z-20 flex flex-col justify-between px-4 pb-5 pt-20 sm:px-8 sm:pb-8 sm:pt-22 lg:px-14"
      >
        {/* Top Header */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[10px] tracking-[0.34em] text-[#c89b5c] uppercase">
              03 · The Deconstructed Machine
            </p>
            <h2 className="mt-1 font-serif text-2xl font-light tracking-wide text-[#f5efe6] sm:text-3xl lg:text-4xl">
              Five Tiers of <span className="italic text-[#e6c697]">Indian Horology</span>
            </h2>
          </div>

          <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#e6c697] uppercase sm:inline-flex">
            <span>Scroll To Inspect Layers</span>
          </div>
        </div>

        {/* Bottom Interactive Component Selector Deck */}
        <div className="pointer-events-auto mx-auto w-full max-w-[1320px] space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0">
            {EXPLODED_COMPONENTS.map((part, idx) => {
              const isSelected = idx === activePartIndex;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => onSelectPart(idx, part.revealProgress)}
                  className={`group flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all duration-300 sm:shrink ${
                    isSelected
                      ? 'border-[#e6c697]/70 bg-[#1c150c]/90 shadow-[0_0_24px_rgba(200,155,92,0.2)]'
                      : 'border-[#c89b5c]/18 bg-[#080604]/75 hover:border-[#c89b5c]/45 hover:bg-[#120d08]/85'
                  } backdrop-blur-md`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.2em] ${
                      isSelected ? 'text-[#e6c697]' : 'text-[#9c8f7e]'
                    }`}
                  >
                    {part.indexLabel}
                  </span>
                  <span className="truncate text-[11px] font-medium tracking-wide text-[#f5efe6] sm:text-xs">
                    {part.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Layer Details Card */}
          <div className="luxury-glass flex flex-col justify-between gap-3 rounded-2xl px-4 py-3.5 sm:flex-row sm:items-center sm:px-6 sm:py-4">
            <div className="max-w-2xl space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[10px] tracking-[0.26em] text-[#c89b5c] uppercase">
                  Tier {activePart.indexLabel} · {activePart.material}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#cfc3b2] sm:text-sm">
                {activePart.detail}
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#c89b5c]/15 pt-2.5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <div>
                <p className="font-mono text-[9px] tracking-[0.25em] text-[#9c8f7e] uppercase">
                  Tolerance
                </p>
                <p className="font-mono text-xs tracking-wider text-[#e6c697]">
                  {activePart.specBadge}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
