import { forwardRef } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeroOverlayProps {
  onExploreClick: () => void;
  onExploreAbout: () => void;
}

export const HeroOverlay = forwardRef<HTMLDivElement, HeroOverlayProps>(
  function HeroOverlay({ onExploreClick, onExploreAbout }, ref) {
    return (
      <div
        ref={ref}
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between px-5 pb-8 pt-20 sm:px-8 sm:pb-12 sm:pt-24 lg:px-14 lg:py-24"
      >
        {/* Top/Left Branding Editorial Block */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center text-center md:my-auto md:items-start md:text-left">
          <div className="max-w-md space-y-4 lg:max-w-xl lg:space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#c89b5c]/35 bg-[#0a0805]/75 px-3.5 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-[#c89b5c]" />
              <span className="font-mono text-[9px] tracking-[0.35em] text-[#e6c697] uppercase sm:text-[10px]">
                Haute Horlogerie · Made in India
              </span>
            </div>

            <h1 className="font-serif text-[2.4rem] leading-[1.04] font-light tracking-[0.03em] text-[#f5efe6] sm:text-5xl lg:text-[4.2rem]">
              TIMELESS CRAFT.{' '}
              <span className="block italic text-gold-gradient">ROOTED IN INDIA.</span>
            </h1>

            <p className="text-xs leading-relaxed text-[#c4b5a0] sm:text-sm md:max-w-lg">
              A new expression of Indian luxury, crafted to transcend generations.
              Handcrafted in solid 18K rose gold and sintered black ceramic, exposing the
              openworked Calibre AU-8920.
            </p>

            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-4 pt-2 md:justify-start">
              <button
                type="button"
                onClick={onExploreAbout}
                className="rounded-full border border-[#e6c697] bg-gradient-to-r from-[#c89b5c] to-[#e6c697] px-7 py-3 font-mono text-[10px] tracking-[0.26em] text-[#050402] font-semibold uppercase shadow-[0_0_25px_rgba(200,155,92,0.3)] transition-all hover:scale-105"
              >
                About AURELIA
              </button>
              <button
                type="button"
                onClick={onExploreClick}
                className="rounded-full border border-[#c89b5c]/40 bg-[#0a0805]/70 px-6 py-3 font-mono text-[10px] tracking-[0.24em] text-[#e6c697] uppercase backdrop-blur-md transition-colors hover:border-[#e6c697] hover:bg-[#c89b5c]/15"
              >
                3D Experience
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Heritage Reference + Scroll Cue */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <div className="hidden items-center gap-6 border-l border-[#c89b5c]/35 pl-4 md:flex">
            <div>
              <p className="font-mono text-[9px] tracking-[0.26em] text-[#9c8f7e] uppercase">
                Model Reference
              </p>
              <p className="font-serif text-base tracking-wide text-[#f5efe6]">
                Kalyan Skeleton · Ref. 8920
              </p>
            </div>
            <div className="h-6 w-px bg-[#c89b5c]/20" />
            <div>
              <p className="font-mono text-[9px] tracking-[0.26em] text-[#9c8f7e] uppercase">
                Manufacture
              </p>
              <p className="font-serif text-base tracking-wide text-[#f5efe6]">
                Atelier Aurelia · India
              </p>
            </div>
            <div className="h-6 w-px bg-[#c89b5c]/20" />
            <div>
              <p className="font-mono text-[9px] tracking-[0.26em] text-[#9c8f7e] uppercase">
                Edition
              </p>
              <p className="font-serif text-base tracking-wide text-[#e6c697]">
                50 Pieces Worldwide
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExploreClick}
            className="pointer-events-auto group flex flex-col items-center gap-2 focus:outline-none sm:items-end"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#e6c697]/90 uppercase transition-colors group-hover:text-[#f5efe6]">
              Scroll to Unveil
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c89b5c]/40 bg-[#0a0805]/70 text-[#e6c697] transition-all group-hover:border-[#e6c697] group-hover:bg-[#c89b5c]/20">
              <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
            </span>
          </button>
        </div>
      </div>
    );
  }
);
